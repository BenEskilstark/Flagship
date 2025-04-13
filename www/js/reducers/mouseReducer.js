import { convertGridPosToPixel, convertPixelToGridPos } from '../utils/coordinates.js';
import { dist } from '../utils/vectors.js';

export const mouseReducer = (state, action) => {
    if (state.mouse === undefined) {
        state.mouse = {
            downPos: null,
            curPos: null,
            upPos: null,
        };
    }

    switch (action.type) {
        case "RIGHT_CLICK": {
            const { offsetX, offsetY, playerID } = action;
            const { mouse, entities, clientID } = state;
            const toPos = convertPixelToGridPos(state, { offsetX, offsetY });
            for (const id in entities) {
                const entity = entities[id];
                if (!entity.isSelected || playerID != entity.playerID) continue;
                entity.firePos = null;
                for (let follower of entity?.followers ?? []) {
                    follower.firePos = null;
                }
            }
            return state;
        }
        case "MOUSE_DOWN": {
            const { offsetX, offsetY, playerID } = action;
            const { mouse, entities, clientID } = state;
            const toPos = convertPixelToGridPos(state, { offsetX, offsetY });
            for (const id in entities) {
                const entity = entities[id];
                if (!entity.isSelected || playerID != entity.playerID) continue;
                entity.firePos = { ...toPos };
                for (let follower of entity?.followers ?? []) {
                    follower.firePos = { ...toPos };
                }
            }
            return state;
        }
    }
    return state;
}