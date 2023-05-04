import React, { useState } from 'react';
import './ExchangePlatform.css'; // Import the CSS file for styling

const ExchangePlatform = () => {
  // State for storing transaction details
  const [action, setAction] = useState(false); // buy or sell
  const [usdamount, setusdAmount] = useState('');
  const [lbpamount, setlbpAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const senderid = localStorage.getItem("userid")
  async  function  handleTransaction (e) {
    // Perform validation checks
    if (!usdamount || !recipient || !lbpamount  ) {
      alert('Please enter an amount and recipient.');
      return;
    }

    e.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({
        sender_id: senderid,
        recieverusername: recipient,
        usd_amount: usdamount,
        lbp_amount: lbpamount,
        usd_to_lbp: action
      })
    };
    try {
      const response = await fetch('http://127.0.0.1:5000/send_request', requestOptions);
      if (response.ok) {
        // Handle success
        console.log('Request sent successfully');
            // Reset input fields
    setlbpAmount('');
    setusdAmount('');
    setRecipient('');
    alert(`Transaction successful! Action: ${action}, Amount: ${usdamount +" $"}, Recipient: ${recipient}`);

      } else {

        alert('Failed to send request:', response.status, response.statusText);
      }
    } catch (error) {
      alert('Failed to send request:', error);
      console.error('Failed to send request:', error);
    }

  };

  return (
    <div className="exchange-platform">
      <h1 className="exchange-platform__title">Exchange Platform</h1>
      <form className="exchange-platform__form">
        <label htmlFor="action" className="exchange-platform__label">
          Action:
        </label>
        <select
          id="action"
          className="exchange-platform__select"
          value={action}
          onChange={(e) => setAction(e.target.value)}
        >
          <option value={false}>Buy USD</option>
          <option value={true}>Sell USD</option>
        </select>
        <br />
        <label htmlFor="amount" className="exchange-platform__label">
          USD Amount:
        </label>
        <input
          type="number"
          id="amount"
          className="exchange-platform__input"
          value={usdamount}
          onChange={(e) => setusdAmount(e.target.value)}
        />
        <br />
        <label htmlFor="amount" className="exchange-platform__label">
          LBP Amount:
        </label>
        <input
          type="number"
          id="amount"
          className="exchange-platform__input"
          value={lbpamount}
          onChange={(e) => setlbpAmount(e.target.value)}
        />
        <br />
        <label htmlFor="recipient" className="exchange-platform__label">
          Recipient:
        </label>
        <input
          type="text"
          id="recipient"
          className="exchange-platform__input"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <br />
        <button type="button" className="exchange-platform__button" onClick={handleTransaction}>
          Request
        </button>
      </form>
    </div>
  );
};

export default ExchangePlatform;