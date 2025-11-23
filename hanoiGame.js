export class HanoiGame {

    constructor(nDisks, randomize = false) {
        this._rods = [[], [], []];
        this._diskCount = nDisks;
        this._initialize(randomize);
    }

    get diskCount() {
        return this._diskCount;
    }

    get rodsCount() {
        return this._rods.length;
    }

    get isSolved() {
        return this._rods[this._rods.length - 1].length === this._diskCount;
    }

    getDisks(rodNumber) {
        return this._rods[rodNumber] || [];
    }

    move(fromRod, toRod) {
        if (this._rods[fromRod].length === 0) {
            return false
        }

        const disk = this._rods[fromRod][0];

        if (this._rods[toRod].length > 0 && this._rods[toRod][0] < disk) {
            return false;
        }

        this._rods[fromRod].shift();
        this._rods[toRod].unshift(disk);

        return true;
    }

    calculateMoves() {
        // store current state
        const currentState = this._rods.map(rod => [...rod]);

        let moves = this._startMoves();
        let fromRod = this._findRodWithDisk(this._diskCount);
        let toRod = 2;
        if (fromRod === toRod) {
            return moves;
        }
        let auxiliaryRod = this._getAuxiliaryRod(fromRod, toRod);
        moves = moves.concat(this._calculateMoves(this._diskCount, fromRod, toRod, auxiliaryRod));

        // restore state
        this._rods = currentState

        return this._removeBackAndForthMoves(moves);
    }

    _removeBackAndForthMoves(moves) {
        let currentMoves = [...moves];

        while (true) {

            let optimizedMoves = [];
            let changesMade = false;
            let i = 0;

            while (i < currentMoves.length) {
                if (i < currentMoves.length - 1 &&
                    currentMoves[i].from === currentMoves[i + 1].to &&
                    currentMoves[i].to === currentMoves[i + 1].from) {
                    i += 2; // skip both moves
                    changesMade = true;
                } else {
                    optimizedMoves.push(currentMoves[i]);
                    i++;
                }
            }

            if (!changesMade) {
                return optimizedMoves;
            }

            currentMoves = optimizedMoves;

        }

    }

    _startMoves() {
        let moves = [];

        for (let i = 1; i < this._diskCount; i++) {
            let fromRod = this._findRodWithDisk(i);
            let toRod = this._findRodWithDisk(i + 1);
            if (fromRod === toRod) {
                continue;
            }
            let auxiliaryRod = this._getAuxiliaryRod(fromRod, toRod);
            moves = moves.concat(this._calculateMoves(i, fromRod, toRod, auxiliaryRod));
        }

        return moves;
    }

    _calculateMoves(n, source, target, auxiliary) {
        let moves = [];
        if (n === 1) {
            moves.push({ from: source, to: target });
            this.move(source, target);
            return moves;
        }
        moves = moves.concat(this._calculateMoves(n - 1, source, auxiliary, target));
        moves.push({ from: source, to: target });
        this.move(source, target);
        moves = moves.concat(this._calculateMoves(n - 1, auxiliary, target, source));

        return moves;
    }

    _getAuxiliaryRod(source, target) {
        return 3 - source - target;
    }

    _findRodWithDisk(diskSize) {
        for (let rodIndex = 0; rodIndex < this._rods.length; rodIndex++) {
            if (this._rods[rodIndex].includes(diskSize)) {
                return rodIndex;
            }
        }
        return -1; // Not found
    }

    _initialize(randomize) {
        if (!randomize) {
            this._initializeOrdered();
        } else {
            this._initializeRandom();
        }
    }

    _initializeOrdered() {
        for (let i = this._diskCount; i >= 1; i--) {
            this._rods[0].unshift(i);
        }
    }

    _initializeRandom() {
        const nRods = this._rods.length;
        for (let i = this._diskCount; i >= 1; i--) {
            const randomRod = Math.floor(Math.random() * nRods);
            this._rods[randomRod].unshift(i);
        }
    }

}
