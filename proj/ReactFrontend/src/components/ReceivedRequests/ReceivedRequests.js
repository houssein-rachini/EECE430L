import React, { useEffect, useState } from 'react';
import './ReceivedRequests.css';

const ReceivedRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch requests data from backend
    const fetchRequests = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/recievedrequests/${localStorage.getItem('userid')}`);
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error('Failed to fetch requests:', error);
      }
    };
    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      // Update the status of the request in the backend
      await fetch(`http://127.0.0.1:5000/accept_request/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Update the requests state to reflect the accepted request
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId ? { ...request, status: 'accepted' } : request
        )
      );
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleDeny = async (requestId) => {
    try {
      // Update the status of the request in the backend
      await fetch(`http://127.0.0.1:5000/reject_request/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Update the requests state to reflect the denied request
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId ? { ...request, status: 'denied' } : request
        )
      );
    } catch (error) {
      console.error('Failed to deny request:', error);
    }
  };

  return (
    <div className="received-requests">
      <h2 className="received-requests__title">Received Requests</h2>
      <ul className="received-requests__list">
  {requests.length === 0 ? (
    <li className="received-requests__list-item">No requests</li>
  ) : (
    requests.map((request) => (
      <li key={request.id} className="received-requests__list-item">
        <div className="received-requests__request-info">
          <span className="received-requests__request-amount">
            Currency :  {request.usd_amount/request.usd_amount} for 1 USD
          </span>
          <span className="received-requests__request-recipient">
            Sender: {request.sendername}
          </span>
          <span className="received-requests__request-status">
            Status: {request.status}
          </span>
        </div>
        {request.status === 'Pending' && (
          <div className="received-requests__request-actions">
            <button
              className="received-requests__action-button received-requests__action-accept"
              onClick={() => handleAccept(request.id)}
            >
              Accept
            </button>
            <button
              className="received-requests__action-button received-requests__action-deny"
              onClick={() => handleDeny(request.id)}
            >
              Deny
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

export default ReceivedRequests;