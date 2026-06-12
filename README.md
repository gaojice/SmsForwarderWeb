# SmsForwarder Web 客户端

基于 [Next.js](https://nextjs.org) 开发的 SmsForwarder Android 应用远程控制 Web 客户端，适配 v3.0.0（含）以上版本。

## 功能特性

- **首页仪表盘** — 设备信息、SIM 卡状态、电池电量、已启用功能概览
- **短信管理** — 查看收件箱/已发短信，支持关键字搜索、分页浏览、发送新短信
- **通话记录** — 按类型筛选（全部/呼入/呼出/未接），支持号码搜索
- **通讯录** — 搜索联系人，添加新联系人
- **电池信息** — 电量、电压、温度、健康度、充电状态
- **远程唤醒 (WOL)** — 发送网络唤醒魔术包
- **设备定位** — 查看 GPS 定位信息，支持跳转地图
- **深色模式** — 支持浅色/深色主题切换
- **移动端适配** — 底部导航栏、安全区域适配、触控优化
- **PWA 支持** — 可添加到主屏幕使用

## 技术栈

- **框架**: Next.js 16 (App Router, TypeScript)
- **UI**: Tailwind CSS + shadcn/ui
- **数据请求**: SWR (缓存 + 自动刷新)
- **主题**: next-themes (深色/浅色模式)
- **表单**: react-hook-form + zod (类型安全校验)
- **签名**: Web Crypto API (HMAC-SHA256)
- **部署**: 静态导出 (`output: 'export'`)

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `out/` 目录，可部署到任意静态文件服务器。

## 使用方式

1. 确保手机已安装 SmsForwarder 并开启主动控制（HTTP 服务端）
2. 打开本应用，进入**设置**页面
3. 填写服务端地址（如 `http://192.168.1.100:5000`）
4. 如果启用了签名验证，填写签名密钥
5. 点击**测试连接**验证连通性

## 项目结构

```
src/
├── app/                    # 页面路由
│   ├── dashboard/          # 首页仪表盘
│   ├── sms/                # 短信列表 + 发送短信
│   ├── calls/              # 通话记录
│   ├── contacts/           # 通讯录 + 添加联系人
│   ├── battery/            # 电池信息
│   ├── wol/                # 远程唤醒
│   ├── location/           # 设备定位
│   └── settings/           # 设置
├── components/             # 组件
│   ├── ui/                 # shadcn/ui 基础组件
│   └── layout/             # 布局组件（导航栏、页头等）
├── lib/                    # 工具库
│   ├── api.ts              # API 请求封装
│   ├── sign.ts             # HMAC-SHA256 签名
│   ├── types.ts            # TypeScript 类型定义
│   └── hooks/              # 自定义 Hooks
└── providers/              # React Context 提供者
```

## API 接口

支持的 SmsForwarder API 接口（v3.0.0+）：

| 接口 | 说明 |
|------|------|
| `/config/query` | 查询设备配置与功能开关 |
| `/sms/send` | 发送短信 |
| `/sms/query` | 查询短信（分页） |
| `/call/query` | 查询通话记录（分页） |
| `/contact/query` | 查询通讯录 |
| `/contact/add` | 添加联系人 |
| `/battery/query` | 查询电池信息 |
| `/wol/send` | 发送远程唤醒包 |
| `/location/query` | 查询设备定位 |

## 许可证

本项目仅供学习参考使用。
