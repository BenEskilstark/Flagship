import { convertGridPosToPixel, convertPixelToGridPos } from '../utils/coordinates.js';
import { dist } from '../utils/vectors.js';

export const mouseReducer = (state, action) => {
    if (state.mouse === undefined) {
        state.mouse = {
            downPos: null,
            curPos: null,
            upPos: null,
            clickMode: "MOVE",
        };
    }

    switch (action.type) {
        case 'MOUSE_DOWN': {
            const { ev } = action;
            const { mouse, entities } = state;
            const { x, y } = convertPixelToGridPos(state, ev);
            const curPos = { x: ev.offsetX, y: ev.offsetY };

            return { ...state, mouse: { ...mouse, downPos: { x, y }, curPos } };
        }
        case 'MOUSE_MOVE': {
            const { ev } = action;
            const { mouse } = state;
            const x = ev.offsetX;
            const y = ev.offsetY;
            return {
                ...state, mouse: { ...mouse, curPos: { x, y } }
            };
        }
        case "MOUSE_UP": {
            const { ev } = action;
            const { mouse, entities } = state;

            // deselect all entities
            for (const id in entities) {
                const entity = entities[id];
                if (entity.isSelected) entity.isSelected = false;
            }

            // select entities in the marquee
            const fromPos = mouse.downPos;
            const toPos = convertPixelToGridPos(state, ev);
            const min = { x: Math.min(toPos.x, fromPos.x), y: Math.min(toPos.y, fromPos.y) };
            const max = { x: Math.max(toPos.x, fromPos.x), y: Math.max(toPos.y, fromPos.y) };
            for (const id in entities) {
                const entity = entities[id];
                if (!entity.isSelectable) continue;
                if (entity.x >= min.x && entity.y >= min.y &&
                    entity.x <= max.x && entity.y <= max.y
                ) {
                    entity.isSelected = true;
                }
            }

            return {
                ...state,
                mouse: {
                    ...mouse,
                    // clickMode: "MOVE",
                    downPos: null, curPos: null, piece: null
                }
            };
        }
        case "RIGHT_CLICK": {
            const { ev } = action;
            const { mouse, entities } = state;
            const toPos = convertPixelToGridPos(state, ev);
            for (const id in entities) {
                const entity = entities[id];
                if (entity.isSelected) {
                    if (mouse.clickMode == "MOVE") {
                        entity.target = { ...toPos };
                    } else if (mouse.clickMode == "FIRE") {
                        if (dist(entity, toPos) > entity.range) {
                            entity.firePos = null;
                        } else {
                            entity.firePos = { ...toPos };
                        }
                    }

                }
            }
            return state;
        }
        case "SET_CLICK_MODE": {
            const { clickMode } = action;
            state.mouse.clickMode = clickMode;
            return state;
        }
    }
    return state;
}