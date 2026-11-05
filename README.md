# dsh-index-widget

A股行情胶囊，挂在 DeepSeek Harness Web 界面会话标题栏上：默认滚动显示，点一下展开完整行情。

## 功能

- **顶部跑马灯**：一行滚动的指数/品种报价，宽度 120–520px 可调，悬停暂停，`prefers-reduced-motion` 下自动停。
- **行情弹窗**：涨跌家数、两市成交额，加四段行情表（名称 / 最新 / 涨跌额 / 涨跌幅）。
- **四类内容**：8 个大盘指数、4 个贵金属品种（沪金、COMEX 黄金、沪银、黄金 ETF）、自选股（最多 12 只）、26 个行业板块。
- **自选股**：输入 6 位代码即加，名称自动补全，点标签移除。
- **交易时段感知**：9:15–11:30、13:00–15:00 每 5 秒刷新，其余时间每分钟一次；胶囊左侧小圆点显示交易中 / 集合竞价 / 午休 / 收盘。
- **主题跟随**：深色、浅色两套配色，跟随 Harness 主题设置，切换即时生效。
- **无 API Key**：直接读东财公开行情接口，浏览器同源直连。

## 安装

需要 DeepSeek Harness（桌面版或 `dsh web`）。

1. 把仓库放到任意目录，例如 `~/plugins/dsh-index-widget`。
2. 在 Harness 里安装该目录作为 bundle：

   ```sh
   dsh plugin install ~/plugins/dsh-index-widget
   ```

   也可以让 Agent 调用 `plugin_manager` 的 `install_bundle`，`target` 传目录绝对路径。
3. 刷新页面（Ctrl+R），标题栏出现胶囊即成功。

## 使用

- **点击胶囊**：打开弹窗。
- **选择内容**：勾选要显示的指数、贵金属、板块；自选股在这一页添加/移除。
- **设置**：拖滑块调整胶囊宽度，或点预设值。
- 所有选择存在浏览器 `localStorage`，换设备不跟随。

## 本地存储

| 键 | 内容 |
| --- | --- |
| `dsh-index-widget:indices` | 显示的大盘指数代码 |
| `dsh-index-widget:metals` | 显示的贵金属 |
| `dsh-index-widget:boards` | 显示的板块 |
| `dsh-index-widget:stocks` | 自选股 `[{ code, name }]` |
| `dsh-index-widget:width` | 胶囊宽度（px） |

## 结构

```
index.js          宿主半：空实现，只为满足 bundle 结构
client.js         浏览器半：全部界面与取数逻辑
cordis.patch.yml  bundle 补丁，插入本插件
locale/           插件列表里的标题与描述
icon.svg          图标
```

只有浏览器半，没有宿主路由：东财接口会把请求的 `Origin` 回填进 `Access-Control-Allow-Origin`，页面可以直接 `fetch`。

## 开发

```sh
node --check client.js
```

改完 `client.js` 后需要让 Harness 重建模块图（`plugin_manager` 里先把 bundle 设成 false 再设成 true），然后 Ctrl+R 刷新页面；不需要重启应用。

## 数据来源

行情来自东方财富公开接口（`push2.eastmoney.com`），仅作个人看盘参考，不构成任何投资建议；接口可能随时变动，取数失败时胶囊会显示「行情不可用」并自动重试。

## License

MIT
