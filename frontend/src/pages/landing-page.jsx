import { IoHomeOutline, IoHome } from "react-icons/io5";
import { RxHome } from "react-icons/rx";
import React, { useContext } from "react";
import "animate.css";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

const LandingPage = () => {
    // Function to generate random values for animation
    const getRandomPosition = () => `${Math.random() * 100}%`;
    const getRandomAngle = () => `${Math.random() * 30 - 15}deg`; // Angle between -15deg and 15deg
    const getRandomEffect = () => {
        const effects = ["animate__bounce", "animate__pulse", "animate__rubberBand", "animate__jello"];
        return effects[Math.floor(Math.random() * effects.length)];
    };

    // Function to randomly choose an icon
    const getRandomIcon = () => {
        const icons = [<IoHomeOutline />, <IoHome />, <RxHome />];
        return icons[Math.floor(Math.random() * icons.length)];
    };

    // Function to generate random color
    const getRandomColor = () => {
        const colors = ["#FF6347", "#4682B4", "#32CD32", "#FFD700", "#8A2BE2", "#FF1493"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const navigate = useNavigate();

    const {
        auth: { loggedInUser },
    } = useContext(AuthContext);

    return (
        <>
            {loggedInUser ? (
                navigate("/home")
            ) : (
                <>
                    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white relative overflow-hidden">
                        <header className="w-full py-4 flex justify-between items-center px-8 animate__animated animate__fadeInDown">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">TenantEase</h1>
                        </header>

                        <section className="flex-grow flex flex-col justify-center items-center text-center animate__animated animate__zoomIn">
                            <div className="bg-blue-950 dark:bg-blue-950 z-auto p-12 rounded-lg shadow-lg relative max-w-4xl mx-auto">
                                <h2 className="text-5xl font-extrabold mb-4 text-white dark:text-gray-100 tracking-wide leading-tight">Find Your Perfect Home</h2>
                                <p className="text-lg text-gray-100 dark:text-gray-300 mb-8 leading-relaxed max-w-xl mx-auto">
                                    Simplifying the rental process for tenants and landlords.
                                </p>
                                <NavLink to={"/home"}>
                                    <Button className="animate__animated animate__pulse animate__infinite ">Get Started</Button>
                                </NavLink>
                            </div>
                        </section>

                        {/* Background Icons */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                            {/* Randomly Place Icons */}
                            {Array.from({ length: 20 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`icon absolute flex justify-center items-center ${getRandomEffect()}`}
                                    style={{
                                        top: getRandomPosition(),
                                        left: getRandomPosition(),
                                        transform: `rotate(${getRandomAngle()})`,
                                        fontSize: `${Math.random() * 20 + 10}px`, // Random icon size
                                        animationDuration: `${Math.random() * 10 + 5}s`, // Random duration
                                        animationDelay: `${Math.random() * 5}s`, // Random delay
                                        color: getRandomColor(), // Random color for each icon
                                    }}
                                >
                                    {getRandomIcon()}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default LandingPage;
