<script setup lang="ts">
import { withBase } from 'vitepress'

const STAGES = [
  { age: '0–1', name: '新手运维期', hook: '除了吃和睡，他只在测你的反应速度', link: '/map/s0-1', tone: 'a' },
  { age: '1–3', name: '第一个“不要”期', hook: '自我意识正在开机，抑制功能还没装', link: '/map/s1-3', tone: 'b' },
  { age: '3–6', name: '游戏就是工作', hook: '别把小学课本搬进幼儿园', link: '/map/s3-6', tone: 'c' },
  { age: '6–9', name: '勤奋或自卑', hook: '他开始拿自己和别人比了', link: '/map/s6-9', tone: 'a' },
  { age: '9–12', name: '青春期前夜', hook: '身体先动，睡眠节奏先乱', link: '/map/s9-12', tone: 'b' },
  { age: '12–15', name: '初中三年', hook: '同伴开始比父母更有说服力', link: '/map/s12-15', tone: 'c' },
  { age: '15–18', name: '高中与考学前', hook: '缺觉是第一位的生理风险', link: '/map/s15-18', tone: 'a' },
  { age: '18–22', name: '大学与放手', hook: '第一次同时管日程、钱和身体', link: '/map/s18-22', tone: 'b' }
]

defineProps<{ variant?: 'hero' | 'band' }>()
</script>

<template>
  <div v-if="variant === 'hero'" class="cr-stl" data-listen="skip">
    <p class="cr-stl-eyebrow">0 → 22 岁 · 八段</p>
    <ol class="cr-stl-list">
      <li v-for="s in STAGES" :key="s.age">
        <a :href="withBase(s.link)">
          <span class="cr-stl-age">{{ s.age }}</span>
          <span class="cr-stl-name">{{ s.name }}</span>
          <span class="cr-stl-tick" :class="s.tone"></span>
        </a>
      </li>
    </ol>
    <p class="cr-stl-foot">每段都能听。通勤单程大约两页。</p>
  </div>

  <div v-else class="cr-stb cr-widget cr-widget--dash" data-listen="skip">
    <div class="cr-widget-head">
      <span class="cr-widget-title">Stage Map · 阶段地图</span>
      <p class="cr-widget-sub">点任意一段直接跳过去；顺序就是连播顺序</p>
    </div>
    <div class="cr-stb-grid">
      <a v-for="(s, i) in STAGES" :key="s.age" class="cr-stb-card" :class="`tone-${s.tone}`"
         :href="withBase(s.link)">
        <b>{{ String(i + 1).padStart(2, '0') }}</b>
        <span class="cr-stb-age">{{ s.age }} 岁</span>
        <strong>{{ s.name }}</strong>
        <p>{{ s.hook }}</p>
      </a>
    </div>
  </div>
</template>

<style scoped>
.cr-stl {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--panel) 72%, transparent);
}

.cr-stl-eyebrow,
.cr-stl-foot {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

.cr-stl-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.cr-stl-list a {
  display: grid;
  grid-template-columns: 54px 1fr 10px;
  align-items: center;
  gap: 10px;
  padding: 7px 10px;
  border-radius: 10px;
  border: 1px solid transparent;
  color: var(--ink-2);
  text-decoration: none;
  transition: border-color 0.2s var(--ease), background 0.2s var(--ease), transform 0.2s var(--ease);
}

.cr-stl-list a:hover {
  border-color: color-mix(in srgb, var(--accent) 45%, var(--line));
  background: var(--accent-soft);
  transform: translateX(3px);
}

.cr-stl-age {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--accent);
}

.cr-stl-name {
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.cr-stl-tick {
  width: 7px;
  height: 7px;
  border-radius: 2px;
  background: var(--accent);
}

.cr-stl-tick.b {
  background: var(--blue);
}

.cr-stl-tick.c {
  background: var(--coral);
}

.cr-stb-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.cr-stb-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 15px 15px 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--panel);
  text-decoration: none;
  overflow: hidden;
  transition: transform 0.24s var(--ease), border-color 0.24s var(--ease), box-shadow 0.24s var(--ease);
}

.cr-stb-card::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  height: 3px;
  background: var(--cr-c, var(--accent));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s var(--ease);
}

.cr-stb-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--cr-c, var(--accent)) 50%, var(--line));
  box-shadow: var(--shadow);
}

.cr-stb-card:hover::after {
  transform: scaleX(1);
}

.tone-a { --cr-c: var(--accent); }
.tone-b { --cr-c: var(--blue); }
.tone-c { --cr-c: var(--coral); }

.cr-stb-card > b {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--faint);
  letter-spacing: 0.1em;
}

.cr-stb-age {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--cr-c, var(--accent));
  font-weight: 600;
}

.cr-stb-card strong {
  font-size: 15px;
  font-weight: 760;
  letter-spacing: -0.025em;
  color: var(--ink);
}

.cr-stb-card p {
  margin: 2px 0 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--muted);
}

@media (max-width: 1080px) {
  .cr-stb-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .cr-stb-grid {
    grid-template-columns: 1fr;
  }

  .cr-widget {
    padding: 18px 16px 16px;
  }
}
</style>
