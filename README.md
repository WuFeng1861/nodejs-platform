# Node.js 代码执行平台

一个基于 NestJS 和 MySQL 的 Node.js 代码上传、管理和执行平台。

## 功能特性

- 🚀 **代码管理**: 上传、存储和管理 Node.js 代码片段
- 🔐 **安全验证**: 密码保护的API接口
- ⚡ **代码执行**: 安全的远程代码执行环境
- 📦 **包管理**: npm包的查看、安装和卸载
- 📚 **API文档**: 完整的 Swagger API 文档
- 🎯 **统一响应**: 标准化的API响应格式

## 技术栈

- **后端框架**: NestJS
- **数据库**: MySQL + TypeORM
- **验证**: class-validator
- **文档**: Swagger/OpenAPI
- **运行时**: Node.js

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- MySQL >= 5.7
- npm >= 7.0.0

### 安装依赖

```bash
npm install
```

### 数据库配置

1. 创建 MySQL 数据库：
```sql
CREATE DATABASE nodejs_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 修改 `src/app.module.ts` 中的数据库配置：
```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'your_username', // 修改为你的用户名
  password: 'your_password', // 修改为你的密码
  database: 'nodejs_platform',
  // ...其他配置
})
```

### 启动服务

```bash
# 开发模式
npm run start:dev

# 生产模式
npm run start:prod
```

服务将在 `http://localhost:3000` 启动。

### API 文档

启动服务后，访问 `http://localhost:3000/api` 查看完整的 API 文档。

## API 接口

### 认证

所有需要认证的接口都需要在请求头中添加：
```
Authorization: Bearer <password>
```

支持的密码：
- `admin123` - 普通管理密码
- `wufeng-nodejs-platform` - 特殊密码（可获取完整代码内容）

### 主要接口

#### 代码管理

- `POST /api/codes` - 上传代码（需认证）
- `GET /api/codes` - 获取代码列表（需认证）
- `GET /api/codes/:id` - 获取代码详情（需认证）
- `POST /api/codes/:id/execute` - 执行代码（无需认证）
- `DELETE /api/codes/:id` - 删除代码（需认证）

#### 包管理

- `GET /api/packages` - 获取已安装包列表
- `GET /api/packages/:name/check` - 检查包是否已安装
- `GET /api/packages/:name/info` - 获取包详细信息
- `POST /api/packages/install` - 安装包（需认证）
- `DELETE /api/packages/:name` - 卸载包（需认证）

## 使用示例

### 上传代码

```bash
curl -X POST http://localhost:3000/api/codes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin123" \
  -d '{
    "title": "Hello World",
    "description": "一个简单的Hello World程序",
    "content": "console.log(\"Hello, World!\");"
  }'
```

### 执行代码

```bash
curl -X POST http://localhost:3000/api/codes/1/execute
```

### 安装npm包

```bash
curl -X POST http://localhost:3000/api/packages/install \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin123" \
  -d '{
    "packageName": "lodash",
    "version": "4.17.21"
  }'
```

## 安全特性

- 🔒 密码保护的管理接口
- ⏱️ 代码执行超时限制（30秒）
- 🗂️ 临时文件自动清理
- 📝 输入验证和数据清理
- 🚫 SQL注入防护

## 目录结构

```
src/
├── common/           # 通用组件
│   ├── decorators/   # 装饰器
│   ├── guards/       # 守卫
│   ├── interceptors/ # 拦截器
│   └── exceptions/   # 异常过滤器
├── modules/          # 功能模块
│   ├── code/         # 代码管理模块
│   └── package/      # 包管理模块
└── main.ts           # 应用入口
```

## 开发

### 运行测试

```bash
npm run test
```

### 代码格式化

```bash
npm run format
```

### 构建

```bash
npm run build
```

## 许可证

MIT License