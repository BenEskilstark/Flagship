const isLocalHost = true;

export const config = {
    isLocalHost,
    URL: isLocalHost ? null : "https://benhub.io",
    path: isLocalHost ? null : "/flagship/socket.io",

    canvasWidth: 800, canvasHeight: 800,
    width: 800, height: 800,

    isRealtime: true,
    turnTime: 50, // ms

    startingShips: 5,
};
