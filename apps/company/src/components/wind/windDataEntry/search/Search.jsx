import { Input } from '@wind/wind-ui'
import { useRegex } from '../windDataEntryUtils'

const WindSearch = (props) => {
  const [value, onChange, isValid] = useRegex('', 'search')

  return (
    <Input.Search
      value={value}
      onChange={onChange}
      status={!isValid ? 'error' : ''}
      {...props}
      data-uc-id="neu7jorTIc"
      data-uc-ct="input"
    ></Input.Search>
  )
}

export default WindSearch
