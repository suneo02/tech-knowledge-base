import type { Meta, StoryObj } from '@storybook/react'

import {
  CDEFilterCfgProvider,
  CDEFilterItemUser,
  CDEMeasureDefaultForSL,
  MeasuresProvider,
  useCDEFilterCfgCtx,
} from 'cde'
import { NumberRangeValue } from 'gel-ui'
import { useState } from 'react'
import { FilterResPreview } from '../../components/CDE/component/FilterResPreview'
import { filterCfgMock } from './filterCfgMock'

import { CDEFilterResItem } from 'gel-api'

const mockData: CDEFilterResItem[] = [
  {
    register_address: '臺中市北屯區三光里九龍街１６７號',
    artificial_person: '張修武',
    established_time: '20140813',
    register_capital: '90',
    corp_name: '小米社',
    region: '台湾地区 台中市',
    govlevel: '存续',
    corp_id: '0A1250975407361',
  },
  {
    register_address: '臺北市大安區復興南路1段257號',
    artificial_person: '魯子榛',
    established_time: '20080424',
    register_capital: '10',
    corp_name: '小米的店',
    region: '台湾地区 台北市',
    govlevel: '歇業',
    corp_id: '0A1250842806994',
  },
  {
    register_address: '新北市永和區仁愛路１０４巷７弄２３號３樓（現場僅供辦公室使用）',
    artificial_person: '張沐月',
    established_time: '20061116',
    register_capital: '0.2',
    corp_name: '小米本舖',
    region: '台湾地区 新北市',
    govlevel: '存续',
    corp_id: '0A1250856223752',
  },
  {
    register_address: '桃園市楊梅區瑞溪里梅獅路二段178號1樓',
    artificial_person: '譚淑芳',
    established_time: '20140508',
    register_capital: '10',
    corp_name: '小米廚房',
    region: '台湾地区 桃园市',
    govlevel: '歇業',
    corp_id: '0A1252368437617',
  },
  {
    register_address: '新北市新店區民族路48巷11號2樓',
    artificial_person: '葉月娥',
    established_time: '20120928',
    register_capital: '6',
    corp_name: '小米的店',
    region: '台湾地区 新北市',
    govlevel: '歇業',
    corp_id: '0A1251138312792',
  },
  {
    register_address: '屏東縣獅子鄉草埔村草埔六巷1之5號',
    artificial_person: '柳瑞岸',
    established_time: '20120724',
    register_capital: '0.3',
    corp_name: '柳樂小米',
    region: '台湾地区 台湾省 屏东县',
    govlevel: '存续',
    corp_id: '0A1252159623477',
  },
  {
    register_address: '桃園市桃園區春日里春春大業路二段25號1樓',
    artificial_person: '羅洪玉霞',
    established_time: '20140102',
    register_capital: '20',
    corp_name: '小米雜貨',
    region: '台湾地区 桃园市',
    govlevel: '歇業',
    corp_id: '0A1239280632430',
  },
  {
    artificial_person: '黃小燕',
    established_time: '20000719',
    register_capital: '5',
    corp_name: '小米的店',
    region: '台湾地区 ',
    govlevel: '撤销',
    corp_id: '0A1240457277693',
  },
  {
    artificial_person: '吳佳陵',
    established_time: '20010510',
    register_capital: '1',
    corp_name: '小米的店',
    region: '台湾地区 ',
    govlevel: '歇業',
    corp_id: '0A1240585386095',
  },
  {
    register_address: '臺中市潭子區潭秀里雅潭路1段88號一樓',
    artificial_person: '陳佳欣',
    established_time: '20111208',
    register_capital: '24',
    corp_name: '小米廚房',
    region: '台湾地区 台中市',
    govlevel: '歇業',
    corp_id: '0A1239558261812',
  },
]

const filtersMock: CDEFilterItemUser[] = [
  {
    title: '企业名称',
    itemId: 1,
    logic: 'any',
    field: 'corp_name',
    value: ['小米'],
  },
]
const meta: Meta<typeof FilterResPreview> = {
  title: 'CDE/FilterResLocal',
  component: FilterResPreview,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const [rangeValue, setRangeValue] = useState<NumberRangeValue>([undefined, undefined])
      const [addable] = useState(false)
      const { getFilterItemById, codeMap } = useCDEFilterCfgCtx()
      return (
        <div style={{ width: '800px', height: '500px', padding: '20px', border: '1px solid #eee' }}>
          <span>addable {addable}</span>
          <Story
            args={{
              ...context.args,
              rangeValue,
              setRangeValue,
              getFilterItemById,
              codeMap,
            }}
          />
        </div>
      )
    },
    (Story, context) => {
      return (
        <CDEFilterCfgProvider filterCfgDefault={filterCfgMock}>
          <MeasuresProvider measuresDefault={CDEMeasureDefaultForSL}>
            <Story args={context.args} />
          </MeasuresProvider>
        </CDEFilterCfgProvider>
      )
    },
  ],
}

type StoryProps = {
  fetch: () => void
  res: CDEFilterResItem[]
  loading: boolean
  page: { total: number }
  filters: CDEFilterItemUser[]
}

export default meta
type Story = StoryObj<StoryProps>

export const Default: Story = {
  args: {
    fetch: () => console.log('Fetching data...'),
    res: mockData,
    loading: false,
    page: {
      total: 125,
    },
    filters: filtersMock,
  },
}

export const Loading: Story = {
  args: {
    fetch: () => console.log('Fetching data...'),
    res: [],
    loading: true,
    page: {
      total: 0,
    },
    filters: filtersMock,
  },
}

export const EmptyResults: Story = {
  args: {
    fetch: () => console.log('Fetching data...'),
    res: [],
    loading: false,
    page: {
      total: 0,
    },
    filters: filtersMock,
  },
}
