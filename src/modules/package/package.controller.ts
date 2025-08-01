import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PackageService } from './package.service';
import { PackageInfoDto } from './dto/package-info.dto';
import { InstallPackageDto } from './dto/install-package.dto';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('包管理')
@Controller('api/packages')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get()
  @ApiOperation({ summary: '获取已安装的npm包列表' })
  @ApiResponse({ status: 200, description: '获取包列表成功', type: [PackageInfoDto] })
  async getInstalledPackages(): Promise<PackageInfoDto[]> {
    return this.packageService.getInstalledPackages();
  }

  @Get(':packageName/check')
  @ApiOperation({ summary: '检查指定包是否已安装' })
  @ApiResponse({ status: 200, description: '检查包状态成功', type: PackageInfoDto })
  async checkPackage(@Param('packageName') packageName: string): Promise<PackageInfoDto> {
    return this.packageService.isPackageInstalled(packageName);
  }

  @Get(':packageName/info')
  @ApiOperation({ summary: '获取npm包的详细信息' })
  @ApiResponse({ status: 200, description: '获取包信息成功' })
  async getPackageInfo(@Param('packageName') packageName: string): Promise<any> {
    return this.packageService.getPackageInfo(packageName);
  }

  @Post('install')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '安装指定的npm包' })
  @ApiResponse({ status: 201, description: '包安装成功' })
  async installPackage(@Body() installPackageDto: InstallPackageDto): Promise<{
    success: boolean;
    message: string;
    packageInfo?: PackageInfoDto;
  }> {
    return this.packageService.installPackage(installPackageDto);
  }

  @Delete(':packageName')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '卸载指定的npm包' })
  @ApiResponse({ status: 200, description: '包卸载成功' })
  async uninstallPackage(@Param('packageName') packageName: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.packageService.uninstallPackage(packageName);
  }
}