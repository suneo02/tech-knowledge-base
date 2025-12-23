// Import CSS files
import '../styles/general.css'
import '../styles/header.css'
import '../styles/homepage.less'
import '../styles/moveToZX.css'
import '../styles/other.less'
import '../styles/util.css'

// jQuery is auto imported by unplugin-auto-import

import { jrsb } from '@/assets/images/misc'
import { loadHeaderFooter } from '@/components/loadHeaderFooter'
import { globalPageViewCountIdList, loadMoveToZXArticleContent, updateViewCountByCode } from '../utils/moveToZX'
import { windZXEmpowerArticles } from '../utils/windZXEmpowerArticles'

import { initLocale, initPageTitle } from '@/utils/intl'

initLocale()
initPageTitle()

$(document).on('click', '#other .menu div', function () {
  window.scroll(0, 0)
  var code = $(this).attr('data-code')
  // @ts-expect-error
  setOtherMenuSelected(code)
})

$('.article-31').html(`
<p>中国人民银行征信管理局会同金融时报社将于10月21-27日共同举办"征信知识线上答题"活动。本次活动将以金融时报微信公众号为主答题平台。每张答卷 10题，每题10分，满分100 分。相关答题事项和规则如下。</p>
<h3>一、活动时间</h3>
<p>2024 年10月21-25日，每天答题时间为6:00-24:00。</p>
<h3>二、答题具体步聚</h3>
<p>所有答题者必须扫码进入金融时报微信公众号答题、在线提交答案。具体步骤：(1)长按或扫描金融时报微信公众号的二维码，点击关注金融时报微信公众号-进入公众号;(2）点击公众号底部"线上答题" 专栏-点击"参与答题"。(3)点击"开始答题"，即可参与。</p>
<p>此次答题，每个ip 每日限答两次。</p>
<p>金融时报微信公众号二维码：</p>
<div><img src=${jrsb}></div>
<h3>三、答题辅导</h3>
<p>此次答题的唯一平台是<b>金融时报微信公众号，关注该公众号后，可于10月20日后在其底部找到答题活动专栏，查看征信知识相关知识及答题辅导。</b>答题辅导可通过以下步骤获取：扫码关注金融时报公众号，点击底都 "答题知识" 专栏-点击 "答题辅导"</p>
<h3>四、问题处理方法</h3>
<p>答题者在答题过程中如遇问题，可直接在金融时报公众号后台留言，工作人员将及时回复与处理。如长时间无人回复，可电话联系金融时报新媒体部(联系方式 010-82198102、010-82198132、010-82198108、010-82198005)。</p>
<h3>五、活动传播</h3>
<p>正式答题期间，金融时报社新媒体部将每天统计各省份参与答题的人次、平均分数及参与答题的总人次、平均分数等数据。金融时扱微信公众号将刊登答题情况跟踪报道，介绍各省、市组织参赛活动的资讯，充分展现各地组织参赛、主动学习的氛围。</p>
<p>答题结束后，将对整个活动进行宣传报道。</p>
`)

$('.article-21').html(`
<p>应进一步破除信用信息跨部门、跨地区、跨层级共享的壁垒，让企业信用价值得到更加有效的发挥。</p>
<p>国务院办公厅日前印发《统筹融资信用服务平台建设提升中小微企业融资便利水平实施方案》（以下简称《实施方案》），就更好统筹融资信用服务平台建设、完善以信用信息为基础的普惠融资服务体系作出重要部署。<p>
<p>近年来，我国融资信用服务平台建设取得重要进展。从全国层面来看，中国人民银行建设的国家金融信用信息基础数据库已经成为全球覆盖人数最多、收录信贷信息最全的征信系统。国家发展改革委建设的全国融资信用服务平台已经归集信用信息超过780亿条，向有关金融机构提供查询服务超过2.76亿次，周均访问量超百万人次。从地方层面来看，全国多地也建设了各种层级的融资信用服务平台。<p>
<p>建设完善融资信用服务平台对于提升金融服务实体经济质效有重要意义。接入平台后，金融机构可以更方便地获取企业的各类信用信息，比如企业登记注册、纳税、水电气费等信息，这有助于金融机构做出信贷决策，增强了其提供贷款的信心。然而，在平台普及的过程中，一些新问题也逐渐暴露出来。比如，一些地方建有多个平台，导致企业信用信息被重复归集，金融机构多头对接，经营主体多头注册，增加了金融机构和经营主体负担。再如，企业信用信息归集共享仍然不够充分，现有共享信息不足以支撑金融机构对经营主体作出精准的信用评价，等等。<p>
<p>信用信息是企业信用融资的基础。应进一步破除信用信息跨部门、跨地区、跨层级共享的壁垒，让企业信用价值得到更加有效的发挥。<p>
<p>要推动平台优化整合。建设完善融资信用服务平台，本意是通过归集共享企业信用信息，解决"信息孤岛"问题。在实践中，绝不能让各个平台成为新的"信息孤岛"。《实施方案》提出，对功能重复或运行低效的地方融资信用服务平台进行整合，原则上一个省份只保留一个省级平台，市县设立的平台不超过一个，所有地方平台统一纳入全国一体化平台网络，实行清单式管理，减少重复建设和资源闲置浪费。据了解，云南省已率先完成省内各类融资信用服务平台的整合，只保留一个平台，经营主体一处注册即可享受相关金融服务。完善自上而下的顶层设计和整体规划，将有助于解决各地各平台之间"信息孤岛"问题。<p>
<p>要加强信用信息归集共享。目前在很多地方，将融资信用服务平台提供的信息纳入信贷决策考量，已是金融机构的普遍做法，但企业部分信息在平台上缺失的情况并不少见，这给金融机构提供金融服务也造成了一定困扰。《实施方案》提出，根据金融机构对信用信息的实际需求，进一步扩大信用信息归集共享范围；着力解决数据共享频次不够、接口调用容量不足、部分公共事业信息共享不充分等问题。相信随着平台逐步优化整合、信用信息归集更加全面精准，金融机构和经营主体将获得更切实的便利服务。<p>
<p>完善的信用体系是金融持续健康发展的基石。当前，经济高质量发展对金融服务提出了更高要求，尤其需要高质量信用体系予以支持。有关部门和地方政府应加快落实《实施方案》部署要求，推进融资信用服务平台优化整合，加强信用信息归集共享和数据开发利用，推动便民惠企金融政策直达中小微企业等经营主体。以信用信息增强金融服务实体经济质效，将为提升国民经济体系整体效能、推动形成新发展格局提供有力支撑。（葛孟超）<p>
`)

$('.article-22').html(`
<p>7月30日，市场监管总局发布的中国企业信用指数显示，2023年度中国企业信用指数为149.71点，处于近十年来的次高水平；2024年上半年，中国企业信用指数为158.95。</p>
<p>市场监管总局信用监管司司长刘敏表示，总的来看，2023年至2024年上半年我国企业信用水平总体平稳，转型升级稳步推进。同时也要看到，当前外部环境错综复杂，国内有效需求依然不足，经济回升向好基础仍需巩固。</p>
<p>具体来说，从全国来看，企业信用指数表明，企业经营状态总体稳定，宏观政策效力显现；企业发展质量持续提升，转型升级稳步推进；企业信用风险降低，守信意识不断增强。</p>
<p>从区域来看，各省份发力提升信用水平，区域信用状况总体态势向好。2024年上半年，全国信用指数排名前五的省份为江苏、浙江、北京、湖北和安徽。</p>
<p>从行业来看，行业信用建设不断加强，有力支撑经济稳定运行。工业生产加速回暖，制造业恢复发展态势；服务业持续恢复，现代服务业发展良好；金融业保持良好态势，系统性风险防控成效显著。</p>
<p>作为我国信用状况"晴雨表"、信用监管"助推器"和信用建设"风向标"，编制好中国企业信用指数对统一大市场建设、高水平对外开放、中国企业运行状态跟踪监测等，都具有非常重要的意义。刘敏表示，下一步，市场监管总局将持续加大信用指数编制及数据整合力度，聚焦民生领域、重点行业，开展专项指数的编制与发布，为加快统一大市场建设、提高资源配置效率、降低制度性交易成本、优化营商环境提供有力支撑。</p>
<p>（来源：经济日报新闻客户端）</p>
`)

function setOtherMenuSelected(code: number) {
  $('#viewCount').hide()
  var target = $('[data-code=' + code + ']')
  var title = $(target).text()
  $('#other .menu div').removeClass('sel')
  $(target).addClass('sel')
  $('.single').hide()
  $('.preview').hide()
  $('.article-doc').hide()
  code = code - 0
  // 是否是 wind zx 赋能的文章
  if (windZXEmpowerArticles.find((item) => item.id === code)) {
    loadMoveToZXArticleContent(code)
  } else {
    switch (code) {
      case 0:
      case 7:
      case 6:
        $('#date').text('2024-06-12')
        if (code == 0) {
          $('#date').text('2023-03-16')
        }
        $('#source').text('来源：中国人民银行')
        break
      case 21:
        $('#date').text('2024-08-21')
        $('#source').text('来源：人民日报')
        $('.article-21').show()
        break
      case 22:
        $('#date').text('2024-08-21')
        $('#source').text('来源：经济日报新闻客户端')
        $('.article-22').show()
        break
      case 31:
        $('#date').text('2024-10-21')
        $('#source').text('来源：中国人民银行上海市分行')
        $('.article-31').show()
        break
      default:
        $('#date').text('2023-06-19')
        $('#source').text('来源：中国人民银行征信中心')
        $('.preview').show()
    }
    $('#article-' + code).show()
    $('#other .title').text(title)

    // @ts-expect-error
    if (globalPageViewCountIdList[code]) {
      // @ts-expect-error
      updateViewCountByCode(globalPageViewCountIdList[code])
    } else {
      console.error('The view count ID is not found in the globalPageViewCountIdList.')
    }
  }
}
$(document).ready(function () {
  setOtherMenuSelected(72)
})

loadHeaderFooter()

import '../utils/moveToZX'
import '../utils/windZXEmpowerArticles'
