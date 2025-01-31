import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { landlordSvc } from "./landlord-service";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";
import { ucFirst } from "@/helper/helper";
import { Badge } from "@/components/ui/badge";
import Swal from "sweetalert2";
import PaginationComponent from "@/component/pagination-component";
import SearchListComponent from "@/component/form/search-list-component";
import { TableSkeletonComponent } from "@/component/skeleton/skeleton";
import { PageHeaderNoUnderlineComponent } from "@/component/page-header-component";
import { NavLink } from "react-router-dom";

const LandlordListPage = () => {
    const [loading, setLoading] = useState();
    const [search, setSearch] = useState();
    const [landlord, setLandlord] = useState([]);

    const [pagination, setPagination] = useState({
        totalData: 0,
        limit: 10,
        currentPage: 1,
        totalPage: 1,
    });

    const loadLandlord = async ({ page = 1, search = null }) => {
        setLoading(true);
        try {
            const response = await landlordSvc.getLandlords({ page: page, search: search });

            setLandlord(response.data);
            setPagination({
                totalData: response.options.totalLandlords,
                limit: response.options.limit,
                currentPage: response.options.page,
                totalPage: Math.ceil(response.options.totalLandlords / response.options.limit),
            });
        } catch (error) {
            toast.error("Error loading data");
        } finally {
            setLoading(false);
        }
    };

    const deleteData = async (landlordId) => {
        setLoading(true);
        try {
            await landlordSvc.deleteLandlord(landlordId);

            const remainingItems = landlord.length - 1;
            const isLastPageEmpty = remainingItems === 0 && pagination.currentPage > 1;

            const newPage = isLastPageEmpty ? pagination.currentPage - 1 : pagination.currentPage;

            await loadLandlord({ page: newPage, search });
        } catch (error) {
            toast.error("Error deleting");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLandlord({ page: 1, search: null });
    }, []);

    useEffect(() => {
        const debounce = setTimeout(() => {
            loadLandlord({ page: 1, search: search });
        }, 1000);

        return () => clearTimeout(debounce);
    }, [search]);

    return (
        <div className="mb-12">
            <div className="flex my-6 justify-between items-center ">
                <PageHeaderNoUnderlineComponent label={"Landlord list"} />
                <SearchListComponent loading={loading} setSearch={setSearch} />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">SN</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableSkeletonComponent rows={5} cols={8} />
                    ) : landlord && landlord.length ? (
                        landlord.map((landlord, index) => (
                            <TableRow key={landlord._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <img
                                        src={landlord.image || "https://placehold.co/600x400/F1F1F1/000000?text=No+Image"}
                                        onError={(e) => {
                                            e.target.src = "https://placehold.co/600x400/F1F1F1/000000?text=No+Image";
                                        }}
                                        alt={landlord.name}
                                        className="w-14 h-14 object-cover"
                                    />
                                </TableCell>
                                <TableCell>
                                    <NavLink to={"/landlord/" + landlord.slug} className={"hover:text-[#f97316] hover:underline underline-offset-2"}>
                                        {ucFirst(landlord.fullName)}
                                    </NavLink>
                                </TableCell>
                                <TableCell>{landlord.email}</TableCell>
                                <TableCell>{landlord.phoneNumber}</TableCell>
                                <TableCell>
                                    <Badge className={`${landlord.status === "active" ? "bg-green-500" : "bg-red-500"}`}>{ucFirst(landlord.status)}</Badge>
                                </TableCell>
                                <TableCell>{ucFirst(landlord.gender)}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        className="px-3"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            Swal.fire({
                                                title: "Are you sure?",
                                                text: `Delete ${landlord.fullName}`,
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonColor: "#3085d6",
                                                cancelButtonColor: "#d33",
                                                confirmButtonText: "Yes, delete it!",
                                            }).then(async (result) => {
                                                if (result.isConfirmed) {
                                                    await deleteData(landlord._id);
                                                    Swal.fire({
                                                        title: "Deleted!",
                                                        text: `${landlord.fullName} deleted`,
                                                        icon: "success",
                                                    });
                                                }
                                            });
                                        }}
                                    >
                                        <FaTrash />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan="9" className="text-center">
                                No data found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {!loading && <PaginationComponent pagination={pagination} loadLandlord={loadLandlord} />}
        </div>
    );
};

export default LandlordListPage;
