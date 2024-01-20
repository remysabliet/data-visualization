import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import uniqid from 'uniqid';

import { Swatch } from './Swatch';

const Colors = ({ propWidth }) => {
  const colors = d3.schemeCategory10;
  // In order to set a function inside useState we must declare inside an array function  useState(() => your function)
  const [width, setWidth] = useState(() => d3.scaleBand().domain(d3.range(10)));

  const [randomArray, setRandomArray] = useState([]); // Trick to force react to rerender width function

  useEffect(() => {
    setWidth(() => d3.scaleBand().domain(d3.range(10)));
  }, [propWidth]);

  useEffect(() => {
    if (width) {
      console.log('inside width function', propWidth);
      width.range([0, propWidth]);

      setRandomArray([]); // Trick to force react to update the Swatch map (mysterious logic), others type of data like integer, boolean doesn't works
    }
  }, [width]);

  return (
    <>
      <svg width='600' height='100'>
        <g transform='translate(10, 30)'>
          {d3.range(10).map((i) => {
            if (width) {
              console.log('step', width.step(), width(i));
            }
            return (
              <Swatch
                key={uniqid()}
                color={colors[i]}
                width={width.step()}
                x={width(i)}
                y='0'
              />
            );
          })}
        </g>
      </svg>
    </>
  );
};

export default Colors;
