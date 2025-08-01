# Node.js 代码执行平台 API 文档

## 概述

Node.js 代码执行平台是一个基于 NestJS 和 MySQL 的后端服务，提供代码上传、管理、执行和npm包管理功能。

- **基础URL**: `http://localhost:62999`
- **API文档**: `http://localhost:62999/api`
- **数据格式**: JSON
- **字符编码**: UTF-8

## 统一响应格式

所有API接口都返回统一的JSON格式：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}, // 具体数据
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 认证机制

需要认证的接口需要在请求头中添加：

```
Authorization: Bearer <password>
```

**支持的密码**：
- `admin123` - 普通管理密码
- `wufeng-nodejs-platform` - 特殊密码（可获取完整代码内容）

## 代码管理接口

### 1. 上传代码

**接口地址**: `POST /api/codes`

**需要认证**: 是

**请求参数**:
```json
{
  "title": "代码标题",
  "description": "代码简介",
  "content": "console.log('Hello World');",
  "language": "javascript", // 可选，默认为javascript
  "parameters": "{\"name\": {\"type\": \"string\", \"description\": \"用户名\", \"required\": true}}" // 可选，参数配置
}
```

**参数说明**:
- `title` (string, 必填): 代码标题，最大长度200字符
- `description` (string, 必填): 代码简介，最大长度1000字符
- `content` (string, 必填): Node.js代码内容
- `language` (string, 可选): 编程语言，默认为javascript
- `parameters` (string, 可选): 参数配置，JSON格式字符串，定义代码所需的参数

**响应示例**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "title": "Hello World示例",
    "description": "一个简单的Hello World程序",
    "content": "console.log('Hello World');",
    "language": "javascript",
    "parameters": "{\"name\": {\"type\": \"string\", \"description\": \"用户名\", \"required\": true}}",
    "executeCount": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**请求示例**:
```bash
curl -X POST http://localhost:3000/api/codes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin123" \
  -d '{
    "title": "Hello World示例",
    "description": "一个简单的Hello World程序",
    "content": "console.log(\"Hello World\");",
    "parameters": "{\"name\": {\"type\": \"string\", \"description\": \"用户名\", \"required\": true}}"
  }'
```

### 2. 获取代码列表

**接口地址**: `GET /api/codes`

**需要认证**: 是

**特殊说明**: 
- 使用普通密码 `admin123`：返回代码列表但不包含代码内容
- 使用特殊密码 `wufeng-nodejs-platform`：返回包含代码内容的完整信息

**响应示例（普通密码）**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "title": "Hello World示例",
      "description": "一个简单的Hello World程序",
      "language": "javascript",
      "parameters": "{\"name\": {\"type\": \"string\", \"description\": \"用户名\", \"required\": true}}",
      "executeCount": 5,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**响应示例（特殊密码）**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "title": "Hello World示例",
      "description": "一个简单的Hello World程序",
      "content": "console.log('Hello World');",
      "language": "javascript",
      "parameters": "{\"name\": {\"type\": \"string\", \"description\": \"用户名\", \"required\": true}}",
      "executeCount": 5,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**请求示例**:
```bash
# 普通密码
curl -X GET http://localhost:3000/api/codes \
  -H "Authorization: Bearer admin123"

# 特殊密码（可获取代码内容）
curl -X GET http://localhost:3000/api/codes \
  -H "Authorization: Bearer wufeng-nodejs-platform"
```

### 3. 获取代码详情

**接口地址**: `GET /api/codes/:id`

**需要认证**: 是

**路径参数**:
- `id` (number): 代码ID

**响应示例**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "title": "Hello World示例",
    "description": "一个简单的Hello World程序",
    "content": "console.log('Hello World');",
    "language": "javascript",
    "parameters": "{\"name\": {\"type\": \"string\", \"description\": \"用户名\", \"required\": true}}",
    "executeCount": 5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**请求示例**:
```bash
curl -X GET http://localhost:3000/api/codes/1 \
  -H "Authorization: Bearer admin123"
```

### 4. 执行代码

**接口地址**: `POST /api/codes/:id/execute`

**需要认证**: 否

**路径参数**:
- `id` (number): 代码ID

**请求参数**（可选）:
```json
{
  "params": {
    "name": "张三",
    "age": 25,
    "debug": true
  }
}
```

**参数说明**:
- `params` (object, 可选): 执行参数，将作为 `params` 变量注入到代码中

**响应示例（成功）**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "success": true,
    "output": "Hello World\n",
    "executionTime": 125,
    "exitCode": 0
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**响应示例（失败）**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "success": false,
    "output": "",
    "error": "ReferenceError: undefinedVariable is not defined",
    "executionTime": 89,
    "exitCode": 1
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**响应字段说明**:
- `success` (boolean): 执行是否成功
- `output` (string): 程序输出内容
- `error` (string): 错误信息（如果有）
- `executionTime` (number): 执行时间（毫秒）
- `exitCode` (number): 程序退出码

**请求示例**:
```bash
# 不带参数执行
curl -X POST http://localhost:3000/api/codes/1/execute

# 带参数执行
curl -X POST http://localhost:3000/api/codes/1/execute \
  -H "Content-Type: application/json" \
  -d '{
    "params": {
      "name": "张三",
      "age": 25,
      "debug": true
    }
  }'
```

### 5. 删除代码

**接口地址**: `DELETE /api/codes/:id`

**需要认证**: 是

**路径参数**:
- `id` (number): 代码ID

**响应示例**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "message": "代码删除成功"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**请求示例**:
```bash
curl -X DELETE http://localhost:3000/api/codes/1 \
  -H "Authorization: Bearer admin123"
```

## 包管理接口

### 1. 获取已安装包列表

**接口地址**: `GET /api/packages`

**需要认证**: 否

**响应示例**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "name": "lodash",
      "version": "4.17.21",
      "installed": true,
      "description": "Lodash modular utilities."
    },
    {
      "name": "axios",
      "version": "1.6.0",
      "installed": true,
      "description": "Promise based HTTP client for the browser and node.js"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**请求示例**:
```bash
curl -X GET http://localhost:3000/api/packages
```

### 2. 检查包是否已安装

**接口地址**: `GET /api/packages/:packageName/check`

**需要认证**: 否

**路径参数**:
- `packageName` (string): npm包名称

**响应示例（已安装）**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "name": "lodash",
    "version": "4.17.21",
    "installed": true,
    "description": "Lodash modular utilities."
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**响应示例（未安装）**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "name": "some-package",
    "version": "unknown",
    "installed": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**请求示例**:
```bash
curl -X GET http://localhost:3000/api/packages/lodash/check
```

### 3. 获取包详细信息

**接口地址**: `GET /api/packages/:packageName/info`

**需要认证**: 否

**路径参数**:
- `packageName` (string): npm包名称

**响应示例**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "name": "lodash",
    "version": "4.17.21",
    "description": "Lodash modular utilities.",
    "main": "lodash.js",
    "homepage": "https://lodash.com/",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/lodash/lodash.git"
    },
    "keywords": ["modules", "stdlib", "util"],
    "author": "John-David Dalton",
    "license": "MIT"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**请求示例**:
```bash
curl -X GET http://localhost:3000/api/packages/lodash/info
```

### 4. 安装npm包

**接口地址**: `POST /api/packages/install`

**需要认证**: 是

**请求参数**:
```json
{
  "packageName": "lodash",
  "version": "4.17.21" // 可选，不指定则安装最新版本
}
```

**参数说明**:
- `packageName` (string, 必填): npm包名称
- `version` (string, 可选): 指定版本号

**响应示例（成功）**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "success": true,
    "message": "包 lodash@4.17.21 安装成功",
    "packageInfo": {
      "name": "lodash",
      "version": "4.17.21",
      "installed": true,
      "description": "Lodash modular utilities."
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**响应示例（失败）**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "success": false,
    "message": "安装包失败: Package not found"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**请求示例**:
```bash
# 安装最新版本
curl -X POST http://localhost:3000/api/packages/install \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin123" \
  -d '{
    "packageName": "lodash"
  }'

# 安装指定版本
curl -X POST http://localhost:3000/api/packages/install \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin123" \
  -d '{
    "packageName": "lodash",
    "version": "4.17.21"
  }'
```

### 5. 卸载npm包

**接口地址**: `DELETE /api/packages/:packageName`

**需要认证**: 是

**路径参数**:
- `packageName` (string): npm包名称

**响应示例（成功）**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "success": true,
    "message": "包 lodash 卸载成功"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**响应示例（失败）**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "success": false,
    "message": "包 some-package 未安装"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**请求示例**:
```bash
curl -X DELETE http://localhost:3000/api/packages/lodash \
  -H "Authorization: Bearer admin123"
```

## 错误响应

当请求出现错误时，API会返回相应的错误信息：

### 认证错误 (401)
```json
{
  "code": 401,
  "message": "密码错误",
  "data": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 资源不存在 (404)
```json
{
  "code": 404,
  "message": "ID为1的代码不存在",
  "data": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 参数验证错误 (400)
```json
{
  "code": 400,
  "message": "标题不能为空; 简介不能为空",
  "data": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 服务器内部错误 (500)
```json
{
  "code": 500,
  "message": "服务器内部错误",
  "data": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 使用示例

### 完整的代码上传和执行流程

1. **上传代码**:
```bash
curl -X POST http://localhost:3000/api/codes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin123" \
  -d '{
    "title": "计算斐波那契数列",
    "description": "递归计算斐波那契数列的第n项",
    "content": "function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconst n = params.n || 10;\nconsole.log(`第${n}项:`, fibonacci(n));",
    "parameters": "{\"n\": {\"type\": \"number\", \"description\": \"计算第几项\", \"required\": false, \"default\": 10}}"
  }'
```

2. **获取代码列表**:
```bash
curl -X GET http://localhost:3000/api/codes \
  -H "Authorization: Bearer admin123"
```

3. **执行代码（带参数）**:
```bash
curl -X POST http://localhost:3000/api/codes/1/execute \
  -H "Content-Type: application/json" \
  -d '{
    "params": {
      "n": 15
    }
  }'
```

### npm包管理流程

1. **检查包是否已安装**:
```bash
curl -X GET http://localhost:3000/api/packages/moment/check
```

2. **安装包**:
```bash
curl -X POST http://localhost:3000/api/packages/install \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin123" \
  -d '{
    "packageName": "moment"
  }'
```

3. **使用已安装的包执行代码**:
```bash
curl -X POST http://localhost:3000/api/codes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin123" \
  -d '{
    "title": "使用moment.js",
    "description": "使用moment.js格式化当前时间",
    "content": "const moment = require(\"moment\");\nconst format = params.format || \"YYYY-MM-DD HH:mm:ss\";\nconsole.log(\"当前时间:\", moment().format(format));",
    "parameters": "{\"format\": {\"type\": \"string\", \"description\": \"时间格式\", \"required\": false, \"default\": \"YYYY-MM-DD HH:mm:ss\"}}"
  }'
```

4. **执行带参数的代码**:
```bash
curl -X POST http://localhost:3000/api/codes/2/execute \
  -H "Content-Type: application/json" \
  -d '{
    "params": {
      "format": "YYYY年MM月DD日 HH:mm:ss"
    }
  }'
```

## 安全注意事项

1. **密码保护**: 所有管理接口都需要密码验证
2. **执行超时**: 代码执行有300秒超时限制
3. **临时文件**: 执行完成后自动清理临时文件
4. **输入验证**: 所有输入都经过严格验证
5. **错误处理**: 完善的错误处理和日志记录

## 技术规格

- **框架**: NestJS
- **数据库**: MySQL + TypeORM
- **认证**: 密码验证
- **文档**: Swagger/OpenAPI
- **运行时**: Node.js
- **API风格**: RESTful

## 联系信息

如有问题或建议，请联系开发团队。
