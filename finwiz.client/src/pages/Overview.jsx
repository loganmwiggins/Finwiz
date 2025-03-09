import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { AccountsContext } from '../context/AccountsContext';
import '../stylesheets/pages/Overview.css';

function Overview() {
    const navigate = useNavigate();
    const { accounts, accountsLoading, accountsError } = useContext(AccountsContext);

    const handleNavigateAccount = (accountId) => navigate(`/account/${accountId}`);
    const handleNavigateAddAccount = () => navigate("/details");

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
            <h1>Welcome, Logan</h1>
        </div>

        <motion.div 
            className="accounts-widget"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="widget-head">
                <h2>Accounts</h2>
                <button type="button" className="btn btn-accent" onClick={handleNavigateAddAccount}>
                    {/* <img src="/assets/icons/add.svg" draggable="false" /> */}
                    + New
                </button>
            </div>
            {accounts.length > 0 ? (
                <div className="accounts-ctnr">
                    {accounts.map(account => (
                        <div key={account.id} className="account-card" onClick={() => handleNavigateAccount(account.id)}>
                            {account.imagePath ? (
                                <img src={account.imagePath} draggable="false" />
                            ) : (
                                <img src="/assets/images/example-card.webp" draggable="false" />
                            )}
                            
                            <div className="card-text">
                                <p className="provider">{account.provider}</p>
                                <p className="name">{account.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No accounts yet.</p>
            )}
            
        </motion.div>

        
    </>
    )
}

export default Overview;