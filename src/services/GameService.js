import fs from "fs/promises";

import map from "../utils/map.js";

/**
 * @typedef Position Position object that handles where are the different entities in the game.
 * @property {number} row Row number
 * @property {number} column Column number
 */

/**
 * Loads game file from the selected location and searches for a valid game ID.
 * This design allows to add more puzzles in the future in an easy way.
 * @param {String} puzzleId Puzzle ID
 * @returns 
 */
const loadGameFromJSON = async (puzzleId) => {
    const gameData = JSON.parse(await fs.readFile("./src/data/base_game.json"));
    const { thomas, wolf, layout } = gameData.puzzles.find(puzzle => puzzle.name === puzzleId);

    return {
        wolf,
        thomas,
        layout,
        puzzleId
    }
}

/**
 * Calculates and generates the following step that Thomas is going to make in this turn.
 * It is designed to answer problems like borders and wrong positions, which throw an exception
 * to be catched in the main method.
 * @param {
 *  {
 *    thomasPosition : Position,
 *    layout : Array
 *    direction : String
 *  }
 * } 
 * @returns {Position} Resultant position
 */
const nextThomasSteps = ({ thomasPosition, layout, direction }) => {
    let resultantThomasPosition = null;

    // This check is required as the user cannot go outside of the designed box.
    const isNewPositionViable = map.checkBorders(thomasPosition, direction, layout);

    if (isNewPositionViable) {
        resultantThomasPosition = map.translate(
            direction,
            thomasPosition
        );
    } else {
        throw new Error("Unable to move to the selected position");
    }

    return resultantThomasPosition;
}

/**
 * Calculates and generates the following steps that wolf is going to make in this turn.
 * @param {
 *  {
 *    thomasPosition : Position,
 *    wolfPosition : Position,
 *    layout : array
 *  }
 * }
 * @returns {Position} Resultant position
 */
const nextWolfSteps = ({ thomasPosition, wolfPosition, layout }) => {
    let resultantWolfPosition = wolfPosition;

    for (let i = 0; i < 2; i++) {
        const bestDirectionsToThomas = map.calculateBestDirectionTowardsThomas({ thomasPosition, wolfPosition });

        if (bestDirectionsToThomas.xAxis && map.checkBorders(wolfPosition, bestDirectionsToThomas.xAxis, layout)) {
            resultantWolfPosition = map.translate(bestDirectionsToThomas.xAxis, resultantWolfPosition);
        } else if (bestDirectionsToThomas.yAxis && map.checkBorders(wolfPosition, bestDirectionsToThomas.yAxis, layout)) {
            resultantWolfPosition = map.translate(bestDirectionsToThomas.yAxis, resultantWolfPosition);
        }
    }

    return resultantWolfPosition;
}

/**
 * Calculates what is going to happen in this turn in both sides: Thomas movements and wolf movements.
 * Returns the data with their positions to save them inside session.
 * @param {
 *  {
 *      thomasPosition : Position,
 *      wolfPosition : Position,
 *      direction : string,
 *      puzzleId : string
 *  }
 * }
 * @returns {{thomas : Position, wolf: Position}} Resultant entities generated
 */
const nextGameStep = async ({ thomasPosition, wolfPosition, direction, puzzleId }) => {
    let resultantEntities = {};

    const { layout } = await loadGameFromJSON(puzzleId);

    resultantEntities.thomas = nextThomasSteps({ thomasPosition, layout, direction });

    if (resultantEntities.thomas) {
        resultantEntities.wolf = nextWolfSteps({ thomasPosition, wolfPosition, layout });
    }

    return resultantEntities;
}

// Required functions get exported. The rest start defined only inside the scope of the document
// as they should not be used outside of it.
export default {
    nextGameStep,
    loadGameFromJSON
}