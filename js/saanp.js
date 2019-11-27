class Saanp {
    constructor(initialSize, ctx, numCells, offsetX, offsetY, canvasSize) {
        this.ctx = ctx;
        this.numCellsPerRow = numCells;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.canvasSize = canvasSize;
        this.cellSize = this.canvasSize / this.numCellsPerRow;
        this.food = {x: null, y: null};
        this.dead = false;
        this.eyeSize = 2;
        this.coords = [];
        this.score = 0;
        this.start(initialSize);
    }

    start(initialSize) {
        this.score = 0;
        this.direction = {x: 1, y: 0};
        this.grid = [];
        for (let i of range(this.numCellsPerRow)) {
            this.grid.push([]);
            for (let j of range(this.numCellsPerRow)) {
                this.grid[i].push(false);
            }
        }
        this.head = {
            x: Math.floor(Math.random() * (this.numCellsPerRow - 2 * initialSize)) + initialSize,
            y: Math.floor(Math.random() * (this.numCellsPerRow - 2 * initialSize)) + initialSize
        };

        this.grid[this.head.x][this.head.y] = true;
        for (let i = 1; i < initialSize; i++) {
            this.grid[this.head.x - i * this.direction.x][this.head.y - i * this.direction.y] = true;
        }

        this.tail = {x: this.head.x - initialSize * this.direction.x, y: this.head.y - initialSize * this.direction.y};
        this.addFood();
        this.draw();
    }

    canMoveRight() {
        switch (this.direction.y) {
            case 1:
                return this.head.x > 0 && !this.grid[this.head.x - 1][this.head.y];
            case -1:
                return this.head.x < this.numCellsPerRow - 1 && !this.grid[this.head.x + 1][this.head.y];
        }
        switch (this.direction.x) {
            case -1:
                return this.head.y > 0 && !this.grid[this.head.x][this.head.y - 1];
            case 1:
                return this.head.y < this.numCellsPerRow - 1 && !this.grid[this.head.x][this.head.y + 1];
        }
        return 0;
    }

    canMoveLeft() {
        switch (this.direction.y) {
            case -1:
                return this.head.x > 0 && !this.grid[this.head.x - 1][this.head.y];
            case 1:
                return this.head.x < this.numCellsPerRow - 1 && !this.grid[this.head.x + 1][this.head.y];
        }
        switch (this.direction.x) {
            case 1:
                return this.head.y > 0 && !this.grid[this.head.x][this.head.y - 1];
            case -1:
                return this.head.y < this.numCellsPerRow - 1 && !this.grid[this.head.x][this.head.y + 1];
        }
        return 0;
    }

    canMoveFront() {
        switch (this.direction.y) {
            case -1:
                return this.head.y > 0 && !this.grid[this.head.x][this.head.y - 1];
            case 1:
                return this.head.y < this.numCellsPerRow - 1 && !this.grid[this.head.x][this.head.y + 1];
        }
        switch (this.direction.x) {
            case -1:
                return this.head.x > 0 && !this.grid[this.head.x - 1][this.head.y];
            case 1:
                return this.head.x < this.numCellsPerRow - 1 && !this.grid[this.head.x + 1][this.head.y];
        }
        return 0;
    }

    isFoodToLeft() {
        switch (this.direction.y) {
            case 1:
                return this.head.x < this.food.x;
            case -1:
                return this.head.x > this.food.x;
        }
        switch (this.direction.x) {
            case -1:
                return this.head.y > this.food.y;
            case 1:
                return this.head.y < this.food.y;
        }
        return 0;
    }

    isFoodToRight() {
        switch (this.direction.y) {
            case 1:
                return this.head.x > this.food.x;
            case -1:
                return this.head.x < this.food.x;
        }
        switch (this.direction.x) {
            case -1:
                return this.head.y < this.food.y;
            case 1:
                return this.head.y > this.food.y;
        }
        return 0;
    }

    isFoodAhead() {
        switch (this.direction.y) {
            case 1:
                return this.head.x === this.food.x && this.head.y > this.food.x;
            case -1:
                return this.head.x === this.food.x && this.head.y < this.food.x;
        }
        switch (this.direction.x) {
            case 1:
                return this.head.y === this.food.y && this.food.x > this.head.x;
            case -1:
                return this.head.y === this.food.y && this.food.x < this.head.x;
        }
        return 0;
    }

    isFoodBehind() {
        switch (this.direction.y) {
            case 1:
                return this.head.x === this.food.x && this.head.y < this.food.x;
            case -1:
                return this.head.x === this.food.x && this.head.y > this.food.x;
        }
        switch (this.direction.x) {
            case 1:
                return this.head.y === this.food.y && this.food.x < this.head.x;
            case -1:
                return this.head.y === this.food.y && this.food.x > this.head.x;
        }
        return 0;
    }


    addFood() {
        let availablePositions = [];
        for (let i = 0; i < this.numCellsPerRow; i++) {
            for (let j = 0; j < this.numCellsPerRow; j++) {
                if (!this.grid[i][j]) {
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

    distanceFromFood() {
        return Math.abs(this.head.x - this.food.x) + Math.abs(this.head.y - this.food.y);
    }

    changeDirection(d) {
        if (!isNaN(d)) {
            d = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'][d];
        }
        // console.log("direction", d)
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

    getCoords() {
        let coords = [];
        let q = [{...this.head}];
        let v = {};
        while (q.length > 0) {
            let front = q.shift();
            if (!v[front.x]) {
                v[front.x] = {};
            }
            v[front.x][front.y] = true;
            coords.push({...front});
            let xx = [0, 1, 0, -1];
            let yy = [1, 0, -1, 0];

            for (let i of range(4)) {
                let nx = front.x + xx[i];
                let ny = front.y + yy[i];
                if (nx >= 0 && nx < this.numCellsPerRow && ny >= 0 && ny < this.numCellsPerRow) {
                    let flag = false;
                    if (v[nx]) {
                        if (v[nx][ny]) {
                            flag = true;
                        }
                    }
                    if (!flag
                        && !!this.grid[nx][ny]) {
                        q.push({
                            x: nx,
                            y: ny
                        });
                        break;
                    }
                }
            }
        }

        return coords;
    }

    update() {
        if (this.dead) return;
        if (this.head.x + this.direction.x < 0 || this.head.x + this.direction.x >= this.numCellsPerRow
            || this.head.y + this.direction.y < 0 || this.head.y + this.direction.y >= this.numCellsPerRow) {
            this.dead = true;
            this.score -= 1000;
            return;
        }

        this.coords = this.getCoords();

        for (let i = 1; i < this.coords.length; i++) {
            if (this.head.x === this.coords[i].x && this.head.y === this.coords[i].y) {
                this.dead = true;
                this.score -= 1000;
                return;
            }
        }

        let d1 = this.distanceFromFood();
        this.head = {x: this.head.x + this.direction.x, y: this.head.y + this.direction.y};
        let d2 = this.distanceFromFood();
        if (d2 < d1) {
            this.score += 10;
        } else {
            this.score -= 10;
        }
        this.coords.unshift({...this.head});
        this.grid[this.head.x][this.head.y] = true;
        if (this.head.x === this.food.x && this.head.y === this.food.y) {
            this.addFood();
            this.score += 500;
        } else {
            let tail = this.coords.pop();
            this.grid[tail.x][tail.y] = false;
        }
    }

    drawFood() {
        this.ctx.save();
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.offsetX * this.canvasSize + this.food.x * this.cellSize, this.offsetY * this.canvasSize + this.food.y * this.cellSize, this.cellSize, this.cellSize);
        this.ctx.restore();
    }

    drawEye() {
        this.ctx.save();
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.offsetX * this.canvasSize + this.head.x * this.cellSize + this.cellSize / 2 - this.eyeSize / 2, this.offsetY * this.canvasSize + this.head.y * this.cellSize + this.cellSize / 2 - this.eyeSize / 2, this.eyeSize, this.eyeSize);
        this.ctx.restore();
    }

    drawBorders() {
        this.ctx.strokeRect(this.offsetX * this.canvasSize, this.offsetY * this.canvasSize, this.canvasSize, this.canvasSize);
    }

    draw() {
        if (this.dead) {
            return;
        }
        this.ctx.clearRect(this.offsetX * this.canvasSize, this.offsetY * this.canvasSize, this.canvasSize, this.canvasSize);
        for (let coord of this.coords)
            this.ctx.fillRect(this.offsetX * this.canvasSize + coord.x * this.cellSize, this.offsetY * this.canvasSize + coord.y * this.cellSize, this.cellSize, this.cellSize);
        this.drawFood();
        this.drawEye();
        this.drawBorders();
        this.coords = [];
    }
}
