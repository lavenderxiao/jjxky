# API 服务层使用指南

## 概述

已创建完整的 API 服务层，包含所有模块的接口定义和类型声明。

## 文件结构

```
src/
├── services/
│   ├── api.ts                    # Axios 实例配置
│   ├── authService.ts            # 认证服务
│   ├── universityService.ts      # 院校管理
│   ├── questionService.ts        # 题库管理
│   ├── subjectService.ts         # 科目管理
│   ├── knowledgePointService.ts  # 知识点管理
│   ├── scoreLineService.ts       # 分数线管理
│   ├── enrollmentService.ts      # 招生数据管理
│   ├── userService.ts            # 用户管理
│   ├── configService.ts          # 系统配置
│   ├── statsService.ts           # 统计数据
│   └── index.ts                  # 统一导出
└── types/
    └── api.ts                    # API 类型定义
```

## 使用示例

### 1. 在组件中使用

```typescript
import { questionService } from '@/services'
import { message } from 'antd'

// 获取题目列表
const fetchQuestions = async () => {
  try {
    const data = await questionService.getList({
      page: 1,
      pageSize: 10,
      subject: '微观经济学'
    })
    setData(data.list)
  } catch (error) {
    message.error(error.message)
  }
}

// 创建题目
const handleCreate = async (values) => {
  try {
    await questionService.create(values)
    message.success('创建成功')
    fetchQuestions()
  } catch (error) {
    message.error(error.message)
  }
}
```

### 2. 更新认证 Store

修改 `src/stores/authStore.ts` 使用真实 API：

```typescript
import { authService } from '@/services'

login: async (username: string, password: string) => {
  const data = await authService.login({ username, password })
  set({
    isAuthenticated: true,
    user: data.user,
    token: data.token,
  })
  localStorage.setItem('token', data.token)
}
```

## 环境配置

1. 复制 `.env.example` 为 `.env`
2. 修改 API 地址：`VITE_API_BASE_URL=http://your-api-url`

## 后端 API 规范

所有接口返回格式：

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

分页接口返回：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```
