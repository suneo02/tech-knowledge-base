const corpDescCondition = [
  {
    type: '注册资本',
    typeId: '35779',
    key: 'regRange',
    multiple: false,
    isVip: false,
    children: [
      {
        option: '不限',
        optionId: '138649',
        optionType: '',
      },
      {
        option: '100万以下',
        optionId: '138090',
        optionType: '[0,100]',
      },
      {
        option: '100万~500万',
        optionId: '138634',
        optionType: '[100,500]',
      },
      {
        option: '500万~1000万',
        optionId: '437331',
        optionType: '[500,1000]',
      },
      {
        option: '1000万~3000万',
        optionId: '437395',
        optionType: '[1000,3000]',
      },
      {
        option: '3000万~5000万',
        optionId: '437414',
        optionType: '[3000,5000]',
      },
      {
        option: '5000万以上',
        optionId: '138095',
        optionType: '[5000',
      },
    ],
  },
  {
    type: '注册资本币种',
    typeId: '2045',
    key: 'capitalType',
    multiple: true,
    isVip: false,
    children: [
      {
        option: '人民币',
        optionId: '12298',
        optionType: '人民币',
      },
      {
        option: '美元',
        optionId: '10634',
        optionType: '美元',
      },
      {
        option: '其他',
        optionId: '23435',
        optionType: '其他',
      },
    ],
  },
  {
    type: '经营状态',
    typeId: '138416',
    key: 'status',
    multiple: true,
    isVip: false,
    children: [
      {
        key: 'cn',
        option: [
          {
            option: '存续',
            optionId: '240282',
            optionType: '存续',
          },
          {
            option: '注销',
            optionId: '265596',
            optionType: '注销',
          },
          {
            option: '迁出',
            optionId: '258589',
            optionType: '迁出',
          },
          {
            option: '吊销,未注销',
            optionId: '259942',
            optionType: '吊销,未注销',
          },
          {
            option: '吊销,已注销',
            optionId: '259947',
            optionType: '吊销,已注销',
          },
          {
            option: '撤销',
            optionId: '258794',
            optionType: '撤销',
          },
          {
            option: '停业',
            optionId: '259074',
            optionType: '停业',
          },
          {
            option: '非正常户',
            optionId: '257686',
            optionType: '非正常户',
          },
          {
            option: '责令关闭',
            optionId: '416883',
            optionType: '责令关闭',
          },
        ],
      },
      {
        key: 'hongkong',
        option: [
          {
            option: '仍注册',
            optionId: '259072',
            optionType: '仍注册',
          },
          {
            option: '已告解散',
            optionId: '207800',
            optionType: '已告解散',
          },
          {
            option: '已终止营业地点',
            optionId: '207801',
            optionType: '已终止营业地点',
          },
          {
            option: '已终止营业地点及已告解散',
            optionId: '207802',
            optionType: '已终止营业地点及已告解散',
          },
          {
            option: '合并后不再是独立的实体',
            optionId: '207803',
            optionType: '合并后不再是独立的实体',
          },
        ],
      },
      {
        key: 'taiwan',
        option: [
          {
            option: '核准設立',
            optionId: '207804',
            optionType: '核准設立',
          },
          {
            option: '撤銷',
            optionId: '2690',
            optionType: '撤銷',
          },
          {
            option: '廢止',
            optionId: '207805',
            optionType: '廢止',
          },
          {
            option: '解散',
            optionId: '207806',
            optionType: '解散',
          },
          {
            option: '合併解散',
            optionId: '207807',
            optionType: '合併解散',
          },
          {
            option: '破產',
            optionId: '207808',
            optionType: '破產',
          },
          {
            option: '解散已清算完結',
            optionId: '207809',
            optionType: '解散已清算完結',
          },
          {
            option: '核准設立，但已命令解散',
            optionId: '207810',
            optionType: '核准設立，但已命令解散',
          },
        ],
      },
      {
        key: 'adminiOrg',
        option: [
          {
            option: '核准設立',
            optionId: '207804',
            optionType: '核准設立',
          },
          {
            option: '撤銷',
            optionId: '2690',
            optionType: '撤銷',
          },
          {
            option: '廢止',
            optionId: '207805',
            optionType: '廢止',
          },
          {
            option: '解散',
            optionId: '207806',
            optionType: '解散',
          },
          {
            option: '合併解散',
            optionId: '207807',
            optionType: '合併解散',
          },
          {
            option: '破產',
            optionId: '207808',
            optionType: '破產',
          },
          {
            option: '解散已清算完結',
            optionId: '207809',
            optionType: '解散已清算完結',
          },
          {
            option: '核准設立，但已命令解散',
            optionId: '207810',
            optionType: '核准設立，但已命令解散',
          },
        ],
      },
      {
        key: 'socialOrg',
        option: [
          {
            option: '正常',
            optionId: '203749',
            optionType: '正常',
          },
          {
            option: '撤销',
            optionId: '2690',
            optionType: '撤销',
          },
          {
            option: '注销',
            optionId: '36489',
            optionType: '注销',
          },
        ],
      },
      {
        key: 'pubInstitution',
        option: [
          {
            option: '正常',
            optionId: '203749',
            optionType: '正常',
          },
          {
            option: '已废止',
            optionId: '207811',
            optionType: '已废止',
          },
          {
            option: '已注销',
            optionId: '207770',
            optionType: '已注销',
          },
        ],
      },
      {
        key: 'lawFirm',
        option: [
          {
            option: '正常',
            optionId: '203749',
            optionType: '正常',
          },
          {
            option: '注销',
            optionId: '36489',
            optionType: '注销',
          },
          {
            option: '吊销',
            optionId: '',
            optionType: '吊销',
          },
        ],
      },
    ],
  },
  {
    type: '企业类型',
    typeId: '60452',
    key: 'corpType',
    multiple: true,
    isVip: true,
    children: [
      {
        option: '有限责任公司',
        optionId: '140129',
        optionType: '有限责任公司',
      },
      {
        option: '股份有限公司',
        optionId: '140130',
        optionType: '股份有限公司',
      },
      {
        option: '国有企业',
        optionId: '67782',
        optionType: '国有企业',
      },
      {
        option: '集体所有制',
        optionId: '214871',
        optionType: '集体所有制',
      },
      {
        option: '外商投资企业',
        optionId: '214930',
        optionType: '外商投资企业',
      },
      {
        option: '港澳台投资企业',
        optionId: '214872',
        optionType: '港澳台投资企业',
      },
      {
        option: '个人独资企业',
        optionId: '214873',
        optionType: '个人独资企业',
      },
      {
        option: '联营企业',
        optionId: '174483',
        optionType: '联营企业',
      },
      {
        option: '有限合伙',
        optionId: '214874',
        optionType: '有限合伙',
      },
      {
        option: '普通合伙',
        optionId: '214875',
        optionType: '普通合伙',
      },
    ],
  },
  {
    type: '参保人数',
    typeId: '145878',
    key: 'endowmentNum',
    isVip: true,
    multiple: false,
    children: [
      {
        option: '不限',
        optionId: '138649',
        optionType: '',
      },
      {
        option: '50人以下',
        optionId: '214876',
        optionType: '[0,50]',
      },
      {
        option: '50~99人',
        optionId: '214877',
        optionType: '[50,99]',
      },
      {
        option: '100~499人',
        optionId: '214878',
        optionType: '[100,499]',
      },
      {
        option: '500~999人',
        optionId: '214879',
        optionType: '[500,999]',
      },
      {
        option: '1000~4999人',
        optionId: '214880',
        optionType: '[1000,4999]',
      },
      {
        option: '5000~9999人',
        optionId: '214881',
        optionType: '[5000,9999]',
      },
      {
        option: '10000以上',
        optionId: '214943',
        optionType: '[10000',
      },
      // {
      //     option:'自定义',
      //     optionId:'25405',
      //     optionType:''
      // },
    ],
  },
]
export { corpDescCondition }
