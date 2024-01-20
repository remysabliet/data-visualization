import React, { Component } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import _ from 'lodash';

import County from './County';

class CountyMap extends Component {
  constructor(props) {
    super(props);

    // We need 3 D3 objects to build a choropleth map: a geographical projection, a path generator, and a quantize scale for colors

    // A map projection is a way to flatten a globe's surface into a plane in order to make a map
    this.projection = d3.geoAlbersUsa().scale(1280);

    // Takes a projection and returns a function that generates the d attribute of <path> elements. This is the most general way to specify SVG shapes.
    this.geoPath = d3.geoPath().projection(this.projection);

    // quantize is a D3 scale.
    // This one splits a domain into 9 quantiles and assigns them specific values from the range.
    // Let’s say our domain goes from 0 to 90. Calling the scale with any number between 0 and 9 would
    // return 1. 10 to 19 returns 2 and so on. We’ll use it to pick colors from an array.
    this.quantize = d3.scaleQuantize().range(d3.range(9));
    this.updateD3(props);
  }

  componentWillReceiveProps(newProps) {
    this.updateD3(newProps);
  }
  updateD3(props) {
    // translates (moves) the projection to the center of our drawing area and sets a scale property.
    this.projection
      .translate([props.width / 2, props.height / 2])
      .scale(props.width * 1.3);

    if (props.zoom && props.usTopoJson) {
      // Find the US state we are zoom-ing on
      const us = props.usTopoJson,
        statePaths = topojson.feature(us, us.objects.states).features,
        id = _.find(props.USstateNames, { code: props.zoom }).id;

      //tweak the scale property to make the map bigger, this create a zooming effect
      this.projection.scale(props.width * 4.5);

      // method to calculate the state its center point. This gives us a new coordinate to translate our projection onto.
      const centroid = this.geoPath.centroid(_.find(statePaths, { id: id })),
        translate = this.projection.translate();

      // Translate our projection.  helps us align the center point of our zoom US state with the center of the drawing area.
      this.projection.translate([
        translate[0] - centroid[0] + props.width / 2,
        translate[1] - centroid[1] + props.height / 2,
      ]);
    }
    if (props.values) {
      // update the quantize scale’s domain with new values. Using d3.quantile lets us offset the scale to produce a more interesting map.
      // The values were discovered experimentally - they cut off the top and bottom of the range because there isn’t much there

      // Here we are removing the 15% inferior and superior values of the original County's value (tech avg salary - household avg salary)
      this.quantize.domain([
        d3.quantile(props.values, 0.15, (d) => d.value), // Compute the range of County.Value for a p-quantile = 0.15 (between 0 and 1)
        d3.quantile(props.values, 0.85, (d) => d.value),
      ]);
    }
  }

  render() {
    if (!this.props.usTopoJson) {
      return null;
    } else {
      const us = this.props.usTopoJson,
        // Calculates a mesh for US states - a thin line around the edges.
        // The filter function remove duplicates, here from 268 occurences we pass to 66 occurences only
        statesMesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b),
        // Calculates the features for each county - fill in with color.

        // convert TopoJSON to GeoJSON in order to render with d3.geoPath()
        // counties are subpart of a state, 3220 in total
        counties = topojson.feature(us, us.objects.counties).features;

      // Build a dictionary that maps county identifiers to their values
      const countyValueMap = _.fromPairs(
        this.props.values.map((d) => [d.countyID, d.value])
      );
      // counties.map((feature) =>{   console.log('countyValueMap', countyValueMap, 'feature.id', feature.id);})

      // Returns all the county one by one and the the mesh for the whole US (one time only) they are surrended by <g> </g>
      return (
        <>
          <g transform={`translate(${this.props.x}, ${this.props.y})`}>
            {counties.map((feature) => (
              <County
                geoPath={this.geoPath} //function that generate the d attribute from GeoJson 's geometry/feature (feature being a geometry with additional properties)
                feature={feature} //
                zoom={this.props.zoom}
                key={feature.id}
                quantize={this.quantize}
                value={countyValueMap[feature.id]}
              />
            ))}
            <path // Return the mesh (lines between states)
              d={this.geoPath(statesMesh)}
              style={{
                fill: 'none',
                stroke: '#fff',
                strokeLineJoin: 'round',
              }}
            />
          </g>
          )
        </>
      );
    }
  }
}

export default CountyMap;
