import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AccountsContext } from '../context/AccountsContext';
import { cardTypes } from '../utils/CardTypes';
import { formatCurrency } from '../utils/CurrencyFormatter';
import '../stylesheets/pages/Account.css';

function Account() {
    const { accountId } = useParams();
    const { accounts, accountsLoading, accountsError } = useContext(AccountsContext);

    const [account, setAccount] = useState(null);

    // Set account when accounts are loaded and accountId is available
    useEffect(() => {
        if (accounts.length > 0 && accountId) {
            const foundAccount = accounts.find(acc => acc.id === accountId);
            setAccount(foundAccount || null);
        }
    }, [accounts, accountId]);

    // AccountsContext returns
    if (accountsLoading) {
        return (
            <div className="loading-ctnr">
                <div className="loading-spinner"></div>
                <p>Loading accounts...</p> 
            </div>
        ); 
    }
    if (accountsError) return <p>{accountsError}</p>;

    return (
    <div className="page-ctnr Account">
        {account ? (
            <div className="widget card-details-widget">
                <div className="card-details-head">
                    <img src={account.imagePath} draggable="false" />
                    <div className="card-text">
                        <p className="card-name">{account.provider} {account.name}</p>
                        <p className="card-type">{cardTypes[account.type]} Account</p>
                    </div>
                </div>
                <div className="stats-ctnr">
                    <div className="stat">
                        <p>Credit Limit</p>
                        <h1>
                            {account.creditLimit ? (
                                `${formatCurrency(account.creditLimit, false)}`
                            ) : (
                                `N/A`
                            )}
                        </h1>
                    </div>
                    <div className="stat">
                        <p>Latest Statement</p>
                        <h1>$2,070.82</h1>
                    </div>
                    <div className="stat">
                        <p>Next Payment Due on</p>
                        <h1>March 13</h1>
                    </div>
                </div>
            </div>
        ) : (
            <p>Account not found.</p>
        )}
    </div>
    )
}

export default Account;