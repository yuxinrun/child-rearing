<script setup lang="ts">
const W = 460
const H = 210
const PAD = { l: 34, r: 12, t: 16, b: 26 }
const AGE = [6, 18]
const VEL = [0, 11]

const GIRLS: Array<[number, number]> = [
  [6, 5.5], [8, 5.4], [9, 5.6], [10, 6.3], [11, 7.7], [11.8, 8.5],
  [13, 6.2], [14, 4.0], [15, 2.2], [16, 1.2], [18, 0.3]
]
const BOYS: Array<[number, number]> = [
  [6, 5.5], [8, 5.6], [10, 5.8], [11, 6.3], [12, 7.4], [13, 9.3],
  [13.8, 10], [15, 7.2], [16, 4.6], [17, 2.4], [18, 0.9]
]

const px = (age: number) => PAD.l + ((age - AGE[0]) / (AGE[1] - AGE[0])) * (W - PAD.l - PAD.r)
const py = (v: number) => H - PAD.b - (v / VEL[1]) * (H - PAD.b - PAD.t)
const line = (pts: Array<[number, number]>) =>
  pts.map(([a, v], i) => `${i ? 'L' : 'M'}${px(a).toFixed(1)},${py(v).toFixed(1)}`).join(' ')
</script>

<template>
  <div class="cr-gw cr-widget" data-listen="skip">
    <div class="cr-widget-head">
      <span class="cr-widget-title">Growth Window · 身高速度曲线</span>
      <p class="cr-widget-sub">同一个孩子，男孩女孩能差出两年——这解释了大量"初中座位表"式的问题</p>
    </div>

    <svg class="cr-gw-svg" :viewBox="`0 0 ${W} ${H}`" role="img"
         aria-label="身高增长速度示意图：女孩峰值约每年 8.5 厘米且出现更早，男孩峰值约每年 10 厘米且晚约两年">
      <g class="cr-gw-grid">
        <line v-for="v in [0, 3, 6, 9]" :key="v" :x1="PAD.l" :x2="W - PAD.r" :y1="py(v)" :y2="py(v)" />
      </g>
      <!-- 男孩峰值窗口 -->
      <rect class="cr-gw-band" :x="px(13)" :y="PAD.t" :width="px(15) - px(13)" :height="H - PAD.b - PAD.t" />
      <path class="cr-gw-girl" :d="line(GIRLS)" fill="none" />
      <path class="cr-gw-boy" :d="line(BOYS)" fill="none" />
      <circle class="cr-gw-dot g" :cx="px(11.8)" :cy="py(8.5)" r="3.4" />
      <circle class="cr-gw-dot b" :cx="px(13.8)" :cy="py(10)" r="3.4" />
      <g class="cr-gw-ylab">
        <text v-for="v in [0, 3, 6, 9]" :key="v" :x="PAD.l - 7" :y="py(v) + 3.5">{{ v }}</text>
      </g>
      <g class="cr-gw-xlab">
        <text v-for="a in [6, 9, 12, 15, 18]" :key="a" :x="px(a)" :y="H - 8">{{ a }}</text>
      </g>
      <text class="cr-gw-note" :x="px(11.8) - 4" :y="py(8.5) - 9" text-anchor="end">女 峰值 8.5</text>
      <text class="cr-gw-note" :x="px(13.8) + 6" :y="py(10) - 7">男 峰值 10</text>
    </svg>

    <div class="cr-gw-legend">
      <span><i class="g"></i>女孩：全年增长约 +25cm，初潮后 1.5–2 年基本完成</span>
      <span><i class="b"></i>男孩：全年增长约 +30cm，峰值晚约 2 年出现</span>
    </div>

    <p class="cr-cap">
      <b>曲线形状是示意</b>（各研究的峰值年龄有出入，个体差异更大），两个峰值和成年增长总量取可核数据。
      实用结论只有三条：一是<b>别用同龄孩子的静止身高判断"还能长多少"</b>；二是女孩提前近两年进入猛长期，
      班级里"最安静的成熟"和"最吵的幼稚"可能只是差了一整个发育阶段；三是这段窗口期里，睡眠与能量摄入
      不是生活习惯问题，是原料供应问题。
    </p>
  </div>
</template>

<style scoped>
.cr-gw-svg {
  display: block;
  width: 100%;
  height: auto;
}

.cr-gw-grid line {
  stroke: var(--line);
  stroke-width: 1;
  stroke-dasharray: 3 5;
}

.cr-gw-band {
  fill: color-mix(in srgb, var(--blue) 12%, transparent);
}

.cr-gw-girl {
  stroke: var(--coral);
  stroke-width: 2.4;
  stroke-linecap: round;
}

.cr-gw-boy {
  stroke: var(--blue);
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-dasharray: 7 4;
}

.cr-gw-dot.g {
  fill: var(--coral);
}

.cr-gw-dot.b {
  fill: var(--blue);
}

.cr-gw-ylab text,
.cr-gw-xlab text {
  font-family: var(--font-mono);
  font-size: 9px;
  fill: var(--faint);
}

.cr-gw-xlab text {
  text-anchor: middle;
}

.cr-gw-note {
  font-family: var(--font-mono);
  font-size: 9.5px;
  fill: var(--ink-2);
}

.cr-gw-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  margin-top: 8px;
  font-size: 12px;
  color: var(--ink-2);
}

.cr-gw-legend span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.cr-gw-legend i {
  width: 16px;
  height: 3px;
  border-radius: 3px;
}

.cr-gw-legend i.g {
  background: var(--coral);
}

.cr-gw-legend i.b {
  background: repeating-linear-gradient(90deg, var(--blue), var(--blue) 5px, transparent 5px, transparent 8px);
}

@media (max-width: 640px) {
  .cr-gw-note {
    font-size: 8px;
  }
}
</style>
