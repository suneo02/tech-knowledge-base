import { CHART_HASH } from '../company/intro/charts'

export const mostUseMenus = {
  id: '69882',
  zh: '常用功能',
  list: [
    {
      id: '422046',
      zh: '查关系',
      url: `index.html?isSeparate=1&nosearch=1&activeKey=chart_cgx#/${CHART_HASH}`,
      css: 'relation-icon',
    },
    {
      id: '265667',
      zh: '股权穿透图',
      url: `index.html?isSeparate=1&nosearch=1&activeKey=chart_gqct#/${CHART_HASH}`,
      css: 'chartplathome-icon',
    },
    {
      id: 259705,
      zh: '多对一触达',
      url: `index.html?isSeparate=1&nosearch=1&activeKey=chart_ddycd#/${CHART_HASH}`,
      css: 'detach-icon',
    },
    {
      id: '247482',
      zh: '查集团',
      url: 'index.html#/searchPlatform/SearchGroupDepartment?nosearch=1',
      css: 'group-icon',
    },
    {
      id: '228333',
      zh: '招投标查询',
      url: 'SearchBid.html',
      css: 'bid-icon',
    },
    {
      id: '138485',
      zh: '疑似关系图',
      url: `index.html?isSeparate=1&nosearch=1&activeKey=chart_ysgx#/${CHART_HASH}`,
      css: 'chart-ysgx-icon',
    },
  ],
}
