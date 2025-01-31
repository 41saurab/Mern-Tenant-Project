import { Button } from "@/components/ui/button";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <section className="flex items-center h-screen p-16 bg-gray-50 dark:bg-gray-700">
            <div className="container flex flex-col items-center ">
                <div className="flex flex-col gap-6 max-w-md text-center">
                    <h2 className="font-extrabold text-9xl text-red-500 dark:text-red-600">
                        <span className="sr-only">Error</span>404
                    </h2>
                    <p className="text-2xl md:text-3xl dark:text-gray-300">Sorry, we couldn't find this page.</p>
                    <NavLink onClick={() => navigate(-1)}>
                        <Button>Go Back</Button>
                    </NavLink>
                </div>
            </div>
        </section>
    );
};

export default NotFoundPage;
