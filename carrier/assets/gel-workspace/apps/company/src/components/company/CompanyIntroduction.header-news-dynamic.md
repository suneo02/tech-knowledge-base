# 舆情得分展示行（header-news-dynamic）逻辑设计文档

## 1. 背景与现状

在公司详情页的头部卡片区域，舆情得分（header-news-dynamic）一行需要根据不同企业类型和数据情况，动态展示不同的卡片和 Tab 页。当前实现分支较多，嵌套复杂，维护成本高，且不易扩展。

## 2. 设计目标

- **分支清晰**：让每种展示情况一目了然，易于理解。
- **易于维护**：后续如需增加/调整卡片，能低成本修改。
- **UI一致性**：各卡片、Tab 的布局和宽度自洽，避免 hardcode。
- **可扩展性**：便于后续增加新类型卡片或调整展示顺序。

## 3. 变量定义

- **showKGChartInRowFirst**：是否展示图谱卡片（ulCharts），与企业地区/类型有关。
- **showTechScore**：是否展示科创分（雷达图）。
- **esgInfo?.Rating**：是否有 ESG 分数（ESG 品牌卡）。
- **CorpIntroRiskCardBig**：大号舆情分卡片。
- **Tabs**：动态/舆情/商机 Tab 页。

## 4. 展示分支与布局

### 4.1 展示内容一览表

| showKGChartInRowFirst | showTechScore | esgInfo?.Rating | 展示内容（顺序）                                                                                 | Tabs span |
| --------------------- | ------------- | --------------- | ------------------------------------------------------------------------------------------------ | --------- |
| true                  | 任意          | 任意            | ulCharts（2个图谱卡片）<br/>Tabs                                                                 | 16/12     |
| false                 | false         | false           | CorpIntroRiskCardBig（span=8）<br/>Tabs（span=16）                                               | 16        |
| false                 | true          | false           | 雷达图（span=4）<br/>CorpIntroRiskCardSmall（span=4）<br/>Tabs（span=16）                        | 16        |
| false                 | false         | true            | EsgBrand（span=4）<br/>Tabs（span=12）                                                           | 12        |
| false                 | true          | true            | 雷达图（span=4）<br/>CorpIntroRiskCardSmall（span=4）<br/>EsgBrand（span=4）<br/>Tabs（span=12） | 12        |

**说明：**

- Tabs 的 span 只和 EsgBrand 是否展示有关。
- ulCharts 一定是两个卡片。

### 4.2 伪代码结构

```jsx
<Row gutter={12} style={{ marginTop: '12px' }} className="header-news-dynamic">
  {showKGChartInRowFirst ? (
    <>
      {ulCharts.map((t) => (
        <HeaderChart key={t.txt} ... />
      ))}
      <Col span={esgInfo?.Rating ? 12 : 16}>
        <Tabs ... />
      </Col>
    </>
  ) : (
    <>
      {showTechScore && (
        <Col span={4}>
          {/* 雷达图 */}
        </Col>
      )}
      {showTechScore && (
        <Col span={4}>
          <CorpIntroRiskCardSmall ... />
        </Col>
      )}
      {!showTechScore && !esgInfo?.Rating && (
        <Col span={8}>
          <CorpIntroRiskCardBig ... />
        </Col>
      )}
      {esgInfo?.Rating && (
        <Col span={4}>
          <EsgBrand ... />
        </Col>
      )}
      <Col span={esgInfo?.Rating ? 12 : 16}>
        <Tabs ... />
      </Col>
    </>
  )}
</Row>
```

### 4.3 逻辑实现建议

- 预先计算每个组件的展示条件，渲染时只需判断布尔值。
- Tabs 的 span 只和 EsgBrand 是否展示有关。
- 所有分支只分两大类：`showKGChartInRowFirst` 和 `!showKGChartInRowFirst`。

## 5. 详细流程

1. **判断 showKGChartInRowFirst**

   - **是**：渲染 ulCharts（2个），Tabs（span=12/16，取决于 esgInfo）。
   - **否**：进入下一步。

2. **判断 showTechScore 和 esgInfo**
   - **都没有**：渲染 CorpIntroRiskCardBig（span=8），Tabs（span=16）。
   - **只有 showTechScore**：渲染雷达图（span=4）、CorpIntroRiskCardSmall（span=4）、Tabs（span=16）。
   - **只有 esgInfo**：渲染 EsgBrand（span=4）、Tabs（span=12）。
   - **都有**：渲染雷达图（span=4）、CorpIntroRiskCardSmall（span=4）、EsgBrand（span=4）、Tabs（span=12）。

## 6. 可维护性与扩展性说明

- **新增卡片**：只需增加一个布尔变量和一行渲染代码。
- **调整顺序**：只需调整渲染顺序即可。
- **条件变更**：只需修改布尔变量的计算逻辑。
- **UI一致性**：Tabs 的 span 只和 EsgBrand 是否展示有关，避免多处 hardcode。

## 7. 代码示例（优化后）

```js
const showRadar = !showKGChartInRowFirst && showTechScore
const showRiskSmall = !showKGChartInRowFirst && showTechScore
const showRiskBig = !showKGChartInRowFirst && !showTechScore && !esgInfo?.Rating
const showEsg = !showKGChartInRowFirst && esgInfo?.Rating
const tabsSpan = showEsg ? 12 : 16
```

```jsx
<Row gutter={12} style={{ marginTop: '12px' }} className="header-news-dynamic">
  {showKGChartInRowFirst ? (
    <>
      {ulCharts.map((t) => (
        <HeaderChart key={t.txt} ... />
      ))}
      <Col span={esgInfo?.Rating ? 12 : 16}>
        <Tabs ... />
      </Col>
    </>
  ) : (
    <>
      {showRiskBig && (
        <Col span={8}>
          <CorpIntroRiskCardBig ... />
        </Col>
      )}
      {showRadar && (
        <Col span={4}>
          {/* 雷达图 */}
        </Col>
      )}
      {showRiskSmall && (
        <Col span={4}>
          <CorpIntroRiskCardSmall ... />
        </Col>
      )}
      {showEsg && (
        <Col span={4}>
          <EsgBrand ... />
        </Col>
      )}
      <Col span={tabsSpan}>
        <Tabs ... />
      </Col>
    </>
  )}
</Row>
```

## 8. 总结

- 该设计将复杂分支拆解为可读性强的布尔变量，极大提升了代码的可维护性和扩展性。
- 只需维护两大分支（是否展示图谱卡片），其余内容均可灵活组合。
- Tabs 的宽度自适应，保证 UI 一致性。

---

如需进一步的代码实现或具体重构方案，可随时补充！
