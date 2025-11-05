/**
 * 历史数据 - historicalData
 * add by Calvin
 *
 * @format
 */
import { hzpscxk } from "./hzpscxk";

import { intlNoIndex } from "../../../../utils/intl";

export const qualificationsHonorsData = {
  hzpscxk, // 历史工商信息
};

const qualificationsHonorsModule = {
  moduleTitle: {
    title: intlNoIndex("284064", "资质荣誉"),
    moduleKey: "qualifications",
    noneData: intlNoIndex("348936", "暂无资质荣誉"),
  },
  ...qualificationsHonorsData,
};

export default qualificationsHonorsModule;
