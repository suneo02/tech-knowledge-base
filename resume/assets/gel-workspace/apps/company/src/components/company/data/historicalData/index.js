/**
 * 历史数据 - historicalData
 * add by Calvin
 *
 * @format
 */
import { historicalBusinessInfo } from "./historicalBusinessInfo";
import { historicalShareholderInformation } from "./historicalShareholderInformation";
import { historicalLPSM } from "./historicalLPSM";
import { historicalInvestment } from "./historicalInvestment";
import { historicalAdministrativeLicensing } from "./historicalAdministrativeLicensing";
import { historicalWebsite } from "./historicalWebsite";
import { historicalEquityPledges } from "./historicalEquityPledges";
import { historicalLandMortgage } from "./historicalLandMortgage";
import { combinationOfMultipleCertificates } from "./combinationOfMultipleCertificates";
import { statementOfInvalidation } from "./statementOfInvalidation";
import { historyBeneficiaries } from "./historyBeneficiaries";
import { historyPossibleController } from "./historyPossibleController";



import { intlNoIndex } from "../../../../utils/intl";

export const historicalData = {
  historicalBusinessInfo, // 历史工商信息
  historicalShareholderInformation, // 历史股东信息
  historicalLPSM, // 历史法人和高管
  historicalInvestment, // 历史对外投资
  historicalAdministrativeLicensing, // 历史行政许可[工商局]
  historicalWebsite, // 历史网站备案
  historicalEquityPledges, // 历史股权出质
  historicalLandMortgage, // 历史土地抵押
  combinationOfMultipleCertificates, // “多证合一”信息公示
  statementOfInvalidation, // 营业执照作废声明
  historyBeneficiaries, // 历史最终受益人
  historyPossibleController // 历史实际控制人
};

const historicalDataModule = {
  moduleTitle: {
    title: intlNoIndex("33638"),
    moduleKey: "history",
    noneData: intlNoIndex("348939"),
  },
  ...historicalData,
};

export default historicalDataModule;
