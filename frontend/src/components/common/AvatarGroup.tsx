import { LuUser } from 'react-icons/lu'

const AvatarGroup = ({ avatars = [], maxVisible = 3 }: {
    avatars: (string | undefined)[],
    maxVisible?:number
}) => {
    return (
        <div className='flex items-center '>
            {avatars.slice(0, maxVisible).map((avatar, idx) =>
                !!avatar ? (
                    <img
                        key={idx}
                        src={avatar}
                        alt={`Avatar ${idx}`}
                        className='w-9 h-9 rounded-full border-1 border-white -ml-3 first:ml-0 dark:border-neutral-400'
                    />
                ) : (
                    <LuUser key={idx} className='text-4xl text-primary rounded-full bg-slate-200 -ml-3 dark:text-dark-primary dark:bg-slate-700 w-9 h-9 border-2' />
                )
            )}
            {avatars.length > maxVisible && (
                <div className='w-9 h-9 flex items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3 dark:bg-blue-300'>
                    +{avatars.length - maxVisible}
                </div>
            )}
        </div>
    )
}

export default AvatarGroup