# ls-base-lib

基于纯JavaScript和CSS的工具库，无框架依赖，支持UMD和ES模块格式。

A library with no framework dependencies that encapsulates pure native JS and CSS. Supports both UMD and ES module formats.

## 安装 | Installation

使用 npm | Using npm:
```bash
npm install ls-base-lib
```

## 功能特点 | Features

- 框架无关 - 不依赖Vue等框架 | Framework independent - no Vue or other framework dependencies
- 纯原生JavaScript和CSS工具 | Pure native JavaScript and CSS utilities
- 完整的TypeScript类型支持 | Full TypeScript type definitions
- 支持UMD和ES模块格式 | Supports both UMD and ES module formats

## 主要组件 | Main Components

1. **AwaitTo** - 异步/等待错误处理工具 | Async/await error handling utilities
2. **EventDispatcher** - 事件管理系统 | Event management system
3. **Verify** - 数据验证工具 | Data validation utilities
4. **WebSocketLinker** - WebSocket连接管理 | WebSocket connection management
5. **实用工具函数 | Utility Functions**
   - 数组工具 | Array utilities
   - 文档工具 | Document utilities
   - 函数工具 | Function utilities
   - 图像工具 | Image utilities
   - 字符串工具 | String utilities
   - 树形结构工具 | Tree utilities
   - Vue工具 (可选) | Vue utilities (optional)

## 文档 | Documentation

详细API文档请访问 | For detailed API documentation, visit:
[API Documentation](https://hackeriori.github.io/ls-base-lib/modules/index.html)

## 使用示例 | Usage Examples

```typescript
// ES模块导入 | ES Module import
import { Verify, EventDispatcher } from 'ls-base-lib';

// CommonJS导入 | CommonJS require
const lsBaseLib = require('ls-base-lib');
```

## 开发 | Development

```bash
# 启动开发服务器 | Start development server
npm run dev

# 构建库 | Build library
npm run buildLib

# 构建文档 | Build documentation
npm run buildHtml

# 构建CSS | Build CSS
npm run buildCss

# 运行测试 | Run tests
npm run test
```

## 许可证 | License

本项目基于MIT许可证开源。 | This project is licensed under the MIT License.

## 代码仓库 | Repository

[GitHub Repository](https://github.com/hackeriori/ls-base-lib)

## 项目主页 | Homepage

[Project Homepage](https://hackeriori.github.io/ls-base-lib)

## 示例代码 | Demos

[在线示例 | Live Demos](https://hackeriori.github.io/ls-base-lib/demo/)
