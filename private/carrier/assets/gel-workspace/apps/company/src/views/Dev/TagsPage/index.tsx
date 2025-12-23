import { TagsModule, TagWithModule } from 'gel-ui'
import React from 'react'
import { CorpDetailInfoTagsDataCfg, CorpDetailPeopleTagsDataCfg } from './data'

const data: {
  title: string
  windUIData: { module: TagsModule; title: string }[]
  customData?: {
    module: TagsModule
    title: string
    emotion?: string
    level?: number
  }[]
}[] = [CorpDetailInfoTagsDataCfg, CorpDetailPeopleTagsDataCfg]
const TagsPage = () => {
  return (
    <div>
      {data.map((moduleTagDataCfg, idx) => (
        <div key={idx} className="p-3 flex flex-column g-2">
          <h2>{moduleTagDataCfg.title}</h2>

          <h3>wind UI tags</h3>
          <div className="flex g-2">
            {moduleTagDataCfg.windUIData.map((item) => (
              <TagWithModule module={item.module}>{item.title}</TagWithModule>
            ))}
          </div>
          {moduleTagDataCfg.customData && (
            <>
              <h3>非wind UI tags</h3>
              <div className="flex g-2">
                {moduleTagDataCfg.customData.map((item, idx) => (
                  <TagWithModule key={idx} module={item.module} {...item}>
                    {item.title}
                  </TagWithModule>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export default TagsPage
