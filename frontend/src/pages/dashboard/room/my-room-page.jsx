import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa";
import { ucFirst } from "@/helper/helper";
import { Badge } from "@/components/ui/badge";
import Swal from "sweetalert2";
import SearchListComponent from "@/component/form/search-list-component";
import { TableSkeletonComponent } from "@/component/skeleton/skeleton";
import { PageHeaderNoUnderlineComponent } from "@/component/page-header-component";
import PaginationComponent from "@/component/pagination-component";
import { roomSvc } from "./room-service";
import { DateTime } from "luxon";
import { NavLink } from "react-router-dom";

const MyRoomPage = () => {
    const [loading, setLoading] = useState();
    const [search, setSearch] = useState();
    const [room, setRooms] = useState([]);

    const [pagination, setPagination] = useState({
        totalData: 0,
        limit: 10,
        currentPage: 1,
        totalPage: 1,
    });

    const loadRooms = async ({ page = 1, search = null }) => {
        setLoading(true);
        try {
            const response = await roomSvc.getMyRooms({ page: page, search: search });

            console.log(response);

            setRooms(response.data);

            setPagination({
                totalData: response.options.totalRooms,
                limit: response.options.limit,
                currentPage: response.options.page,
                totalPage: Math.ceil(response.options.totalRooms / response.options.limit),
            });
        } catch (error) {
            toast.error("Error loading data");
        } finally {
            setLoading(false);
        }
    };

    const deleteData = async (roomId) => {
        setLoading(true);
        try {
            await tenantSvc.deleteroom(roomId);

            const remainingItems = room.length - 1;
            const isLastPageEmpty = remainingItems === 0 && pagination.currentPage > 1;

            const newPage = isLastPageEmpty ? pagination.currentPage - 1 : pagination.currentPage;

            await loadRooms({ page: newPage, search });
        } catch (error) {
            toast.error("Error deleting");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRooms({ page: 1, search: null });
    }, []);

    useEffect(() => {
        const debounce = setTimeout(() => {
            loadRooms({ page: 1, search: search });
        }, 1000);

        return () => clearTimeout(debounce);
    }, [search]);

    return (
        <div className="mb-12">
            <div className="flex my-6 justify-between items-center ">
                <PageHeaderNoUnderlineComponent label={"My room list"} />
                <SearchListComponent loading={loading} setSearch={setSearch} />
            </div>

            <div className="flex my-3 justify-end">
                <NavLink to={"/dashboard/room/create"}>
                    <Button>
                        Add Room <FaPlus />
                    </Button>
                </NavLink>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">SN</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Price / Month</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableSkeletonComponent rows={5} cols={8} />
                    ) : room && room.length ? (
                        room.map((room, index) => (
                            <TableRow key={room._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <img
                                        src={room.images[0] || "https://placehold.co/600x400/F1F1F1/000000?text=No+Image"}
                                        onError={(e) => {
                                            e.target.src = "https://placehold.co/600x400/F1F1F1/000000?text=No+Image";
                                        }}
                                        alt={room.title}
                                        className="w-14 h-14 object-cover"
                                    />
                                </TableCell>
                                <TableCell>{ucFirst(room.title)}</TableCell>
                                <TableCell>
                                    {new Intl.NumberFormat("np", {
                                        style: "currency",
                                        currency: "Npr",
                                    }).format(room.rentPrice / 100)}
                                </TableCell>
                                <TableCell>{ucFirst(room.location)}</TableCell>
                                <TableCell>
                                    <Badge className={`${room.status === "available" ? "bg-green-500" : "bg-red-500"}`}>{ucFirst(room.status)}</Badge>
                                </TableCell>
                                <TableCell>{DateTime.fromISO(room.createdAt).toFormat("yyyy-MM-dd")}</TableCell>

                                <TableCell>{ucFirst((room.owner && room.owner.fullName) || "Admin")}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        className="px-3"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            Swal.fire({
                                                title: "Are you sure?",
                                                text: `Delete ${room.fullName}`,
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonColor: "#3085d6",
                                                cancelButtonColor: "#d33",
                                                confirmButtonText: "Yes, delete it!",
                                            }).then(async (result) => {
                                                if (result.isConfirmed) {
                                                    await deleteData(room._id);
                                                    Swal.fire({
                                                        title: "Deleted!",
                                                        text: `${room.fullName} deleted`,
                                                        icon: "success",
                                                    });
                                                }
                                            });
                                        }}
                                    >
                                        <FaTrash />
                                    </Button>
                                    <NavLink to={"/dashboard/rooms/edit/" + room._id}>
                                        <Button className="ml-2">
                                            <FaPen />
                                        </Button>
                                    </NavLink>
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

            {!loading && <PaginationComponent pagination={pagination} loadRooms={loadRooms} />}
        </div>
    );
};

export default MyRoomPage;
