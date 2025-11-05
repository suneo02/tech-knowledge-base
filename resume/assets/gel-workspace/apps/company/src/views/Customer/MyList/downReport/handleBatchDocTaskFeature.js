import intl from '../../../../utils/intl'

export const handleBatchDocTaskFeature = (downLoadFun, downLoadFunName) => {
  if (downLoadFun.indexOf('batch_doc_task_feature_') != 0) {
    return
  }
  switch (downLoadFun.split('batch_doc_task_feature_')[1]) {
    case 'ceg':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('99909', '央企集团') + ')'
      break
    case 'invest':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('437956', 'PEVC投资企业') + ')'
      break
    case 'ste_108020101':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('204266', '高新技术企业') + ')'
      break
    case 'ste_108020102':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('232875', '科技型中小企业') + ')'
      break
    case 'ste_108020103':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('232876', '双软企业') + ')'
      break
    case 'ste_108020104':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('232877', '牛羚企业') + ')'
      break
    case 'ste_108020105':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('232878', '瞪羚企业') + ')'
      break
    case 'ste_108020106':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('204270', '独角兽企业') + ')'
      break
    case 'ste_108020109':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('232879', '创新型企业') + ')'
      break
    case 'ste_108020113':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('232880', '科技小巨人企业') + ')'
      break
    case 'ste_108020116':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('232881', '专精特新企业') + ')'
      break
    case 'ste_108020117':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('232882', '民营科技企业') + ')'
      break
    case 'tnb':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('420097', '新三板') + ')'
      break
    case 'ipo':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('142006', '上市企业') + ')'
      break
    case 'fnb':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('420070', '新四板') + ')'
      break
    case 'snt':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('132402', '科创板') + ')'
      break
    case 'debt':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('59563', '发债企业') + ')'
      break
    case 'bank':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('35063', '银行') + ')'
      break
    case 'insurance':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('1749', '保险公司') + ')'
      break
    case 'security':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('437867', '证券公司') + ')'
      break
    case 'fund':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('20593', '基金公司') + ')'
      break
    case 'future':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('211609', '期货公司') + ')'
      break
    case 'p2p':
      downLoadFunName = intl('233323', '特色企业导出') + '(' + intl('207793', 'P2P大全') + ')'
      break
  }
  return downLoadFunName
}
