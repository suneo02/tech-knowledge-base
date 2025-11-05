import * as ReactVTable from '@visactor/react-vtable'
import { TYPES } from '@visactor/vtable'
import { DateInputEditor, InputEditor, ListEditor, TextAreaEditor } from '@visactor/vtable-editors'
import { useEffect } from 'react'

const { register } = ReactVTable

export const useRegisterEditors = () => {
  useEffect(() => {
    const init = async () => {
      // 加载 Pikaday 资源
      // await loadPikadayResources()

      register.icon('ai', {
        type: 'svg',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="16" height="16" viewBox="0 0 16 16"><defs><linearGradient x1="-1.4224732503009818e-15" y1="1" x2="0.9399038553237915" y2="1" id="master_svg0_0_885"><stop offset="0%" stop-color="#3862ED" stop-opacity="1"/><stop offset="11.98371946811676%" stop-color="#274CDA" stop-opacity="1"/><stop offset="49.617570638656616%" stop-color="#00AEC7" stop-opacity="1"/><stop offset="66.16040468215942%" stop-color="#17D9CB" stop-opacity="1"/><stop offset="100%" stop-color="#B388E8" stop-opacity="1"/></linearGradient></defs><g><g></g><g><g><path d="M5.844564865665435,4.0384162462921145C5.723134865665436,3.696500246292114,5.401834865665435,3.4681942462921143,5.040774865665436,3.4681942462921143C4.680074865665436,3.4680866972921143,4.358274865665436,3.696376246292114,4.236984865665436,4.0384162462921145L0.8444848656654358,13.328184246292114L2.043724865665436,13.328184246292114L3.298864865665436,10.490464246292113L6.750914865665436,10.490464246292113L7.829774865665436,13.328184246292114L9.060774865665437,13.328184246292114L5.844564865665435,4.0384162462921145ZM5.041214865665435,5.584514246292114L3.7409648656654357,9.249284246292113L6.3425448656654355,9.249284246292113L5.043364865665436,5.583424246292115L5.041214865665435,5.584514246292114ZM11.741484865665436,6.200614246292114L11.741484865665436,13.328434246292113L10.482184865665436,13.328434246292113L10.482184865665436,6.201694246292114L11.741484865665436,6.200614246292114Z" fill-rule="evenodd" fill="url(#master_svg0_0_885)" fill-opacity="1"/></g><g><path d="M6.166842997074127,1.42745Q7.495722997074127,1.43201,7.534192997074127,-6.47743e-13Q7.603112997074128,1.51867,8.888892997074127,1.4382Q7.518782997074127,1.43013,7.537362997074127,2.84881Q7.538072997074127,2.14475,7.193542997074127,1.78744C6.849010997074127,1.43013,6.166842997074127,1.42745,6.166842997074127,1.42745Z" fill-rule="evenodd" fill="#B388E8" fill-opacity="1"/></g><g><path d="M8.82050997018814,3.6392281346130373Q10.89370997018814,3.646328134613037,10.953719970188141,1.412248134613037Q11.061249970188141,3.781538134613037,13.067199970188142,3.655998134613037Q10.929679970188142,3.643408134613037,10.958679970188141,5.856688134613037Q10.95977997018814,4.758298134613037,10.422269970188141,4.200848134613038C9.884769970188142,3.643408134613037,8.82050997018814,3.6392281346130373,8.82050997018814,3.6392281346130373Z" fill-rule="evenodd" fill="#B388E8" fill-opacity="1"/></g></g></g></svg>',
        width: 14,
        height: 14,
        name: 'ai',
        positionType: TYPES.IconPosition.left,
        marginRight: 4,
        // hover: {
        //   width: 18,
        //   height: 18,
        //   bgColor: 'black',
        // },
        // cursor: 'pointer',
      })

      register.icon('company', {
        type: 'svg',
        svg: '<svg t="1742371662684" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16328" width="200" height="200"><path d="M867.2 886.4H642.6V427c0-3.6 3-6.6 6.6-6.6h197c11.6 0 21.2 9.4 21.2 21.2l-0.2 444.8c0.2-0.2 0.2 0 0 0z" fill="#d3eef5" p-id="16329" data-spm-anchor-id="a313x.search_index.0.i11.2fe23a81xH9omA" class="selected"></path><path d="M375.4 628.8H454v-39.2h-78.6v39.2z m-117.8-235.8h78.6v-39.2h-78.6v39.2z m0 117.8h78.6v-39.2h-78.6v39.2z m0 118h78.6v-39.2h-78.6v39.2z m117.8-235.8H454v-39.2h-78.6v39.2z m334 176.8h39.2v-59h-39.2v59z m-334-59H454v-39.2h-78.6v39.2z m451.8-157H591.4V236c0-43.4-35.2-78.6-78.6-78.6H198.6C155.2 157.2 120 192.4 120 235.8v589.4c0 43.4 35.2 78.6 78.6 78.6h707.2V432.4c0-43.6-35.2-78.6-78.6-78.6zM552.2 864.4H198.6c-21.8 0-39.2-17.6-39.2-39.2V235.8c0-21.8 17.6-39.2 39.2-39.2h314.4c21.8 0 39.2 17.6 39.2 39.2v628.6z m314.2 0H591.4V393h235.8c21.8 0 39.2 17.6 39.2 39.2v432.2z m-157-176.8h39.2v-59h-39.2v59z" fill="#828282" p-id="16330"></path></svg>',
        width: 18,
        height: 18,
        name: 'company',
        positionType: TYPES.IconPosition.left,
        marginRight: 4,
        // hover: {
        //   width: 18,
        //   height: 18,
        //   bgColor: 'black',
        // },
        // cursor: 'pointer',
      })

      register.icon('run', {
        type: 'svg',
        svg: '<svg t="1742374968820" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8155" width="200" height="200"><path d="M512 960A448 448 0 1 1 512 64a448 448 0 0 1 0 896z m0-64A384 384 0 1 0 512 128a384 384 0 0 0 0 768z m137.344-419.84a32 32 0 0 1 0 45.184L470.656 636.16a32 32 0 0 1-54.656-22.592V384a32 32 0 0 1 54.656-22.656l178.688 114.752z" fill="#515151" p-id="8156"></path></svg>',
        width: 18,
        height: 18,
        name: 'run',
        positionType: TYPES.IconPosition.absoluteRight,
        visibleTime: 'mouseenter_cell',
        cursor: 'pointer',
      })

      // 注册编辑器到VTable
      const inputEditor = new InputEditor()
      const textareaEditor = new TextAreaEditor()
      const dateInputEditor = new DateInputEditor()
      const listEditor = new ListEditor({ values: ['女', '男'] })

      register.editor('input', inputEditor)
      register.editor('textarea', textareaEditor)
      register.editor('date', dateInputEditor)
      register.editor('select', listEditor)
    }
    init()
  }, [])
}
