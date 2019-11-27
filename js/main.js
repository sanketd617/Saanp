let range = (start, end, inc) => {
    return Array.from(Array(end ? (inc ? (parseInt((end - start) / inc) === ((end - start) / inc) ? parseInt((end - start) / inc) : parseInt((end - start) / inc) + 1) : end - start) : start).keys()).map(e => e * (inc ? inc : 1) + (end ? start : 0));
};

function setupCanvas(canvas) {
    let size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    let left = 0.5 * (window.innerWidth - size);
    let top = 0.5 * (window.innerHeight - size);
    canvas.style.position = 'absolute';
    canvas.style.top = top + 'px';
    canvas.style.left = left + 'px';
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    canvas.width = size;
    canvas.height = size;
    // canvas.style.border = '10px solid black';
}

window.onload = () => {
    let canvas = document.getElementById("theCanvas");
    let ctx = canvas.getContext("2d");
    let total = 36;
    setupCanvas(canvas);

    let saanp = [];
    let net = [];

    for (let i of range(parseInt(Math.sqrt(total)))) {
        for (let j of range(parseInt(Math.sqrt(total)))) {
            saanp.push(new Saanp(3, ctx, 25, i, j, Math.floor(canvas.width / Math.floor(Math.sqrt(total)))));
            net.push(new Net([7, 4, 3]));
        }
    }

    let interval = 10;
    let maxSteps = 1000;
    let steps = 0;
    let phase = 0;
    let maxPhase = 10;

    setInterval(loop, interval);


    function loop() {
        let deadCount = 0;
        for (let i of range(total)) {
            if (!saanp[i].dead) {
                saanp[i].update();
                saanp[i].draw();
                saanp[i].changeDirection(net[i].predict([
                    saanp[i].canMoveLeft(),
                    saanp[i].canMoveRight(),
                    saanp[i].canMoveFront(),
                    saanp[i].isFoodToLeft(),
                    saanp[i].isFoodToRight(),
                    saanp[i].isFoodAhead(),
                    saanp[i].isFoodBehind()
                ]));
            } else {
                deadCount++;
            }
        }
        steps += 1;
        if (deadCount === total || steps > maxSteps) {
            console.log("all dead");
            let scores = [];
            for (let i of range(total)) {
                scores.push({
                    index: i,
                    score: saanp[i].score
                });
                saanp[i].start(3);
                saanp[i].dead = false;
            }

            steps = 0;
            phase++;

            if(phase > maxPhase) {
                console.log("phase", phase, "complete")
                scores.sort((a, b) => a.score > b.score ? -1 : (a.score < b.score ? 1 : 0));
                console.log(scores)
                phase = 0;
            }
        }
    }
}

window.onkeyup = ev => {
    // saanp[i].changeDirection(ev.key);
};
