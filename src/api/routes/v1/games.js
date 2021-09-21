import response from "../../../utils/response.js";
import GameService from "../../../services/GameService.js";

export default app => {
    app.post("/v1/games", async (req, res) => {
        const { puzzleId } = req.body;

        // Validates if a game is in progress, as there is only one
        // game available per session.
        if (!req.session.gameInProgress) {
            // In case of not having any session yet, obtains base game data...
            const { thomas, wolf, layout } = await GameService.loadGameFromJSON(puzzleId);

            // And saves it in the session
            req.session.wolf = wolf;
            req.session.thomas = thomas;
            req.session.puzzleId = puzzleId;
            req.session.gameInProgress = true;

            res.status(200).send({
                message: "Game has been successfully started",
                details: {
                    data: {
                        wolf,
                        thomas,
                        layout

                    }
                },
                code: 200
            })
        } else {
            // If the game has already been started, generates a new error to let the user know.
            // This makes possible the ability to resume sessions without having to handle anything else.
            res.status(403).send(response.generateErrorResponse({
                message: "The game has already been started",
                details: {},
                description: "The game has been already started. To start a new one, please delete the current game.",
                code: 403
            }))
        }
    });

    app.delete("/v1/games", (req, res) => {
        // The session is fully destroyed as having garbage could generate errors
        // in case of starting a new game.
        req.session.destroy();
        res.status(200).send({
            message: "Current game has been successfully finished",
            details: {},
            description: "Current game has been successfully finished. To start a new one, generate a new game",
            code: 200
        });
    });

    // Returns information about the game.
    app.get("/v1/games/status", (req, res) => {
        const { wolf, thomas, puzzleId } = req.session;

        res.status(200).send({
            message: "",
            details: {
                wolf,
                thomas,
                puzzleId
            }
        })
    });
}