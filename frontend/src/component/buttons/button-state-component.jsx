import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
export const LoadingBtnComponent = () => {
    return (
        <Button disabled className="w-full transition-colors disabled:cursor-not-allowed disabled:opacity-50">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </Button>
    );
};

export const SubmitButtonComponent = ({ label, disabled = false }) => {
    return (
        <Button disabled={disabled} className="w-full transition-colors hover:opacity-90">
            {label}
        </Button>
    );
};
