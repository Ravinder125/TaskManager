
// const Loading = () => {
//     return (
//         <div className='fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center'>
//             <svg className="animate-spin h-12 w-12 text-primary mb-4" viewBox="0 0 50 50">
//                 <circle
//                     className="opacity-25"
//                     cx="25"
//                     cy="25"
//                     r="20"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="5"
//                 />
//                 <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M25 5a20 20 0 0 1 20 20"
//                 />
//             </svg>
//             <span className='text-2xl text-primary font-semibold'>Loading...</span>
//         </div>
//     )
// }

// export default Loading



const Loading = () => {
    return (
        <div className="min-h-screen flex justify-center items-center">
            <div
                className="w-32 aspect-square rounded-full relative flex justify-center items-center animate-[spin_3s_linear_infinite] z-40 bg-[conic-gradient(white_0deg,white_300deg,transparent_270deg,transparent_360deg)] before:animate-[spin_2s_linear_infinite] before:absolute before:w-[60%] before:aspect-square before:rounded-full before:z-[80] before:bg-[conic-gradient(white_0deg,white_270deg,transparent_180deg,transparent_360deg)] after:absolute after:w-3/4 after:aspect-square after:rounded-full after:z-[60] after:animate-[spin_3s_linear_infinite] after:bg-[conic-gradient(#065f46_0deg,#065f46_180deg,transparent_180deg,transparent_360deg)]"
            >
                <span
                    className="absolute w-[85%] aspect-square rounded-full z-[60] animate-[spin_5s_linear_infinite] bg-[conic-gradient(#34d399_0deg,#34d399_180deg,transparent_180deg,transparent_360deg)]"
                >
                </span>
            </div>

        </div>

    )
}

export default Loading

