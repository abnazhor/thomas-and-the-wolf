import server from "./test-server.js";
import chai from "chai";
import chaiHttp from "chai-http";

chai.should();
chai.use(chaiHttp);

describe('Task APIs', () => {
    it("It should return a new game with stats", (done) => {
        const body = {
            "puzzleId": "puzzle1"
        };

        const test = chai.request(server)
            .post("/v1/games")
            .send(body)
            .end((err, response) => {
                done();
            });
    });
});