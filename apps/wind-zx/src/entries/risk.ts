// Import CSS files
import { loadHeaderFooter } from '@/components/loadHeaderFooter'
import '../styles/general.css'
import '../styles/header.css'
import '../styles/homepage.less'
import '../styles/util.css'

// Import JS files
// jQuery is auto imported by unplugin-auto-import

import { RiskList } from '@/components/risk/list'
import { RiskSector } from '@/components/risk/sector'
import { initLocale, initPageTitle } from '@/utils/intl'

initLocale()
initPageTitle()

const risk = $('#risk')

const $main = $('<div class="main-text"></div>')

risk.append(`    <div class="bg"></div>`)
$main.append(RiskSector())
$main.append(
  $(`     <div class="section">
              <ul>
                <li class="stocks1"></li>
                <li class="stocks2"></li>
              </ul>
            </div>`)
)
$main.append(RiskList())

risk.append($main)

loadHeaderFooter()
