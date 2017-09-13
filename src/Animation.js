import EventEmitter from './EventEmitter';

const hasOwnProperty = Object.prototype.hasOwnProperty;
const secondsPerFrame = 16.666 / 1000;
const precision = 0.01;

const calcValue = (measure, other) => (
  measure + other * secondsPerFrame
);

const mapVelocity = (plainStyle) => {
  const velocity = {};
  Object.keys(plainStyle).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(plainStyle, key)) {
      velocity[key] = 0;
    }
  });
  return velocity;
};

const shouldAnimationRest = (currentStyle, style, currentVelocity) => {
  const styleKeys = Object.keys(style);
  const styleSize = styleKeys.length;
  for (let i=0; i<styleSize; i+=1) {
    const key = styleKeys[i];
    if (Object.prototype.hasOwnProperty.call(style, key)) {
      if (currentVelocity[key] !== 0) {
        return false;
      }
      if (currentStyle[key] !== style[key].val) {
        return false;
      }
    }
  }
  return true;
};

const stepper = (lastValue, destValue, stiffness, damping, velocity) => {
  const fSpring = -stiffness * (lastValue - destValue);
  const fDamper = -damping * velocity;
  const newVelocity = calcValue(velocity, fSpring + fDamper);
  const newValue = calcValue(lastValue, newVelocity);
  if (Math.abs(newVelocity) < precision && Math.abs(newValue - destValue) < precision) {
    return [destValue, 0];
  }
  return [newValue, newVelocity];
};

const animate = (style, currentStyle, currentVelocity, update, rest, next) => {
  const newCurrentStyle = {};
  const newCurrentVelocity = {};
  const styleKeys = Object.keys(style);
  const styleSize = styleKeys.length;
  for (let i=0; i<styleSize; i+=1) {
    const key = styleKeys[i];
    if (hasOwnProperty.call(style, key)) {
      const { val, stiffness, damping } = style[key];
      const currentVal = currentStyle[key];
      const currentVel = currentVelocity[key];
      const step = stepper(currentVal, val, stiffness, damping, currentVel);
      newCurrentStyle[key] = step[0];
      newCurrentVelocity[key] = step[1];
    }
  }
  update(newCurrentStyle);
  if (shouldAnimationRest(newCurrentStyle, style, newCurrentVelocity)) {
    rest(newCurrentStyle);
  } else {
    next(style, newCurrentStyle, newCurrentVelocity, update, rest, next);
  }
};

class Animation extends EventEmitter {
  constructor({ style, defaultStyle }) {
    super();
    this.frame = null;
    this.style = style;
    this.defaultStyle = defaultStyle;
  }

  start() {
    const currentVelocity = mapVelocity(this.defaultStyle);
    const onUpdate = (newCurrentStyle) => { this.emit('update', newCurrentStyle); };
    const onRest = (newCurrentStyle) => { this.emit('rest', newCurrentStyle); };
    const onNext = (...args) => {
      this.frame = window.requestAnimationFrame(() => { animate(...args); });
    };
    this.frame = window.requestAnimationFrame(() => {
      animate(this.style, this.defaultStyle, currentVelocity, onUpdate, onRest, onNext);
    });
    return this;
  }

  stop() {
    window.cancelAnimationFrame(this.frame);
    return this;
  }
}

export default Animation;
