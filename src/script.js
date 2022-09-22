// const parse = require("./style.css");
// import sheet from './style.css' assert { type: 'css' };

// create a board on the screen;

const screenBoard = () => {
  let container = document.getElementById("place-board");
  container.style.gridTemplateColumns = "repeat(10, auto)";
  for (let i = 1; i <= 10*10; i++) {    
    let square = container.appendChild(document.createElement("div"));
    square.id = i;
    square.className = "square";
    square.style.border = "thin solid black";
  }
};

// construct new ship

const shipFactory = (coor, blSq) => {
  let shipCoor = coor;
  let hit = [];
  let sunk = false;
  let sunkBl = blSq;
  for(let i = 0; shipCoor.length > i; i++){
    let colorShip = document.getElementById(coor[i]);
    colorShip.style.backgroundColor = "black";
  }
  return {shipCoor, hit, sunk, sunkBl} 
};

// make and update the game board

const gameBoard = () => {  
  let ships = [];
  const createShip = (coor, blSq) => {
    ships.push(shipFactory(coor, blSq));
  };
  const missedAttack = [];
  const receiveAttack = (shot, s = ships) => {    
    let shipHit = false;
    let checkShips = (ship) => {
      for (let j = 0; ship.shipCoor.length > j; j++) {              
        if (ship.shipCoor[j] === shot){         
          ship.hit.push(shot);         
          shipHit = true;
        }; 
        if (ship.hit.length === ship.shipCoor.length) {
          ship.sunk = true;
        }; 
      };
    };
    for (let i = 0; ships.length > i; i++) {
      checkShips(ships[i]);
    }
    if(shipHit === false) {
      missedAttack.push(shot)
      return "missed"
    }
    
    
  };
  return {createShip, receiveAttack, ships, missedAttack}
};
// create a new player
const player = (name) => {
  
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
          && availability[0] <= 10 && placement === "horizontal" 
          && availability[availability.length - 1] > 10) {
            availability = [];
        } else if (availability.length === length 
          && availability[0] > 10 && placement === "horizontal" 
          && (availability[0] - 1).toString()[0] != availability[availability.length - 1].toString()[0]) {
            availability = [];               
        } 
      })();
      if (availability.length === length){
        return availability;
      } else {
        return shipCoo(length);
      }      
    };
    let coo = shipCoo();

    // a square around a ship to be blocked from creating new ships
    
    const blockSq = (() => { 
      let block = [];     
      if(placement === "horizontal") {
        for (let i = 0; coo.length > i; i++) { 
          if(i === 0) {
            let block1 = coo[i] - 1;
            let block2 = coo[i] - 10;
            let block3 = coo[i] + 10;
            let block9 = coo[i] - 11;
            let block10 = coo[i] + 9;
            if(coo.length === 1) {              
              let block11 = coo[i] -9;
              let block12 = coo[i] + 1;
              let block13 = coo[i] + 11;
              block.push(block11, block12, block13);
            }
            block.push(block1, block2, block3, block9, block10);
          } else if (i === coo.length - 1) {
            let block6 = coo[i] - 10;
            let block7 = coo[i] + 1;
            let block8 = coo[i] + 10;
            let block14 = coo[i] - 9;
            let block15 = coo[i] + 11;
            block.push(block6, block7, block8, block14, block15);
          } else if (i > 0) {
            let block4 = coo[i] - 10;
            let block5 = coo[i] + 10;
            block.push(block4, block5);
          } 
        }
      } else if (placement === "vertical") {
        for (let i = 0; coo.length > i; i++) {
          if(i === 0) {
            let block1 = coo[i] - 1;
            let block2 = coo[i] - 10;
            let block3 = coo[i] + 1;
            let block9 = coo[i] - 11;
            let block10 = coo[i] - 9;
            if(coo.length === 1) {
              let block11 = coo[i] + 9;
              let block12 = coo[i] + 10;
              let block13 = coo[i] + 11;
              block.push(block11, block12, block13)
            }
            block.push(block1, block2, block3, block9, block10);
          } else if (i === coo.length -1) {
            let block6 = coo[i] - 1;
            let block7 = coo[i] + 1;
            let block8 = coo[i] + 10;
            let block14 = coo[i] + 9;
            let block15 = coo[i] + 11
            block.push(block6, block7, block8, block14, block15);
          } else if (i > 0) {
            let block4 = coo[i] - 1;
            let block5 = coo[i] + 1;
            block.push(block4, block5);
          }
        }
      }
      let blockAvail = block.filter(nr => nr > 0 && nr < 101);
      removeCoo(blockAvail);
      return blockAvail;
    })();

    // construct the ships with given coordinates

    const constructShip = (() => {    
      name.createShip(coo, blockSq);
      removeCoo(coo);      
    })();
  };   
  return {shipPlace}
};

//computer random positioning and play

const VScomputer = () => {
  const screen = screenBoard();
  const playerBoard = gameBoard();
  const computer = player(playerBoard);
  const shipPlacement = (() => {
    for (let i = 1; 11 > i; i++) {
        if (i < 2) {
          computer.shipPlace(4);
        } else if (i < 4) {
          computer.shipPlace(3);
        } else if (i < 7) {
          computer.shipPlace(2);
        } else if (i < 11) {
          computer.shipPlace(1);
        };
    };
  })();  
  console.log(playerBoard.ships)
  return {playerBoard}
}
const enemy = VScomputer()

// shoot the enemy 

const shoot = (() => {
  let square = document.querySelectorAll(".square"); 
  square.forEach(sq => {
    sq.addEventListener("click", () => {
      let shot = enemy.playerBoard.receiveAttack(Number(sq.id));      
      let text = document.createElement("p");
      sq.appendChild(text);
      text.style.position = "absolute";
      console.log(shot)
      if(shot === "missed"){
        text.innerHTML = "&#x2716;";
      } else {
        text.innerHTML = "&#x274C;";
        text.style.fontSize = "150%"
      }
      
      
      
  
    });
  })
})();



// const shipFactory = (length) => {
//   return length;
// };

//  export{sum};