import { Injectable, BadRequestException } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { PackageInfoDto } from './dto/package-info.dto';
import { InstallPackageDto } from './dto/install-package.dto';

const execAsync = promisify(exec);

@Injectable()
export class PackageService {
  private readonly packageJsonPath = path.join(process.cwd(), 'package.json');

  /**
   * 获取已安装包的列表
   */
  async getInstalledPackages(): Promise<PackageInfoDto[]> {
    try {
      const { stdout } = await execAsync('npm list --json --depth=0');
      const result = JSON.parse(stdout);
      
      const packages: PackageInfoDto[] = [];
      
      if (result.dependencies) {
        Object.entries(result.dependencies).forEach(([name, info]: [string, any]) => {
          packages.push({
            name,
            version: info.version,
            installed: true,
            description: info.description,
          });
        });
      }
      
      const { stdout: globalStdout } = await execAsync('npm list -g --json --depth=0');
      const globalResult = JSON.parse(globalStdout);
      
      if (globalResult.dependencies) {
        Object.entries(globalResult.dependencies).forEach(([name, info]: [string, any]) => {
          // 检查是否已经存在本地包，避免重复
          const existingPackage = packages.find(pkg => pkg.name === name);
          if (!existingPackage) {
            packages.push({
              name,
              version: info.version,
              installed: true,
              description: info.description,
            });
          }
        });
      }

      return packages;
    } catch (error) {
      console.error('获取已安装包列表失败:', error.message);
      return [];
    }
  }

  /**
   * 检查指定包是否已安装
   */
  async isPackageInstalled(packageName: string): Promise<PackageInfoDto> {
    try {
      const { stdout } = await execAsync(`npm list ${packageName} --json`);
      const result = JSON.parse(stdout);
      
      if (result.dependencies && result.dependencies[packageName]) {
        const packageInfo = result.dependencies[packageName];
        return {
          name: packageName,
          version: packageInfo.version,
          installed: true,
          description: packageInfo.description,
        };
      }
    } catch (error) {
      // 包未安装时npm list会返回非零退出码
    }

    return {
      name: packageName,
      version: 'unknown',
      installed: false,
    };
  }

  /**
   * 安装指定的npm包
   */
  async installPackage(installPackageDto: InstallPackageDto): Promise<{
    success: boolean;
    message: string;
    packageInfo?: PackageInfoDto;
  }> {
    const { packageName, version } = installPackageDto;
    const packageWithVersion = version ? `${packageName}@${version}` : packageName;

    try {
      console.log(`开始安装包: ${packageWithVersion}`);
      
      const { stdout, stderr } = await execAsync(
        `npm install ${packageWithVersion} -g`,
        { timeout: 120000 } // 2分钟超时
      );

      // 安装成功后获取包信息
      const packageInfo = await this.isPackageInstalled(packageName);

      return {
        success: true,
        message: `包 ${packageWithVersion} 安装成功`,
        packageInfo,
      };
    } catch (error) {
      console.error(`安装包失败: ${packageWithVersion}`, error.message);
      
      return {
        success: false,
        message: `安装包失败: ${error.stderr || error.message}`,
      };
    }
  }

  /**
   * 卸载指定的npm包
   */
  async uninstallPackage(packageName: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // 先检查包是否已安装
      const packageInfo = await this.isPackageInstalled(packageName);
      if (!packageInfo.installed) {
        return {
          success: false,
          message: `包 ${packageName} 未安装`,
        };
      }

      console.log(`开始卸载包: ${packageName}`);
      
      const { stdout, stderr } = await execAsync(
        `npm uninstall ${packageName}`,
        { timeout: 60000 } // 1分钟超时
      );

      return {
        success: true,
        message: `包 ${packageName} 卸载成功`,
      };
    } catch (error) {
      console.error(`卸载包失败: ${packageName}`, error.message);
      
      return {
        success: false,
        message: `卸载包失败: ${error.stderr || error.message}`,
      };
    }
  }

  /**
   * 获取npm包的信息（从npm registry）
   */
  async getPackageInfo(packageName: string): Promise<any> {
    try {
      const { stdout } = await execAsync(`npm view ${packageName} --json`);
      return JSON.parse(stdout);
    } catch (error) {
      throw new BadRequestException(`获取包信息失败: ${error.message}`);
    }
  }
}
