import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Menu } from '../exercises';

import Blackbox from '../exercises/1-blackbox';
import Colors from '../exercises/2-colorBands';
import H1BSalaryDiagram from '../exercises/3-averageH1B-salaries';

const Routes = (props) => (
  <Switch>
    <Route exact path='/' render={(prop) => <Menu {...props} />} />
    <Route exact path='/x-axis' render={(prop) => <Blackbox {...props} />} />
    <Route
      exact
      path='/color-bands'
      render={(prop) => <Colors propWidth={300} {...props} />}
    />
    <Route
      exact
      path='/h1bsalary'
      render={(prop) => <H1BSalaryDiagram {...props} />}
    />
  </Switch>
);

export default Routes;
