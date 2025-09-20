
const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen w-full p-2 xl:px-12 xl:pt-8 xl:pb-12 overflow-y-auto bg-neutral-50 dark:bg-dark-surface">
            <h1 className="text-2xl font-semibold text-neutral-800 mb-6 text-center dark:text-neutral-200">
                Task Manager
            </h1>
            <div className="flex w-full justify-center items-center" style={{ height: 'calc(100% - 4rem)' }}>
                <div className="max-w-md w-full">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;