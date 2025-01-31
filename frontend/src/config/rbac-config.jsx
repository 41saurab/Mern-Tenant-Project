import { authSvc } from "@/pages/auth/auth-service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AllowedBy = ({ component, role }) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const checkLoginUser = async () => {
        setLoading(true);
        try {
            const loggedInUserDetail = await authSvc.getLoggedInUserDetails();

            if (role.includes(loggedInUserDetail.data.role)) {
                setLoading(false);
            } else {
                setLoading(false);
                toast.warning("You do not have permission to access this page");
                navigate("/home");
            }
        } catch (error) {
            localStorage.clear();
            setLoading(false);
            navigate("/login");
            toast.error("Error while accessing. Please login first.");
        }
    };

    useEffect(() => {
        let token = localStorage.getItem("token") || null;

        if (token) {
            checkLoginUser();
        } else {
            toast.error("Please login first");
            navigate("/login");
        }
    }, []);

    return <>{loading ? "loading" : <>{component}</>}</>;
};

export default AllowedBy;
