import HeaderComponent from "@/component/header/header-component";
import React from "react";
import { Outlet } from "react-router-dom";

const HomePageLayout = () => {
    return (
        <>
            <HeaderComponent />
            <Outlet />
        </>
    );
};

export default HomePageLayout;
