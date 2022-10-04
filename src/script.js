// const parse = require("./style.css");
// import sheet from './style.css' assert { type: 'css' };

// construct new ship
const shipFactory = (coor, blSq) => {
  let shipCoor = coor;
  let hit = [];
  let sunk = false;
  let sunkBl = blSq;
  for(let i = 0; shipCoor.length > i; i++){
    let colorShip = document.getElementById(coor[i]);
    colorShip.style.backgroundColor = "green";
  }
  return {shipCoor, hit, sunk, sunkBl} 
};

// make and update the game board for player
const gameBoard = () => {
  
  // create a board on the screen;
  const screenBoard = () => {
  let container = document.getElementById("place-board");
  container.style.gridTemplateColumns = "repeat(10, auto)";
    for (let i = 1; i <= 10*10; i++) {    
      let square = container.appendChild(document.createElement("div"));
      square.id = i;
      square.className = "square";
      square.style.border = "thin solid black";
    };
  };  

  //player`s ships and information
  let ships = [];
  const createShip = (coor, blSq) => {
    ships.push(shipFactory(coor, blSq));
  };

  //all missed attacks
  const missedAttack = [];

  //receive enemy attack and check if the ship was hit or it was a missed attack
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

          // background color of sunken ship
          for(let j = 0; ship.shipCoor.length > j; j++) {
            document.getElementById(ship.shipCoor[j]).style.backgroundColor = "green";
          };

          // mark squares around sunken ship
          for(let i = 0; ship.sunkBl.length > i; i++) {            
            let sq = document.getElementById(ship.sunkBl[i])
            if (!sq.hasChildNodes()) {
              let text = document.createElement("p");
              sq.appendChild(text);
              text.style.position = "absolute";            
              text.innerHTML = "&#9679;";
            }            
          }
        }; 
      };
    };
    for (let i = 0; ships.length > i; i++) {
      checkShips(ships[i]);
    };
    if(shipHit === false) {
      missedAttack.push(shot)
      return "missed"
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
      }
  };
  
// place ships on the board randomly and manually
  const shipPlace = (length, coord, pos, test, shipId) => { 
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
        } 
        
      })();

      //if random choice and the coordinates are not available rerun the function
      if (availability.length === length){
        return availability;
      } else {
        return shipCoo();
      }      
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
      // if(test) {
        blockAvail.forEach(bl => { 
        let text = document.createElement("p");       
        text.style.position = "absolute";            
        text.innerHTML = "&#9679;";       
        document.getElementById(bl).appendChild(text);       
        });
      // }; 
      if (test != "test") {
        removeCoo(blockAvail);
      };     
      return blockAvail;
    })();

    // construct the ships with given coordinates
    if (!test) {
      const constructShip = (() => {    
      createShip(coo, blockSq);          
      })();    
    };
    if(test != "test") {
      removeCoo(coo); 
    };     
    player1.placeShips.coordinates[shipId].blocks = blockSq;    
  };   


  return {allCoo, createShip, receiveAttack, ships, missedAttack, screenBoard, shipPlace};
};

// create a new player
const player = (name, mode) => {
  let title = name;
  let enemy = name;
  
  // add player board
  const addPlayer = (() => {  
    name = gameBoard();
    const screen = name.screenBoard(); 
    return {name};
  })();


  //random ship placement
  const randomShipPlacement = () => {
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
    console.log(name.ships);
  };  

// shoot the enemy 
  if (mode === "war") {
    const shoot = (() => {
      let square = document.querySelectorAll(".square"); 
      square.forEach(sq => {
        sq.addEventListener("click", () => {      
          if (!sq.hasChildNodes()) {
            let shot = name.receiveAttack(Number(sq.id));
            let text = document.createElement("p");           
            sq.appendChild(text);
            text.style.position = "absolute";
            if(shot === "missed" && text){
              text.innerHTML = "&#x2716;";
            } else {
              text.innerHTML = "&#x274C;";
              text.style.fontSize = "150%"
            };  
          };      
        });
      });
    })();
  };
  
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
      }
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
        shipContainers.push(shipContainer)
        // let text = ` \u2715 ${amounts[`container${i}`]}`;
        shipContainer.id = `container${i}`;
        shipContainer.className = `container${i}`;
        numtext = document.getElementById(`choice${i}`).appendChild(document.createElement("p"));
        numtext.id = `text${i}`
        numtext.innerHTML = ` \u2715 ${amounts[`container${i}`]}`
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
        change.innerHTML = `\u2715  ${num}`
        console.log(amounts)
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
      shipContainers.forEach(container => {       
        container.draggable ="true";     
        container.addEventListener("dragstart", () => {         
          containerNr = container.className;  
          containerId = container.id;          
          if(!container.id[10]) {
            goodToCopy = true;
          }; 
          position = "horizontal";           
        });

        container.addEventListener("dragend", () => {
          console.log("end")
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
          let check = coordinates[Object.keys(coordinates)[i]].blocks
          console.log(i)
          console.log(containerId)
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
                };
              });
              
              // check if any of the new coordinates are the same as used coordinates
              for (let i = 0; nCoo.length > i; i++) {
                usedCoo.forEach(u => {
                  if(nCoo[i] === u) {
                    goodToTurn = false;
                  };
                });
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
                name.shipPlace(ships[Number(c.id[9]-1)], nCoo, "vertical", "test", c.id);
                coordinates[c.id].blocks.forEach(c => {
                  usedCoo.push(c);
                });
                nCoo.forEach(n => {
                  usedCoo.push(n)
                });
                marksReDo();
                console.log(blocks)                
              } else {
                blocks.forEach(b => {
                  usedCoo.push(b);
                });
                oldCoo.forEach(o => {
                  usedCoo.push(o);
                })
              };
              
              
              
            } else if (c.style.display === "grid") { 
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
                });
                
                // check if any of the new coordinates are the same as used coordinates
                for (let i = 0; nCoo.length > i; i++) {
                  usedCoo.forEach(u => {
                    if(nCoo[i] === u) {
                      goodToTurn = false;
                    };
                  });
                };
                   
              const repos = () => {               
                coordinates[c.id].coo = nCoo;
                position = "horizontal";
                coordinates[c.id].position = position;
                c.style.display = "flex";

                blocks.forEach(b => {                
                  let empty = document.getElementById(b);                  
                  empty.innerHTML = "";                   
                });
                name.shipPlace(ships[Number(c.id[9]-1)], nCoo, "horizontal", "test", c.id);
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
                  usedCoo.push(b);
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
        
        sq.addEventListener("dragenter", e => {
          e.preventDefault();
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
          // if (position === "horizontal") {      
          // if(Number(prevSq) === Number(sq.id)-10) {            
          //   sqColor[0].forEach(squ => {
          //     if (Number(squ)+10 <101) {
          //       document.getElementById(Number(squ)+10).className = "square";
          //     };
          //   });            
          // } else if(Number(prevSq) === Number(sq.id) + 10) {
          //   sqColor[0].forEach(squ => {
          //     if(Number(squ)-10 > 0) {
          //       document.getElementById(Number(squ)-10).className = "square";
          //     };
          //   });
          // } else if(Number(prevSq) === Number(sq.id)+9) {
          //   sqColor[0].forEach(squ => {
          //     document.getElementById(Number(squ)-9).className = "square";
          //   });
          // } else if(Number(prevSq) === Number(sq.id)-9) {
          //   sqColor[0].forEach(squ => {
          //     document.getElementById(Number(squ)+9).className = "square";
          //   });
          // } else if(Number(prevSq) === Number(sq.id)+11) {
          //   sqColor[0].forEach(squ => {
          //     document.getElementById(Number(squ)-11).className = "square";
          //   });
          // } else if(Number(prevSq) === Number(sq.id)-11) {            
          //   sqColor[0].forEach(squ => {
          //     document.getElementById(Number(squ)+11).className = "square";
          //   });
          // } else if(Number(prevSq) === Number(sq.id)-1) {           
          //   if (containerNr === "container1" || containerNr === "container2") {              
          //     if(sqColor[0][sqColor[0].length-1]+1 < 101 && sqColor[0][sqColor[0].length-1] < 101) {
          //       document.getElementById(sqColor[0][sqColor[0].length-1]+1).className = "square";
          //       document.getElementById(sqColor[0][sqColor[0].length-1]).className += " hoveredSq";
          //     };
          //     if (sqColor[0][sqColor[0].length-1]-1 > 0 && sqColor[0][sqColor[0].length-1]-2 > 0) {
          //       document.getElementById(sqColor[0][sqColor[0].length-1]-1).className += " hoveredSq";
          //       document.getElementById(sqColor[0][sqColor[0].length-1]-2).className += " hoveredSq";
          //     };
          //   };
          //   if (containerNr === "container3" || containerNr === "container4") {
          //     document.getElementById(sqColor[0][sqColor[0].length-1]+1).className = "square";
          //     document.getElementById(sqColor[0][sqColor[0].length-1]).className += " hoveredSq";
          //   };            
          // } else if (Number(prevSq) === Number(sq.id)+1) {            
          //   if (containerNr === "container1" || containerNr === "container2") {   
          //     if(sqColor[0][0]-1 > 0 && sqColor[0][0]+2 <101){
          //     document.getElementById(sqColor[0][0]-1).className = "square";
          //     document.getElementById(sqColor[0][0]+2).className += " hoveredSq";
          //     document.getElementById(sqColor[0][0]+1).className += " hoveredSq";
          //     document.getElementById(sqColor[0][0]).className += " hoveredSq";
          //     };
          //   }; 
          //   if (containerNr === "container3" || containerNr === "container4") {
          //     document.getElementById(sqColor[0][0]).className += " hoveredSq";
          //     if (sqColor[0][0]+2 < 101){
          //       document.getElementById(sqColor[0][0]+2).className = "square";
          //     };
          //   };
          // } else {            
          //   sqColor[0].forEach(squ => {
          //     document.getElementById(Number(squ)).className = "square";
          //   });
          // };      
          // } else if (position === "vertical") {

          // };

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

        sq.addEventListener("drop", e => {
          e.preventDefault();        
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
            name.shipPlace(ships[Number(containerNr[9]-1)], containerCoo, coordinates[shipId].position, "test", shipId);            
            
           // add blocked coordinates to used coordinates                    
            coordinates[shipId].blocks.forEach(c => {
              usedCoo.push(c);
            });

            goodToCopy = false; 

          };
        });       
      });  
      //end drag event 
      
      

      return {coordinates}
     }   
    })();
  
  
  return {enemy, randomShipPlacement, addPlayer, placeShips}  
};

// player("AI");
const player1 = player("player1");
// player1.randomShipPlacement();

