import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
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

        if (statementList) {
            setLatestStatement(getLatestStatement(statementList));
            setAverageSpend(getAverageStatementAmount(statementList));
        }
    }, [currentAccount, statementList]);

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
                                <p className="card-type">{cardTypes[currentAccount.type]} Account</p>
                            </div>
                        </div>
                        <div className="head-right">
                            <p className="annual-fee">{formatCurrency(currentAccount.annualFee, false)}/year</p>
                            <p>Next Due on {currentAccount.feeDate && (formatDate(currentAccount.feeDate, false))}</p>
                        </div>
                    </div>
                    <div className="acc-info-ctnr">
                        <div className="acc-info">
                            <p>Credit Limit</p>
                            <h1>
                                {currentAccount.creditLimit ? (
                                    `${formatCurrency(currentAccount.creditLimit, false)}`
                                ) : (
                                    `N/A`
                                )}
                            </h1>
                        </div>
                        {latestStatement && (
                            <div className="acc-info">
                                <p>Latest Statement</p>
                                <h1>{formatCurrency(latestStatement.amount)}</h1>
                            </div>
                        )}
                        
                        <div className="acc-info">
                            <p>Next Payment on</p>
                            <h1>
                                {currentAccount.paymentDate ? (
                                    `${formatDate(currentAccount.paymentDate, false)}`
                                ) : (
                                    `N/A`
                                )}
                            </h1>
                        </div>
                        <div className="acc-info">
                            <p>Due on</p>
                            <h1>
                                {currentAccount.dueDate ? (
                                    `${formatDate(currentAccount.dueDate, false)}`
                                ) : (
                                    `N/A`
                                )}
                            </h1>
                        </div>
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