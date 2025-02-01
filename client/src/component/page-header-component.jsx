export const PageHeaderComponent = ({ label }) => {
    return (
        <>
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{label}</h2>
            </div>
        </>
    );
};

export const PageHeaderNoUnderlineComponent = ({ label }) => {
    return (
        <>
            <div className="border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{label}</h2>
            </div>
        </>
    );
};
