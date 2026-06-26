import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Skeleton } from "../ui/skeleton";

type MetaData = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

type Props = {
    metaData: MetaData;
    onPageChange: (page: number) => void;
    loading: boolean;
};

const Pagination = ({ metaData, onPageChange, loading }: Props) => {
    const pages = getPages(metaData.page, metaData.totalPages);

    const startEntry =
        metaData.total === 0
            ? 0
            : (metaData.page - 1) * metaData.limit + 1;

    const endEntry = Math.min(
        metaData.page * metaData.limit,
        metaData.total
    );

    return (
        <AnimatePresence>
            <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                {loading ? (
                    <Skeleton className="h-3 w-3/12" />
                ) : (
                    <div className="flex gap-1 text-sm text-slate-600">
                        <span>Showing</span>
                        <span>{startEntry}</span>
                        <span>to</span>
                        <span>{endEntry}</span>
                        <span>of</span>
                        <span>{metaData.total}</span>
                        <span>entries</span>
                    </div>
                )}

                <div className="flex items-center gap-3">
                    {loading ? (
                        <>
                            <Skeleton className="mx-2 h-8 w-8 rounded-full" />

                            <Skeleton className="h-8 w-10 rounded-xl md:hidden" />

                            <div className="hidden gap-1 md:flex">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <Skeleton
                                        key={index}
                                        className="h-8 w-10 rounded-xl"
                                    />
                                ))}
                            </div>

                            <Skeleton className="mx-2 h-8 w-8 rounded-full" />
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                disabled={!metaData.hasPreviousPage}
                                onClick={() => onPageChange(metaData.page - 1)}
                                className="rounded-full bg-gray-100 p-1 text-slate-500 disabled:cursor-not-allowed disabled:text-slate-300"
                            >
                                <ChevronLeft size={21} />
                            </button>

                            <div className="hidden items-center gap-1 md:flex">
                                {pages.map((page, index) => (
                                    <button
                                        key={`${page}-${index}`}
                                        type="button"
                                        disabled={page === "..."}
                                        onClick={() =>
                                            page !== "..." &&
                                            page !== metaData.page &&
                                            onPageChange(page)
                                        }
                                        className={`rounded-2xl px-5 py-1.5 text-sm font-medium transition-all duration-200
                                            ${metaData.page === page
                                                ? "cursor-default bg-green-200 text-green-700"
                                                : page === "..."
                                                    ? "cursor-default text-slate-400"
                                                    : "cursor-pointer text-slate-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 text-sm text-slate-500 md:hidden">
                                <span>Page</span>

                                <span className="rounded-md bg-green-100 px-2 py-0.5 font-medium text-green-700">
                                    {metaData.page}
                                </span>

                                <span>/</span>

                                <span className="font-medium text-slate-700">
                                    {metaData.totalPages}
                                </span>
                            </div>

                            <button
                                type="button"
                                disabled={!metaData.hasNextPage}
                                onClick={() => onPageChange(metaData.page + 1)}
                                className="rounded-full bg-gray-100 p-1 text-slate-500 disabled:cursor-not-allowed disabled:text-slate-300"
                            >
                                <ChevronRight size={21} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </AnimatePresence>
    );
};

export default Pagination;

const getPages = (
    currentPage: number,
    totalPages: number
): (number | "...")[] => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);

        if (currentPage > 3) {
            pages.push("...");
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push("...");
        }

        pages.push(totalPages);
    }

    return pages;
};