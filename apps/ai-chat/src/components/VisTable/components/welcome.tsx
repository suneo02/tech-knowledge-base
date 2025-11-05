// 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果

import React from 'react'
import { Typography, Card, Row, Col, message } from 'antd'
import CDEFind from '@/assets/image/cde-find-corp.png'
import UploadClue from '@/assets/image/upload-clue-excel.png'
import AI from '@/assets/icon/AI.svg'
import { useModal } from '@/components/GlobalModalProvider'
import { createWFCSuperlistRequestFcs } from '@/api'
import { useRequest } from 'ahooks'

const { Title, Paragraph, Text } = Typography

interface FeatureType {
  key: string
  title: string
  description: string
  icon: React.ReactNode
  onClick?: () => void
}

const addDataToSheetFunc = createWFCSuperlistRequestFcs('superlist/excel/addDataToSheet')

const Welcome: React.FC<{ sheetId: number; tableId: string; onDataImported: (sheetId: number) => void }> = ({
  sheetId,
  tableId,
  onDataImported,
}) => {
  const { openModal } = useModal()
  const { run: addDataToSheet } = useRequest<
    Awaited<ReturnType<typeof addDataToSheetFunc>>,
    Parameters<typeof addDataToSheetFunc>
  >(addDataToSheetFunc, {
    onSuccess: (_res) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = { Data: { data: [{ sheetId: (_res as unknown as any)?.Data?.data[0] }] } }

      message.success('导入成功')
      onDataImported?.(res.Data.data[0].sheetId)
    },
    manual: true,
  })
  // const handleUploadFinish = (result: IndicatorImportTransformedData, clueExcelName?: string) => {
  //   addData({
  //     conversationType: 'CLUE_EXCEL',
  //     clueExcelCondition: result,
  //     clueExcelName,
  //     sheetId,
  //     enablePointConsumption: 1,
  //   })
  // }
  const features: FeatureType[] = [
    {
      key: '1',
      title: '智能搜索企业',
      description: '基于海量企业数据，智能识别企业特征，快速定位目标企业，支持模糊匹配和多维度筛选',
      icon: <img src={CDEFind} alt="智能搜索企业" style={{ height: 60, color: '#3176FF' }} />,
      onClick: () => {
        // console.log('🚀 ~ Welcome ~ 智能搜索企业:sheetId', sheetId)
        openModal('cdeHome', {
          sheetId: sheetId,
          // container: null,
          onFinish: (res) => {
            console.log('🚀 ~ Welcome ~ 智能搜索企业:', res)
          },
          confirmText: '添加至表格',
        })
      },
    },
    {
      key: '2',
      title: '批量导入数据',
      description: '支持Excel格式一键导入，快速构建企业分析表格',
      icon: <img src={UploadClue} alt="批量导入数据" style={{ height: 60, color: '#3176FF' }} />,
      onClick: () => {
        // console.log('🚀 ~ Welcome ~ 智能搜索企业:sheetId', sheetId)
        openModal('bulkImportHome', {
          // sheetId: sheetId,
          // container: null,
          onFinish: (res) => {
            addDataToSheet({
              tableId,
              dataType: 'CLUE_EXCEL',
              sheetId,
              clueExcelCondition: res,
              enablePointConsumption: 1,
            })
          },
          // confirmText: '添加至表格',
        })
      },
    },
  ]

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 100px)',
        background: 'linear-gradient(#fff, #fff, #fff,rgba(56, 98, 237, 0.05), rgba(157, 154, 227, 0.05))',
        // padding: '0 24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          padding: '40px 0',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <Title
            style={{
              fontSize: '44px',
              marginBottom: '20px',
              fontWeight: 600,
              background: 'linear-gradient(90deg, #3862ED 0%, #274CDA 25%, #00AEC7 50%, #12CBBE 75%, #9D9AE3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block',
            }}
          >
            智能企业分析表格
          </Title>
          <Paragraph
            style={{
              fontSize: '16px',
              color: '#666',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            基于人工智能技术，从海量企业数据中提取关键信息， 为您提供精准的企业分析与个性化数据洞察
          </Paragraph>
        </div>

        <div style={{ marginBottom: '50px' }}>
          <Row gutter={[40, 40]} justify="center" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {features.map((feature) => (
              <Col xs={24} sm={24} md={12} lg={12} xl={12} key={feature.key} onClick={feature.onClick}>
                <div className="feature-card-wrapper" style={{ position: 'relative', borderRadius: '14px' }}>
                  {/* 底层渐变色背景 */}
                  <div
                    className="card-gradient-bg"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: '14px',
                      background:
                        'linear-gradient(90deg, #3862ED 0%, #274CDA 25%, #00AEC7 50%, #12CBBE 75%, #9D9AE3 100%)',
                      zIndex: 0,
                    }}
                  />

                  {/* 上层白色背景内容 */}
                  <div
                    className="feature-content"
                    style={{
                      height: '100%',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      margin: '2px',
                      background: '#fff',
                      border: 'none',
                      zIndex: 1,
                      padding: '36px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ marginRight: '24px', paddingTop: '4px' }}>{feature.icon}</div>
                      <div>
                        <Title level={4} style={{ marginBottom: '14px', fontSize: '22px' }}>
                          {feature.title}
                        </Title>
                        <Paragraph style={{ color: '#666', margin: 0, fontSize: '15px' }}>
                          {feature.description}
                        </Paragraph>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px', position: 'relative' }}>
          <Card
            style={{
              maxWidth: '100vw',
              margin: '0 auto',
              borderRadius: '0',
              // boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
              background: 'transparent',
              border: '0px',
              padding: '10px',
            }}
            bodyStyle={{ padding: '30px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ marginRight: '24px' }}>
                <img src={AI} alt="AI生成列" style={{ height: 50, color: '#7B61FF' }} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <Title level={3} style={{ marginBottom: '12px', fontSize: '18px', color: '#7B61FF' }}>
                  AI生成列 - 重磅功能
                </Title>
                <Paragraph style={{ fontSize: '14px', color: '#555', margin: 0 }}>
                  在完成企业搜索和数据导入后，一键生成企业分析数据，自动提取关键指标，支持自定义分析维度，让数据洞察更简单、更智能
                </Paragraph>
              </div>
            </div>
          </Card>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            添加数据创建您的第一个企业分析表格，开启数据分析新体验
          </Text>
        </div>
      </div>

      <style>
        {`
          .feature-card-wrapper {
            transition: all 0.3s ease;
          }
          .feature-card-wrapper:hover {
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          }
          .feature-card-wrapper:hover .feature-content {
            margin: 2px;
          }
        `}
      </style>
    </div>
  )
}

export default Welcome
