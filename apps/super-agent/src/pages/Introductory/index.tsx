// 组件依赖
import { Alert, Button, Cascader, Input, message } from '@wind/wind-ui'
import { ConfigProvider, Form } from 'antd'
import { globalAreaTree } from 'gel-util/config'
import { isEn, t } from 'gel-util/locales'
import React, { useEffect, useMemo, useState } from 'react'
import styles from './index.module.less'
// import { CloseO } from '@wind/icons'
// import type { AutoCompleteProps } from '@wind/wind-ui/lib/auto-complete'
import { SuperListGradientText } from 'gel-ui'
// import { useNavigate } from 'react-router-dom'
import { PreSearch } from './parts/PreSearch'
import { useRequest } from 'ahooks'
import { requestToWFC } from '@/api'
import type { SubmitTaskRequest } from 'gel-api'
import { useNavigate } from 'react-router-dom'

export interface IntroductoryProps {
  firstInit?: boolean // 是否是首次进入该页面
}

// 样式/类名前缀（用于 BEM 命名空间隔离）
const PREFIX = 'introductory'

// 业务常量
const PRODUCT_INFO_MAX_LENGTH = 1000
// 动画常量（统一入口，便于直观调节）
const ANIMATION = {
  // 打字机每字符的间隔（毫秒）
  typingIntervalMs: 24,
  // 分步显隐动画的间隔（毫秒）
  revealStepIntervalMs: 100,
  // CSS 闪烁光标周期、错位进入的持续和偏移（可通过 style 注入给 CSS 变量）
  caretBlinkDuration: '0.7s',
  staggerDuration: '0.4s',
  staggerOffsetY: '24px',
} as const

// 文案多语言配置（如需修改文案只需改此处）
const STRINGS = {
  ALERT_MESSAGE: t('superAgent:', '首次使用：请输入企业名称、销售区域与产品信息，我们将为你精准匹配潜在客户名单。'),
  TITLE: t('superAgent:', 'Introductory'),
  BUTTON: t('superAgent:', '开始挖掘（约 5 分钟）'),
  PLACEHOLDER: t('superAgent:', '输入省/市/区域名称搜索并选择'),
  PRODUCT_INFO: t(
    'superAgent:',
    '提示：请提供尽可能详细的产品信息（关键词/功能/型号/工艺/应用场景等），信息越详细，结果越精准。'
  ),
  PRODUCT_INFO_PLACEHOLDER: t(
    'superAgent:',
    '例：动力电池组件及电池管理系统，应用于新能源汽车储能领域\n人形双足机器人，具备行走、搬运、人机交互能力，可用于工厂自动化和家庭服务\n特斯拉Optimus人形机器人，波士顿动力Atlas机器人'
  ),
  BASIC_INFO_TITLE: t('superAgent:', '填写基本信息'),
  MY_COMPANY_NAME: t('superAgent:', '我的企业名称'),
  MY_COMPANY_NAME_PLACEHOLDER: t('superAgent:', '例：小船科技有限公司'),
  REGION: t('superAgent:', '目标区域（可多选，可搜索）'),
  PRODUCT_TITLE: t('superAgent:', '产品信息'),
  // REMARK: t('', '信息越详细，结果越精准。'),
  SUBMIT_SUCCESS: t('superAgent:', '提交成功'),
  SUBMIT_FAILED: t('superAgent:', '提交失败，请稍后重试'),
  PLEASE_COMPLETE_THE_REQUIRED_FIELDS_BEFORE_SUBMITTING: t('superAgent:', '请完善必填项后再提交'),
  MY_COMPANY_NAME_REQUIRED: t('superAgent:', '请输入企业名称'),
  AI_FILL: t('superAgent:', 'AI填充'),
  CHIPS_1: t('superAgent:', '填写基本信息'),
  CHIPS_2: t('superAgent:', '客户名单立即显示'),
  HERO_TITLE: t('superAgent:', '告诉我你是谁，'),
  HERO_TITLE2: t('superAgent:', '系统自动推荐'),
  HERO_TITLE3: t('superAgent:', '潜在客户'),
}

// 将地区树转为 Cascader 选项
const options = globalAreaTree.map((item) => ({
  label: isEn() ? item.nameEn : item.name,
  value: item.code,
  children: item.node?.map((node) => ({
    label: isEn() ? node.nameEn : node.name,
    value: node.code,
  })),
}))

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

const isArrayOfArrays = (val: unknown): val is string[][] => Array.isArray(val) && Array.isArray(val[0])

// paths => leaves
const fromCascaderValue = (paths: string[][] | undefined | null): string[] => {
  if (!Array.isArray(paths)) return []
  return paths
    .map((p) => (Array.isArray(p) && p.length > 0 ? p[p.length - 1] : undefined))
    .filter((v): v is string => typeof v === 'string')
}

// leaves => paths（用于回显）
const toCascaderValue = (codes: string[] | string[][], codePathMap: Map<string, string[]>): string[][] => {
  if (isArrayOfArrays(codes)) return codes as string[][]
  const arr = Array.isArray(codes) ? (codes as string[]) : []
  return arr.map((code) => codePathMap.get(String(code)) || [String(code)])
}

const splAgentTaskSubmit = (values: SubmitTaskRequest) => requestToWFC('operation/add/splAgentSubmitTask', values)

// 组件入口
export const Introductory: React.FC<IntroductoryProps> = (props) => {
  const { firstInit } = props || {}
  // 表单实例与提交状态
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const [typedCount, setTypedCount] = useState(0)
  const [revealIndex, setRevealIndex] = useState(0)
  const companyId = Form.useWatch('companyName', form)
  const watchAreaCodes = Form.useWatch('areaCodes', form)

  // 为回显场景准备 code -> path 映射
  const codePathMap = useMemo(() => buildCodePathMap(globalAreaTree as unknown as RegionTreeNode[]), [])

  const navigator = useNavigate()

  const { run: runSubmit } = useRequest(splAgentTaskSubmit, {
    manual: true,
    onSuccess: (res) => {
      if (res && res.Data && res.Data.taskIds) {
        if (res.Data.taskIds?.length === 0) {
          message.error(STRINGS.SUBMIT_FAILED)
          return
        }
        message.success(STRINGS.SUBMIT_SUCCESS)
        navigator(`/prospect?id=${res.Data.taskIds[0]}`)
      }
    },
    refreshDeps: [companyId],
  })

  const onFinish = async (values: SubmitTaskRequest) => {
    try {
      // 仅保留叶子节点 code 数组
      const normalizedAreaCodes = fromCascaderValue(values.areaCodes as unknown as string[][])
      const payload: SubmitTaskRequest = {
        ...values,
        areaCodes: normalizedAreaCodes as unknown as SubmitTaskRequest['areaCodes'],
      }
      runSubmit(payload)
      // TODO: 在此调用后端接口
      // console.log('submit', values)
    } catch {
      message.error(STRINGS.SUBMIT_FAILED)
    } finally {
      setTimeout(() => {
        setSubmitting(false)
      }, 2000)
    }
  }

  const onFinishFailed = () => {
    message.error(STRINGS.PLEASE_COMPLETE_THE_REQUIRED_FIELDS_BEFORE_SUBMITTING)
  }

  // 打字内容：前缀 + 高亮 + 后缀
  const heroSegments = useMemo(
    () => [{ text: STRINGS.HERO_TITLE }, { text: STRINGS.HERO_TITLE2, highlight: true }, { text: STRINGS.HERO_TITLE3 }],
    []
  )
  const totalChars = useMemo(() => heroSegments.reduce((s, seg) => s + seg.text.length, 0), [heroSegments])

  // 根据 companyId 的变化可做联动（此处暂不自动请求）
  useEffect(() => {
    console.log('companyId', companyId)
  }, [companyId])

  // 监听回显：当外部以叶子 code 数组形式写入 areaCodes 时，自动转换为 Cascader 需要的路径数组
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

  useEffect(() => {
    if (typedCount >= totalChars) return
    const id = setInterval(() => {
      setTypedCount((c) => Math.min(totalChars, c + 1))
    }, ANIMATION.typingIntervalMs)
    return () => clearInterval(id)
  }, [typedCount, totalChars])

  useEffect(() => {
    if (typedCount < totalChars) return
    let i = 0
    const id = setInterval(() => {
      i += 1
      setRevealIndex((prev) => (prev >= 3 ? prev : prev + 1))
      if (i >= 3) clearInterval(id)
    }, ANIMATION.revealStepIntervalMs)
    return () => clearInterval(id)
  }, [typedCount, totalChars])

  const renderTyped = (count: number) => {
    let remain = count
    return heroSegments.map((seg, idx) => {
      const take = Math.max(0, Math.min(seg.text.length, remain))
      remain -= take
      const shown = seg.text.slice(0, take)
      const Node: React.FC<{ children: React.ReactNode }> = ({ children }) =>
        seg.highlight ? <SuperListGradientText>{children}</SuperListGradientText> : <>{children}</>
      return <Node key={idx}>{shown}</Node>
    })
  }

  const containerStyle: React.CSSProperties &
    Record<'--caret-blink-duration' | '--stagger-duration' | '--stagger-offset-y', string> = {
    '--caret-blink-duration': ANIMATION.caretBlinkDuration,
    '--stagger-duration': ANIMATION.staggerDuration,
    '--stagger-offset-y': ANIMATION.staggerOffsetY,
  }

  return (
    <div className={styles[`${PREFIX}-container`]} style={containerStyle}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#0596b3',
            borderRadius: 2,
          },
          components: {
            Form: {
              labelColor: 'var(--gray-1)',
            },
          },
        }}
      >
        <div className={styles[`${PREFIX}-hero`]}>
          <div className={styles[`${PREFIX}-h1`]}>
            <span className={styles[`${PREFIX}-h1-typed`]}>{renderTyped(typedCount)}</span>
            {typedCount < totalChars && <span className={styles[`${PREFIX}-caret`]} />}
          </div>
          <div className={styles[`${PREFIX}-chips`]}>
            <div className={styles[`${PREFIX}-chip`]}>{STRINGS.CHIPS_1}</div>
            <div className={styles[`${PREFIX}-chip`]}>→</div>
            <div className={styles[`${PREFIX}-chip`]}>{STRINGS.CHIPS_2}</div>
          </div>
        </div>
        {firstInit && <Alert className={styles[`${PREFIX}-alert`]} message={STRINGS.ALERT_MESSAGE} type="warning" />}

        <div className={styles[`${PREFIX}-grid`]}>
          <div className={styles[`${PREFIX}-card`]}>
            <Form
              layout="vertical"
              className={styles[`${PREFIX}-form`]}
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              {/* 企业名称（必填） */}
              <div
                className={`${styles[`${PREFIX}-stagger-item`]} ${revealIndex > 0 ? styles[`${PREFIX}-stagger-show`] : ''}`}
              >
                <Form.Item
                  label={STRINGS.MY_COMPANY_NAME}
                  name="companyCode"
                  required
                  rules={[{ required: true, whitespace: true, message: STRINGS.MY_COMPANY_NAME_REQUIRED }]}
                  style={{ marginBottom: 30 }}
                >
                  <PreSearch name="companyName" />
                </Form.Item>
              </div>
              {/* 目标区域（多选，支持搜索） */}
              <div
                className={`${styles[`${PREFIX}-stagger-item`]} ${revealIndex > 1 ? styles[`${PREFIX}-stagger-show`] : ''}`}
              >
                <div className={styles[`${PREFIX}-form-cascader`]}>
                  <Form.Item label={STRINGS.REGION} name="areaCodes" style={{ marginBottom: 30 }}>
                    <Cascader
                      size="large"
                      dropdownClassName={styles[`${PREFIX}-form-cascader-dropdown`]}
                      style={{ minWidth: '100%' }}
                      placeholder={STRINGS.PLACEHOLDER}
                      multiple
                      options={options}
                      maxTagCount="responsive"
                      showSearch
                    />
                  </Form.Item>
                </div>
              </div>
              {/* 产品信息输入与 AI 辅助填充 */}
              <div
                className={`${styles[`${PREFIX}-stagger-item`]} ${revealIndex > 2 ? styles[`${PREFIX}-stagger-show`] : ''}`}
              >
                <div className={styles[`${PREFIX}-product-info-label`]}>
                  <div className={styles[`${PREFIX}-product-info-label-text`]}>
                    {STRINGS.PRODUCT_TITLE}（{STRINGS.PRODUCT_INFO}）
                  </div>
                </div>
                <Form.Item name="productDesc" style={{ marginBottom: 0 }}>
                  <Input.TextArea
                    rows={8}
                    placeholder={STRINGS.PRODUCT_INFO_PLACEHOLDER}
                    maxLength={PRODUCT_INFO_MAX_LENGTH}
                  />
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
            loading={submitting}
            onClick={() => form.submit()}
            variant="alice"
            style={{ minWidth: '100%', marginBottom: 12 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{STRINGS.BUTTON}</div>
          </Button>
        </div>
      </ConfigProvider>
    </div>
  )
}
