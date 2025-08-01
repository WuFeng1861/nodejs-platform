import { ApiProperty } from '@nestjs/swagger';

export class PackageInfoDto {
  @ApiProperty({ description: '包名称' })
  name: string;

  @ApiProperty({ description: '版本号' })
  version: string;

  @ApiProperty({ description: '是否已安装' })
  installed: boolean;

  @ApiProperty({ description: '包描述' })
  description?: string;
}