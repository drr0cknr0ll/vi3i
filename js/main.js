// public/js/main.js
import { initRing, showTabHintIfNeeded } from './ring.js';

document.addEventListener('DOMContentLoaded', function() {
    // Форма подписки
    const form = document.getElementById('subscribeForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const messageBox = document.getElementById('formMessage');
    if (!email) return;
    messageBox.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
    try {
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (response.ok) {
            messageBox.innerHTML = '✅ Подписка оформлена! Спасибо.';
            document.getElementById('subscribeForm').reset();
        } else {
            messageBox.innerHTML = '❌ ' + (data.error || 'Ошибка, попробуйте позже.');
        }
    } catch (err) {
        messageBox.innerHTML = '❌ Ошибка соединения.';
    }
    setTimeout(() => messageBox.innerHTML = '', 4000);
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