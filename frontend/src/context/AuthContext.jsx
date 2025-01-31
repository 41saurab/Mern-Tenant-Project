import { authSvc } from "@/pages/auth/auth-service";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        loggedInUser: null,
    });

    const getLoggedInUser = async () => {
        try {
            const response = await authSvc.getLoggedInUserDetails();

            setAuth({
                loggedInUser: response.data,
            });
        } catch (exception) {}
    };

    useEffect(() => {
        let token = localStorage.getItem("token") || null;
        if (token) {
            getLoggedInUser();
        }
    }, []);

    return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
