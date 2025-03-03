import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { AccountsContext } from '../context/AccountsContext';
import { getCurrentAccount } from '../utils/CurrentAccountFinder';
import '../stylesheets/pages/Statements.css';

function Statements() {
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
    <div className="page-ctnr Statements">
        <div className="widget">
            <h2>Statements</h2>
        </div>
    </div>
    )
}

export default Statements;