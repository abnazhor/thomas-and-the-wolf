import express from "express";

import expressLoader from "./loaders/express.js";

const main = async () => {
    const app = express();

    expressLoader(app);

    app.listen(3000, () => {
        console.log("Game API running on port 3000!");
    })
}

main();