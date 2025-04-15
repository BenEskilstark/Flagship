
import { dist, subtract, vectorTheta } from '../utils/vectors.js';
import { normalIn } from '../utils/stochastic.js';
import { makeBomb, makeExplosion, makeShip } from '../state/entities.js';

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

    // rotate and move entities
    for (const id in entities) {
        const entity = entities[id];

        // turn
        if (entity.theta == null) entity.theta = 0;
        if (entity.thetaSpeed == null) entity.thetaSpeed = 0;
        entity.theta = (entity.theta + entity.thetaSpeed) % (2 * Math.PI);

        // move
        entity.x += entity.speed * Math.cos(entity.theta);
        entity.y += entity.speed * Math.sin(entity.theta);

        // follow the leader
        if (entity.actionQueue?.length > 0) {
            for (let action of entity.actionQueue) {
                action.ticks--;
            }
            const { ticks, thetaSpeed } = entity.actionQueue[0];
            if (ticks < 0) {
                entity.actionQueue.shift();
                entity.thetaSpeed = thetaSpeed;
            }
        }

        // bombs at target
        if (entity.symbol == "💣" && dist(entity, entity.target) < entity.speed) {
            entitiesToDelete.push(entity);
            entitiesToAdd.push(makeExplosion({ x: entity.x, y: entity.y, damage: entity.damage }));
        }
    }

    // start firing
    for (const id in entities) {
        const entity = entities[id];
        if (entity.firePos == null) continue;
        if (dist(entity, entity.firePos) > entity.range) continue;
        if (entity.fireCooldown > 0) {
            entity.fireCooldown--;
            continue;
        }
        entity.fireCooldown = entity.fireRateTicks;
        const distToTarget = dist(entity, entity.firePos);
        const accuracy = distToTarget / 2;
        const target = {
            x: normalIn(entity.firePos.x - accuracy, entity.firePos.x + accuracy),
            y: normalIn(entity.firePos.y - accuracy, entity.firePos.y + accuracy),
        };
        entitiesToAdd.push(makeBomb({ x: entity.x, y: entity.y, target }));

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
        if (entity.maxhp && entity.hp < 0) {
            entitiesToDelete.push(entity);
            // delete from followers list
            if (entity.leader) {
                entity.leader.followers = entity.leader.followers.filter(e => e.id != id);
            }
            // re-assign leader
            if (entity.isSelected && entity.followers?.length > 0) {
                const next = entity.followers.shift();
                next.followers = entity.followers;
                next.followers.forEach(e => e.leader = next);
                next.isSelected = true;
            }
        }
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