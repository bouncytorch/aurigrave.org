import express from "express";
import path from "path";
import fs from "fs";

export const router = express.Router();

/*
    The following is a fun (albeit impractical) system I came up with to create
    express endpoints "dynamically". Essentially what it does is import all the .js
    files in the "/endpoints" folder at cwd

    im only assuming this is unsafe or impractical, so
    for future code explorers - i would appreciate any feedback on this
*/

const endpoints: Record<expressRequestPath, Record<expressRequestName, expressRequestHandler>> =
    Object.assign({}, ...fs.readdirSync(path.join(process.cwd(), "/endpoints"), { withFileTypes: true })
        .filter(({ name }) => name.endsWith(".js"))
        .map(({ name }) => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const endpoint = require(path.join(process.cwd(), "/endpoints", name));

            if (!("default" in endpoint))
                throw `File ${name} has no "default" member export. Please consult the instructions in https://github.com/bouncytorch/aurigrave.org/blob/main/README.md`;

            return endpoint.default;
        }));

const validMethods = ["get", "post", "delete", "put", "all", "head", "patch", "connect", "options", "trace"];

Object.entries(endpoints).forEach(([path, methods]) =>
    Object.entries(methods).forEach(([name, func]) => {
        name = name.trim().toLowerCase();
        if (!validMethods.includes(name))
            throw `Request method ${name} invalid. (Endpoint ${path})`;
        router[name as expressRequestName](path, func);
    }));
