import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Insights.css'; // Import custom CSS file for styling

import { useNavigate } from 'react-router-dom';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
const ExchangeRateStatistics = () => {
  const [statistics, setStatistics] = useState(null);

  const nav = useNavigate();
  function handleback(){
      nav('/')
  }
  useEffect(() => {
    // Fetch exchange rate statistics from the server
    axios
      .get('http://127.0.0.1:5000/exchange_rate_statistics')
      .then(response => {
        setStatistics(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch exchange rate statistics:', error);
      });
  }, []);

  if (!statistics) {
    // Render loading spinner while data is being fetched
    return <div className="loading">Loading...</div>;
  }




  return (
    <>
  <AppBar position="static">
        <Toolbar classes={{ root: "nav" }}>
          <Typography variant="h5">PAGE HEADER</Typography>


            <div>
              <Button
                color="inherit"
                onClick={handleback}
              >
                GO BACK
              </Button>
              
            </div>
 
        </Toolbar>
      </AppBar>
    <div className="wrapper">
      <h1 className="title">Exchange Rate Statistics</h1>
      <div className="statistics">
        <div className="row">
          <div className="label">
            <strong>Sell Standard Deviation:</strong>
          </div>
          <div className="value">{statistics.sell_std}</div>
        </div>
        <div className="row">
          <div className="label">
            <strong>Buy Standard Deviation:</strong>
          </div>
          <div className="value">{statistics.buystd}</div>
        </div>
        <div className="row">
          <div className="label">
            <strong>Sell Mode:</strong>
          </div>
          <div className="value">{statistics.sellmode}</div>
        </div>
        <div className="row">
          <div className="label">
            <strong>Buy Mode:</strong>
          </div>
          <div className="value">{statistics.buymode}</div>
        </div>
        <div className="row">
          <div className="label">
            <strong>Sell Median:</strong>
          </div>
          <div className="value">{statistics.sellmedian}</div>
        </div>
        <div className="row">
          <div className="label">
            <strong>Buy Median:</strong>
          </div>
          <div className="value">{statistics.buymedian}</div>
        </div>
        <div className="row">
          <div className="label">
            <strong>Sell Maximum:</strong>
          </div>
          <div className="value">{statistics.sellmax}</div>
        </div>
        <div className="row">
          <div className="label">
            <strong>Buy Maximum:</strong>
          </div>
          <div className="value">{statistics.buymax}</div>
        </div>
        <div className="row">
          <div className="label">
            <strong>Sell Minimum:</strong>
          </div>
          <div className="value">{statistics.sellmin}</div>
        </div>
        <div className="row">
          <div className="label">
            <strong>Buy Minimum:</strong>
          </div>
          <div className="value">{statistics.buymin}</div>
        </div>
        <div className="row">
          <div className="label">
            <strong>Number of Buys:</strong>
          </div>
          <div className="value">{statistics.numberofbuys}</div>
        </div>
        <div className="row">
          <div className="label">
            <strong>Number of Sells:</strong>
          </div>
          <div className="value">{statistics.numberofsells}</div>
        </div>
     
      </div>
    </div> 
     </>
  );
};

export default ExchangeRateStatistics;