import StatefulHTML from './StatefulHTML.js';
import { config } from '../config.js';


export default class TopBar extends StatefulHTML {
    prevTickInterval = "init";

    connectedCallback() {
        const state = this.getState();
        if (state.tickInterval == null) this.togglePause();
        this.render(this.getState());
    }

    onChange(state) {
        if (state.tickInterval != this.prevTickInterval) {
            this.render(state);
            this.prevTickInterval = state.tickInterval;
        }
    }

    render(state) {
        const { isOffline, tickInterval, mouse } = state;

        let pauseButton = "";
        if (isOffline) {
            pauseButton = ` 
                <button onclick="closest('top-bar').togglePause()">
                    ${tickInterval ? "Pause" : "Play"}
                </button>`;
        }

        this.innerHTML = `
          ${pauseButton}
            `;
    }

    togglePause() {
        const { isOffline, tickInterval } = this.getState();

        if (isOffline) {
            if (tickInterval) {
                this.dispatch({ type: "STOP_TICK" });
            } else {
                this.dispatch({
                    type: "START_TICK",
                    dispatchFn: () => this.dispatch({ type: "TICK" })
                });
            }
        }
    }
}