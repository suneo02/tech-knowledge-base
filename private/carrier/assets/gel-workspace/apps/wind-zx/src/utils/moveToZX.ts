import $ from 'jquery'
import { windZXEmpowerArticles } from './windZXEmpowerArticles'
/**
 * The key should start with 'windzx' or 'gel', followed by '2024' or '2025',
 * then two digits representing the month of publication, and two digits
 * representing the article number for that month.
 */
export const globalPageViewCountIdList = {
  0: 'windzx20240301',
  1: 'windzx20240302',
  2: 'windzx20240303',
  3: 'windzx20240304',
  4: 'windzx20240305',
  5: 'windzx20240306',
  6: 'windzx20240601',
  7: 'windzx20240602',
  21: 'windzx20240801',
  22: 'windzx20240802',
  31: 'windzx20241021', // 这个是 老 code ，因此不做更改
}

export function updateViewCountByCode(viewCountId: string) {
  setViewCount(viewCountId, function (res) {
    if (res && res.ErrorCode == 0 && res.Data) {
      $('#viewCount').text(`阅读量：${res.Data}`)
      $('#viewCount').show()
    }
  })
}

export function getViewCount(key: string, successFun: (res: any) => void) {
  var tUrl = `https://gel.wind.com.cn/wind.ent.web/operation/getStatistics/${key}`
  $.ajax({
    type: 'get',
    url: tUrl,
    timeout: 30000,
    success: successFun,
    error: function () {},
  })
}

/**
 *
 * @param key The key should start with 'windzx' or 'gel', followed by '2024' or '2025', and then four digits
 * @param successFun
 */
export function setViewCount(key: string, successFun: (res: any) => void) {
  var tUrl = `https://gel.wind.com.cn/wind.ent.web/operation/addStatistics/${key}`
  $.ajax({
    type: 'get',
    url: tUrl,
    timeout: 30000,
    success: successFun,
    error: function () {},
  })
}

$(document).ready(function () {
  const menuElement = $('#moveToZXMenu')
  if (!menuElement.length) {
    console.error('未找到 ID 为 moveToZXMenu 的 HTML 节点')
    return
  }

  // 文章根据日期生序
  windZXEmpowerArticles.sort((a, b) => {
    // 2024-12-13
    const dateA = a.date.split('-')
    const dateB = b.date.split('-')
    // @ts-expect-error
    return new Date(dateA[0], dateA[1] - 1, dateA[2]) - new Date(dateB[0], dateB[1] - 1, dateB[2])
  })
  windZXEmpowerArticles.forEach((article) => {
    const div = $('<div>', {
      'data-code': article.id,
      text: article.title,
    })
    // 添加到第一个字元素
    menuElement.prepend(div)
  })

  // <div class="article-doc single" id="zx-article-41"></div>
  // 插入每个文章节点到 #moveToZXContent，格式如注释
  const contentElement = $('#moveToZXContent')
  if (!contentElement.length) {
    console.error('未找到 ID 为 moveToZXContent 的 HTML 节点')
    return
  }

  windZXEmpowerArticles.forEach((article) => {
    const articleDiv = $(`
    <div class="article-doc movezx-article single" id="zx-article-${article.id}"></div>
  `)
    contentElement.append(articleDiv)
  })
})

/**
 * 根据文章 ID 和 HTML ID 加载不同的文章内容
 * @param {number} articleId - 文章 ID
 * @param {string} htmlId - 页面上的 HTML 元素 ID
 */
export function loadMoveToZXArticleContent(articleId: number) {
  const article = windZXEmpowerArticles.find((item) => item.id === articleId)
  if (!article) {
    console.warn(`未找到 ID 为 ${articleId} 的文章`)
    return
  }

  var htmlId = `zx-article-${articleId}`

  const element = $(`#${htmlId}`)
  if (!element) {
    console.error(`未找到 ID 为 ${htmlId} 的 HTML 元素`)
    return
  }

  updateViewCountByCode(article.viewCountId)
  element.html(article.html)
  $('#other .title').text(article.title)
  $('#date').text(article.date)
  $('#source').text(article.source)
  // 展示
  element.show()
}
