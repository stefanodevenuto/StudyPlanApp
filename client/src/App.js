import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'
import Homepage from './Homepage/components';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Homepage />
    </BrowserRouter>
  );
}

export default App;
