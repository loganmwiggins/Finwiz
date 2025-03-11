import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Required for Chart.js v3+

import { AccountsContext } from '../context/AccountsContext';
import { getCurrentAccount } from '../utils/CurrentAccountFinder';
import { API_BASE_URL } from '../utils/BaseUrl';
import { cardTypes } from '../utils/CardTypes';
import { formatDate } from '../utils/DateFormatter';
import { formatCurrency } from '../utils/CurrencyFormatter';
import '../stylesheets/pages/Account.css';

function Account() {
    const { accountId } = useParams();
    const { accounts, accountsLoading, accountsError } = useContext(AccountsContext);

    const [currentAccount, setCurrentAccount] = useState(null);
    const [statementList, setStatementList] = useState(null);
    const [latestStatement, setLatestStatement] = useState(null);
    const [averageSpend, setAverageSpend] = useState(null);
    const [totalSpend, setTotalSpend] = useState(null);
    const [showNotes, setShowNotes] = useState(false);

    // Fetch current account
    useEffect(() => {
        if (!accountsLoading && accounts.length > 0) {
            if (accountId) setCurrentAccount(getCurrentAccount(accounts, accountId));
            else setCurrentAccount(null);
        }
    }, [accounts, accountId, accountsLoading]);

    // Fetch statement list
    useEffect(() => {
        const fetchStatements = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/Statement/${accountId}`);

                if (!response.ok) showToast("Error fetching statements", "error");

                const data = await response.json();

                if (!data || data.length === 0) {
                    setStatementList([]);
                    return;
                }
                else setStatementList(data);
            }
            catch (error) {
                console.error("(catch) Error fetching statements:", error);
                showToast("An error occurred. Please try again later.", "error");
            }
        }

        fetchStatements();
    }, [currentAccount]);

    // Get statement list stats
    useEffect(() => {
        const getLatestStatement = (statements) => {
            if (!statements || statements.length === 0) return null;
        
            return statements.reduce((latest, statement) => 
                new Date(statement.statementEnd) > new Date(latest.statementEnd) ? statement : latest
            , statements[0]);
        };

        const getAverageStatementAmount = (statements) => {
            if (!statements || statements.length === 0) return 0;
        
            const total = statements.reduce((sum, statement) => sum + statement.amount, 0);
            return total / statements.length;
        };

        const getTotalStatementAmount = (statements) => {
            if (!statements || statements.length === 0) return 0;
        
            const total = statements.reduce((sum, statement) => sum + statement.amount, 0);
            return total;
        };

        if (statementList) {
            setLatestStatement(getLatestStatement(statementList));
            setAverageSpend(getAverageStatementAmount(statementList));
            setTotalSpend(getTotalStatementAmount(statementList));
        }
    }, [currentAccount, statementList]);

    // Handle account notes pop-up
    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (!event.target.closest(".card-type")) {
    //             setShowNotes(false);
    //         }
    //     }
    
    //     document.addEventListener("click", handleClickOutside);
    //     return () => document.removeEventListener("click", handleClickOutside);
    // }, []);

    // Process data for Chart.js
    const processMonthlySpendingTrend = () => {
        if (!statementList.length) return { labels: [], datasets: [] };

        const monthlyTotals = {};
        statementList.forEach(statement => {
            const date = new Date(statement.statementEnd);
            const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

            if (!monthlyTotals[monthYear]) monthlyTotals[monthYear] = 0;
            monthlyTotals[monthYear] += statement.amount;
        });

        const labels = Object.keys(monthlyTotals).sort(
            (a, b) => new Date(a) - new Date(b)
        );
        const dataValues = labels.map(label => monthlyTotals[label]);

        return {
            labels,
            datasets: [
                {
                    label: 'Monthly Spending',
                    data: dataValues,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    fill: true,
                    tension: 0.1,
                },
            ],
        };
    };



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
        currentAccount ? (
            <div className="page-ctnr Account">
                <motion.div 
                    className="widget card-details-widget"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="card-details-head">
                        <div className="head-left">
                            {currentAccount.imagePath ? (
                                <img src={currentAccount.imagePath} draggable="false" />
                            ) : (
                                <img src="/assets/images/example-card.webp" draggable="false" />
                            )}

                            <div className="card-text">
                                <p className="card-name">{currentAccount.provider} {currentAccount.name}</p>
                                <div className="card-type">
                                    <span>{cardTypes[currentAccount.type]} Account</span>
                                    {currentAccount.notes && (
                                        <motion.img 
                                            src="/assets/icons/comment-info.svg" 
                                            draggable="false" 
                                            onClick={() => setShowNotes(!showNotes)}
                                            whileTap={{scale: 0.9}}
                                        />
                                    )}
                                    <AnimatePresence>
                                        {showNotes && (
                                            <motion.div
                                                className="notes"
                                                initial={{ opacity: 0, x: -10}}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                            >
                                                {currentAccount.notes}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                        
                        <div className="head-right">
                            {currentAccount.annualFee ? (
                                <>
                                    <p className="annual-fee">{formatCurrency(currentAccount.annualFee, false)}/year</p>
                                    <p className="p-4">on {currentAccount.feeDate && (formatDate(currentAccount.feeDate, false))}</p>
                                </>
                            ) : currentAccount.type !== 1 ? 
                                (<p className="p-5">No annual fee</p>) : ("")
                            }
                        </div>
                    </div>
                    <div className="acc-info-ctnr">
                        {/* APY */}
                        {currentAccount.type === 1 && currentAccount.apy && (
                            <div className="acc-info">
                                <p>Annual Percentage Yield</p>
                                <h1>{currentAccount.apy}%</h1>
                            </div>
                        )}
                        {/* Credit Limit */}
                        {currentAccount.type === 0 && currentAccount.creditLimit && (
                            <div className="acc-info">
                                <p>Credit Limit</p>
                                <h1>{formatCurrency(currentAccount.creditLimit, false)}</h1>
                            </div>
                        )}
                        {/* Latest Statement */}
                        {latestStatement && (
                            <div className="acc-info">
                                <p>Latest Statement</p>
                                <h1>{formatCurrency(latestStatement.amount)}</h1>
                            </div>
                        )}
                        {/* Payment Date */}
                        {currentAccount.paymentDate && (
                            <div className="acc-info">
                                <p>Next Payment on</p>
                                <h1>{formatDate(currentAccount.paymentDate, false)}</h1>
                            </div>
                        )}
                        {/* Due Date */}
                        {currentAccount.dueDate && (
                            <div className="acc-info">
                                <p>Due on</p>
                                <h1>{formatDate(currentAccount.dueDate, false)}</h1>
                            </div>
                        )}
                    </div>
                </motion.div>

                {statementList && statementList.length > 0 && (
                    <div className="widget-row">
                        <motion.div 
                            className="widget"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="widget-head">
                                <h3>Monthly Spending Trend</h3>
                            </div>
                            <Line data={processMonthlySpendingTrend()} />
                        </motion.div>
                        <motion.div 
                            className="widget"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <div className="widget-head">
                                <h3>Stats</h3>
                            </div>
                            <div className="widget-body">
                                {totalSpend && (
                                    <div className="stat-row">
                                        <div>Total Lifetime Spend <span className="p-4">({statementList.length} statements)</span></div>
                                        <div className="stat">{formatCurrency(totalSpend)}</div>
                                    </div>
                                )}
                                {averageSpend && (
                                    <div className="stat-row">
                                        <div>Average Monthly Spend</div>
                                        <div className="stat">{formatCurrency(averageSpend)}</div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        ) : (
            <p>Account not found.</p>
        )
    )
}

export default Account;