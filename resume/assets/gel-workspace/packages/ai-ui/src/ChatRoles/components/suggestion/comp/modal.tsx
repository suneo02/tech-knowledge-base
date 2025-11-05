import { Modal } from '@wind/wind-ui'

/**
 * 参考资料弹窗提示
 * @param showModal 是否显示
 * @param closeModal 关闭弹窗
 * @returns
 */
export const RefModal = ({ showModal, closeModal }: { showModal: boolean; closeModal: () => void }) => {
  return (
    <>
      {/* @ts-expect-error Modal组件类型声明与实际使用方式不一致，但功能正常 */}
      <Modal title="温馨提示" visible={showModal} footer={null} onCancel={closeModal}>
        <p>应研报发布方要求，如需阅读研报请登录Wind万得金融终端访问，谢谢！</p>
      </Modal>
    </>
  )
}
