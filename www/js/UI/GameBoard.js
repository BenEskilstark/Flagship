import StatefulHTML from './StatefulHTML.js';
import { convertGridPosToPixel, convertGridScalarToPixel } from '../utils/coordinates.js';
import { config } from '../config.js';


export default class GameBoard extends StatefulHTML {
    connectedCallback() {
        const width = parseInt(this.getAttribute("width"));
        const height = parseInt(this.getAttribute("height"));
        if (width && height) {
            this.dispatch({ width, height });
        }
        this.render(this.getState());

        document.addEventListener('keydown', (event) => {
            this.dispatchOrQueue({
                type: 'KEY_DOWN',
                playerID: this.getState().clientID,
                key: event.code,
            });
        });
        document.addEventListener('keyup', (event) => {
            this.dispatchOrQueue({
                type: 'KEY_UP',
                playerID: this.getState().clientID,
                key: event.code,
            });
        });

        // kick things off:
        if (this.getState().myTurn) {
            this.dispatchToServerAndSelf({
                type: 'END_TURN', clientID: this.getState().clientID, actions: [],
            });
        }

        // window.getState = this.getState;
        // window.dispatch = this.dispatch;
    }

    onChange(state) {
        // handling ending your turn
        if (this.endTurnInterval == null && state.myTurn && state.realtime) {
            this.endTurnInterval = setTimeout(() => {
                this.endTurnInterval = null;
                const actions = [...this.getState().actionQueue];
                this.dispatchToServerAndSelf({
                    type: 'END_TURN', clientID: state.clientID, actions,
                });
            }, config.turnTime);
        }

        this.render(state);
    }

    render(state) {
        const { width, height, mouse, entities, tickInterval } = state;

        const canvas = this.querySelector("canvas")
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "steelblue";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const sqWidth = canvas.getBoundingClientRect().width / width;
        const sqHeight = canvas.getBoundingClientRect().height / height;
        ctx.save();
        ctx.scale(sqWidth, sqHeight);

        for (const id in entities) {
            const entity = entities[id];
            const {
                x, y, color, radius, isSelected, target, firePos, range,
                hp, maxhp, theta,
            } = entity;
            ctx.save();

            if (firePos) {
                ctx.save();
                ctx.strokeStyle = "orange";
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(firePos.x, firePos.y);
                ctx.stroke();
                ctx.restore();
            }

            ctx.save();
            ctx.translate(x, y);
            if (theta != null) {
                ctx.rotate(theta + Math.PI);
            }


            ctx.fillStyle = color;
            ctx.globalAlpha = 0.2;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.font = radius + "px Arial";
            ctx.strokeText(entity.symbol, 1 - radius / 1.5, 3);

            ctx.restore();


            if (isSelected && range && entity.playerID == state.clientID) {
                ctx.lineWidth = 1;
                ctx.strokeStyle = "red";
                ctx.beginPath();
                ctx.arc(x, y, range, 0, Math.PI * 2);
                ctx.stroke();
            }
            if (maxhp != null && hp > 0 && hp < maxhp) {
                ctx.fillStyle = "red";
                ctx.fillRect(x - radius * 1.5, y - radius * 1.5, radius * 3, 3);
                ctx.fillStyle = "green";
                ctx.fillRect(x - radius * 1.5, y - radius * 1.5, radius * 3 * hp / maxhp, 3);
            }
            ctx.restore();
        }

        if (mouse.downPos != null) {
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            const downPixel = convertGridPosToPixel(state, mouse.downPos);
            const mWidth = mouse.curPos.x - downPixel.x;
            const mHeight = mouse.curPos.y - downPixel.y;
            ctx.strokeRect(downPixel.x, downPixel.y, mWidth, mHeight);
        }
        ctx.restore();
    }

    /////////////////////////////////////////////////////////////////////////////
    // Mouse Handlers

    canvasMouseDown(ev) {
        ev.preventDefault();
        if (ev.button !== 0) return; // Only proceed for left-click
        this.dispatchOrQueue({
            type: "MOUSE_DOWN",
            offsetX: ev.offsetX, offsetY: ev.offsetY,
            playerID: this.getState().clientID,
        });
    }

    canvasMouseUp(ev) {
        ev.preventDefault();
        if (ev.button !== 0) return; // Only proceed for left-click
        this.dispatchOrQueue({
            type: "MOUSE_UP",
            offsetX: ev.offsetX, offsetY: ev.offsetY,
            playerID: this.getState().clientID,
        });
    }

    canvasMouseMove(ev) {
        ev.preventDefault();
        if (this.getState().mouse.downPos == null) return;
        this.dispatch({
            type: "MOUSE_MOVE",
            offsetX: ev.offsetX, offsetY: ev.offsetY,
            playerID: this.getState().clientID,
        });
    }

    canvasRightClick(ev) {
        ev.preventDefault();
        this.dispatchOrQueue({
            type: "RIGHT_CLICK",
            offsetX: ev.offsetX, offsetY: ev.offsetY,
            playerID: this.getState().clientID,
        });
    }
}


