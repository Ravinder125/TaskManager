import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { Pagination } from "../../types/api.type";
// import SelectDropdown from "../Inputs/SelectDropdown";


type PaginationProps = Pagination & { onPageChange: (page: number) => void }

const PaginationComp = ({
    page,
  
    
    totalPages,
    onPageChange,
}: PaginationProps) => {

    if (totalPages <= 1) return null;

    const handlePrev = () => {
        if (page > 1) onPageChange(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) onPageChange(page + 1);
    };

    const renderPages = () => {
        const pages: number[] = [];

        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }

        return pages.map((p) => (
            <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`px-3 py-1 rounded-md border border-neutral-300 text-sm cursor-pointer
          ${p === page ? "bg-primary text-white" : "bg-white"}`}
            >
                {p}
            </button>
        ));
    };

    // const options:Sele1 = {
    // }

    return (
        <div className="flex justify-between">
            <div className="flex items-center gap-2">
                <button onClick={handlePrev} className="text-2xl cursor-pointer" disabled={page === 1}>
                    <MdNavigateBefore />
                </button>

                {renderPages()}

                <button onClick={handleNext} className="text-2xl cursor-pointer" disabled={page === totalPages}>
                    <MdNavigateNext />
                </button>
            </div>

            <div>
                <p>{`Results: ${page} - ${3} of ${totalPages}`}</p>
                
                <div>
                    {/* <SelectDropdown /> */}
                </div>
            </div>
        </div>
    );
};

export default PaginationComp;
