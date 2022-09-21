// const parse = require("./style.css");
// import sheet from './style.css' assert { type: 'css' };
// construct new ship
const shipFactory = (coor) => {
  let shipCoor = coor;
  let hit = [];
  let sunk = false;
  return {shipCoor, hit, sunk} 
};

// make and update the game board
const gameBoard = () => {  
  let ships = [];
  const coorAll = () => {
    for (let i = 0; i < 11*11; i++) {
      let square = container.appendChild(document.createElement("div"));
      square.id = i;
    }
  };
  const createShip = (coor) => {
    ships.push(shipFactory(coor));
  };
  const missedAttack = [];
  const receiveAttack = (shot, s = ships) => {
    let shipHit = false;
    let checkShips = (ship) => {
      for (let j = 0; ship.shipCoor.length > j; j++) {
        if (ship.shipCoor[j] === shot){          
          ship.hit.push(shot);         
          shipHit = true;
        } 
        if (ship.hit.length === ship.shipCoor.length) {
          ship.sunk = true;
        } 
      }
    }
    for (let i = 0; ships.length > i; i++) {
      checkShips(ships[i]);
    }
    if(shipHit === false) {
      missedAttack.push(shot)
    }
  };
  // console.log(ships)
  // console.log(missedAttack)

  return {createShip, receiveAttack, ships}
};
// let dur = gameBoard();
// dur.createShip(["m2","m3","m4"])
// gameBoard().createShip(["m6","m7","m8"])
// // gameBoard().receiveAttack("m8");
// // gameBoard().receiveAttack("m6");
// dur.receiveAttack("m4");
// dur.receiveAttack("m9");
// dur.receiveAttack("m10");

const player = () => {
  
  // all coordinates as well available coordinates
  let allCoo = (() => {
      let result = [];
      for(let i = 1; 101 > i; i++) {
        result.push(i);      
      }
      return result;
  })();
  // remove coordinates from available
  let removeCoo = (remove) => {      
      for(let i = 0; remove.length > i; i++) {      
        let result = allCoo.filter(nr => nr != remove[i]);
        allCoo = result;
      }
  };
  
// place ships on the board randomly 
  const shipPlace = (length) => {   
    // ship to be placed horizontal or vertical 
    const placement = (() => {
      let random = Math.round(Math.random());   
      if (random === 0) {
        return "vertical";
      } else {
        return "horizontal"
      }
    })();   
    // get available coordinates to position the ships
    const shipCoo = () => {
      let randomCoo = allCoo[Math.round((Math.random())*allCoo.length)];
      let coo = [randomCoo];   
      if (placement === "horizontal") {         
        for(let i = 1; length > i; i++) {
          coo.push(randomCoo + i);
        }
      } else if (placement === "vertical") {         
        for(let i = 1; length > i; i++) {
          coo.push(randomCoo + (i*10));
        }
      }
      let availability = [];      
      const checkAvail = (() => {
        for(let j = 0; length > j; j++) {
          let result = allCoo.filter(nr => nr == coo[j]);
          if (result.length > 0){
          availability.push(result[0]);
          };
        };        
        if(availability.length === length 
          && availability[0] < 10 && placement === "horizontal" 
          && availability[availability.length - 1] > 10) {
            availability = [];
        } else if (availability.length === length 
          && availability[0] > 10 && placement === "horizontal" 
          && availability[0].toString()[0] != availability[availability.length - 1].toString()[0]) {
            availability = [];               
        } 
      })();
      if (availability.length === length){
        return availability;
      } else {
        return shipCoo(length);
      }      
    };
    // construct the ships with given coordinates
    const constructShip = (() => {
      let coo = shipCoo();          
      playerBoard.createShip(coo);
      removeCoo(coo);      
    })();    
  }; 
  shipPlace(3);
  shipPlace(4);
  shipPlace(2);
  shipPlace(4);
  
  console.log(allCoo)
  
}
const playerBoard = gameBoard();
const computer = player();
playerBoard.receiveAttack(3)



console.log(playerBoard.ships)

// const shipFactory = (length) => {
//   return length;
// };

//  export{sum};