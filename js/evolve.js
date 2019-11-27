const Evolver = {};

Evolver.generateNewPopulation = (nets, scores) => {
    let selectedNets = Evolver.selectBest(scores).map(s => s.index);
    let selectedSize = selectedNets.length;
    let populationSize = nets.length;
    let newPopulation = [];

    for(let i = 0; i < populationSize; i++) {
        let indexA = selectedNets[Math.floor(Math.random() * selectedSize)];
        let indexB = selectedNets[Math.floor(Math.random() * selectedSize)];
        let parentA = nets[indexA];
        let parentB = nets[indexB];
        newPopulation.push(Evolver.crossOver(parentA, parentB));
    }
    return newPopulation;
};

Evolver.selectBest = (scores) => {
    return scores.slice(0, parseInt(scores.length / 2));
};

Evolver.crossOver = (parentA, parentB) => {
    let childWeights = [];
    for(let i = 0; i < parentA.weights.length; i++) {
        let weightA = parentA.weights[i];
        let weightB = parentB.weights[i];
        let newWeight = [];
        for(let j = 0; j < weightA.length; j++) {
            newWeight.push([]);
            for(let k = 0; k < weightA[0].length; k++) {
                let probability = Math.random();

                if(probability < 0.45) {
                    newWeight[j].push(weightA[j][k]);
                }
                else if(probability > 0.55) {
                    newWeight[j].push(weightB[j][k]);
                }
                else {
                    newWeight[j].push([-1, 1][Math.floor(Math.random() * 2)] * Math.random());
                }

            }
        }
        childWeights.push(newWeight);
    }
    return new Net(parentA.config, childWeights);
};
