import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import ReceivedRequests from '../components/ReceivedRequests/ReceivedRequests';
import SentRequests from '../components/SentRequests/SentRequests';
import ExchangePlatform from '../components/ExchangePlatform/ExchangePlatform';

const ExchangWithOthers = () => {
    const [showReceived, setShowReceived] = useState(false);
    const nav = useNavigate();
    function handleback(){
        nav('/')
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








<div className='wrapper'>
    <ExchangePlatform />
  </div>

  <div>
      <div className='wrapper'>
        <button
          onClick={() => setShowReceived(!showReceived)}
          className={showReceived ? 'received-button' : 'sent-button'}
        >
          {showReceived ? 'View Sent Requests' : 'View Received Requests'}
        </button>
        {showReceived ? <ReceivedRequests /> : <SentRequests />}
      </div>
    </div>



</>

  );
};

export default ExchangWithOthers;