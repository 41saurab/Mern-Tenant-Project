import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";
import { ucFirst } from "@/helper/helper";
import { Badge } from "@/components/ui/badge";
import Swal from "sweetalert2";
import SearchListComponent from "@/component/form/search-list-component";
import { TableSkeletonComponent } from "@/component/skeleton/skeleton";
import { PageHeaderNoUnderlineComponent } from "@/component/page-header-component";
import PaginationComponent from "@/component/pagination-component";
import { tenantSvc } from "./tenants-service";

const TenantListPage = () => {
    const [loading, setLoading] = useState();
    const [search, setSearch] = useState();
    const [user, setUser] = useState([]);

    const [pagination, setPagination] = useState({
        totalData: 0,
        limit: 10,
        currentPage: 1,
        totalPage: 1,
    });

    const loadUser = async ({ page = 1, search = null }) => {
        setLoading(true);
        try {
            const response = await tenantSvc.getUsers({ page: page, search: search });

            setUser(response.data);

            setPagination({
                totalData: response.options.totalTenants,
                limit: response.options.limit,
                currentPage: response.options.page,
                totalPage: Math.ceil(response.options.totalTenants / response.options.limit),
            });
        } catch (error) {
            toast.error("Error loading data");
        } finally {
            setLoading(false);
        }
    };

    const deleteData = async (userId) => {
        setLoading(true);
        try {
            await tenantSvc.deleteUser(userId);

            const remainingItems = user.length - 1;
            const isLastPageEmpty = remainingItems === 0 && pagination.currentPage > 1;

            const newPage = isLastPageEmpty ? pagination.currentPage - 1 : pagination.currentPage;

            await loadUser({ page: newPage, search });
        } catch (error) {
            toast.error("Error deleting");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser({ page: 1, search: null });
    }, []);

    useEffect(() => {
        const debounce = setTimeout(() => {
            loadUser({ page: 1, search: search });
        }, 1000);

        return () => clearTimeout(debounce);
    }, [search]);

    return (
        <div className="mb-12">
            <div className="flex my-6 justify-between items-center ">
                <PageHeaderNoUnderlineComponent label={"Tenants list"} />
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
                    ) : user && user.length ? (
                        user.map((user, index) => (
                            <TableRow key={user._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <img
                                        src={user.image || "https://placehold.co/600x400/F1F1F1/000000?text=No+Image"}
                                        onError={(e) => {
                                            e.target.src = "https://placehold.co/600x400/F1F1F1/000000?text=No+Image";
                                        }}
                                        alt={user.name}
                                        className="w-14 h-14 object-cover"
                                    />
                                </TableCell>
                                <TableCell>{ucFirst(user.fullName)}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phoneNumber}</TableCell>
                                <TableCell>
                                    <Badge className={`${user.status === "active" ? "bg-green-500" : "bg-red-500"}`}>{ucFirst(user.status)}</Badge>
                                </TableCell>
                                <TableCell>{ucFirst(user.gender)}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        className="px-3"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            Swal.fire({
                                                title: "Are you sure?",
                                                text: `Delete ${user.fullName}`,
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonColor: "#3085d6",
                                                cancelButtonColor: "#d33",
                                                confirmButtonText: "Yes, delete it!",
                                            }).then(async (result) => {
                                                if (result.isConfirmed) {
                                                    await deleteData(user._id);
                                                    Swal.fire({
                                                        title: "Deleted!",
                                                        text: `${user.fullName} deleted`,
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

            {!loading && <PaginationComponent pagination={pagination} loadUser={loadUser} />}
        </div>
    );
};

export default TenantListPage;
