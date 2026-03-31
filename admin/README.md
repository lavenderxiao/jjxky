# 经济学考研AI助手 - 后台管理系统

基于 React + TypeScript + Ant Design 的现代化管理后台。

## 功能模块

### ✅ 已实现

1. **用户认证**
   - 登录/登出
   - 会话管理
   - 权限控制

2. **数据概览**
   - 统计卡片
   - 数据可视化

3. **系统配置**
   - 智能体配置
   - 系统参数设置

4. **院校管理**
   - 院校列表
   - 院校CRUD操作

5. **科目管理**
   - 科目列表
   - 科目分类

6. **知识点管理**
   - 知识点树
   - 层级管理

7. **题库管理**
   - 试题列表
   - 试题CRUD
   - 审核状态管理

8. **数据管理**
   - 分数线管理
   - 招生数据管理

9. **用户管理**
   - 管理员列表
   - 角色管理

## 技术栈

- **框架**: React 18 + TypeScript
- **UI库**: Ant Design 5.x
- **路由**: React Router v6
- **状态管理**: Zustand
- **构建工具**: Vite
- **样式**: CSS-in-JS

## 快速开始

### 1. 安装依赖

```bash
cd admin
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问: http://localhost:3001

### 3. 登录系统

默认账号:
- 用户名: `admin`
- 密码: `admin123`

### 4. 构建生产版本

```bash
npm run build
```

## 项目结构

```
admin/
├── src/
│   ├── layouts/           # 布局组件
│   │   ├── MainLayout.tsx    # 主布局
│   │   └── AuthLayout.tsx    # 登录布局
│   ├── pages/             # 页面组件
│   │   ├── Dashboard/        # 数据概览
│   │   ├── SystemConfig/     # 系统配置
│   │   ├── University/       # 院校管理
│   │   ├── Subject/          # 科目管理
│   │   ├── KnowledgePoint/   # 知识点管理
│   │   ├── Question/         # 题库管理
│   │   ├── ScoreLine/        # 分数线管理
│   │   ├── Enrollment/       # 招生数据
│   │   └── User/             # 用户管理
│   ├── stores/            # 状态管理
│   │   └── authStore.ts      # 认证状态
│   ├── App.tsx            # 根组件
│   ├── main.tsx           # 入口文件
│   └── index.css          # 全局样式
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 核心功能说明

### 1. 用户认证

使用 Zustand 进行状态管理，支持：
- 登录验证
- Token 持久化
- 自动登出

### 2. 路由管理

基于 React Router v6，支持：
- 嵌套路由
- 路由守卫
- 动态菜单

### 3. 数据管理

所有列表页面支持：
- 搜索筛选
- 分页
- CRUD操作
- 批量操作

### 4. 表单处理

使用 Ant Design Form，支持：
- 表单验证
- 动态表单
- 文件上传

## 开发指南

### 添加新页面

1. 在 `src/pages/` 下创建新目录
2. 创建页面组件
3. 在 `MainLayout.tsx` 中添加路由
4. 在菜单配置中添加菜单项

示例:

```typescript
// src/pages/NewModule/index.tsx
export default function NewModule() {
  return <div>新模块</div>
}

// MainLayout.tsx
import NewModule from '@/pages/NewModule'

// 添加路由
<Route path="/new-module" element={<NewModule />} />

// 添加菜单
{
  key: '/new-module',
  icon: <Icon />,
  label: '新模块',
}
```

### API 集成

当前使用 Mock 数据，实际项目中需要：

1. 创建 API 服务层 (`src/services/api.ts`)
2. 使用 axios 进行请求
3. 添加请求拦截器（Token、错误处理）

示例:

```typescript
// src/services/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截器
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    message.error(error.message)
    return Promise.reject(error)
  }
)

export default api
```

## 部署

### 开发环境

```bash
npm run dev
```

### 生产环境

```bash
# 构建
npm run build

# 预览
npm run preview
```

### Docker 部署

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 环境变量

创建 `.env` 文件:

```env
# API 地址
VITE_API_BASE_URL=http://localhost:3000/api

# 其他配置
VITE_APP_TITLE=经济学考研管理后台
```

## 常见问题

### 1. 端口冲突

修改 `vite.config.ts` 中的端口:

```typescript
server: {
  port: 3002, // 修改为其他端口
}
```

### 2. 代理配置

在 `vite.config.ts` 中配置代理:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

### 3. 路径别名

已配置 `@` 指向 `src` 目录:

```typescript
import Component from '@/components/Component'
```

## 后续优化

- [ ] 完善 API 集成
- [ ] 添加权限管理
- [ ] 实现文件上传
- [ ] 添加数据导入导出
- [ ] 实现批量操作
- [ ] 添加操作日志
- [ ] 优化移动端适配
- [ ] 添加国际化支持

## 许可证

MIT License
