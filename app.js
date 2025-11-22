import { HanoiGame } from './hanoiGame.js';

const diskCountInput = document.getElementById('diskCount');
const randomizeCheckbox = document.getElementById('randomize');
const solveBtn = document.getElementById('solveBtn');
const resetBtn = document.getElementById('resetBtn');
const statusDisplay = document.getElementById('status');
const rods = {
    1: document.querySelector('#rod1 .disks'),
    2: document.querySelector('#rod2 .disks'),
    3: document.querySelector('#rod3 .disks')
};

let isAnimating = false;
let animationSpeed = 500; // ms
let moves = [];
let disks = [];
let game;

function initGame() {
    const count = parseInt(diskCountInput.value);
    if (count < 1 || count > 8) {
        alert('Please enter a number between 1 and 8');
        return;
    }

    const randomize = randomizeCheckbox.checked;
    game = new HanoiGame(count, randomize);

    // Clear all rods
    Object.values(rods).forEach(rod => rod.innerHTML = '');

    // Create disks 
    for (let rodNum = 0; rodNum < game.rodsCount; rodNum++) {
        const rodDisks = game.getDisks(rodNum);
        const nDisks = rodDisks.length;
        rodDisks.forEach((diskSize, index) => {
            const revIndex = nDisks - index - 1;
            const disk = document.createElement('div');
            disk.classList.add('disk');
            const width = 40 + (diskSize * 20); // Base width + increment
            disk.style.width = `${width}px`;
            disk.style.setProperty('--hue', 200 + (diskSize * 20));
            disk.style.bottom = `${revIndex * 27}px`; // 25px height + 2px margin
            disk.dataset.size = diskSize;
            rods[rodNum + 1].appendChild(disk);
            disks.push(disk);
        });
    }

    statusDisplay.textContent = 'Ready to start';
    isAnimating = false;
    solveBtn.disabled = false;
    diskCountInput.disabled = false;
}

async function animate() {
    if (moves.length === 0) {
        isAnimating = false;
        solveBtn.disabled = false;
        diskCountInput.disabled = false;
        statusDisplay.textContent = 'Solved!';
        return;
    }

    const move = moves.shift();
    const fromRod = rods[move.from + 1];
    const toRod = rods[move.to + 1];
    const disk = fromRod.firstElementChild;

    if (!disk) {
        console.error('No disk found on rod', move.from);
        return;
    }

    // Animate movement
    // For simplicity in this version, we'll just append to the new rod and update bottom position
    // A more complex version would use FLIP or transform for smooth path animation

    // Calculate new bottom position on target rod
    const targetCount = toRod.childElementCount;
    const newBottom = targetCount * 27;

    // Visual transition could be improved here, but let's stick to the logic first
    // To make it look like it moves up, over, and down, we'd need more complex CSS/JS.
    // For now, let's just "teleport" logically but maybe add a small delay or class for effect?
    // Actually, let's try to make it slightly smoother by just updating the DOM after a delay

    statusDisplay.textContent = `Moving disk from Rod ${move.from} to Rod ${move.to}`;

    // Move the element
    toRod.insertBefore(disk, toRod.firstChild);
    disk.style.bottom = `${newBottom}px`;

    await new Promise(resolve => setTimeout(resolve, animationSpeed));

    if (isAnimating) {
        requestAnimationFrame(animate);
    }
}

solveBtn.addEventListener('click', () => {
    if (isAnimating) return;

    moves = game.calculateMoves();

    isAnimating = true;
    solveBtn.disabled = true;
    diskCountInput.disabled = true;
    animate();
});

resetBtn.addEventListener('click', () => {
    isAnimating = false;
    moves = [];
    initGame();
});

diskCountInput.addEventListener('change', initGame);

randomizeCheckbox.addEventListener('change', initGame);

// Initial setup
initGame();
