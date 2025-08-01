import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeModule } from './modules/code/code.module';
import { PackageModule } from './modules/package/package.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '666666', // 请根据实际情况修改
      database: 'nodejs_platform',
      autoLoadEntities: true,
      synchronize: true, // 生产环境中应设置为false
      logging: true,
    }),
    CodeModule,
    PackageModule,
  ],
})
export class AppModule {}
