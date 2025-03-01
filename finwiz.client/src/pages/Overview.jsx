import React, { useContext } from 'react';

import { AccountsContext } from '../context/AccountsContext';
import '../stylesheets/pages/Overview.css';

function Overview() {
    const { accounts, accountsLoading, accountsError } = useContext(AccountsContext);

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
    <>
        <div className="page-header">
            <h1>Overview</h1>
        </div>

        <div className="accounts-widget">
            <h2>Accounts</h2>
            <div className="accounts-ctnr">
                {accounts.map(account => (
                    <div key={account.id} className="account-card">
                        <p className="provider">{account.provider}</p>
                        <p className="name">{account.name}</p>
                    </div>
                ))}
            </div>
        </div>

        
    </>
    )
}

export default Overview;