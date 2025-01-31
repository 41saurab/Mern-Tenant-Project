import http from "http";
import application from "./src/config/express-config.js";
import dotenv from "dotenv";

dotenv.config();

const appServer = http.createServer(application);

appServer.listen(process.env.PORT, process.env.SERVER, (error) => {
    if (!error) {
        console.log("Server running on port " + process.env.PORT);
    } else {
        console.log(error);
    }
});
