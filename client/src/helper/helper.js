import { toast } from "react-toastify";

export const setErrorInfo = (exception, setError) => {
    let errorObj = exception?.data || null;

    if (errorObj && errorObj.status === "VALIDATION FAILED") {
        Object.keys(errorObj.message).map((field) => {
            setError(field, { message: errorObj.message[field] });
        });
        toast.error(exception.data.message);
    } else {
        toast.error(exception.data.message);
    }
};

export const ucFirst = (str) => {
    return String(str).charAt(0).toUpperCase() + String(str).slice(1);
};
