const Progress = ({ status, progress }) => {
    const getColor = (status) => {
        switch (status) {
            case 'in-progress':
                return 'text-cyan-500 bg-cyan-500 border border-cyan-500/10'
            case 'completed':
                return 'text-indigo-500 bg-indigo-500 border border-indigo-500/10'
            default:
                return 'text-violet-500 bg-violet-500 border border-violet-50/10'
        }
    }
    return (
        <div className='w-full bg-gray-200 rounded-full h-1.5'>
            <div
                className={`${getColor(status)} h-1.5 rounded-full text-center text-xs font-medium`}
                style={{ width: `${progress}%` }}
            >
            </div>
        </div>
    )
}

export default Progress