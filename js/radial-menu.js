// public/js/radial-menu.js
(function() {
    const toggleBtn = document.getElementById('radialToggle');
    const menu = document.getElementById('radialMenu');
    const body = document.body;
    
    if (!toggleBtn || !menu) return;
    
    function closeRingIfOpen() {
        const ringMenu = document.getElementById('ringMenu');
        if (ringMenu && ringMenu.classList.contains('active') && window.closeRing) {
            window.closeRing();
        }
    }
    
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeRingIfOpen(); // закрываем центральное кольцо, если открыто
        const isHidden = menu.classList.contains('hidden');
        if (isHidden) {
            menu.classList.remove('hidden');
            body.classList.add('menu-open');
        } else {
            menu.classList.add('hidden');
            body.classList.remove('menu-open');
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && e.target !== toggleBtn) {
            menu.classList.add('hidden');
            body.classList.remove('menu-open');
        }
    });
    
    const items = menu.querySelectorAll('.radial-item');
    items.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetId = item.getAttribute('data-target');
            if (targetId) {
                const section = document.getElementById(targetId);
                if (section) section.scrollIntoView({ behavior: 'smooth' });
            }
            const lang = item.getAttribute('data-lang');
            if (lang === 'en') window.location.href = '/en/';
            if (lang === 'ru') window.location.href = '/';
            menu.classList.add('hidden');
            body.classList.remove('menu-open');
        });
    });
})();