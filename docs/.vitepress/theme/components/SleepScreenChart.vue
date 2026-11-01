<script setup lang="ts">
const MIN = 6
const MAX = 18

const ROWS = [
  {
    age: '0–3 月',
    sleep: [14, 17],
    screen: '0（视频通话除外）',
    move: '俯卧时间累计 ≥30 分钟',
    src: 'AASM / 卫健委'
  },
  { age: '4–12 月', sleep: [12, 16], screen: '0', move: '俯卧时间累计 ≥30 分钟；多爬', src: 'AASM / AAP' },
  {
    age: '1–2 岁',
    sleep: [11, 14],
    screen: '18 月龄前保持 0；18–24 月只陪看高质量内容',
    move: '全天活动 ≥180 分钟（卫健委：12–24 月 ≥3 小时）',
    src: 'AASM / AAP / 卫健委'
  },
  {
    age: '3–5 岁',
    sleep: [10, 13],
    screen: '≤1 小时/天，越少越好',
    move: '≥180 分钟，其中 ≥60 分钟中高强度；户外 ≥120 分钟',
    src: 'AASM / AAP / WHO'
  },
  {
    age: '6–12 岁',
    sleep: [9, 12],
    screen: '不给固定小时数；硬约束是不得挤占睡眠、运动、户外、面对面',
    move: '每天 ≥60 分钟中高强度；户外 ≥2 小时（近视防控）',
    src: 'AASM / AAP / 教育部'
  },
  {
    age: '13–18 岁',
    sleep: [8, 10],
    screen: '夜间设备在卧室外充电；同上硬约束',
    move: '每天 ≥60 分钟中高强度，每周 ≥3 天高强度',
    src: 'AASM / AAP'
  },
  {
    age: '18–25 岁',
    sleep: [7, 9],
    screen: '自己定的规则也算规则',
    move: '已经不在儿童标准覆盖范围里',
    src: 'NSF（非 AASM 共识）',
    soft: true
  }
]

const pos = (h: number) => `${((h - MIN) / (MAX - MIN)) * 100}%`
const span = (a: number, b: number) => `${((b - a) / (MAX - MIN)) * 100}%`
</script>

<template>
  <div class="cr-ssc cr-widget" data-listen="skip">
    <div class="cr-widget-head">
      <span class="cr-widget-title">Sleep / Screen / Move · 三条硬指标</span>
      <p class="cr-widget-sub">横轴 6–18 小时。这是范围，不是及格线</p>
    </div>

    <div class="cr-ssc-axis">
      <span v-for="h in [6, 8, 10, 12, 14, 16, 18]" :key="h">{{ h }}</span>
    </div>

    <div v-for="r in ROWS" :key="r.age" class="cr-ssc-row" :class="{ 'is-soft': r.soft }">
      <p class="cr-ssc-age">{{ r.age }}</p>
      <div class="cr-ssc-bar">
        <div class="cr-ssc-fill" :style="{ left: pos(r.sleep[0]), width: span(r.sleep[0], r.sleep[1]) }">
          <span>{{ r.sleep[0] }}–{{ r.sleep[1] }}h</span>
        </div>
      </div>
      <div class="cr-ssc-notes">
        <p><b>屏幕</b>{{ r.screen }}</p>
        <p><b>活动</b>{{ r.move }}</p>
      </div>
      <p class="cr-ssc-src">{{ r.src }}</p>
    </div>

    <p class="cr-cap">
      睡眠范围取自 <b>AASM 2016 共识</b>（AAP、CDC 采用）；屏幕与活动取 <b>AAP / WHO 2019</b> 与中国
      <b>卫健委 2022《3 岁以下婴幼儿健康养育照护指南》</b>。中国教育部对小学生要求 10 小时、初中 9 小时、高中
      8 小时。<b>18–25 岁那行是美国国家睡眠基金会的建议，不在 AASM 共识年龄范围内</b>，所以标成浅色。
    </p>
  </div>
</template>

<style scoped>
.cr-ssc-row {
  display: grid;
  grid-template-columns: 84px minmax(160px, 1fr) minmax(220px, 1.25fr);
  align-items: center;
  gap: 6px 16px;
  padding: 11px 0;
  border-top: 1px dashed var(--line);
}

.cr-ssc-row:first-of-type {
  border-top: 0;
}

.cr-ssc-axis {
  display: flex;
  justify-content: space-between;
  padding: 0 0 6px 100px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--faint);
}

.cr-ssc-age {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
}

.cr-ssc-bar {
  position: relative;
  height: 22px;
  border-radius: 999px;
  background: var(--panel-3);
  overflow: hidden;
}

.cr-ssc-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 78%, var(--ink)), var(--accent-bright));
  transition: filter 0.2s var(--ease);
}

.cr-ssc-row:hover .cr-ssc-fill {
  filter: brightness(1.12);
}

.cr-ssc-fill span {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 600;
  color: var(--accent-ink);
  white-space: nowrap;
}

.cr-ssc-notes {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cr-ssc-notes p {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--ink-2);
}

.cr-ssc-notes b {
  display: inline-block;
  min-width: 34px;
  margin-right: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--muted);
}

.cr-ssc-src {
  grid-column: 1 / -1;
  margin: 0;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--faint);
  text-align: right;
}

.is-soft .cr-ssc-age {
  color: var(--muted);
}

.is-soft .cr-ssc-fill {
  background: repeating-linear-gradient(
    45deg,
    color-mix(in srgb, var(--accent) 30%, var(--panel-3)),
    color-mix(in srgb, var(--accent) 30%, var(--panel-3)) 6px,
    var(--panel-3) 6px,
    var(--panel-3) 12px
  );
}

.is-soft .cr-ssc-fill span {
  color: var(--ink-2);
}

@media (max-width: 760px) {
  .cr-ssc-axis {
    display: none;
  }

  .cr-ssc-row {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 14px 0;
  }

  .cr-ssc-src {
    text-align: left;
  }
}
</style>
