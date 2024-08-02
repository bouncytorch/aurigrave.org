// This is an example API endpoint for your express application. This is applicable regardless of if you have templater on or off, you can use this to create whatever endpoint you want.
// the "default" object looks something like this
// { '/endpoint/path': { get: (req, res, next) => { ... }, post: ..., put: ..., delete: ..., etc.  } }

import { /*NextFunction,*/ Request, Response } from 'express';
export default {
	'/example': {
		get: (req: Request, res: Response) => {  }
	}
};