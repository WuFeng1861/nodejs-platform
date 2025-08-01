import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 启用全局验证管道
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  // 启用全局响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 配置Swagger文档
  const config = new DocumentBuilder()
    .setTitle('Node.js 代码执行平台')
    .setDescription('一个用于上传、管理和执行Node.js代码的平台API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 启用CORS
  app.enableCors();

  await app.listen(62999);
  console.log('🚀 服务器已启动在端口 62999');
  console.log('📚 API文档地址: http://localhost:62999/api');
}
bootstrap();
