








var socket;


{
var startTime;
var waterTimer;
var quitTimer;
var time = [0, 0, 0];
var topText = "hey";
var seasonNames = ["Autumn", "Winter", "Spring", "Summer"];
var season = 0;
var previousSeason = 0;
var raining = false;
var rainChance = 40;
var hour1;
var minute1;

{
//stuff about the town
var population = 100;
var rate = 330;
var tankCap = 100000;
var water = 50000;

//well stuff
var wells = 1;
var wellDriver = [];
var wellWater = 0;
var wellTankCap = 4000;
var wellRate = 21875;

//is there a rainCatcher on all buildings
var rainCatcher = false;
var rainWater = 0;
var rainRate = 7500;//FIX
var rainDriver = [];
var rainTankCap = 1500;

//filtration facility to filter river water
var filtration  = false;
var lakePipes = 0;
var plantDriver = [];
var plantRate = 30000; //FIX
var plantWater = 0;
var plantTankCap = 5000;
//inspector must be hired every so often or else the filtration plant stops working
var inspectionDays = 0;

//ways to reduce water
var toilets = false;
var shower = false;
var psa1 = 0;
var psa2 = 0;
var previousDay = 0;
}

{
//shop buttons
//0-4 is selection, water production, water tanks, workers, water reduction
var shopPage = 4;
var price = [[10000, 10000, 100000, 25000],
             [10000, 3500, 2000, 5000],
             [5000, 5000, 5000, 1500],
             [10000, 10000, 2000, 2000]]; //FIX PRICES
var sellOption = [[true, false, false, true],
                  [true, true, true, true],
                  [true, true, true, false],
                  [false, false, false, false]];
var priceWords = [["$10000\n\n$5000", "$10000", "$100000", "$25000\n\n$12500"],
                  ["$10000\n\n$5000", "$3500\n\n$1750", "$2000\n\n$1000", "$5000\n\n$2500"],
                  ["$4000\n\n$2000", "$3000\n\n$1500", "$5000\n\n$2500", "$1500\nDays until \nnext required \ninspection: " + inspectionDays],
                  ["$10000", "$10000", "$2000\nDays until \nPSA effects \nwear off: " + psa1, "$2000\nDays until \nPSA effects \nwear off: " + psa2]];
var shopWords = [["Build\nWell", "Install\nRain\nCatcher", "Build\nWater\nFiltration\nPlant", "Build\nLake\nPipe"], 
                 ["Expand\nTown\nTank", "Expand\nWell\nTank", "Expand\nRain\nCatcher\nTank", "Expand\nFiltration\nPlant\nTank"],
                 ["Hire\nWell\nDriver", "Hire\nRain\nCatcher\nDriver", "Hire\nFiltration\nPlant\nDriver", "Hire\nFiltration\nPlant\nInspector"], 
                 ["Install\nEfficient\nToilets\n& Taps", "Install\nEfficient\nShowers\n& Hoses", "PSA:\nTurning\nOff Taps", "PSA:\nEfficient\nWater Use"],
                 ["Water\nProduction", "Water\nTanks", "Workers", "Water\nReduction"]];

var userName = "";
var selected = false;
var displayBoard = false;
var submit = false;
var scoreBoard = [[]];

//variables for images
var logo;
var lake;
var factory = [];
var filterPipes;
var tanks = [];
var plantPipes = [[], []];
var wellImg = [];
var wellPipe = [];
var trucks = [];
var house = [];
var rainPipe = [];
}

//rain
var rainDrops = [[365, 701], [265, 701], [300, 701], [400, 701], [500, 701], [600, 701], [700, 701], [800, 701], [900, 701], [1000, 701], [1100, 701],
            [1200, 701], [1300, 701], [486, 701], [590, 701], [979, 701], [350, 701], [450, 701], [550, 701], [650, 701], [750, 701], [850, 701],
            [950, 701], [1050, 701], [1150, 701], [1250, 701], [1350, 701], [1365, 701], [1215, 701], [883, 701], [325, 701], [425, 701], [525, 701],
            [625, 701], [725, 701], [825, 701], [925, 701], [1025, 701], [1125, 701], [1225, 701], [1325, 701], [292, 701], [390, 701], [275, 701],
            [375, 701], [475, 701], [575, 701], [675, 701], [775, 701], [875, 701], [975, 701], [1075, 701], [1175, 701], [1275, 701], [1375, 701]];
var rainSpeed = [12, 13, 14, 15, 16, 12, 13, 14, 15, 16, 12, 13, 14, 15, 16, 12, 13, 14, 15, 16, 12, 13, 14, 15, 16, 12, 13, 14, 15, 16, 
                 12, 13, 14, 15, 16, 12, 13, 14, 15, 16, 12, 13, 14, 15, 16, 12, 13, 14, 15, 16, 12, 13, 14, 15, 16];

//game state
var game = 0;
var info = 0;
var showInfo = false;
var seen = [[false, false, false, false],
            [false, false, false, false],
            [false, false, false, false],
            [false, false, false, false]];

var infoWords = ["Wells are a great way to get clean, fresh water.\nIn order to not deplete the aquifer, there is a limit\nto how many wells can be built in the same spot.\nThere is a maximum of 10 wells in this area.",
                 "Rain catchers are another good source of water.\nRain water is fresh, requiring minumum filtering\nYou will need a driver to deliver it though.",
                 "Lakes are an adundant source of water.\nKeep in mind that ecosystems can be harmed\nwithout enough water in the lake.\nYou will need to build pipes leading to the plant.\nYou will also need an inspection every 3 days.",
                 "In order to not disturb the lake's ecosystem,\na maximum of 3 pipes can be built.",
                 "In order to save enough water for the summer,\nyou might need a bigger tank\nto hold the town's water.",
                 "If your tank is full and the driver isn't there yet,\nyou might want a bigger tank to hold the water\nuntil your drivers reach the tank.",
                 "During the rainy season, you might need a larger\ntank to not waste water while your driver\nis still on their way to the tank.",
                 "Lakes provide a lot of water which might cause\nyour tanks to reach their threshhold. A larger\ntank will allow your drivers to catch up.",
                 "The more wells you have, the less a single\ndriver can keep up. Hire up to 6 drivers to ensure\nno water is wasted in the well tanks.",
                 "Rain water is free water, but you need a \ndriver to deliver it back to the towns tanks.\nDuring Spring, 1 driver might not be enough.",
                 "Lakes provide a lot of water, but you need\na driver to bring it back, especially when\nyou have multiples pipes.",
                 "The filtration plant needs to follow the rules.\nIt must be inspected every 3 days. No water\nwill be filtered until an inspector has been hired.",
                 "Toilets and taps are responsible for more\nwater usage than you expect. Installing more\nefficient toilets and taps goes\n a long way when reducing water usage.",
                 "Showerheads and hoses also use a lot of water.\nInstalling efficient showerheads\nand hoses will help reduce your usage.",
                 "Leaving the tap on while brushing your teeth\ncan result in a lot of water wasted. Turning off\ntaps whenever they aren't being used\nhelps to reduce usage.",
                 "The same amount of water is used no matter\nhow full a washing machine is. By always filling\n dishwashers and washing machines completely,\n you can maximize your water efficiency."];


var intro = ["Humans use a lot of water everyday. We get our water from Lake Ontario, but around the world, water can come from many places.\nWater comes from wells that tap into aquifers, rain water that slides of roofs, and lakes that must but filtered and treated.\nIn this town, you choose where you get your water from, but more water doesn't always solve the problem. Instead of having more,\nwhy not consider using less? As the mayor of this village, it is your job to find the right balance between producing enough \nwater and reducing usage. Your goal is to last as long as possible throughout the seasons before your water runs out. \nIn real life, the goal would be to find a sustainable balance where you never run out of water. ",
"The exact numbers are not completely accurate, but for the sake of gameplay, they have been altered.\nThe techniques used in the 'Water Reduction' tab are all great ways to reduce your water usage.\nIf you want to know more about sustainable water, visit the WorldVision website join the fight for\na sustainable earth where everyone has access to clean water."];

}

function mouseClicked() {
  if(game==0){
    game = 1;
    reset();
  }
  else if (game==1){
    if(showInfo){
      if(mouseX > 650 && mouseX < 750 && mouseY > 475 && mouseY < 525){
        showInfo = false;
      }
    }
    //checking if a shop button is clicked
    if(mouseX > 10 && mouseX < 240){
      for(let i=0; i<4; i++){
        if(mouseY > 120 + 130*i && mouseY < 240 + 130*i){
          //going into a different shop
          if(shopPage == 4){
            shopPage = i;
          }
          else{
            let thing = true;
            if(sellOption[shopPage][i] && mouseY > 180+130*i && mouseY < 240+130*i){
              thing = false
            }
            shopButton(i, thing);
          }
        }
      }
      if(mouseY > 630 && mouseY < 690){
        if(shopPage != 4){
          quitTimer = millis();
          shopPage = 4;
        }
        else if(millis()-quitTimer >1000){
          game = 2;
        }
      }
    }
  }
  else{
    if(mouseX > 600 && mouseX < 800 && mouseY > 250 && mouseY < 275){
      selected = true;
    }
    else{
      selected = false;
    }
    if(mouseX > 650 && mouseX < 750 && mouseY > 300 && mouseY < 350 && userName.length > 0){
      let output = {
        time: time,
        userName: userName
      }
      socket.emit('score', output);
      submit = true;
    }
    if(mouseX > 900 && mouseX < 1100 && mouseY > 600 && mouseY < 650){
      remove();
    }
    else if(mouseX > 300 &&  mouseX < 500 && mouseY > 600 && mouseY < 650){
      game = 0;
    }
  }
}
function keyPressed(){
  if(game==0){
    game = 1;
    reset();
  }
  if(selected){
    if((key.charCodeAt(0) > 96 && key.charCodeAt(0) < 123) || (key.charCodeAt(0) > 47 && key.charCodeAt(0) < 58) || key.charCodeAt(0) == 95){
      if(userName.length < 24){
        userName += key;
      }
    }
    else if(key.charCodeAt(0) == 66){
      userName = userName.substring(0, userName.length-1);
    }
  }

}

//function that does stuff if something in the shop is bought or sold
function shopButton(button, buy){
  console.log("Here");
  //buy is true if the object is being bought and false it its being sold
  if(buy){
    switch(shopPage){
      //water shop
      case 0:
        switch(button){
          //well
          case 0:
            if(wells < 10 && water > price[0][0]){
              if(!seen[0][0]){
                showInfo = true;
                info = 0;
                seen[0][0] = true;
              }
              
              wells++;
              water -= price[0][0];
              if(wells==10){
                priceWords[0][0] = "MAX\n\n$5000";
              }
            }
            break;
  
          //rain catcher
          case 1:
            if(!rainCatcher && water > price[0][1]){
              if(!seen[0][1]){
                showInfo = true;
                info = 1;
                seen[0][1] = true;
              }
              priceWords[0][1] = "Already\nInstalled";
              water -= price[0][1];
              rainCatcher = true;
            }
            
            break;
  
          //filtering plant
          case 2:
            if(!filtration && water > price[0][2]){
              if(!seen[0][2]){
                showInfo = true;
                info = 2;
                seen[0][2] = true;
              }
              priceWords[0][2] = "Already\nBuilt";
              water -= price[0][2];
              filtration = true;
            }
            break;
  
          //lake pipes
          case 3:
            if(filtration && lakePipes < 3 && water > price[0][3]){
              if(!seen[0][3]){
                showInfo = true;
                info = 3;
                seen[0][3] = true;
              }
              lakePipes++;
              water -= price[0][3];
              if(lakePipes==3){
                priceWords[0][3] = "MAX\n\n$12500";
              }
            }
            break;
        }
        break;
      
      //tank shop
      case 1:
        switch(button){
          //town tank
          case 0:
            if(tankCap < 600000 && water > price[1][0]){
              if(!seen[1][0]){
                showInfo = true;
                info = 4;
                seen[1][0] = true;
              }
              tankCap += 100000;
              water -= price[1][0];
              if(tankCap==600000){
                priceWords[1][0] = "MAX\n\n$5000";
              }
            }
            break;
          
          //well tank
          case 1:
            if(wells > 0 && wellTankCap < 20000 && water > price[1][1]){
              if(!seen[1][1]){
                showInfo = true;
                info = 5;
                seen[1][1] = true;
              }
              wellTankCap += 4000;
              water -= price[1][1];
              if(wellTankCap == 20000){
                priceWords[1][1] = "MAX\n\n$1750";
              }
            }
            break;
          
          //rain catcher tank
          case 2:
            if(rainCatcher && rainTankCap < 3000 && water > price[1][2]){
              if(!seen[1][2]){
                showInfo = true;
                info = 6;
                seen[1][2] = true;
              }
              rainTankCap += 1500;
              water -= price[1][2];
              if(rainTankCap == 3000){
                priceWords[1][2] = "MAX\n\n$1000";
              }
            }
            break;
        
          //filtering plant tank
          case 3:
            if(filtration && lakePipes > 0 && plantTankCap < 15000 && water > price[1][3]){
              if(!seen[1][3]){
                showInfo = true;
                info = 7;
                seen[1][3] = true;
              }
              plantTankCap += 5000;
              water -= price[1][3];
              if(plantTankCap==15000){
                priceWords[1][3] = "MAX\n\n$2500";
              }
            }
            break;
        }
        break;
  
      //worker shop  
      case 2:
        
        switch(button){
          //well driver
          case 0:
            if(wells > 0 && wellDriver.length < 6 && water > price[2][0]){
              if(!seen[2][0]){
                showInfo = true;
                info = 8;
                seen[2][0] = true;
              }
              population += 4;
              rate += 5;
              wellDriver.push(new Driver("Well", 5000));
              water -= price[2][0];
              if(wellDriver.length==6){
                priceWords[2][0] = "MAX\n\n$2000";
              }
            }
            break;
          
            //rain catcher driver
          case 1:
            if(rainCatcher && rainDriver.length < 2 && water > price[2][1]){
              if(!seen[2][1]){
                showInfo = true;
                info = 9;
                seen[2][1] = true;
              }
              population += 4;
              rate += 5;
              rainDriver.push(new Driver("Rain", 2000));
              water -= price[2][1];
              if(rainDriver.length==2){
                priceWords[2][1] = "MAX\n\n$1500";
              }
            }
            break;
          
          //filtering plant driver
          case 2:
            if(filtration && lakePipes > 0 && plantDriver.length < 4 && water > price[2][2]){
              if(!seen[2][2]){
                showInfo = true;
                info = 10;
                seen[2][2] = true;
              }
              population += 4;
              rate += 5;
              plantDriver.push(new Driver("Plant", 4500));
              water -= price[2][2];
              if(plantDriver.length==4){
                priceWords[2][2] = "MAX\n\n$2500";
              }
            }
            break;
          
            //filtering plant inspector
          case 3:
            if(filtration && water > price[2][3]){
              if(!seen[2][3]){
                showInfo = true;
                info = 11;
                seen[2][3] = true;
              }
              inspectionDays = 3;
              plantRate = 30000;
              water -= price[2][3];
              priceWords[2][3] = "$1500\nDays until \nnext required \ninspection: " + inspectionDays;
            }
            break;
        }
        break;
  
      //reduction shop
      case 3:
        switch(button){
          //installing efficient toilets and taps
          case 0:
            if(!toilets && water > price[3][0]){
              if(!seen[3][0]){
                showInfo = true;
                info = 12;
                seen[3][0] = true;
              }
              rate -= 20;
              toilets = true;
              water -= price[3][0];
              priceWords[3][0] = "Already\nInstalled";
            }
            break;

          //installing efficient showers and hoses
          case 1:
            if(!shower && water > price[3][1]){
              if(!seen[3][1]){
                showInfo = true;
                info = 13;
                seen[3][1] = true;
              }
              rate -= 25;
              shower = true;
              water -= price[3][1];
              priceWords[3][1] = "Already\nInstalled";
            }
            break;

          //psa about turning off taps
          case 2:
            if(psa1 != 3 && water > price[3][2]){
              if(!seen[3][2]){
                showInfo = true;
                info = 14;
                seen[3][2] = true;
              }
              rate -= 15;
              psa1 = 3;
              water -= price[3][2];
              priceWords[3][2] = "$2000\nDays until \nPSA effects \nwear off: " + psa1;
            }
            break;

          //psa about using water efficiently
          case 3:
            if(psa2 != 3 && water > price[3][3]){
              if(!seen[3][3]){
                showInfo = true;
                info = 15;
                seen[3][3] = true;
              }
              rate -= 9;
              psa2 = 3;
              water -= price[3][3];
              priceWords[3][3] = "$2000\nDays until \nPSA effects \nwear off: " + psa2;
            }
            break;
        }
        break;
  
    }
  }
  else{
    switch(shopPage){
      //water shop
      case 0:
        switch(button){
          //well
          case 0:
            if(wells > 0){
              wells--;
              water += 0.5*price[0][0];
              priceWords[0][0] = "$10000\n\n$5000";
            }
            break;
  
          //lake pipes
          case 3:
            if(lakePipes > 0){
              lakePipes--;
              water += 0.5*price[0][3];
              priceWords[0][3] = "$25000\n\n$12500";
            }
            break;
        }
        break;
      
      //tank shop
      case 1:
        switch(button){
          //town tank
          case 0:
            if(tankCap > 100000){
              tankCap -= 100000;
              water += 0.5*price[1][0];
              priceWords[1][0] = "$10000\n\n$5000";
            }
            break;
          
          //well tank
          case 1:
            if(wellTankCap > 4000 || (wellTankCap == 4000 && wells == 0)){
              wellTankCap -= 4000;
              water += 0.5*price[1][1];
              priceWords[1][1] = "$3500\n\n$1750";
            }
            break;
          
          //rain catcher tank
          case 2:
            if(rainCatcher && rainTankCap > 1500){
              rainTankCap -= 1500;
              water += 0.5*price[1][2];
              priceWords[1][2] = "$2000\n\n$1000";
            }
            break;
        
          //filtering plant tank
          case 3:
            if(filtration && plantTankCap > 5000){
              plantTankCap -= 5000;
              water += 0.5*price[1][2];
              priceWords[1][3] = "$5000\n\n$2500";
            }
            break;
        }
        break;
  
      //worker shop  
      case 2:
        switch(button){
          //well driver
          case 0:
            if( wellDriver.length > 0){
              population -= 4;
              rate -= 2;
              wellDriver.pop();
              water += 0.5*price[2][0];
              priceWords[2][0] = "$4000\n\n$2000";
            }
            break;
          
            //rain catcher driver
          case 1:
            if(rainCatcher && rainDriver.length > 0){
              population -= 4;
              rate -= 2;
              rainDriver.pop();
              water += 0.5*price[2][1];
              priceWords[2][1] = "$3000\n\n$1500";
            }
            break;
          
          //filtering plant driver
          case 2:
            if(filtration && plantDriver.length > 0){
              population -= 4;
              rate -= 2;
              plantDriver.pop();
              water += 0.5*price[2][2];
              priceWords[2][2] = "$5000\n\n$2500";
            }
            break;
          
        }
        break;
  
    }
  }
}

//function that updates the high scores board in the end screen
function updateBoard(input){
  if(submit){
    displayBoard = true;
  }
  scoreBoard = input;
  console.log(scoreBoard);
}

//function the resets all variables when starting or restarting the game
function reset(){
  quitTimer = millis();
  startTime = millis();
  waterTimer = millis();
  time[0] = 0;
  time[1] = 0;
  time[2] = 0;
  population = 100;
  rate = 330;
  tankCap = 100000;//FIX
  water = 50000;
  wells = 1;
  wellDriver = [];
  wellDriver.push(new Driver("Well", 1500, [400, 400]));
  wellWater = 0;
  wellTankCap = 4000;
  wellRate = 128*180;
  rainCatcher = false;
  rainWater = 0;
  rainDriver = [];
  rainTankCap = 1500;
  rainChance = 40;
  raining = false;
  filtration  = false;
  lakePipes = 0;
  plantDriver = [];
  plantWater = 0;
  plantTankCap = 5000;
  inspectionDays = 0;
  toilets = false;
  shower = false;
  psa1 = 0;
  psa2 = 0;
  shopPage = 4;
  displayBoard = false;
  submit = false;
  previousDay = 0;
  previousSeason = 0;
  userName = "";
  selected = false
  seen = [[false, false, false, false],
            [false, false, false, false],
            [false, false, false, false],
            [false, false, false, false]];
}

//function to display text in each inner shop button FIX
function displayText(i){
  fill(0);
  text(priceWords[shopPage][i], 175, 170 + 130*i);
}

//object for the the drivers
function Driver(jobTitle, tankCap){
  this.offset = millis()%15000;
  this.job = jobTitle;
  this.size = tankCap;
  this.tank = 0;
  this.addWater = function(water){
    this.tank += water;
  }
  this.getOffset = function(){
    return this.offset;
  }
  this.getWater = function(){
    return this.tank;
  }
  this.getCap = function(){
    return this.size;
  }
}

//function to make it rain or snowFIX
function rain(){
  strokeWeight(0);
  if(season == 1){
    fill(255);
    for(let i=0; i<55; i++){
      ellipse(rainDrops[i][0], rainDrops[i][1], 10, 10);
      rainDrops[i][1] += rainSpeed[i]/3;
      rainDrops[i][0] += Math.random()-0.5;
      if(rainDrops[i][1] > 701){
        rainDrops[i][1] = Math.random()*50-50;
        rainDrops[i][0] += Math.random()*100-50;
        rainSpeed[i] = Math.random()*5+15;
      }
      if(rainDrops[i][0] < 250 || rainDrops[i][0] > 1400){
        rainDrops[i][0] = Math.random()*1150+250;
      }
    }
  }
  else{
    fill(0, 0, 255);
    
    for(let i=0; i<55; i++){
      rect(rainDrops[i][0], rainDrops[i][1], 1, rainSpeed[i]);
      rainDrops[i][1] += rainSpeed[i];
      if(rainDrops[i][1] > 701){
        rainDrops[i][1] = Math.random()*50-50;
        rainDrops[i][0] += Math.random()*10-5;
        rainSpeed[i] = Math.random()*5+15;
      }
      if(rainDrops[i][0] < 250 || rainDrops[i][0] > 1400){
        rainDrops[i][0] = Math.random()*1150+250;
      }
    }
  }
  
}

function preload(){
  logo = loadImage('resources/sustainable.png');
  lake = loadImage('resources/lake.png');
  factory.push(loadImage('resources/filterNot.png'));
  factory.push(loadImage('resources/filterWorking.png'));
  filterPipes = loadImage('resources/lakePipe.png');
  tanks.push(loadImage('resources/tank0.png'));
  tanks.push(loadImage('resources/tank25.png'));
  tanks.push(loadImage('resources/tank50.png'));
  tanks.push(loadImage('resources/tank75.png'));
  tanks.push(loadImage('resources/tank100.png'));
  plantPipes[0].push(loadImage('resources/plantTankPipes1.png'));
  plantPipes[0].push(loadImage('resources/plantTankPipes2.png'));
  plantPipes[0].push(loadImage('resources/plantTankPipes3.png'));
  plantPipes[1].push(loadImage('resources/plantTankPipes10.png'));
  plantPipes[1].push(loadImage('resources/plantTankPipes20.png'));
  plantPipes[1].push(loadImage('resources/plantTankPipes30.png'));
  wellImg.push(loadImage('resources/wellUp.png'));
  wellImg.push(loadImage('resources/wellDown.png'));
  wellPipe.push(loadImage('resources/wellEnd.png'));
  wellPipe.push(loadImage('resources/wellPipe.png'));
  wellPipe.push(loadImage('resources/wellTank.png'));
  wellPipe.push(loadImage('resources/wellPipeConnect.png'));
  wellPipe.push(loadImage('resources/wellTankUp.png'));
  trucks.push(loadImage('resources/truckRightEmpty.png'));
  trucks.push(loadImage('resources/truckLeftFull.png'));
  trucks.push(loadImage('resources/truckLeftEmpty.png'));
  trucks.push(loadImage('resources/truckRightFull.png'));
  trucks.push(loadImage('resources/truckDownEmpty.png'));
  trucks.push(loadImage('resources/truckUpFull.png'));
  trucks.push(loadImage('resources/truckUpEmpty.png'));
  house.push(loadImage('resources/house.png'));
  house.push(loadImage('resources/houseCatch.png'));
  house.push(loadImage('resources/houseRain.png'));
  house.push(loadImage('resources/houseRainCatch.png'));
  house.push(loadImage('resources/houseSnow.png'));
  house.push(loadImage('resources/houseSnowCatch.png'));
  rainPipe.push(loadImage('resources/rainPipe.png'));
  rainPipe.push(loadImage('resources/rainPipeWater.png'));
}

function setup(){
  createCanvas(1400, 700);
  socket = io.connect('http://localhost:3000');
  socket.on('scoreBoard', updateBoard);
  startTime = millis();
  waterTimer = millis();
  game = 0;
}
var x = 0;
function draw() {
  //pregame state
  if (game==0){
    background("#87CEEB");
    textAlign(CENTER, CENTER)
    textSize(48)
    text("Welcome to Hydro Village", 700, 100);
    textSize(36);
    text("Press any button to play", 700, 550);
    textSize(20);
    
    text(intro[0], 700, 250);
    textSize(16);
    text(intro[1], 700, 450);
    image(logo, 50, 400, 250, 250);
    image(logo, 1100, 400, 250, 250);
  }
  //during game
  else if (game==1){
    
    strokeWeight(0);
    //updates variables
    {
    //updates day and time
    time[0] = 1 + Math.floor((millis()-startTime)/180000);
    time[1] = Math.floor(((millis()-startTime) % 180000) / 7500);
    time[2] = Math.floor((((millis()-startTime) % 180000) % 7500) / 125);
    season = Math.floor(((time[0]-1)%20)/5);
    
    //updates seasonal things
    if(previousSeason != season){
      previousSeason = season;
      switch(season){
        case 0:
          rainRate = 10000;
          rainChance = 40;
          rate -= 40;
          break;
        case 1:
          rainRate = 3000;//FIX
          rainChance = 60;
          break;
        case 2:
          rainChance = 100;
          rainRate = 15000; //FIX
          rate += 20;
          break;
        case 3:
          rainChance = 0;
          rate += 20;
          break;
      }
    }
    
    //updates daily variables
    if(previousDay != time[0]){
      previousDay = time[0];
      let chance = Math.random()*100;
      
      if(chance < rainChance){
        
        raining = true;
      }
      else{
        raining = false;
      }
      if(inspectionDays == 1){
        plantRate = 0;
        inspectionDays--;
      }
      else if(inspectionDays > 1){
        inspectionDays--;
      }
      if(inspectionDays < 0){
        inspectionDays = 0;
      }
      if(psa1 != 0){
        rate += 5;
        psa1--;
      }
      if(psa2 != 0){
        rate += 3;
        psa2--;
      }
      priceWords[2][3] = "$1500\nDays until \nnext required \ninspection: " + inspectionDays;
      priceWords[3][2] = "$2000\nDays until \nPSA effects \nwear off: " + psa1;
      priceWords[3][3] = "$2000\nDays until \nPSA effects \nwear off: " + psa2;
    }
    

    //updates water in tank
    if(millis()-waterTimer > 125){

      let multiples = (millis()-waterTimer)/125;
      waterTimer += multiples*125;
      water -= multiples*population * rate/1440;

      //increases water in well tanks
      wellWater += multiples*wells*wellRate/1440;
      
      plantWater += multiples*lakePipes*plantRate/1440;
      
      
      if(raining && rainCatcher){
        rainWater += multiples*rainRate/1440;
      }
    }
    
    
    //ensures that water never exceeds the tank cap
    if(water > tankCap){
      water = tankCap;
    }

    }
    
    //game ends if water is 0
    if(water <=0){
      startTime = millis() - startTime;
      game = 2;
    }
    
    //changes background from dark to day and back
    let back = color(0, 0, 0);
    {
    let day = color(246,188,140);
    let night = color(146, 91, 71);
    

    if((millis()-startTime) % 180000 < 30000 || (millis()-startTime) % 180000 > 150000){
      back = night;
    }
    else if ((millis()-startTime) % 180000 > 60000 && (millis()-startTime) % 180000 < 120000){
      back = day
    }
    else if ((millis()-startTime) % 180000 < 60000){
      back = lerpColor(night, day,((millis()-startTime) % 180000 - 30000)/30000);
    }
    else{
      back = lerpColor(day, night, ((millis()-startTime) % 180000 - 120000)/30000);
    }
    }

    background(back);
    

    //creating shop on left side
    {
    fill(112,128,144);
    rect(0, 50, 250, height);
    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Shop", 125, 85);
    //shop buttons
    textSize(20);
    for(let i =0; i<4; i++){
      fill(145, 160, 175);
      strokeWeight(4);
      rect(10, 110 + 130*i, 230, 120);
      fill(0);
      text(shopWords[shopPage][i], 65, 170 + 130*i);
      //making the buy and sell buttons
      if(shopPage != 4){
        if(sellOption[shopPage][i]){
          strokeWeight(2);
          fill(0, 128, 0);
          rect(130, 110+130*i, 110, 60);
          
          fill(255, 0, 0);
          rect(130, 170+130*i, 110, 60);
        }
        displayText(i);
      }
    }
    //displays the back button if the player isn't in the main shop
    strokeWeight(3);
    if(shopPage != 4){
      fill(120, 135, 150);
      rect(10, 630, 230, 60)
      fill(0);
      text("Back", 50, 650);
    }
    else{
      fill(255, 0, 0);
      rect(10, 630, 230, 60)
      fill(0);
      text("Quit", 50, 650);
    }
    }

    //displaying static visuals
    {
    image(lake, 1000, 300, 400, 400);
    if(rainCatcher){
      if(raining){
        image(rainPipe[1], 270, 140, 375, 375);
      }
      else{
        image(rainPipe[0], 270, 140, 375, 375);
      }
    }
    let whichHouse = 0;
    if(raining){
      whichHouse += 2;
      if(season == 1){
        whichHouse += 2;
      }
    }
    if(rainCatcher){
      whichHouse++;
    }
    image(house[whichHouse], 315, 75, 450, 450);
    
    //drawing the main tanks of the town
    for(let i=0; i<tankCap/100000; i++){
      if(i>0 && i!=3){
        image(wellPipe[2], 735 + 77*(i%3), 175 - 90*Math.floor(i/3), 500, 500);
      }
      if(i>2){
        image(wellPipe[4], 105 + 75*i, 115, 500, 500);
      }
      image(tanks[Math.round(4*water/tankCap)], 775+75*(i%3), 150-90*Math.floor(i/3), 400, 400);

      
    }

    //drawing the filtration plant with or without water, depending on if it is producing water
    if(filtration){
      if(lakePipes > 0 && inspectionDays != 0){
        image(factory[1], 1165, 50, 275, 275);
      }
      else{
        image(factory[0], 1165, 50, 275, 275);
      }
    }
    //displaying number of pipes
    for(let i=0; i<lakePipes; i++){
      image(filterPipes, 1226+33*i, 242, 275, 275);
    }
    //displaying factory tanks
    if(filtration){
      if(plantWater>plantTankCap){
        plantWater = plantTankCap;
      }
      for(let i=plantTankCap/5000; i>0; i--){
        image(tanks[Math.round(4*plantWater/plantTankCap)], 1100, 272-55*i, 250, 250);
      }
      if(lakePipes > 0 && inspectionDays != 0){
        image(plantPipes[1][plantTankCap/5000-1], 1125, 99, 260, 260);
      }
      else{
        image(plantPipes[0][plantTankCap/5000-1], 1125, 99, 260, 260);
      }
    }
    //well piping
    for(let i=0; i<Math.floor((wells-1)/2); i++){
      image(wellPipe[1], 635-90*i, 529, 300, 300);
    }
    if(wells >0){
      image(wellPipe[0], 690-90*Math.floor((wells-1)/2), 527, 315, 315);
      image(wellPipe[3], 720, 562, 325, 325);
    }
    
    //displaying wells
    for(let i=0; i<wells; i++){
      image(wellImg[i%2], 625-90*Math.floor(i/2), 550-90*(i%2), 300, 300);
    }
    //well tanks and piping in between wells
    for(let i=1; i<wellTankCap/4000; i++){
      image(wellPipe[2], 780+40*i, 645, 250, 250);
    }
    if(wellWater>wellTankCap){
      wellWater = wellTankCap;
    }
    for(let i=0; i<wellTankCap/4000; i++){
      image(tanks[Math.round(4*wellWater/wellTankCap)], 800+40*i, 625, 250, 250);
    }

    //only draw when there are rain catchers installed
    if(rainCatcher){
      //drawing rain tanks and pipes in between them
      if(rainWater>rainTankCap){
        rainWater = rainTankCap;
      }
      for(let i=1; i<rainTankCap/1500; i++){
        image(wellPipe[2], 310+40*i, 345, 250, 250);
      }
      for(let i=0; i<rainTankCap/1500; i++){
        image(tanks[Math.round(4*rainWater/rainTankCap)], 325 + 40*i, 325, 250, 250);
      }
      
    }
    


    textAlign(LEFT);
    textSize(12);
    /*text("Wells: " + wells + "\t\tRainCatcher: "+rainCatcher + "\nFiltration plant: " + filtration + "\t\tlake pipes: " + lakePipes, 1150, 400);
    text("TownTank: " + tankCap + "\t\twell tank: " + wellTankCap +"\nRain tank: " + rainTankCap + "\t\tFilter tank: " + plantTankCap, 1150, 450);
    text("WEll driver: " + wellDriver.length + "\t\trainDriver: " + rainDriver.length + "\nplantDriver: "+plantDriver.length + "\t\tInspect days: " + inspectionDays, 1150, 500);
    text("toilets: " + toilets + "\t\tshowers: "+shower + "\npsa1: " + psa1 + "\t\tpsa2: " + psa2, 1150, 550);*/
    }

    //displaying trucks
    {
    for(let i=0; i<wellDriver.length; i++){
      let time = (millis()-wellDriver[i].getOffset())%15000;
      if(time < 7500){
        if(time < 5000){
          image(trucks[4], 775, 230 + 320*time/5000, 325, 325);
        }
        else{
          image(trucks[4], 775, 550, 325, 325);
          //if the truck can hold everything in the tank
          if(wellWater <= wellDriver[i].getCap() - wellDriver[i].getWater()){
            wellDriver[i].addWater(wellWater);
            wellWater = 0;
          }
          //if the truck can only take part of the tank
          else{
            wellWater -= wellDriver[i].getCap() - wellDriver[i].getWater();
            wellDriver[i].addWater(wellDriver[i].getCap() - wellDriver[i].getWater());
          }
        }
      }
      else{
        //variable to make sure the truck looks empty if it is empty, but full if it has any water
        let which = 5;
        if(wellDriver[i].getWater() == 0){
          which = 6;
        }
        if(time<12500){
          image(trucks[which], 775, 550 - 320*(time-7500)/5000, 325, 325);
        }
        else{
          water += wellDriver[i].getWater();
          wellDriver[i].addWater(-wellDriver[i].getWater());
          image(trucks[which], 775, 230, 325, 325);
        }
      }
    }
    for(let i=0; i<rainDriver.length; i++){
      let time = (millis()-rainDriver[i].getOffset())%15000;
      if(time < 7500){
        if(time < 5000){
          image(trucks[2], 700 - 350*time/5000, 250, 250, 250);
        }
        else{
          image(trucks[2], 350, 250, 250, 250);
          if(rainWater <= rainDriver[i].getCap() - rainDriver[i].getWater()){
            rainDriver[i].addWater(rainWater);
            rainWater = 0;
          }
          else{
            rainWater -= rainDriver[i].getCap() - rainDriver[i].getWater();
            rainDriver[i].addWater(rainDriver[i].getCap() - rainDriver[i].getWater());
          }
        }
      }
      else{
        let which = 3;
        if(rainDriver[i].getWater() == 0){
          which = 0;
        }
        if(time < 12500){
          image(trucks[which], 350 + 350*(time-7500)/5000, 250, 250, 250);
        }
        else{
          water += rainDriver[i].getWater();
          rainDriver[i].addWater(-rainDriver[i].getWater());
          image(trucks[which], 700, 250, 250, 250);
        }
      }
    }
    for(let i=0; i<plantDriver.length; i++){
      //time is how far into the cycle each truck is
      let time = (millis()-plantDriver[i].getOffset())%15000;
      if(time < 7500){
        if(time < 5000){
          image(trucks[0], 775 + 250*time/5000, 250, 250, 250);
        }
        else{
          //if the truck can hold everything in the tank
          if(plantWater <= plantDriver[i].getCap() - plantDriver[i].getWater()){
            plantDriver[i].addWater(plantWater);
            plantWater = 0;
          }
          //if the truck can only take part of the tank
          else{
            plantWater -= plantDriver[i].getCap() - plantDriver[i].getWater();
            plantDriver[i].addWater(plantDriver[i].getCap() - plantDriver[i].getWater());
          }
          image(trucks[0], 1025, 250, 250, 250);
        }
      }
      else{
        //variable to make sure the truck looks empty if it is empty, but full if it has any water
        let which = 1;
        if(plantDriver[i].getWater() == 0){
          which = 2;
        }
        if(time<12500){
          image(trucks[which], 1025 - 250*(time-7500)/5000, 250, 250, 250);
        }
        else{
          water += plantDriver[i].getWater();
          plantDriver[i].addWater(-plantDriver[i].getWater());
          image(trucks[which], 775, 250, 250, 250);
        }
      }
    }
    }
    if(raining){
      rain();
    }
    //creating stuff on the top
    {
      fill(173,216,230);
      rect(0, 0, width, 50);
      textSize(32);
      fill(0);
      if(time[1] < 10){
        hour1 = "0";
      }
      else{
        hour1 = "";
      }
      if(time[2] < 10){
        minute1 = "0";
      }
      else{
        minute1 = "";
      }
      textAlign(LEFT, BOTTOM);
      topText = "Day: " + time[0] + "\t Time: " + hour1 + time[1] + ":" + minute1 + time[2];
      text(topText, 10, 40);
      text(seasonNames[season], 325, 40);
      text("Water Tank: " + Math.round(water) + "/" + tankCap, 985, 40);
      textSize(20);
      textAlign(CENTER);
      text("Water usage: " + population + " people * " + rate + "L/day", 725, 40);
      textSize(32);
      }
    //creating info box
    {
    if(showInfo){
      strokeWeight(2);
      fill(255);
      rect(500, 250, 400, 300);
      fill(0, 255, 0);
      rect(650, 475, 100, 50);
      textSize(18);
      textAlign(CENTER, TOP);
      fill(0);
      text("Okay", 700, 490);
      text(infoWords[info], 700, 325);
    }
    }
  }

  //postgame state
  else if(game==2){
    strokeWeight(2);
    background(100);
    
    if(displayBoard){
      //after submit
      textSize(18);
      fill(255);
      rect(500, 200, 400, 300);
      fill(0);
      textAlign(LEFT, CENTER);
      console.log(scoreBoard.length);
      for(let i=0; i<scoreBoard.length; i++){
        text((i+1) + ":\t" + scoreBoard[i][0], 515, 25*i+215);
      }
      textAlign(RIGHT);
      for(let i=0; i<scoreBoard.length; i++){
        if(Math.floor((scoreBoard[i][1]%180000)/7500) < 10){
          hour1 = "0";
        }
        else{
          hour1 = "";
        }
        if(Math.floor(((scoreBoard[i][1]%180000)%7500)/125) < 10){
          minute1 = "0";
        }
        else{
          minute1 = "";
        }
        text("Day: " + Math.floor(scoreBoard[i][1]/180000) + "\t\t" + hour1 + Math.floor((scoreBoard[i][1]%180000)/7500) + ":" + minute1 + Math.floor(((scoreBoard[i][1]%180000)%7500)/125), 885, 25*i+215);
      }
      textAlign(CENTER);
      textSize(24);
      text("Scoreboard", 700, 175);
      
    }
    else{
      //before submission
      let textbox = 150;
      if(selected){
        textbox = 255;
      }
      fill(textbox);
      rect(600, 250, 200, 30);
      fill(255);
      rect(625, 300, 150, 50);
      fill(0);
      textAlign(CENTER, CENTER);
      text("Enter Name:", 700, 200);
      text("Submit", 700, 325);
      text(userName, 700, 265);
    }
    fill(255, 0, 0);
    rect(900, 600, 200, 50);
    fill(0, 255, 0);
    rect(300, 600, 200, 50);
    fill(0);
    text("Play Again", 400, 625);
    text("Quit", 1000, 625);

  }
}

