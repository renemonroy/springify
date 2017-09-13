const defaultSpringConfig = {
  stiffness: 170,
  damping: 26,
};

export default (val, springConfig) => (Object.assign(
  {},
  defaultSpringConfig,
  springConfig,
  { val }
));
