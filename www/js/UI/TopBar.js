import StatefulHTML from './StatefulHTML.js';


export default class TopBar extends StatefulHTML {
    prevTickInterval = "init";

    connectedCallback() {
        const state = this.getState();
        if (state.tickInterval == null) this.togglePause();
        this.render(this.getState());

        document.addEventListener('DOMContentLoaded', () => {
            document.addEventListener('keydown', (event) => {
                if (event.code === 'KeyF') {
                    this.dispatch({ type: "SET_CLICK_MODE", clickMode: "FIRE" });
                    this.render(this.getState());
                } else if (event.code === 'KeyM') {
                    this.dispatch({ type: "SET_CLICK_MODE", clickMode: "MOVE" });
                    this.render(this.getState());
                }
            });
        });
    }

    onChange(state) {
        if (state.tickInterval != this.prevTickInterval) {
            this.render(state);
            this.prevTickInterval = state.tickInterval;
        }
    }

    render(state) {
        const { tickInterval, mouse } = state;

        this.innerHTML = `
          <button onclick="closest('top-bar').togglePause()">
            ${tickInterval ? "Pause" : "Play"}
          </button>
          <button onclick="closest('top-bar').toggleClickMode()">
            ${mouse.clickMode == "MOVE" ? "Switch to Fire Mode (F)" : "Switch to Move Mode (M)"}
          </button>
        `;
    }

    togglePause() {
        const { tickInterval } = this.getState();
        if (tickInterval) {
            this.dispatch({ type: "STOP_TICK" });
        } else {
            this.dispatch({
                type: "START_TICK",
                dispatchFn: () => this.dispatch({ type: "TICK" })
            });
        }
    }

    toggleClickMode() {
        const { mouse } = this.getState();
        if (mouse.clickMode == "FIRE") {
            this.dispatch({ type: "SET_CLICK_MODE", clickMode: "MOVE" });
        } else {
            this.dispatch({ type: "SET_CLICK_MODE", clickMode: "FIRE" });
        }
        this.render(this.getState());
    }
}