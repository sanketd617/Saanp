class Net {
    constructor(config, weights) {
        this.layers = [];
        this.weights = [];
        this.config = config;

        if (!weights) for (let n of this.config) this.addLayer(n, false);
        else {
            this.weights = weights;
            for (let n of this.config) this.addLayer(n, true);
        }
        // console.log(this.weights);
    }

    addLayer(n, weightAddedAlready) {
        let layerIndex = this.layers.length;
        this.layers.push(Array(n));

        if (layerIndex > 0) {
            let numRows = this.layers[layerIndex].length;
            let numCols = this.layers[layerIndex - 1].length;
            if (!weightAddedAlready)
                this.weights.push([...Array(numRows)].map(x => [...Array(numCols)].map(y => [-1, 1][Math.floor(Math.random() * 2)] * Math.random())));
        }
    }

    predict(data) {
        if (data.length !== this.layers[0].length) return;
        this.layers[0] = Array.from(data);
        for (let i of range(this.weights.length)) {
            for (let c of range(this.weights[i].length)) {
                this.layers[i + 1][c] = 0;
                for (let k of range(this.layers[i].length)) {
                    this.layers[i + 1][c] += this.weights[i][c][k] * this.layers[i][k];
                }
            }

            if (i !== this.weights.length - 1)
                this.layers[i + 1] = this.layers[i + 1].map(this.activate);
        }
        let sum = 0;
        for (let x of this.layers[this.weights.length])
            sum += x;
        this.layers[this.layers.length - 1] = this.layers[this.layers.length - 1].map(e => e / sum);

        let maxIndex = 0;
        for (let i = 1; i < this.layers[this.layers.length - 1].length; i++) {
            if (this.layers[this.layers.length - 1][maxIndex] < this.layers[this.layers.length - 1][i]) {
                maxIndex = i;
            }
        }
        // console.log()
        // console.log(this.layers[0])
        // console.log(this.layers[this.layers.length - 1]);
        return maxIndex;
        return maxIndex;
    }

    activate(x) {
        return 1 / (1 + Math.exp(x));
    }
}

