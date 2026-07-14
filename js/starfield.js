(function() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    let ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    let rotationAngle = 0;
    let timeOffset = 0;
    
    const STAR_COUNT = 250;
    const CONSTELLATION_DIST = 110;
    
    const starColors = [
        'rgba(255, 220, 150, 0.8)',
        'rgba(180, 220, 255, 0.7)',
        'rgba(150, 255, 200, 0.6)',
        'rgba(200, 200, 220, 0.9)',
        'rgba(212, 175, 55, 0.9)'
    ];
    
    function init() {
        resize();
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random(),
                y: Math.random(),
                z: 0.2 + Math.random() * 0.7,
                speed: 0.0001 + Math.random() * 0.0003,
                radius: 0.8 + Math.random() * 1.2,
                color: starColors[Math.floor(Math.random() * starColors.length)]
            });
        }
        window.addEventListener('resize', resize);
        animate();
    }
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    function animate() {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        
        rotationAngle += 0.0002;
        timeOffset += 0.002;
        
        let points = [];
        for (let s of stars) {
            let driftX = Math.sin(timeOffset * s.z * 5) * 0.001;
            let driftY = Math.cos(timeOffset * s.z * 4) * 0.001;
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
            let angle = Math.atan2(dy, dx) + rotationAngle * (s.z + 0.3);
            let rad = Math.hypot(dx, dy);
            x = width/2 + rad * Math.cos(angle);
            y = height/2 + rad * Math.sin(angle);
            
            points.push({x, y, radius: s.radius * scale, z: s.z, color: s.color});
            ctx.beginPath();
            ctx.arc(x, y, s.radius * scale, 0, Math.PI*2);
            ctx.fillStyle = s.color;
            ctx.fill();
        }
        
        // Линии созвездий (очень тонкие)
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.12)';
        ctx.lineWidth = 0.3;
        const DIST_LIMIT = Math.min(width, height) * 0.1;
        for (let i = 0; i < points.length; i++) {
            for (let j = i+1; j < points.length; j++) {
                let dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
                if (dist < DIST_LIMIT && points[i].z > 0.3 && points[j].z > 0.3) {
                    ctx.beginPath();
                    ctx.moveTo(points[i].x, points[i].y);
                    ctx.lineTo(points[j].x, points[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    init();
})();