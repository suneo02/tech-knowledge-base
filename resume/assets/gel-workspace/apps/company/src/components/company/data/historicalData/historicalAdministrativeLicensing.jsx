/**
 * 历史行政许可[工商局] - Historical Administrative Licensing - 222486
 * Created by Calvin
 *
 * @format
 */

import { intlNoIndex } from "../../../../utils/intl";
import { wftCommon } from "../../../../utils/utils";
import { notVipTips } from "../../context";

const title = intlNoIndex("222486");
const menuTitle =  intlNoIndex("313039", "行政许可");

export const historicalAdministrativeLicensing = {
  cmd: "detail/company/getpermissionhistory",
  title,
  menuTitle,
  notVipTitle: title,
  notVipTips: notVipTips(title),
  moreLink: "historypermission",
  modelNum: "his_permission_num",
  thWidthRadio: ["4%", "26%", "15%", "23%", "15%", "12%", "25%"],
  thName: [
    intlNoIndex("138741"),
    intlNoIndex("138376"),
    intlNoIndex("138375"),
    intlNoIndex("21235"),
    intlNoIndex("138291"),
    intlNoIndex("138377"),
    intlNoIndex("138378"),
  ],
  align: [1, 0, 0, 0, 0],
  fields: [
    "NO.",
    "permissionFileNumber|formatCont",
    "permissionFileName|formatCont",
    "effectiveStartDate",
    "failureDate|formatTime",
    "licenseDepartment",
    "licenseContent",
  ],
  columns: [
    null,
    null,
    null,
    {
      render: (_, row) => {
        if (
          row.effectiveExpirationDate == "9999/12/31" ||
          row.effectiveExpirationDate == "99991231"
        ) {
          return intlNoIndex("40768");
        }
        const effectiveExpirationDate = wftCommon.formatTime(
          row.effectiveExpirationDate
        );
        const effectiveStartDate = wftCommon.formatTime(row.effectiveStartDate);
        if (!row.effectiveStartDate && !row.effectiveExpirationDate)
          return "--";
        return `${effectiveStartDate} ${intlNoIndex("271245")} ${effectiveExpirationDate}`;
      },
    },
  ],
  extraParams: (param) => {
    param.__primaryKey = param.companycode;
    return param;
  },
};
