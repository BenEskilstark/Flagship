import StatefulHTML from './StatefulHTML.js';
import { convertGridPosToPixel, convertGridScalarToPixel } from '../utils/coordinates.js';


export default class GameBoard extends StatefulHTML {
    connectedCallback() {
        const width = parseInt(this.getAttribute("width"));
        const height = parseInt(this.getAttribute("height"));
        this.dispatch({ width, height });
        this.render(this.getState());

        window.getState = this.getState;
        window.dispatch = this.dispatch;
    }

    render(state) {
        const { width, height, mouse, entities, tickInterval } = state;

        const canvas = this.querySelector("canvas")
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "steelblue";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (const id in entities) {
            ctx.save();
            const entity = entities[id];
            const {
                x, y, color, radius, isSelected, target, firePos, range,
                hp, maxhp
            } = entity;
            const pos = convertGridPosToPixel(state, { x, y });
            if (target && entity.isSelectable) {
                const t = convertGridPosToPixel(state, target);
                ctx.strokeStyle = "black";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                ctx.lineTo(t.x, t.y);
                ctx.stroke();
            }
            if (firePos) {
                ctx.save();
                const f = convertGridPosToPixel(state, firePos);
                ctx.strokeStyle = "orange";
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                ctx.lineTo(f.x, f.y);
                ctx.stroke();
                ctx.restore();
            }
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.2;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.font = radius + "px Arial";
            ctx.strokeText(entity.symbol, pos.x - radius / 1.5, pos.y + 3);

            if (isSelected) {
                ctx.lineWidth = 2;
                ctx.strokeStyle = "gold";
                ctx.stroke();
            }
            if (isSelected && range) {
                ctx.lineWidth = 1;
                ctx.strokeStyle = "red";
                ctx.beginPath();
                ctx.arc(pos.x, pos.y,
                    convertGridScalarToPixel({ width }, range),
                    0, Math.PI * 2);
                ctx.stroke();
            }
            if (maxhp != null && hp > 0 && hp < maxhp) {
                ctx.fillStyle = "red";
                ctx.fillRect(pos.x - radius * 1.5, pos.y - radius * 1.5, radius * 3, 3);
                ctx.fillStyle = "green";
                ctx.fillRect(pos.x - radius * 1.5, pos.y - radius * 1.5, radius * 3 * hp / maxhp, 3);
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
    }

    onChange(state) {
        this.render(state);
    }

    /////////////////////////////////////////////////////////////////////////////
    // Mouse Handlers

    canvasMouseDown(ev) {
        ev.preventDefault();
        if (ev.button !== 0) return; // Only proceed for left-click
        this.dispatch({ type: "MOUSE_DOWN", ev });
    }

    canvasMouseUp(ev) {
        ev.preventDefault();
        if (ev.button !== 0) return; // Only proceed for left-click
        this.dispatch({ type: "MOUSE_UP", ev });
    }

    canvasMouseMove(ev) {
        ev.preventDefault();
        if (this.getState().mouse.downPos == null) return;
        this.dispatch({ type: "MOUSE_MOVE", ev });
    }

    canvasRightClick(ev) {
        ev.preventDefault();
        this.dispatch({ type: "RIGHT_CLICK", ev });
    }
}


