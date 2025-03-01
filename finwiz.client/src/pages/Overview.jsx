import React, { useContext } from 'react';

import { AccountsContext } from '../context/AccountsContext';
import '../stylesheets/pages/Overview.css';

function Overview() {
    const { accounts, accountsLoading, accountsError } = useContext(AccountsContext);

    if (accountsLoading) return <p>Loading accounts...</p>;
    if (accountsError) return <p>{accountsError}</p>;

    return (
    <>
        <h1>Overview</h1>

        {accounts.map(account => (
            <div key={account.id}>
                <p>{account.provider}</p>
                <h2>{account.name}</h2>
            </div>
        ))}
    </>
    )
}

export default Overview;