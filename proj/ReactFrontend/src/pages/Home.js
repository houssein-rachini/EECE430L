import './App.css';
import { saveUserToken, getUserToken, clearUserToken } from '../localStorage';
import { useState } from 'react';
import { useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Button, AppBar, Toolbar, Typography, Snackbar, Alert } from '@mui/material';
import CurrencyConverter from "../components/CurrencyConverter"

import { useNavigate } from 'react-router-dom';
import UserCredentialsDialog from '../components/UserCredentialsDialog/UserCredentialsDialog';
function App() {

  let [buyUsdRate, setBuyUsdRate] = useState("Not available yet");
  let [sellUsdRate, setSellUsdRate] = useState("Not available yet");

  let [lbpInput, setLbpInput] = useState("");
  let [usdInput, setUsdInput] = useState("");
  let [transactionType, setTransactionType] = useState("1");

  let [subcount, setsubcount] = useState(0);
  let [userToken, setUserToken] = useState(getUserToken());
  const States = {
    PENDING: "PENDING",
    USER_CREATION: "USER_CREATION",
    USER_LOG_IN: "USER_LOG_IN",
    USER_AUTHENTICATED: "USER_AUTHENTICATED",
  };

  let [authState, setAuthState] = useState(States.PENDING);




  const initgraphdata = [
    { Month: 'march', 'Year(2023)': 21, 'Year(2022)': 41 },


  ];




  var SERVER_URL = "http://127.0.0.1:5000"


  const [graphdata, setGraphData] = useState(initgraphdata);

  useEffect(() => {
    fetch(`${SERVER_URL}/exchange_rate`)
      .then(response => response.json())
      .then(data => {
        setGraphData(data)


      })
  }, []);








  function fetchRates() {

    fetch(`${SERVER_URL}/exchangeRate`)
      .then(response => response.json())
      .then(data => {

        if (data.lbp_to_usd == null) { setBuyUsdRate("Not available yet") }
        else { setBuyUsdRate(data.lbp_to_usd) }

        if (data.usd_to_lbp == null) { setSellUsdRate("Not available yet") }
        else { setSellUsdRate(data.usd_to_lbp) }

      })
  }


  useEffect(fetchRates, [])
  function handleclick() { setsubcount((prev) => prev + 1) }

  useEffect(() => {

if (subcount>0){    var body = {
      'usd_amount': usdInput,
      'lbp_amount': lbpInput,
      'usd_to_lbp': parseInt(transactionType)
    }

    fetch(`${SERVER_URL}/Transaction`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(() => { fetchRates() })

}
  }, [subcount])


  function handleclose() {
    setAuthState(States.PENDING);

  }


  function login(username, password) {
    return fetch(`${SERVER_URL}/authentication`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        setAuthState(States.USER_AUTHENTICATED);
        setUserToken(body.token)
        saveUserToken(body.token,body.userid);
      
      });
  }


  function createUser(username, password) {
    return fetch(`${SERVER_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name: username,
        password: password,
      }),
    }).then((response) => login(username, password));
  }

  function logout() {
    setUserToken(null);
    clearUserToken()
  }
  const nav = useNavigate();

function handleplat(){

  nav('/exchangeplatform');
}
function handleinsight(){

  nav('/insight');
}

  return (
    <>


      <AppBar position="static">
        <Toolbar classes={{ root: "nav" }}>
          <Typography variant="h5">PAGE HEADER</Typography>

          <Button color="inherit" onClick={handleinsight}>
              Insights
            </Button>
          {userToken !== null ? (
            <>            
            <Button color="inherit" onClick={handleplat}>
              Exchange Platform
            </Button>
            <Button color="inherit" onClick={logout}>
                        Logout
            </Button>
            
            </>


          ) : (
            <div>
              <Button
                color="inherit"
                onClick={() => setAuthState(States.USER_CREATION)}
              >
                Register
              </Button>
              <Button
                color="inherit"
                onClick={() => setAuthState(States.USER_LOG_IN)}
              >
                Login
              </Button>
            </div>
          )}

        </Toolbar>
      </AppBar>



      <div className="header">
        <h1>Exchange rate</h1>
      </div>


      <div className="wrapper">
        <h2>Today's Exchange Rate</h2>
        <p>LBP to USD Exchange Rate</p>
        <h3>Buy USD: <span id="buy-usd-rate" >{buyUsdRate}</span></h3>
        <h3>Sell USD: <span id="sell-usd-rate">{sellUsdRate}</span></h3>
        <hr />

          <div>

          <h2>Currency Converter</h2>

          <CurrencyConverter buyUsdRate={buyUsdRate} sellUsdRate={sellUsdRate} />
          </div>




      </div>
      <div className='wrapper'>
        <h2>Record a recent transaction</h2>
        <form name="transaction-entry">
          <div className="amount-input">
            <label htmlFor="lbp-amount">LBP Amount</label>
            <input id="lbp-amount" type="number" onChange={(e) => { setLbpInput(e.target.value) }} />
            <label htmlFor="usd-amount">USD Amount</label>
            <input id="usd-amount" type="number" onChange={(e) => { setUsdInput(e.target.value) }} />
          </div>
          <select id="transaction-type" onChange={(e) => { setTransactionType(e.target.value) }}>
            <option value="1">USD to LBP</option>
            <option value="0">LBP to USD</option>
          </select>
          <button id="add-button" className="button" type="button" onClick={handleclick}>Add</button>
        </form>
      </div>





<div className='wrapper'>

<div className="section col-md-6">
        <h3 className="section-title">Daily Exchange Rate</h3>
        <div className="section-content">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphdata} margin={{ top: 15, right: 0, bottom: 15, left: 0 }}>
              <Tooltip />
              <XAxis dataKey="Month" />
              <YAxis />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <Legend/>
              <Line type="monotone" dataKey="Buy usd" stroke="#FB8833" />
              <Line type="monotone" dataKey="Sell usd" stroke="#17A8F5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>




</div>










      <UserCredentialsDialog
        open={authState === "USER_CREATION" ? true : false}
        onClose={handleclose}
        onSubmit={createUser}
        submitText={"Register"}
      />

      <UserCredentialsDialog
        open={authState === "USER_LOG_IN" ? true : false}
        onClose={handleclose}
        onSubmit={login}
        submitText={"login"}
      />

      <Snackbar
        elevation={6}
        variant="filled"
        open={authState === States.USER_AUTHENTICATED}
        autoHideDuration={2000}
        onClose={() => setAuthState(States.PENDING)}
      >
        <Alert severity="success">Success</Alert>
      </Snackbar>











    </>






  );
}

export default App;
