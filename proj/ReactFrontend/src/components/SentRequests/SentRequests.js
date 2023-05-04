import React, { useState, useEffect } from 'react';
import './SentRequests.css'
const SentRequests = () => {
  const userid = localStorage.getItem('userid');

  const sentRequests = [
    { id: 1, amount: 100, recipient: 'John', status: 'pending' },
    { id: 2, amount: 200, recipient: 'Jane', status: 'accepted' },
    { id: 3, amount: 150, recipient: 'James', status: 'denied' },
    { id: 4, amount: 50, recipient: 'Jill', status: 'pending' },
  ];

  const [requests, setRequests] = useState(sentRequests); // State for storing requests

  useEffect(() => {
    const fetchSentRequests = (userId) => {
      fetch(`http://127.0.0.1:5000/sentrequests/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to retrieve requests');
          }
          return response.text();
        })
        .then((responseText) => {
          try {
            const sentRequests = JSON.parse(responseText);
            console.log(sentRequests);
            setRequests(sentRequests);
          } catch (error) {
            console.error('Failed to parse response as JSON:', error);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };

    fetchSentRequests(userid);
  }, [userid]);

  const handleCancel = (requestId) => {
    // Handle cancel logic here
    const updatedRequests = requests.filter((request) => request.id !== requestId);
    setRequests(updatedRequests);




    fetch(`http://127.0.0.1:5000/cancel_request/${requestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to cancel request');
        }
        return response.json();
      })
      .then(updatedRequest => {
        console.log('Request cancelled:', updatedRequest);
      })
      .catch(error => {
        console.error(error);

      });






  };

  return (
    <div className="sent-requests">
      <h2 className="sent-requests__title">Sent Requests</h2>
      <ul className="sent-requests__list">
        {requests.length == 0 ? (
          <li className="sent-requests__list-item">No requests</li>
        ) : (
          requests.map((request) => (
            <li key={request.id} className="sent-requests__list-item">
              <div className="sent-requests__request-info">
                <span className="sent-requests__request-amount">
                Currency :  {request.usd_amount/request.usd_amount} for 1 USD
                </span>
                <span className="sent-requests__request-recipient">
                  Recipient: {request.recievername}
                </span>
                <span className="sent-requests__request-status">
                  Status: {request.status}
                </span>
              </div>
              {request.status === 'Pending' && (
                <div className="sent-requests__request-actions">
                  <button
                    className="sent-requests__action-button sent-requests__action-cancel"
                    onClick={() => handleCancel(request.id)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SentRequests;