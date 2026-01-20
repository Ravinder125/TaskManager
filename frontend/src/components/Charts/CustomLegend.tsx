import React from 'react'

type StatusType = {
    value?: string;
    color?: string

}

const CustomPieLegend = ({ payload }: { payload?: [StatusType] }) => {
    return (
        <div className='flex justify-center flex-wrap gap-2 mt-4 '>
            {payload?.map((status, idx) => (
                <div key={`legend-${idx}`} className='flex items-center gap-1'>
                    <div className='w-2.5 h-2.5 rounded-full'
                        style={{ backgroundColor: status.color }}
                    />
                    <span style={{ color: status.color }}>
                        {status.value}
                    </span>
                </div>
            ))}
        </div>
    )
}

// const CustomBarLegend = ({ payload }: [StatusType]) => {

//     return (
//         <div className='flex justify-cener flex-wrap gap-2'>


//         </div>
//     )
// }

export {
    CustomPieLegend,
    // CustomBarLegend
}