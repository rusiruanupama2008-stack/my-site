const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
const nameDisplay = document.getElementById('nameDisplay');

let w, h, particles = [];
let mode = 0;
let nameFadeTimer = null;
let decodeAnimationId = null;
const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソ0123456789';

function init() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = (Math.random() - 0.5) * 8;
        this.life = 1;
        this.decay = 0.015;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.1;
        this.originX = x;
        this.originY = y;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;

        switch (mode) {
            case 0:
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
                break;
            case 3:
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size * 5, 0, Math.PI * 2); ctx.stroke();
                break;
            case 5:
                ctx.beginPath(); ctx.translate(this.x, this.y); ctx.rotate(this.angle);
                ctx.moveTo(0, -this.size * 4); ctx.lineTo(this.size * 3, this.size * 3);
                ctx.lineTo(-this.size * 3, this.size * 3); ctx.closePath(); ctx.stroke();
                break;
            case 8:
                ctx.strokeRect(this.x - 10, this.y - 10, 20, 20);
                break;
            case 10:
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2); ctx.fill();
                ctx.globalAlpha = this.life * 0.3;
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2); ctx.stroke();
                break;
            case 11:
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x + (Math.random() - 0.5) * 30, this.y + (Math.random() - 0.5) * 30);
                ctx.lineTo(this.x + (Math.random() - 0.5) * 60, this.y + (Math.random() - 0.5) * 60);
                ctx.lineWidth = Math.random() * 3;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 20;
                ctx.stroke();
                break;
            case 12:
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size * 0.8, 0, Math.PI * 2); ctx.fill();
                break;
            case 13:
                ctx.font = `${this.size * 6}px monospace`;
                ctx.fillText(String.fromCharCode(0x30A0 + Math.random() * 96), this.x, this.y);
                break;
            case 14:
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2); ctx.fill();
                ctx.globalAlpha = this.life * 0.5;
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size * 5, 0, Math.PI * 2); ctx.stroke();
                break;
            case 15:
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const px = this.x + Math.cos(this.angle + i) * this.size * 8;
                    const py = this.y + Math.sin(this.angle + i) * this.size * 8;
                    ctx.lineTo(px, py);
                }
                ctx.lineWidth = 2;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 15;
                ctx.stroke();
                break;
            case 16:
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                for (let i = 0; i < 6; i++) {
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(this.size * 12, 0);
                    ctx.rotate(Math.PI / 3);
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
                break;
            case 17:
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
                ctx.globalAlpha = this.life * 0.2;
                ctx.beginPath(); ctx.ellipse(this.x, this.y, this.size * 10, this.size * 3, this.angle, 0, Math.PI * 2); ctx.stroke();
                break;
            case 18:
                ctx.fillRect(this.x, this.y, Math.random() * 40 + 5, Math.random() * 4 + 1);
                break;
            case 19:
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
                break;
            default:
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
    }

    update() {
        switch (mode) {
            case 0:
                this.x += this.speedX + (Math.random() - 0.5) * 4;
                this.y += this.speedY + (Math.random() - 0.5) * 4;
                break;
            case 1:
                this.x += Math.cos(this.angle) * 4;
                this.y += Math.sin(this.angle) * 4;
                this.angle += 0.1;
                break;
            case 2:
                this.x += Math.cos(this.angle) * 10;
                this.y += Math.sin(this.angle) * 10;
                this.angle += 0.2;
                break;
            case 3:
                this.size += 1.2;
                this.decay = 0.03;
                break;
            case 4:
                this.y += 10;
                break;
            case 6:
                this.angle += 0.05;
                break;
            case 7:
                this.x += (w / 2 - this.x) * 0.05;
                this.y += (h / 2 - this.y) * 0.05;
                break;
            case 9:
                this.speedY += 0.1;
                this.x += this.speedX;
                this.y += this.speedY;
                break;
            case 10:
                this.angle += 0.08;
                this.x += Math.cos(this.angle) * 6 + this.speedX * 0.3;
                this.y += Math.sin(this.angle * 2) * 3 + this.speedY * 0.5;
                this.decay = 0.008;
                break;
            case 11:
                this.x += (Math.random() - 0.5) * 20;
                this.y += (Math.random() - 0.5) * 20;
                this.decay = 0.05;
                break;
            case 12:
                {
                    const dx = w / 2 - this.x;
                    const dy = h / 2 - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle + 1.5) * 5;
                    this.y += Math.sin(angle + 1.5) * 5;
                    if (dist < 10) this.life = 0;
                    this.decay = 0.004;
                }
                break;
            case 13:
                this.y += 6 + this.size * 2;
                this.decay = 0.008;
                if (this.y > h) this.life = 0;
                break;
            case 14:
                this.speedX *= 0.98;
                this.speedY *= 0.98;
                this.speedY += 0.05;
                this.x += this.speedX;
                this.y += this.speedY;
                this.decay = 0.012;
                break;
            case 15:
                this.angle += 0.06;
                this.x += Math.cos(this.angle * 3) * 3 + this.speedX * 0.5;
                this.y += Math.sin(this.angle * 2) * 4 + this.speedY * 0.5;
                this.decay = 0.006;
                break;
            case 16:
                this.angle += this.spin;
                this.x += this.speedX * 0.5;
                this.y += this.speedY * 0.5;
                this.decay = 0.01;
                break;
            case 17:
                this.angle += 0.04;
                this.x = this.originX + Math.cos(this.angle) * 50;
                this.y = this.originY + Math.sin(this.angle * 1.5) * 30;
                this.decay = 0.005;
                break;
            case 18:
                if (Math.random() > 0.7) {
                    this.x += (Math.random() - 0.5) * 100;
                    this.y += (Math.random() - 0.5) * 50;
                }
                this.decay = 0.025;
                break;
            case 19:
                {
                    const dx2 = w / 2 - this.x;
                    const dy2 = h / 2 - this.y;
                    const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                    this.x += dx2 / dist2 * 8;
                    this.y += dy2 / dist2 * 8;
                    this.angle += 0.2;
                    this.x += Math.cos(this.angle) * 3;
                    this.y += Math.sin(this.angle) * 3;
                    if (dist2 < 20) this.life = 0;
                    this.decay = 0.003;
                }
                break;
            default:
                this.x += this.speedX;
                this.y += this.speedY;
        }
        this.life -= this.decay;
    }
}

class TextParticle extends Particle {
    constructor(x, y, color) {
        super(x, y, color);
        this.life = 4.5; // Lasts ~15s
        this.decay = 0.005;
    }
    update() {
        this.x += Math.sin(this.angle) * 0.5;
        this.y += Math.cos(this.angle) * 0.5;
        this.angle += 0.02;
        this.life -= this.decay;
    }
}

function handleParticles() {
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
}

function animate() {
    if ([1, 2, 6, 10, 12, 15, 17, 19].includes(mode)) {
        ctx.fillStyle = 'rgba(0,0,0,0.06)';
        ctx.fillRect(0, 0, w, h);
    } else if (mode === 13) {
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(0, 0, w, h);
    } else {
        ctx.clearRect(0, 0, w, h);
    }
    handleParticles();

    if (mode === 13 && Math.random() > 0.5) {
        const colors = ['#00ff41', '#00cc33', '#009922'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(Math.random() * w, -10, color));
    }

    requestAnimationFrame(animate);
}

// ===== HACKER DECODE NAME DISPLAY =====
const nameInput = document.getElementById('nameInput');

function randomGlitchChar() {
    return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

function hackerDecodeReveal(targetText) {
    // Cancel any running decode
    if (decodeAnimationId) {
        clearTimeout(decodeAnimationId);
        decodeAnimationId = null;
    }

    const letters = targetText.split('');
    const totalLetters = letters.length;

    // Create letter spans
    nameDisplay.innerHTML = '';
    const spans = [];
    for (let i = 0; i < totalLetters; i++) {
        const span = document.createElement('span');
        span.className = 'name-letter decoding';
        span.textContent = randomGlitchChar();
        nameDisplay.appendChild(span);
        spans.push(span);
    }

    nameDisplay.classList.remove('fading');
    nameDisplay.classList.add('visible');

    // Each letter decodes after a delay
    // Scramble phase: all letters show random chars rapidly
    // Then one by one, from left to right, they "lock in" to the real letter
    const SCRAMBLE_SPEED = 40;    // ms between scramble updates
    const DECODE_DELAY = 120;     // ms between each letter locking in
    const SCRAMBLE_ROUNDS = 8;    // how many scramble cycles before first letter locks

    let scrambleCount = 0;
    let lockedCount = 0;

    function scrambleStep() {
        scrambleCount++;

        // Update all unlocked letters with random chars
        for (let i = lockedCount; i < totalLetters; i++) {
            spans[i].textContent = randomGlitchChar();
        }

        // After enough scramble rounds, start locking letters
        if (scrambleCount > SCRAMBLE_ROUNDS + lockedCount * (DECODE_DELAY / SCRAMBLE_SPEED)) {
            if (lockedCount < totalLetters) {
                // Lock this letter
                const span = spans[lockedCount];
                const char = letters[lockedCount];
                // Handle spaces with &nbsp;
                span.innerHTML = char === ' ' ? '&nbsp;' : char;
                span.className = 'name-letter decoded';
                lockedCount++;
            }
        }

        // Continue until all letters are locked
        if (lockedCount < totalLetters) {
            decodeAnimationId = setTimeout(scrambleStep, SCRAMBLE_SPEED);
        } else {
            // All decoded! Start floating animation
            setTimeout(() => {
                spans.forEach(s => {
                    s.classList.remove('decoded');
                    s.classList.add('floating');
                });
            }, 600);

            decodeAnimationId = null;
        }
    }

    scrambleStep();
}

// Debounce timer for input
let inputDebounce = null;

nameInput.addEventListener('input', () => {
    const text = nameInput.value.toUpperCase();

    // Clear timers
    if (nameFadeTimer) {
        clearTimeout(nameFadeTimer);
        nameFadeTimer = null;
    }
    if (inputDebounce) {
        clearTimeout(inputDebounce);
        inputDebounce = null;
    }

    if (text) {
        // Debounce: wait 300ms after last keystroke to start decode animation
        // This prevents the animation restarting on every single keystroke
        inputDebounce = setTimeout(() => {
            hackerDecodeReveal(text);

            // Auto fade after 15 seconds
            nameFadeTimer = setTimeout(() => {
                nameDisplay.classList.add('fading');
                nameDisplay.classList.remove('visible');
                nameInput.value = ''; // Auto delete text
                setTimeout(() => {
                    nameDisplay.innerHTML = '';
                    nameDisplay.classList.remove('fading');
                }, 2000);
            }, 15000);
        }, 300);

        // Immediately show scrambled text while typing (instant feedback)
        if (decodeAnimationId) {
            clearTimeout(decodeAnimationId);
            decodeAnimationId = null;
        }

        nameDisplay.innerHTML = '';
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.className = 'name-letter decoding';
            const char = text[i];
            span.innerHTML = char === ' ' ? '&nbsp;' : char; // Handle SPACE key
            nameDisplay.appendChild(span);
        }
        nameDisplay.classList.remove('fading');
        nameDisplay.classList.add('visible');
    } else {
        if (decodeAnimationId) {
            clearTimeout(decodeAnimationId);
            decodeAnimationId = null;
        }
        nameDisplay.classList.remove('visible');
        nameDisplay.classList.add('fading');
        setTimeout(() => {
            nameDisplay.innerHTML = '';
            nameDisplay.classList.remove('fading');
        }, 1000);
    }

    // Particle text on canvas
    if (!text) return;
    particles = particles.filter(p => !(p instanceof TextParticle));
    const colors = ['#00f2ff', '#7000ff', '#ff0077', '#00ffaa', '#ffea00'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = 800;
    tempCanvas.height = 150;
    tempCtx.fillStyle = 'white';
    tempCtx.font = 'bold 80px Orbitron';
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';
    tempCtx.fillText(text, 400, 75);
    const imageData = tempCtx.getImageData(0, 0, 800, 150).data;
    for (let y = 0; y < 150; y += 5) {
        for (let x = 0; x < 800; x += 5) {
            const index = (y * 800 + x) * 4;
            if (imageData[index] > 128) {
                particles.push(new TextParticle(w / 2 + (x - 400), h / 2 + (y - 75) + 40, color));
            }
        }
    }
});

function setMode(m) {
    mode = m;
    particles = [];
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === m));

    if (nameInput.value) {
        nameInput.dispatchEvent(new Event('input'));
    }
}

function takeSnapshot() {
    const name = nameInput.value.toUpperCase();
    if (name) {
        ctx.save();
        ctx.font = 'bold 60px Orbitron';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#00f2ff';
        ctx.shadowBlur = 40;
        ctx.fillText(name, w / 2, h * 0.15);
        ctx.shadowColor = '#7000ff';
        ctx.shadowBlur = 80;
        ctx.fillText(name, w / 2, h * 0.15);
        ctx.restore();
    }

    const link = document.createElement('a');
    link.download = `ART_${name || 'GENESIS'}_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

// ===== MOUSE PARTICLES =====
window.addEventListener('mousemove', (e) => {
    const colors = ['#00f2ff', '#7000ff', '#ff0077', '#00ffaa'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const count = mode === 14 ? 8 : 5;
    for (let i = 0; i < count; i++) {
        const p = new Particle(e.clientX, e.clientY, color);
        if (mode === 14) {
            const angle = (Math.PI * 2 / 8) * i;
            p.speedX = Math.cos(angle) * (4 + Math.random() * 6);
            p.speedY = Math.sin(angle) * (4 + Math.random() * 6) - 3;
        }
        particles.push(p);
    }
});

// ===== TOUCH SUPPORT =====
let lastTouchX = 0, lastTouchY = 0;

window.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;
    spawnTouchParticles(touch.clientX, touch.clientY);
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const dx = touch.clientX - lastTouchX;
    const dy = touch.clientY - lastTouchY;
    const steps = Math.max(1, Math.floor(Math.sqrt(dx * dx + dy * dy) / 8));

    for (let s = 0; s < steps; s++) {
        const t = s / steps;
        const ix = lastTouchX + dx * t;
        const iy = lastTouchY + dy * t;
        spawnTouchParticles(ix, iy);
    }

    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;
}, { passive: false });

function spawnTouchParticles(x, y) {
    const colors = ['#00f2ff', '#7000ff', '#ff0077', '#00ffaa'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 4; i++) {
        const p = new Particle(x, y, color);
        if (mode === 14) {
            const angle = Math.random() * Math.PI * 2;
            p.speedX = Math.cos(angle) * (3 + Math.random() * 5);
            p.speedY = Math.sin(angle) * (3 + Math.random() * 5) - 2;
        }
        particles.push(p);
    }
}

// ===== SCREEN RECORDER =====
let mediaRecorder = null;
let recordedChunks = [];
const recordBtn = document.getElementById('recordBtn');

async function toggleRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        // Stop the stream tracks to remove the "Sharing" banner immediately
        if (mediaRecorder.stream) {
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
    } else {
        try {
            // Use getDisplayMedia to capture the full TAB (HTML + Canvas)
            // This is necessary because the name effect is HTML, not drawn on canvas
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    mediaSource: 'tab',
                    frameRate: 30
                },
                audio: false,
                preferCurrentTab: true // Helper for Chrome
            });

            mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            mediaRecorder.stream = stream; // Save reference to stop later

            mediaRecorder.ondataavailable = function (e) {
                if (e.data.size > 0) {
                    recordedChunks.push(e.data);
                }
            };

            mediaRecorder.onstop = function () {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                recordedChunks = [];
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `GENESIS_RECORDING_${Date.now()}.webm`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);

                // Reset UI
                recordBtn.innerHTML = '<i class="fas fa-video"></i>';
                recordBtn.classList.remove('recording');
                recordBtn.style.background = 'rgba(255, 255, 255, 0.05)';
            };

            // If user stops sharing from the browser floating bar
            stream.getVideoTracks()[0].onended = () => {
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
            };

            mediaRecorder.start();
            recordBtn.innerHTML = '<i class="fas fa-stop"></i>';
            recordBtn.classList.add('recording');
            recordBtn.style.background = 'rgba(255, 0, 0, 0.5)';

        } catch (err) {
            console.error("Recording cancelled or failed:", err);
        }
    }
}

window.addEventListener('resize', init);
init();
animate();
