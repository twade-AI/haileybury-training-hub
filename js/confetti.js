/* ============================================
   Confetti & Celebration Effects
   Lightweight canvas-based particle system
   ============================================ */

const Confetti = (function () {
    'use strict';

    let canvas, ctx;
    let particles = [];
    let animationId = null;
    const COLORS = ['#9b1844', '#e6007e', '#009fe3', '#ec6608', '#009870', '#7c3aed', '#f59e0b', '#2a2b7c'];

    function init() {
        canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);
    }

    function resize() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle(x, y, type) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 6;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];

        return {
            x: x,
            y: y,
            vx: Math.cos(angle) * speed * (0.5 + Math.random()),
            vy: Math.sin(angle) * speed * (0.5 + Math.random()) - 4,
            size: type === 'star' ? 4 + Math.random() * 4 : 5 + Math.random() * 8,
            color: color,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 12,
            gravity: 0.12 + Math.random() * 0.08,
            friction: 0.98,
            opacity: 1,
            fadeRate: 0.008 + Math.random() * 0.008,
            type: type || (Math.random() > 0.5 ? 'rect' : 'circle'),
            wobble: Math.random() * 10,
            wobbleSpeed: 0.05 + Math.random() * 0.1,
        };
    }

    function burst(x, y, count) {
        if (!canvas) init();
        count = count || 60;
        for (let i = 0; i < count; i++) {
            const types = ['rect', 'circle', 'star'];
            particles.push(createParticle(x, y, types[Math.floor(Math.random() * types.length)]));
        }
        if (!animationId) animate();
    }

    function shower(duration) {
        if (!canvas) init();
        duration = duration || 3000;
        const interval = setInterval(() => {
            for (let i = 0; i < 5; i++) {
                const x = Math.random() * canvas.width;
                particles.push(createParticle(x, -10, Math.random() > 0.5 ? 'rect' : 'circle'));
            }
        }, 30);
        setTimeout(() => clearInterval(interval), duration);
        if (!animationId) animate();
    }

    function celebrate() {
        if (!canvas) init();
        // Big central burst
        burst(canvas.width / 2, canvas.height / 2, 100);
        // Side bursts with delay
        setTimeout(() => burst(canvas.width * 0.2, canvas.height * 0.4, 40), 200);
        setTimeout(() => burst(canvas.width * 0.8, canvas.height * 0.4, 40), 400);
        // Shower
        setTimeout(() => shower(2000), 300);
    }

    function miniCelebrate(x, y) {
        if (!canvas) init();
        burst(x, y, 25);
    }

    function animate() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= p.friction;
            p.rotation += p.rotationSpeed;
            p.wobble += p.wobbleSpeed;
            p.opacity -= p.fadeRate;

            if (p.opacity <= 0 || p.y > canvas.height + 50) {
                particles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x + Math.sin(p.wobble) * 2, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);

            ctx.fillStyle = p.color;

            if (p.type === 'rect') {
                ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else if (p.type === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.type === 'star') {
                drawStar(ctx, 0, 0, 5, p.size, p.size / 2);
            }

            ctx.restore();
        }

        if (particles.length > 0) {
            animationId = requestAnimationFrame(animate);
        } else {
            animationId = null;
        }
    }

    function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }

    return { init, burst, shower, celebrate, miniCelebrate };
})();
