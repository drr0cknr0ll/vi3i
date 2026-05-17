// public/js/main.js
import { initRing, showTabHintIfNeeded } from './ring.js';

document.addEventListener('DOMContentLoaded', function() {
    // Форма подписки
    const form = document.getElementById('subscribeForm');
    const messageBox = document.getElementById('formMessage');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            if (!email) return;
            messageBox.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            messageBox.style.color = '#d4af37';
            try {
                const response = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await response.json();
                if (response.ok) {
                    messageBox.innerHTML = '✅ Successfully subscribed!';
                    messageBox.style.color = '#d4af37';
                    form.reset();
                } else {
                    messageBox.innerHTML = '❌ ' + (data.error || 'Error, try again');
                    messageBox.style.color = '#ff8888';
                }
            } catch (err) {
                messageBox.innerHTML = '❌ Connection error';
                messageBox.style.color = '#ff8888';
            }
            setTimeout(() => { messageBox.innerHTML = ''; }, 4000);
        });
    }

    // Инициализация центрального кольца
    const ring = initRing({
        onAtrium: () => { window.location.href = '/'; },
        onServices: () => { document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); },
        onProjects: () => { document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); },
        onSubscribe: () => { document.getElementById('subscribe')?.scrollIntoView({ behavior: 'smooth' }); },
        onLang: () => {
            const isEn = window.location.pathname.startsWith('/en');
            window.location.href = isEn ? '/' : '/en/';
        },
        onClose: () => ring.close()
    });
    showTabHintIfNeeded();
});