
import { mouseReducer } from "../reducers/mouseReducer.js";
import { tickReducer } from "../reducers/tickReducer.js";
import { config } from '../config.js';
import { sessionReducer } from '../reducers/sessionReducer.js';
import { queueReducer } from '../reducers/queueReducer.js';
import { turnReducer } from '../reducers/turnReducer.js';
import { keyReducer } from "../reducers/keyReducer.js";

export const rootReducer = (state, action) => {
    if (state === undefined) state = initState();

    switch (action.type) {
        case 'END_TURN':
            // first recursively evaluate all actions in the queue
            if (action.clientID == state.clientID) state.actionQueue = [];
            action.actions.forEach(a => state = rootReducer(state, a));
            state = tickReducer(state, { type: "TICK" });
            return turnReducer(state, action);
        case 'QUEUE_ACTION':
        case 'CLEAR_ACTION_QUEUE':
            return queueReducer(state, action);
        case 'LEAVE_SESSION':
        case 'START_SESSION':
            return sessionReducer(state, action);
        case 'KEY_DOWN':
        case 'KEY_UP':
            return keyReducer(state, action);
        case 'MOUSE_DOWN':
        case 'MOUSE_MOVE':
        case "MOUSE_UP":
        case "RIGHT_CLICK":
        case "SET_CLICK_MODE":
            return mouseReducer(state, action);
        case 'START_TICK':
        case 'STOP_TICK':
        case 'TICK':
            return tickReducer(state, action);
        default:
            return state;
    }
};

export const initState = () => {
    return {
        screen: 'LOBBY', // | 'GAME'
        sessions: {}, // sessionID -> {id: SessionID, clients: Array<ClientID>, started: Bool}
        sessionID: null, // session I am in
        numConnectedClients: 0,
        clientID: null,
        realtime: config.isRealtime,

        groups: [],
    };
}