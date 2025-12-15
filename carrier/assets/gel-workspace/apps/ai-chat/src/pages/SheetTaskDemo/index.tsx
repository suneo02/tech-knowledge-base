import { SheetTaskProvider } from '@/contexts/SuperChat/SheetTaskContext'
import { SheetTaskDemo } from './components/SheetTaskDemo'

const SheetTaskDemoPage = () => (
  <SheetTaskProvider>
    <SheetTaskDemo />
  </SheetTaskProvider>
)

export default SheetTaskDemoPage
