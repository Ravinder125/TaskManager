import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { Pagination } from "../../types/api.type";
import SelectDropdown from "../Inputs/SelectDropdown";
import { LuChevronFirst, LuChevronLast } from "react-icons/lu";

type PaginationProps = Pagination & {
    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
    isLimitChangeable: boolean;
};

interface LimitOptions {
    label: string;
    value: string;
}

const PaginationComp = ({
    page,
    totalPages,
    limit,
    onPageChange,
    onLimitChange,
    isLimitChangeable,
}: PaginationProps) => {
    if (totalPages <= 1) return null;

    const handleFirst = () => {
        if (page > 1) onPageChange(1);
    };

    const handlePrev = () => {
        if (page > 1) onPageChange(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) onPageChange(page + 1);
    };

    const handleLast = () => {
        if (page !== totalPages) onPageChange(totalPages)
    }

    const getVisiblePages = () => {
        const pages: number[] = [];
        const start = Math.max(1, page - 1);
        const end = Math.min(totalPages, page + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const startResult = (page - 1) * limit + 1;
    const endResult = Math.min(page * limit, totalPages * limit);

    const options: LimitOptions[] = [
        { label: "10", value: "10" },
        { label: "20", value: "20" },
    ];

    return (
        <div className="flex justify-between px-5 gap-5 flex-col items-center sm:flex-row sm:gap-0">
            <div className="flex items-center gap-2">
                <button
                    onClick={handleFirst}
                    disabled={page === 1}
                    className="first-last-page"
                >
                    <LuChevronFirst />
                </button>

                <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="first-last-page"
                >
                    <MdNavigateBefore />
                </button>

                {getVisiblePages().map((p) => (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`px-3 py-1 rounded-md text-sm cursor-pointer
                          ${p === page ? "bg-primary text-white" : "bg-white  border border-neutral-300 dark:text-black"}`}
                    >
                        {p}
                    </button>
                ))}

                <button
                    onClick={handleNext}
                    disabled={page === totalPages}
                    className="first-last-page"
                >
                    <MdNavigateNext />
                </button>

                <button
                    onClick={handleLast}
                    disabled={page === totalPages}
                    className="first-last-page"
                >
                    <LuChevronLast />
                </button>
            </div>

            <div className="flex items-center gap-5">
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    Showing {startResult}–{endResult}
                </p>

                {isLimitChangeable && onLimitChange && (
                    <SelectDropdown
                        onChange={(value) => {
                            onLimitChange(Number(value));
                            onPageChange(1); // reset page
                        }}
                        options={options}
                        value={limit.toString()}
                        placeholder="Limit"
                    />
                )}
            </div>
        </div>
    );
};

export default PaginationComp;
