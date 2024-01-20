import './index.scss';
import { useHistory } from 'react-router-dom';

export const Menu = () => {
  let history = useHistory();
  return (
    <>
      <div className='index'>
        <h1> Index</h1>
        <ul>
          <li>
            <a onClick={() => history.push('/x-axis')}> X-Axis </a>
          </li>
          <li>
            {' '}
            <a onClick={() => history.push('/color-bands')}> Colors strip </a>{' '}
          </li>
          <li>
            {' '}
            <a onClick={() => history.push('/h1bsalary')}>
              {' '}
              H1B average salaries{' '}
            </a>{' '}
          </li>
        </ul>
      </div>
    </>
  );
};
