<script setup lang="ts">
type Book = { t: string; a: string; age: string; why: string; note?: string; warn?: boolean }

const SETS: Record<string, { title: string; sub: string; books: Book[] }> = {
  early: {
    title: 'Books 0–6 · 前六年',
    sub: '这个阶段最值钱的书，是能把"要不要去医院"回答清楚的那本',
    books: [
      { t: '美国儿科学会育儿百科', a: 'AAP（中译本多家出版）', age: '0–1', why: '工具书。把"什么时候该警惕"外包给它，你只负责观察和记录。', note: '按目录查，不要通读' },
      { t: '让孩子的大脑自由', a: 'John Medina《Brain Rules for Baby》', age: '0–3', why: '把发育神经科学翻译成人话，顺便告诉你爸妈吵架对孩子的影响比早教课大。', note: '原版《让大脑自由》是另一本，讲成人学习' },
      { t: '0–3 岁孩子的正面管教', a: 'Jane Nelsen', age: '1–3', why: '这一岁段的实操脚本最密集：不惩罚也不溺爱的中间那条路怎么走。' },
      { t: '捕捉儿童敏感期', a: '孙瑞雪', age: '1–6', why: '当观察笔记读很有价值：它会教你认出孩子正在反复练习什么。', note: '⚠️ 书里的精确月龄表不是发育时钟，别照着对表焦虑', warn: true },
      { t: '游戏力', a: 'Lawrence Cohen', age: '3–6', why: '情绪不好时先玩起来，比先讲道理有效。给"不会玩"的家长一本动作指南。' },
      { t: '好妈妈胜过好老师', a: '尹建莉', age: '3–9', why: '中国语境下的具体招数多，写作业、认错、零花钱都有场景。' },
      { t: '自驱型成长', a: 'Stixrud & Johnson', age: '3 岁以上都适用', why: '核心一句话：父母从老板改行做顾问。焦虑管理 + 自主权的书，越早读越省钱。' },
      { t: '园丁与木匠', a: 'Alison Gopnik', age: '所有年龄段', why: '专治起跑线焦虑。养孩子不是按图纸做家具，是经营一个生态系统。' }
    ]
  },
  school: {
    title: 'Books 6–12 · 小学六年',
    sub: '话术、钱和阅读，三件事各一本',
    books: [
      { t: '父母的语言', a: 'Dana Suskind', age: '3–8', why: '3T（停下、跟随、再来一遍）是本站少数"方法可留、数字要扔"的样本。', note: '书里的 3000 万词差距复现薄弱，做法不受影响' },
      { t: '如何说 孩子才会听 怎么听孩子才肯说', a: 'Adele Faber & Elaine Mazlish', age: '6–12', why: '纯对话脚本，可以直接背。小学阶段每晚能用三次。' },
      { t: '反溺爱', a: 'Ron Lieber', age: '6–12', why: '零花钱怎么给、给多少、什么自己付。钱是第一个能安全失败的领域。', note: '不要和《教养大震撼》搞混，那是另一本' },
      { t: '教养大震撼', a: 'Bronson & Merryman《NurtureShock》', age: '3–12', why: '一批反直觉的发育研究合集，专治"多陪就好"这类直觉。', note: '中译名也有《关键教养报告》' },
      { t: '十几岁孩子的正面管教', a: 'Jane Nelsen', age: '9–12 预习', why: '在孩子还没到青春期前读，比到点了再读有用得多。' }
    ]
  },
  teen: {
    title: 'Books 12–22 · 青春期到成年',
    sub: '这个阶段最重要的技能是"退到二线"',
    books: [
      { t: '青春期大脑风暴', a: 'Daniel Siegel《Brainstorm》', age: '12–18', why: '把"作"重新解释成大脑重组的副作用。给孩子自己读也合适。' },
      { t: '全脑教养法', a: 'Siegel & Bryson《The Whole-Brain Child》', age: '6–16', why: '情绪先接住、道理后上场，12 个可执行策略。', note: '中译名是《全脑教养法》，不是"全脑儿童"' },
      { t: '心理抚养', a: '李玫瑾', age: '12–18', why: '中国场景下非常实用的建议集，尤其关于情绪与人格的早年根底。', note: '🟡 方法是回溯式个案，当经验读，不要当研究证据读', warn: true },
      { t: 'The Defining Decade（决定一生的十年）', a: 'Meg Jay', age: '18–22', why: '成年初显期的行动指南：靠近人、别把自己锁死、把第一次工作当练习。', note: '🟡 中译本信息未核实，建议直接读英文原版', warn: true },
      { t: 'Emerging Adulthood', a: 'Jeffrey Arnett', age: '18–22 / 家长读', why: '"成年初显期"这个概念的原始出处，理论书，啃得动再买。', note: '❌ 未找到可靠中译本', warn: true }
    ]
  },
  boys: {
    title: 'Books · 男孩家庭补充书架',
    sub: '一本本按"能不能直接照做"排，不按名气排',
    books: [
      { t: '养育男孩', a: 'Steve Biddulph', age: '0–18', why: '按 0–4、4–14、14+ 三段分，讲父亲入场的时间点，读起来不累。' },
      { t: 'The Emotional Lives of Boys（男孩的情绪世界）', a: 'Michael Thompson', age: '6–18', why: '男孩不是没有情绪，是情绪被压缩过。同伴压力那一章值得父母先看。' },
      { t: 'Pink Brain, Blue Brain', a: 'Lise Eliot', age: '所有男孩家长', why: '本站"差异不大"这个立场的主要来源，也是给性别本质主义最好的解药。' },
      { t: '拯救男孩', a: '孙云晓 等', age: '6–18', why: '中国本土调查与案例，读它可以知道我们身边具体卡在哪。', note: '⚠️ 结论要挑着接，别整包吞下' , warn: true },
      { t: 'The Wonder of Boys', a: 'Michael Gurian', age: '0–18', why: '活动量、任务设计、独处空间这些建议可以直接抄。', note: '⚠️ 他的神经科学解释要打折读', warn: true }
    ]
  },
  girls: {
    title: 'Books · 女孩家庭补充书架',
    sub: '重点是"压力从哪儿来"，不是"怎么更优秀"',
    books: [
      { t: 'Untangled', a: 'Lisa Damour', age: '10–18', why: '把青春期拆成七种正常过渡，每章一个雷区。"这不是坏了，这是在分离"这一句能救命。' },
      { t: 'Under Pressure', a: 'Lisa Damour', age: '8–18', why: '讲女孩如何把文化期待内化成自我逼迫——中国语境同样成立。' },
      { t: 'How Schools Shortchange Girls', a: 'AAUW（1992）', age: '家长读', why: '课堂互动里女孩得到的是 ✓/✗、男孩得到改进建议，这类发现的早期系统整理。', note: '年份是 1992，不是常被引用的 1998' },
      { t: '拯救女孩', a: '孙云晓', age: '6–18', why: '本土视角下的女孩学习与心理压力，和上面的中国青少年研究中心数据可以对照读。' },
      { t: '心理抚养', a: '李玫瑾', age: '0–18', why: '关于"性格是养出来的"这一条，中国家长最容易听进去的版本。', note: '🟡 同上：当经验读，不当研究读', warn: true }
    ]
  }
}

const props = defineProps<{ set: string }>()
const data = () => SETS[props.set] ?? SETS.early
</script>

<template>
  <div class="cr-books cr-widget" data-listen="skip">
    <div class="cr-widget-head">
      <span class="cr-widget-title">{{ data().title }}</span>
      <p class="cr-widget-sub">{{ data().sub }}</p>
    </div>

    <ul class="cr-books-list">
      <li v-for="b in data().books" :key="b.t">
        <span class="cr-books-age">{{ b.age }}</span>
        <div class="cr-books-main">
          <strong>{{ b.t }}</strong>
          <em>{{ b.a }}</em>
          <p>{{ b.why }}</p>
          <span v-if="b.note" class="cr-books-note" :class="{ warn: b.warn }">{{ b.note }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.cr-books-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.cr-books-list li {
  display: grid;
  grid-template-columns: 118px 1fr;
  gap: 16px;
  padding: 14px 0;
  border-top: 1px dashed var(--line);
}

.cr-books-list li:first-child {
  border-top: 0;
  padding-top: 0;
}

.cr-books-age {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--accent);
  padding-top: 3px;
}

.cr-books-main strong {
  display: block;
  font-size: 15px;
  font-weight: 760;
  letter-spacing: -0.025em;
  color: var(--ink);
}

.cr-books-main em {
  display: block;
  margin-top: 2px;
  font-family: var(--font-mono);
  font-style: normal;
  font-size: 11px;
  color: var(--muted);
}

.cr-books-main p {
  margin: 6px 0 0;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--ink-2);
}

.cr-books-note {
  display: inline-block;
  margin-top: 7px;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px dashed var(--line-strong);
  font-size: 11px;
  color: var(--muted);
}

.cr-books-note.warn {
  border-color: color-mix(in srgb, var(--coral) 45%, transparent);
  color: var(--coral);
}

@media (max-width: 640px) {
  .cr-books-list li {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
