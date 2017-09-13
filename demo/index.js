import { Animation, spring } from '../src/index';

const textEl = document.createElement('span');
const rootEl = document.getElementById('root');

textEl.textContent = 'Text';
textEl.style.opacity = 0;
rootEl.appendChild(textEl);

/**
 * FadeIn config for text.
 */

const textAnimation = new Animation({
  defaultStyle: { opacity: 0 },
  style: { opacity: spring(1, { stiffness: 199, damping: 24 }) }
});

textAnimation.on('update', ({ opacity }) => {
  textEl.style.opacity = opacity;
});

setTimeout(() => {
  textAnimation.start();
}, 3000);
