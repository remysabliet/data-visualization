import * as d3 from 'd3';
import _ from 'lodash';
import * as d3queue from 'd3-queue';

const cleanIncomes = (d) => ({
  countyName: d['Name'],
  USstate: d['State'],
  MedianIncome: Number(d['Median Household Income']),
  lowerBound: Number(d['90% CI Lower Bound']),
  upperBound: Number(d['90% CI Upper Bound']),
});

const dateParse = d3.timeParse('%m/%d/%Y');

const cleanSalary = (d) => {
  if (!d['base salary'] || Number(d['base salary']) > 300000) {
    return null;
  }

  return {
    employer: d.employer,
    submit_date: dateParse(d['submit date']),
    start_date: dateParse(d['start date']),
    case_status: d['case status'],
    job_title: d['job title'],
    clean_job_title: d['job title'],
    base_salary: Number(d['base salary']),
    city: d['city'],
    USstate: d['state'],
    county: d['county'],
    countyID: d['countyID'],
  };
};
const cleanUSStateName = (d) => ({
  code: d.code,
  id: Number(d.id),
  name: d.name,
});

// If callback is false, we set it to _.noop - a function that does nothing. This lets us later call callback() without worrying whether it was given as an argument.
export const loadAllData = async (callback = _.noop) => {
  console.log('loadAllData start');
  Promise.all([
    d3.json('data/us.json'),
    d3.csv('data/us-county-names-normalized.csv'),
    d3.csv('data/county-median-incomes.csv', cleanIncomes),
    d3.csv('data/h1bs-2012-2016-shortened.csv', cleanSalary),
    d3.tsv('data/us-state-names.tsv', cleanUSStateName),
  ]).then((values) => {

    const countyNames = values[1].map(({ id, name }) => ({
      id: Number(id),
      name: name,
    }));

    let medianIncomesMap = {};
    values[2]
      .filter((d) => _.find(countyNames, { name: d['countyName'] }))
      .forEach((d) => {
        d['countyID'] = _.find(countyNames, { name: d['countyName'] }).id;
        medianIncomesMap[d.countyID] = d;
      });

    const techSalaries = values[3].filter((d) => !_.isNull(d));

    callback({
      usTopoJson: values[0],
      countyNames: countyNames,
      medianIncomes: medianIncomesMap,
      medianIncomesByCounty: _.groupBy(values[2], 'countyName'),
      medianIncomesByUSState: _.groupBy(values[2], 'USstate'),
      techSalaries: techSalaries,
      USstateNames: values[4],
    });
  });
};
