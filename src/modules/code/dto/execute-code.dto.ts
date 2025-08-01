import { IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExecuteCodeDto {
  @ApiProperty({ 
    description: '执行参数（JSON对象）', 
    example: { name: 'John', age: 25, debug: true },
    required: false 
  })
  @IsOptional()
  @IsObject({ message: '执行参数必须是对象' })
  params?: Record<string, any>;
}