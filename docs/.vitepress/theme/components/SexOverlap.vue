<script setup lang="ts">
const W = 320
const H = 130

const DIFFS = [
  { t: '青春期启动时间', d: '男孩平均晚约 1–2 年', s: '可核' },
  { t: '生长窗口与成年身高', d: '女孩全年长 +25cm（峰值 8.5cm/年），初潮后 1.5–2 年基本完成；男孩 +30cm（峰值 10cm/年）', s: '可核' },
  { t: '青少年昼夜时相', d: '2025 年研究：女孩褪黑素启动早约 96 分钟，男孩生理夜长多约 60 分钟', s: '可核' },
  { t: '器械控制类运动', d: '击打、踢球、投掷 SMD 0.35–0.46；跑跳爬等位移技能无差异，成因更可能是练习量', s: '可核' }
]

const pdf = (x: number, mu: number) => Math.exp(-((x - mu) ** 2) / 2)

const curve = (mu: number) => {
  const pts: string[] = []
  for (let i = 0; i <= 64; i += 1) {
    const x = -4 + (i * 8) / 64
    const px = ((x + 4) / 8) * W
    const py = H - 12 - pdf(x, mu) * (H - 30)
    pts.push(`${px.toFixed(1)},${py.toFixed(1)}`)
  }
  return `M${pts.join(' L')}`
}

const props = defineProps<{ shift?: number }>()
const shift = () => (props.shift ?? 0.35) / 2
</script>

<template>
  <div class="cr-so cr-widget" data-listen="skip">
    <div class="cr-widget-head">
      <span class="cr-widget-title">Overlap · 两个分布长什么样</span>
      <p class="cr-widget-sub">均值差 {{ (shift() * 2).toFixed(2) }} 个标准差时，两条曲线几乎完全重合</p>
    </div>

    <div class="cr-so-body">
      <div>
        <svg class="cr-so-svg" :viewBox="`0 0 ${W} ${H}`" role="img"
             aria-label="两条几乎完全重合的分布曲线，均值差约 0.35 个标准差：两性之间的差距远小于同性别内部的差距">
          <line :x1="0" :y1="H - 12" :x2="W" :y2="H - 12" stroke="var(--line-strong)" stroke-width="1" />
          <path :d="curve(-shift())" fill="none" stroke="var(--blue)" stroke-width="2.2" />
          <path :d="curve(shift())" fill="none" stroke="var(--coral)" stroke-width="2.2" stroke-dasharray="6 4" />
          <line :x1="W / 2 - shift() * (W / 8)" :y1="14" :x2="W / 2 - shift() * (W / 8)" :y2="H - 12"
                stroke="var(--blue)" stroke-width="1" stroke-dasharray="2 3" opacity="0.55" />
          <line :x1="W / 2 + shift() * (W / 8)" :y1="14" :x2="W / 2 + shift() * (W / 8)" :y2="H - 12"
                stroke="var(--coral)" stroke-width="1" stroke-dasharray="2 3" opacity="0.55" />
        </svg>
        <p class="cr-so-legend">
          <span><i style="background: var(--blue)"></i>女孩分布</span>
          <span><i style="background: var(--coral)"></i>男孩分布</span>
          <span>两条虚线是各自均值</span>
        </p>
      </div>

      <ol class="cr-so-list">
        <li v-for="(d, i) in DIFFS" :key="d.t">
          <b>{{ String(i + 1).padStart(2, '0') }}</b>
          <div>
            <strong>{{ d.t }}</strong>
            <p>{{ d.d }}</p>
          </div>
        </li>
      </ol>
    </div>

    <p class="cr-cap">
      曲线形状是<b>示意</b>，只用来表达"分布几乎重叠"这一件事。真正可核的四条差异列在右边——除此之外，
      大多数被反复引用的"男女不同"，效应量都小到不足以指导你怎么跟眼前这个孩子说话。
    </p>
  </div>
</template>

<style scoped>
.cr-so-body {
  display: grid;
  grid-template-columns: minmax(220px, 340px) 1fr;
  gap: 20px;
  align-items: start;
}

.cr-so-svg {
  width: 100%;
  height: auto;
  background: var(--panel-2);
  border: 1px dashed var(--line);
  border-radius: var(--radius-sm);
}

.cr-so-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  margin: 9px 0 0;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--muted);
}

.cr-so-legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.cr-so-legend i {
  width: 14px;
  height: 2px;
  border-radius: 2px;
}

.cr-so-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cr-so-list li {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 10px;
  padding-bottom: 9px;
  border-bottom: 1px dashed var(--line);
}

.cr-so-list li:last-child {
  border-bottom: 0;
}

.cr-so-list b {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--faint);
}

.cr-so-list strong {
  display: block;
  font-size: 13px;
  font-weight: 720;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.cr-so-list p {
  margin: 3px 0 0;
  font-size: 12px;
  line-height: 1.55;
  color: var(--ink-2);
}

@media (max-width: 860px) {
  .cr-so-body {
    grid-template-columns: 1fr;
  }
}
</style>
