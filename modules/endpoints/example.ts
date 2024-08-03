// This is an example API endpoint for your express application. This is applicable regardless of if you have templater on or off, you can use this to create whatever endpoint you want.
// the "default" object looks something like this
// { '/endpoint/path': { get: (req, res, next) => { ... }, post: ..., put: ..., delete: ..., etc.  } }
// WARNING: Do mind your static and templater pages when creating new endpoints, since this may override them

import { /*NextFunction,*/ Request, Response } from 'express';
export default {
	'/example': {
		get: (req: Request, res: Response) => { res.send(`You have reached this web page by typing "example.com", "example.net", or "example.org" into your web browser.<br><br>These domain names are reserved for use in documentation and are not available for registration. See <a href="https://www.rfc-editor.org/rfc/rfc2606.txt">RFC 2606</a>, Section 3.`) }
	}
};