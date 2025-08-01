import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InstallPackageDto {
  @ApiProperty({ description: 'npm包名称', example: 'lodash' })
  @IsString({ message: '包名称必须是字符串' })
  @IsNotEmpty({ message: '包名称不能为空' })
  @Matches(/^[@\w\-\.\/]+$/, { message: '包名称格式不正确' })
  packageName: string;

  @ApiProperty({ description: '版本号（可选）', example: '4.17.21', required: false })
  @IsString({ message: '版本号必须是字符串' })
  version?: string;
}