// const parse = require("./style.css");
// import sheet from './style.css' assert { type: 'css' };

// construct new ship
const shipFactory = (coor, blSq, player) => {  
  let shipCoor = [];
  let sunkBl = [];
  if (player === "player1") {
    shipCoor = coor;
    sunkBl = blSq; 
  } else {
    for(let i = 0; coor.length > i; i++){
      shipCoor.push(`p2${coor[i]}`);
    };
    for(let i = 0; blSq.length > i; i++){
      sunkBl.push(`p2${blSq[i]}`);
    };
  };
  
  let hit = [];
  let sunk = false;
  
  for(let i = 0; shipCoor.length > i; i++){
    let colorShip;
    if(player === "player2" || player === "AI"){
      colorShip = document.getElementById(`p2${coor[i]}`);
    } else {
      colorShip = document.getElementById(coor[i]);
      colorShip.style.backgroundColor = "green";
    };   
    // colorShip.style.backgroundColor = "green";
  };
  return {shipCoor, hit, sunk, sunkBl} 
};

// make and update the game board for player
const gameBoard = (player) => {  
  // create a board on the screen;
  let container;
  let number = 1;
  let letters = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  let coorLet;
  let coorNum;
  let shipSunkCount = 0;
  const screenBoard = () => {
    if(player === "player1"){     
      container = document.getElementById("place-board");
      coorLet = document.getElementById("coor-let");
      coorNum = document.getElementById("coor-num");
    } else if (player === "player2" || player === "AI") {      
      container = document.getElementById("place-board2");
      coorLet = document.getElementById("coor-let2");
      coorNum = document.getElementById("coor-num2");
    };
    
    container.style.gridTemplateColumns = "repeat(10, auto)";
    for (let i = 1; i <= 10*10; i++) {      
      let square = container.appendChild(document.createElement("div"));      
      square.id;
      if (player === "player2" || player === "AI"){       
        square.id = `p2${i}`;
      } else if (player === "player1"){       
        square.id = i;
      };
      square.className = "square";
      square.style.border = "thin solid black";
    };

    coorLet.style.gridTemplateColumns = "repeat(10, 1fr)";   
    coorNum.style.gridTemplateRows = "repeat(10, 1fr)";
    for(let i = 1; i <= 10; i++) {
      let num = coorNum.appendChild(document.createElement("div"));
      num.style.fontFamily = "Silkscreen, Alkalami, serif";
      let lett = coorLet.appendChild(document.createElement("div"));
      lett.style.fontFamily = "Silkscreen, Alkalami, serif";
      num.innerHTML = number;
      lett.innerHTML = letters[i];
      number += 1;
    };
  };  
  
  //player`s ships and information
  let ships = [];
  const createShip = (coor, blSq, player) => {   
    ships.push(shipFactory(coor, blSq, player));
  };

  //attacks
  let missedAttack = [];
  let shots = [];
  let hit;
 
  //receive enemy attack and check if the ship was hit or it was a missed attack  
  const receiveAttack = (shot, s = ships) => { 
    shots.push(shot);
    let shipHit = false; 

    const shotFire = (coo) => {
      let boardHeight = getComputedStyle(document.querySelector(':root')).getPropertyValue('--box-size');            
      let sqSide = (Number(boardHeight.slice(0, boardHeight.length-2)) / 10) + "px";       
      let time = 0;
      coo.forEach(c => {        
        setTimeout(() => {
        let squareV = document.getElementById(c);
        const fire = document.createElement("img");
        fire.style.height = sqSide;
        fire.style.width = sqSide;
        fire.src = "fire.gif"; 
        fire.style.position = "absolute";
        squareV.appendChild(fire);       
        squareV.style.overflow = "hidden"; 
        squareV.style.backgroundColor  = "green";
        }, time); 
        time +=200;     
      });      
    };

    let checkShips = (ship) => { 
      if (ship.sunk === false) {      
      for (let j = 0; ship.shipCoor.length > j; j++) {              
        if (ship.shipCoor[j] == shot){         
          ship.hit.push(shot);         
          shipHit = true;
        }; 
        if (ship.hit.length === ship.shipCoor.length) {
          ship.sunk = true;
          shotFire(ship.shipCoor)
          
          // background color of sunken ship
          // for(let j = 0; ship.shipCoor.length > j; j++) {
          //   setTimeout(() => {
          //   document.getElementById(ship.shipCoor[j]).style.backgroundColor = "green";
          //   }, 1000);
          // };

          // mark squares around sunken ship
          for(let i = 0; ship.sunkBl.length > i; i++) {            
            let sq = document.getElementById(ship.sunkBl[i]);            
            if (!sq.hasChildNodes()) {
              let text = document.createElement("p");
              sq.appendChild(text);
              text.style.position = "absolute";                    
              text.innerHTML = "&#9679;";
            };            
          };
        }; 
      };
      if (ship.hit.length === ship.shipCoor.length) {        
        gameFlow.removeAICoo(ship.sunkBl);

        //victory pop up 
        shipSunkCount += 1;

        if (shipSunkCount === 10) {          
          document.getElementById("victory-msg").style.display = "block";                   
          gameFlow.gameOver(player);
        };        
      };
    }  
    };

    for (let i = 0; ships.length > i; i++) {
      checkShips(ships[i]);
    };   
    if(shipHit === false) {    
      missedAttack.push(shot);
      if (player === "player1") {
        player1.addPlayer.player1Board.hit = false;
      } else {
        player2.addPlayer.player2Board.hit = false;
      };      
      return "missed";
    } else {
      if (player === "player1") {
        player1.addPlayer.player1Board.hit = true;
      } else {
        player2.addPlayer.player2Board.hit = true;
      };      
    };    
    
  };
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
      };
  };
  
// place ships on the board randomly and manually
  const shipPlace = (length, coord, pos, test, shipId, name) => { 
      let coor = coord;    
       
    // ship to be placed horizontal or vertical
      const placement = (() => {
        if (pos) {
          return pos;
        } else {
        let random = Math.round(Math.random());   
        if (random === 0) {
          return "vertical";
        } else {
          return "horizontal"
        };
        };
      })();


    // check if it is possible to place the ship on the coordinates
    // if random choice run function until the available coordinates are found
    const shipCoo = (coordinates) => {          
      let coo = coordinates;

      //if no coordinates provided choose randomly
      if (!coordinates) {          

        //get the first random available coordinate of the ship
        let randomCoo = allCoo[Math.round((Math.random())*allCoo.length)];
        coo = [randomCoo];

        //get the other coordinates depending if horizontal or vertical and length
        if (placement === "horizontal") {         
          for(let i = 1; length > i; i++) {
            coo.push(randomCoo + i);
          };
        } else if (placement === "vertical") {         
          for(let i = 1; length > i; i++) {
            coo.push(randomCoo + (i*10));
          };
        };
      };     

      //check availability of the chosen coordinates
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
          && (availability[0] - 1).toString()[0] != (availability[availability.length - 1]-1).toString()[0]) {            
            availability = [];               
        };         
      })();

      //if random choice and the coordinates are not available rerun the function
      if (availability.length === length){
        return availability;
      } else {
        return shipCoo();
      };      
    };
    let coo = shipCoo(coor);
    

    // a square around a ship to be blocked from creating new ships
    // coordinates for the marked spaces around shot down ship    
    const blockSq = (() => { 
      let block = [];     
      if(placement === "horizontal") {
        for (let i = 0; coo.length > i; i++) {           
          let secNr = Number(coo[i].toString()[coo[i].toString().length -1]);
          if(i === 0) {
            if(secNr !== 1){
              let block1 = coo[i] - 1;
              let block10 = coo[i] + 9;
              let block9 = coo[i] - 11;
              block.push(block1, block10, block9);
            }             
            let block2 = coo[i] - 10;
            let block3 = coo[i] + 10;            
            if(coo.length === 1 && secNr !== 0) {              
              let block11 = coo[i] -9;
              let block12 = coo[i] + 1;
              let block13 = coo[i] + 11;
              block.push(block11, block12, block13);
            }
            block.push(block2, block3);
          } else if (i === coo.length - 1) {
            if(secNr !== 0) {              
              let block7 = coo[i] + 1;
              let block15 = coo[i] + 11;
              let block14 = coo[i] - 9;
              block.push(block7, block14, block15);
            }; 
            let block6 = coo[i] - 10;            
            let block8 = coo[i] + 10;           
            block.push(block6, block8);                        
          } else if (i > 0) {
            let block4 = coo[i] - 10;
            let block5 = coo[i] + 10;
            block.push(block4, block5);
          } 
        }
      } else if (placement === "vertical") {
        for (let i = 0; coo.length > i; i++) {
          let secNr = Number(coo[i].toString()[coo[i].toString().length -1]);
          if(i === 0) {
            if (secNr !== 1) {
              let block9 = coo[i] - 11;
              let block1 = coo[i] - 1;
              block.push(block1, block9)
            }
            if(secNr !== 0) {
              let block10 = coo[i] - 9;
              let block3 = coo[i] + 1; 
              block.push( block3, block10)
            }
            let block2 = coo[i] - 10;            
            if(coo.length === 1) {
              if(secNr !== 1) {
                let block11 = coo[i] + 9;
                block.push(block11);
              };     
              if(secNr !== 0) {
                let block13 = coo[i] + 11;
                block.push(block13);
              }         
              let block12 = coo[i] + 10;              
              block.push(block12);
            };
            block.push(block2);
          } else if (i === coo.length -1) {
            if (secNr !== 1) {
              let block14 = coo[i] + 9;
              let block6 = coo[i] - 1;
              block.push(block6, block14)
            };    
            if (secNr !== 0) {
              let block7 = coo[i] + 1;
              let block15 = coo[i] + 11;
              block.push(block7,block15)
            };           
            let block8 = coo[i] + 10;          
            block.push(block8);
          } else if (i > 0) {
            if(secNr !== 1){
              let block4 = coo[i] - 1;
              block.push(block4)
            };    
            if(secNr !== 0) {
              let block5 = coo[i] + 1;
              block.push(block5);
            };             
          };
        };
      };
      let blockAvail = block.filter(nr => nr > 0 && nr < 101);
      if(test) {
        blockAvail.forEach(bl => { 
        let text = document.createElement("p");       
        text.style.position = "absolute";            
        text.innerHTML = "&#9679;";
        if (player === "player1") {
          document.getElementById(bl).appendChild(text);
        } else if (player === "player2" || player === "AI") {
          document.getElementById(`p2${bl}`).appendChild(text);
        };               
        });
      }; 
      if (test != "test") {
        removeCoo(blockAvail);
      };     
      return blockAvail;
    })();

    // construct the ships with given coordinates
    if (!test) {
      const constructShip = (() => {    
      createShip(coo, blockSq, player);          
      })();    
    };
    if(test != "test") {
      removeCoo(coo); 
    };     
    if (name === "player1") {
      player1.placeShips.coordinates[shipId].blocks = blockSq; 
    } else  if(name === "player2" || name == "AI") {
      player2.placeShips.coordinates[shipId].blocks = blockSq;
    };         
  };   
  
  const resetBoard = () => { 
    shipSunkCount = 0;   
    ships.splice(0);
    allCoo = (() => {      
      let result = [];
      for(let i = 1; 101 > i; i++) {
        result.push(i);      
      };     
      return result;
    })();
    allCoo.forEach(c => {
      let coo; 
      if (player === "player1") {
        coo = document.getElementById(c);
      } else {
        coo = document.getElementById(`p2${c}`);
      }
      coo.innerHTML= "";      
      coo.style.backgroundColor = "";           
    }); 
    
  };  
  return {resetBoard, allCoo, createShip, receiveAttack, ships, missedAttack, screenBoard, shipPlace, hit, shots};
};

// create a new player
const player = (name) => {
  let title = name;  
  let enemy = (() => {
    if(title === "player1") {
      return "player2";
    } else {
      return "player1";
    };
  })();   

  // add player board
  let player1Board;
  let player2Board;

  const addPlayer = (() => {     
    if (title === "player1") {
      player1Board = gameBoard(title);
      const player1Screen = player1Board.screenBoard();
      result = player1Board;
    } else {
      player2Board = gameBoard(title);
      const player2Screen = player2Board.screenBoard();
      result = player2Board;
    };   
    return {player1Board, player2Board};
  })();  

  //random ship placement
  const randomShipPlacement = () => {  
    let name;
    if (title === "player1") {
      name = player1Board;
    } else {
      name = player2Board;
    };
    for (let i = 1; 11 > i; i++) {
      if (i < 2) {
        name.shipPlace(4);
      } else if (i < 4) {
        name.shipPlace(3);
      } else if (i < 7) {
        name.shipPlace(2);
      } else if (i < 11) {
        name.shipPlace(1);
      };
    };    
  };  

// shoot the enemy  
    let mode = "peace";   
    const shoot = () => {         
        // let square = document.querySelectorAll(".square");         
        let squareP1 = (() => {
          result = [];
          for (let i = 1; i < 101; i++) {
            result.push(i)
          };
          return result
        })();
        let squareP2 = (() => {
          result = [];
          for (let i = 1; i < 101; i++) {
            result.push(`p2${i}`)
          };
          return result
        })();      
        
        let name;
        let square;
        // let pow;
        if (title === "player1") {
          name = player1Board;
          square = squareP1;          
        } else {
          name = player2Board;
          square = squareP2;          
        };
        let markShot = (sq) => {   
          const shotAni = (where) => {            
            const shotCh = [{opacity: "0"}, {opacity: "1"}];
            const timing = {duration: 500, iterations: 1};
            where.animate(shotCh, timing);
          };          
          if (!sq.hasChildNodes()) {              
            let shot = name.receiveAttack(sq.id);
            let text = document.createElement("p");           
            sq.appendChild(text);
            text.style.position = "absolute";
            if(shot === "missed" && text){
              text.innerHTML = "&#x2716;";
              shotAni(text);
            } else {
              // shotFire()
              text.innerHTML = "&#x274C;";
              text.style.fontSize = "150%";
              shotAni(text);
            };
            if(title === "player1") {               
              gameFlow.removeAICoo([sq.id]) 
            };            
          };           
          gameFlow.turnPl();                
        };
        square.forEach(s => {  
          let sq =  document.getElementById(s)     
          sq.addEventListener("click", () => {
            let pow;
            if (title === "player1") {
              pow = player1.mode
            } else {
              pow = player2.mode;
            };  
            if (pow === "war" && !sq.hasChildNodes()){
              markShot(sq);  
            };
          });
        });  
        return {markShot};                
    };
    shoot();
    
  
  
  // manual ship placement    
    const placeShips = (() => {
    if (title != "AI"){    
      //ship choices
      const ships = [4, 3 ,2 ,1];
      const container =  document.getElementById("place-ships");
      container.style.gridTemplateRows = "repeat(4)";
      let amounts = {
        container1: 1,
        container2: 2,
        container3: 3,
        container4: 4
      };
      let shipContainers = [];
      let squaree;
      let numtext;
      for (let i = 1; i <= 4; i++) {  
        let number = [i];  
        squaree = container.appendChild(document.createElement("div"));
        squaree.id = `choice${[i]}`;
        squaree.className = "shipChoice";     
        squaree.style.gridTemplateColumns = `repeat(${[i]}`;
        let shipContainer = squaree.appendChild(document.createElement("div"));        
        shipContainers.push(shipContainer);       
        shipContainer.id = `container${i}`;
        shipContainer.className = `container${i}`;
        numtext = document.getElementById(`choice${i}`).appendChild(document.createElement("p"));
        numtext.id = `text${i}`;
        numtext.style.fontFamily = "Silkscreen, Alkalami, serif";
        numtext.innerHTML = ` \u2715 ${amounts[`container${i}`]}`;
        shipContainer.style.display = "flex";
        for (let j = 1; j<= ships[i-1]; j++) {
          let ship = shipContainer.appendChild(document.createElement("div"));
          ship.style.border = "thin solid black";          
          ship.className = `shipChoiceSQ  shipClass${i}`;
        };
      };
      
      //number of ships available to place
      let changeNum = (inp) => {
        let change = document.getElementById(`text${inp}`);
        num = (() => {
          let res = Number(amounts[`container${inp}`]);
          if (res > 0) {
            return res; 
          } else {
            return 0;
          };          
        })();
        change.innerHTML = `\u2715  ${num}`;        
      };      

      // draggable placement      
      let dragTo = document.querySelectorAll(".square");
      let containerNr;
      let prevSq;
      let sqColor = [];
      let validPlace = false; 
      let coordinates = {};
      let usedCoo = [];
      let copies = [];
      let copyCounter = {
        container1: 0,
        container2: 0,
        container3: 0,
        container4: 0
      };
      let goodToCopy = false;
      let containerId;
      let position = "horizontal";
      let outOfSq = true;

      const resetPlayer = () => {   
        for (let i = 0; Object.keys(coordinates).length > i; i++) {
          coordinates[Object.keys(coordinates)[i]].blocks = [];
        };        
        containerId;
        containerNr;
        validPlace = false; 
        goodToCopy = false;
        outOfSq = true;
        position = "horizontal";
        amounts = {
          container1: 1,
          container2: 2,
          container3: 3,
          container4: 4
        };
        sqColor = [];        
        usedCoo = [];
        copies =[];
        copyCounter = {
          container1: 0,
          container2: 0,
          container3: 0,
          container4: 0
        };
      };
      

      // ships first elements second number
      let nr1 = () => {
        let firstNr = (((sqColor[0][0]).toString()).split(""))
        [(((sqColor[0][0]).toString()).split("")).length -1];
        return firstNr;
      }; 

      // ships last elements second number
      let nr2 = () => {
        let lastNr = (((sqColor[0][sqColor[0].length-1]).toString()).split(""))
        [(((sqColor[0][sqColor[0].length-1]).toString()).split("")).length -1];
        return lastNr;
      };
     

      // ships drag events    
      const startDrag = (container) => {
        containerNr = container.className;  
          containerId = container.id;          
          if(!container.id[10]) {
            goodToCopy = true;
          }; 
          position = "horizontal";         
      };
      shipContainers.forEach(container => {       
        container.draggable ="true";     
        container.addEventListener("dragstart", () => { 
          startDrag(container);              
        });
        container.addEventListener("touchstart", (e) => {
          e.preventDefault();
         
          
          startDrag(container);
        });
        container.addEventListener("touchmove", (e) => {
          
          container.style.position ="absolute"
          let touchLocation = e.targetTouches[0];
          let containerX = container.style.left = touchLocation.pageX + 'px';
          let containerY = container.style.top = touchLocation.pageY + 'px';
          console.log()
          console.log(document.elementFromPoint(containerX, containerY))
        })

        container.addEventListener("dragend", () => {
          
          dragTo.forEach(sq => {
            sq.className = "square";
          }); 
          outOfSq = true;                  
        });
      });

      // drag events for all the copies on the board
      const marksReDo = () => {
        let length = Object.keys(coordinates).length;     
        for(let i = 0; length > i; i++) {
          let check = coordinates[Object.keys(coordinates)[i]].blocks;                         
          check.forEach(c => {            
            if (document.getElementById(c).innerHTML === "" &&
              Object.keys(coordinates)[i] != containerId) {            
              let text = document.createElement("p");       
              text.style.position = "absolute";            
              text.innerHTML = "&#9679;";       
              document.getElementById(c).appendChild(text); 
              usedCoo.push(c);              
            };
          });         
        };
      };
       


      const updateList = ((c) => {              
          c.addEventListener("dragstart", () => {            
            containerNr = c.className;  
            containerId = c.id;  
            position = coordinates[c.id].position;
            // on the move remove coordinates of the ship and blocks from blocked coordinates
            let ship = coordinates[containerId].coo;
            let blocks = coordinates[containerId].blocks;
            ship.forEach(s => {
              for (let i = 0; usedCoo.length > i; i++) {
                if(s === usedCoo[i]) {
                  usedCoo.splice(i, 1);
                };
              };
            });
            blocks.forEach(b => {
              for (let i = 0; usedCoo.length > i; i++) {
                if(b === usedCoo[i]) {
                  usedCoo.splice(i, 1);
                  let empty = document.getElementById(b);                  
                  empty.innerHTML = "";
                };
              };
            });
              marksReDo()                       
          });
          c.addEventListener("dragend", () => {
            dragTo.forEach(sq => {
              sq.className = "square";
            });  
            if (outOfSq === true) {              
              coordinates[containerId].coo.forEach(c => {              
                usedCoo.push(c);            
              });
              coordinates[containerId].blocks.forEach(c => {
                let text = document.createElement("p");       
                text.style.position = "absolute";            
                text.innerHTML = "&#9679;";       
                document.getElementById(c).appendChild(text); 
                usedCoo.push(c);            
              });
            };
            outOfSq = true;
            
          });
          c.addEventListener("click", () => {            
            let goodToTurn = true;
            containerId = c.id;
            if (c.style.display === "flex") {              
              let cooL = coordinates[c.id].coo.length;
              let nCoo =  [];
              for(let i = 0; i < cooL; i++) { 
                let res = coordinates[c.id].coo[0] + (i *10);                
                if(res > 0 && res < 101){
                  nCoo.push(res);
                };               
              };
              let oldCoo = coordinates[c.id].coo;
              let blocks = coordinates[c.id].blocks;             
             
              // remove ship coordinates from used
              oldCoo.forEach(s => {
                for (let i = 0; usedCoo.length > i; i++) {
                  if(s === usedCoo[i]) {
                    usedCoo.splice(i, 1);
                  };
                };               
              });

              // remove block coordinates from used
              blocks.forEach(b => {
                for (let i = 0; usedCoo.length > i; i++) {                 
                  if(b === usedCoo[i]) {                    
                    usedCoo.splice(i, 1);                                     
                  };
                  let empty = document.getElementById(b);                  
                  empty.innerHTML = "";             
                };
              });
              marksReDo();
            
              // check if any of the new coordinates are the same as used coordinates
              for (let i = 0; nCoo.length > i; i++) {                
                usedCoo.forEach(u => {
                  if(nCoo[i] === u) {
                    goodToTurn = false;
                  };
                });
              };
              let name;
              if (title === "player1") {
                name = player1Board;
              } else {
                name = player2Board;
              };

              //with the conditions met tilt the ship and add the new coordinates to used
              if(nCoo.length === cooL && goodToTurn === true) {               
                coordinates[c.id].coo = nCoo;
                position = "vertical";
                coordinates[c.id].position = position;             
                c.style.display = "grid";
                blocks.forEach(b => {                
                      let empty = document.getElementById(b);                  
                      empty.innerHTML = "";                   
                });
                
                name.shipPlace(ships[Number(c.id[9]-1)], nCoo, "vertical", "test", c.id, title);
                coordinates[c.id].blocks.forEach(c => {
                  usedCoo.push(c);
                });
                nCoo.forEach(n => {
                  usedCoo.push(n);
                });
                marksReDo();                              
              } else {
                blocks.forEach(b => {                 
                  let check = document.getElementById(b);
                  usedCoo.push(b);
                  if(check.innerHTML === "") {
                    let text = document.createElement("p");       
                    text.style.position = "absolute";            
                    text.innerHTML = "&#9679;";       
                    check.appendChild(text); 
                  };
                });
                oldCoo.forEach(o => {
                  usedCoo.push(o);
                });
              };              
            
              
            } else if (c.style.display === "grid") { 
              containerNr = c.id;              
              let goodToTurn = true;             
              let cooL = coordinates[c.id].coo.length;
              let nCoo =  [];
              for(let i = 0; i < cooL; i++) { 
                let res = coordinates[c.id].coo[0] + i;                
                if(res > 0 && res < 101){
                  nCoo.push(res);
                };               
              };
              
              let oldCoo = coordinates[c.id].coo;
              let blocks = coordinates[c.id].blocks;

              // remove ship coordinates from used
                oldCoo.forEach(s => {
                  for (let i = 0; usedCoo.length > i; i++) {
                    if(s === usedCoo[i]) {
                      usedCoo.splice(i, 1);
                    };
                  };               
                });
                // remove block coordinates from used
                blocks.forEach(b => {
                  for (let i = 0; usedCoo.length > i; i++) {                 
                    if(b === usedCoo[i]) {                    
                      usedCoo.splice(i, 1);                                     
                    };
                  };
                  let empty = document.getElementById(b);                  
                  empty.innerHTML = "";             
                });     
                marksReDo();  

                // check if any of the new coordinates are the same as used coordinates
                for (let i = 0; nCoo.length > i; i++) {                  
                  usedCoo.forEach(u => {                    
                    if(nCoo[i] === u) {                      
                      goodToTurn = false;
                    };
                  });
                };
                   
              const repos = () => {  
                let name;
                if (title === "player1") {
                  name = player1Board;
                } else {
                  name = player2Board;
                };                      
                coordinates[c.id].coo = nCoo;
                position = "horizontal";
                coordinates[c.id].position = position;
                c.style.display = "flex";
                blocks.forEach(b => {                
                  let empty = document.getElementById(b);                  
                  empty.innerHTML = "";                  
                });
               
                name.shipPlace(ships[Number(c.id[9]-1)], nCoo, "horizontal", "test", c.id, title);
                coordinates[c.id].blocks.forEach(c => {
                  usedCoo.push(c);
                });
                nCoo.forEach(n => {
                  usedCoo.push(n)
                });
                marksReDo();                              
              };      
              if(nCoo.length === cooL &&
                 ((nCoo[0]-1).toString())[1] <= 10 - ships[containerNr[9]-1]
                 && goodToTurn === true) {                             
                repos();
              } else if (nCoo[0] < 10 && nCoo.length === cooL && ((nCoo[0]-1).toString())[0] <= 10 - ships[containerNr[9]-1]
                && goodToTurn === true) {                 
                repos();
              } else {
                blocks.forEach(b => {
                  let check = document.getElementById(b);
                  usedCoo.push(b);
                  if(check.innerHTML === "") {                    
                    let text = document.createElement("p");       
                    text.style.position = "absolute";            
                    text.innerHTML = "&#9679;";       
                    check.appendChild(text); 
                  };
                });
                oldCoo.forEach(o => {
                  usedCoo.push(o);
                })
              };             
            }; 
                    
          });        
      });
     
      //  squares drag events      
      dragTo.forEach(sq => {        
        sq.addEventListener("dragover", e => {
          e.preventDefault();            
        });
        
        const enterDrag = (sq) => {
          prevSq = sq.id;
          if (position === "horizontal") {
            if (containerNr === "container1") {
            sqColor.push([Number(sq.id)-2, Number(sq.id)-1, Number(sq.id), Number(sq.id)+1].filter(x => x>0 && x < 101));
            } else if (containerNr === "container2") {
              sqColor.push([Number(sq.id)-1, Number(sq.id), Number(sq.id)+1].filter(x => x>0 && x < 101));
            } else if (containerNr === "container3") {
              sqColor.push([Number(sq.id)-1, Number(sq.id)].filter(x => x>0 && x < 101));
            } else if (containerNr === "container4") {
              sqColor.push([Number(sq.id)].filter(x => x>0 && x < 101));
            };
          } else if (position === "vertical") {
            if (containerNr === "container1") {
              sqColor.push([Number(sq.id)-20, Number(sq.id)-10, Number(sq.id), Number(sq.id)+10].filter(x => x>0 && x < 101));
              } else if (containerNr === "container2") {
                sqColor.push([Number(sq.id)-10, Number(sq.id), Number(sq.id)+10].filter(x => x>0 && x < 101));
              } else if (containerNr === "container3") {
                sqColor.push([Number(sq.id)-10, Number(sq.id)].filter(x => x>0 && x < 101));
              } else if (containerNr === "container4") {
                sqColor.push([Number(sq.id)].filter(x => x>0 && x < 101));
              };
          };           
          
          clean();      
        };

        sq.addEventListener("dragenter", e => {
          e.preventDefault();
          enterDrag(sq);          
        });

        const clean = () => {
          for (let i = 0; sqColor.length -1 > i; i++){
            sqColor[i].forEach(n => {
              document.getElementById(Number(n)).className = "square";
            });
            sqColor.shift();
          };
        };
       
        sq.addEventListener("dragleave", (e) => { 
          const sqFill = () => {
            validPlace = true;
            sqColor.forEach(squ => {
              squ.forEach(n => {
                document.getElementById(n).className += " hoveredSq";
              });            
            });
          };
          if(position === "horizontal") {          
            if(nr1() != 0 && nr1() != 9 && nr2() != 1 && nr2() != 2 
            && sqColor[0][0] > 0 && (sqColor[0].length >= 4 || containerNr == "container2")) {            
              sqFill ();
            } else if(nr1() != 0 && nr2() != 1 && containerNr == "container3"){
              sqFill();           
            } else if(containerNr == "container4") {
              sqFill();           
            } else {            
              sqColor.forEach(squ => {
                squ.forEach(n => {
                  document.getElementById(n).className = "square";
                });            
              });
              validPlace = false;
            };
          } else if (position === "vertical") {                   
            if (sqColor[0].length == ships[containerNr[9]-1]) {              
              sqFill();  
            } else {
              validPlace =false;
            };                       
          } else {
            validPlace =false;
          };
        });
        const dropDrag = (sq) => {
          let containerCoo= []; 
          let sqSt;
          let sqF;           
          let ship;           
          if (containerNr === "container1") {
            sqSt= -2;  
            sqF = 2; 
          } else if (containerNr === "container2"){
            sqSt= -1;
            sqF = 2;
          } else if (containerNr === "container3" ){
            sqSt= -1;
            sqF = 1;
          } else if (containerNr === "container4") {
            sqSt = 0;
            sqF = 1;
          };

          if (position === "horizontal") {           
            for (let i = sqSt; i< sqF; i++) {                
                containerCoo.push((Number(sq.id))+Number([i]));                
            }; 
          } else if (position === "vertical") {            
            for (let i = sqSt; i< sqF; i++) {                
              containerCoo.push((Number(sq.id)) + Number([i])*10);                
            }; 
          };           

          //check if ship coordinates matches already occupied coordinates
          containerCoo.forEach(con => {
            for (let i = 0; usedCoo.length > i; i++) {
              if(con === usedCoo[i]) {
                validPlace = false;
              };
            };
          });

          // if the coordinates are unoccupied add ship to the board and push coordinates to occupied
          if (validPlace === true) {
            containerCoo.forEach(con => {
              usedCoo.push(con);
            });
          };

          if (validPlace != false) { 
            outOfSq = false;                  
            const createCopy = () => {
              let movable = document.getElementById(containerNr);
              clone= movable.cloneNode(true);           
              if (containerNr === "container1") {
                clone.id = `${movable.id}-${copyCounter.container1}`;
                clone.className = "container1";
                copyCounter.container1 += 1;                
                containerNr = "container1";
                containerId = clone.id;
                copies.push(clone);
              } else if (containerNr === "container2") {
                clone.id = `${movable.id}-${copyCounter.container2}`;
                clone.className = "container2";
                copyCounter.container2 += 1;               
                containerNr = "container2";
                containerId = clone.id;
                copies.push(clone);
              } else if (containerNr === "container3") {
                clone.id = `${movable.id}-${copyCounter.container3}`;
                clone.className = "container3";
                copyCounter.container3 += 1;                
                containerNr = "container3";
                containerId = clone.id;
                copies.push(clone);
              } else if (containerNr === "container4") {
                clone.id = `${movable.id}-${copyCounter.container4}`;
                clone.className = "container4";
                copyCounter.container4 += 1;                
                containerNr = "container4";
                containerId = clone.id;
                copies.push(clone);
              };        
            };

            if(goodToCopy === true) {          
              if (copyCounter.container1 < 1 && containerNr === "container1" 
              || copyCounter.container2 < 2 && containerNr === "container2"
              || copyCounter.container3 < 3 && containerNr === "container3"
              || copyCounter.container4 < 4 && containerNr === "container4") {
                createCopy();            
              };
              amounts[containerNr] -= 1;
              changeNum(containerNr[9]);

              if (amounts[containerNr] <= 0) {
                document.getElementById(containerNr).draggable = false;
              };
            }; 
            
            //when all the ship are placed the start game button is activated
            const activateStartGame = (() => {
              let counter = 0;
              Object.keys(amounts).forEach(o => {
                if (amounts[o] <= 0) {
                  counter += 1;
                };
              });              
              if (counter === 4) {
                let startBtn = document.getElementById("start-button");
                startBtn.disabled = false;
                startBtn.style.opacity = "1";
              };              
            })();
            
            
            if (goodToCopy === true) {              
              updateList(copies[copies.length - 1]);              
              ship = clone;
            } else {
              ship = document.getElementById(containerId);              
            }
            ship.style.position = "absolute";
            ship.style.zIndex = "9";   
            let shipId = ship.id;
            

            if (position === "horizontal") {
              if(containerNr === "container1") {               
                document.getElementById(sq.id-2).append(ship);                               
              } else if (containerNr === "container2" || containerNr == "container3"){                 
                document.getElementById(sq.id-1).append(ship);                        
              } else if (containerNr === "container4") {
                document.getElementById(sq.id).append(ship);               
              };              
            } else if (position === "vertical") {
              if(containerNr === "container1") {
                document.getElementById(Number(sq.id) - 20).append(ship);              
              } else if (containerNr === "container2" || containerNr === "container3") {
                document.getElementById(Number(sq.id) - 10).append(ship);
              } else if(containerNr === "container4") {
                document.getElementById(Number(sq.id)).append(ship);
              };              
            };           
            
            if (goodToCopy === true) {
              coordinates[shipId] = {};  
              coordinates[shipId].position = "horizontal";              
            };            
            coordinates[shipId].coo = containerCoo;
            let name;
            if (title === "player1") {
              name = player1Board;
            } else {
              name = player2Board;
            };
            name.shipPlace(ships[Number(containerNr[9]-1)], containerCoo, coordinates[shipId].position, "test", shipId, title);            
            
           // add blocked coordinates to used coordinates                       
            coordinates[shipId].blocks.forEach(c => {              
              usedCoo.push(c);
            });

            goodToCopy = false; 

          };
        }; 

        sq.addEventListener("drop", e => {
          e.preventDefault();        
          dropDrag(sq);        
        });       
      });  
      //end drag event 
      
      

      return {coordinates, resetPlayer}
     }   
    })();
  
  
  return {enemy, randomShipPlacement, addPlayer, placeShips, mode, shoot}  
};

let player1;
let player2;


const gameFlow = (() => {
  let allCoo;
  let shots;
  let gameStart = false;
  let turn = "player1";
  let AI = false;
  let manualPlacement = true;

  const removeAICoo = (coo) => {
    let length = allCoo.length;     
      coo.forEach(c => {        
        for(let i = 0; length > i; i++){                         
          if(allCoo[i] == c) {           
            allCoo.splice(i, 1);          
          };
        };
      });    
  };
  const player1Choice = () => {
    player1 = player("player1");
  };
  const player2Choice = () => {
    player2 = player("player2");
  };
  const player2ChoiceAI = () => {
    player2 = player("AI");
  };

  //navbar buttons
  const PVC = document.getElementById("PVC"); 
  const frontPage = document.getElementById("front-page");
  const backMenu = document.getElementById("return-button");
  const randomPlace = document.getElementById("random-button");
  const clearBoard = document.getElementById("clear-button");
  const startGame = document.getElementById("start-button");
  startGame.disabled = true;
  const backMainMenu = document.getElementById("returnMenuB");

  // methods for buttons
  const zeroChoices = () => {    
    for(let i = 1; i <= 4; i++){      
      let change = document.getElementById(`text${i}`);
      change.innerHTML = `\u2715  0`;
      let noDrag = document.getElementById(`container${i}`);      
      noDrag.draggable = false;
    };
  };
  const allChoices = () => {
    for(let i = 1; i <= 4; i++){    
      let change = document.getElementById(`text${i}`);
      change.innerHTML = `\u2715  ${i}`;
      let noDrag = document.getElementById(`container${i}`);      
      noDrag.draggable = true;
    };
  };
  const resetBoard = (GO) => {
    if (GO) {
      player1.addPlayer.player1Board.resetBoard(); 
      player2.addPlayer.player2Board.resetBoard();         
    } else  if (turn === "player2") {
      player2.addPlayer.player2Board.resetBoard();       
    } else if (turn === "player1") {      
      player1.addPlayer.player1Board.resetBoard();      
    };  
  };
  const randomShips = () => {
    if (turn === "player1") {     
      player1.randomShipPlacement();
    } else  if (turn === "player2") {      
      player2.randomShipPlacement();
    };    
  };
  const resetPlayer = (GO) => {
    if (GO) {      
      if(AI === false){
        player2.placeShips.resetPlayer();  
      };           
      player1.placeShips.resetPlayer();       
    } else  if (turn === "player2" && !GO && AI === false) {      
      player2.placeShips.resetPlayer();
    } else if (turn === "player1" && !GO) {      
      player1.placeShips.resetPlayer();      
    };    
  };  
  const addManualShips = (who) => {
    let board;
    let player = (()=> {
      if (who === "player1") {
        board = player1.addPlayer.player1Board;
        return player1;
      } else {
        board = player2.addPlayer.player2Board;
        return player2;
      };
    })();   
    let allShips =  player.placeShips.coordinates;   
    for (let i = 0; Object.keys(allShips).length > i; i++) {
      let ship = allShips[Object.keys(allShips)[i]];
      let position = ship.position;
      let coor = ship.coo;
      let length = coor.length;
      board.shipPlace(length, coor, position);      
    };
    removeManualShadows(board);    
  };
  const removeManualShadows = (board) => {
    let coo = allCoo;     
    coo.forEach(c => {
      let sq = document.getElementById(c);
      if (sq.hasChildNodes()){              
        let length = sq.children.length;
        for(let i = 0; length > i; i++){          
          sq.removeChild(sq.children[0]);
        };      
      };      
    });
  };
  const gameOver = (pl) => {
    let place = document.getElementById("who-won");
    let text = (() => {
      if (AI === true && pl === "player1") {
        return "AI<br>WINS!!!";
      } else if (AI === true && pl === "AI") {
        return "YOU<br>WIN!!!";
      } else if (AI === false && pl === "player1"){
        return "PLAYER2<br>WINS!!!";
      } else if (AI === false && pl === "player2"){
        return "PLAYER1<br>WINS!!!";
      }
    })();
    place.style.fontFamily = "Silkscreen, Alkalami, serif";
    place.innerHTML = text;    
  };
  const videoOpacityAni = (page, page2, removeTemp, ifSlide) => {
    let hideTemp;
    if(removeTemp) {
      hideTemp = document.getElementById(removeTemp);
      hideTemp.style.display = "none";
    };    
    const disappear = [{opacity: "1"}, {opacity: "0"}];
    const appear = [{opacity: "0"}, {opacity: "1"}];
    const pagedisapp = document.getElementById(page);    
    const pageSplitTiming = {duration: 1000, iterations: 1,};
    
    if(page2){     
      const pageapp = document.getElementById(page2); 
      pageapp.animate(appear, pageSplitTiming);
      pageapp.style.display = "grid";
      if(ifSlide) {
        const pageNewT = [{transform: 'translateY(0)'}, 
        {transform: 'translateY(-70%)'}];
        pageapp.animate(pageNewT, pageSplitTiming)
      }     
    };   
    pagedisapp.animate(disappear, pageSplitTiming);    
    setTimeout(() => {
      pagedisapp.style.display = "none"; 
      if(removeTemp){
        hideTemp.style.display = "";
      };     
    }, "1000");
  };
  // const pageMoveAni = (page, page2) => {
  //   const pageOldT = [{transform: 'translateY(0)'}, 
  //   {transform: 'translateY(-100%)'}];
  //   const pageNewT = [{transform: 'translateY(100%)'}, 
  //   {transform: 'translateY(0)'}];
  //   const pageSplitTiming = {duration: 1000, iterations: 1,};
  //   let pageOld = document.getElementById(page);
  //   let pageNew = document.getElementById(page2);    
  //   pageOld.animate(pageOldT, pageSplitTiming);
  //   pageNew.animate(pageNewT, pageSplitTiming);
  //   setTimeout(() => {
  //     pageOld.style.display = "none";        
  //   }, "1000");
  // };
  //click events
  PVC.addEventListener("click", () => {    
    if(!player1){
      player1Choice();
    };       
    AI = true; 
    turn = "player1";    
    videoOpacityAni("front-page");   
  });
  backMenu.addEventListener("click", () => {
    frontPage.style.display = ""; 
    resetBoard();
    resetPlayer(); 
    allChoices(); 
    manualPlacement = true;
    startGame.disabled = true;
    startGame.style.opacity = "0.2";
  });
  randomPlace.addEventListener("click", () => { 
    resetBoard();    
    zeroChoices();
    randomShips();  
    manualPlacement= false; 
    startGame.disabled = false;
    startGame.style.opacity = "1";  
  });  
  clearBoard.addEventListener("click", () => {    
    resetBoard(); 
    allChoices();
    resetPlayer();
    manualPlacement = true;
    startGame.disabled = true;
    startGame.style.opacity = "0.2";
  });
  startGame.addEventListener("click", () => {     
    turn = "player2";
    // document.getElementById("ships-and-navigation").style.display = "none";
    // document.getElementById("board-w-coor2").style.display = "grid";
    if(AI === true) {      
      if(!player2){
        player2ChoiceAI();
        allCoo = player1.addPlayer.player1Board.allCoo;  
      }; 
      randomShips("AI");       
    };    
    player2.mode = "war";
    player1.mode = "peace";    
    turn = "player1";  
    gameStart = true;     
    if (manualPlacement === true) {
      if (AI === true) {
        addManualShips("player1");        
      };       
    }; 
    // document.querySelector("#body-battle-ship").style.height = "100%";  
    videoOpacityAni("ships-and-navigation", "board-w-coor2","", true);
    // document.getElementById("board-w-coor2").style.position = "absolute";   
    document.getElementById("board-w-coor").animate([{opacity: "1"}, {opacity: "0.5"}], 1000);
    document.getElementById("board-w-coor").style.opacity = "0.5";
  });
  backMainMenu.addEventListener("click", () => {
    frontPage.style.display = ""; 
    resetBoard("GO");
    resetPlayer("GO"); 
    allChoices(); 
    manualPlacement = true;
    startGame.disabled = true;
    startGame.style.opacity = "0.2";
    // document.getElementById("victory-msg").style.display = "none";
    document.getElementById("ships-and-navigation").style.display = "flex";
    document.getElementById("board-w-coor2").style.display = "none";
    document.getElementById("board-w-coor").style.opacity = "1";
    allCoo = (() => {      
      let result = [];
      for(let i = 1; 101 > i; i++) {
        result.push(i);      
      };      
      gameFlow.allCoo = result;
      // document.querySelector("#body-battle-ship").style.height = "100%";      
      return result;
    })(); 
    // pageMoveAni("victory-msg", "front-page");  
    // document.getElementById("user-ship-placement").style.display = "none";
    videoOpacityAni("victory-msg", "front-page", "user-ship-placement");
    // document.getElementById("user-ship-placement").style.display = "";
    frontPage.style.display = "";    
  });

  //take turns to shoot  
  let turnPl = () => {   
    if (gameStart === true) {        
      if (player2.addPlayer.player2Board.hit === false) {
        turn = "player1";
        player2.mode = "peace";
        player1.mode = "war";
        player2.addPlayer.player2Board.hit = "";
        if(AI === true) {
          setTimeout(() => {
            moveAI();  
          }, "300");          
        };
      } else if (player1.addPlayer.player1Board.hit === false) {
        turn = "player2";
        player1.mode = "peace";
        player2.mode = "war";
        player1.addPlayer.player1Board.hit = "";        
        shots = player1.addPlayer.player1Board.shots;        
      } else if (player2.addPlayer.player2Board.hit === true) {
        turn = "player1";
        player2.mode = "war";
        player1.mode = "peace";
        player1.addPlayer.player1Board.hit = "";
      } else {
        if(AI === true) {
          setTimeout(() => {
            moveAI();    
          }, "300");          
        };
      };
    };   
  };  
  

  const moveAI = () => {       
      let length = allCoo.length;
      let randomNum = Math.round(Math.random() * (length - 1)); 
      if (length > 0) {
        player1.shoot().markShot(document.getElementById(allCoo[randomNum]));
      };     
  };
  
 return {turnPl, removeAICoo, gameOver, allCoo};
})();

// document.getElementById("who-won").innerHTML = "PLAYER2<br>win!!"
