import React from 'react'
import { formatTimeIntl } from '../utils/format/time'
import intl from '../utils/intl'
import { wftCommon } from '../utils/utils'
import { financialCorpFilters } from '@/handle/SearchAppList/financialCorp'

const is_terminal = wftCommon.usedInClient()

// datePicker 格式化
export const dateFormat = 'YYYY-MM-DD'
export const STATIC_FILE_PATH = '/Wind.WFC.Enterprise.Web/PC.Front/resource/static/'

// 榜单名录翻译词条
export const featureInfo = {
  '01010000': intl('259909', '企业名录'),
  '01020000': intl('437805', '企业榜单'),
  '01010100': intl('260400', '科技型企业名录'),
  '01010300': intl('260433', '特色企业名录'),
  '01010200': intl('259142', '国企名录'),
  '01010400': intl('295512', '高校名录'),
  '01010500': intl('338733', '绿色名录'),
  2010202098: {
    name: intl('437820', '高新技术企业'),
    brief: intl(
      '314086',
      '是指在国家颁布的《国家重点支持的高新技术领域》范围内，持续进行研究开发与技术成果转化，形成企业核心自主知识产权，并以此为基础开展经营活动，在中国境内（不包括港、澳、台地区）注册一年以上的居民企业。'
    ),
  },
  2010202479: {
    name: intl('437823', '科技小巨人企业'),
    brief: intl(
      '314136' /* 一般指在研究、开发、生产、销售和管理过程中，通过技术创新、管理创新、服务创新或模式创新取得核心竞争力，提供高新技术产品或服务，具有较高成长性或发展潜力的科技创新中小企业。 */
    ),
  },
  2010202470: {
    name: intl('437807', '科技型中小企业'),
    brief: intl(
      '314137' /* 以科技人员为主体，由科技人员领办和创办，主要从事高新技术产品的科学研究、研制、生产、销售，以科技成果商品化以及技术开发、技术服务、技术咨询和高新产品为主要内容，以市场为导向，实行“自筹资金、自愿组合、自主经营、自负盈亏、自我发展、自我约束”的知识密集型经济实体。 */
    ),
  },
  2010100370: {
    name: intl('430244', '专精特新小巨人企业'),
    brief: intl(
      '314138' /* 是由国家工业和信息化部组织遴选认定的，培育一批主营业务突出、竞争力强、成长性好的专精特新“小巨人”企业。 */
    ),
  },
  2010202471: {
    name: intl('437856', '专精特新中小企业'),
    brief: intl(
      '314139',
      '一般指具有“专业化、精细化、特色化、新颖化”特征的工业中小企业。通过引导中小企业专精特新发展，进一步激发中小企业活力和发展动力，推动中小企业转型升级。'
    ),
  },
  2010200008: {
    name: intl('437824', '星火计划企业'),
    brief: intl(
      '314087' /* 是党中央、国务院批准实施、面向农村经济主战场的指导性科技开发计划，是我国国民经济计划和科学技术计划的一个重要组成部分，是实施科教兴农的重要措施。 */
    ),
  },
  2010200007: {
    name: intl('437825', '火炬计划企业'),
    brief: intl(
      '314140' /* 以国内外市场需求为导向，以国家、地方和行业的科技攻关计划、最新技术研究开发计划成果以及其它科研成果为依托，以发展高新技术产品、形成产业为目标，择优评选并组织实施的高科技产业化项目。通过火炬计划项目的实施，造就高新技术企业和企业集团。 */
    ),
  },
  2010200013: {
    name: intl('437826', '国家软科学研究计划企业'),
    brief: intl(
      '314088' /* 是国家科技计划的重要组成部分，计划的主要任务是：以实现决策科学化、民主化为目标，综合运用自然科学、社会科学和工程技术多门类、多学科知识，为科技和经济社会发展的重大决策提供支撑。 */
    ),
  },
  2010202481: {
    name: intl('437808', '民营科技企业'),
    brief: intl(
      '314141' /* 以科技人员为主体创办的，实行自筹资金、自愿组合、自主经营、自负盈亏、自我约束、自我发展的经营机制，主要从事科技成果转化及技术开发、技术转让、技术咨询、技术服务或实行高新技术及其产品的研究、开发、生产、销售的智力、技术密集型的经济实体。 */
    ),
  },
  2010202480: {
    name: intl('430242', '技术先进型服务企业'),
    brief: intl(
      '314142' /* 是指国家为了扶持高端技术性服务业的发展，对从事技术外包、业务外包和知识外包服务的企业进行税收等多项政策支持的企业类型。 */
    ),
  },
  2010202474: {
    name: intl('437827', '瞪羚企业'),
    brief: intl('314143', '一般指创业后跨过死亡谷以科技创新或商业模式创新为支撑进入高成长期的中小企业。'),
  },
  2010202478: {
    name: intl('430241', '雏鹰企业'),
    brief: intl('314144', '一般指技术水平领先、竞争能力强、成长型好的科技型初创企业。'),
  },
  2010200009: {
    name: intl('437828', '科技服务体系企业'),
    brief: intl(
      '314089' /* 是指运用现代科技知识、现代技术和分析研究方法，以及经验、信息等要素向社会提供智力服务的新兴产业，主要包括科学研究、专业技术服务、技术推广、科技信息交流、科技培训、技术咨询、技术孵化、技术市场、知识产权服务、科技评估和科技鉴证等服务。 */
    ),
  },

  2010000078: {
    name: intl('59563', '发债企业'),
    brief: intl(
      '437836' /* 是指因资金不足，经中国人民银行批准，自行发售债券，也可以委托银行或其他金融机构代理发售债券，筹集所需资金的企业。 */
    ),
  },
  10000343: {
    name: intl('48058', '金融机构'),
    brief: intl('437836', '是指国务院金融管理部门监督管理的从事金融业务的机构，涵盖行业有银行、证券、保险等。'),
  },
  2010100687: {
    name: intl('437829', '活跃融资企业'),
    brief: intl('437813', '是指近一年内成功融资的企业。'),
  },
  2010000007: {
    name: intl('142006', '上市企业'),
    brief: intl(
      '314147' /* 是指所发行的股票经过国务院或者国务院授权的证券管理部门批准在证券交易所上市交易的股份有限公司。 */
    ),
  },
  2010202489: {
    name: intl('437809', '中华老字号'),
    brief: intl(
      '314148',
      '中华老字号是指历史悠久，拥有世代传承的产品、技艺或服务，具有鲜明的中华民族传统文化背景和深厚的文化底蕴，获得社会广泛认同，形成良好信誉的品牌。'
    ),
  },
  2010100013: {
    name: intl('437830', '独角兽企业'),
    brief: intl('437957', '一般指10亿美元以上估值，并且创办时间相对较短（一般为十年内）还未上市的企业。'),
  },
  2010202476: {
    name: intl('437831', '创新型企业'),
    brief: intl(
      '314091' /* 是指拥有自主知识产权和知名品牌，具有较强国际竞争力，依靠技术创新获取市场竞争优势和持续发展的企业。 */
    ),
  },
  2010200011: {
    name: intl('437810', '创新型产业集群企业'),
    brief: intl(
      '314150' /* 是指产业链相关联企业、研发和服务机构在特定区域聚集，通过分工合作和协同创新，形成具有跨行业跨区域带动作用和国际竞争力的产业组织形态。 */
    ),
  },
  2010202477: {
    name: intl('430240', '隐形冠军企业'),
    brief: intl(
      '314151' /* 是指不为公众所熟知，却在某个细分行业或市场占据领先地位，拥有核心竞争力和明确战略，其产品、服务难以被超越和模仿的中小型企业。 */
    ),
  },
  2010200014: {
    name: intl('437832', '国家重点新产品计划企业'),
    brief: intl(
      '314152' /* 国家重点新产品计划是国家科技计划体系中科技产业化环境建设的重要组成部分，是一项政策性引导计划。 */
    ),
  },
  2010100686: {
    name: intl('437956', 'PEVC投资企业'),
    brief: intl('437841', '是指成功接受私募股权投资和创业投资的企业。'),
  },
  2010100369: {
    name: intl('437833', '制造业单项冠军企业'),
    brief: intl(
      '314153' /* 是指长期专注于制造业某些特定细分产品市场，生产技术或工艺国际领先，单项产品市场占有率位居全球前列的企业。 */
    ),
  },
  2010100371: {
    name: intl('437821', '军民融合企业'),
    brief: intl('437854', '是指将军品部分和民品部分融合，是指有条件的民营企业可以参与军品的科研生产。'),
  },
  2010202472: {
    name: intl('437834', '双软企业'),
    brief: intl(
      '314155' /* 是指软件企业的认定和软件产品的登记，认定标准2011年1月1日后依法在中国境内成立的企业法人。特点是软件产品实行登记和备案制度。 */
    ),
  },

  2010100011: {
    name: intl('437822', '国资委实际控股企业'),
    brief: intl('437838', '是指实际控制人为国务院国有资产监督管理委员会的企业。'),
  },
  2010100012: {
    name: intl('437835', '国资委直接参股企业'),
    brief: intl('437839', '是指国务院国有资产监督管理委员会直接参股的企业。'),
  },

  2010100689: {
    name: intl('437802', '教育部直属高校'),
    brief: intl('437855', '指由中华人民共和国教育部直属管理的一批高等学校，是中央部门直属高等学校的重要组成部分。'),
  },
  2010100691: {
    name: intl('437792', '双一流院校'),
    brief: intl('437806', '主要指的是建设世界一流大学和世界一流学科。'),
  },
  2010100694: {
    name: intl('437793', '双高院校'),
    brief: intl(
      '314173' /* 是指入选双高计划的院校。“双高计划”旨在打造技术技能人才培养高地和技术技能创新服务平台；引领职业教育服务国家战略、融入区域发展、促进产业升级。 */
    ),
  },
  2010100697: {
    name: intl('437954', '985工程院校'),
    brief: intl(
      '314159' /* 是指中国共产党和中华人民共和国国务院在世纪之交为建设具有世界先进水平的一流大学而做出的重大决策。 */
    ),
  },
  2010100698: {
    name: intl('437955', '211工程院校'),
    brief: intl('314160', '是指面向21世纪、重点建设100所左右的高等学校和一批重点学科的建设工程。'),
  },
  2010202491: {
    name: intl('437845', '绿色工厂'),
    brief: intl('437844', '绿色工厂是指实现了用地集约化、原料无害化、生产洁净化、废物资源化、能源低碳化的工厂。'),
  },
  2010202492: {
    name: intl('437846', '绿色供应链管理企业'),
    brief: intl(
      '437843',
      '绿色供应链管理是指以绿色制造理论和供应链管理技术为基础，涉及供应商、生产商、销售商和用户，其目的是使得产品从物料获取、加工、包装、仓储、运输、使用到报废处理回收利用的整个过程中，实现对环境的影响最小，资源效率最高的目标。'
    ),
  },
  2010202505: {
    name: intl('437848', '重点专精特新小巨人企业'),
    brief: intl(
      '437858',
      '包含重点“小巨人”企业和公共服务示范平台。重点“小巨人”企业是由工业和信息化部商财政部从已认定的专精特新“小巨人”企业中择优选定，公共服务示范平台是由省级中小企业主管部门商同级财政部门从工业和信息化部（或省级中小企业主管部门）认定的国家（或省级）中小企业公共服务示范平台中选定。'
    ),
  },
  2010202500: {
    name: intl('437849', '创建世界一流示范企业'),
    brief: intl(
      '338614',
      '打造“产品卓越、品牌卓著、创新领先、治理现代”的世界一流企业。围绕“三个领军”“三个领先”“三个典范”的核心内涵（三个领军是指，在国际资源配置中占主导地位、引领全球行业技术发展、在全球产业发展中具有话语权和影响力的领军企业。三个领先是指，全要素生产率和劳动生产率等效率指标、净资产收益率和资本保值增值率等效益指标、提供优质产品和服务等方面的领先企业。三个典范是指，践行新发展理念、履行社会责任、拥有全球品牌形象的典范企业），全面对标世界一流企业，找差距、补短板、抓改革、强创新，发挥示范引领和突破带动作用。'
    ),
  },
  2010202501: {
    name: intl('437857', '创建世界一流专精特新示范企业'),
    brief: intl(
      '437850',
      '打造“专业突出、创新驱动、管理精益、特色明显”的世界一流专精特新企业。专注细分行业且致力于发展达到其领域内的世界一流水平的企业，侧重在专注领域培育体现自身发展特色的核心竞争力。世界一流专精特新示范企业服务于分类推进世界一流企业建设的核心思路，除“专精特新”外，也兼具“世界一流”和“示范性”的特征。选取全国范围内“专精特新”特色领域的一流国有企业代表，发挥示范带动作用。'
    ),
  },
  2010202498: {
    name: intl('437859', '双百企业'),
    brief: intl(
      '437851',
      '“双百企业”是在国企改革“双百行动”中选取的百余户中央企业子企业和百余户地方国有骨干企业。国企改革“双百行动”，是国务院国有企业改革领导小组组织开展的国企改革专项行动之一，在2018-2020年期间，全面落实“1+N”系列文件要求，深入推进综合性改革，在改革重点领域和关键环节率先取得突破，打造一批治理结构科学完善、经营机制灵活高效、党的领导坚强有力、创新能力和市场竞争力显著提升的国企改革尖兵，充分发挥示范突破带动作用，凝聚起全面深化国有企业改革的强大力量，形成全面铺开的国企改革崭新局面和良好态势。'
    ),
  },
  2010202499: {
    name: intl('437874', '科改企业'),
    brief: intl(
      '338617',
      '“科改企业”是在国企改革“科改行动”中选取的科技型企业。“科改行动”是指国企改革专项工程中的百户科技型企业深化市场化改革提升自主创新能力专项行动。2020年4月，“科改行动”启动实施，支持引导一批国有科技型企业将深化市场化改革与提升自主创新能力有机融合、有序衔接、相互促进，打造一批国有科技型企业的改革样板和创新尖兵。'
    ),
  },
  2010202506: {
    name: intl('437852', '联合国责任投资原则组织全球企业'),
    brief: intl(
      '338620',
      '联合国责任投资原则组织（简称UN PRI），由联合国前秘书长科菲·安南于2006年牵头发起，旨在帮助投资者理解环境、社会和公司治理等要素对投资价值的影响，并支持各签署机构将这些要素融入投资战略、决策及积极所有权中。该组织旨在帮助投资者理解环境、社会和公司治理等要素对投资价值的影响，并支持各签署机构将这些要素融入投资战略、决策及积极所有权中。包含联合国责任投资原则组织全球的企业（包含国内）。'
    ),
  },
  2010202507: {
    name: intl('437877', '联合国责任投资原则组织国内企业'),
    brief: intl(
      '338618',
      '联合国责任投资原则组织（简称UN PRI），由联合国前秘书长科菲·安南于2006年牵头发起，旨在帮助投资者理解环境、社会和公司治理等要素对投资价值的影响，并支持各签署机构将这些要素融入投资战略、决策及积极所有权中。该组织旨在帮助投资者理解环境、社会和公司治理等要素对投资价值的影响，并支持各签署机构将这些要素融入投资战略、决策及积极所有权中。包含联合国责任投资原则组织国内的企业。'
    ),
  },
  2010202497: {
    name: intl('437879', '全国碳排放权交易配额管理企业'),
    brief: intl(
      '437860',
      '碳排放权交易是指符合条件的交易主体通过交易机构对碳排放配额等产品进行公开买卖行为。未来企业排放高于配额，需要到市场上购买配额，未来企业排放低于配额，可通过市场出售配额。全国碳排放权交易配额管理企业是指拥有全国碳排放权交易市场配额的企业。'
    ),
  },
  2010100701: {
    name: intl('437958', '101计划高校'),
    brief: intl(
      '354254',
      '101计划高校”是指教育部启动实施的计算机领域本科教育教学改革试点工作计划。第一阶段以中国拔尖的33所计算机类基础学科培养基地建设高校为主进行实验，第二阶段在全国高校中分步进行推广。'
    ),
  },
  2010202508: {
    name: intl('394593', '工业和信息化部重点实验室'),
    brief: intl(
      '437863',
      '工业和信息化部重点实验室是工业和信息化领域技术创新体系的重要组成部分，是开展高水平研发活动、聚集和培养优秀科技人才、进行高层次学术交流和促进科技成果转化的重要基地，也是制造业创新体系的重要支撑。'
    ),
  },

  2010202510: {
    name: intl('437882', '知识产权优势企业'),
    brief: intl(
      '354257',
      '知识产权优势企业指的是以自主知识产权为核心驱动力,具有较强综合竞争力和市场占有率的企业。这些企业在知识产权的开发、保护、运用等方面取得了显著的成就,从而在市场上获得了相对优势。'
    ),
  },

  2010202509: {
    name: intl('437866', '知识产权示范企业'),
    brief: intl(
      '354258',
      '知识产权示范企业指的是具备知识产权战略管理理念，能有效运用知识产权制度,提升知识产权价值和核心竞争力,在创造质量、运用效益、保护效果和管理效能方面具备典型示范意义的知识产权密集型企业。'
    ),
  },
  2010202511: {
    name: intl('437885', '企业工业设计中心'),
    brief: intl('437865', '制造业企业等单位设立的，主要为本单位提供工业设计服务的企业工业设计中心。'),
  },
  2010202512: {
    name: intl('437886', '工业设计企业'),
    brief: intl('437884', '面向市场需求提供工业设计服务的工业设计企业。'),
  },
}

// 特色企业配置
// type: ipo 主板 snt 科创 tnb 三板 fnb 四板 dept 发债
// corpNature: 中央企业 中央国有企业 省级国有企业|市级国有企业|区县级国有企业
// bank 银行 "insurance" 保险 "security" 证券 "fund" 基金 "future" 期货
// feature: "invest" pevc
export const SpecialAppListConfig = {
  ipoNew: {
    title: intl('142006', '上市企业'),
    key: 'ipoNew',
    countKey: 'member_company_num',
    api: 'search/feature/SearchFeatureIpoList',
    noExtra: true, // url不需要拼接id
    showIndex: true,
    columns: [
      {
        titleId: '32992',
        align: 'left',
        width: '10%',
        render: function (_txt, data) {
          if (data['ipo'] && data['ipo'].length) {
            const ipos = data['ipo'] || {}
            const href = '!Page[Minute,' + ipos[0].windCode + ']'
            return is_terminal ? (
              <a href={href} data-uc-id="Q8kocrsJje" data-uc-ct="a">
                {ipos[0].securityChineseName}
              </a>
            ) : (
              ipos[0].securityChineseName
            )
          }
          return '--'
        },
      },
      {
        titleId: '6440',
        align: 'left',
        width: '10%',
        render: function (_txt, data) {
          if (data['ipo'] && data['ipo'].length) {
            const ipos = data['ipo'] || {}
            const href = '!Page[Minute,' + ipos[0].windCode + ']'
            return is_terminal ? (
              <a href={href} data-uc-id="j8tGOr413O" data-uc-ct="a">
                {ipos[0].tradeCode}
              </a>
            ) : (
              ipos[0].tradeCode
            )
          }
          return '--'
        },
      },
      { titleId: '32914', align: 'left', width: '18%', dataIndex: 'corpName', companyLinks: { id_key: 'corpId' } },
      { titleId: '5529', align: 'left', width: '10%', dataIndex: 'artificialPerson' },
      { titleId: '18688', align: 'right', width: '12%', dataIndex: 'registerCapital|formatMoneyComma' },
      { titleId: '35776', align: 'left', width: '23%', dataIndex: 'registerAddress' },
      { titleId: '111024', align: 'left', width: '12%', dataIndex: 'listingDate|formatTime' },
    ],
    defaultParams: {
      corpNature: '主板',
    },
    filters: [
      {
        title: intl('437737', '所属板块'),
        data: [
          {
            name: intl('35753', '主板'),
            key: 'ipoNew1',
            params: {
              corpNature: '主板',
            },
          },
          {
            name: intl('153470', '科创版'),
            key: 'ipoNew2',
            params: {
              corpNature: '科创板',
            },
          },
          {
            name: intl('3208', '创业板'),
            key: 'ipoNew3',
            params: {
              corpNature: '创业板',
            },
          },
          {
            name: intl('332933', '北交所'),
            key: 'ipoNew4',
            params: {
              corpNature: '北交所',
            },
          },
          {
            name: intl('420097', '新三板'),
            key: 'ipoNew5',
            params: {
              corpNature: '新三板',
            },
          },
          {
            name: intl('420070', '新四板'),
            key: 'ipoNew6',
            params: {
              corpNature: '新四板',
            },
          },
        ],
      },
    ],
    hiddenTxt: false,
    downDocType: false,
  },
  debtNew: {
    title: intl('220263', '发债企业'),
    key: 'debtNew',
    api: 'search/feature/SearchFeatureDebtList',
    showIndex: true,
    columns: [
      {
        titleId: '32914',
        titleName: '公司名称',
        align: 'left',
        dataIndex: 'corpName',
        companyLinks: { id_key: 'corpId' },
      },
      { titleId: '138808', titleName: '统一社会信用代码', align: 'left', dataIndex: 'creditCode', width: '16%' },
      { titleId: '138416', titleName: '经营状态', align: 'left', dataIndex: 'govlevel', width: '8%' },
      {
        titleId: '419998',
        titleName: '成立日期',
        align: 'left',
        dataIndex: 'establishedTime|formatTime',
        width: '10%',
      },
      {
        titleId: '138185',
        titleName: '营业期限',
        align: 'left',
        render: (_data, row) => {
          return (
            formatTimeIntl(row.establishedTime) +
            ' ' +
            intl('271245', ' 至 ') +
            ' ' +
            (row.operPeriodEnd ? wftCommon.formatTimeChinese(row.operPeriodEnd) : intl('271247', '无固定期限'))
          )
        },
      },
      // { titleId: '265705', titleName:'注册资本（万）',align: 'left', width: '25%', dataIndex: 'register_address|formatMoneyComma' },
      { titleId: '5529', titleName: '法定代表人', align: 'left', dataIndex: 'artificialPerson', width: '10%' },
      { titleId: '138699', titleName: '省份地区', align: 'left', dataIndex: 'region|formatTime' },
      { titleId: '10057', titleName: '联系电话', align: 'left', dataIndex: 'tel' },
    ],
    noExtra: true, // url不需要拼接id
    defaultParams: {
      corpNature: '',
    },
    filters: [],
    hiddenTxt: false,
    downDocType: false,
  },
  cngroup: {
    title: intl('252985', '央企国企'),
    key: 'cngroup',
    api: 'search/feature/SearchFeatureCNGroupList',
    showIndex: true,
    columns: [
      { titleId: '32914', align: 'left', width: '35%', dataIndex: 'corpName', companyLinks: { id_key: 'corpId' } },
      { titleId: '32674', align: 'left', width: '28%', dataIndex: 'region' },
      { titleId: '414193', align: 'left', width: '30%', dataIndex: 'establishedTime|formatTime' },
    ],
    noExtra: true, // url不需要拼接id
    defaultParams: {
      route: 'cngroup',
      source: 'searchfeature2',
      sort: 9,
      corpNature: '中央企业',
    },
    filters: [
      {
        title: intl('437842', '央企类型'),
        data: [
          {
            name: intl('265644', '中央企业'),
            key: 'cngroup1',
            params: {
              route: 'cngroup',
              source: 'searchfeature2',
              corpNature: '中央企业',
              sort: 9,
            },
          },
          {
            name: intl('437779', '中央部门和单位所属企业'),
            key: 'cngroup2',
            params: {
              route: 'cngroup',
              source: 'searchfeature2',
              corpNature: '中央国有企业',
              sort: 9,
            },
          },
          {
            name: intl('437774', '地方国有及国有控股企业'),
            key: 'cngroup3',
            params: {
              route: 'cngroup',
              source: 'searchfeature2',
              corpNature: '省级国有企业|市级国有企业|区县级国有企业',
              sort: 9,
            },
          },
        ],
      },
    ],
    hiddenTxt: false,
    downDocType: false,
  },
  financialcorp: {
    title: intl('48058', '金融机构'),
    key: 'financialcorp',
    api: 'search/feature/SearchFeatureFinancialList',
    noExtra: true, // url不需要拼接id
    showIndex: true,
    columns: [
      { titleId: '32914', align: 'left', width: '24%', dataIndex: 'corpName', companyLinks: { id_key: 'corpId' } },
      {
        titleId: '5529',
        align: 'left',
        width: '9%',
        dataIndex: 'artificialPerson',
        render: function (_txt, data) {
          const personName = data['artificialPerson']
          const personId = data['artificial_person_id']
          if (personId?.length > 0 && personId?.length < 16) {
            return (
              <a
                href="javascript:"
                onClick={wftCommon.jumpJqueryPage(
                  `Company.html?companycode=${personId}&name=${personName}${wftCommon.isNoToolbar()}`
                )}
                data-uc-id="rg_uZGpcK0"
                data-uc-ct="a"
              >
                {wftCommon.formatCont(personName)}
              </a>
            )
          }
          return wftCommon.formatCont(personName)
        },
      },
      { titleId: '18688', align: 'right', width: '20%', dataIndex: 'registerCapital|formatMoneyComma' },
      { titleId: '35776', align: 'left', width: '28%', dataIndex: 'registerAddress' },
      { titleId: '414193', align: 'left', width: '12%', dataIndex: 'establishedTime|formatTime' },
    ],
    defaultParams: {
      route: 'financialcorp',
      corpNature: '银行',
      source: 'searchfeature2',
      sort: 1,
      type: 'bank',
    },
    filters: financialCorpFilters,
    hiddenTxt: false,
    downDocType: false,
  },
  pevcinvest: {
    title: intl('265623', 'PEVC被投企业'),
    key: 'pevcinvest',
    api: 'search/feature/SearchFeaturePEVCList',
    noExtra: true, // url不需要拼接id
    showIndex: true,
    columns: [
      { titleId: '32914', align: 'left', width: '28%', dataIndex: 'corpName', companyLinks: { id_key: 'corpId' } },
      {
        titleId: '5529',
        align: 'left',
        width: '10%',
        dataIndex: 'artificialPerson',
        render: function (_txt, data) {
          const personName = data['artificialPerson']
          const personId = data['artificial_person_id'] || ''
          if (personId.length > 0 && personId.length < 16) {
            return (
              <a
                href="javascript:"
                onClick={wftCommon.jumpJqueryPage(
                  `Company.html?companycode=${personId}&name=${personName}${wftCommon.isNoToolbar()}`
                )}
                data-uc-id="L9qrFDsGOs"
                data-uc-ct="a"
              >
                {wftCommon.formatCont(personName)}
              </a>
            )
          }
          return wftCommon.formatCont(personName)
        },
      },
      { titleId: '18688', align: 'right', width: '12%', dataIndex: 'registerCapital|formatMoneyComma' },
      { titleId: '35776', align: 'left', width: '30%', dataIndex: 'registerAddress' },
      { titleId: '414193', align: 'left', width: '13%', dataIndex: 'establishedTime|formatTime' },
    ],
    defaultParams: {
      corpNature: 'invest',
    },
    filters: [],
    hiddenTxt: false,
    downDocType: false,
  },
  moreFeturedList: {
    title: intl('437775', '更多企业榜单名录'),
    link: 'feturedlist.html',
  },
}
