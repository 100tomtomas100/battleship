// const shipFactory = require('./script');
// const gameBoard = require('./script');

// // test('adds 1 + 2 to equal 3', () => {
// //     expect(battleship.sum(1, 2)).toBe(3);
// // });

// test('should return an array with all the ship coordinate points', () => {
//     expect(shipFactory(1, ["m2","m3","m4"]).shipCoor).toEqual(["m2","m3","m4"]);
// });
// test('return hit if it has been hit', () => {
//     expect(shipFactory(1, ["m2","m3","m4"]).hit(undefined, "m2")).toContain("hit");
// });
// test('check if the gameboard createship calls shipfactory', () => {
//     expect(gameBoard().createShip()).toHaveBeenCalledTimes(1);
// });
// test('return sunk if it has been sunk', () => {
//     expect(shipFactory(3).sunk("s")).toContain("sunk");
// });
// // test("return the number the shipfactory function was called", () => {
// //     expect(gameBoard().createShip(["m2","m3","m4"])).toEqual({shipCoor:["m2","m3","m4"]})
// //     expect(shipFactory()).toHaveBeenCalledTimes(1);
// // })