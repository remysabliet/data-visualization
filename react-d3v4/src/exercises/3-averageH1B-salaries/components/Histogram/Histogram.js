import React, { Component } from 'react';
import * as d3 from 'd3';

import Axis from './Axis';
import HistogramBar from './HistogramBar';

class Histogram extends Component {
  constructor(props) {
    super();

    this.histogram = d3.bin();

    // The horizontal scale of a bar
    this.widthScale = d3.scaleLinear();

    // Vertical scale of a bar
    this.yScale = d3.scaleLinear();

    this.updateD3(props);
  }

  componentWillReceiveProps(newProps) {
    this.updateD3(newProps);
  }

  updateD3(props) {
    this.histogram.thresholds(props.bins).value(props.value);

    const bars = this.histogram(props.data),
      counts = bars.map((d) => d.length);

    // Domain is between 2 and 1742 counts [2, 1742] (count of occurence)
    // The range, that is to say how wide those values will be displayed on the X-Axis is equal to [0, 417] (px) (Histogram with: 500px, Left axis's width: '83px)
    this.widthScale
      .domain([d3.min(counts), d3.max(counts)])
      .range([0, props.width - props.axisMargin]);

    // domain [0, 220 000] ($)
    // range [0, 485] (px)
    this.yScale
      .domain([0, d3.max(bars, (d) => d.x1)]) // Between 0$ and 220000$ the max salary (bar.x1 value)
      .range([0, props.height - props.y - props.bottomMargin]); // height of the diagram (500px) - y (10px , I dont know what is this y for)  - BottomMargin (5px)
  }

  // makeBar is a function that takes a histogram bar’s metadata and returns a HistogramBar component.
  makeBar(bar) {
    let percent = (bar.length / this.props.data.length) * 100;
    let props = {
      percent: percent,
      x: this.props.axisMargin,
      y: this.yScale(bar.x0),
      width: this.widthScale(bar.length),
      height: this.yScale(bar.x1 - bar.x0), // for example for the first bar (top to bottom) x0 = 0, x1: 20000
      key: 'histogram-bar-' + bar.x0,
    };
    return <HistogramBar {...props} />;
  }

  render() {
    const translate = `translate(${this.props.x}, ${this.props.y})`, // we translate because of the margin
      bars = this.histogram(this.props.data);
    return (
      <g className='histogram' transform={translate}>
        <g className='bars'> {bars.map(this.makeBar.bind(this))}</g>{' '}
        <Axis
          x={this.props.axisMargin - 3} //80
          y={0}
          data={bars}
          scale={this.yScale} // It is an Y axis, so we will use the yScale function
        />
      </g>
    );
  }
}

export default Histogram;
