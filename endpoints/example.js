export default {
    "/example": {
        get: (req, res) =>
            res.send("You have reached this web page by typing \"example.com\", \"example.net\", or \"example.org\" into your web browser.<br><br>These domain names are reserved for use in documentation and are not available for registration. See <a href=\"https://www.rfc-editor.org/rfc/rfc2606.txt\">RFC 2606</a>, Section 3.")
    }
};
