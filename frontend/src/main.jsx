import { createRoot } from "react-dom/client";
import "./index.css";
import RouterConfig from "./config/router-config";
import { StrictMode } from "react";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterConfig />
    </StrictMode>
);
