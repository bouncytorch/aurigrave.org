type expressRequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => void

type expressRequestPath = string

type expressRequestName = "get" | "post" | "delete" | "put" | "all" | "head" | "patch" | "connect" | "options" | "trace";
