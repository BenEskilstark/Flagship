
import { config } from '../config.js';


export const initGameState = (players, clientID) => {
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
    nextEntityId: 5,
    entities: {
      0: {
        id: 0, x: 100, y: 100, speed: 1.5, color: "red", radius: 30,
        range: 250, fireRateTicks: 40, fireCooldown: 10,
        symbol: "🚢", isSelectable: true,
        hp: 100, maxhp: 100,
      },
      1: {
        id: 1, x: 140, y: 120, speed: 1.5, color: "red", radius: 30,
        range: 250, fireRateTicks: 40, fireCooldown: 10,
        symbol: "🚢", isSelectable: true,
        hp: 100, maxhp: 100,
      },
      2: {
        id: 2, x: 120, y: 170, speed: 1.5, color: "red", radius: 30,
        range: 250, fireRateTicks: 40, fireCooldown: 10,
        symbol: "🚢", isSelectable: true,
        hp: 100, maxhp: 100,
      },
      3: {
        id: 3, x: 200, y: 170, speed: 2, color: "red", radius: 20,
        range: 150, fireRateTicks: 25, fireCooldown: 10,
        symbol: "🛥️", isSelectable: true,
        hp: 80, maxhp: 80,
      },
      4: {
        id: 4, x: 600, y: 600, speed: 1.5, color: "blue", radius: 30,
        range: 250, fireRateTicks: 40, fireCooldown: 10,
        symbol: "🚢", isSelectable: true,
        hp: 100, maxhp: 100,
      },
    },
  };
}
