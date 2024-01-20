export const Swatch = ({ color, width, x, y }) => {
  console.log('Swatch props', color, width, x, y )
  return <rect width={width} height='20' x={x} y={y} style={{ fill: color }} />;
};
