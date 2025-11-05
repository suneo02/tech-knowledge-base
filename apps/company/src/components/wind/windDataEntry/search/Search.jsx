import { Input } from '@wind/wind-ui'
import { useRegex } from '../windDataEntryUtils'

const WindSearch = (props) => {
  const [value, onChange, isValid] = useRegex('', 'search')

  return <Input.Search value={value} onChange={onChange} status={!isValid ? 'error' : ''} {...props}></Input.Search>
}

export default WindSearch
