<script setup lang="ts">
const LINES = [
  { age: 1.5, t: '屏幕为 0', who: 'AAP', d: '18 月龄前除了视频通话不接触屏幕；卫健委口径更严：2 岁内不建议', kind: 'health' },
  { age: 3, t: '屏幕 ≤1 小时/天', who: 'AAP / WHO', d: '2–5 岁每天不超过 1 小时，越少越好', kind: 'health' },
  { age: 6, t: '不得独自用开放式生成', who: '教育部', d: '小学阶段禁止学生独自使用开放式内容生成功能（2025 年版指南）', kind: 'cn' },
  { age: 10, t: '不应使用社交媒体', who: 'AAP', d: '同时明确承认：现有证据还不足以给出"安全最低年龄"', kind: 'health' },
  { age: 13, t: '课堂生成式 AI 的建议起点', who: 'UNESCO', d: '另一条国内线：初中可适度探索"对生成内容做逻辑性分析"', kind: 'intl' },
  { age: 14, t: '个人信息属敏感信息', who: '《个保法》第 31 条', d: '不满 14 周岁需监护人同意才能处理——这是你替孩子管账号的法律依据', kind: 'cn' },
  { age: 16, t: '社交媒体禁令（澳大利亚）', who: '澳洲 2024 立法', d: '2025-12-10 起分阶段执行；欧盟 KIDS Act 目前仍是"拟"', kind: 'intl' },
  { age: 18, t: '禁止虚拟亲密关系服务', who: '《人工智能拟人化互动服务管理暂行办法》', d: '2026-07-15 施行，明确不得向未成年人提供虚拟伴侣类亲密关系服务', kind: 'cn' }
]

const MAXAGE = 19
const x = (a: number) => `${(a / MAXAGE) * 100}%`
</script>

<template>
  <div class="cr-al cr-widget" data-listen="skip">
    <div class="cr-widget-head">
      <span class="cr-widget-title">Age Lines · 各机构画的年龄线</span>
      <p class="cr-widget-sub">同一件事，不同机构给的岁数并不一致——这很正常，它们量的是不同风险</p>
    </div>

    <div class="cr-al-axis">
      <div class="cr-al-rail"></div>
      <span v-for="a in [0, 3, 6, 9, 12, 15, 18]" :key="a" class="cr-al-tick" :style="{ left: x(a) }">{{ a }}</span>
    </div>

    <ol class="cr-al-list">
      <li v-for="(l, i) in LINES" :key="l.t" class="cr-al-item" :class="`k-${l.kind}`">
        <span class="cr-al-age">{{ l.age % 1 === 0 ? l.age : l.age.toFixed(1) }}</span>
        <div class="cr-al-body">
          <strong>{{ l.t }}</strong>
          <p>{{ l.d }}</p>
          <em>{{ l.who }}<template v-if="i === 4"> · 二手来源，具体岁数各国有出入</template></em>
        </div>
      </li>
    </ol>

    <p class="cr-cap">
      岁数标在轴上，<b>但不要读成"到点解锁"</b>。这些线里只有两条是硬约束：<b>不满 14 周岁的个人信息处理</b>和<b>面向未成年人的虚拟亲密关系服务</b>——它们罚的是服务商，不是你家孩子。其余都是建议，用途是帮你想清楚"这件事我现在该不该放手"。
    </p>
  </div>
</template>

<style scoped>
.cr-al-axis {
  position: relative;
  height: 30px;
  margin: 0 0 18px;
}

.cr-al-rail {
  position: absolute;
  inset: 14px 0 auto;
  height: 2px;
  background: repeating-linear-gradient(90deg, var(--line-strong), var(--line-strong) 5px, transparent 5px, transparent 10px);
}

.cr-al-tick {
  position: absolute;
  top: 18px;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--faint);
}

.cr-al-tick::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  width: 1px;
  height: 5px;
  background: var(--line-strong);
}

.cr-al-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.cr-al-item {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-left: 3px solid var(--accent);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  background: var(--panel);
}

.k-health {
  border-left-color: var(--blue);
}

.k-intl {
  border-left-color: var(--lime);
}

.k-cn {
  border-left-color: var(--coral);
}

.cr-al-age {
  font-family: var(--font-mono);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.04em;
  color: var(--ink);
}

.cr-al-body strong {
  display: block;
  font-size: 13.5px;
  font-weight: 730;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.cr-al-body p {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 1.55;
  color: var(--ink-2);
}

.cr-al-body em {
  display: block;
  margin-top: 6px;
  font-family: var(--font-mono);
  font-style: normal;
  font-size: 10.5px;
  letter-spacing: 0.04em;
  color: var(--muted);
}

@media (max-width: 900px) {
  .cr-al-list {
    grid-template-columns: 1fr;
  }

  .cr-al-axis {
    display: none;
  }
}
</style>
