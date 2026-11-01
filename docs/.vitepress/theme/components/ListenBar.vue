<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { onContentUpdated, useData, useRoute, useRouter, withBase } from 'vitepress'
import { articleRoot, collectBlocks } from '../extract'
import { FLAT, indexOfLink } from '../reading-order'
import {
  initSpeech,
  listen,
  loadPage,
  minutesOf,
  nextBlock,
  pause,
  play,
  prevBlock,
  progress,
  setNavigator,
  setScope,
  setSpeed,
  setVoice,
  stop,
  toggleZhOnly,
  totalChars
} from '../useSpeech'

const route = useRoute()
const router = useRouter()
const { site, page } = useData()

const showTools = ref(false)
const barEl = ref<HTMLElement | null>(null)

const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2]
const SCOPES: Array<{ key: 'page' | 'group' | 'site'; label: string }> = [
  { key: 'page', label: '本页' },
  { key: 'group', label: '本章' },
  { key: 'site', label: '全书' }
]

const base = computed(() => (site.value.base || '/').replace(/\/+$/, ''))
const hrefFor = (link: string) => `${base.value}${link}`

const linkFromRoute = computed(() =>
  '/' + (route.data.relativePath || 'index.md').replace(/\.md$/, '').replace(/(^|\/)index$/, '$1')
)

const pageMinutes = computed(() => (listen.blocks.length ? minutesOf(listen.blocks) : 0))
const remainingMinutes = computed(() => {
  if (!listen.blocks.length) return 0
  const rest = listen.blocks.slice(Math.max(0, listen.cursor)).reduce((s, b) => s + b.length, 0)
  return Math.max(0, Math.round(rest / (250 * listen.speed)))
})
const positionLabel = computed(() => {
  const i = indexOfLink(listen.link)
  return i < 0 ? '' : `${i + 1}/${FLAT.length}`
})
const headline = computed(() =>
  !listen.blocks.length
    ? '这一页没有正文'
    : listen.playing
      ? `第 ${Math.max(0, listen.cursor) + 1}/${listen.blocks.length} 段 · 本页还剩约 ${remainingMinutes.value} 分钟`
      : `本页约 ${pageMinutes.value} 分钟 · ${totalChars(listen.blocks)} 字`
)
const currentLine = computed(() => {
  const t = listen.blocks[Math.max(0, listen.cursor)] || listen.blocks[0] || ''
  return t.length > 64 ? `${t.slice(0, 64)}…` : t
})

function titleOf(root: Element | null) {
  return page.value.title || root?.querySelector('h1')?.textContent?.trim() || '这一页'
}

async function readDom(maxWait = 1600) {
  const started = Date.now()
  while (Date.now() - started < maxWait) {
    const root = articleRoot()
    const blocks = collectBlocks(root)
    if (blocks.length) return { link: linkFromRoute.value, title: titleOf(root), blocks }
    await new Promise((r) => setTimeout(r, 100))
    await nextTick()
  }
  const root = articleRoot()
  return { link: linkFromRoute.value, title: titleOf(root), blocks: collectBlocks(root) }
}

async function sync() {
  loadPage(await readDom(), true)
}

function onKey(e: KeyboardEvent) {
  if (!e.altKey) return
  if (e.code === 'KeyP') {
    e.preventDefault()
    listen.playing && !listen.paused ? pause() : play()
  } else if (e.code === 'ArrowRight' && listen.playing) {
    e.preventDefault()
    nextBlock()
  } else if (e.code === 'ArrowLeft' && listen.playing) {
    e.preventDefault()
    prevBlock()
  }
}

function publishHeight() {
  if (!barEl.value) return
  document.documentElement.style.setProperty('--cr-bar-h', `${Math.round(barEl.value.offsetHeight)}px`)
}

let ro: ResizeObserver | null = null

// 播放器只在客户端渲染：SSR 阶段扫不到正文，输出必然和首屏 DOM 不一致，会被判成 hydration mismatch
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
  initSpeech()
  setNavigator((link) => {
    void router.go(withBase(link))
  })
  window.addEventListener('keydown', onKey)
  nextTick(() => {
    void sync()
    publishHeight()
    if (typeof ResizeObserver !== 'undefined' && barEl.value) {
      ro = new ResizeObserver(publishHeight)
      ro.observe(barEl.value)
    }
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  ro?.disconnect()
  ro = null
  stop()
})

// 内容换页后重扫正文；若正在朗读，useSpeech 会从目录里的下一页接着念
onContentUpdated(() => {
  void sync()
})
</script>

<template>
  <aside v-if="mounted" ref="barEl" class="cr-listen" :class="{ 'is-playing': listen.playing && !listen.paused }"
         aria-label="听书播放器">
    <div class="cr-listen-progress" :style="{ width: listen.playing ? progress() + '%' : '0%' }"></div>

    <div class="cr-listen-inner">
      <div class="cr-listen-left">
        <button class="cr-l-btn cr-l-btn--main" :aria-label="listen.playing && !listen.paused ? '暂停' : '播放这一页'"
                @click="listen.playing && !listen.paused ? pause() : play()">
          <svg v-if="listen.playing && !listen.paused" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M8 5l12 7-12 7z" fill="currentColor" />
          </svg>
        </button>
        <button class="cr-l-btn" title="上一段（Alt+←）" aria-label="上一段" @click="prevBlock">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M6 5h2v14H6zM20 5l-10 7 10 7z" fill="currentColor" />
          </svg>
        </button>
        <button class="cr-l-btn" title="下一段（Alt+→）" aria-label="下一段" @click="nextBlock">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M16 5h2v14h-2zM4 5l10 7-10 7z" fill="currentColor" />
          </svg>
        </button>
      </div>

      <div class="cr-listen-meta">
        <p class="cr-l-eyebrow">
          <span class="cr-l-dot" :class="{ on: listen.playing && !listen.paused }"></span>
          LISTEN · 听书
          <template v-if="positionLabel"> · {{ positionLabel }}</template>
          <template v-if="pageMinutes"> · {{ headline }}</template>
        </p>
        <p class="cr-l-title">{{ listen.title || '正在读取本页…' }}</p>
        <p class="cr-l-line">{{ currentLine }}</p>
      </div>

      <div class="cr-listen-right">
        <div class="cr-l-seg" role="group" aria-label="连播范围">
          <button v-for="s in SCOPES" :key="s.key" :class="{ on: listen.scope === s.key }"
                  @click="setScope(s.key)">{{ s.label }}</button>
        </div>
        <div class="cr-l-seg cr-l-seg--speed" role="group" aria-label="语速">
          <button v-for="v in SPEEDS" :key="v" :class="{ on: listen.speed === v }"
                  @click="setSpeed(v)">{{ v }}×</button>
        </div>
        <label class="cr-l-voice">
          <span class="sr-only">声音</span>
          <select :value="listen.voiceURI" @change="setVoice(($event.target as HTMLSelectElement).value)">
            <option v-for="v in listen.voices" :key="v.voiceURI" :value="v.voiceURI">
              {{ v.name }}
            </option>
            <option v-if="!listen.voices.length" value="">加载中…</option>
          </select>
        </label>
        <button class="cr-l-link" @click="toggleZhOnly">{{ listen.zhOnly ? '全部声音' : '仅中文' }}</button>
        <button class="cr-l-link" @click="showTools = !showTools">{{ showTools ? '收起说明' : '怎么用' }}</button>
        <button class="cr-l-btn" title="停止" aria-label="停止朗读" @click="stop()">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <rect x="6" y="6" width="12" height="12" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>

    <p v-if="listen.error" class="cr-l-error">{{ listen.error }}</p>
    <p v-else-if="showTools" class="cr-l-hint">
      通勤用法：按下播放后切到「全书」，手机锁屏也能用系统播放器继续；Alt+P 播放/暂停。声音来自浏览器自带的中文语音，Edge 与 Chrome 的 Windows 声音（Xiaoxiao / YunxiNeural）最自然。
    </p>
  </aside>
</template>
