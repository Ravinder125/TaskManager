
const NotAssigned = ({ text = "No task assigned yet!", className = '' }) => {
    return (
        <div className={`text-center text-neutral-600  flex items-center justify-center font-semibold text-2xl ${className} dark:text-neutral-300`} >
            {text}
        </div>
    )
}

export default NotAssigned