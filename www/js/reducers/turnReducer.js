import { msToTurns, newDuration } from '../selectors/durationSelectors.js';
import { config } from '../config.js';

export const turnReducer = (state, action) => {
    switch (action.type) {
        case 'END_TURN': {

            const justEndedMyTurn = state.myTurn;
            const turnIndex = (state.turnIndex + 1) % state.players.length;
            return {
                ...state,
                turn: state.turn + 1,
                myTurn: state.players[turnIndex] == state.clientID,
                turnIndex,
                // if I just ended my turn then record the time
                curTurnRate: justEndedMyTurn
                    ? 1000 / (Date.now() - state.lastTurnEndTime + 1) * state.players.length
                    : state.curTurnRate,
                avgTurnRate: 1000 / ((Date.now() - state.startTime + 1) / state.turn),
                lastTurnEndTime: justEndedMyTurn ? Date.now() : state.lastTurnEndTime,
            };
        }
    }
}