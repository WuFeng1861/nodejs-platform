import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Code } from './entities/code.entity';
import { CreateCodeDto } from './dto/create-code.dto';
import { ExecuteCodeDto } from './dto/execute-code.dto';
import { ExecuteResultDto } from './dto/execute-result.dto';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class CodeService {
  private readonly tempDir = path.join(process.cwd(), 'temp');

  constructor(
    @InjectRepository(Code)
    private codeRepository: Repository<Code>,
  ) {
    // 确保临时目录存在
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  /**
   * 创建新的代码记录
   */
  async create(createCodeDto: CreateCodeDto): Promise<Code> {
    // 验证参数配置格式
    if (createCodeDto.parameters) {
      try {
        JSON.parse(createCodeDto.parameters);
      } catch (error) {
        throw new BadRequestException('参数配置必须是有效的JSON格式');
      }
    }

    const code = this.codeRepository.create({
      ...createCodeDto,
      language: createCodeDto.language || 'javascript',
    });

    return this.codeRepository.save(code);
  }

  /**
   * 获取所有代码列表
   * @param includeContent 是否包含代码内容（特殊密码可以获取）
   */
  async findAll(includeContent: boolean = false): Promise<Partial<Code>[]> {
    const queryBuilder = this.codeRepository.createQueryBuilder('code');
    
    if (includeContent) {
      queryBuilder.select([
        'code.id',
        'code.title', 
        'code.description',
        'code.content',
        'code.language',
        'code.parameters',
        'code.executeCount',
        'code.createdAt',
        'code.updatedAt'
      ]);
    } else {
      queryBuilder.select([
        'code.id',
        'code.title',
        'code.description',
        'code.language', 
        'code.parameters',
        'code.executeCount',
        'code.createdAt',
        'code.updatedAt'
      ]);
    }

    return queryBuilder.getMany();
  }

  /**
   * 根据ID查找代码
   */
  async findOne(id: number): Promise<Code> {
    const code = await this.codeRepository.findOne({ where: { id } });
    if (!code) {
      throw new NotFoundException(`ID为${id}的代码不存在`);
    }
    return code;
  }

  /**
   * 执行指定ID的代码
   */
  async executeCode(id: number, executeCodeDto?: ExecuteCodeDto): Promise<ExecuteResultDto> {
    const code = await this.findOne(id);
    
    const startTime = Date.now();
    const fileName = `code_${id}_${Date.now()}.js`;
    const filePath = path.join(this.tempDir, fileName);

    try {
      // 准备代码内容，如果有参数则注入参数
      let codeContent = code.content;
      
      if (executeCodeDto?.params) {
        // 在代码前面注入参数
        const paramsCode = `
// 注入的执行参数
const params = ${JSON.stringify(executeCodeDto.params, null, 2)};

`;
        codeContent = paramsCode + codeContent;
      }

      // 将代码写入临时文件
      fs.writeFileSync(filePath, codeContent, 'utf8');

      // 执行代码
      const { stdout, stderr } = await execAsync(`node "${filePath}"`, {
        timeout: 300*1000, // 300秒超时
        cwd: this.tempDir,
      });

      const executionTime = Date.now() - startTime;

      // 更新执行次数
      await this.codeRepository.update(id, {
        executeCount: code.executeCount + 1,
      });

      return {
        success: true,
        output: stdout,
        error: stderr || undefined,
        executionTime,
        exitCode: 0,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      return {
        success: false,
        output: error.stdout || '',
        error: error.stderr || error.message,
        executionTime,
        exitCode: error.code || 1,
      };
    } finally {
      // 清理临时文件
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (cleanupError) {
        console.warn('清理临时文件失败:', cleanupError.message);
      }
    }
  }

  /**
   * 删除代码
   */
  async remove(id: number): Promise<void> {
    const result = await this.codeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`ID为${id}的代码不存在`);
    }
  }
}
