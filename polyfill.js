export const requestAnimationFrame = window.requestAnimationFrame ||
    (function () {
        const timestep = 60;
        let lastTimestamp = performance.now(), now, timeout;
        return function (callback) {
            now = performance.now();
            timeout = Math.max(0, timestep - (now - lastTimestamp));
            lastTimestamp = now + timeout;
            return setTimeout(function () {
                callback(now + timeout);
            }, timeout);
        };
    })();
export const cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;
