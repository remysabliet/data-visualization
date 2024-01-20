import React, { Component } from 'react';

/**
 * This HOC add a <g> tag
 * 
 * Take a D3render function, call it on componentDidMount and componentDidUpdate to keep things in
 * sync, and render a positioned anchor <g> element for D3render to hook into.
 */
export default function D3blackbox(D3render) {
  return class Blackbox extends Component {
    componentDidMount() {
      D3render.call(this);
    }
    componentDidUpdate() {
      D3render.call(this);
    }
    render() {
      // x and y are inheritated from props of the Enclosed component(function)
      const { x, y } = this.props;

      // render a positioned anchor element for D3render (the Y Axis) to hook into.
      return <g transform={`translate(${x}, ${y})`} ref='anchor' />;
    }
  };
}
