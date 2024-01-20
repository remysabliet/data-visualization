import * as d3 from 'd3';
import D3blackbox from '../D3blackbox';

const Axis = D3blackbox(function () {
  // We use D3’s axisLeft generator, configure its tickFormat, give it a scale to use, and specify how many ticks we want.
  // Then select the anchor element rendered by D3blackbox and call the axis generator on it.
  const axis = d3
    .axisLeft() // legend on the left side of the axis  
    //Legend format, here SI-prefix with two significant digits, "42M" (will keep the 2 first digit)
    // refers to d3.format to see all possible format
    // .tickFormat((d) => `${d3.format('.2s')(d)}`)
    .scale(this.props.scale) // yScale function to transform domain values to be displayed on the y axis (in pixel)
    .ticks(this.props.data.length); // 11 ticks

  // select the element having the ref "anchor" (<g> element of the Blackbox), and then Hook itself into it (this will attach the axes element to the g)
  // call is a d3 function , Invoke the specified function exactly once, passing in this selection along with any optional arguments. Returns this selection.
  d3.select(this.refs.anchor).call(axis);
});
export default Axis;
