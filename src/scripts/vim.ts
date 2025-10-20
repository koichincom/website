// Listen to global key events for Vim-like navigation

import { navigate } from 'astro:transitions/client';

export function initVimBindings() {
    document.addEventListener('keydown', (event) => {
        // Prevent key bindings when focused on input or textarea
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            return;
        }

        // Prevent key bindings when modifier keys are pressed
        if (event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }

        // Execute global key bindings
        const currentPath = window.location.pathname;
        let isGlobalBlindingExecuted = handleGlobalBindings(event);
        if (isGlobalBlindingExecuted) {
            return;
        }
        if ((currentPath === '/blog') || (currentPath === '/proj')) {
            handleListPageBindings(event);
        }
    });
}

let lastKey = '';
let lastKeyTime = 0;
const keyTimeout = 500; // milliseconds
function handleGlobalBindings(event: KeyboardEvent) {
    const key = event.key;

    const navigationMap: Record<string, string> = {
        'h': '/',
        'p': '/proj',
        'b': '/blog',
        'm': '/me',
    };

    if (key in navigationMap) {
        navigate(navigationMap[key]);
        return true;
    }

    switch (key) {
        case 'g':
            if (lastKey !== 'g') {
                lastKey = 'g';
                lastKeyTime = Date.now();
                return false;
            } else if (Date.now() - lastKeyTime > keyTimeout) {
                lastKey = 'g';
                lastKeyTime = Date.now();
                return false;
            } else {
                lastKey = '';
                lastKeyTime = 0;
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return true;
            }
        case 'G':
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
            return true;
        case 'u':
            window.scrollBy({
                top: -window.innerHeight / 2,
                behavior: 'smooth'
            });
            return true;
        case 'd':
            window.scrollBy({
                top: window.innerHeight / 2,
                behavior: 'smooth'
            });
            return true;
        // case '{':
        //     console.log('Global key bindings for {');
        //     return true;
        // case '}':
        //     console.log('Global key bindings for }');
        //     return true;
        default:
            return false;
    }
}

function handleListPageBindings(event: KeyboardEvent) {
    console.log('List page key bindings');
}