window.__ModuleLoader__.load({
  id: 'dsh-index-widget',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    /**
     * Every palette value is a CSS custom property so the capsule and the
     * dialog follow the active theme: the dark pair sits on the roots and the
     * `data-scheme="light"` pair overrides them in place.
     */
    const UP = 'var(--dsh-up)'
    const DOWN = 'var(--dsh-down)'
    const FLAT = 'var(--dsh-flat)'
    const TEXT = 'var(--dsh-text)'
    const QUIET = 'var(--dsh-quiet)'
    const FAINT = 'var(--dsh-faint)'
    const AMBER = 'var(--dsh-warn)'
    const LINE = 'var(--dsh-line)'
    const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

    /** Quote refresh period while the market trades, milliseconds. */
    const LIVE_MS = 5000

    /** Quote refresh period outside trading hours, milliseconds. */
    const IDLE_MS = 60000

    /** Upstream fetch budget, milliseconds. */
    const TIMEOUT_MS = 5000

    /** localStorage keys for the selectable sections, the watchlist, and the capsule width. */
    const INDEX_KEY = 'dsh-index-widget:indices'
    const METAL_KEY = 'dsh-index-widget:metals'
    const BOARD_KEY = 'dsh-index-widget:boards'
    const STOCK_KEY = 'dsh-index-widget:stocks'
    const WIDTH_KEY = 'dsh-index-widget:width'

    /** Watchlist size limit. */
    const STOCK_MAX = 12

    /** Capsule widths the user may pick from, in pixels. */
    const WIDTH_MIN = 120
    const WIDTH_MAX = 520
    const WIDTH_STEP = 10
    const WIDTH_DEFAULT = 220

    /** localStorage key and defaults for the danmaku layer. */
    const DANMAKU_KEY = 'dsh-index-widget:danmaku'
    const DANMAKU_DEFAULT = {
      on: false,
      size: 15,
      speed: 24,
      opacity: 0.5,
      density: 1,
      direction: 'rtl',
      font: 'mono',
      weight: 500,
      bubble: false,
    }

    /** Danmaku travel directions; `alt` picks one per item. */
    const DIRECTIONS = [
      ['rtl', '从右往左'],
      ['ltr', '从左往右'],
      ['ttb', '从上往下'],
      ['btt', '从下往上'],
      ['alt', '随机'],
    ]

    /** Danmaku typefaces offered in the settings panel. */
    const FONT_STACKS = {
      mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
      sans: 'system-ui, -apple-system, "Segoe UI", "Microsoft YaHei", sans-serif',
      serif: 'Georgia, "Times New Roman", "Songti SC", SimSun, serif',
      kai: 'KaiTi, "Kaiti SC", STKaiti, "Songti SC", serif',
    }

    /** Danmaku typeface choices, in display order. */
    const FONTS = [
      ['mono', '等宽'],
      ['sans', '黑体'],
      ['serif', '衬线'],
      ['kai', '楷体'],
    ]

    /** Danmaku font size range, pixels. */
    const SIZE_MIN = 10
    const SIZE_MAX = 26

    /** Seconds one item takes to cross the window. */
    const SPEED_MIN = 8
    const SPEED_MAX = 45

    /** Items spawned per 1.6 seconds. */
    const DENSITY_MIN = 0.4
    const DENSITY_MAX = 2.5

    /** Item opacity range. */
    const OPACITY_MIN = 0.15
    const OPACITY_MAX = 0.9

    /** Hard ceiling on live items, so a stalled compositor cannot pile them up. */
    const DANMAKU_MAX = 18

    /** Broad market indices. */
    const INDICES = [
      { code: '000001', secid: '1.000001', name: '上证' },
      { code: '399001', secid: '0.399001', name: '深证' },
      { code: '399006', secid: '0.399006', name: '创业板' },
      { code: '000300', secid: '1.000300', name: '沪深300' },
      { code: '000688', secid: '1.000688', name: '科创50' },
      { code: '000905', secid: '1.000905', name: '中证500' },
      { code: '000016', secid: '1.000016', name: '上证50' },
      { code: '899050', secid: '0.899050', name: '北证50' },
    ]

    /** Precious metals and the gold ETF. */
    const METALS = [
      { code: 'aum', secid: '113.aum', name: '沪金主连' },
      { code: 'GC00Y', secid: '101.GC00Y', name: 'COMEX黄金' },
      { code: 'agm', secid: '113.agm', name: '沪银主连' },
      { code: '518880', secid: '1.518880', name: '黄金ETF' },
    ]

    /** Selectable sector boards (Eastmoney `90.BKxxxx`), names verified against the quote API. */
    const BOARDS = [
      { code: 'BK1036', name: '半导体' },
      { code: 'BK1037', name: '消费电子' },
      { code: 'BK0800', name: '人工智能' },
      { code: 'BK1090', name: '机器人' },
      { code: 'BK0737', name: '软件' },
      { code: 'BK0448', name: '通信设备' },
      { code: 'BK0473', name: '证券' },
      { code: 'BK0474', name: '保险' },
      { code: 'BK0475', name: '银行' },
      { code: 'BK0896', name: '白酒' },
      { code: 'BK0438', name: '食品饮料' },
      { code: 'BK0490', name: '军工' },
      { code: 'BK0900', name: '新能源车' },
      { code: 'BK0493', name: '新能源' },
      { code: 'BK0478', name: '有色金属' },
      { code: 'BK0437', name: '煤炭' },
      { code: 'BK0428', name: '电力' },
      { code: 'BK0727', name: '医疗服务' },
      { code: 'BK0465', name: '化学制药' },
      { code: 'BK0451', name: '房地产' },
      { code: 'BK0456', name: '家电' },
      { code: 'BK0433', name: '农林牧渔' },
      { code: 'BK0447', name: '互联网' },
      { code: 'BK0485', name: '旅游酒店' },
      { code: 'BK0425', name: '工程建设' },
      { code: 'BK0421', name: '铁路公路' },
    ]

    /** The two markets whose breadth and turnover feed the summary line. */
    const MARKET_SECIDS = ['1.000001', '0.399001']

    /** Selection shown on a fresh profile. */
    const DEFAULTS = {
      indices: INDICES.map((entry) => entry.code),
      metals: METALS.map((entry) => entry.code),
      boards: ['BK1036', 'BK0800', 'BK0473', 'BK0896'],
    }

    /**
     * Eastmoney echoes the request origin, so the page fetches it directly.
     * f13 (market id) is required to key rows: 000001 is both the Shanghai
     * composite and Ping An Bank.
     */
    const SOURCE = 'https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f2,f3,f4,f6,f12,f13,f14,f104,f105,f106&secids='

    const KEYS = { indices: INDEX_KEY, metals: METAL_KEY, boards: BOARD_KEY }

    const CSS = `
      .dsh-index-shell, .dsh-index-panel, .dsh-index-danmaku {
        --dsh-up: #ff6b6b;
        --dsh-down: #2fbf71;
        --dsh-flat: #a9b1bd;
        --dsh-text: #eef2f8;
        --dsh-quiet: #8b95a5;
        --dsh-faint: #5c6674;
        --dsh-warn: #e0a83c;
        --dsh-line: rgba(140, 160, 190, 0.12);
        --dsh-capsule: rgba(127, 145, 175, 0.10);
        --dsh-capsule-hover: rgba(127, 145, 175, 0.18);
        --dsh-capsule-border: rgba(140, 160, 190, 0.22);
        --dsh-panel: #151a22;
        --dsh-panel-border: rgba(140, 160, 190, 0.20);
        --dsh-panel-shadow: 0 18px 48px rgba(0, 0, 0, 0.55);
        --dsh-backdrop: rgba(6, 9, 14, 0.55);
        --dsh-chip: #b9c3d1;
        --dsh-field: rgba(8, 11, 16, 0.6);
        --dsh-bubble: rgba(10, 14, 20, 0.62);
        --dsh-bubble-border: rgba(255, 255, 255, 0.14);
        --dsh-bubble-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
      }
      .dsh-index-shell[data-scheme="light"], .dsh-index-panel[data-scheme="light"], .dsh-index-danmaku[data-scheme="light"] {
        --dsh-up: #d92b2b;
        --dsh-down: #0e8a4f;
        --dsh-flat: #6c7683;
        --dsh-text: #141a22;
        --dsh-quiet: #5a636e;
        --dsh-faint: #8a929e;
        --dsh-warn: #a86a00;
        --dsh-line: rgba(20, 32, 48, 0.10);
        --dsh-capsule: rgba(20, 32, 48, 0.04);
        --dsh-capsule-hover: rgba(20, 32, 48, 0.09);
        --dsh-capsule-border: rgba(20, 32, 48, 0.14);
        --dsh-panel: #ffffff;
        --dsh-panel-border: rgba(20, 32, 48, 0.12);
        --dsh-panel-shadow: 0 18px 44px rgba(18, 28, 42, 0.18);
        --dsh-backdrop: rgba(18, 26, 38, 0.28);
        --dsh-chip: #3d4653;
        --dsh-field: rgba(255, 255, 255, 0.9);
        --dsh-bubble: rgba(255, 255, 255, 0.86);
        --dsh-bubble-border: rgba(15, 23, 32, 0.14);
        --dsh-bubble-shadow: 0 2px 10px rgba(18, 28, 42, 0.16);
      }
      @keyframes dsh-index-marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      .dsh-index-shell { display: inline-flex; align-items: center; gap: 6px; flex: 0 0 auto; }
      .dsh-index-dot { width: 6px; height: 6px; border-radius: 3px; flex: 0 0 auto; }
      .dsh-index-ticker {
        display: inline-flex;
        align-items: center;
        height: 22px;
        overflow: hidden;
        border-radius: 11px;
        border: 1px solid var(--dsh-capsule-border);
        background: var(--dsh-capsule);
        cursor: pointer;
        -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 10px, #000 calc(100% - 10px), transparent);
        mask-image: linear-gradient(90deg, transparent 0, #000 10px, #000 calc(100% - 10px), transparent);
      }
      .dsh-index-ticker:hover { background: var(--dsh-capsule-hover); }
      .dsh-index-ticker:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary, #78aaff); outline-offset: 2px; }
      .dsh-index-track {
        display: inline-flex;
        white-space: nowrap;
        will-change: transform;
        animation: dsh-index-marquee var(--dsh-index-lap, 26s) linear infinite;
      }
      .dsh-index-ticker:hover .dsh-index-track { animation-play-state: paused; }
      @keyframes dsh-index-danmaku-rtl {
        from { transform: translate3d(100vw, 0, 0); }
        to { transform: translate3d(-100%, 0, 0); }
      }
      @keyframes dsh-index-danmaku-ltr {
        from { transform: translate3d(-100%, 0, 0); }
        to { transform: translate3d(100vw, 0, 0); }
      }
      @keyframes dsh-index-danmaku-ttb {
        from { transform: translate3d(0, -100%, 0); }
        to { transform: translate3d(0, 100vh, 0); }
      }
      @keyframes dsh-index-danmaku-btt {
        from { transform: translate3d(0, 100vh, 0); }
        to { transform: translate3d(0, -100%, 0); }
      }
      .dsh-index-danmaku {
        position: fixed;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        user-select: none;
        z-index: 900;
      }
      .dsh-index-danmaku-item {
        position: absolute;
        left: 0;
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
        will-change: transform;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
      }
      .dsh-index-danmaku-bubble {
        padding: 2px 9px;
        border-radius: 999px;
        border: 1px solid var(--dsh-bubble-border);
        background: var(--dsh-bubble);
        box-shadow: var(--dsh-bubble-shadow);
        text-shadow: none;
      }
      .dsh-index-body { overflow-y: auto; max-height: 58vh; margin-right: -4px; padding-right: 4px; }
      .dsh-index-body::-webkit-scrollbar { width: 6px; }
      .dsh-index-body::-webkit-scrollbar-thumb { background: var(--dsh-capsule-border); border-radius: 3px; }
      .dsh-index-chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 8px;
        border-radius: 6px;
        border: 1px solid var(--dsh-capsule-border);
        background: transparent;
        color: var(--dsh-chip);
        font-size: 11.5px;
        cursor: pointer;
      }
      .dsh-index-chip:hover { background: var(--dsh-capsule); }
      .dsh-index-chip[data-on="true"] {
        border-color: var(--dsh-up);
        background: rgba(217, 43, 43, 0.10);
        color: var(--dsh-up);
      }
      .dsh-index-chip:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary, #78aaff); outline-offset: 1px; }
      .dsh-index-input {
        flex: 1;
        min-width: 0;
        box-sizing: border-box;
        padding: 5px 8px;
        border-radius: 6px;
        border: 1px solid var(--dsh-capsule-border);
        background: var(--dsh-field);
        color: var(--dsh-text);
        font-size: 12px;
        outline: none;
      }
      .dsh-index-input:focus { border-color: var(--dsw-alias-brand-primary, #78aaff); }
      .dsh-index-btn {
        color: var(--dsh-chip);
        cursor: pointer;
        padding: 2px 8px;
        border-radius: 6px;
        border: 1px solid var(--dsh-capsule-border);
        font-size: 11px;
        background: transparent;
        white-space: nowrap;
      }
      .dsh-index-btn:hover { background: var(--dsh-capsule); }
      .dsh-index-breadth {
        display: flex;
        align-items: baseline;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 8px;
        font-size: 11.5px;
        font-family: ${MONO};
        color: var(--dsh-chip);
      }
      @media (prefers-reduced-motion: reduce) {
        .dsh-index-track { animation: none; }
        .dsh-index-danmaku { display: none; }
      }
    `

    /**
     * Attach the stylesheet. Bundle halves get no `styles` builtin (that one is
     * package-sandbox only), and an unowned `<style>` would be claimed by the
     * client module system, so tag it with our own data-plugin attribute.
     */
    function injectStyles() {
      let element
      try {
        element = document.createElement('style')
        element.setAttribute('data-plugin', 'dsh-index-widget')
        element.textContent = CSS
        document.head.appendChild(element)
      } catch {
        // Cosmetic only: a missing sheet must never block the widget.
        return undefined
      }
      return () => {
        try { element.remove() } catch { /* head already reset at boot */ }
      }
    }

    // ---------------------------------------------------------------- shared state

    /**
     * Read one saved section selection. A saved empty list stays empty because
     * the user hid every row; a missing or unreadable entry uses `fallback`.
     */
    function readSelection(key, items, fallback) {
      let saved = null
      try {
        const raw = window.localStorage.getItem(key)
        if (raw) saved = JSON.parse(raw)
      } catch { /* private mode or corrupted entry: fall back */ }
      if (!Array.isArray(saved)) return fallback.slice()
      const known = new Set(items.map((entry) => entry.code))
      return saved.filter((code) => known.has(code))
    }

    /** Read the saved watchlist, dropping malformed entries. */
    function readStocks() {
      let saved = null
      try {
        const raw = window.localStorage.getItem(STOCK_KEY)
        if (raw) saved = JSON.parse(raw)
      } catch { /* private mode or corrupted entry: start empty */ }
      if (!Array.isArray(saved)) return []
      const seen = new Set()
      const list = []
      for (const entry of saved) {
        const code = String(entry?.code ?? '').trim()
        if (!/^\d{6}$/.test(code) || seen.has(code)) continue
        seen.add(code)
        const name = typeof entry?.name === 'string' && entry.name ? entry.name : code
        list.push({ code, name })
        if (list.length >= STOCK_MAX) break
      }
      return list
    }

    /** Read the saved capsule width, clamped to the supported range. */
    function readWidth() {
      let saved = 0
      try { saved = Number(window.localStorage.getItem(WIDTH_KEY)) } catch { /* keep default */ }
      if (!Number.isFinite(saved) || saved <= 0) return WIDTH_DEFAULT
      return Math.min(WIDTH_MAX, Math.max(WIDTH_MIN, Math.round(saved / WIDTH_STEP) * WIDTH_STEP))
    }

    /** Read the saved danmaku settings, clamping every number to its range. */
    function readDanmaku() {
      let saved = null
      try {
        const raw = window.localStorage.getItem(DANMAKU_KEY)
        if (raw) saved = JSON.parse(raw)
      } catch { /* private mode or corrupted entry: use the defaults */ }
      const clamp = (value, min, max, fallback) => {
        const number = Number(value)
        return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback
      }
      return {
        on: saved?.on === true,
        size: clamp(saved?.size, SIZE_MIN, SIZE_MAX, DANMAKU_DEFAULT.size),
        speed: clamp(saved?.speed, SPEED_MIN, SPEED_MAX, DANMAKU_DEFAULT.speed),
        opacity: clamp(saved?.opacity, OPACITY_MIN, OPACITY_MAX, DANMAKU_DEFAULT.opacity),
        density: clamp(saved?.density, DENSITY_MIN, DENSITY_MAX, DANMAKU_DEFAULT.density),
        direction: DIRECTIONS.some((entry) => entry[0] === saved?.direction) ? saved.direction : DANMAKU_DEFAULT.direction,
        font: Object.prototype.hasOwnProperty.call(FONT_STACKS, saved?.font) ? saved.font : DANMAKU_DEFAULT.font,
        weight: Number(saved?.weight) === 700 ? 700 : DANMAKU_DEFAULT.weight,
        bubble: saved?.bubble === true,
      }
    }

    /** The OS motion preference; the danmaku layer stays off when it is set. */
    function prefersReducedMotion() {
      try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch { return false }
    }

    /** Shanghai keeps one trading clock regardless of the browser time zone. */
    function marketClock() {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Shanghai',
        hourCycle: 'h23',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).formatToParts(new Date())
      const find = (type) => parts.find((part) => part.type === type)?.value ?? ''
      return {
        weekday: find('weekday'),
        minutes: Number(find('hour')) * 60 + Number(find('minute')),
      }
    }

    /** Current session label plus whether quotes still move. */
    function session() {
      const { weekday, minutes } = marketClock()
      if (weekday === 'Sat' || weekday === 'Sun') return { state: '休市', live: false }
      if (minutes < 9 * 60 + 15) return { state: '未开盘', live: false }
      if (minutes < 9 * 60 + 30) return { state: '集合竞价', live: true }
      if (minutes < 11 * 60 + 30) return { state: '交易中', live: true }
      if (minutes < 13 * 60) return { state: '午间休市', live: false }
      if (minutes < 15 * 60) return { state: '交易中', live: true }
      return { state: '已收盘', live: false }
    }

    /** Codes each section currently shows, in render order. */
    let selection = {
      indices: readSelection(INDEX_KEY, INDICES, DEFAULTS.indices),
      metals: readSelection(METAL_KEY, METALS, DEFAULTS.metals),
      boards: readSelection(BOARD_KEY, BOARDS, DEFAULTS.boards),
    }

    /** User watchlist, shown as the fourth section. */
    let stocks = readStocks()

    /** Quotes keyed by secid, plus market breadth and the fetch status. */
    let snapshot = { quotes: {}, breadth: null, at: 0, stale: false, market: session() }

    /** Capsule width in pixels. */
    let width = readWidth()

    /** Danmaku layer settings. */
    let danmaku = readDanmaku()

    /** Dialog visibility, shared by the header capsule and the overlay dialog. */
    let open = false

    /** Active color scheme, kept in sync with the theme service. */
    let scheme = 'dark'

    const listeners = new Set()

    function emit() {
      for (const listener of listeners) listener()
    }

    function patch(next) {
      snapshot = Object.assign({}, snapshot, next)
      emit()
    }

    function setOpen(value) {
      open = value
      emit()
    }

    function setSelection(kind, codes) {
      selection = Object.assign({}, selection, { [kind]: codes })
      try { window.localStorage.setItem(KEYS[kind], JSON.stringify(codes)) } catch { /* best effort */ }
      emit()
      refresh()
    }

    function setWidth(next) {
      width = Math.min(WIDTH_MAX, Math.max(WIDTH_MIN, Math.round(next)))
      try { window.localStorage.setItem(WIDTH_KEY, String(width)) } catch { /* best effort */ }
      emit()
    }

    /** Merge one danmaku change, persist it, and let both layers re-render. */
    function setDanmaku(next) {
      danmaku = Object.assign({}, danmaku, next)
      try { window.localStorage.setItem(DANMAKU_KEY, JSON.stringify(danmaku)) } catch { /* best effort */ }
      emit()
    }

    function saveStocks() {
      try { window.localStorage.setItem(STOCK_KEY, JSON.stringify(stocks)) } catch { /* best effort */ }
    }

    /** Add one watchlist entry. Returns an empty string on success. */
    function addStock(raw) {
      const code = String(raw).replace(/\D/g, '').slice(0, 6)
      if (code.length !== 6) return '请输入 6 位股票代码'
      if (stocks.some((entry) => entry.code === code)) return '这只已经在列表里'
      if (stocks.length >= STOCK_MAX) return `最多 ${STOCK_MAX} 只`
      stocks = stocks.concat([{ code, name: code }])
      saveStocks()
      emit()
      refresh()
      return ''
    }

    function removeStock(code) {
      stocks = stocks.filter((entry) => entry.code !== code)
      saveStocks()
      emit()
      refresh()
    }

    function read() {
      return { snapshot, open, selection, width, stocks, scheme, danmaku }
    }

    function subscribe(listener) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    }

    function useShared() {
      const [state, setState] = React.useState(read)
      React.useEffect(() => subscribe(() => setState(read())), [])
      return state
    }

    // ---------------------------------------------------------------- data

    /** Main-board and ChiNext codes carry market 1 only for 5/6/9 prefixes. */
    function stockSecid(code) {
      return /^[569]/.test(code) ? `1.${code}` : `0.${code}`
    }

    /** Eastmoney secids for the current selection plus the two market baskets. */
    function allSecids() {
      const list = MARKET_SECIDS.slice()
      const push = (secid) => {
        if (secid && !list.includes(secid)) list.push(secid)
      }
      for (const code of selection.indices) {
        const entry = INDICES.find((item) => item.code === code)
        if (entry) push(entry.secid)
      }
      for (const code of selection.metals) {
        const entry = METALS.find((item) => item.code === code)
        if (entry) push(entry.secid)
      }
      for (const code of selection.boards) push(`90.${code}`)
      for (const entry of stocks) push(stockSecid(entry.code))
      return list
    }

    function colorOf(pct) {
      if (!Number.isFinite(pct) || pct === 0) return FLAT
      return pct > 0 ? UP : DOWN
    }

    function priceOf(value) {
      return Number.isFinite(value) ? value.toFixed(2) : '--'
    }

    function signed(value, digits) {
      if (!Number.isFinite(value)) return '--'
      return `${value > 0 ? '+' : ''}${value.toFixed(digits)}`
    }

    function clockOf(at) {
      const date = new Date(at || Date.now())
      const pad = (value) => String(value).padStart(2, '0')
      return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    }

    /** Turnover in yuan to the unit a market summary uses. */
    function amountOf(yuan) {
      if (!Number.isFinite(yuan) || yuan <= 0) return '--'
      if (yuan >= 1e12) return `${(yuan / 1e12).toFixed(2)} 万亿`
      return `${Math.round(yuan / 1e8)} 亿`
    }

    async function refresh() {
      try {
        const response = await fetch(SOURCE + allSecids().join(','), {
          cache: 'no-store',
          signal: AbortSignal.timeout(TIMEOUT_MS),
        })
        if (!response.ok) throw new Error(`upstream HTTP ${response.status}`)
        const body = await response.json()
        const raw = body?.data?.diff
        if (!Array.isArray(raw)) throw new Error('upstream payload without rows')

        const quotes = {}
        const breadth = { up: 0, down: 0, flat: 0, amount: 0, markets: 0 }
        let renamed = false
        for (const row of raw) {
          const code = String(row.f12 ?? '')
          const market = Number(row.f13)
          if (!code || !Number.isFinite(market)) continue
          const secid = `${market}.${code}`
          const price = Number(row.f2)
          const pct = Number(row.f3)
          if (!Number.isFinite(price) || !Number.isFinite(pct)) continue
          const name = String(row.f14 ?? '')
          quotes[secid] = { price, pct, chg: Number(row.f4), name }

          if (MARKET_SECIDS.includes(secid)) {
            breadth.markets += 1
            breadth.up += Number(row.f104) || 0
            breadth.down += Number(row.f105) || 0
            breadth.flat += Number(row.f106) || 0
            const amount = Number(row.f6)
            if (Number.isFinite(amount)) breadth.amount += amount
          }

          const held = stocks.find((entry) => stockSecid(entry.code) === secid)
          if (held && name && held.name !== name) {
            held.name = name
            renamed = true
          }
        }
        if (renamed) saveStocks()

        patch({
          quotes,
          breadth: breadth.markets > 0 ? breadth : null,
          at: Date.now(),
          stale: Object.keys(quotes).length === 0,
          market: session(),
        })
      } catch {
        patch({ stale: true, market: session() })
      }
    }

    let timer = null
    let running = false

    /** Re-arm the poll with the delay the current session deserves. */
    function schedule() {
      if (timer !== null) clearTimeout(timer)
      timer = setTimeout(async () => {
        if (!document.hidden) await refresh()
        schedule()
      }, session().live ? LIVE_MS : IDLE_MS)
    }

    function startPolling() {
      if (running) return
      running = true
      refresh()
      schedule()
    }

    function stopPolling() {
      running = false
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }
    }

    // ---------------------------------------------------------------- capsule

    function tickerItem(key, name, quote) {
      const color = colorOf(quote?.pct)
      const arrow = !Number.isFinite(quote?.pct) || quote.pct === 0 ? '' : quote.pct > 0 ? '▲' : '▼'
      return h('span', { key, style: { marginRight: 16 } },
        h('span', { style: { color: QUIET } }, `${name} `),
        h('span', { style: { color: TEXT, fontVariantNumeric: 'tabular-nums' } }, `${priceOf(quote?.price)} `),
        h('span', { style: { color, fontWeight: 600 } }, `${arrow}${signed(quote?.pct, 2)}%`),
      )
    }

    function selectedRows(shown, watchlist) {
      const rows = []
      for (const code of shown.indices) {
        const entry = INDICES.find((item) => item.code === code)
        if (entry) rows.push({ key: entry.secid, name: entry.name, quote: snapshot.quotes[entry.secid] })
      }
      for (const code of shown.metals) {
        const entry = METALS.find((item) => item.code === code)
        if (entry) rows.push({ key: entry.secid, name: entry.name, quote: snapshot.quotes[entry.secid] })
      }
      for (const stock of watchlist) {
        rows.push({ key: stockSecid(stock.code), name: stock.name, quote: snapshot.quotes[stockSecid(stock.code)] })
      }
      for (const code of shown.boards) {
        const entry = BOARDS.find((item) => item.code === code)
        if (entry) rows.push({ key: `90.${code}`, name: entry.name, quote: snapshot.quotes[`90.${code}`] })
      }
      return rows
    }

    function statusOf(market) {
      if (market.state === '交易中') return { color: DOWN, text: '交易中' }
      if (market.state === '集合竞价') return { color: AMBER, text: '集合竞价' }
      return { color: FAINT, text: market.state }
    }

    function Ticker() {
      const { snapshot: snap, selection: shown, width: capsuleWidth, stocks: watchlist, scheme: theme } = useShared()
      const rows = selectedRows(shown, watchlist)
      const status = statusOf(snap.market)

      const waiting = snap.stale ? '行情不可用' : '行情加载中…'
      const content = snap.at === 0
        ? h('span', { style: { color: QUIET } }, waiting)
        : rows.length === 0
          ? h('span', { style: { color: QUIET } }, '未选择品种')
          : rows.map((row) => tickerItem(row.key, row.name, row.quote))

      const half = h('span', {
        key: 'half',
        style: { display: 'inline-flex', alignItems: 'baseline' },
      }, content)

      const lap = `${Math.max(18, rows.length * 4)}s`

      return h('span', { className: 'dsh-index-shell', 'data-scheme': theme },
        h('span', {
          className: 'dsh-index-dot',
          title: status.text,
          style: {
            background: status.color,
            boxShadow: snap.market.live ? `0 0 6px ${status.color}` : 'none',
          },
        }),
        h('div', {
          className: 'dsh-index-ticker',
          role: 'button',
          tabIndex: 0,
          title: `${status.text}　A股 · 贵金属 · 自选 · 板块　点击查看全部`,
          style: {
            fontFamily: MONO, fontSize: 11, lineHeight: '22px',
            width: capsuleWidth,
          },
          onClick: () => setOpen(true),
          onKeyDown: (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              setOpen(true)
            }
          },
        }, h('div', { className: 'dsh-index-track', style: { '--dsh-index-lap': lap } },
          [half, React.cloneElement(half, { key: 'half-copy' })])))
    }

    // ---------------------------------------------------------------- danmaku

    /**
     * Quotes drifting across the whole window. Items never take pointer events
     * and are capped, so the layer cannot block or slow down normal work.
     */
    function Danmaku() {
      const { danmaku: config, scheme: theme } = useShared()
      const [items, setItems] = React.useState([])
      const lane = React.useRef(0)
      const enabled = config.on && !prefersReducedMotion()

      React.useEffect(() => {
        if (!enabled) {
          setItems([])
          return undefined
        }
        const spawn = () => {
          if (document.hidden) return
          const rows = selectedRows(selection, stocks).filter((row) => row.quote && Number.isFinite(row.quote.price))
          if (rows.length === 0) return
          const row = rows[Math.floor(Math.random() * rows.length)]
          const mode = config.direction === 'alt'
            ? DIRECTIONS[Math.floor(Math.random() * 4)][0]
            : config.direction
          const vertical = mode === 'ttb' || mode === 'btt'
          let top = 0
          let left = 0
          if (vertical) {
            const columns = Math.max(1, Math.floor(window.innerWidth / 150))
            lane.current = (lane.current + 1 + Math.floor(Math.random() * 2)) % columns
            const columnWidth = window.innerWidth / columns
            left = Math.round(Math.min((lane.current + 0.5) * columnWidth, window.innerWidth - 150))
          } else {
            const laneHeight = Math.round(config.size * 2.2)
            const lanes = Math.max(1, Math.floor((window.innerHeight - 120) / laneHeight))
            lane.current = (lane.current + 1 + Math.floor(Math.random() * 3)) % lanes
            top = 56 + lane.current * laneHeight
          }
          setItems((prev) => {
            const item = {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              name: row.name,
              quote: row.quote,
              dir: mode,
              top,
              left,
              duration: Math.round(config.speed * 1000 * (0.85 + Math.random() * 0.3)),
            }
            const kept = prev.length >= DANMAKU_MAX ? prev.slice(prev.length - DANMAKU_MAX + 1) : prev
            return kept.concat([item])
          })
        }
        spawn()
        const timer = setInterval(spawn, Math.max(400, Math.round(1600 / config.density)))
        return () => clearInterval(timer)
      }, [enabled, config.size, config.speed, config.density, config.direction])

      if (!enabled) return null

      const drop = (id) => setItems((prev) => prev.filter((item) => item.id !== id))
      const fontFamily = FONT_STACKS[config.font] || MONO

      return h('div', { className: 'dsh-index-danmaku', 'data-scheme': theme, 'aria-hidden': 'true' },
        items.map((item) => h('span', {
          key: item.id,
          className: config.bubble ? 'dsh-index-danmaku-item dsh-index-danmaku-bubble' : 'dsh-index-danmaku-item',
          style: {
            top: item.top,
            left: item.left,
            fontFamily,
            fontSize: config.size,
            fontWeight: config.weight,
            lineHeight: 1.2,
            color: colorOf(item.quote.pct),
            opacity: config.opacity,
            animationName: `dsh-index-danmaku-${item.dir}`,
            animationDuration: `${item.duration}ms`,
          },
          onAnimationEnd: () => drop(item.id),
        },
          h('span', { style: { color: TEXT, opacity: 0.85 } }, `${item.name}  `),
          `${priceOf(item.quote.price)}  `,
          `${item.quote.pct > 0 ? '▲' : item.quote.pct < 0 ? '▼' : ''}${signed(item.quote.pct, 2)}%`,
        )))
    }

    // ---------------------------------------------------------------- dialog

    const backdropStyle = {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--dsh-backdrop)',
      backdropFilter: 'blur(3px)',
      pointerEvents: 'auto',
      zIndex: 9999,
    }

    const panelStyle = {
      width: 428,
      maxWidth: 'calc(100vw - 48px)',
      padding: '14px 16px 12px',
      borderRadius: 12,
      background: 'var(--dsh-panel)',
      border: '1px solid var(--dsh-panel-border)',
      boxShadow: 'var(--dsh-panel-shadow)',
      color: TEXT,
      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    }

    const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 88px 74px 78px', alignItems: 'baseline' }
    const cellBase = { fontFamily: MONO, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }

    function sectionTitle(label, extra) {
      return h('div', {
        style: {
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          margin: '10px 0 2px', color: QUIET, fontSize: 10.5, letterSpacing: 0.4,
        },
      },
        h('span', null, label),
        extra || null,
      )
    }

    function headerRow() {
      return h('div', {
        style: Object.assign({}, gridStyle, { color: FAINT, fontSize: 10.5, paddingBottom: 2 }),
      },
        h('span', null, '名称'),
        h('span', { style: { textAlign: 'right' } }, '最新'),
        h('span', { style: { textAlign: 'right' } }, '涨跌额'),
        h('span', { style: { textAlign: 'right' } }, '涨跌幅'),
      )
    }

    function quoteRow(key, name, quote) {
      const color = colorOf(quote?.pct)
      return h('div', {
        key,
        style: Object.assign({}, gridStyle, {
          padding: '5px 0',
          borderBottom: `1px solid ${LINE}`,
          fontSize: 13,
        }),
      },
        h('span', {
          style: {
            color: TEXT, fontSize: 12.5, overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          },
        }, name),
        h('span', { style: Object.assign({}, cellBase, { color: TEXT }) }, priceOf(quote?.price)),
        h('span', { style: Object.assign({}, cellBase, { color, fontSize: 12.5 }) }, signed(quote?.chg, 2)),
        h('span', { style: Object.assign({}, cellBase, { color, fontWeight: 600 }) }, `${signed(quote?.pct, 2)}%`),
      )
    }

    function emptyLine(key, text) {
      return h('div', { key, style: { color: FAINT, fontSize: 11.5, padding: '6px 0' } }, text)
    }

    function breadthLine(breadth) {
      if (!breadth) return null
      return h('div', { className: 'dsh-index-breadth' },
        h('span', null, '涨 ', h('span', { style: { color: UP } }, String(breadth.up))),
        h('span', null, '跌 ', h('span', { style: { color: DOWN } }, String(breadth.down))),
        h('span', null, '平 ', h('span', { style: { color: TEXT } }, String(breadth.flat))),
        h('span', { style: { marginLeft: 'auto', color: QUIET } },
          '成交 ', h('span', { style: { color: TEXT } }, amountOf(breadth.amount))),
      )
    }

    function chipGroup(kind, items, chosen) {
      return h('div', {
        style: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6, paddingBottom: 2 },
      }, items.map((item) => h('button', {
        key: item.code,
        type: 'button',
        className: 'dsh-index-chip',
        'data-on': chosen.has(item.code) ? 'true' : 'false',
        onClick: () => {
          const current = selection[kind]
          const next = chosen.has(item.code)
            ? current.filter((code) => code !== item.code)
            : current.concat([item.code])
          setSelection(kind, next)
        },
      }, item.name)))
    }

    function StockEditor() {
      const { stocks: watchlist } = useShared()
      const [draft, setDraft] = React.useState('')
      const [hint, setHint] = React.useState('')

      const commit = () => {
        const message = addStock(draft)
        setHint(message)
        if (message === '') setDraft('')
      }

      return h('div', null,
        sectionTitle('自选股', h('span', { style: { color: FAINT, fontSize: 10 } },
          `${watchlist.length} / ${STOCK_MAX}`)),
        watchlist.length > 0 ? h('div', {
          style: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 },
        }, watchlist.map((stock) => h('button', {
          key: stock.code,
          type: 'button',
          className: 'dsh-index-chip',
          'data-on': 'true',
          title: `${stock.code}　点击移除`,
          onClick: () => removeStock(stock.code),
        }, `${stock.name === stock.code ? stock.code : stock.name} ×`))) : null,
        h('div', { style: { display: 'flex', gap: 6, marginTop: 6 } },
          h('input', {
            className: 'dsh-index-input',
            placeholder: '输入 6 位代码，如 600519',
            value: draft,
            maxLength: 6,
            onChange: (event) => setDraft(event.target.value.replace(/\D/g, '').slice(0, 6)),
            onKeyDown: (event) => { if (event.key === 'Enter') commit() },
          }),
          h('button', {
            type: 'button',
            className: 'dsh-index-btn',
            onClick: commit,
          }, '添加'),
        ),
        hint
          ? h('div', { style: { color: AMBER, fontSize: 10.5, marginTop: 4 } }, hint)
          : h('div', { style: { color: FAINT, fontSize: 10.5, marginTop: 4 } },
            '名称会在下一次刷新时自动补全；点上方标签可移除。'),
      )
    }

    function ContentPicker() {
      const [query, setQuery] = React.useState('')
      const { selection: shown } = useShared()
      const needle = query.trim().toLowerCase()
      const visibleBoards = BOARDS.filter((board) => !needle
        || board.name.toLowerCase().includes(needle)
        || board.code.toLowerCase().includes(needle))
      const counter = (picked, total) => h('span', { style: { color: FAINT, fontSize: 10 } },
        `${picked} / ${total}`)

      return h('div', { style: { paddingTop: 4 } },
        sectionTitle('大盘指数', counter(shown.indices.length, INDICES.length)),
        chipGroup('indices', INDICES, new Set(shown.indices)),
        sectionTitle('贵金属', counter(shown.metals.length, METALS.length)),
        chipGroup('metals', METALS, new Set(shown.metals)),
        h(StockEditor),
        sectionTitle('自选板块', counter(shown.boards.length, BOARDS.length)),
        h('input', {
          className: 'dsh-index-input',
          placeholder: '搜索板块，例如 半导体 / 白酒',
          value: query,
          style: { marginTop: 6 },
          onChange: (event) => setQuery(event.target.value),
        }),
        chipGroup('boards', visibleBoards, new Set(shown.boards)),
        h('div', { style: { color: FAINT, fontSize: 10.5, marginTop: 8, lineHeight: 1.7 } },
          '点一下切换显示，改动即时生效并记住；某段全部取消时，弹窗里该段只留一行提示。'),
      )
    }

    function Appearance() {
      const { width: current, danmaku: config } = useShared()
      const presets = [150, 220, 300, 400]
      const slider = (label, text, min, max, step, value, onChange) => h('div', {
        style: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, opacity: config.on ? 1 : 0.5 },
      },
        h('span', { style: { color: QUIET, fontSize: 11, width: 60 } }, label),
        h('input', {
          type: 'range',
          min,
          max,
          step,
          value,
          style: { flex: 1, accentColor: UP, cursor: 'pointer' },
          onChange: (event) => onChange(Number(event.target.value)),
        }),
        h('span', { style: { fontFamily: MONO, fontSize: 11.5, color: TEXT, width: 60, textAlign: 'right' } }, text),
      )
      const chip = (key, text, active, onClick) => h('button', {
        key,
        type: 'button',
        className: 'dsh-index-chip',
        'data-on': active ? 'true' : 'false',
        onClick,
      }, text)
      const group = (label, children) => h('div', { style: { marginTop: 12, opacity: config.on ? 1 : 0.5 } },
        h('div', { style: { color: QUIET, fontSize: 11, marginBottom: 6 } }, label),
        h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } }, children),
      )

      return h('div', { style: { paddingTop: 10 } },
        h('div', { style: { color: QUIET, fontSize: 11, marginBottom: 6 } }, '顶部跑马灯宽度'),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
          h('input', {
            type: 'range',
            min: WIDTH_MIN,
            max: WIDTH_MAX,
            step: WIDTH_STEP,
            value: current,
            style: { flex: 1, accentColor: UP, cursor: 'pointer' },
            onChange: (event) => setWidth(Number(event.target.value)),
          }),
          h('span', { style: { fontFamily: MONO, fontSize: 12, color: TEXT, width: 56, textAlign: 'right' } },
            `${current} px`),
        ),
        h('div', { style: { display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' } },
          presets.map((px) => h('button', {
            key: px,
            type: 'button',
            className: 'dsh-index-chip',
            'data-on': current === px ? 'true' : 'false',
            onClick: () => setWidth(px),
          }, `${px} px`))),
        h('div', { style: { color: FAINT, fontSize: 10.5, marginTop: 12, lineHeight: 1.7 } },
          '只改顶部胶囊的宽度；滚动内容由「选择显示内容」里勾选的品种决定。拖动即时生效并记住。'),

        h('div', {
          style: {
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 16, paddingTop: 12, borderTop: `1px solid ${LINE}`,
          },
        },
          h('span', { style: { color: QUIET, fontSize: 11 } }, '弹幕模式'),
          h('button', {
            type: 'button',
            className: 'dsh-index-chip',
            'data-on': config.on ? 'true' : 'false',
            onClick: () => setDanmaku({ on: !config.on }),
          }, config.on ? '已开启' : '已关闭'),
        ),
        slider('字号', `${Math.round(config.size)} px`, SIZE_MIN, SIZE_MAX, 1, config.size, (v) => setDanmaku({ size: v })),
        slider('速度', `${Math.round(config.speed)} 秒`, SPEED_MIN, SPEED_MAX, 1, config.speed, (v) => setDanmaku({ speed: v })),
        slider('密度', `${config.density.toFixed(1)}×`, DENSITY_MIN, DENSITY_MAX, 0.1, config.density, (v) => setDanmaku({ density: v })),
        slider('不透明度', `${Math.round(config.opacity * 100)}%`, OPACITY_MIN, OPACITY_MAX, 0.05, config.opacity, (v) => setDanmaku({ opacity: v })),
        group('方向', DIRECTIONS.map(([value, text]) => chip(value, text, config.direction === value, () => setDanmaku({ direction: value })))),
        group('字体', FONTS.map(([value, text]) => chip(value, text, config.font === value, () => setDanmaku({ font: value })))),
        group('字重', [
          chip('w500', '常规', config.weight === 500, () => setDanmaku({ weight: 500 })),
          chip('w700', '加粗', config.weight === 700, () => setDanmaku({ weight: 700 })),
        ]),
        group('气泡底', [
          chip('b0', '无', config.bubble !== true, () => setDanmaku({ bubble: false })),
          chip('b1', '有', config.bubble === true, () => setDanmaku({ bubble: true })),
        ]),
        h('div', { style: { color: FAINT, fontSize: 10.5, marginTop: 10, lineHeight: 1.7 } },
          '打开后行情在整个窗口里飘过，鼠标穿透、不挡操作；顶部胶囊仍在，点它看全部报价。',
          prefersReducedMotion() ? ' 系统已开启「减少动态效果」，弹幕会自动保持关闭。' : ''),
      )
    }

    function Dialog() {
      const {
        snapshot: snap, open: visible, selection: shown, width: capsuleWidth,
        stocks: watchlist, scheme: theme, danmaku: config,
      } = useShared()
      const [view, setView] = React.useState('quotes')

      React.useEffect(() => {
        if (!visible) {
          setView('quotes')
          return undefined
        }
        const onKey = (event) => {
          if (event.key !== 'Escape') return
          if (view === 'quotes') setOpen(false)
          else setView('quotes')
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
      }, [visible, view])

      if (!visible) return null

      const total = shown.indices.length + shown.metals.length + shown.boards.length + watchlist.length
      const title = view === 'content' ? '选择显示内容' : view === 'appearance' ? '显示设置' : 'A股行情'
      const aside = view === 'content'
        ? `${total} 项`
        : view === 'appearance'
          ? `${capsuleWidth} px`
          : `${snap.market.state}${snap.at ? ` · ${clockOf(snap.at)}` : ''}`

      const head = h('div', {
        style: {
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          marginBottom: 6, paddingBottom: 6,
          borderBottom: `1px solid ${LINE}`,
        },
      },
        h('span', { style: { fontSize: 14, fontWeight: 600, letterSpacing: 0.3 } }, title),
        h('span', { style: { color: FAINT, fontSize: 11, fontFamily: MONO } }, aside),
      )

      const close = h('span', {
        role: 'button',
        tabIndex: 0,
        'aria-label': '关闭',
        style: { color: QUIET, cursor: 'pointer', fontSize: 16, lineHeight: '16px', padding: '0 2px' },
        onClick: () => setOpen(false),
      }, '×')

      let content
      if (view === 'content') {
        content = h(ContentPicker)
      } else if (view === 'appearance') {
        content = h('div', { className: 'dsh-index-body' }, h(Appearance))
      } else {
        const pick = (items, codes) => codes
          .map((code) => items.find((entry) => entry.code === code))
          .filter(Boolean)
        const stockRows = watchlist.map((stock) => {
          const secid = stockSecid(stock.code)
          return quoteRow(secid, stock.name, snap.quotes[secid])
        })

        const body = snap.at === 0 && snap.stale
          ? [h('div', {
            key: 'none',
            style: { color: QUIET, fontSize: 12, padding: '18px 0', textAlign: 'center' },
          }, '行情不可用，稍后自动重试')]
          : [
            breadthLine(snap.breadth),
            sectionTitle('大盘指数'),
            shown.indices.length > 0 ? headerRow() : null,
            ...pick(INDICES, shown.indices).map((entry) => quoteRow(entry.secid, entry.name, snap.quotes[entry.secid])),
            shown.indices.length === 0 ? emptyLine('i0', '已全部隐藏，点下方「选择内容」重新勾选') : null,
            sectionTitle('贵金属'),
            ...pick(METALS, shown.metals).map((entry) => quoteRow(entry.secid, entry.name, snap.quotes[entry.secid])),
            shown.metals.length === 0 ? emptyLine('m0', '已全部隐藏，点下方「选择内容」重新勾选') : null,
            sectionTitle('自选股'),
            ...stockRows,
            watchlist.length === 0 ? emptyLine('s0', '还没有自选股，点下方「选择内容」添加代码') : null,
            sectionTitle('自选板块'),
            ...pick(BOARDS, shown.boards).map((entry) => quoteRow(`90.${entry.code}`, entry.name, snap.quotes[`90.${entry.code}`])),
            shown.boards.length === 0 ? emptyLine('b0', '还没有自选板块，点下方「选择内容」挑几个') : null,
          ]
        content = h('div', { className: 'dsh-index-body' }, body.filter(Boolean))
      }

      const btn = (label, onClick) => h('span', {
        className: 'dsh-index-btn',
        role: 'button',
        tabIndex: 0,
        onClick,
      }, label)

      const actions = view === 'quotes'
        ? [
          btn(config.on ? '弹幕开' : '弹幕关', () => setDanmaku({ on: !config.on })),
          btn('选择内容', () => setView('content')),
          btn('设置', () => setView('appearance')),
          btn('刷新', () => refresh()),
        ]
        : [btn('完成', () => setView('quotes'))]

      const footText = view !== 'quotes'
        ? '改动即时生效并记住'
        : snap.stale
          ? '连不上行情源，正在重试'
          : snap.market.live
            ? '交易中，每 5 秒刷新 · 东财'
            : `${snap.market.state}，每分钟刷新 · 东财`

      const foot = h('div', {
        style: {
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 10, color: FAINT, fontSize: 10.5,
        },
      },
        h('span', null, footText),
        h('span', { style: { display: 'inline-flex', gap: 6 } }, actions),
      )

      return h('div', {
        style: backdropStyle,
        onMouseDown: (event) => { if (event.target === event.currentTarget) setOpen(false) },
      }, h('div', {
        className: 'dsh-index-panel',
        'data-scheme': theme,
        style: panelStyle,
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': 'A股行情',
      },
        h('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 8 } },
          h('div', { style: { flex: 1 } }, head),
          close,
        ),
        content,
        foot,
      ))
    }

    /**
     * Read the active color scheme from the theme service and keep the roots
     * in sync when the user flips the preference or the OS scheme.
     */
    function followTheme(ctx) {
      let service = null
      try {
        service = ctx.get('theme')
      } catch { /* the service is optional; fall back to dark */ }
      if (!service || typeof service.getTheme !== 'function') return

      const detect = () => {
        const active = service.getTheme()?.active
        return active?.colorScheme === 'light' ? 'light' : 'dark'
      }

      scheme = detect()
      ctx.effect(() => ctx.on('theme/change', () => {
        const next = detect()
        if (next === scheme) return
        scheme = next
        emit()
      }), 'dsh-index-widget: theme sync')
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        followTheme(ctx)
        ctx.effect(injectStyles, 'dsh-index-widget: styles')
        ctx.effect(() => {
          startPolling()
          return () => stopPolling()
        }, 'dsh-index-widget: quote polling')
        ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register(
          { name: 'conversation.session.header.actions', id: 'dsh-index-widget-ticker', order: 20, label: 'A股行情' },
          Ticker,
        ))
        ctx.slots.inject('shell.overlay', () => ctx.slots.register(
          { name: 'shell.overlay', id: 'dsh-index-widget-danmaku', order: 10, label: 'A股弹幕' },
          Danmaku,
        ))
        ctx.slots.inject('shell.overlay', () => ctx.slots.register(
          { name: 'shell.overlay', id: 'dsh-index-widget-dialog', order: 20, label: 'A股行情' },
          Dialog,
        ))
      },
    }
  },
})
