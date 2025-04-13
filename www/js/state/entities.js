import { dist, subtract, vectorTheta } from '../utils/vectors.js';
import { normalIn } from '../utils/stochastic.js';
import { config } from '../config.js';

export const makeShip = ({ x, y, playerID, color, leader }) => {
    const speed = 1;
    return {
        x, y, playerID, color,
        speed, theta: 0, thetaSpeed: 0, maxThetaSpeed: 0.05,
        radius: 30,
        range: 250, fireRateTicks: 20, fireCooldown: 10,
        symbol: "⛵",
        isSelectable: true, isSelected: leader == null,
        leader, followers: [],
        tickOffset: Math.round(dist(leader ?? { x, y }, { x, y }) / speed),
        actionQueue: [], // Array<{ticks, thetaSpeed}>
        hp: 100, maxhp: 100,
    }
}

export const makeBomb = ({ x, y, target }) => {
    return {
        x, y, symbol: "💣", target,
        speed: 8, radius: 10,
        theta: vectorTheta(subtract(target, { x, y })), thetaSpeed: 0,
        damage: 10,
    }
};

export const makeExplosion = ({ x, y, damage }) => {
    return {
        x, y,
        ticksRemaining: 10, symbol: "💥",
        radius: 15, speed: 0, theta: 0,
        damage, didDamage: false,
    }
};