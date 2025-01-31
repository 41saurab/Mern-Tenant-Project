import { Input } from "@/components/ui/input";
import React from "react";

const SearchListComponent = ({ loading = true, setSearch }) => {
    return (
        <>
            <form onSubmit={(e) => e.preventDefault()} className="flex">
                <Input
                    className="w-96"
                    type="text"
                    placeholder="Search..."
                    required
                    disabled={loading}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                />
            </form>
        </>
    );
};

export default SearchListComponent;
