let currentScreen = 1;
const totalScreens = 6;
let candlesExtinguished = 0;
const totalCandles = 5;
let cakeCut = false;
let knifeStartX = 0;
let knifeEndX = 0;
let isKnifeDragging = false;
let giftOpened = false;

const screens = document.querySelectorAll('.screen');
const progressText = document.querySelector('.progress-text');
const musicButton = document.getElementById('musicButton');
const birthdayMusic = document.getElementById('birthdayMusic');

const openEnvelopeBtn = document.getElementById('openEnvelopeBtn');
const candles = document.querySelectorAll('.candle');
const wishMessage = document.getElementById('wishMessage');
const continueFromWishBtn = document.getElementById('continueFromWishBtn');

const knife = document.getElementById('knife');
const cakeToCut = document.getElementById('cakeToCut');
const cutMessage = document.getElementById('cutMessage');
const continueFromCutBtn = document.getElementById('continueFromCutBtn');
const cakeCuttingContainer = document.getElementById('cakeCuttingContainer');

const nextMemoryBtn = document.getElementById('nextMemoryBtn');
const finalSurpriseBtn = document.getElementById('finalSurpriseBtn');
const giftBox = document.getElementById('giftBox');
const finalCelebration = document.getElementById('finalCelebration');

function updateProgress() {
    const padded = String(currentScreen).padStart(2, '0');
    progressText.textContent = `${padded} / 06`;
}

function goToScreen(screenNumber) {
    if (screenNumber < 1 || screenNumber > totalScreens) return;

    screens.forEach((screen, index) => {
        if (index + 1 === currentScreen) {
            screen.classList.remove('active');
        }
    });

    currentScreen = screenNumber;
    screens[screenNumber - 1].classList.add('active');
    updateProgress();
}

musicButton.addEventListener('click', () => {
    if (birthdayMusic.paused) {
        birthdayMusic.play().catch(err => {
            console.log('Music autoplay blocked by browser:', err);
        });
        musicButton.classList.add('playing');
    } else {
        birthdayMusic.pause();
        musicButton.classList.remove('playing');
    }
});

openEnvelopeBtn.addEventListener('click', () => {
    const card = document.querySelector('.envelope-card');
    card.style.animation = 'none';
    
    setTimeout(() => {
        goToScreen(2);
    }, 300);
});

candles.forEach((candle, index) => {
    candle.addEventListener('click', () => {
        extinguishCandle(candle);
    });

    candle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        extinguishCandle(candle);
    });
});

function extinguishCandle(candle) {
    const flame = candle.querySelector('.flame');
    
    if (flame.classList.contains('extinguished')) return;

    flame.classList.add('extinguished');
    candlesExtinguished++;

    createSmoke(candle);

    if (candlesExtinguished === totalCandles) {
        setTimeout(() => {
            wishMessage.style.display = 'flex';
            wishMessage.style.flexDirection = 'column';
            wishMessage.style.alignItems = 'center';
        }, 500);
    }
}

function createSmoke(candle) {
    const smoke = document.createElement('div');
    smoke.className = 'smoke';
    smoke.style.left = candle.offsetLeft + candle.offsetWidth / 2 - 10 + 'px';
    smoke.style.top = candle.offsetTop - 20 + 'px';
    candle.parentElement.appendChild(smoke);

    setTimeout(() => {
        smoke.remove();
    }, 1500);
}

continueFromWishBtn.addEventListener('click', () => {
    goToScreen(3);
});

knife.addEventListener('mousedown', (e) => {
    if (cakeCut) return;
    isKnifeDragging = true;
    knifeStartX = e.clientX;
    knife.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (isKnifeDragging && !cakeCut) {
        const containerRect = cakeCuttingContainer.getBoundingClientRect();
        const newX = e.clientX - containerRect.left;
        const maxX = containerRect.width - 40;
        knife.style.left = Math.max(0, Math.min(newX - 20, maxX)) + 'px';
    }
});

document.addEventListener('mouseup', (e) => {
    if (isKnifeDragging) {
        isKnifeDragging = false;
        knifeEndX = e.clientX;
        knife.style.cursor = 'grab';
        
        const distance = Math.abs(knifeEndX - knifeStartX);
        if (distance > 100) {
            performCutAnimation();
        }
    }
});

knife.addEventListener('touchstart', (e) => {
    if (cakeCut) return;
    isKnifeDragging = true;
    knifeStartX = e.touches[0].clientX;
});

document.addEventListener('touchmove', (e) => {
    if (isKnifeDragging && !cakeCut) {
        const containerRect = cakeCuttingContainer.getBoundingClientRect();
        const newX = e.touches[0].clientX - containerRect.left;
        const maxX = containerRect.width - 40;
        knife.style.left = Math.max(0, Math.min(newX - 20, maxX)) + 'px';
    }
});

document.addEventListener('touchend', (e) => {
    if (isKnifeDragging) {
        isKnifeDragging = false;
        knifeEndX = e.changedTouches[0].clientX;
        
        const distance = Math.abs(knifeEndX - knifeStartX);
        if (distance > 80) {
            performCutAnimation();
        }
    }
});

function performCutAnimation() {
    if (cakeCut) return;
    
    cakeCut = true;
    knife.style.pointerEvents = 'none';

    cakeToCut.classList.add('cake-split');

    createConfetti();
    createHearts();

    setTimeout(() => {
        cutMessage.style.display = 'flex';
        cutMessage.style.flexDirection = 'column';
        cutMessage.style.alignItems = 'center';
    }, 600);
}

function createConfetti() {
    const colors = ['#ff69b4', '#ffb3d9', '#ffa3d0', '#ff94c9', '#ffc0cb'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = window.innerHeight / 2 + 'px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.opacity = Math.random();
        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

function createHearts() {
    const hearts = ['💕', '❤️', '💗', '💖'];
    
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-float';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * window.innerWidth + 'px';
        heart.style.top = window.innerHeight / 2 + 'px';
        heart.style.fontSize = (20 + Math.random() * 20) + 'px';
        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 3000);
    }
}

continueFromCutBtn.addEventListener('click', () => {
    goToScreen(4);
});

nextMemoryBtn.addEventListener('click', () => {
    goToScreen(5);
});

const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        item.style.animation = 'none';
        setTimeout(() => {
            item.style.animation = '';
        }, 10);
    });
});

finalSurpriseBtn.addEventListener('click', () => {
    goToScreen(6);
});

giftBox.addEventListener('click', () => {
    if (giftOpened) return;
    
    giftOpened = true;
    giftBox.classList.add('opened');

    createConfetti();
    
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-float';
        heart.textContent = '❤️';
        heart.style.left = Math.random() * window.innerWidth + 'px';
        heart.style.top = window.innerHeight + 'px';
        heart.style.fontSize = (20 + Math.random() * 25) + 'px';
        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 3000);
    }

    setTimeout(() => {
        giftBox.style.display = 'none';
        document.querySelector('.gift-instruction').style.display = 'none';
        finalCelebration.style.display = 'block';
    }, 600);
});

giftBox.addEventListener('touchstart', (e) => {
    e.preventDefault();
    giftBox.click();
});

document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
    console.log('🎂 Birthday Surprise Website Loaded! 💕');
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        if (currentScreen === 1) {
            openEnvelopeBtn.click();
        } else if (currentScreen === 2 && candlesExtinguished === totalCandles) {
            continueFromWishBtn.click();
        } else if (currentScreen === 3 && cakeCut) {
            continueFromCutBtn.click();
        } else if (currentScreen === 4) {
            nextMemoryBtn.click();
        } else if (currentScreen === 5) {
            finalSurpriseBtn.click();
        }
    }
});