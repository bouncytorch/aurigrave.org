// This is an expansion to the express.Response class to add functions to
// .renderTemplate - render pages using the templater system
// .sendStatusMessage - send a status code and a supplemental JSON

// Primarily it's to streamline some complex functions
// and group them under the express Response object, alongside
// built-in functions like Reponse.render
declare module "express-serve-static-core" {
    interface Response {
        renderTemplate: (subpageName: string, passedVariables?: object, pageHead?: templateHead) => void
        sendStatusMessage: (code: number, message: string) => void
    }
}

import express from "express";
import { router } from "./router";

const app = express();

app.use(router);

app.listen(5000, "0.0.0.0", () => console.log("Application is running"));
