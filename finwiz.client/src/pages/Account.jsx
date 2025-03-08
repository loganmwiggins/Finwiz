import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { AccountsContext } from '../context/AccountsContext';
import { getCurrentAccount } from '../utils/CurrentAccountFinder';
import { cardTypes } from '../utils/CardTypes';
import { formatCurrency } from '../utils/CurrencyFormatter';
import '../stylesheets/pages/Account.css';

function Account() {
    const { accountId } = useParams();
    const { accounts, accountsLoading, accountsError } = useContext(AccountsContext);

    const [currentAccount, setCurrentAccount] = useState(null);

    // Retrieve current account
    useEffect(() => {
        if (!accountsLoading && accounts.length > 0) {
            if (accountId) setCurrentAccount(getCurrentAccount(accounts, accountId));
            else setCurrentAccount(null);
        }
    }, [accounts, accountId, accountsLoading]);

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
        {currentAccount ? (
            <div className="widget card-details-widget">
                <div className="card-details-head">
                    <div className="head-left">
                        {currentAccount.imagePath ? (
                            <img src={currentAccount.imagePath} draggable="false" />
                        ) : (
                            <img src="/assets/images/example-card.webp" draggable="false" />
                        )}

                        <div className="card-text">
                            <p className="card-name">{currentAccount.provider} {currentAccount.name}</p>
                            <p className="card-type">{cardTypes[currentAccount.type]} Account</p>
                        </div>
                    </div>
                    <div className="head-right">
                        <p className="annual-fee">{formatCurrency(currentAccount.annualFee, false)}/year</p>
                        <p>Next Due on {currentAccount.feeDate && (``)}</p>
                    </div>
                </div>
                <div className="stats-ctnr">
                    <div className="stat">
                        <p>Credit Limit</p>
                        <h1>
                            {currentAccount.creditLimit ? (
                                `${formatCurrency(currentAccount.creditLimit, false)}`
                            ) : (
                                `N/A`
                            )}
                        </h1>
                    </div>
                    <div className="stat">
                        <p>Latest Statement</p>
                        <h1>-</h1>
                    </div>
                    <div className="stat">
                        <p>Next Payment Due on</p>
                        <h1>-</h1>
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