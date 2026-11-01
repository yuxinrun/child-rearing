import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ListenBar from './components/ListenBar.vue'
import StageTimeline from './components/StageTimeline.vue'
import SleepScreenChart from './components/SleepScreenChart.vue'
import SexOverlap from './components/SexOverlap.vue'
import GrowthWindow from './components/GrowthWindow.vue'
import AgeLines from './components/AgeLines.vue'
import MetricBand from './components/MetricBand.vue'
import MythCards from './components/MythCards.vue'
import BookShelf from './components/BookShelf.vue'
import PairTalk from './components/PairTalk.vue'
import BrandMark from './components/BrandMark.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(StageTimeline, { variant: 'hero' }),
      'home-hero-info-before': () => h(BrandMark, { variant: 'pill' }),
      'layout-bottom': () => h(ListenBar)
    })
  },
  enhanceApp({ app }) {
    app.component('BrandMark', BrandMark)
    app.component('StageTimeline', StageTimeline)
    app.component('SleepScreenChart', SleepScreenChart)
    app.component('SexOverlap', SexOverlap)
    app.component('GrowthWindow', GrowthWindow)
    app.component('AgeLines', AgeLines)
    app.component('MetricBand', MetricBand)
    app.component('MythCards', MythCards)
    app.component('BookShelf', BookShelf)
    app.component('PairTalk', PairTalk)
  }
}
