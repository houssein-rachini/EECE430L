import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/Home';
import ExchangWithOthers from './pages/ExchangWithOthers';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Insights from './pages/Insights';

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(

    
    <>

      <BrowserRouter>
        <Routes>
         
          <Route path="/" element={<App />} />
          <Route path="/exchangeplatform" element={< ExchangWithOthers/>} />
          <Route path="/insight" element={< Insights/>} />
        </Routes>
      </BrowserRouter>
    </>


);

