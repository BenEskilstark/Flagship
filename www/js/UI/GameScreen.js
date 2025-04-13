import StatefulHTML from './StatefulHTML.js';
import { config } from '../config.js';

export default class GameScreen extends StatefulHTML {
    prevScreen = "LOBBY"

    connectedCallback() { }

    onChange({ screen }) {
        if (this.prevScreen == "LOBBY" && screen == "GAME") {
            this.prevScreen = screen;
            this.innerHTML = `
                <top-bar style="display: block; width: 100%; margin: 5px;"></top-bar>
                <game-board>
                    <canvas id="canvas" class="boardcanvas" 
                        width=${config.canvasWidth} height=${config.canvasHeight}
                        onmousedown="closest('game-board').canvasMouseDown(event)"
                        onmousemove="closest('game-board').canvasMouseMove(event)"
                        onmouseup="closest('game-board').canvasMouseUp(event)"
                        oncontextmenu="closest('game-board').canvasRightClick(event)">
                    </canvas>
                </game-board>
        `;
        } else if (this.prevScreen == "GAME" && screen == "LOBBY") {
            this.innerHTML = "";
        }
        this.prevScreen = screen;
    }
}