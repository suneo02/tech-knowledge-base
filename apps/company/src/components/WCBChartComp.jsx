import React, { useState, useEffect } from 'react';
// import { WCBChart } from '@wind/chart-builder';

const WCBChartComp = (props) => {
    const [LazyComp, setLazyComp] = useState(null);

    // useEffect(()=>{
    //     import('~@wind/chart-builder/index').then(data=>{
    //         const comp = data.WCBChart;
    //         setLazyComp(comp);
    //     });
    // }, []);


    if (props.data) {        
        return <LazyComp {...props} ></LazyComp>
        // <React.Suspense fallback={<></>}> 
            // <chart {...props} ></chart>
        // </React.Suspense>
    }
    return <></>;
}

export default WCBChartComp;