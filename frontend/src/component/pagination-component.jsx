import React from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const PaginationComponent = ({ pagination, loadLandlord }) => {
    return (
        <Pagination className={"flex justify-end my-2"}>
            <PaginationContent>
                {pagination.currentPage > 1 && (
                    <PaginationItem>
                        <PaginationPrevious
                            className={"cursor-pointer"}
                            onClick={async (e) => {
                                e.preventDefault();
                                await loadLandlord({ page: pagination.currentPage - 1 });
                            }}
                        />
                    </PaginationItem>
                )}

                {pagination.totalPage !== 1 && (
                    <>
                        {[...new Array(pagination.totalPage)].map((_, index) => {
                            const pageNumber = index + 1;
                            const isActive = pageNumber === pagination.currentPage;

                            return (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        className={`${
                                            isActive
                                                ? "bg-[#f97316] hover:bg-[#e77626f0] text-white hover:text-white font-bold "
                                                : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-700"
                                        } px-3 py-1 rounded cursor-pointer`}
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            await loadLandlord({ page: pageNumber });
                                        }}
                                    >
                                        {pageNumber}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}
                    </>
                )}

                {pagination.currentPage !== pagination.totalPage && (
                    <PaginationItem>
                        <PaginationNext
                            className={"cursor-pointer"}
                            onClick={async (e) => {
                                e.preventDefault();
                                await loadLandlord({ page: pagination.currentPage + 1 });
                            }}
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationComponent;
