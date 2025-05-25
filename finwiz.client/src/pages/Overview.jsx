import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { showToast } from '../utils/Toast';

import SpendingTrendChart from '../components/widgets/SpendingTrendChart';
import { AccountsContext } from '../context/AccountsContext';
import { API_BASE_URL } from '../utils/BaseUrl';
import { cardTypes } from '../utils/CardTypes';
import { formatDate, findDaysUntil, getNextDayDate } from '../utils/DateHelper';
import { formatCurrency } from '../utils/CurrencyFormatter';
import { allGreetings, getRandomElement } from '../utils/Greetings';
import '../stylesheets/pages/Overview.css';

function Overview() {
    const navigate = useNavigate();
    const { accounts, accountsLoading, accountsError } = useContext(AccountsContext);
    const [allStatements, setAllStatements] = useState([]);
    const [greeting, setGreeting] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);

    useEffect(() => {
        setGreeting(getRandomElement(allGreetings));
    }, []);

    // Handle toggling account actions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".account-menu-ctnr")) {
                setOpenMenuId(null);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Populate all statements
    useEffect(() => {
        setAllStatements(accounts.flatMap(account => account.statements || []));
    }, [accounts]);

    const navigateAccount = (accountId) => navigate(`/account/${accountId}`);
    const navigateAddAccount = () => navigate("/details");
    const navigateEditAccount = (event, accountId) => { 
        event.stopPropagation();
        navigate(`/details/${accountId}`);
    }

    const toggleAccountMenu = (event, accountId) => {
        event.stopPropagation();
        setOpenMenuId(openMenuId === accountId ? null : accountId);
    }

    const getTotalCreditLimit = (accounts) => {
        return accounts.reduce((total, account) => {
            return total + (account.creditLimit ?? 0); // Use 0 if creditLimit is null or undefined
        }, 0);
    };

    const handleDeleteAccount = async (event, accountId) => {
        event.stopPropagation();

        if (!window.confirm("Are you sure you want to delete this account?")) return;
    
        try {
            const response = await fetch(`${API_BASE_URL}/api/Account/${accountId}`, {
                method: "DELETE"
            });
    
            if (response.ok) {
                showToast("Account deleted successfully!", "success");
    
                // Update the statement list by removing the deleted statement
                // setStatementList(prevList => prevList.filter(s => s.id !== statementId));
            } 
            else {
                showToast("Failed to delete account", "error");
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            showToast("An error occurred. Please try again.", "error");
        }
    }
    


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
    <div className="Overview">
        <div className="page-header">
            <h2>{greeting}, Logan</h2>
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
                    <button type="button" className="btn btn-accent" onClick={navigateAddAccount}>
                        <img src="/assets/icons/plus.svg" draggable="false" />
                    </button>
                </div>
                {accounts.length > 0 ? (
                    <div className="accounts-ctnr">
                        {accounts.map((account, index) => (
                            <motion.div 
                                key={account.id} 
                                className="account-card" 
                                onClick={() => navigateAccount(account.id)}

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
                                    {account.creditLimit && (
                                        <div className="card-head-right">
                                            <p className="limit">{formatCurrency(account.creditLimit, false)}</p>
                                            <p className="type">Monthly Limit</p>
                                        </div>
                                    )}
                                </div>
                                <div className="card-foot">
                                    {account.paymentDay ? (
                                        <p>
                                            Next payment on {formatDate(getNextDayDate(account.paymentDay), false)} (
                                            {(() => {
                                                const days = findDaysUntil(getNextDayDate(account.paymentDay));
                                                if (days === 0) return 'Today';
                                                if (days === 1) return 'in 1 day';
                                                return `in ${days} days`;
                                            })()}
                                            )
                                        </p>
                                    ) : (
                                        ""
                                    )}
                                    <div className="account-menu-ctnr">
                                        {/* Ellipsis button */}
                                        <button type="button" onClick={(event) => toggleAccountMenu(event, account.id)}>
                                            <img src="/assets/icons/menu-dots.svg" className="icon" draggable="false" />
                                        </button>

                                        {/* Animated dropdown menu */}
                                        <AnimatePresence>
                                            {openMenuId === account.id && (
                                                <motion.div 
                                                    className="account-menu"
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                                >
                                                    <button type="button" onClick={(event) => navigateEditAccount(event, account.id)}>
                                                        <img src="/assets/icons/pencil.svg" className="icon" draggable="false" />
                                                    </button>
                                                    <button type="button" onClick={(event) => handleDeleteAccount(event, account.id)}>
                                                        <img src="/assets/icons/trash.svg" className="icon" draggable="false" />
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p>No accounts yet.</p>
                )}
            </motion.div>
            <div className="widget-col">
                {/* Quick Actions widget */}
                {/* <motion.div 
                    className="widget"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="widget-head">
                        <h3>Quick Actions</h3>
                    </div>
                </motion.div> */}

                {/* Total Credit Line widget */}
                <motion.div 
                    className="widget"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="widget-head">
                        <h3>Total Credit Line</h3>
                    </div>
                    <div className="credit-bar">
                        <div className="credit-bar-30"></div>
                    </div>
                    <div className="bar-num-ctnr">
                        <p>$0</p>
                        <p style={{color: 'var(--text-1)'}}>Target: {formatCurrency(getTotalCreditLimit(accounts) / 3)}</p>
                        <p></p>
                        <p>{formatCurrency(getTotalCreditLimit(accounts), false)}</p>
                    </div>
                </motion.div>

                {/* Monthly Spending Trend widget */}
                <motion.div 
                    className="widget"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <div className="widget-head">
                        <h3>Spending Trend</h3>
                    </div>
                    <SpendingTrendChart accounts={accounts} />
                </motion.div>
            </div>
            
        </div>
    </div>
    )
}

export default Overview;