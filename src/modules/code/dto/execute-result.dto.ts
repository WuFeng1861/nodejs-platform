import { ApiProperty } from '@nestjs/swagger';

export class ExecuteResultDto {
  @ApiProperty({ description: '执行状态' })
  success: boolean;

  @ApiProperty({ description: '执行输出' })
  output: string;

  @ApiProperty({ description: '错误信息' })
  error?: string;

  @ApiProperty({ description: '执行时间(毫秒)' })
  executionTime: number;

  @ApiProperty({ description: '退出码' })
  exitCode?: number;
}