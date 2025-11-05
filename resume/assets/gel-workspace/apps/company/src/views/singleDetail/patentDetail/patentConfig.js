const lawStatusRoot = [
  {
    code: '13772932779',
    name: '有效',
    enCode: '36518',
    node: [
      {
        code: '913006000',
        name: '恢复',
        enCode: '312835',
        node: [
          {
            code: '68388',
            enCode: '353258',
            name: '专利权恢复',
          },
          {
            code: '68387',
            enCode: '353275',
            name: '专利申请恢复',
          },
        ],
      },
      {
        code: '913007000',
        enCode: '312806',
        name: '解密',
        node: [],
      },
      {
        code: '913010000',
        enCode: '312809',
        name: '授权',
      },
      {
        code: '913011000',
        enCode: '312837',
        name: '维持有效',
        node: [
          {
            code: '68380',
            enCode: '353259',
            name: '专利有效',
          },
          {
            code: '68381',
            enCode: '353260',
            name: '申请有效',
          },
        ],
      },
      {
        code: '913013000',
        enCode: '312810',
        name: '续展',
      },
      {
        code: '913015000',
        enCode: '353273',
        name: '专利权继承或转让',
      },
      {
        code: '913016000',
        enCode: '353256',
        name: '专利质押,保全及解除',
        node: [
          {
            code: '68369',
            enCode: '353261',
            name: '专利权保全',
          },
          {
            code: '68368',
            enCode: '353262',
            name: '专利权质押',
          },
          {
            code: '68367',
            enCode: '353276',
            name: '专利权保全解除',
          },
          {
            code: '68366',
            enCode: '353277',
            name: '专利权质押解除',
          },
          {
            code: '68365',
            enCode: '353278',
            name: '申请权保全',
          },
          {
            code: '68364',
            enCode: '353279',
            name: '申请权保全解除',
          },
        ],
      },
      {
        code: '913017000',
        enCode: '353280',
        name: '专利权质押合同登记',
        node: [
          {
            code: '68362',
            enCode: '353263',
            name: '专利权质押合同登记的生效',
          },
          {
            code: '68361',
            enCode: '353264',
            name: '专利权质押合同登记的注销',
          },
          {
            code: '68360',
            enCode: '353280',
            name: '专利权质押合同登记的变更',
          },
        ],
      },
      {
        code: '913018000',
        enCode: '353274',
        name: '专利实施许可合同备案',
        node: [
          {
            code: '68358',
            enCode: '353281',
            name: '许可合同备案生效',
          },
          {
            code: '68357',
            enCode: '353282',
            name: '许可合同备案注销',
          },
          {
            code: '68356',
            enCode: '353283',
            name: '许可合同备案变更',
          },
        ],
      },
      {
        code: '913019000',
        enCode: '312808',
        name: '转移',
        node: [
          {
            code: '68354',
            enCode: '353284',
            name: '申请权转移',
          },
          {
            code: '68353',
            enCode: '353265',
            name: '专利权转移',
          },
        ],
      },
      {
        code: '913020000',
        enCode: '312834',
        name: '变更',
      },
      {
        code: '913021000',
        enCode: '23435',
        name: '其他',
      },
    ],
  },
  {
    code: '13772949036',
    enCode: '36531',
    name: '无效',
    node: [
      {
        code: '913001000',
        enCode: '312812',
        name: '驳回',
        node: [
          {
            code: '68401',
            enCode: '353266',
            name: '专利申请驳回',
          },
          {
            code: '68400',
            enCode: '353267',
            name: '专利公布驳回',
          },
        ],
      },
      {
        code: '913002000',
        enCode: '312853',
        name: '撤回',
        node: [
          {
            code: '68398',
            enCode: '353285',
            name: '申请撤回',
          },
          {
            code: '68397',
            enCode: '353268',
            name: '公布撤回',
          },
        ],
      },
      {
        code: '913003000',
        enCode: '258961',
        name: '撤销',
        node: [
          {
            code: '68395',
            enCode: '353269',
            name: '专利权全部撤销',
          },
          {
            code: '68394',
            enCode: '353270',
            name: '专利权部分撤销',
          },
        ],
      },
      {
        code: '913004000',
        enCode: '312840',
        name: '放弃',
        node: [
          {
            code: '68391',
            enCode: '353271',
            name: '避免重复授权放弃专利权',
          },
          {
            code: '68392',
            enCode: '353286',
            name: '视为放弃专利权',
          },
        ],
      },
      {
        code: '913012000',
        enCode: '353254',
        name: '无效',
        node: [
          {
            code: '68377',
            enCode: '353287',
            name: '专利权全部无效',
          },
          {
            code: '68378',
            enCode: '353272',
            name: '专利权部分无效',
          },
        ],
      },
      {
        code: '913014000',
        enCode: '312854',
        name: '终止',
        node: [
          {
            code: '68372',
            enCode: '353288',
            name: '专利权有效期届满终止',
          },
          {
            code: '68373',
            enCode: '353293',
            name: '未缴年费专利权终止',
          },
          {
            code: '68374',
            enCode: '353294',
            name: '主动放弃专利权终止',
          },
        ],
      },
    ],
  },
  {
    code: '13772962293',
    enCode: '353255',
    name: '审中',
    node: [
      {
        code: '913005000',
        enCode: '312836',
        name: '公布',
      },
      {
        code: '913008000',
        enCode: '312807',
        name: '审定',
      },
      {
        code: '913009000',
        enCode: '312811',
        name: '实质审查',
      },
    ],
  },
]

const lawStatus = lawStatusRoot

export { lawStatusRoot, lawStatus }
