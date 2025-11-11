import { FilePdfO, FileWordO } from '@wind/icons'
import { Button, Tooltip } from '@wind/wind-ui'
import React from 'react'
import { STATIC_FILE_PATH } from '../../../../locales/constants'
import intl from '../../../../utils/intl'
import { downloadFile } from '../../../../utils/utils'

/**
 * 标题字段render
 * @param {*} titleZh 中文title
 * @param {*} titleLocal 本土title
 */
export const CorpInfoHeaderComp = (titleZh: string, titleLocal?: string) => {
  return (
    <span>
      {titleZh}
      {titleLocal ? (
        <>
          <br />
          <small style={{ color: '#aaa' }}>{titleLocal}</small>
        </>
      ) : null}
    </span>
  )
}

/**
 * Wind 全球行业分类标准标题组件
 * @param {string} fileName - 文件名称
 * @param {string} filePath - 文件路径
 */
export const TitleAttachmentRender: React.FC<{
  fileName?: string
  filePath?: string
  title?: string
}> = ({
  fileName = intl('', 'Wind 全球行业分类标准 (2024 版)'),
  filePath = 'Wind-Global-Industry-Classification-Standard(2024Edition).pdf',
  title = intl('437437', 'Wind行业分类'),
}) => {
  return (
    <>
      {title}
      <Tooltip title={fileName}>
        <Button
          onClick={() => {
            downloadFile(STATIC_FILE_PATH + filePath, fileName)
          }}
          type="text"
          icon={
            filePath?.includes('.pdf') ? (
              <FilePdfO
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                data-uc-id="TVcQMfYFFu"
                data-uc-ct="filepdfo"
              />
            ) : (
              <FileWordO
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                data-uc-id="x8Z-GVOEkV"
                data-uc-ct="filewordo"
              />
            )
          }
          data-uc-id="Ic_3J159k2K"
          data-uc-ct="button"
        />
      </Tooltip>
    </>
  )
}

export function makeTree(data, item) {
  data.children.push(item)
}
