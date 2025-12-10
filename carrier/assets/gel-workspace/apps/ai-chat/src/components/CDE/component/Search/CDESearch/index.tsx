import CDEContainer, { CDEContainerProps } from '../components/container'

const CDESearch: React.FC<CDEContainerProps> = (props) => {
  return (
    <div style={{ height: '100%', overflow: 'hidden' }}>
      <CDEContainer {...props} />
    </div>
  )
}

export default CDESearch
