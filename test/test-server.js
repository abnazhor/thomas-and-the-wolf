import express from "express";

import expressLoader from "../src/loaders/express.js";

const app = express();

expressLoader(app);

export default app.listen(3000, () => {
    console.log("Game API running on port 3000!");
})