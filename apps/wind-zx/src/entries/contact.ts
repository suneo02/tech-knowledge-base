// Import CSS files
import { createContactMenu, ensureInitContactMenu } from '@/components/contact/contactMenu'
import { loadHeaderFooter } from '@/components/loadHeaderFooter'
import { initLocale, initPageTitle } from '@/utils/intl'

import '../styles/contact.less'
import '../styles/general.css'
import '../styles/header.css'
import '../styles/homepage.less'
import '../styles/util.css'

initLocale()
initPageTitle()

const $page = $('#contact')
$page.append(createContactMenu())
loadHeaderFooter()
ensureInitContactMenu()

// Import JS files
// jQuery is auto imported by unplugin-auto-import
