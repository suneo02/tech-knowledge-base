// 组件依赖
import { Button, Cascader, Input, message } from '@wind/wind-ui'
import { Form, Spin } from 'antd'
import { globalAreaTree } from 'gel-util/config'
import { t } from 'gel-util/intl'
import React, { useEffect, useMemo } from 'react'
import styles from './index.module.less'
import { requestToWFC } from '@/api'
import CompanyPreSearch from '@/components/AutoComplete/biz/CompanyPreSearch'
import {
  fromCascaderValue,
  getAreaNameByCode,
  getAreaTreeForOptions,
  isArrayOfArrays,
  toCascaderValue,
} from '@/utils/area'
import { postPointBuried, SUPER_AGENT_BURY_POINTS } from '@/utils/bury'
import { storage, STORAGE_KEYS } from '@/utils/storage'
import { useRequest } from 'ahooks'
import type { SubmitTaskRequest } from 'gel-api'
import { useNavigate } from 'react-router-dom'

export interface IntroductoryProps {
  firstInit?: boolean // 是否是首次进入该页面
}

// 样式/类名前缀（用于 BEM 命名空间隔离）
const PREFIX = 'introductory'

// 业务常量
const PRODUCT_INFO_MAX_LENGTH = 1000

// —— 工具：code <-> path 转换 ——
interface RegionTreeNode {
  code: string | number
  node?: RegionTreeNode[]
}

const buildCodePathMap = (tree: RegionTreeNode[]): Map<string, string[]> => {
  const map = new Map<string, string[]>()
  const visit = (nodes: RegionTreeNode[], prefix: string[]) => {
    for (const n of nodes) {
      const code = String(n.code)
      const path = [...prefix, code]
      map.set(code, path)
      if (Array.isArray(n.node) && n.node.length > 0) visit(n.node, path)
    }
  }
  visit(tree, [])
  return map
}

const splAgentTaskSubmit = (values: SubmitTaskRequest) => requestToWFC('superlist/excel/splAgentSubmitTask', values)
const getAreaCodeByCompanyCode = (companycode: number) =>
  requestToWFC('superlist/excel/splAgentGetAreaCodeByCompanyCode', { companycode })
const getCorpBasicInfoCard = (companycode: number) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestToWFC(`detail/company/getcorpbasicinfo_card/${companycode}` as any, {})

// 组件入口
export const Introductory: React.FC<IntroductoryProps> = () => {
  // 文案多语言配置（如需修改文案只需改此处）
  const STRINGS = {
    ALERT_MESSAGE: t(
      '481495',
      '首次使用:请输入企业名称、销售区域、企业介绍及产品信息,我们将为你精准匹配潜在客户名单。'
    ),
    BUTTON: t('481497', '开始挖掘（约5分钟）'),
    PLACEHOLDER_COMPANY_NAME: t('482228', '输入企业名称搜索并选择'),
    PLACEHOLDER: t('481505', '输入省/市/区域名称搜索并选择'),
    PRODUCT_INFO: t(
      '481517',
      '请提供尽可能详细的企业介绍、产品信息(关键词/功能/型号/工艺/应用场景等),信息越详细,结果越精准。'
    ),
    PRODUCT_INFO_PLACEHOLDER: t(
      '482240',
      '例:动力电池组件及电池管理系统,应用于新能源汽车储能领域\n人形双足机器人,具备行走、搬运、人机交互能力,可用于工厂自动化和家庭服务\n特斯拉Optimus人形机器人,波士顿动力Atlas机器人'
    ),
    MY_COMPANY_NAME: t('481494', '我的企业名称'),
    REGION: t('481515', '目标销售区域 (可多选, 可搜索)'),
    REGION_HINT: t(
      '481496',
      '请选择您希望开展销售业务的区域，系统将根据所选区域为您生成对应的客户名单，每个区域将生成独立的名单列表。'
    ),
    PRODUCT_TITLE: t('481516', '企业或产品信息'),
    // REMARK: t('482241', '信息越详细，结果越精准。'),
    SUBMIT_SUCCESS: t('428770', '提交成功！'),
    SUBMIT_FAILED: t('416847', '提交失败，请稍后重试'),
    PLEASE_COMPLETE_THE_REQUIRED_FIELDS_BEFORE_SUBMITTING: t('482229', '请完善必填项后再提交'),
    MY_COMPANY_NAME_REQUIRED: t('272142', '请输入企业名称'),
    REGION_REQUIRED: t('482230', '请选择目标区域'),
    PRODUCT_MIN_LENGTH: t('482242', '最少输入50个字符'),
    HERO_TITLE: t('481514', '告诉我你是谁, 系统自动推荐潜在客户'),
    ONLY_SUPPORT_CN_COMPANY: t('482231', '当前仅支持中国大陆企业，请重新选择'),
    PRODUCT_REQUIRED: t('482232', '请输入企业或产品信息'),
  } as const
  // 表单实例与提交状态
  const [form] = Form.useForm()
  const companyId = Form.useWatch('companyCode', form)
  const companyName = Form.useWatch('companyName', form)
  // const watchAreaCodes = Form.useWatch('areaCodes', form)

  // 为回显场景准备 code -> path 映射
  const codePathMap = useMemo(() => buildCodePathMap(globalAreaTree as unknown as RegionTreeNode[]), [])

  const navigator = useNavigate()
  // const [productRequired, setProductRequired] = useState(false)

  // 回显 localStorage 中的数据
  useEffect(() => {
    const savedForm = storage.getItem(STORAGE_KEYS.INTRODUCTORY_FORM)
    if (savedForm) {
      // 兼容处理：如果是扁平的 code 数组，转换为路径数组，避免 Cascader 渲染崩溃
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let areaCodes: any = savedForm.areaCodes
      if (Array.isArray(areaCodes) && areaCodes.length > 0 && !isArrayOfArrays(areaCodes)) {
        areaCodes = toCascaderValue(areaCodes as string[], codePathMap)
      }

      form.setFieldsValue({
        ...savedForm,
        areaCodes,
      })
      // 如果有公司 ID，可能需要触发相关的副作用（如获取区域码等），但通常 setFieldsValue 足够回显 UI
      // 如果需要触发联动的逻辑，可以在这里补充
    }
  }, [form, codePathMap])

  const { run: runSubmit, loading: submittingLoading } = useRequest(splAgentTaskSubmit, {
    manual: true,
    onSuccess: (res) => {
      if (res && res.Data && res.Data.taskIds) {
        if (res.Data.taskIds?.length === 0) {
          message.error(STRINGS.SUBMIT_FAILED)
          return
        }

        // 保存表单数据到 localStorage，用于下次自动回显
        const currentValues = form.getFieldsValue()
        const normalizedAreaCodes = fromCascaderValue(currentValues.areaCodes as unknown as string[][])
        storage.setItem(STORAGE_KEYS.INTRODUCTORY_FORM, {
          companyCode: currentValues.companyCode,
          companyName: currentValues.companyName,
          areaCodes: normalizedAreaCodes,
          productDesc: currentValues.productDesc,
        })

        message.success(STRINGS.SUBMIT_SUCCESS)
        navigator(`/prospect?id=${res.Data.taskIds[0]}`)
      }
    },
    refreshDeps: [companyId],
  })

  const { run: runFetchAreaCodes, loading: areaCodesLoading } = useRequest(getAreaCodeByCompanyCode, {
    manual: true,
    onSuccess: (res) => {
      const codes = res?.Data?.data
      // 兼容不同返回字段命名，优先 Data.areaCodes
      if (Array.isArray(codes) && codes.length > 0) {
        const cascaderValue = toCascaderValue(codes, codePathMap)
        console.log('🚀 ~ Introductory ~ cascaderValue:', cascaderValue)
        form.setFieldsValue({ areaCodes: cascaderValue })
      } else {
        const isMainlandChina = getAreaNameByCode(codes)
        console.log('🚀 ~ Introductory ~ isMainlandChina:', isMainlandChina)
        if (!isMainlandChina) {
          message.error(STRINGS.ONLY_SUPPORT_CN_COMPANY)
          form.resetFields()
          return
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cascaderValue = toCascaderValue([codes] as any, codePathMap)
        console.log('🚀 ~ Introductory ~ cascaderValue:', cascaderValue)
        form.setFieldsValue({ areaCodes: cascaderValue })
      }
    },
  })

  const { run: runFetchCompanyBrief } = useRequest(getCorpBasicInfoCard, {
    manual: true,
    onSuccess: () => {
      // const brief = res?.Data?.brief as string | undefined
      // setProductRequired(!brief || brief.trim().length === 0)
    },
  })

  const onFinish = async (values: SubmitTaskRequest) => {
    try {
      // 仅保留叶子节点 code 数组
      const normalizedAreaCodes = fromCascaderValue(values.areaCodes as unknown as string[][])
      postPointBuried(SUPER_AGENT_BURY_POINTS.IMMEDIATE_SEARCH, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        companyname: (values as any).companyName,
        area: normalizedAreaCodes.join(','),
        info: values.productDesc,
      })
      const payload: SubmitTaskRequest = {
        ...values,
        areaCodes: normalizedAreaCodes as unknown as SubmitTaskRequest['areaCodes'],
      }
      runSubmit(payload)
      // TODO: 在此调用后端接口
      // console.log('submit', values)
    } catch {
      message.error(STRINGS.SUBMIT_FAILED)
    }
  }

  const onFinishFailed = () => {
    message.error(STRINGS.PLEASE_COMPLETE_THE_REQUIRED_FIELDS_BEFORE_SUBMITTING)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onValuesChange = (values: any) => {
    console.log('🚀 ~ onValuesChange ~ values:', values)
  }

  // 监听回显：当外部以叶子 code 数组形式写入 areaCodes 时，自动转换为 Cascader 需要的路径数组
  // FIX: 移除此 Effect，因为在初始回显时已经处理了转换，避免重复处理或冲突
  /*
  useEffect(() => {
    if (!watchAreaCodes) return
    // 若已是路径数组则不处理
    if (isArrayOfArrays(watchAreaCodes)) return
    // 若是叶子数组，转为路径数组
    if (Array.isArray(watchAreaCodes)) {
      const cascaderValue = toCascaderValue(watchAreaCodes as string[], codePathMap)
      form.setFieldsValue({ areaCodes: cascaderValue })
    }
  }, [watchAreaCodes, codePathMap, form])
  */

  return (
    <div className={styles[`${PREFIX}-container`]}>
      <div className={styles[`${PREFIX}-hero`]}>
        <div className={styles[`${PREFIX}-h1`]}>{STRINGS.HERO_TITLE}</div>
      </div>
      {/* {firstInit && <Alert className={styles[`${PREFIX}-alert`]} message={STRINGS.ALERT_MESSAGE} type="warning" />} */}
      <div className={styles[`${PREFIX}-alert`]}>{STRINGS.ALERT_MESSAGE}</div>

      <div className={styles[`${PREFIX}-grid`]}>
        <div className={styles[`${PREFIX}-card`]}>
          <Form
            layout="vertical"
            className={styles[`${PREFIX}-form`]}
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            onValuesChange={onValuesChange}
          >
            {/* 企业名称（必填） */}
            <div>
              <Form.Item
                label={STRINGS.MY_COMPANY_NAME}
                name="companyCode"
                required
                rules={[{ required: true, whitespace: true, message: STRINGS.MY_COMPANY_NAME_REQUIRED }]}
                style={{ marginBottom: 30 }}
              >
                <CompanyPreSearch
                  companyName={companyName}
                  onCompanySelect={({ corpId, corpName }) => {
                    // 写入 code 与 name
                    form.setFieldsValue({ companyCode: corpId, companyName: corpName })
                    // 拉取推荐的地区编码并回填
                    runFetchAreaCodes(Number(corpId))
                    // 获取公司基础信息，判断是否需要强制填写产品信息
                    runFetchCompanyBrief(Number(corpId))
                  }}
                  placeholder={STRINGS.PLACEHOLDER_COMPANY_NAME}
                />
              </Form.Item>
              {/* 隐藏字段：保留公司名称用于提交或回显 */}
              <Form.Item name="companyName" hidden>
                <Input />
              </Form.Item>
            </div>
            {/* 目标区域（多选，支持搜索） */}
            <div>
              <Spin spinning={areaCodesLoading}>
                <div className={styles[`${PREFIX}-form-cascader`]}>
                  <Form.Item label={STRINGS.REGION} required>
                    <div className={styles[`${PREFIX}-label-hint`]}>{STRINGS.REGION_HINT}</div>
                    <Form.Item
                      name="areaCodes"
                      rules={[{ required: true, message: STRINGS.REGION_REQUIRED }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Cascader
                        size="large"
                        dropdownClassName={styles[`${PREFIX}-form-cascader-dropdown`]}
                        style={{ minWidth: '100%' }}
                        placeholder={STRINGS.PLACEHOLDER}
                        multiple
                        options={getAreaTreeForOptions()}
                        maxTagCount="responsive"
                        showSearch
                        disabled={areaCodesLoading}
                      />
                    </Form.Item>
                  </Form.Item>
                </div>
              </Spin>
            </div>
            {/* 产品信息输入与 AI 辅助填充 */}
            <div>
              {/* <div className={styles[`${PREFIX}-label-wrapper`]}>
                <div className={styles[`${PREFIX}-label-title`]}>{STRINGS.PRODUCT_TITLE}</div>
                <div className={styles[`${PREFIX}-label-hint`]}>{STRINGS.PRODUCT_INFO}</div>
              </div> */}
              <Form.Item label={STRINGS.PRODUCT_TITLE} style={{ marginBottom: 0 }} required>
                <div className={styles[`${PREFIX}-label-hint`]}>{STRINGS.PRODUCT_INFO}</div>
                <Form.Item
                  name="productDesc"
                  rules={[
                    { required: true, message: STRINGS.PRODUCT_REQUIRED },
                    { min: 50, message: STRINGS.PRODUCT_MIN_LENGTH },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <Input.TextArea
                    rows={8}
                    placeholder={STRINGS.PRODUCT_INFO_PLACEHOLDER}
                    maxLength={PRODUCT_INFO_MAX_LENGTH}
                  />
                </Form.Item>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>

      {/* 提交区 */}
      <div className={styles[`${PREFIX}-button-container`]}>
        {/* <div className={styles[`${PREFIX}-button-container-text`]}>{STRINGS.REMARK}</div> */}
        <Button
          size="large"
          type="primary"
          // type="text"
          className={styles[`${PREFIX}-button`]}
          loading={submittingLoading}
          onClick={() => form.submit()}
          style={{ minWidth: '100%', marginBottom: 12 }}
          variant="alice"
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {STRINGS.BUTTON}
          </span>
        </Button>
      </div>
    </div>
  )
}
