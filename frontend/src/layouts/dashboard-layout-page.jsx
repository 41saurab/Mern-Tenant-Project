import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import SidebarComponent from "@/component/dashboard/sidebar-component";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ucFirst } from "@/helper/helper";

const Breadcrumbs = () => {
    const location = useLocation();

    // Get the pathname and split it into segments
    const pathnames = location.pathname.split("/").filter((path) => path);

    return (
        <Breadcrumb className="flex items-center space-x-2">
            {/* Always include Dashboard as the root breadcrumb */}
            <BreadcrumbItem>
                <BreadcrumbLink asChild>
                    <Link className="hover:text-orange-500" to="/dashboard">
                        Dashboard
                    </Link>
                </BreadcrumbLink>
            </BreadcrumbItem>

            {/* Map through remaining segments, excluding "dashboard" */}
            {pathnames.slice(1).map((path, index) => {
                const isLast = index === pathnames.slice(1).length - 1;
                const to = `/dashboard/${pathnames.slice(1, index + 1).join("/")}`;

                return (
                    <React.Fragment key={to}>
                        {/* Separator between items */}
                        <span className="text-gray-400">{`>`}</span>

                        <BreadcrumbItem isCurrent={isLast}>
                            <BreadcrumbLink asChild>
                                {isLast ? (
                                    <span className="text-black">{ucFirst(path)}</span>
                                ) : (
                                    <Link className="hover:text-orange-500" to={to}>
                                        {ucFirst(path)}
                                    </Link>
                                )}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </React.Fragment>
                );
            })}
        </Breadcrumb>
    );
};

const DashboardPageLayout = () => {
    return (
        <SidebarProvider>
            <SidebarComponent />
            <div className="flex flex-col flex-1">
                <header className="flex h-16 items-center gap-2 border-b px-3">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-2">
                        <Breadcrumbs />
                    </div>
                </header>
                <div className="flex-1 p-4">
                    <Outlet />
                </div>
            </div>
        </SidebarProvider>
    );
};

export default DashboardPageLayout;
