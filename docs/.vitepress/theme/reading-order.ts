export type ListenItem = { text: string; link: string }
export type ListenGroup = { group: string; items: ListenItem[] }

// 全站唯一的阅读顺序。config.mts 用它生成侧边栏，听书引擎用它生成连播队列。
export const ORDER: ListenGroup[] = [
  {
    group: '开始',
    items: [
      { text: '这本手册怎么用', link: '/start' },
      { text: '把这本手册当成有声书', link: '/listen' },
      { text: '0→22 岁全景地图', link: '/map/timeline' }
    ]
  },
  {
    group: '阶段：从出生到大学毕业',
    items: [
      { text: '0–1 岁：新手运维期', link: '/map/s0-1' },
      { text: '1–3 岁：第一个“不要”期', link: '/map/s1-3' },
      { text: '3–6 岁：游戏就是工作', link: '/map/s3-6' },
      { text: '6–9 岁：勤奋或自卑', link: '/map/s6-9' },
      { text: '9–12 岁：青春期前夜', link: '/map/s9-12' },
      { text: '12–15 岁：初中三年', link: '/map/s12-15' },
      { text: '15–18 岁：高中与考学前', link: '/map/s15-18' },
      { text: '18–22 岁：大学与放手', link: '/map/s18-22' }
    ]
  },
  {
    group: '男孩与女孩',
    items: [
      { text: '先读这页：差异到底有多大', link: '/gender/how-to-read' },
      { text: '男孩：真实差异与被夸大的差异', link: '/gender/boys' },
      { text: '女孩：真实差异与被夸大的差异', link: '/gender/girls' }
    ]
  },
  {
    group: 'AI 时代',
    items: [
      { text: '先降焦虑：AI 到底改变了什么', link: '/ai/overview' },
      { text: '分阶段陪法与国家的年龄线', link: '/ai/stages' },
      { text: '家庭 AI 公约（可以直接抄）', link: '/ai/rules' },
      { text: 'AI 陪伴与孩子的情绪', link: '/ai/companion' },
      { text: '选专业与二十年后的能力储备', link: '/ai/future' }
    ]
  },
  {
    group: '证据与辟谣',
    items: [
      { text: '十三句很流行的话，十三个体面的错误', link: '/evidence/red-lines' },
      { text: '数字怎么读：口径、样本与复现', link: '/evidence/numbers' },
      { text: '来源清单与写作规矩', link: '/evidence/sources' }
    ]
  },
  {
    group: '父母自己的事',
    items: [
      { text: '你的状态比你的时长重要', link: '/parents/self-care' },
      { text: '家里口径不一致怎么办', link: '/parents/consistency' },
      { text: '作业、成绩与"别人家孩子"', link: '/parents/homework' }
    ]
  },
  {
    group: '书单',
    items: [
      { text: '按年龄分好的书架', link: '/books/shelf' },
      { text: '男孩家庭与女孩家庭的补充书架', link: '/books/gender-shelf' }
    ]
  },
  {
    group: '关于',
    items: [{ text: '关于本站', link: '/about' }]
  }
]

export const FLAT: ListenItem[] = ORDER.flatMap((g) => g.items)

export const groupOf = (link: string): string | undefined =>
  ORDER.find((g) => g.items.some((i) => i.link === link))?.group

export const indexOfLink = (link: string): number =>
  FLAT.findIndex((i) => normalize(link) === normalize(i.link))

export function normalize(link: string): string {
  if (!link) return ''
  let l = link.split('#')[0].split('?')[0]
  l = l.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\.md$/, '')
  if (!l.startsWith('/')) l = `/${l}`
  l = l.replace(/\/$/, '')
  return l === '' ? '/' : l
}
