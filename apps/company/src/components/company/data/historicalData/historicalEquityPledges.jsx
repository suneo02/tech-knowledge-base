/**
 * 历史股权出质 - Historical EquityPledges - 205868
 * Created by Calvin
 *
 * @format
 */

import { intlNoIndex } from "../../../../utils/intl";
import { CompanyLinks, notVipTips } from "../../context";

/** 未来需要放在枚举文件夹内enum common */
// export enum AlignEnum {
//   Left,
//   Center,
//   Right,
// }

// interface Fields {
//   "NO.": string;
//   ep_reg_no: string;
//   ep_pledgor_name: string;
//   ep_pledgor_id: string;
//   ep_pawnee_name: string;
//   ep_pawnee_id: string;
//   ep_plex: string;
//   ep_plex_id: string;
//   "ep_equity_amount|formatMoneyComma": string;
//   "ep_reg_date|formatTime": string;
//   ep_reg_state: string;
// }

const tableDefalutInfo = {
  thWidthRadio: ["4%", "10%", "15%", "15%", "15%", "16%", "10%", "10%"],
  thName: [
    intlNoIndex("138741"),
    intlNoIndex("138769"),
    intlNoIndex("138447"),
    intlNoIndex("138446"),
    intlNoIndex("138528"),
    intlNoIndex("138283"),
    intlNoIndex("138248"),
    intlNoIndex("32098"),
  ],
  align: [
    // AlignEnum.Center,
    // AlignEnum.Left,
    // AlignEnum.Left,
    // AlignEnum.Left,
    // AlignEnum.Left,
    // AlignEnum.Right,
    // AlignEnum.Left,
    // AlignEnum.Left,
    1, 0, 0, 0, 0, 2, 0, 0,
  ],
  fields: [
    "NO.",
    "ep_reg_no",
    "ep_pledgor_name",
    "ep_pawnee_name",
    "ep_plex",
    "ep_equity_amount|formatMoneyComma",
    "ep_reg_date|formatTime",
    "ep_reg_state",
  ],
  extraParams: (param) => {
    param.__primaryKey = param.companycode;
    return param;
  },
  columns: [
    null,
    null,
    {
      // render: (txt: string, row: Fields) => {
      render: (txt, row) => (
        <CompanyLinks name={txt} id={row.ep_pledgor_id} />
      ),
    },
    {
      render: (txt, row) => (
        <CompanyLinks name={txt} id={row.ep_pawnee_id} />
      ),
    },
    {
      render: (txt, row) => (
        <CompanyLinks name={txt} id={row.ep_plex_id} />
      ),
    },
    null,
    null,
    {
      render: (txt) => txt || "--",
    },
  ],
};

const title = intlNoIndex("205868");
const menuTitle = intlNoIndex("138281", "股权出质");

export const historicalEquityPledges = {
  title,
  menuTitle,
  modelNum: "his_pledgor_num|his_pawnee_num|his_pcorp_num",
  notVipTitle: title,
  notVipTips: notVipTips(title),
  withTab: true,
  children: [
    {
      title: intlNoIndex("138447"),
      modelNum: "his_pledgor_num",
      cmd: "detail/company/gethisequitypledgelist_pledgor",
      ...tableDefalutInfo,
    },
    {
      title: intlNoIndex("138446"),
      modelNum: "his_pawnee_num",
      cmd: "detail/company/gethisequitypledgelist_pawnee",
      ...tableDefalutInfo,
    },
    {
      title: intlNoIndex("138527"),
      modelNum: "his_pcorp_num",
      cmd: "detail/company/gethisequitypledgelist",
      ...tableDefalutInfo,
    },
  ],
};
