/**
 * 历史土地抵押 - Historical Land Mortgage - 332513
 * Created by Calvin
 *
 * @format
 */

import { intlNoIndex } from "../../../../utils/intl";
import { notVipTips } from "../../context";

const title = intlNoIndex("332513");
const menuTitle = intlNoIndex("205406", "土地抵押");

export const historicalLandMortgage = {
  cmd: "getlandmortgage",
  title,
  menuTitle,
  notVipTitle: title,
  notVipTips: notVipTips(title),
  moreLink: "getlandmortgage",
  modelNum: "landmortgage_num",
  thWidthRadio: ["4%", "19%", "15%", "15%", "15%", "15%", "17%"],
  thName: [
    intlNoIndex("138741", "序号"),
    intlNoIndex("205434", "地块位置"),
    intlNoIndex("138392", "抵押人"),
    intlNoIndex("138391", "抵押权人"),
    intlNoIndex("205408", "抵押面积(公顷)"),
    intlNoIndex("205409", "抵押金额(万元)"),
    intlNoIndex("205394", "起止日期"),
  ],
  align: [1, 0, 0, 0, 0, 0, 0],
  fields: [
    "NO.",
    "landPos",
    "landMger",
    "landMgee",
    "landHa",
    "landMgAmt|formatMoneyComma",
    "landMgStart",
  ],
};
