import { ThemeProvider } from "@/component/theme/theme-provider";
import { ThemeToggleBtnComponent } from "@/component/theme/theme-toggle-component";
import LoginPage from "@/pages/auth/login-page";
import RegisterPage from "@/pages/auth/register-page";
import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const RouterConfig = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ToastContainer theme="dark" position="bottom-center" />
            <BrowserRouter>
                <ThemeToggle />
                <Routes>
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
