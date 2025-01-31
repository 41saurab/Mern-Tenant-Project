import React, { useContext } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

import { IoBedOutline, IoHomeOutline, IoLogOutOutline, IoPeopleOutline, IoPersonOutline } from "react-icons/io5";

const SidebarComponent = () => {
    const { auth, setAuth } = useContext(AuthContext);

    const user = auth.loggedInUser;

    const logout = () => {
        localStorage.clear();
        setAuth({
            loggedInUser: null,
        });
        navigate("/login");
    };

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <NavLink to="/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">TenantEase</span>
                                    <span>v1.0.0</span>
                                </div>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <NavLink to="/dashboard" className="font-medium">
                                    <GalleryVerticalEnd /> Dashboard
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        {user && user.role === "admin" ? (
                            <>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <NavLink to="/dashboard/landlords" className="font-medium">
                                            <IoPeopleOutline /> Landlords
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <NavLink to="/dashboard/tenants" className="font-medium">
                                            <IoPeopleOutline /> Tenants
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <NavLink to="/dashboard/rooms" className="font-medium">
                                            <IoBedOutline /> All Rooms
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </>
                        ) : null}

                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <NavLink to="/dashboard/my-rooms" className="font-medium">
                                    <IoBedOutline /> My Rooms
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup className="mt-auto">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <NavLink to="/home" className="font-medium">
                                    <IoHomeOutline /> Home
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <NavLink to={`/profile/${user._id}`} className="font-medium">
                                    <IoPersonOutline /> Profile
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <NavLink onClick={logout} className="font-medium">
                                    <IoLogOutOutline className="rotate-180" /> Logout
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
};

export default SidebarComponent;
