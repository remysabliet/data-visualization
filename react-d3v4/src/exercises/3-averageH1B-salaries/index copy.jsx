import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

import Preloader from './Preloader';
import { loadAllData } from './DataHandling';

import Controls from './components/Controls';
import CountyMap from './components/CountyMap';
import Histogram from './components/Histogram';
import { Description, GraphDescription, Title } from './components/Meta';
import MedianLine from './components/MedianLine';

export class H1BSalaryDiagram extends React.Component {
  state = {
    techSalaries: [],
    countyNames: [],
    medianIncomes: [],
    salariesFilter: () => true,
    filteredBy: {
      USstate: '*',
      year: '*',
      jobTitle: '*',
    },
  };

  componentWillMount() {
    loadAllData((data) => this.setState(data));
  }

  updateDataFilter(filter, filteredBy) {
    this.setState({
      salariesFilter: filter,
      filteredBy: filteredBy,
    });
  }

  /**
   * returns the delta between median household income and a single tech salary.
   * If negative number, it means the tech salary is inferior to median household
   * @param {*} county
   * @param {*} techSalariesMap
   * @returns
   */
  countyValue(county, techSalariesMap) {
    const medianHousehold = this.state.medianIncomes[county.id],
      salaries = techSalariesMap[county.name];

    if (!medianHousehold || !salaries) {
      return null;
    }

    const median = d3.median(salaries, (d) => d.base_salary);
    return {
      countyID: county.id,
      value: median - medianHousehold.MedianIncome,
    };
  }

  render() {
    if (this.state.techSalaries.length < 1) {
      return <Preloader />;
    }

    const filteredSalaries = this.state.techSalaries.filter(
        this.state.salariesFilter
      ),
      filteredSalariesMap = _.groupBy(filteredSalaries, 'countyID'),
      countyValues = this.state.countyNames
        .map((county) => {
          return this.countyValue(county, filteredSalariesMap);
        })
        .filter((d) => !_.isNull(d));

    let zoom = null,
      medianHousehold = this.state.medianIncomesByUSState['US'][0].medianIncome;

    if (this.state.filteredBy.USstate !== '*') {
      zoom = this.state.filteredBy.USstate;
      medianHousehold = d3.mean(
        this.state.medianIncomesByUSState[zoom],
        (d) => d.medianIncome
      );
    }

    return (
      <div className='App container'>
        <Title data={filteredSalaries} filteredBy={this.state.filteredBy} />
        <Description
          data={filteredSalaries}
          allData={this.state.techSalaries}
          medianIncomesByCounty={this.state.medianIncomesByCounty}
          filteredBy={this.state.filteredBy}
        />
        <GraphDescription
          data={filteredSalaries}
          filteredBy={this.state.filteredBy}
        />
        <svg width='1100' height='500'>
          <CountyMap
            usTopoJson={this.state.usTopoJson}
            USstateNames={this.state.USstateNames}
            values={countyValues}
            x={0}
            y={0}
            width={500}
            height={500}
            zoom={zoom}
          />

          <rect
            x='500'
            y='0'
            width='600'
            height='500'
            style={{ fill: 'white' }}
          />

          <Histogram
            bins={10} //threeshold
            width={500}
            height={500}
            x='500'
            y='10'
            data={filteredSalaries}
            axisMargin={83}
            bottomMargin={5}
            value={(d) => d.base_salary}
          />

          <MedianLine
            data={filteredSalaries}
            x={500}
            y={10}
            width={600}
            height={500}
            bottomMargin={5}
            median={medianHousehold}
            value={(d) => d.base_salary}
          />
        </svg>

        <Controls
          data={this.state.techSalaries}
          updateDataFilter={this.updateDataFilter.bind(this)}
        />
      </div>
    );
  }
}
