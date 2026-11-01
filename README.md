# 养大一个人 · 从出生到大学毕业

一本写给普通家长的养育手册：分阶段、分性别、分 AI 时代，并且**每一页都能听**。

> 你不是缺方法，你是缺一个把话说明白的人。

## 本地开发

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 输出到 docs/.vitepress/dist
npm run preview
```

## 部署

GitHub Pages 走仓库名路径，构建时注入 `BASE`：

```bash
BASE=/child-rearing/ npm run build
```

`.github/workflows/deploy.yml` 已经设好 `BASE: /child-rearing/`。绑定自定义域名时把 workflow 里的 `BASE` 改成 `/`。

## 目录

```
docs/
├── .vitepress/
│   ├── config.mts          # nav / sidebar（由 reading-order.ts 生成）/ 搜索与页脚文案
│   └── theme/
│       ├── index.ts        # 全局注册组件 + 三个 Layout 插槽
│       ├── style.css       # 鱼心快跑设计令牌、.mp-* 版式原语、.cr-listen 播放条
│       ├── reading-order.ts# 全站阅读顺序：侧栏与听书歌单共用这一份真值
│       ├── useSpeech.ts    # 语音引擎（Web Speech + Media Session + 连播状态机）
│       ├── extract.ts      # 从渲染后的正文里挑出该朗读的块
│       └── components/     # ListenBar / StageTimeline / SleepScreenChart /
│                           # MetricBand / AgeLines / SexOverlap / GrowthWindow /
│                           # MythCards / BookShelf / PairTalk / BrandMark
├── public/                 # logo、favicon、品牌图
├── index.md                # 首页
├── start.md listen.md map/ gender/ ai/ evidence/ parents/ books/ about.md
```

页面清单只有一处：`reading-order.ts`。侧边栏、上下篇、听书连播顺序都从它生成，改顺序不用碰内容。

## 听书是怎么做的

- **引擎**：浏览器原生 `speechSynthesis`。不录音、不上传音频、不依赖第三方服务；浏览器不允许网页自己出声，所以第一次必须由人点一下。
- **切块**：`extract.ts` 只取 `h2/h3/p/li/blockquote` 这类正文块，跳过表格、代码、图片和组件里的装饰部分。
- **一条硬规矩**：凡是希望读者听到的数字，正文里必须有一句完整的话把它说出来。表格和图表不会被朗读，所以它们只负责"看一眼"，不负责"讲清楚"。
- **连播**：本页读完 → 按 `reading-order.ts` 跳到下一页（SPA 路由，不刷新）→ 重新抽取正文 → 接着读。范围有三档：本页 / 本章 / 全书。
- **不断气**：Chrome 会在约 15 秒静默后掐掉长句，引擎用一个 9 秒的 `resume()` 心跳续命；`epoch` 令牌用来丢弃被取消的旧回调。锁屏控制走 Media Session API。
- **进度**：`sessionStorage` 记住当前页与段落，误关标签页能接上；语速、声音、连播范围存 `localStorage`。
- **快捷键**：`Alt+P` 播放/暂停，`Alt+←/→` 上一段/下一段。

注意：Edge 的"在线自然语音"和 iOS 的"增强中文语音"效果最好，而这类神经语音通常要把文本发给厂商云端——这是浏览器自带的行为，本站不额外收集任何东西（无统计脚本、无 cookie）。

## 内容纪律

- 全站数字只来自 `.qoder/research-factbase.md`（调研底稿，未纳入版本库）。每一条目分级：✅ 可核 / 🟡 有争议或口径受限 / ⚠️ 流行但证据不支持 / ❌ 不写。
- **十三句很流行的话**（棉花糖实验、右脑开发、敏感期月龄表、成长型思维提分、"男孩危机"、3000 万词差距……）集中放在 `evidence/red-lines.html`，正文页只引用结论，不复制恐吓式表述。
- 男孩与女孩分开写，但两页开头是同一句话：**本页写的是分布，不是你的孩子。** 结构固定为"真实差异 / 被夸大的差异 / 需要额外支持"。
- 涉及发育、性早熟、情绪与进食问题的段落，顺序永远是**先给求助出口，再给观点**，并且明写"本站不做诊断"。
- 医疗、心理、法律内容仅供家庭教育参考，不能替代医生、心理咨询师或法律援助。

## 设计体系

视觉与版式继承[鱼心快跑品牌规范](BRAND.md)：暖白纸面、深海墨绿、蓝绿主色，Manrope + JetBrains Mono，工程蓝图母题。姊妹站：[MCP Patterns](https://yuxinrun.github.io/mcp-patterns/)、[Super-agent 讲透](https://yuxinrun.github.io/super-agent/)。
