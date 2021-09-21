import response from "../../utils/response.js";

export default (req, res, next) => {
    // Checks if there is a session, as we only want a game to be running at the same time
    // It also prevents the user from generating errors by querying other endpoints.
    if (req.session.gameInProgress || req.path === "/v1/games") {
        next();
    } else {
        res.status(403).send(response.generateErrorResponse({
            code: 403,
            details: {},
            message: "No game session found",
            description: "No game session has been found. Please start a new game to continue."
        }))
    }
}