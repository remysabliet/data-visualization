import './App.css';


import Routes from './routes';

function App(props) {
  return (
    <div className='App'>
      <Routes {...props} />
    </div>
  );
}

export default App;
