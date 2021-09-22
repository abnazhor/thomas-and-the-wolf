import server from "./test-server.js";
import chai, { expect, assert } from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);

let Cookies;

describe("Game API Tests", () => {
    it("Should return a new game with stats [POST /v1/games]", (done) => {
        chai.request(server)
            .post("/v1/games")
            .send({ "puzzleId": "puzzle1" })
            .end((err, res) => {
                Cookies = res.header["set-cookie"].pop().split(";")[0]
                expect(res.status).equal(200);
                assert.typeOf(res.body.data.layout, "array");
                done();
            });
    });


    it("Should return an error as it has already started a new game [POST /v1/games]", (done) => {
        const req = chai.request(server).post("/v1/games");

        req.cookies = Cookies;
        req.send({ "puzzleId": "puzzle1" })
            .end((err, res) => {
                expect(res.status).equal(403);
                done();
            })
    })

    it("Should remove the current game and being able to start a new one [DELETE /v1/games]", (done) => {
        const req = chai.request(server).delete("/v1/games");

        req.cookies = Cookies;
        req.send()
            .end((err, res) => {
                expect(res.status).equal(200);
            })


        chai.request(server)
            .post("/v1/games")
            .send({ "puzzleId": "puzzle1" })
            .end((err, res) => {
                Cookies = res.header["set-cookie"].pop().split(";")[0]
                expect(res.status).equal(200);
                done();
            });
    });
});

describe('Positions APIs Tests', () => {
    it("Should return the result of a turn after sending request with the new position [PUT /v1/positions/thomas]", (done) => {
        const req = chai.request(server).put("/v1/positions/thomas");

        req.cookies = Cookies;
        req.send({ direction: "UP" })
            .end((err, res) => {
                expect(res.status).equal(200);
                expect(res.body.data.thomas).to.deep.equal({ row: 2, column: 4 });
                expect(res.body.data.wolf).to.deep.equal({ row: 2, column: 5 });
                done();
            })
    })


    it("Should send error message when movement is not possible [PUT /v1/positions/thomas]", (done) => {
        const req = chai.request(server).put("/v1/positions/thomas");

        req.cookies = Cookies;
        req.send({ direction: "RIGHT" })
            .end((err, res) => {
                expect(res.status).equal(400);
                done();
            })
    })


    it("Should send error message if direction does not exist [PUT /v1/positions/thomas]", (done) => {
        let req = chai.request(server).put("/v1/positions/thomas");

        req.cookies = Cookies;
        req.send({ direction: "TOP" })
            .end((err, res) => {
                expect(res.status).equal(400);
                done();
            })

    })

    it("Should obtain wolf's position [GET /v1/positions/wolf]", (done) => {
        let req = chai.request(server).get("/v1/positions/wolf");

        req.cookies = Cookies;
        req.send()
            .end((err, res) => {
                expect(res.status).equal(200);
                expect(res.body.data.wolf).to.deep.equal({ row: 2, column: 5 });
                done();
            })

    })

    it("Should send lose message when wolf is at the same position as Thomas [PUT /v1/positions/thomas]", (done) => {
        let req = chai.request(server).put("/v1/positions/thomas");

        req.cookies = Cookies;
        req.send({ direction: "UP" })
            .end((err, res) => {
                expect(res.status).equal(200);
            })

        let secReq = chai.request(server).put("/v1/positions/thomas");
        secReq.cookies = Cookies;
        secReq.send({ direction: "UP" })
            .end((err, res) => {
                expect(res.status).equal(200);
                expect(res.body.message).equals("You lost!");
                done();
            })

    })
});