import intl from '@/utils/intl'
import { formatLongString } from '../utils'

export enum CompanyMapEnum {
  actController = 1,
  beneficiaryNatural = 3,
  beneficiaryOrg = 4,
  beneficiaryOwner = 2,
  branch = 8,
  competitor = 11,
  controlledCorp = 6,
  invest = 7,
  legalPerson = 9,
  primaryMember = 10,
  shareholder = 5,
}
export enum CompanyMapTarget {
  actController = 'showActualController',
  beneficiaryNatural = 'showFinalBeneficiary',
  beneficiaryOrg = 'showFinalBeneficiary',
  beneficiaryOwner = 'showFinalBeneficiary',
  branch = 'showCompanyBranchInfo',
  competitor = 'getcomparable',
  controlledCorp = 'showControllerCompany',
  invest = 'showDirectInvestment',
  primaryMember = 'showMainMemberInfo',
  shareholder = 'showCompanyBranchInfo',
}

export enum CompanyMapLink {
  $$MORE$$ = '$$MORE$$',
  $$ALL$$ = '$$ALL$$',
}

export const calcMaxy = (data: Array<any>) => {
  let vertical = []
  data.forEach((d) => {
    // 计算子节点的x y方向的最值
    if (d.children && d.children.length > 0) {
      let list = d.children
      d.maxX = list[0].x
      d.minX = list[0].x
      d.maxY = list[0].y
      vertical.push(d)
      for (let k of d.children) {
        if (k.x > d.maxX) d.maxX = k.x
        if (k.x < d.minX) d.minX = k.x
      }
    }
  })
  return vertical
}

export const calcMaxyLeft = (data: Array<any>) => {
  let vertical2 = []
  let minY = 0,
    maxY = 0
  data.forEach((d) => {
    // 计算子节点的x y方向的最值
    if (d.x > maxY) maxY = d.x
    if (d.x < minY) minY = d.x
    if (d.children && d.children.length > 0) {
      var list = d.children
      d.maxX = list[0].x
      d.minX = list[0].x
      d.maxY = list[0].y
      vertical2.push(d)
      for (var k of d.children) {
        if (k.x > d.maxX) d.maxX = k.x
        if (k.x < d.minX) d.minX = k.x
        if (k.x > maxY) maxY = k.x
        if (k.x < minY) minY = k.x
      }
    }
  })
  return vertical2
}

/**
 * 判断公司名称为全大小或带数字和字符的大写字母
 */
function nameIsUpper(name) {
  return /^[A-Z0-9\W_]+$/.test(name)
}

export const getAllNodesGlobal = (data: any, obj: any, fn: any) => {
  if (!data.Id) {
    data.Id = '$$' + data.name
  }
  if (window.en_access_config) {
    data._nameIsEn = true
  } else {
    if (data.name.charCodeAt(0) < 255 && data.name.charCodeAt(data.name.length - 1) < 255) {
      data._nameIsEn = true
    }
  }
  var margin = 2
  if (nameIsUpper(data.name)) {
    margin = 1.6
  }
  data._namelen = data._nameIsEn ? data.name.length / margin : data.name.length
  var list = obj.list || []
  if (data.children && data.children.length) {
    obj.list = list.concat(data.children)
    data.children.forEach((t) => {
      fn(t, obj)
    })
  }
}

/**
 * 将初始数据结构转换为绘图可用数据结构
 * @param data
 * @param code
 */
export const changeCompanyMapData = (data: any, code: string) => {
  // 左树根节点
  const leftRoot = {
    name: formatLongString(data.companyName, 17, 1),
    code: code,
    depth: 0,
    children: [],
    left: 1,
    itemName: data.companyName,
  }
  // 右树根节点
  const rightRoot = {
    name: formatLongString(data.companyName, 17, 1),
    code: code,
    depth: 0,
    children: [],
    right: 1,
    itemName: data.companyName,
  }
  // 左树展示数据类型
  const leftStruct = {
    actController: {
      name: intl('417192', '实控人'),
      children: [],
      borderLine: true,
      depth: 1,
      isModule: true,
      typeNumber: CompanyMapEnum.actController,
    },
    beneficiaryNatural: {
      name: intl('421600', '受益自然人'),
      children: [],
      borderLine: true,
      depth: 2,
      isModule: true,
      typeNumber: CompanyMapEnum.beneficiaryNatural,
    },
    beneficiaryOrg: {
      name: intl('326075', '受益机构'),
      children: [],
      borderLine: true,
      depth: 2,
      isModule: true,
      typeNumber: CompanyMapEnum.beneficiaryNatural,
    },
    beneficiaryOwner: {
      name: intl('326056', '受益所有人'),
      children: [],
      borderLine: true,
      depth: 2,
      isModule: true,
      typeNumber: CompanyMapEnum.beneficiaryNatural,
    },
    branch: {
      name: intl('138183', '分支机构'),
      children: [],
      borderLine: true,
      depth: 1,
      isModule: true,
      typeNumber: CompanyMapEnum.branch,
    },
    competitor: {
      name: intl('138219', '竞争对手'),
      children: [],
      borderLine: true,
      depth: 1,
      isModule: true,
      typeNumber: CompanyMapEnum.competitor,
    },
  }
  // 右树展示数据类型
  const rightStruct = {
    controlledCorp: {
      name: intl('451208', '控股企业'),
      children: [],
      borderLine: true,
      depth: 1,
      isModule: true,
      typeNumber: CompanyMapEnum.controlledCorp,
    },
    invest: {
      name: intl('138724', '对外投资'),
      children: [],
      borderLine: true,
      depth: 1,
      isModule: true,
      typeNumber: CompanyMapEnum.invest,
    },
    legalPerson: {
      name: intl('419959', '法定代表人'),
      children: [],
      borderLine: true,
      depth: 1,
      isModule: true,
      typeNumber: CompanyMapEnum.legalPerson,
    },
    primaryMember: {
      name: intl('138503', '主要人员'),
      children: [],
      borderLine: true,
      depth: 1,
      isModule: true,
      typeNumber: CompanyMapEnum.primaryMember,
    },
    shareholder: {
      name: intl('419816', '股东'),
      children: [],
      borderLine: true,
      depth: 1,
      isModule: true,
      typeNumber: CompanyMapEnum.shareholder,
    },
  }
  // 受益人含3类，需要进行单独处理 beneficiaryNatural beneficiaryOrg beneficiaryOwner
  const beneficiaryNodes = {
    name: intl('138180', '最终受益人'),
    children: [],
    borderLine: true,
    depth: 1,
    isModule: true,
    typeNumber: CompanyMapEnum.beneficiaryNatural,
  }
  for (var key in data) {
    var t = data[key].items
    var total = data[key].total
    if (t && t.length) {
      t.map((tt: any) => {
        tt.name = formatLongString(tt.itemName, 18, 1)
        tt.Id = tt.itemId
      })
      if (total > 10) {
        t.push({
          Id: CompanyMapLink['$$MORE$$'],
          name: `${intl('138737', '查看更多')} (${total - 10})`,
          type: key,
          typeNumber: CompanyMapEnum[key],
        })
      }
      if (leftStruct[key]) {
        leftStruct[key].children = t
        leftStruct[key].total = total
        if (key.startsWith('beneficiary')) {
          beneficiaryNodes.children.push(leftStruct[key])
        } else {
          leftRoot.children.push(leftStruct[key])
        }
      } else {
        rightStruct[key].children = t
        rightStruct[key].total = total
        rightRoot.children.push(rightStruct[key])
      }
    }
  }
  leftRoot.children.push(beneficiaryNodes)
  data.leftRoot = leftRoot
  data.rightRoot = rightRoot
  return data
}

export const traverseTreeId = (node: any) => {
  var id = 1
  trId(node)

  function trId(node) {
    node.id = id
    id++
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        trId(node.children[i])
      }
    }
    if (node._children) {
      for (var i = 0; i < node._children.length; i++) {
        trId(node._children[i])
      }
    }
  }
}

export const initTreeData = (data: any) => {
  data.x0 = 0
  data.y0 = 0
  data.children.forEach((d) => {
    if (d.children) {
      d.__children = [...d.children]
    } // 存储子节点的信息
    if (d.depth !== 0) {
      if (d.children) {
        d._children = [...d.children]
        initTreeData(d)
      }
    }
  })
  return data
}

export function calcColor(d: any) {
  var globalColors = [
    '#2277a2',
    '#f68717',
    '#5fbebf',
    '#e05d5d',
    '#4a588e',
    '#e4c557',
    '#63a074',
    '#906f54',
    '#9da9b4',
    '#8862ac',
  ]
  var color = '#c5c5c5'
  switch (d.typeNumber) {
    case 1:
      color = globalColors[1]
      break
    case 3:
      color = globalColors[3]
      break
    case 8:
      color = globalColors[8]
      break
    case 11:
      color = globalColors[4]
      break
    case 6:
      color = globalColors[6]
      break
    case 7:
      color = globalColors[7]
      break
    case 9:
      color = globalColors[9]
    case 5:
      color = globalColors[5]
    case 10:
      color = globalColors[2]
      break
  }
  return color
}
