<script setup lang="ts">
const MYTHS = [
  {
    n: '01',
    myth: '棉花糖实验说明：4 岁能忍住不吃糖的孩子，一生都赢。',
    truth: '2018 年 Watts、Duncan、Quan 的大样本复现，把原来的效应基本抹掉了。孩子肯不肯等，很大程度上取决于他家平时是不是真的有糖可吃。',
    keep: '延迟满足是可以练的技巧，但它不是先天命运检测仪。',
    tone: 'c'
  },
  {
    n: '02',
    myth: '中国人都用左脑，要开发右脑；全脑训练更先进。',
    truth: '"左脑人/右脑人"不是神经科学结论。语言任务确实偏左半球，但任何复杂任务都是双侧协同，而且"右脑开发"课程并没有对应的同行评审证据。',
    keep: '给孩子多样的活动（音乐、建构、运动）本身是好的，理由不是"补右边"。',
    tone: 'b'
  },
  {
    n: '03',
    myth: '视觉型学习者要用图学，听觉型要用听的，匹配才有效。',
    truth: 'Pashler 等 2008 年的系统综述：找不到"风格匹配带来成绩提升"的随机对照证据。孩子说自己"是视觉型"，通常只是偏好。',
    keep: '按内容选方法——地理用地图、语法用例句，这对所有人都有效。',
    tone: 'b'
  },
  {
    n: '04',
    myth: '0–6 岁有一张敏感期月龄表，错过就永久受损。',
    truth: '网络上流行的精确月龄表（孙瑞雪体系）没有同行评审支持；蒙特梭利本人列的是 5 个较宽的时期，没有给到"月"。发育确实有敏感期，但它是"更容易"，不是"闸门会关"。',
    keep: '把敏感期当观察笔记：孩子近期反复做某件事，说明他现在很吃这一套，值得加码。',
    tone: 'a'
  },
  {
    n: '05',
    myth: '夸努力不夸聪明，孩子有了成长型思维，成绩就会上去。',
    truth: 'Sisk 2018、Macnamara & Burgoyne 2023 的元分析效应很小；Foliano 2019 的随机对照是 null；Yeager 2019 只在低成绩组看到约 +0.1 个标准差。',
    keep: '别夸"你真聪明"仍然是对的——它把注意力从"能不能"转向"愿不愿"，只是别指望它替孩子写作业。',
    tone: 'a'
  },
  {
    n: '06',
    myth: '男孩前额叶晚熟好几年，所以要让他晚上学一年。',
    truth: '髓鞘化确实由后向前、前额叶最晚（Gogtay 2004），但"晚熟 N 年"这个具体岁数并不存在于文献里，更没有证据支持按性别推迟入学。',
    keep: '入学准备看的是这个孩子能否自我管理基本需求，不看他的染色体。',
    tone: 'c'
  },
  {
    n: '07',
    myth: '男孩运动能力天生比女孩强。',
    truth: '可核的差异只出现在器械控制类动作（击打、踢球、投掷，SMD 0.35–0.46）；跑、跳、爬等位移技能没有性别差异。而且器械类差距的更合理解释是练习量。',
    keep: '让所有孩子都摸球拍和球，差距会自己缩小。',
    tone: 'c'
  },
  {
    n: '08',
    myth: '男孩正在被教育系统全线淘汰，这是"男孩危机"。',
    truth: 'PISA 里男孩数学略高、阅读明显落后，且阅读差距最大处在底部而不是顶部；真实稳健的发现是：男孩的分布方差更大，女孩的分布更紧。',
    keep: '需要补的是尾部支持（读不下去的男孩），不是给整个性别开药。',
    tone: 'b'
  },
  {
    n: '09',
    myth: '男女分开上课，各自按自己的节奏学，效果更好。',
    truth: 'Pahlke & Hyde 2014 汇总约 160 万学生：没有发现单性别分班带来的学业收益。Halpern、Eliot 等人在《科学》2011 年直接把它称作伪科学。',
    keep: '如果某所学校有效，多半是小班、师资和同伴构成的功劳，不是分开的功劳。',
    tone: 'a'
  },
  {
    n: '10',
    myth: '性早熟已经成为流行病，别给孩子吃鸡肉和反季水果。',
    truth: '三个常被引用的"官方"患病率相差十倍以上（0.43% / 1.83% / 4.8%），口径互相矛盾，本站一个都不用。另外 2022 年诊断阈值从 8 岁下调到 7.5 岁，病例数被机械地推高。',
    keep: '只看定义和红旗信号，必要时交给小儿内分泌科判断。',
    tone: 'c'
  },
  {
    n: '11',
    myth: '早熟的孩子一定会抑郁。',
    truth: '相关元分析的效应约 OR 1.11，且证据质量被评级为极低；风险主要来自"在同伴里显得不一样"，男孩同理。',
    keep: '真正起作用的是同伴地位与解释话术，不是发育日历本身。',
    tone: 'b'
  },
  {
    n: '12',
    myth: '不同家庭的孩子到 4 岁差了 3000 万个词，这辈子就这样了。',
    truth: 'Hart & Risley 原始研究 n=42，后续复现效应明显缩水。数字被当成宿命传播，是这二十年最贵的一次误读。',
    keep: 'Suskind 的 3T（停下、跟随、再来一遍）是便宜好用的做法，留下；恐吓性的数字扔掉。',
    tone: 'a'
  },
  {
    n: '13',
    myth: '75% 的精神疾病在 24 岁前发病，所以青春期不出问题就安全了。',
    truth: '常被引的 Solmi 2022（84 项研究）说的是：中位发病年龄约 14.5 岁，约三分之一在 14 岁前，一半在 18 岁前，约 62.5% 在 25 岁前——不是"75% 在 24 岁前"。',
    keep: '12–15 岁确实是黄金窗口，把它当"值得认真对待"，不是"24 岁后免检"。',
    tone: 'c'
  }
]

</script>

<template>
  <div class="cr-myth cr-widget cr-widget--dash" data-listen="skip">
    <div class="cr-widget-head">
      <span class="cr-widget-title">Red Lines · 十三句流行话</span>
      <p class="cr-widget-sub">每张卡都是同一结构：流行说法 / 证据说了什么 / 哪部分值得留下</p>
    </div>

    <div class="cr-myth-grid">
      <article v-for="m in MYTHS" :key="m.n" class="cr-myth-card" :class="`tone-${m.tone}`">
        <header>
          <span class="cr-myth-n">{{ m.n }}</span>
          <h4 class="cr-myth-myth">{{ m.myth }}</h4>
        </header>
        <p class="cr-myth-truth">{{ m.truth }}</p>
        <p class="cr-myth-keep"><b>值得留下</b>{{ m.keep }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.cr-myth-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.cr-myth-card {
  padding: 16px 16px 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--panel);
  border-top: 3px solid var(--mc, var(--accent));
}

.tone-a { --mc: var(--accent); }
.tone-b { --mc: var(--blue); }
.tone-c { --mc: var(--coral); }

.cr-myth-card header {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.cr-myth-n {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--mc, var(--accent));
  padding-top: 2px;
}

.cr-myth-myth {
  margin: 0;
  font-size: 14px;
  font-weight: 740;
  line-height: 1.45;
  letter-spacing: -0.02em;
  color: var(--ink);
  text-decoration: line-through;
  text-decoration-color: color-mix(in srgb, var(--coral) 55%, transparent);
  text-decoration-thickness: 1.5px;
}

.cr-myth-truth {
  margin: 10px 0 0;
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--ink-2);
}

.cr-myth-keep {
  display: flex;
  gap: 8px;
  margin: 10px 0 0;
  padding-top: 9px;
  border-top: 1px dashed var(--line);
  font-size: 12px;
  line-height: 1.55;
  color: var(--muted);
}

.cr-myth-keep b {
  flex: none;
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--mc, var(--accent));
  padding-top: 2px;
}

@media (max-width: 860px) {
  .cr-myth-grid {
    grid-template-columns: 1fr;
  }
}
</style>
