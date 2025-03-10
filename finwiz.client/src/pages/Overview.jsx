import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { AccountsContext } from '../context/AccountsContext';
import { cardTypes } from '../utils/CardTypes';
import { formatDate, findDaysUntil } from '../utils/DateFormatter';
import { formatCurrency } from '../utils/CurrencyFormatter';
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
            <h2>Welcome, Logan</h2>
        </div>

        <div className="widget-row">
            <motion.div 
                className="accounts-widget"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="widget-head">
                    <h3>Accounts</h3>
                    <button type="button" className="btn btn-accent" onClick={handleNavigateAddAccount}>
                        + New
                    </button>
                </div>
                {accounts.length > 0 ? (
                    <div className="accounts-ctnr">
                        {accounts.map((account, index) => (
                            <motion.div 
                                key={account.id} 
                                className="account-card" 
                                onClick={() => handleNavigateAccount(account.id)}

                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 * index }}
                            >
                                <div className="card-head">
                                    <div className="card-head-left">
                                        {account.imagePath ? (
                                            <img src={account.imagePath} draggable="false" />
                                        ) : (
                                            <img src="/assets/images/example-card.webp" draggable="false" />
                                        )}
                                        <div>
                                            <p className="name">{account.provider} {account.name}</p>
                                            <p className="type">{cardTypes[account.type]} Account</p>
                                        </div>
                                    </div>
                                    <div className="card-head-right">
                                        <p className="limit">
                                            {account.creditLimit ? (
                                                `${formatCurrency(account.creditLimit, false)}`
                                            ) : (
                                                `N/A`
                                            )}
                                        </p>
                                        <p className="type">Monthly Limit</p>
                                    </div>
                                </div>
                                <div className="card-details">
                                    <p>Next payment on {account.paymentDate ? (
                                            `${formatDate(account.paymentDate, false)} (in ${findDaysUntil(account.paymentDate)} days)`
                                        ) : (
                                            `N/A`
                                        )}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                        {/* <div className="add-account" onClick={handleNavigateAddAccount}>
                            + New Account
                        </div> */}
                    </div>
                ) : (
                    <p>No accounts yet.</p>
                )}
            </motion.div>
            <div className="widget-col">
                <motion.div 
                    className="widget"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="widget-head">
                        <h3>Quick Actions</h3>
                    </div>
                </motion.div>
                <motion.div 
                    className="widget"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="widget-head">
                        <h3>Total Credit Line</h3>
                    </div>
                </motion.div>
            </div>
            
        </div>
    </>
    )
}

export default Overview;