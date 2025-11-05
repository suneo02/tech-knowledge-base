/**
 * 作废声明 - Statement of invalidation - 149696
 * Created by Calvin
 *
 * @format
 */

import { intlNoIndex } from '../../../../utils/intl'

const title = intlNoIndex('149696', '营业执照作废声明')

export const statementOfInvalidation = {
  cmd: 'detail/company/getlicenseabolish_licenseAbolish',
  title,
  moreLink: 'getvoidagestatement',
  modelNum: 'license_abolish_num',
  thWidthRadio: ['4%', '15%', '15%', '25%', '17%', '24%'],
  thName: [
    intlNoIndex('138741', '序号'),
    intlNoIndex('145866', '声明日期'),
    intlNoIndex('145867', '正副本'),
    intlNoIndex('145868', '声明内容'),
    intlNoIndex('145869', '副本编号'),
    intlNoIndex('145870', '补领情况'),
  ],
  align: [1, 0, 0, 0, 0, 0],
  fields: ['NO.', 'declaration_date|formatTime', 'original_or_copy', 'declaration_content', 'duplicate_no', 'replacement_status'],
}
