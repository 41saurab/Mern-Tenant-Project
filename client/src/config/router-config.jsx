import { ThemeProvider } from "@/component/theme/theme-provider";
import { ThemeToggleBtnComponent } from "@/component/theme/theme-toggle-component";
import HomePageLayout from "@/layouts/home-page-layout";
import LoginPage from "@/pages/auth/login-page";
import RegisterPage from "@/pages/auth/register-page";
import EditProfilePage from "@/pages/auth/edit-profile-page";
import HomePage from "@/pages/home-page";
import LandingPage from "@/pages/landing-page";
import { loggedInUser } from "@/store/slices/auth-slice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AllLandlordsList from "@/pages/landlord/all-landlords-list-page";
import LandlordDetailPage from "@/pages/landlord/landlord-detail-page";

const RouterConfig = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            dispatch(loggedInUser());
        }
    }, [dispatch]);
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ToastContainer theme="dark" position="bottom-center" />
            <BrowserRouter>
                <ThemeToggle />
                <Routes>
                    <Route path="/" element={<LandingPage />} />

                    <Route path="/" element={<HomePageLayout />}>
                        <Route path="home" element={<HomePage />} />
                        <Route path="profile/:id" element={<EditProfilePage />} />
                        <Route path="landlords" element={<AllLandlordsList />} />
                        <Route path="landlord/:slug" element={<LandlordDetailPage />} />
                    </Route>

                    <Route path="/sign-up" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
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
