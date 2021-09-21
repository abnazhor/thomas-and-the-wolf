/**
 * @typedef Position Position object that handles where are the different entities in the game.
 * @property {number} row Row number
 * @property {number} column Column number
 */


export default {
    /**
     * Converts direction string into a compatible border type as it comes with the specification.
     * This make easier to handle borders instead of designing a new system.
     * Example: convertDirectionIntoBorderType("UP") returns "T"
     * @param {String} direction 
     * @returns {String} Resultant border
     */
    convertDirectionIntoBorderType: (direction) => {
        const borders = {
            "UP": "T",
            "DOWN": "B",
            "LEFT": "L",
            "RIGHT": "R"
        }

        return borders[direction.toUpperCase()];
    },

    /**
     * Calculates what directions are the correct ones to move towards Thomas.
     * Generates one direction for the xAxis and another one for the yAxis,
     * as this way it is able to move to another direction instead of being able of doing just one.
     * @param {
     *  {
     *      thomasPosition : Position,
     *      wolfPosition : Position
     *  }
     * }
     * @returns 
     */
    calculateBestDirectionTowardsThomas: ({ thomasPosition, wolfPosition }) => {
        const bestDirectionXAxis = thomasPosition.column - wolfPosition.column === 0 ? null : wolfPosition.column < thomasPosition.column ? "RIGHT" : "LEFT";
        const bestDirectionYAxis = thomasPosition.row - wolfPosition.row === 0 ? null : wolfPosition.row < thomasPosition.row ? "DOWN" : "UP";

        return {
            "xAxis": bestDirectionXAxis,
            "yAxis": bestDirectionYAxis
        }
    },

    /**
     * Returns converted coordinates depending of what direction it uses.
     * For example: In case of moving "UP", the function will generate 
     * a new Position object with one less in its rows value.
     * @param {String} direction 
     * @param {Position} position 
     * @returns {Position} Resultant Position
     */
    translate: (direction, position) => {
        let resultantPosition = position;
        switch (direction.toUpperCase()) {
            case "UP":
                resultantPosition.row--;
                break;
            case "DOWN":
                resultantPosition.row++;
                break;
            case "LEFT":
                resultantPosition.column--;
                break;
            case "RIGHT":
                resultantPosition.column++;
                break;
        }

        return resultantPosition;
    },

    /**
     * Checks if the selected direction contains any borders.
     * In case of being a viable position, returns true.
     * @param {Position} entityPosition 
     * @param {String} direction 
     * @param {String} layout 
     * @returns {Boolean} isNewPositionViable
     */
    checkBorders: function (entityPosition, direction, layout) {
        const currentPositionInLayout = layout.find(position =>
            position.row === entityPosition.row &&
            position.column === entityPosition.column
        );

        const possibleBorder = this.convertDirectionIntoBorderType(direction);
        const isNewPositionViable = !currentPositionInLayout.borders.includes(possibleBorder);

        return isNewPositionViable;
    }
}