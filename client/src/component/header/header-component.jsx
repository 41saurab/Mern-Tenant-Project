import { Button } from "@/components/ui/button";
// import { AuthContext } from "@/context/AuthContext";
import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { NavLink, useNavigate } from "react-router-dom";

import { LogOut, User } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/auth-slice";
import { toast } from "react-toastify";

const HeaderComponent = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutUser = (e) => {
        dispatch(logout());
        navigate("/login");
        toast.info("User logged out");
    };

    return (
        <>
            {!isLoggedIn ? (
                <>{navigate("/login")}</>
            ) : (
                <header className="w-full p-4 shadow-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white ">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <NavLink to={"/home"} className="flex items-center space-x-4 hover:cursor-pointer">
                            <h1 className="text-2xl font-bold">TenantEase</h1>
                        </NavLink>
                        <nav className="hidden md:flex space-x-6">
                            <NavLink to={"/landlords"} className="transition duration-300">
                                <Button variant="link">Landlords</Button>
                            </NavLink>
                            <NavLink to="/rooms" className="transition duration-300">
                                <Button variant="link">Rooms</Button>
                            </NavLink>
                        </nav>

                        <div className="flex space-x-6">
                            {!isLoggedIn ? (
                                <nav className="hidden md:flex space-x-6">
                                    <NavLink to="/login" className=" transition duration-300">
                                        <Button variant="outline">Login</Button>
                                    </NavLink>
                                    <NavLink to="/sign-up" className=" transition duration-300">
                                        <Button variant="outline">Sign Up</Button>
                                    </NavLink>
                                </nav>
                            ) : (
                                <>
                                    {(user && user.role === "admin") || (user && user.role === "landlord") ? (
                                        <nav className="hidden md:flex space-x-6">
                                            <NavLink to="/dashboard" className=" transition duration-300">
                                                <Button variant="outline">Dashboard</Button>
                                            </NavLink>
                                        </nav>
                                    ) : (
                                        <></>
                                    )}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Avatar className="hover:cursor-pointer">
                                                <AvatarImage src={user.image} alt={user.fullName} />
                                            </Avatar>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-48 bg-white text-gray-700 border border-gray-200 shadow-lg rounded-md py-2 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
                                            <DropdownMenuGroup>
                                                <NavLink
                                                    to={"/profile/" + user._id}
                                                    className="flex items-center px-3 py-2 space-x-2 transition-colors duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                                    <span className="font-medium text-sm">Profile</span>
                                                </NavLink>
                                            </DropdownMenuGroup>

                                            <DropdownMenuSeparator className="my-2 border-t border-gray-200 dark:border-gray-700" />

                                            <DropdownMenuGroup>
                                                <NavLink
                                                    onClick={logoutUser}
                                                    className="flex items-center px-3 py-2 space-x-2 transition-colors duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    <LogOut className="rotate-180 w-5 h-5 text-gray-500 dark:text-gray-400" />
                                                    <span className="font-medium text-sm">Log out</span>
                                                </NavLink>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            )}
                        </div>

                        <button className="md:hidden p-2 text-gray-900 dark:text-white" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
                            <GiHamburgerMenu className="h-6 w-6" />
                        </button>
                    </div>

                    {isMobileMenuOpen && (
                        <div className="md:hidden bg-white dark:bg-gray-900 p-4 space-y-4">
                            <NavLink to="/landlords" className="block ">
                                Landlords
                            </NavLink>
                            <NavLink to="/rooms" className="block ">
                                Rooms
                            </NavLink>
                            <NavLink to="/login" className="block ">
                                Login
                            </NavLink>
                            <NavLink to="/sign-up" className="block ">
                                Sign Up
                            </NavLink>
                        </div>
                    )}
                </header>
            )}
        </>
    );
};

export default HeaderComponent;
