export default {
    generateErrorResponse: ({ message, details, description, code }) => {
        let errorObject = {};
        const errorCodeList = {
            "400": "Invalid syntax for this request was provided.",
            "404": "We could not find the resource you requested. Please refer to the documentation for the list of resources.",
            "500": "Unexpected internal server error.",
            "403": "Your account is not authorized to access the requested resource."
        }

        if (message && details && description && code) {
            errorObject = {
                message,
                details,
                description,
                httpResponse: {
                    code,
                    message: errorCodeList[code]
                }
            }
        } else {
            throw new Error("")
        }

        return errorObject;
    }
}