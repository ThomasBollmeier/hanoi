const diskCountInput = document.getElementById('diskCount');
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

function initGame() {
    const count = parseInt(diskCountInput.value);
    if (count < 1 || count > 8) {
        alert('Please enter a number between 1 and 8');
        return;
    }

    // Clear all rods
    Object.values(rods).forEach(rod => rod.innerHTML = '');
    
    disks = [];
    // Create disks on rod 1
    for (let i = count; i >= 1; i--) {
        const disk = document.createElement('div');
        disk.classList.add('disk');
        const width = 40 + (i * 20); // Base width + increment
        disk.style.width = `${width}px`;
        disk.style.setProperty('--hue', 200 + (i * 20));
        disk.style.bottom = `${(count - i) * 27}px`; // 25px height + 2px margin
        disk.dataset.size = i;
        rods[1].appendChild(disk);
        disks.push(disk);
    }
    
    statusDisplay.textContent = 'Ready to start';
    isAnimating = false;
    solveBtn.disabled = false;
    diskCountInput.disabled = false;
}

function getHanoiMoves(n, source, target, auxiliary) {
    if (n === 1) {
        moves.push({ from: source, to: target });
        return;
    }
    getHanoiMoves(n - 1, source, auxiliary, target);
    moves.push({ from: source, to: target });
    getHanoiMoves(n - 1, auxiliary, target, source);
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
    const fromRod = rods[move.from];
    const toRod = rods[move.to];
    
    // Get the top disk from source rod
    // Since we used absolute positioning and bottom, the "top" disk is the one with the highest bottom value, 
    // or simply the last child if we appended them in order. 
    // Wait, in initGame I appended them: largest (i=count) first? No loop is i=count down to 1.
    // So i=count (largest) is at bottom=0. i=1 (smallest) is at top.
    // But appendChild adds to end of list.
    // Let's check initGame logic again.
    // i=count (largest). bottom=0. appended first.
    // i=count-1. bottom=27. appended second.
    // ...
    // i=1 (smallest). bottom=... appended last.
    // So lastElementChild is the top disk. Correct.
    
    const disk = fromRod.lastElementChild;
    
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
    toRod.appendChild(disk);
    disk.style.bottom = `${newBottom}px`;
    
    await new Promise(resolve => setTimeout(resolve, animationSpeed));
    
    if (isAnimating) {
        requestAnimationFrame(animate);
    }
}

solveBtn.addEventListener('click', () => {
    if (isAnimating) return;
    
    const count = parseInt(diskCountInput.value);
    // Reset game first to ensure clean state
    initGame();
    
    moves = [];
    getHanoiMoves(count, 1, 3, 2);
    
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

// Initial setup
initGame();
