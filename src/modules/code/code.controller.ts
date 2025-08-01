import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CodeService } from './code.service';
import { CreateCodeDto } from './dto/create-code.dto';
import { ExecuteCodeDto } from './dto/execute-code.dto';
import { ExecuteResultDto } from './dto/execute-result.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Code } from './entities/code.entity';

@ApiTags('代码管理')
@Controller('api/codes')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '上传代码' })
  @ApiResponse({ status: 201, description: '代码上传成功', type: Code })
  async create(@Body() createCodeDto: CreateCodeDto): Promise<Code> {
    return this.codeService.create(createCodeDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取所有代码列表' })
  @ApiResponse({ status: 200, description: '获取代码列表成功' })
  async findAll(@Req() req: any): Promise<Partial<Code>[]> {
    // 如果使用特殊密码，则返回包含代码内容的完整信息
    const includeContent = req.password === 'wufeng-nodejs-platform';
    return this.codeService.findAll(includeContent);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '根据ID获取代码详情' })
  @ApiResponse({ status: 200, description: '获取代码详情成功', type: Code })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Code> {
    return this.codeService.findOne(id);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: '执行指定ID的代码' })
  @ApiResponse({ status: 200, description: '代码执行完成', type: ExecuteResultDto })
  async executeCode(
    @Param('id', ParseIntPipe) id: number,
    @Body() executeCodeDto?: ExecuteCodeDto,
  ): Promise<ExecuteResultDto> {
    return this.codeService.executeCode(id, executeCodeDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除代码' })
  @ApiResponse({ status: 200, description: '代码删除成功' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.codeService.remove(id);
    return { message: '代码删除成功' };
  }
}