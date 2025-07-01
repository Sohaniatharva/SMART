import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Utility from './components/Utility';

function App() {
  return (
    <div >
      <Header />
      <div className="appBody">
        <BrowserRouter>
          <Sidebar />
          <div className='mainArea'>
            <Routes>
              <Route path='/swift' element={<Utility />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
