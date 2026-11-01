<script setup lang="ts">
type Stat = { v: string; label: string; note: string; tone?: string }

const SETS: Record<string, { title: string; sub: string; caveat: string; items: Stat[] }> = {
  ai: {
    title: 'Numbers · AI 时代六个数',
    sub: '前三个说岗位，后三个说孩子',
    caveat:
      'WEF 那份是<b>雇主意图调查</b>，不是已发生的测量；Anthropic 那份测的是<b>暴露度</b>，暴露不等于替代——它统计的是"这项任务能被 AI 完成"，不是"这个人已被取代"。',
    items: [
      { v: '39%', label: '核心技能会改变或过时', note: 'WEF《未来就业 2025》，到 2030 年' },
      { v: '74.5%', label: '程序员任务被 AI 覆盖的比例', note: 'Anthropic 真实使用数据，全职业最高', tone: 'b' },
      { v: '11.7%', label: '所在职业 90% 以上任务被覆盖的劳动者', note: '约一半被覆盖的职业几乎没受影响', tone: 'c' },
      { v: '−19%', label: '22–25 岁在高暴露职业的就业（相对反事实）', note: '斯坦福 2026，资深员工未受影响', tone: 'c' },
      { v: '−25 分', label: 'OECD 平均阅读分变化（PISA 2025）', note: '超过一年的学习量；富裕家庭降幅最大', tone: 'c' },
      { v: '33.8%', label: '中国 19 岁及以下生成式 AI 用户占比', note: '约 1.86 亿人，最大年龄段（CNNIC 2025）', tone: 'b' }
    ]
  },
  gender: {
    title: 'Effect Size · 差异到底有多大',
    sub: '同一性别内部的差距，比两性之间的差距大一到两个数量级',
    caveat:
      '2026 年《科学》单细胞研究里，性别只解释每个基因表达方差的 <b>0.3%</b>。这不是"差异不存在"，而是"差异不足以给你贴标签"。',
    items: [
      { v: '0.3%', label: '性别解释的基因表达方差', note: '2026 Science 单细胞研究', tone: 'b' },
      { v: '51.1%', label: '细胞类型解释的方差', note: '同一项研究，比性别大 170 倍' },
      { v: '3.9%', label: '个体差异解释的方差', note: '是性别的 13 倍', tone: 'b' },
      { v: '0.35–0.46', label: '器械控制类运动的效应量（SMD）', note: '仅限击打、踢球、投掷；跑跳爬无差异', tone: 'c' }
    ]
  },
  companion: {
    title: 'AI Companion · 孩子已经在跟 AI 说什么',
    sub: '两份问卷：一份美国，一份中国',
    caveat:
      '两个都是<b>自陈问卷</b>，样本各约一千与八千余人，只能看趋势、不能当发病率。中国那项覆盖 7 省 8,563 名中小学生。',
    items: [
      { v: '72%', label: '13–17 岁用过 AI 陪伴（美国）', note: 'Common Sense × Hopelab，2025', tone: 'b' },
      { v: '13%', label: '每天使用', note: '同一问卷，每月以上使用为 52%', tone: 'c' },
      { v: '24%', label: '告诉过 AI 真实姓名和住址', note: '同一问卷', tone: 'c' },
      { v: '46.4%', label: '遇到烦恼先向 AI 倾诉（中国）', note: '中国青少年研究中心，2025', tone: 'c' },
      { v: '21.5%', label: '只想和 AI 聊天、不想和真人', note: '同一调查', tone: 'c' },
      { v: '34%', label: '反映 AI 说过让人不安的话', note: '美国问卷', tone: 'b' }
    ]
  },
  screen: {
    title: 'Screens · 屏幕与语言发育',
    sub: '广州 2,100 名 18–72 月龄儿童的剂量反应',
    caveat:
      '这是<b>关联</b>不是因果（Radesky 2018 系统综述明确说现有证据还回答不了因果）。而且 Chamam 2024 发现：家长的数字分心与非数字分心影响<b>相当</b>——别只怪手机。',
    items: [
      { v: '1.99×', label: '每天 1–2 小时的语言迟缓风险', note: 'OR 值，对照组为不接触屏幕', tone: 'b' },
      { v: '2.68×', label: '每天 2–3 小时', note: '同一队列', tone: 'c' },
      { v: '4.24×', label: '每天 3 小时以上', note: '同一队列', tone: 'c' }
    ]
  },
  school: {
    title: 'Made At School · 差距是上学之后才长出来的',
    sub: '法国约 265 万学生纵向数据',
    caveat:
      '研究用同龄队列比较排除了"大脑没熟"的解释——同一批孩子，入学时零差距，入学四个月后出现差距；<b>封锁停课时差距缩小，复课后又扩大</b>。',
    items: [
      { v: '0', label: '入学时的读写与数学差距', note: '法国 265 万人队列', tone: 'b' },
      { v: '0.20', label: '入学 4 个月后出现的差距（效应量）', note: '同一队列', tone: 'c' },
      { v: '每一个', label: 'PISA 阅读女孩领先的国家/地区', note: 'PISA 2022，+24 分', tone: 'b' }
    ]
  }
}

const props = defineProps<{ set: keyof typeof SETS | string; tight?: boolean }>()
const data = () => SETS[props.set] ?? SETS.ai
</script>

<template>
  <div class="cr-mb cr-widget" :class="{ 'cr-widget--dash': true, 'is-tight': tight }" data-listen="skip">
    <div class="cr-widget-head">
      <span class="cr-widget-title">{{ data().title }}</span>
      <p class="cr-widget-sub">{{ data().sub }}</p>
    </div>
    <div class="cr-mb-grid" :class="{ 'is-few': data().items.length <= 3 }">
      <div v-for="s in data().items" :key="s.label" class="cr-mb-cell" :class="s.tone ? `tone-${s.tone}` : ''">
        <strong>{{ s.v }}</strong>
        <b>{{ s.label }}</b>
        <p>{{ s.note }}</p>
      </div>
    </div>
    <p class="cr-cap" v-html="data().caveat"></p>
  </div>
</template>

<style scoped>
.cr-mb-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  background: var(--line);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.cr-mb-grid.is-few {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.cr-mb-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 16px 16px;
  background: var(--panel);
  transition: background 0.24s var(--ease);
}

.cr-mb-cell:hover {
  background: var(--panel-2);
}

.cr-mb-cell strong {
  font-family: var(--font-mono);
  font-size: clamp(1.5rem, 3.2vw, 2.1rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1;
  color: var(--accent);
}

.tone-b strong {
  color: var(--blue);
}

.tone-c strong {
  color: var(--coral);
}

.cr-mb-cell b {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.015em;
  color: var(--ink);
}

.cr-mb-cell p {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.5;
  color: var(--muted);
}

.is-tight .cr-mb-cell {
  padding: 14px 13px 12px;
}

@media (max-width: 960px) {
  .cr-mb-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .cr-mb-grid {
    grid-template-columns: 1fr;
  }
}
</style>
