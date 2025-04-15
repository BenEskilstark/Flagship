
const { floor, sqrt, random, round } = Math;

function mulberry32(a) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

const seed = 12345;
const rand = mulberry32(seed);

// return an integer between min and max, inclusive
export const randomIn = (min, max) => floor(min + rand() * (max - min + 1));

const shamefulGaussian = () => (rand() + rand() + rand() + rand() + rand() + rand() - 3) / 3;
export const normalIn = (min, max) => {
    const gaussian = (shamefulGaussian() + 1) / 2;
    return floor(min + gaussian * (max - min + 1));
};

export const oneOf = (options) => {
    if (options.length === 0) return null;
    return options[floor(rand() * options.length)];
};

// weights must be positive
export const weightedOneOf = (options, weights) => {
    const cumulativeWeights = [];
    let sum = 0;

    for (let i = 0; i < options.length; i++) {
        sum += weights[i];
        cumulativeWeights.push(sum);
    }

    const randomVal = randomIn(0, sum - 1) + 1;

    let index = 0;
    for (; randomVal > cumulativeWeights[index]; index++);

    return options[index];
};

