import server from "./test-server.js";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);

var Cookies;

describe("Game API Tests", () => {
    it("Should return a new game with stats", (done) => {
        chai.request(server)
            .post("/v1/games")
            .send({ "puzzleId": "puzzle1" })
            .end((err, res) => {
                Cookies = res.header["set-cookie"].pop().split(";")[0]
                expect(res.status).equal(200);
                done();
            });
    });


    it("Should return an error as it has already started a new game", (done) => {
        const req = chai.request(server).post("/v1/games");

        req.cookies = Cookies;
        req.send({ "puzzleId": "puzzle1" })
            .end((err, res) => {
                expect(res.status).equal(403);
                done();
            })
    })

    it("Should remove the current game and being able to start a new one", (done) => {
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
    it("Should return the result of a turn after sending PUT request with the new position", (done) => {
        const req = chai.request(server).put("/v1/positions/thomas");

        req.cookies = Cookies;
        req.send({ direction: "UP" })
            .end((err, res) => {
                expect(res.status).equal(200);
                expect(res.body.details.data.thomas).to.deep.equal({ row: 2, column: 4 });
                expect(res.body.details.data.wolf).to.deep.equal({ row: 2, column: 5 });
                done();
            })
    })


    it("Should send error message when movement is not possible", (done) => {
        const req = chai.request(server).put("/v1/positions/thomas");

        req.cookies = Cookies;
        req.send({ direction: "RIGHT" })
            .end((err, res) => {
                expect(res.status).equal(400);
                done();
            })
    })


    it("Should send error message if direction does not exist", (done) => {
        let req = chai.request(server).put("/v1/positions/thomas");

        req.cookies = Cookies;
        req.send({ direction: "TOP" })
            .end((err, res) => {
                expect(res.status).equal(400);
                done();
            })

    })

    it("Should send lose message when wolf is at the same position as Thomas", (done) => {
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