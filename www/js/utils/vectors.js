
export const dist = (aPos, bPos) => {
    const xDist = aPos.x - bPos.x;
    const yDist = aPos.y - bPos.y;
    return Math.sqrt(xDist * xDist + yDist * yDist);
}

export const subtract = (aPos, bPos) => {
    return { x: aPos.x - bPos.x, y: aPos.y - bPos.y };
}

// what is the angle of this vector
// NOTE: that when subtracting two vectors in order to compute the theta
// between them, the target should be the first argument
export const vectorTheta = (vector) => {
    // shift domain from [-Math.PI, Math.PI] to [0, 2 * Math.PI]
    return (2 * Math.PI + Math.atan2(vector.y, vector.x)) % (2 * Math.PI);
}