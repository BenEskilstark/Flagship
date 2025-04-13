
import { dist, subtract, vectorTheta } from '../utils/vectors.js';
import { normalIn } from '../utils/stochastic.js';

export const tickReducer = (state, action) => {
    switch (action.type) {
        case 'START_TICK': {
            const { dispatchFn } = action;
            const { tickRate } = state;
            return {
                ...state,
                tickInterval: setInterval(dispatchFn, tickRate),
            };
        }
        case 'STOP_TICK':
            clearInterval(state.tickInterval);
            return { ...state, tickInterval: null };
        case 'TICK':
            return tick(state);
    }
}

const tick = (state) => {
    state.tick++;

    const { entities } = state;

    const entitiesToDelete = [];
    const entitiesToAdd = [];

    // move entities towards their targets
    for (const id in entities) {
        const entity = entities[id];
        if (entity.target != null && dist(entity.target, entity) > entity.speed) {
            const theta = vectorTheta(subtract(entity.target, entity));
            entity.x += entity.speed * Math.cos(theta);
            entity.y += entity.speed * Math.sin(theta);
        } else if (entity.symbol == "💣") {
            entitiesToDelete.push(entity);
            const explosion = {
                ticksRemaining: 10, symbol: "💥", x: entity.x, y: entity.y,
                radius: 15, speed: 0,
                damage: entity.damage, didDamage: false,
            }
            entitiesToAdd.push(explosion);
        }

        if (entity.firePos != null && dist(entity, entity.firePos) > entity.range) {
            entity.firePos = null;
        }
    }

    // start firing
    for (const id in entities) {
        const entity = entities[id];
        if (entity.firePos != null) {
            if (entity.fireCooldown > 0) {
                entity.fireCooldown--;
                continue;
            }
            entity.fireCooldown = entity.fireRateTicks;
            const distToTarget = dist(entity, entity.firePos);
            const accuracy = distToTarget / 2;
            const bomb = {
                firerId: id, speed: 4, radius: 10,
                // color: entity.color,
                x: entity.x, y: entity.y, symbol: "💣",
                target: {
                    x: normalIn(entity.firePos.x - accuracy, entity.firePos.x + accuracy),
                    y: normalIn(entity.firePos.y - accuracy, entity.firePos.y + accuracy),
                },
                damage: entity.radius,
            };
            entitiesToAdd.push(bomb);
        }
    }

    // collisions 
    const explosions = [];
    for (const id in entities) {
        const entity = entities[id];
        if (entity.symbol == "💥" && !entity.didDamage) explosions.push(entity);
    }
    for (const explosion of explosions) {
        for (const id in entities) {
            const entity = entities[id];
            if (!entity.maxhp) continue;
            const distance = dist(entity, explosion);
            if (distance < entity.radius + explosion.radius) {
                explosion.didDamage = true;
                entity.hp -= (1 - distance / (entity.radius + explosion.radius)) * explosion.damage;
            }
        }
    }

    // destroy entities with no hp left
    for (const id in entities) {
        const entity = entities[id];
        if (entity.maxhp && entity.hp < 0) entitiesToDelete.push(entity);
    }

    // destroy short-lived entities
    for (const id in entities) {
        const entity = entities[id];
        if (entity.ticksRemaining >= 0) entity.ticksRemaining--;
        if (entity.ticksRemaining < 0) {
            entitiesToDelete.push(entity);
        }
    }

    // clean up entities
    for (const entity of entitiesToDelete) {
        delete state.entities[entity.id];
    }

    // add entities
    for (const entity of entitiesToAdd) {
        entity.id = state.nextEntityId++;
        state.entities[entity.id] = entity;
    }

    return state;
}