import { reactive } from 'vue'
import { FLAT, groupOf, indexOfLink, normalize } from './reading-order'

const CHUNK_LIMIT = 180

export type Scope = 'page' | 'group' | 'site'

export interface PagePayload {
  link: string
  title: string
  blocks: string[]
}

const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined

export const listen = reactive({
  supported: Boolean(synth),
  ready: false,
  playing: false,
  paused: false,
  link: '',
  title: '',
  blocks: [] as string[],
  cursor: -1,
  speed: 1,
  voiceURI: '',
  scope: 'site' as Scope,
  error: '',
  voices: [] as SpeechSynthesisVoice[],
  zhOnly: true
})

const store =
  typeof localStorage !== 'undefined'
    ? {
        get: (k: string) => localStorage.getItem(k),
        set: (k: string, v: string) => localStorage.setItem(k, v)
      }
    : { get: () => null, set: () => {} }

let epoch = 0
let goFn: ((link: string) => void) | null = null
let heart: ReturnType<typeof setInterval> | null = null

export const setNavigator = (fn: (link: string) => void) => {
  goFn = fn
}

const clean = (raw: string) =>
  raw
    .replace(/\u200b|\u00a0/g, ' ')
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()

// 把一个长段落切成口播友好的短句：不拆破折号后的补充，不拆小数点
function splitSentences(text: string): string[] {
  const out: string[] = []
  let buf = ''
  for (const ch of text) {
    buf += ch
    if ('。！？；…\n'.includes(ch) && buf.trim().length > 6) {
      out.push(buf.trim())
      buf = ''
    } else if (buf.length >= CHUNK_LIMIT) {
      const cut = Math.max(
        buf.lastIndexOf('，'),
        buf.lastIndexOf('、'),
        buf.lastIndexOf('：'),
        buf.lastIndexOf(',')
      )
      if (cut > 40) {
        out.push(buf.slice(0, cut + 1).trim())
        buf = buf.slice(cut + 1)
      }
    }
  }
  if (buf.trim()) out.push(buf.trim())
  return out.filter(Boolean)
}

export const blocksOf = (page: PagePayload): string[] =>
  page.blocks.flatMap((b) => splitSentences(clean(b))).filter((b) => b.length > 1)

export const totalChars = (blocks: string[]) => blocks.reduce((s, b) => s + b.length, 0)

export const minutesOf = (blocks: string[], speed = listen.speed) =>
  Math.max(1, Math.round(totalChars(blocks) / (250 * speed)))

const preferScore = (v: SpeechSynthesisVoice) => {
  const n = v.name.toLowerCase()
  let s = 0
  if (v.lang.toLowerCase().startsWith('zh')) s += 100
  if (v.localService) s += 8
  if (/xiaoxiao|yaoyao|yunxi|yunjian|ting|shuiwen|huihui|wanlingliang/.test(n)) s += 40
  if (/google/.test(n)) s += 12
  if (/enhanced|natural|online/.test(n)) s += 6
  if (/neural/.test(n)) s += 20
  return s
}

export function initSpeech() {
  if (!synth) {
    listen.error = '这个浏览器不支持语音合成，试试 Safari、Edge 或 Chrome。'
    return
  }
  const saved = store.get('cr-listen-speed')
  if (saved) listen.speed = Number(saved) || 1
  const savedScope = store.get('cr-listen-scope') as Scope | null
  if (savedScope && ['page', 'group', 'site'].includes(savedScope)) listen.scope = savedScope
  const load = () => {
    const all = synth.getVoices()
    if (!all.length) return
    const pool = listen.zhOnly ? all.filter((v) => v.lang.toLowerCase().startsWith('zh')) : all
    const voices = (pool.length ? pool : all).slice().sort((a, b) => preferScore(b) - preferScore(a))
    listen.voices = voices
    const savedVoice = store.get('cr-listen-voice')
    const picked = voices.find((v) => v.voiceURI === savedVoice) || voices[0]
    if (picked && !voices.some((v) => v.voiceURI === listen.voiceURI)) listen.voiceURI = picked.voiceURI
    listen.ready = true
  }
  load()
  synth.addEventListener?.('voiceschanged', load)
  if (!listen.ready) {
    // 部分浏览器首次 getVoices() 返回空数组，1 秒内通常会有 voiceschanged
    const t = setTimeout(load, 800)
    return () => clearTimeout(t)
  }
}

export const currentVoice = () => listen.voices.find((v) => v.voiceURI === listen.voiceURI)

export function setVoice(uri: string) {
  listen.voiceURI = uri
  store.set('cr-listen-voice', uri)
}

export function setSpeed(v: number) {
  listen.speed = v
  store.set('cr-listen-speed', String(v))
  if (listen.playing) restartFrom(listen.cursor)
}

export function setScope(s: Scope) {
  listen.scope = s
  store.set('cr-listen-scope', s)
}

export function toggleZhOnly() {
  listen.zhOnly = !listen.zhOnly
  initSpeech()
}

const keepAlive = () => {
  if (heart) clearInterval(heart)
  // Chrome 会在约 15 秒后静默掐断长句朗读，resume() 是无害的续命动作
  heart = setInterval(() => {
    if (synth && listen.playing && !listen.paused && synth.speaking) synth.resume()
  }, 9000)
}

export function stop() {
  epoch += 1
  listen.playing = false
  listen.paused = false
  listen.cursor = -1
  if (synth) synth.cancel()
  if (heart) {
    clearInterval(heart)
    heart = null
  }
  if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
    navigator.mediaSession.playbackState = 'paused'
    navigator.mediaSession.metadata = null
  }
  if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('cr-listen-resume')
}

/** 载入一页；若这页正在被朗读则保持进度不动 */
export function loadPage(page: PagePayload, autoResume = false) {
  const link = normalize(page.link)
  if (listen.playing && listen.link === link) return
  const blocks = blocksOf(page)
  const wasPlaying = listen.playing
  listen.blocks = blocks
  listen.link = link
  listen.title = page.title
  if (autoResume && wasPlaying && blocks.length) {
    const saved = readResumeCursor(link)
    restartFrom(saved === null ? 0 : Math.min(saved, blocks.length - 1))
  } else if (wasPlaying && blocks.length) {
    restartFrom(0)
  }
}

const readResumeCursor = (link: string): number | null => {
  if (typeof sessionStorage === 'undefined') return null
  try {
    const raw = sessionStorage.getItem('cr-listen-resume')
    if (!raw) return null
    const o = JSON.parse(raw)
    return o.link === link && typeof o.cursor === 'number' ? o.cursor : null
  } catch {
    return null
  }
}

export function nextLink(): string | null {
  if (listen.scope === 'page') return null
  const i = indexOfLink(listen.link)
  // 首页不在目录里，但按顺序听的人通常就是从首页按下去的
  if (i < 0) return listen.link === '/' ? normalize(FLAT[0].link) : null
  const next = FLAT[i + 1]
  if (!next) return null
  if (listen.scope === 'group' && groupOf(next.link) !== groupOf(listen.link)) return null
  return normalize(next.link)
}

export function prevLink(): string | null {
  const i = indexOfLink(listen.link)
  if (i <= 0) return null
  return normalize(FLAT[i - 1].link)
}

function restartFrom(cursor: number) {
  epoch += 1
  if (synth) synth.cancel()
  listen.cursor = cursor
  listen.playing = true
  listen.paused = false
  keepAlive()
  speak()
}

export function play() {
  if (!listen.supported) {
    listen.error = '这个浏览器不支持语音合成，试试 Safari、Edge 或 Chrome。'
    return
  }
  if (!listen.blocks.length) {
    listen.error = '这一页没有可朗读的正文。'
    return
  }
  listen.error = ''
  if (listen.paused) {
    listen.paused = false
    if (synth) synth.resume()
    updateMedia('play')
    return
  }
  if (listen.playing) return
  restartFrom(listen.cursor >= 0 ? listen.cursor : 0)
}

export function pause() {
  if (!listen.playing) return
  listen.paused = true
  if (synth) synth.pause()
  updateMedia('pause')
}

export function toggle() {
  if (!listen.playing) play()
  else if (listen.paused) play()
  else pause()
}

export function jump(cursor: number) {
  if (cursor < 0 || cursor >= listen.blocks.length) return
  restartFrom(cursor)
}

export function nextBlock() {
  if (listen.cursor + 1 < listen.blocks.length) restartFrom(listen.cursor + 1)
  else advancePage()
}

export function prevBlock() {
  if (listen.cursor > 0) restartFrom(listen.cursor - 1)
}

function advancePage() {
  const i = indexOfLink(listen.link)
  const link = nextLink()
  if (!link) {
    stop()
    listen.error =
      i < 0
        ? '这一页不在目录顺序里，连播先停在这里。从左侧目录挑一页就能接着听。'
        : '按现在的连播范围，这就是最后一段了。要听得更长，把范围切成“全书”。'
    return
  }
  if (goFn) {
    // 先记下下一页的起点，路由切换后由 loadPage 接续
    if (typeof sessionStorage !== 'undefined')
      sessionStorage.setItem('cr-listen-resume', JSON.stringify({ link, cursor: 0 }))
    goFn(link)
  } else {
    stop()
  }
}

function speak() {
  if (!synth) return
  const myEpoch = epoch
  const text = listen.blocks[listen.cursor]
  if (!text) {
    stop()
    return
  }
  const u = new SpeechSynthesisUtterance(text)
  const v = currentVoice()
  if (v) {
    u.voice = v
    u.lang = v.lang
  } else u.lang = 'zh-CN'
  u.rate = listen.speed
  u.pitch = 1
  u.volume = 1
  u.onend = () => {
    if (myEpoch !== epoch) return
    if (listen.cursor + 1 < listen.blocks.length) {
      listen.cursor += 1
      saveResume()
      speak()
    } else advancePage()
  }
  u.onerror = (ev) => {
    if (myEpoch !== epoch) return
    const err = (ev as SpeechSynthesisErrorEvent).error
    if (err === 'interrupted' || err === 'canceled') return
    listen.error = `朗读中断（${err}）。可以点播放重试，或换一个声音。`
    listen.playing = false
    listen.paused = false
  }
  if (typeof sessionStorage !== 'undefined') saveResume()
  updateMedia('play')
  synth.speak(u)
}

function saveResume() {
  try {
    sessionStorage.setItem(
      'cr-listen-resume',
      JSON.stringify({ link: listen.link, cursor: listen.cursor })
    )
  } catch {
    /* 隐私模式下 sessionStorage 会抛错，忽略 */
  }
}

function updateMedia(state: 'play' | 'pause') {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
  const ms = navigator.mediaSession
  try {
    ms.playbackState = state === 'play' ? 'playing' : 'paused'
    if (state === 'play') {
      ms.metadata =
        new MediaMetadata({
          title: listen.title || '养育手册',
          artist: '鱼心快跑 · 从出生到大学毕业',
          album: '一本可以听的养育手册'
        })
      ms.setActionHandler('play', () => play())
      ms.setActionHandler('pause', () => pause())
      ms.setActionHandler('previoustrack', () => prevBlock())
      ms.setActionHandler('nexttrack', () => nextBlock())
    }
  } catch {
    /* 老浏览器没有 MediaMetadata，锁屏控制只是降级，不影响朗读 */
  }
}

export const progress = () =>
  listen.blocks.length ? Math.round(((listen.cursor + 1) / listen.blocks.length) * 100) : 0
