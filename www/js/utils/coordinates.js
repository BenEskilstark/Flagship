export function convertPixelToGridPos({ width, height }, ev) {
    const canvas = document.getElementById("canvas");
    if (!canvas) return;
    const sqWidth = canvas.getBoundingClientRect().width / width;
    const sqHeight = canvas.getBoundingClientRect().height / height;

    const x = Math.floor(ev.offsetX / sqWidth);
    const y = Math.floor(ev.offsetY / sqHeight);
    return { x, y }
}

export function convertGridPosToPixel({ width, height }, { x, y }) {
    const canvas = document.getElementById("canvas");
    if (!canvas) return;
    const sqWidth = canvas.getBoundingClientRect().width / width;
    const sqHeight = canvas.getBoundingClientRect().height / height;

    return { x: x * sqWidth, y: y * sqHeight };
}

export function convertGridScalarToPixel({ width }, scalar) {
    const canvas = document.getElementById("canvas");
    if (!canvas) return;
    const sqWidth = canvas.getBoundingClientRect().width / width;
    return scalar * sqWidth;
}