import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AccountsContext } from '../context/AccountsContext';
import { getCurrentAccount } from '../utils/CurrentAccountFinder';
import { formatDateToInput } from '../utils/DateHelper';
import { API_BASE_URL } from '../utils/BaseUrl';
import { showToast } from '../utils/Toast';
import '../stylesheets/pages/StatementDetails.css';

function StatementDetails() {
    const navigate = useNavigate();
    const { accountId, statementId } = useParams();
    const { accounts, accountsLoading, accountsError, setAccounts } = useContext(AccountsContext);

    const [currentAccount, setCurrentAccount] = useState(null);
    const [statementData, setStatementData] = useState(null);

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
        <div className="page-ctnr StatementDetails">

        </div>
    )
}

export default StatementDetails;