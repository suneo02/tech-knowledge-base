// Import CSS files
import { createHomeBg } from '@/components/home/bg'
import { createHomeMain } from '@/components/home/main'
import { initLocale, initPageTitle } from '@/utils/intl'
import { loadHeaderFooter } from '../components/loadHeaderFooter'
import '../styles/general.css'
import '../styles/header.css'
import '../styles/homepage.less'
import '../styles/util.css'

// Import JS files
// jQuery is auto imported by unplugin-auto-import

initLocale()
initPageTitle()

const $page = $('#gel')
$page.append(createHomeBg())
$page.append(createHomeMain())

loadHeaderFooter()
