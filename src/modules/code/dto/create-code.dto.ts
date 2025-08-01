import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCodeDto {
  @ApiProperty({ description: '代码标题', maxLength: 200 })
  @IsString({ message: '标题必须是字符串' })
  @IsNotEmpty({ message: '标题不能为空' })
  @MaxLength(200, { message: '标题长度不能超过200字符' })
  title: string;

  @ApiProperty({ description: '代码简介', maxLength: 1000 })
  @IsString({ message: '简介必须是字符串' })
  @IsNotEmpty({ message: '简介不能为空' })
  @MaxLength(1000, { message: '简介长度不能超过1000字符' })
  description: string;

  @ApiProperty({ description: 'Node.js代码内容' })
  @IsString({ message: '代码内容必须是字符串' })
  @IsNotEmpty({ message: '代码内容不能为空' })
  content: string;

  @ApiProperty({ description: '编程语言', default: 'javascript', required: false })
  @IsOptional()
  @IsString({ message: '语言必须是字符串' })
  language?: string;

  @ApiProperty({ 
    description: '代码参数配置（JSON格式）', 
    example: '{"name": "参数名", "type": "string", "description": "参数描述", "required": true}',
    required: false 
  })
  @IsOptional()
  @IsString({ message: '参数配置必须是字符串' })
  parameters?: string;
}