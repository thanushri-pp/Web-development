const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const laps = document.getElementById('laps');
const limitInput = document.getElementById('limitTime');

let hr = 0, min = 0, sec = 0, ms = 0;
let timer = null;
let isRunning = false;
let lapCount = 0;
let autoStopLimit = null; // in seconds

// Update display function
function updateDisplay() {
  const h = hr.toString().padStart(2, '0');
  const m = min.toString().padStart(2, '0');
  const s = sec.toString().padStart(2, '0');
  const milli = ms.toString().padStart(2, '0'); // always show 2 digits
  display.textContent = `${h}:${m}:${s}.${milli}`;
}

// Stopwatch increment
function stopwatch() {
  ms++;
  if (ms === 100) {
    ms = 0;
    sec++;
  }
  if (sec === 60) {
    sec = 0;
    min++;
  }
  if (min === 60) {
    min = 0;
    hr++;
  }

  updateDisplay();

  // Check for auto-stop
  const totalSeconds = hr * 3600 + min * 60 + sec;
  if (autoStopLimit !== null && totalSeconds >= autoStopLimit) {
    stopStopwatch(true);
  }
}

// Start stopwatch
function startStopwatch() {
  if (isRunning) return;

  // Get auto-stop limit from input if valid
  const val = parseInt(limitInput.value);
  if (!isNaN(val) && val > 0) {
    autoStopLimit = val;
  } else {
    autoStopLimit = null;
  }

  timer = setInterval(stopwatch, 10);
  isRunning = true;

  startBtn.disabled = true;
  stopBtn.disabled = false;
  resetBtn.disabled = false;
  lapBtn.disabled = false;

  // Animate background color cycling
  startBackgroundCycle();
}

// Stop stopwatch
function stopStopwatch(autoStopped = false) {
  if (!isRunning) return;

  clearInterval(timer);
  timer = null;
  isRunning = false;

  startBtn.disabled = false;
  stopBtn.disabled = true;
  lapBtn.disabled = true;

  // Stop background color cycling, reset bg if auto-stopped
  stopBackgroundCycle(autoStopped);
}

// Reset stopwatch
function resetStopwatch() {
  if (timer) clearInterval(timer);
  timer = null;
  isRunning = false;

  hr = 0; min = 0; sec = 0; ms = 0;
  updateDisplay();

  startBtn.disabled = false;
  stopBtn.disabled = true;
  resetBtn.disabled = true;
  lapBtn.disabled = true;

  laps.innerHTML = '';
  lapCount = 0;

  resetBackground();
}

// Lap functionality
function addLap() {
  if (!isRunning) return;
  lapCount++;
  const li = document.createElement('li');
  li.textContent = `Lap ${lapCount}: ${display.textContent}`;
  laps.prepend(li);
}

// Background color cycling
let bgCycleInterval = null;
let hue = 0;

function startBackgroundCycle() {
  if (bgCycleInterval) return;
  bgCycleInterval = setInterval(() => {
    hue = (hue + 1) % 360;
    document.body.style.backgroundColor = `hsl(${hue}, 70%, 40%)`;
  }, 50);
}

function stopBackgroundCycle(autoStopped = false) {
  clearInterval(bgCycleInterval);
  bgCycleInterval = null;
  if (autoStopped) {
    alert(`⏰ Time's up! Auto-stopped at ${autoStopLimit} seconds.`);
  }
  resetBackground();
}

function resetBackground() {
  document.body.style.backgroundColor = '#222';
}

// Button events
startBtn.addEventListener('click', startStopwatch);
stopBtn.addEventListener('click', () => stopStopwatch(false));
resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', addLap);

// Initialize display and buttons
updateDisplay();
stopBtn.disabled = true;
resetBtn.disabled = true;
lapBtn.disabled = true;


