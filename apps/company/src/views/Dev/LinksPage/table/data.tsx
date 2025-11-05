import React from 'react'

export const columns = [
  { titleId: '138741', dataIndex: 'NO.' },
  {
    titleId: '138171',
    align: 'center',
    dataIndex: 'logo',
    isImage: true,
    render: (url) => {
      return <img src={url} alt={''}></img>
    },
  },
  { titleId: '138665', align: 'left', dataIndex: 'brand_name' },
  {
    titleId: '205504',
    align: 'left',
    dataIndex: 'cradle',
  },
  { titleId: '312977', align: 'center', dataIndex: 'founding_time' },
  { titleId: '258877', align: 'left', dataIndex: 'introduction', longText: true },
  { titleId: '258856', dataIndex: 'corpName', companyLinks: { id_key: 'corpId' } },
]

export const data = {
  Data: [
    {
      brand_id: 700142.0,
      brand_name: 'VANKE万科',
      corpId: '0A1063106510397',
      corpName: '万科企业股份有限公司',
      cradle: '广东省深圳市',
      detail_id: 84163,
      founding_time: '1984年',
      introduction:
        '万科企业股份有限公司，成立于1984年，1988年进入房地产行业，经过三十余年的发展，已成为城市配套服务商，公司业务聚焦全国经济具活力的三大经济圈及中西部城市。',
      logo: 'http://news.windin.com/ns/imagebase/6404/765145963',
      product_type: '',
    },
    {
      brand_id: 196069.0,
      brand_name: '万科地产',
      corpId: '0A1063106510397',
      corpName: '万科企业股份有限公司',
      cradle: '',
      detail_id: 24774,
      founding_time: '',
      introduction:
        '万科企业股份有限公司成立于1984年，1988年进入房地产行业，1991年成为深圳证券交易所第二家上市公司经过二十多年的发展，成为国内*大的住宅开发企业，目前业务覆盖珠三角、长三角、环渤海三大城市经济圈以及中西部地区，共计53个大中城市',
      logo: 'http://news.windin.com/ns/imagebase/6404/395367501',
      product_type: '商务',
    },
    {
      brand_id: 65956.0,
      brand_name: '万科VANKE',
      corpId: '0A1063106510397',
      corpName: '万科企业股份有限公司',
      cradle: '广东省深圳市',
      detail_id: 250008,
      founding_time: '1984年',
      introduction:
        '成立于1984年，财富世界500企业，国内知名的城乡建设与生活服务商，专注于住宅开发和物业服务的上市公司，2017年深圳地铁集团成为万科第一大股东万科企业股份有限公司成立于1984年，经过三十余年的发展，已成为国内知名的城乡建设与生活服务商，公司业务聚焦全国经济最具活力的三大经济圈及中西部重点城市。2016年公司首次跻身《财富》“世界500强”，位列榜单第356位，2017年、2018年接连上榜，分别位列榜单第307位、第332位。',
      logo: 'http://news.windin.com/ns/imagebase/6404/9671032',
      product_type: '房屋服务',
    },
    {
      brand_id: 34346.0,
      brand_name: '万科广场VankeMall',
      corpId: '0A1063106510397',
      corpName: '万科企业股份有限公司',
      cradle: '广东',
      detail_id: 391731,
      founding_time: '1984年',
      introduction:
        '万科企业股份有限公司成立于1984年，1988年进入房地产行业，经过三十余年的发展，成为国内领先的房地产公司，目前主营业务包括房地产开发和物业服务。公司聚焦城市圈带的发展战略，截至2015年底，公司进入中国大陆66个城市，分布在以珠三角为核心的广深区域、以长三角为核心的上海区域、以环渤海为核心的北京区域，以及由中西部中心城市组成的成都区域。',
      logo: 'http://news.windin.com/ns/imagebase/6404/600935963',
      product_type: '',
    },
    {
      brand_id: 76734.0,
      brand_name: '万科物业',
      corpId: '0A1063106510397',
      corpName: '万科企业股份有限公司',
      cradle: '广东省深圳市',
      detail_id: 378892,
      founding_time: '1990年',
      introduction:
        '始于1990年，国内物业服务行业领跑者，集住宅/商写物业、开发商前介服务、社区资产服务、智能科技服务和社区生活服务于一体的物业集团',
      logo: 'http://news.windin.com/ns/imagebase/6404/376145963',
      product_type: '万科物业,万科物业怎么样,万科物业公司,万科物业管理公司,万科房地产开发,万科物业官网',
    },
    {
      brand_id: 696498.0,
      brand_name: '万科广场Vanke Mall',
      corpId: '0A1063106510397',
      corpName: '万科企业股份有限公司',
      cradle: '广东省深圳市',
      detail_id: 343852,
      founding_time: '1984年',
      introduction:
        '成立于1984年，以家庭消费人群为主，定位于城市级中高端的购物中心，全球知名大型的专业住宅开发商，专注于房地产开发和物业服务的房地产公司万科企业股份有限公司成立于1984年，1988年进入房地产行业，经过三十余年的发展，成为国内出色的房地产公司，目前主营业务包括房地产开发和物业服务。万科广场是万科商业地产的三大产品线之一，三大产品新包含购物中心“万科广场”、写字楼“万科大厦”、社区商业“万科红”三大商业地产产品线。',
      logo: '',
      product_type: '房屋服务',
    },
    {
      brand_id: 104709.0,
      brand_name: '万科置业',
      corpId: '0A1063106510397',
      corpName: '万科企业股份有限公司',
      cradle: '广东省深圳市',
      detail_id: 225968,
      founding_time: '1996年',
      introduction:
        '创建于1996年，万科集团旗下成员企业，香港上市公司，专业从事物业投资、物业发展领域的海外城市配套服务商 本公司乃一间根据开曼群岛法例注册成立之有限责任公司，其股份自一九九六年十一月起于香港联合交易所有限公司(股份编号：1036.HK)上市。',
      logo: 'http://news.windin.com/ns/imagebase/6404/42396087',
      product_type: '',
    },
    {
      brand_id: 696512.0,
      brand_name: '万纬VX',
      corpId: '0A1195464924603',
      corpName: '万科物流发展有限公司',
      cradle: '广东省深圳市',
      detail_id: 408888,
      founding_time: '2015年',
      introduction:
        '万科集团旗下企业，国内出色的多温区综合物流解决方案服务商，可提供高标准的仓储设施及多元化的冷链物流服务万纬物流是万科集团旗下成员企业，2015年，万科集团正式推出独立物流品牌万纬，经过五年发展，已成为国内出色的多温区综合物流解决方案服务商。万纬可为客户提供高标准的仓储设施及多元化的冷链物流服务。',
      logo: '',
      product_type: '生活服务',
    },
    {
      brand_id: 108771.0,
      brand_name: '北字格专利练字20课速成',
      corpId: '0A1040610849388',
      corpName: '福建伯恩物业管理股份有限公司',
      cradle: '福建省福州市',
      detail_id: 210827,
      founding_time: '2005年',
      introduction:
        '福建伯恩物业管理股份有限公司，系国家一级资质物业管理企业，业务进驻东南沿海、华北、华中、西南四大区域版块，遍及北京、上海、福州、厦门、宁德、莆田、泉州、漳州、龙岩、成都、扬州、青岛、济南、莱芜、大同、鹰潭等全国十多个城市百余个项目，下辖四个子公司、十五家物业分公司及十几家控股物业公司，管理面积8000多万平方米。伯恩物业秉承“精致生活，丰盈人生”的服务宗旨并吸收中西文化精髓，推出“720°尊崇英式大管家服务模式”，构建综合性服务平台提高服务附加值，为业主提供“一站式居家服务”，打造“生活就在家门口”的便捷和超值服务。',
      logo: '',
      product_type: '房屋服务',
    },
    {
      brand_id: 796784.0,
      brand_name: '伯恩物业BON',
      corpId: '0A1040610849388',
      corpName: '福建伯恩物业管理股份有限公司',
      cradle: '福建省福州市',
      detail_id: 211879,
      founding_time: '2005年',
      introduction:
        '福建伯恩物业管理股份有限公司，系国家一级资质物业管理企业，业务进驻东南沿海、华北、华中、西南四大区域版块，遍及北京、上海、福州、厦门、宁德、莆田、泉州、漳州、龙岩、成都、扬州、青岛、济南、莱芜、大同、鹰潭等全国十多个城市百余个项目，下辖四个子公司、十五家物业分公司及十几家控股物业公司，管理面积8000多万平方米。伯恩物业秉承“精致生活，丰盈人生”的服务宗旨并吸收中西文化精髓，推出“720°尊崇英式大管家服务模式”，构建综合性服务平台提高服务附加值，为业主提供“一站式居家服务”，打造“生活就在家门口”的便捷和超值服务。',
      logo: '',
      product_type: '',
    },
  ],
  ErrorCode: '0',
  ErrorMessage: '',
  Page: { CurrentPage: 0, PageSize: 10, Records: 12, TotalPage: 0 },
  State: 0,
}
