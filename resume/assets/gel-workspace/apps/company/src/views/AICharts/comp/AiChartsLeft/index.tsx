import React from 'react'
import { useAIGraph } from '../../context'
import AiChart from '@/views/Charts/ai-chart'

const AIChartsLeft = () => {

    const { setCompanyCode } = useAIGraph()

    const handleCompanyChange = (companyCode: string) => {
        setCompanyCode(companyCode)
    }

    return (<AiChart />)
}

export default AIChartsLeft