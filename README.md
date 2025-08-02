# aurigrave.org Source
This is the source "bones" of the aurigrave.org website. It only includes the base files - the underlying "engine" (a simple express app).

### Roadmap:
- [x] Dynamic HTTP routing system
- [ ] Templater system based on EJS
- [ ] Blog system based on Markdown format
- [ ] Granular configuration for all of the above

### How to use the dynamic routing system
To create custom express endpoints you need to create a JavaScript ES module file in .js format in the /endpoints folder situated in the current working directory of the program. Here's an example:
```js
export default {
    "/example": {
        get: (req, res) =>
            res.send("You have reached this web page by typing \"example.com\", \"example.net\", or \"example.org\" into your web browser.<br><br>These domain names are reserved for use in documentation and are not available for registration. See <a href=\"https://www.rfc-editor.org/rfc/rfc2606.txt\">RFC 2606</a>, Section 3.")
    }
};
```
An endpoint .js file must have a default member export containing a JS object with the following hierarchy:
- `"/example"` - endpoint's full HTTP path. *(NOTE: this is case sensitive)*
    - `get: (req, res, next) => ...` - endpoint method and an express routing handler. The method name can be HTTP method + express'es "all" method, which handles all incoming methods.
    *(NOTE: The method name is case-insensitive. The type of the "express routing handler" is as following: `(req: express.Request, res: express.Response, next: express.NextFunction) => void`.)*

### FAQ
##### Is there a reason it's so overcomplicated?
No. This is but a simple challenge I set for myself to make as a summer project in 2024. After focusing on education for a while, I decided to pick this back up in 2025, keeping the original idea but dumbing it down to everything essential.

This project is just a showcase of my abilities as a sole manager and developer of a codebase, but *(in the future)* it also might hold practical value to people who want to spin up a quick express server without having to dabble in backend.
