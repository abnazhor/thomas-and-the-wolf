import { Router } from "express";

import sessionMiddleware from "./middleware/session.js";

import games from "./routes/v1/games.js";
import monitoring from "./routes/monitoring.js";
import positions from "./routes/v1/positions.js";

export default () => {
    const app = Router();

    app.use(sessionMiddleware);

    games(app);
    positions(app);
    monitoring(app);

    return app;
}