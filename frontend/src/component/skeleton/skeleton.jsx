import { Skeleton } from "@/components/ui/skeleton";

export const CardSkeletonComponent = ({ cols, rows }) => {
    return (
        <>
            {[...new Array(cols)].map((_, i) => (
                <div key={i} className="flex flex-wrap gap-12">
                    {[...new Array(rows)].map((_, j) => (
                        <div key={j} className="flex flex-col space-y-3">
                            <Skeleton className="h-[160px] w-[290px] rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
};

export const TableSkeletonComponent = ({ rows, cols }) => {
    return (
        <>
            {[...new Array(rows)].map((_, i) => (
                <tr key={i}>
                    {[...new Array(cols)].map((_, j) => (
                        <td key={j} className="px-4 py-3 font-medium text-gray-900 dark:text-gray-200">
                            <div className="max-w-sm animate-pulse">
                                <Skeleton className="h-4 w-[70px]" />
                                <Skeleton className="h-4 w-[100px]" />
                            </div>
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
};
