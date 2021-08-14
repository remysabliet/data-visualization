import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Blackbox = () => {
  const gref = useRef();

  useEffect(() => {
    renderAxis();
  });

  const renderAxis = () => {
    const scale = d3.scaleLinear().domain([0, 10]).range([0, 200]);
    const axis = d3.axisBottom(scale);
    d3.select(gref.current).call(axis);

  };

  return (
    <svg width='800' height='100'>
      <g transform='translate(10, 30)' ref={gref} />
    </svg>
  );
};

export default Blackbox;
