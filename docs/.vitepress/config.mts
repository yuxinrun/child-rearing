import { defineConfig } from 'vitepress'
import { ORDER } from './theme/reading-order'

// 仓库名部署（https://<user>.github.io/child-rearing/）时构建用 BASE=/child-rearing/
// 绑定自定义域名时保持 BASE=/
const base = process.env.BASE ?? '/'

const repo = 'https://github.com/yuxinrun/child-rearing'
const siteTitle = '养大一个人'

const sidebar = ORDER.map((g) => ({
  text: g.group,
  collapsed: false,
  items: g.items.map((i) => ({ text: i.text, link: i.link }))
}))

const nav = [
  { text: '阶段', link: '/map/timeline', activeMatch: '/map/' },
  { text: '男孩女孩', link: '/gender/how-to-read', activeMatch: '/gender/' },
  { text: 'AI 时代', link: '/ai/overview', activeMatch: '/ai/' },
  { text: '辟谣', link: '/evidence/red-lines', activeMatch: '/evidence/' },
  { text: '父母', link: '/parents/self-care', activeMatch: '/parents/' },
  {
    text: '更多',
    items: [
      { text: '书单：按年龄排好', link: '/books/shelf' },
      { text: '听书怎么用', link: '/listen' },
      { text: '关于本站', link: '/about' },
      { text: '姊妹站：Super-agent 讲透 ↗', link: 'https://yuxinrun.github.io/super-agent/', target: '_blank', rel: 'noopener' },
      { text: '姊妹站：MCP Patterns ↗', link: 'https://yuxinrun.github.io/mcp-patterns/', target: '_blank', rel: 'noopener' }
    ]
  }
]

export default defineConfig({
  title: siteTitle,
  // 首页在 index.md 里单独给了 title，否则模板会念成"养大一个人 · 养大一个人"
  titleTemplate: `:title · ${siteTitle}`,
  description:
    '从出生到大学毕业的分阶段养育手册：睡眠屏幕运动的硬指标、男孩女孩的真实差异、AI 时代每个年龄该陪什么，以及十三句流行废话的辟谣。全站可以听。',
  base,
  lang: 'zh-CN',
  appearance: true,
  lastUpdated: true,
  metaChunk: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#f6f4ee', media: '(prefers-color-scheme: light)' }],
    ['meta', { name: 'theme-color', content: '#06100e', media: '(prefers-color-scheme: dark)' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
  ],
  markdown: {
    theme: { light: 'github-dark', dark: 'github-dark' },
    lineNumbers: false,
    image: { lazyLoading: true }
  },
  themeConfig: {
    logo: { light: '/logo.svg', dark: '/logo-dark.svg' },
    siteTitle: '养大一个人',
    nav,
    sidebar,
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一节（也是连播的上一节）', next: '下一节' },
    lastUpdated: { text: '最后更新于', formatOptions: { dateStyle: 'short', timeStyle: 'short' } },
    editLink: { pattern: `${repo}/edit/main/docs/:path`, text: '在 GitHub 上编辑此页' },
    socialLinks: [{ icon: 'github', link: repo }],
    footer: {
      message: `<span class="mp-footer-brand"><img src="${base}yuxin-run.png" alt="鱼心快跑" width="546" height="363" /><span>鱼心快跑，孩子慢慢长</span></span>`,
      copyright: '© 2026 鱼心快跑 · 养大一个人｜内容仅供家庭教育参考，不能替代医生、心理咨询师或法律援助'
    },
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        translations: {
          button: { buttonText: '搜索手册', buttonAriaLabel: '搜索手册' },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清除查询',
            backButtonTitle: '返回',
            noResultsText: '没有找到结果',
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: '回车',
              navigateText: '切换',
              navigateUpKeyAriaLabel: '上箭头',
              navigateDownKeyAriaLabel: '下箭头',
              closeText: '关闭',
              closeKeyAriaLabel: 'Esc'
            }
          }
        }
      }
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    langMenuLabel: '切换语言',
    notFound: {
      title: '这一页还没长出来',
      quote: '孩子成长的每一步都有人踩过坑，但这个页码还没有。回首页从阶段地图开始。',
      linkText: '返回首页'
    }
  },
  transformHead({ pageData }) {
    const site = siteTitle
    const fallback = '养大一个人｜从出生到大学毕业的 AI 时代养育手册（可听版）'
    const t = pageData.frontmatter.title
    const title = t ? `${t} · ${site}` : fallback
    const fmDesc = pageData.frontmatter.description
    const description =
      typeof fmDesc === 'string' && fmDesc
        ? fmDesc
        : '睡眠、屏幕、运动硬指标；男孩女孩的真实差异；AI 时代每个年龄该陪什么；十三句流行废话的辟谣。全站支持自动连播。'
    return [
      ['meta', { name: 'author', content: '鱼心快跑' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }]
    ]
  }
})
