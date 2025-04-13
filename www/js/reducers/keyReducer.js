export const keyReducer = (state, action) => {

    switch (action.type) {
        case 'KEY_DOWN': {
            const { key, playerID } = action;
            const { entities } = state;
            let thetaMult = 0;
            if (key == "KeyA" || key == "ArrowLeft") {
                thetaMult = -1;
            } else if (key == "KeyD" || key == "ArrowRight") {
                thetaMult = 1;
            }
            if (thetaMult == 0) return state;

            for (const id in entities) {
                const entity = entities[id];
                if (!entity.isSelected || playerID != entity.playerID) continue;
                const shouldEnqueue = entity.thetaSpeed == 0;
                entity.thetaSpeed = thetaMult * entity.maxThetaSpeed;
                if (!shouldEnqueue) continue;
                for (let follower of entity.followers) {
                    follower.actionQueue.push({
                        ticks: follower.tickOffset,
                        thetaSpeed: entity.thetaSpeed,
                    });
                }
            }
            return state;
        }
        case 'KEY_UP': {
            const { key, playerID } = action;
            const { entities } = state;
            if (key == "KeyA" || key == "ArrowLeft" || key == "KeyD" || key == "ArrowRight") {
                for (const id in entities) {
                    const entity = entities[id];
                    if (!entity.isSelected || playerID != entity.playerID) continue;
                    entity.thetaSpeed = 0;
                    for (let follower of entity.followers) {
                        follower.actionQueue.push({
                            ticks: follower.tickOffset,
                            thetaSpeed: entity.thetaSpeed,
                        });
                    }
                }
            }
            return state;
        }
    }
    return state;
};