import { ThemeProvider } from "../component/theme/theme-provider";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ThemeToggleBtnComponent } from "@/component/theme/theme-toggle-component";
import { ToastContainer } from "react-toastify";

import HomePageLayout from "@/layouts/home-page-layout";

import AuthProvider from "@/context/AuthContext";

import RegisterPage from "@/pages/auth/register-page";
import LoginPage from "@/pages/auth/login-page";
import ProfileEdit from "@/pages/auth/edit-profile-page";

import LandingPage from "@/pages/landing-page";
import HomePage from "@/pages/home-page";

import AllLandlordsList from "@/pages/landlord/all-landlords-list-page";
import LandlordDetailPage from "@/pages/landlord/landlord-detail-page";

import DashboardPageLayout from "@/layouts/dashboard-layout-page";
import DashboardHomePage from "@/pages/dashboard/dashboard-home-page";
import LandlordListPage from "@/pages/dashboard/landlord/landlord-list-page";
import AllowedBy from "./rbac-config";
import TenantListPage from "@/pages/dashboard/tenants/tenants-list-page";

import AllRoomListPage from "@/pages/dashboard/room/all-room-list-page";
import RoomCreatePage from "@/pages/dashboard/room/room-create-page";
import RoomEditPage from "@/pages/dashboard/room/room-edit-page";

import NotFoundPage from "@/pages/not-found-page";
import MyRoomPage from "@/pages/dashboard/room/my-room-page";

const RouterConfig = () => {
    return (
        <AuthProvider>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <ToastContainer theme="dark" position="bottom-center" />
                <BrowserRouter>
                    <ThemeToggle />
                    <Routes>
                        <Route path="/" element={<LandingPage />} />

                        <Route path="/" element={<HomePageLayout />}>
                            <Route path="home" element={<HomePage />} />
                            <Route path="profile/:id" element={<ProfileEdit />} />
                            <Route path="landlords" element={<AllLandlordsList />} />
                            <Route path="landlord/:slug" element={<LandlordDetailPage />} />
                        </Route>

                        <Route path="/dashboard/" element={<AllowedBy role={["admin", "landlord"]} component={<DashboardPageLayout />} />}>
                            <Route index element={<DashboardHomePage />} />
                            <Route path="landlords" element={<LandlordListPage />} />
                            <Route path="tenants" element={<TenantListPage />} />
                            <Route path="rooms" element={<AllRoomListPage />} />
                            <Route path="my-rooms" element={<MyRoomPage />} />
                            <Route path="room/create" element={<RoomCreatePage />} />
                            <Route path="rooms/edit/:id" element={<RoomEditPage />} />
                        </Route>

                        <Route path="/sign-up" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />

                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
};

const ThemeToggle = () => {
    const location = useLocation();
    const isRegisterorLoginPage = location.pathname === "/sign-up" && "/login";

    return (
        <div className={`z-50 ${isRegisterorLoginPage ? "absolute bottom-4 right-4" : "fixed bottom-4 right-4"}`}>
            <ThemeToggleBtnComponent />
        </div>
    );
};

export default RouterConfig;
