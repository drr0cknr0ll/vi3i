export function initRing(handlers = {}) {
    const ring = document.getElementById('ringMenu');
    const veil = document.getElementById('ringVeil');
    if (!ring) return { open: () => {}, close: () => {} };

    const setOpen = (open) => {
        ring.classList.toggle('active', open);
        if (veil) veil.classList.toggle('active', open);
        document.body.classList.toggle('ring-open', open);
    };
    const close = () => setOpen(false);
    const open = () => setOpen(true);
    const toggle = () => setOpen(!ring.classList.contains('active'));

    if (veil) veil.addEventListener('click', close);

    ring.querySelectorAll('.ringItem').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            if (action === 'atrium') handlers.onAtrium?.();
            else if (action === 'services') handlers.onServices?.();
            else if (action === 'projects') handlers.onProjects?.();
            else if (action === 'subscribe') handlers.onSubscribe?.();
            else if (action === 'lang') handlers.onLang?.();
            else if (action === 'close') handlers.onClose?.();
            close();
        });
    });

    document.addEventListener('keydown', (e) => {
        const tag = e.target?.tagName?.toLowerCase();
        const isTyping = tag === 'input' || tag === 'textarea';
        if (e.key === 'Tab' && !isTyping) {
            e.preventDefault();
            toggle();
        }
        if (e.key === 'Escape') close();
    });
    return { open, close };
}