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
    canvas.style.border = '10px solid black';
}

window.onload = () => {
    let canvas = document.getElementById("theCanvas");
    let ctx = canvas.getContext("2d");
    setupCanvas(canvas);

    let saanp = new Saanp(3, ctx, 25);

    let interval = 150;

    setInterval(loop, interval);

    function loop() {
        if (!saanp.dead) {
            saanp.update();
            saanp.draw();
        }
    }

    window.onkeyup = ev => {
        saanp.changeDirection(ev.key);
    };
};
