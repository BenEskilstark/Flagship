
import { config } from '../config.js';
import { makeShip } from './entities.js';


export const initGameState = (players, clientID) => {
  const red0 = {
    ...makeShip({ x: 300, y: 100, playerID: players[0], color: "red" }),
    id: 0,
  };
  const red1 = {
    ...makeShip({
      x: 225, y: 100, color: "red", playerID: players[0], leader: red0,
    }),
    id: 1,
  };
  const red2 = {
    ...makeShip({
      x: 150, y: 100, color: "red", playerID: players[0], leader: red0,
    }),
    id: 2,
  };
  const red3 = {
    ...makeShip({
      x: 75, y: 100, color: "red", playerID: players[0], leader: red0,
    }),
    id: 3,
  };
  red0.followers = [red1, red2, red3];


  const blue0 = {
    ...makeShip({ x: 500, y: 600, playerID: players[1], color: "blue" }),
    id: 4, theta: Math.PI,
  };
  const blue1 = {
    ...makeShip({ x: 575, y: 600, playerID: players[1], color: "blue", leader: blue0 }),
    id: 5, theta: Math.PI,
  };
  const blue2 = {
    ...makeShip({ x: 650, y: 600, playerID: players[1], color: "blue", leader: blue0 }),
    id: 6, theta: Math.PI,
  };
  const blue3 = {
    ...makeShip({ x: 725, y: 600, playerID: players[1], color: "blue", leader: blue0 }),
    id: 7, theta: Math.PI,
  };
  blue0.followers = [blue1, blue2, blue3];

  return {
    /////////////
    // immutable game state
    players, // Array<ClientID>

    width: config.width, height: config.height,


    /////////////
    // Offline play state:
    tick: 0,
    tickInterval: null,
    tickRate: 50,


    /////////////
    // local game state
    turnIndex: 0, // index of player whose turn it is
    turn: 0,

    mouse: {
      downPos: null,
      curPos: null,
      upPos: null,
      clickMode: "MOVE",
    },

    myTurn: players.indexOf(clientID) == 0,
    actionQueue: [], // Array<Action>

    curTurnRate: 24, // total number of turns taken per second
    avgTurnRate: 24,
    startTime: Date.now(),
    lastTurnEndTime: Date.now(), // the time when my last turn ended


    /////////////
    // global game state that must be shared
    nextEntityId: 10,
    entities: {
      0: red0, 1: red1, 2: red2, 3: red3,
      4: blue0, 5: blue1, 6: blue2, 7: blue3,
    }
  }
}
