import intl from '@/utils/intl'

export const financialCorpFilters = [
  {
    title: intl('145812', '机构类型'),
    data: [
      {
        name: intl('35063', '银行'),
        key: 'financialcorp1',
        params: {
          route: 'financialcorp',
          source: 'searchfeature2',
          corpNature: '银行',
          sort: 1,
          type: 'bank',
        },
        children: [
          {
            title: intl('437767', '二级分类'),
            key: 'financialcorpSecond',
            data: [
              {
                name: intl('464436', '全部商业银行'),
                key: 'financialcorpSecond1',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '全部商业银行',
                  sort: 1,
                  type: 'bank',
                },
              },
              {
                name: intl('437797', '政策性银行'),
                key: 'financialcorpSecond2',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '政策性银行',
                  sort: 1,
                  type: 'bank',
                },
              },
              {
                name: intl('464434', '国有大型商业银行'),
                key: 'financialcorpSecond3',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '国有大型商业银行',
                  sort: 1,
                  type: 'bank',
                },
              },
              {
                name: intl('437796', '股份制商业银行'),
                key: 'financialcorpSecond4',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '股份制商业银行',
                  sort: 1,
                  type: 'bank',
                },
              },
              {
                name: intl('437782', '城市商业银行'),
                key: 'financialcorpSecond5',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '城市商业银行',
                  sort: 1,
                  type: 'bank',
                },
              },
              {
                name: intl('437748', '农村商业银行'),
                key: 'financialcorpSecond6',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '农村商业银行',
                  sort: 1,
                  type: 'bank',
                },
              },
              {
                name: intl('437763', '民营银行'),
                key: 'financialcorpSecond7',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '民营银行',
                  sort: 1,
                  type: 'bank',
                },
              },
              {
                name: intl('464435', '外资法人银行'),
                key: 'financialcorpSecond8',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '外资法人银行',
                  sort: 1,
                  type: 'bank',
                },
              },
              {
                name: intl('121187', '住房储蓄银行'),
                key: 'financialcorpSecond9',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '住房储蓄银行',
                  sort: 1,
                  type: 'bank',
                },
              },
              {
                name: intl('448534', '直销银行'),
                key: 'financialcorpSecond10',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '直销银行',
                  sort: 1,
                  type: 'bank',
                },
              },
              {
                name: intl('437769', '农村合作银行'),
                key: 'financialcorpSecond11',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '农村合作银行',
                  sort: 1,
                  type: 'bank',
                },
              },
              {
                name: intl('437783', '村镇银行'),
                key: 'financialcorpSecond12',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '村镇银行',
                  sort: 1,
                  type: 'bank',
                },
              },
              {
                name: intl('437764', '农村信用社'),
                key: 'financialcorpSecond13',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '农村信用社',
                  sort: 1,
                  type: 'bank',
                },
              },
              {
                name: intl('425821', '农村资金互助社'),
                key: 'financialcorpSecond14',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '农村资金互助社',
                  sort: 1,
                  type: 'bank',
                },
              },
            ],
          },
        ],
      },
      {
        name: intl('437744', '保险公司'),
        key: 'financialcorp2',
        params: {
          route: 'financialcorp',
          source: 'searchfeature2',
          corpNature: '保险公司',
          sort: 1,
          type: 'insurance',
        },
        children: [
          {
            title: intl('437767', '二级分类'),
            key: 'financialcorp2Second',
            data: [
              {
                name: intl('437780', '保险集团公司'),
                key: 'financialcorp2Second1',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '保险集团公司',
                  sort: 1,
                  type: 'insurance',
                },
              },
              {
                name: intl('437799', '财产险公司'),
                key: 'financialcorp2Second2',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '财产险公司',
                  sort: 1,
                  type: 'insurance',
                },
              },
              {
                name: intl('437776', '人身险公司'),
                key: 'financialcorp2Second3',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '人身险公司',
                  sort: 1,
                  type: 'insurance',
                },
              },
              {
                name: intl('437778', '再保险公司'),
                key: 'financialcorp2Second4',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '再保险公司',
                  sort: 1,
                  type: 'insurance',
                },
              },
            ],
          },
        ],
      },
      {
        name: intl('437867', '证券公司'),
        key: 'financialcorp3',
        params: {
          route: 'financialcorp',
          source: 'searchfeature2',
          corpNature: '证券公司',
          sort: 1,
          type: 'security',
        },
      },
      {
        name: intl('437727', '资产管理'),
        key: 'financialcorp4',
        params: {
          route: 'financialcorp',
          source: 'searchfeature2',
          corpNature: '资产管理',
          sort: 1,
          type: 'fund',
        },
        children: [
          {
            title: intl('437767', '二级分类'),
            key: 'financialcorp4Second',
            data: [
              {
                name: intl('437781', '基金公司'),
                key: 'financialcorp4Second1',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '基金公司',
                  sort: 1,
                  type: 'fund',
                },
              },
              {
                name: intl('437788', '银行资产管理'),
                key: 'financialcorp4Second2',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '银行资产管理',
                  sort: 1,
                  type: 'fund',
                },
              },
              {
                name: intl('437789', '保险资产管理'),
                key: 'financialcorp4Second3',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '保险资产管理',
                  sort: 1,
                  type: 'fund',
                },
              },
              {
                name: intl('437740', '券商资产管理'),
                key: 'financialcorp4Second4',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '券商资产管理',
                  sort: 1,
                  type: 'fund',
                },
              },
              {
                name: intl('437800', '期货资产管理'),
                key: 'financialcorp4Second5',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '期货资产管理',
                  sort: 1,
                  type: 'fund',
                },
              },
              {
                name: intl('437798', '信托公司'),
                key: 'financialcorp4Second6',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '信托公司',
                  sort: 1,
                  type: 'fund',
                },
              },
              {
                name: intl('425804', '基金特定资产管理公司'),
                key: 'financialcorp4Second7',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '基金特定资产管理公司',
                  sort: 1,
                  type: 'fund',
                },
              },
              {
                name: intl('425805', '期货公司风险管理子公司'),
                key: 'financialcorp4Second8',
                params: {
                  route: 'financialcorp',
                  source: 'searchfeature2',
                  corpNature: '期货公司风险管理子公司',
                  sort: 1,
                  type: 'fund',
                },
              },
            ],
          },
        ],
      },
      {
        name: intl('437749', '期货公司'),
        key: 'financialcorp5',
        params: {
          route: 'financialcorp',
          source: 'searchfeature2',
          corpNature: '期货公司',
          sort: 1,
          type: 'future',
        },
      },
      {
        name: intl('437770', '其他金融机构'),
        key: 'financialcorp6',
        params: {
          route: 'otherFinancial',
          source: 'financialcorp',
          corpNature: '财务公司',
        },
        children: [
          {
            title: intl('437767', '二级分类'),
            key: 'financialcorp6Second',
            data: [
              {
                name: intl('464437', '财务公司'),
                key: 'financialcorpOther1',
                params: {
                  route: 'otherFinancial',
                  source: 'financialcorp',
                  corpNature: '财务公司',
                },
              },
              {
                name: intl('437771', '消费金融公司'),
                key: 'financialcorpOther2',
                params: {
                  route: 'otherFinancial',
                  source: 'financialcorp',
                  corpNature: '消费金融公司',
                },
              },
              {
                name: intl('437785', '汽车金融公司'),
                key: 'financialcorpOther3',
                params: {
                  route: 'otherFinancial',
                  source: 'financialcorp',
                  corpNature: '汽车金融公司',
                },
              },
              {
                name: intl('437768', '货币经纪公司'),
                key: 'financialcorpOther4',
                params: {
                  route: 'otherFinancial',
                  source: 'financialcorp',
                  corpNature: '货币经纪公司',
                },
              },
              {
                name: intl('425822', '金融租赁公司'),
                key: 'financialcorpOther5',
                params: {
                  route: 'otherFinancial',
                  source: 'financialcorp',
                  corpNature: '金融租赁公司',
                },
              },
              {
                name: intl('437786', '金融资产管理公司'),
                key: 'financialcorpOther6',
                params: {
                  route: 'otherFinancial',
                  source: 'financialcorp',
                  corpNature: '金融资产管理公司',
                },
              },
              {
                name: intl('464438', '其他金融机构'),
                key: 'financialcorpOther7',
                params: {
                  route: 'otherFinancial',
                  source: 'financialcorp',
                  corpNature: '其他金融机构',
                },
              },
            ],
          },
        ],
      },
    ],
  },
]
