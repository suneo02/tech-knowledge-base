import { chatRefTableMock1, chatSuggestResMock1 } from '@/mocks/chatShare/ref/mock1';
import { RPDetailChapter } from 'gel-api';
import { chatDetailTurnList3 } from '../chat/chatDetailTurnList3';
import { rpFileMock1 } from '../reportShare/mock1';
import { rpFileMock2 } from '../reportShare/mock2';
import { rpFileMock3 } from '../reportShare/mock3';

// 基础章节数据 - 使用现有的数据结构
export const outlineMock4: RPDetailChapter[] = [
  {
    title: '市场概述',
    writingThought: '本章将介绍当前市场的基本情况和主要趋势...',
    chapterId: 1,
    children: [
      {
        title: '市场规模',
        writingThought: '根据最新数据显示，市场规模达到...',
        content: chatDetailTurnList3[0].answers,
        contentType: 'md',
        chapterId: 11,
        children: [],
        refData: chatDetailTurnList3[0].data.result.content?.data,
        refSuggest: chatDetailTurnList3[0].data.result.suggest?.items,
        traceContent: chatDetailTurnList3[0].traceContent,
        entities: chatDetailTurnList3[0].entity,
        files: rpFileMock1,
      },
      {
        title: '市场趋势',
        writingThought: '近年来市场呈现以下主要趋势...',
        content:
          '<ul><li><p>小米科技有限责任公<strong>司成</strong>立于2010<strong>年，是一家专注于智能硬件和电子产品研发的全球化移动互联网企业，同时也是一家专注于高端智能手机、互联网电视及智能家居生态链建设的创新型科技企业。小米公司创造了用互联网模式开发手机操作系统、发烧友参与开发改进的模式。小米公司应用了互联网开发模式开发产品的模式，用极客精神做产品，用互联网模式干掉中间环节，致力让全球每个人，都能享用来自中国的优质科技产品。</strong></p></li></ul>',
        contentType: 'html',
        chapterId: 12,
        children: [],
        refData: chatRefTableMock1,
        refSuggest: chatSuggestResMock1,
        files: rpFileMock2,
      },
    ],
  },
  {
    title: '竞争分析',
    writingThought: '本章将深入分析主要竞争对手的情况...',
    content: '本章将深入分析主要竞争对手的情况...',
    contentType: 'html',
    chapterId: 2,
    children: [
      {
        title: '主要竞争对手',
        writingThought: '目前市场上的主要竞争对手包括...',
        content:
          '<div contenteditable="false" class="table-wrapper" id="mcsgkljlgrb7ifg2b5" ><div class="pre"><span class="pre-index">图表<span class="pre-index-text">1</span>：</span><span contenteditable="true" class="pre-title">工商信息</span></div><div class="table-wrapper-diligence"><table title="工商信息" class="smart-ui-table"><thead class="smart-ui-table-thead"><tr class="smart-ui-table-tr-even"><th class="smart-ui-table-th">项目</th><th class="smart-ui-table-th">数据</th></tr></thead><tbody class="smart-ui-table-tbody"><tr class="smart-ui-table-tr-odd"><td class="smart-ui-table-td">企业名称</td><td class="smart-ui-table-td">小米科技有限责任公司</td></tr><tr class="smart-ui-table-tr-even"><td class="smart-ui-table-td">英文名称</td><td class="smart-ui-table-td">XIAOMI INC.</td></tr><tr class="smart-ui-table-tr-odd"><td class="smart-ui-table-td">曾用名</td><td class="smart-ui-table-td">北京小米科技有限责任公司</td></tr><tr class="smart-ui-table-tr-even"><td class="smart-ui-table-td">公司类型</td><td class="smart-ui-table-td">有限责任公司(自然人投资或控股)</td></tr><tr class="smart-ui-table-tr-odd"><td class="smart-ui-table-td">统一社会信用代码</td><td class="smart-ui-table-td">91110108551385082Q</td></tr><tr class="smart-ui-table-tr-even"><td class="smart-ui-table-td">注册号</td><td class="smart-ui-table-td">110108012660422</td></tr><tr class="smart-ui-table-tr-odd"><td class="smart-ui-table-td">纳税人识别号</td><td class="smart-ui-table-td">91110108551385082Q</td></tr><tr class="smart-ui-table-tr-even"><td class="smart-ui-table-td">纳税人资质</td><td class="smart-ui-table-td">增值税一般纳税人</td></tr><tr class="smart-ui-table-tr-odd"><td class="smart-ui-table-td">法定代表人</td><td class="smart-ui-table-td">雷军</td></tr><tr class="smart-ui-table-tr-even"><td class="smart-ui-table-td">注册资本</td><td class="smart-ui-table-td">185000.0万</td></tr><tr class="smart-ui-table-tr-odd"><td class="smart-ui-table-td">实缴资本</td><td class="smart-ui-table-td">185000.0万</td></tr><tr class="smart-ui-table-tr-even"><td class="smart-ui-table-td">成立日期</td><td class="smart-ui-table-td">2010-03-03</td></tr><tr class="smart-ui-table-tr-odd"><td class="smart-ui-table-td">营业期限自</td><td class="smart-ui-table-td">2010-03-03</td></tr><tr class="smart-ui-table-tr-even"><td class="smart-ui-table-td">营业期限至</td><td class="smart-ui-table-td"><br data-mce-bogus="1"></td></tr><tr class="smart-ui-table-tr-odd"><td class="smart-ui-table-td">经营状态</td><td class="smart-ui-table-td">存续</td></tr><tr class="smart-ui-table-tr-even"><td class="smart-ui-table-td">所属省份</td><td class="smart-ui-table-td">北京市</td></tr><tr class="smart-ui-table-tr-odd"><td class="smart-ui-table-td">登记机关</td><td class="smart-ui-table-td">北京市海淀区市场监督管理局</td></tr><tr class="smart-ui-table-tr-even"><td class="smart-ui-table-td">核准日期</td><td class="smart-ui-table-td">2024-11-21</td></tr><tr class="smart-ui-table-tr-odd"><td class="smart-ui-table-td">参保人数</td><td class="smart-ui-table-td">37</td></tr><tr class="smart-ui-table-tr-even"><td class="smart-ui-table-td">国民经济行业分类</td><td class="smart-ui-table-td">制造业-计算机、通信和其他电子设备制造业-智能消费设备制造</td></tr><tr class="smart-ui-table-tr-odd"><td class="smart-ui-table-td">Wind行业分类</td><td class="smart-ui-table-td">可选消费-家电Ⅱ-家电Ⅲ-消费电子产品</td></tr><tr class="smart-ui-table-tr-even"><td class="smart-ui-table-td">注册地址</td><td class="smart-ui-table-td">北京市海淀区西二旗中路33号院6号楼6层006号</td></tr><tr class="smart-ui-table-tr-odd"><td class="smart-ui-table-td">办公地址</td><td class="smart-ui-table-td">北京市海淀区西二旗中路33号院6号楼6层006号</td></tr><tr class="smart-ui-table-tr-even"><td class="smart-ui-table-td">经营范围</td><td class="smart-ui-table-td">一般项目:技术服务、技术开发、技术咨询、技术交流、技术转让、技术推广;货物进出口;技术进出口;进出口代理;通讯设备销售;厨具卫具及日用杂品批发;厨具卫具及日用杂品零售;个人卫生用品销售;卫生用品和一次性使用医疗用品销售;日用杂品销售;日用百货销售;日用品销售;化妆品批发;化妆品零售;第一类医疗器械销售;第二类医疗器械销售;玩具销售;体育用品及器材零售;体育用品及器材批发;文具用品零售;文具用品批发;鞋帽批发;鞋帽零售;服装服饰批发;服装服饰零售;钟表销售;眼镜销售(不含隐形眼镜);针纺织品销售;家用电器销售;日用家电零售;家具销售;礼品花卉销售;农作物种子经营(仅限不再分装的包装种子);照相机及器材销售;照相器材及望远镜批发;照相器材及望远镜零售;工艺美术品及收藏品零售(象牙及其制品除外);工艺美术品及礼仪用品销售(象牙及其制品除外);计算机软硬件及辅助设备零售;计算机软硬件及辅助设备批发;珠宝首饰零售;珠宝首饰批发;食用农产品批发;食用农产品零售;宠物食品及用品批发;宠物食品及用品零售;电子产品销售;摩托车及零配件零售;摩托车及零配件批发;电动自行车销售;助动自行车、代步车及零配件销售;自行车及零配件零售;自行车及零配件批发;单用途商业预付卡代理销售;商用密码产品销售;五金产品批发;五金产品零售;建筑材料销售;仪器仪表修理;计算机及办公设备维修;办公设备销售;会议及展览服务;组织文化艺术交流活动;广告设计、代理;广告制作;广告发布;摄影扩印服务;票务代理服务;通讯设备修理;移动终端设备制造;可穿戴智能设备制造。(除依法须经批准的项目外,凭营业执照依法自主开展经营活动)许可项目:第三类医疗器械经营;网络文化经营;出版物零售;出版物批发;食品销售;药品零售;广播电视节目制作经营;第一类增值电信业务;第二类增值电信业务;在线数据处理与交易处理业务(经营类电子商务);基础电信业务;互联网信息服务;信息网络传播视听节目。(依法须经批准的项目,经相关部门批准后方可开展经营活动,具体经营项目以相关部门批准文件或许可证件为准)(不得从事国家和本市产业政策禁止和限制类项目的经营活动。)</td></tr></tbody></table></div></div>',
        contentType: 'html',
        refData: chatRefTableMock1,
        refSuggest: chatSuggestResMock1,
        files: rpFileMock3,
        chapterId: 21,
        children: [],
      },
      {
        title: '竞争优势分析',
        writingThought: '通过对比分析，我们的主要优势在于...',
        content: `
         <table title="工商信息" class="smart-ui-table">
      <thead class="smart-ui-table-thead">
        <tr class="smart-ui-table-tr-even">
          <th class="smart-ui-table-th">项目</th>
          <th class="smart-ui-table-th">数据</th>
        </tr>
      </thead>
      <tbody class="smart-ui-table-tbody">
        <tr class="smart-ui-table-tr-odd">
          <td class="smart-ui-table-td">企业名称</td>
          <td class="smart-ui-table-td">小米科技有限责任公司</td>
        </tr>
        <tr class="smart-ui-table-tr-even">
          <td class="smart-ui-table-td">英文名称</td>
          <td class="smart-ui-table-td">XIAOMI INC.</td>
        </tr>
        <tr class="smart-ui-table-tr-odd">
          <td class="smart-ui-table-td">曾用名</td>
          <td class="smart-ui-table-td">北京小米科技有限责任公司</td>
        </tr>
        <tr class="smart-ui-table-tr-even">
          <td class="smart-ui-table-td">公司类型</td>
          <td class="smart-ui-table-td">有限责任公司(自然人投资或控股)</td>
        </tr>
        <tr class="smart-ui-table-tr-odd">
          <td class="smart-ui-table-td">统一社会信用代码</td>
          <td class="smart-ui-table-td">91110108551385082Q</td>
        </tr>
        <tr class="smart-ui-table-tr-even">
          <td class="smart-ui-table-td">注册号</td>
          <td class="smart-ui-table-td">110108012660422</td>
        </tr>
        <tr class="smart-ui-table-tr-odd">
          <td class="smart-ui-table-td">纳税人识别号</td>
          <td class="smart-ui-table-td">91110108551385082Q</td>
        </tr>
        <tr class="smart-ui-table-tr-even">
          <td class="smart-ui-table-td">纳税人资质</td>
          <td class="smart-ui-table-td">增值税一般纳税人</td>
        </tr>
        <tr class="smart-ui-table-tr-odd">
          <td class="smart-ui-table-td">法定代表人</td>
          <td class="smart-ui-table-td">雷军</td>
        </tr>
        <tr class="smart-ui-table-tr-even">
          <td class="smart-ui-table-td">注册资本</td>
          <td class="smart-ui-table-td">185000.0万</td>
        </tr>
        <tr class="smart-ui-table-tr-odd">
          <td class="smart-ui-table-td">实缴资本</td>
          <td class="smart-ui-table-td">185000.0万</td>
        </tr>
        <tr class="smart-ui-table-tr-even">
          <td class="smart-ui-table-td">成立日期</td>
          <td class="smart-ui-table-td">2010-03-03</td>
        </tr>
        <tr class="smart-ui-table-tr-odd">
          <td class="smart-ui-table-td">营业期限自</td>
          <td class="smart-ui-table-td">2010-03-03</td>
        </tr>
        <tr class="smart-ui-table-tr-even">
          <td class="smart-ui-table-td">营业期限至</td>
          <td class="smart-ui-table-td"><br data-mce-bogus="1" /></td>
        </tr>
        <tr class="smart-ui-table-tr-odd">
          <td class="smart-ui-table-td">经营状态</td>
          <td class="smart-ui-table-td">存续</td>
        </tr>
        <tr class="smart-ui-table-tr-even">
          <td class="smart-ui-table-td">所属省份</td>
          <td class="smart-ui-table-td">北京市</td>
        </tr>
        <tr class="smart-ui-table-tr-odd">
          <td class="smart-ui-table-td">登记机关</td>
          <td class="smart-ui-table-td">北京市海淀区市场监督管理局</td>
        </tr>
        <tr class="smart-ui-table-tr-even">
          <td class="smart-ui-table-td">核准日期</td>
          <td class="smart-ui-table-td">2024-11-21</td>
        </tr>
        <tr class="smart-ui-table-tr-odd">
          <td class="smart-ui-table-td">参保人数</td>
          <td class="smart-ui-table-td">37</td>
        </tr>
        <tr class="smart-ui-table-tr-even">
          <td class="smart-ui-table-td">国民经济行业分类</td>
          <td class="smart-ui-table-td">
            制造业-计算机、通信和其他电子设备制造业-智能消费设备制造
          </td>
        </tr>
        <tr class="smart-ui-table-tr-odd">
          <td class="smart-ui-table-td">Wind行业分类</td>
          <td class="smart-ui-table-td">可选消费-家电Ⅱ-家电Ⅲ-消费电子产品</td>
        </tr>
        <tr class="smart-ui-table-tr-even">
          <td class="smart-ui-table-td">注册地址</td>
          <td class="smart-ui-table-td">
            北京市海淀区西二旗中路33号院6号楼6层006号
          </td>
        </tr>
        <tr class="smart-ui-table-tr-odd">
          <td class="smart-ui-table-td">办公地址</td>
          <td class="smart-ui-table-td">
            北京市海淀区西二旗中路33号院6号楼6层006号
          </td>
        </tr>
      </tbody>
    </table>`,
        contentType: 'html',
        chapterId: 22,
        children: [],
      },
    ],
  },
  {
    title: '发展建议',
    writingThought: '基于以上分析，我们提出以下发展建议...',
    content: '基于以上分析，我们提出以下发展建议...',
    contentType: 'html',
    chapterId: 3,
    children: [
      {
        title: '短期策略',
        writingThought: '短期内建议采取以下策略...',
        content: '短期内建议采取以下策略...',
        contentType: 'html',
        chapterId: 31,
        files: rpFileMock2,
        children: [],
      },
      {
        title: '长期规划',
        writingThought: '长期来看，建议制定以下发展规划...',
        content: '长期来看，建议制定以下发展规划...',
        contentType: 'html',
        chapterId: 32,
        children: [],
      },
    ],
  },
];
