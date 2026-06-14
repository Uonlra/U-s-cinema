# U-s-cinema

U-s-cinema 是一个基于 **React + TypeScript + Vite** 构建的电影浏览与个人片库管理应用。项目从早期 JavaScript 版本逐步迁移到 TypeScript,用于练习组件拆分、路由管理、接口封装、类型建模、状态共享、本地持久化和异常状态处理。

## 项目定位

项目以电影发现、电影目录、收藏列表和想看清单为核心场景,接入 TMDB API 获取电影数据,并围绕真实前端业务中常见的搜索筛选、分页排序、详情弹窗、加载状态、错误兜底和本地数据迁移进行实现。

这不是简单的静态页面练习,而是一个完整的 React 单页应用实践:从 API 数据接入、页面路由、全局状态、复用组件到 TypeScript 类型约束,尽量把小型前端项目做成可维护、可扩展的结构。

## 主要功能

- 首页电影推荐:展示趋势、上映中、高分电影,支持 Featured 推荐区轮播
- 电影目录页:支持关键词搜索、类型筛选、排序切换和分页导航
- 电影详情:支持详情页和详情弹窗,展示海报、背景图、评分、片长、类型和简介
- 收藏与想看清单:支持添加/移除收藏、加入想看、修改观看状态
- 本地持久化:使用 `localStorage` 保存统一 `library` 状态
- 旧数据迁移:兼容旧版 `favorites` / `watchlist` 本地数据并迁移到新结构
- 异常体验:覆盖 loading skeleton、错误提示、空状态、图片缺省兜底
- 交互细节:详情弹窗支持 ESC 关闭、遮罩点击关闭和页面滚动锁定

## TypeScript 迁移重点

- 新增 `types/movie.ts` 和 `types/library.ts`,抽象 `Movie`、`MovieDetails`、`MoviePage`、`Library`、`LibraryEntry`、`WatchStatus` 等核心业务类型
- 将 API 层迁移为 `services/api.ts`,使用泛型请求方法 `requestTmdb<TResponse>` 约束 TMDB 响应类型
- 将 Context 状态管理迁移为 TypeScript,为收藏、想看、观看状态和更新方法建立明确类型
- 抽离 `useFeaturedCarousel<TMovie>` 自定义 Hook,统一管理首页 Featured 区轮播、切换和 hover/focus 暂停逻辑
- 抽离 `constants/watchStatus.ts` 和 `constants/movieMeta.ts`,集中维护观看状态、类型筛选、排序选项等枚举数据
- 将页面和复用组件迁移到 `.tsx`,包括 Home、Movies、Favorites、Watchlist、MovieDetails、MovieCard、SortDropdown、SearchField、EmptyState 等
- 将项目入口迁移为 `App.tsx` 和 `main.tsx`
- 开启 `strict: true`,并通过 `npm run typecheck`

## 技术栈

- React
- TypeScript
- Vite
- React Router
- Context API
- TMDB API
- localStorage
- CSS
- ESLint

## 项目结构

```text
U-s-cinema/
├── MainFile/
│   ├── fronted/
│   │   ├── src/
│   │   │   ├── components/      # 复用组件
│   │   │   ├── Contexts/        # 全局状态与弹窗上下文
│   │   │   ├── constants/       # 类型筛选、观看状态、排序选项
│   │   │   ├── css/             # 页面与组件样式
│   │   │   ├── hooks/           # 自定义 Hook
│   │   │   ├── pages/           # 页面组件
│   │   │   ├── services/        # TMDB API 请求封装
│   │   │   ├── types/           # 业务类型定义
│   │   │   ├── utils/           # 格式化工具函数
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.js
│   ├── docs/
│   └── package.json
├── DESIGN.md
└── README.md
```

## 本地运行

在项目根目录运行:

```bash
cd MainFile
npm install
npm run dev
```

或进入前端目录运行:

```bash
cd MainFile/fronted
npm install
npm run dev
```

项目默认运行在:

```text
http://localhost:5174
```

## 环境变量

复制示例环境变量文件:

```bash
cd MainFile/fronted
cp .env.example .env
```

然后在 `.env` 中配置 TMDB API Key:

```text
VITE_TMDB_API_KEY=your_tmdb_api_key
```

## 可用脚本

在 `MainFile/fronted` 目录下:

```bash
npm run dev        # 启动开发服务
npm run typecheck  # TypeScript 类型检查
npm run lint       # ESLint 检查
npm run build      # 生产构建
npm run preview    # 预览构建产物
```

`MainFile/package.json` 也提供了转发脚本:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## 当前状态

当前项目已经完成主体 TypeScript 迁移,并通过:

```bash
npm run typecheck
npm run lint
npm run build
```

后续可以继续补充单元测试、端到端测试、README 截图说明,以及进一步抽象请求状态管理。
