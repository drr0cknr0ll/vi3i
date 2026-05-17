// public/js/starfield.js
(function() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    let ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    let brightStar = { x: 0.2, y: 0.3, radius: 2.5, glow: 0 };
    let rotationAngle = 0;
    let timeOffset = 0;
    let mistAlpha = 0;
    let mistDirection = 0.002;
    
    const starColors = [
        'rgba(255, 220, 150, 0.8)', // золотистый
        'rgba(180, 220, 255, 0.7)', // бледно-голубой
        'rgba(150, 255, 200, 0.6)', // изумрудный
        'rgba(200, 200, 220, 0.9)', // серебристый
        'rgba(212, 175, 55, 0.9)'    // золото
    ];
    
    function initStars() {
        const pixelArea = width * height;
        let count = Math.floor(pixelArea / 6000);
        count = Math.min(350, Math.max(60, count));
        stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random(),
                y: Math.random(),
                z: 0.2 + Math.random() * 0.7,
                speed: 0.00015 + Math.random() * 0.0004,
                radius: 0.6 + Math.random() * 1.0,
                color: starColors[Math.floor(Math.random() * starColors.length)]
            });
        }
        // Яркая звезда (фиксированное положение, будет мерцать)
        brightStar = {
            x: 0.25 + Math.random() * 0.5,
            y: 0.2 + Math.random() * 0.6,
            radius: 2.2,
            glow: 0,
            baseGlow: 0.6
        };
    }
    
    function resizeAndReset() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initStars();
    }
    
    function animate() {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        
        // Глубокий космос (чёрный)
        ctx.fillStyle = '#050508';
        ctx.fillRect(0, 0, width, height);
        
        // Дымка, меняющая прозрачность
        mistAlpha += mistDirection;
        if (mistAlpha >= 0.2) mistDirection = -0.002;
        if (mistAlpha <= 0.02) mistDirection = 0.002;
        ctx.fillStyle = `rgba(80, 60, 120, ${mistAlpha * 0.3})`;
        ctx.fillRect(0, 0, width, height);
        
        rotationAngle += 0.0003; // медленно
        timeOffset += 0.002;
        
        // Рисуем обычные звёзды
        let points = [];
        for (let s of stars) {
            let driftX = Math.sin(timeOffset * s.z * 4) * 0.0015;
            let driftY = Math.cos(timeOffset * s.z * 3) * 0.0015;
            let tx = s.x + driftX;
            let ty = s.y + driftY;
            if (tx > 1) tx = 0;
            if (tx < 0) tx = 1;
            if (ty > 1) ty = 0;
            if (ty < 0) ty = 1;
            
            let scale = 0.7 + s.z * 0.6;
            let x = (tx - 0.5) * width * 1.2 + width/2;
            let y = (ty - 0.5) * height * 1.2 + height/2;
            
            let dx = x - width/2;
            let dy = y - height/2;
            let angle = Math.atan2(dy, dx) + rotationAngle * (s.z + 0.2);
            let rad = Math.hypot(dx, dy);
            x = width/2 + rad * Math.cos(angle);
            y = height/2 + rad * Math.sin(angle);
            
            points.push({x, y, radius: s.radius * scale, z: s.z, color: s.color});
            ctx.beginPath();
            ctx.arc(x, y, s.radius * scale, 0, Math.PI*2);
            ctx.fillStyle = s.color;
            ctx.fill();
        }
        
        // Линии созвездий (только между достаточно яркими звёздами)
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
        ctx.lineWidth = 0.3;
        const DIST_LIMIT = Math.min(width, height) * 0.1;
        for (let i = 0; i < points.length; i++) {
            for (let j = i+1; j < points.length; j++) {
                let dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
                if (dist < DIST_LIMIT && points[i].z > 0.4 && points[j].z > 0.4) {
                    ctx.beginPath();
                    ctx.moveTo(points[i].x, points[i].y);
                    ctx.lineTo(points[j].x, points[j].y);
                    ctx.stroke();
                }
            }
        }
        
        // Яркая звезда (с мерцанием)
        let bx = brightStar.x * width;
        let by = brightStar.y * height;
        let glowIntensity = 0.5 + Math.sin(Date.now() * 0.002) * 0.3;
        ctx.beginPath();
        ctx.arc(bx, by, brightStar.radius + glowIntensity * 1.2, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255, 220, 160, 0.95)`;
        ctx.fill();
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#d4af37';
        ctx.beginPath();
        ctx.arc(bx, by, brightStar.radius * 1.8, 0, Math.PI*2);
        ctx.fillStyle = `rgba(212, 175, 55, 0.3)`;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', () => { resizeAndReset(); });
    resizeAndReset();
    animate();
})();