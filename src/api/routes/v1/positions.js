import response from "../../../utils/response.js";

import GameService from "../../../services/GameService.js";

export default app => {
    app.get("/v1/positions/wolf|thomas", (req, res) => {
        // Checks what entity it is targetting
        const targetEntityName = req.url.match("[a-zA-Z0-9]+$");
        // Loads information directly from session
        // as there is not an storage method.
        const entity = req.session[targetEntityName];

        const data = {};
        data[targetEntityName] = entity;

        // Returns entity information as a response.
        res.status(200).send({
            message: `Current ${targetEntityName} position`,
            data,
            code: 200,
            description: `Current ${targetEntityName} position in the current game`
        })
    });

    app.put("/v1/positions/thomas", async (req, res) => {
        const { direction } = req.body;

        // Data is taken from the session object as it is immutable and
        // is contained inside our application
        const { thomas, wolf, puzzleId } = req.session;

        const upperCaseDirection = direction.toUpperCase();

        // Check if any of the four directions is included before doing anything
        if (["UP", "DOWN", "LEFT", "RIGHT"].includes(upperCaseDirection)) {
            let nextStepResult = {};

            try {
                // Calls the Game Service, which is the one that
                // will handle the main logic.
                nextStepResult = await GameService.nextGameStep({
                    direction,
                    puzzleId,
                    wolfPosition: wolf,
                    thomasPosition: thomas
                });

                // Updates session entities to recover them in the following queries
                req.session.wolf = nextStepResult.wolf;
                req.session.thomas = nextStepResult.thomas;

                // If thomas and wolf are in different positions, sends the information
                // as a successful movement
                if (!(nextStepResult.thomas.row === nextStepResult.wolf.row &&
                    nextStepResult.thomas.column === nextStepResult.wolf.column)) {
                    res.status(200).send({
                        message: "Successfully updated Thomas position",
                        data: {
                            thomas: nextStepResult.thomas,
                            wolf: nextStepResult.wolf
                        },
                        description: "Thomas position has been updated. Wolf position has been updated according to the movement made by the player"
                    });
                } else if (nextStepResult.thomas.row === 7 && nextStepResult.thomas.column === 1) {
                    res.status(200).send({
                        message: "You won!",
                        data: {
                            thomas: nextStepResult.thomas,
                            wolf: nextStepResult.wolf
                        },
                        description: "Well done, Thomas has successfully arrived the exit of the maze."
                    });
                    // In other case, sends a message with "You lost"
                } else {
                    res.status(200).send({
                        message: "You lost!",
                        data: {
                            thomas: nextStepResult.thomas,
                            wolf: nextStepResult.wolf
                        },
                        description: "Wolf has eaten Thomas before he could escape from the maze. Poor Thomas..."
                    });
                    req.session.destroy();
                }

            } catch (err) {
                // In case of not being able to move, sends error message.
                res.status(400).send(response.generateErrorResponse({
                    message: err.message,
                    code: 400,
                    description: "Unable to move to the selected step. Please try again in another direction."
                }))
            }
        } else {
            // In case of a wrong body, sends error message
            res.status(400).send(response.generateErrorResponse({
                message: "Wrong input",
                code: 400,
                description: "Wrong input. Please use UP, DOWN, LEFT, RIGHT to move.",
            }))
        }
    });
}