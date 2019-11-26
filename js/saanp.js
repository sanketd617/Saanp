class Saanp {
    constructor(initialSize, ctx, numCells) {
        this.ctx = ctx;
        this.numCellsPerRow = numCells;
        this.body = [{x: initialSize + 1, y: 1}];
        this.cellSize = this.ctx.canvas.height / this.numCellsPerRow;
        this.direction = {x: 1, y: 0};
        this.food = {x: null, y: null};
        this.dead = false;
        this.eyeSize = 5;
        for (let i = 1; i < initialSize; i++) {
            this.body.push({
                x: this.body[i - 1].x - 1,
                y: 1
            });
        }

        this.tail = {x: this.body[initialSize - 1].x, y: this.body[initialSize - 1].y};
        this.addFood();
        this.drawOnce();
        this.drawFood();
    }

    addFood() {
        let availablePositions = [];
        for (let i = 0; i < this.numCellsPerRow; i++) {
            for (let j = 0; j < this.numCellsPerRow; j++) {
                let available = true;
                for (let part of this.body) {
                    if (i === part.x && j === part.y) {
                        available = false;
                        break;
                    }
                }
                if (available) {
                    availablePositions.push({x: i, y: j});
                }
            }
        }
        let chosenPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
        this.food = {
            x: chosenPosition.x,
            y: chosenPosition.y
        };
        this.drawFood();
    }

    changeDirection(d) {
        switch (d) {
            case 'ArrowUp':
                if (this.direction.y === 1) return;
                this.direction = {x: 0, y: -1};
                break;
            case 'ArrowRight':
                if (this.direction.x === -1) return;
                this.direction = {x: 1, y: 0};
                break;
            case 'ArrowDown':
                if (this.direction.y === -1) return;
                this.direction = {x: 0, y: 1};
                break;
            case 'ArrowLeft':
                if (this.direction.x === 1) return;
                this.direction = {x: -1, y: 0};
                break;
        }
    }

    update() {
        let head = this.body[0];
        if (head.x + this.direction.x < 0 || head.x + this.direction.x >= this.numCellsPerRow
            || head.y + this.direction.y < 0 || head.y + this.direction.y >= this.numCellsPerRow) {
            this.dead = true;
            return;
        }

        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                this.dead = true;
                return;
            }
        }

        this.body.unshift({x: head.x + this.direction.x, y: head.y + this.direction.y});
        if (this.body[0].x === this.food.x && this.body[0].y === this.food.y)
            this.addFood();
        else
            this.tail = this.body.pop();
    }

    drawFood() {
        this.ctx.save();
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.food.x * this.cellSize, this.food.y * this.cellSize, this.cellSize, this.cellSize);
        this.ctx.restore();
    }

    drawEye() {
        this.ctx.save();
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.body[0].x * this.cellSize + this.cellSize / 2 - this.eyeSize / 2, this.body[0].y * this.cellSize + this.cellSize / 2 - this.eyeSize / 2, this.eyeSize, this.eyeSize);
        this.ctx.restore();
    }

    drawOnce() {
        this.ctx.save();
        if (this.dead) {
            this.ctx.globalAlpha = 0.3;
            this.ctx.strokeStyle = 'red';
        }
        this.ctx.beginPath();
        for (let i = 1; i < this.numCellsPerRow; i++) {
            this.ctx.moveTo(0, i * this.cellSize);
            this.ctx.lineTo(this.ctx.canvas.width, i * this.cellSize);
            this.ctx.stroke();
        }

        for (let i = 1; i < this.numCellsPerRow; i++) {
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.ctx.canvas.height);
            this.ctx.stroke();
        }
        this.ctx.closePath();
        this.ctx.restore();
        for (let part of this.body) {
            this.ctx.fillRect(part.x * this.cellSize, part.y * this.cellSize, this.cellSize, this.cellSize);
        }
        this.drawEye();
    }

    draw() {
        if (this.dead) {
            this.drawOnce();
            return;
        }
        this.ctx.clearRect(this.tail.x * this.cellSize, this.tail.y * this.cellSize, this.cellSize, this.cellSize);
        this.ctx.strokeRect(this.tail.x * this.cellSize, this.tail.y * this.cellSize, this.cellSize, this.cellSize);
        this.ctx.fillRect(this.body[1].x * this.cellSize, this.body[1].y * this.cellSize, this.cellSize, this.cellSize);
        this.ctx.fillRect(this.body[0].x * this.cellSize, this.body[0].y * this.cellSize, this.cellSize, this.cellSize);
        this.drawEye();
    }
}
