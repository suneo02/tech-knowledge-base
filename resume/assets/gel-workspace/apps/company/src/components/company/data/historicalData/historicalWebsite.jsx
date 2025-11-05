/**
 * 历史网站备案 - Historical Website - 205871
 * Created by Calvin
 *
 * @format
 */

import { intlNoIndex } from "../../../../utils/intl";
import { notVipTips, WebLinks } from "../../context";

const title = intlNoIndex("205871");
const menuTitle = intlNoIndex("259026", "网站备案");

export const historicalWebsite = {
  cmd: "gethisdomain",
  title,
  menuTitle,
  moreLink: "historydomainname",
  modelNum: "his_domain_num",
  thWidthRadio: ["4%", "20%", "24%", "15%", "20%", "17%"],
  thName: [
    intlNoIndex("138741"),
    intlNoIndex("138578"),
    intlNoIndex("264205"),
    intlNoIndex("138266"),
    intlNoIndex("348793"),
    intlNoIndex("348177"),
  ],
  align: [1, 0, 0, 0, 0, 0],
  fields: [
    "NO.",
    "web_name|formatCont",
    "webHomePage",
    "domain_name|formatCont",
    "web_number|formatCont",
    "audit_transit_time|formatTime",
  ],
  columns: [
    null,
    null,
    {
      render: (txt, row) => {
        const url = row?.webHomePage;
        const openFunc = () => {
            url && window.open(`http://${url}`, "_blank");
        }
        return <WebLinks url={url} txt={txt} openFunc={openFunc} />;
      },
    },
  ],
  notVipTitle: title,
  notVipTips: notVipTips(title),
};
