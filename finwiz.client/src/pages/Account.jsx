import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import SpendingTrendChart from '../components/widgets/SpendingTrendChart';
import SpendingStatistics from '../components/widgets/SpendingStatistics';
import AccountInfoBlock from '../components/AccountInfoBlock';
import { AccountsContext } from '../context/AccountsContext';
import { getCurrentAccount } from '../utils/CurrentAccountFinder';
import { API_BASE_URL } from '../utils/BaseUrl';
import { cardTypes } from '../utils/CardTypes';
import { formatDate, getNextDayDate } from '../utils/DateHelper';
import { formatCurrency } from '../utils/CurrencyFormatter';
import '../stylesheets/pages/Account.css';

function Account() {
    const { accountId } = useParams();
    const { accounts, accountsLoading, accountsError } = useContext(AccountsContext);

    const [currentAccount, setCurrentAccount] = useState(null);
    const [statementList, setStatementList] = useState(null);
    const [latestStatement, setLatestStatement] = useState(null);
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

        if (statementList) {
            setLatestStatement(getLatestStatement(statementList));
        }
    }, [currentAccount, statementList]);



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
                                            className="icon-dynamic"
                                            onClick={() => setShowNotes(!showNotes)}
                                            whileTap={{ scale: 0.9 }}
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
                                    {currentAccount.feeDate && (
                                        <p className="p-4">on {formatDate(currentAccount.feeDate, false)}</p>
                                    )}
                                </>
                            ) : currentAccount.type !== 1 ? 
                                (<p className="p-5">No annual fee</p>) : ("")
                            }
                        </div>
                    </div>
                    <div className="acc-info-ctnr">
                        {/* APY */}
                        {currentAccount.type === 1 && currentAccount.apy && (
                            <AccountInfoBlock 
                                key={currentAccount.apy}
                                label="Annual Percentage Yield" 
                                content={`${currentAccount.apy}%`}
                                delay={0.1}
                            />
                        )}
                        {/* Credit Limit */}
                        {currentAccount.type === 0 && currentAccount.creditLimit && (
                            <AccountInfoBlock 
                                key={currentAccount.creditLimit}
                                label="Credit Limit" 
                                content={formatCurrency(currentAccount.creditLimit, false)}
                                delay={0.1}
                            />
                        )}
                        {/* Latest Statement */}
                        {latestStatement && (
                            <AccountInfoBlock 
                                key={latestStatement.amount}
                                label="Latest Statement" 
                                content={formatCurrency(latestStatement.amount)}
                                delay={0.2}
                            />
                        )}
                        {/* Statement Date */}
                        {currentAccount.statementDay && (
                            <AccountInfoBlock 
                                key={currentAccount.statementDay}
                                label="Next Statement Available" 
                                content={formatDate(getNextDayDate(currentAccount.statementDay), false)}
                                delay={0.3}
                            />
                        )}
                        {/* Payment Date */}
                        {currentAccount.paymentDay && (
                            <AccountInfoBlock 
                                key={currentAccount.paymentDay}
                                label="Next Payment on" 
                                content={formatDate(getNextDayDate(currentAccount.paymentDay), false)}
                                delay={0.4}
                            />
                        )}
                        {/* Due Date */}
                        {currentAccount.dueDay && (
                            <AccountInfoBlock 
                                key={currentAccount.dueDay}
                                label="Due on" 
                                content={formatDate(getNextDayDate(currentAccount.dueDay), false)}
                                delay={0.5}
                            />
                        )}
                    </div>
                </motion.div>

                {statementList && statementList.length > 0 && (
                    <div className="widget-row">
                        {/* Monthly Spending Trend widget */}
                        <motion.div 
                            className="widget"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="widget-head">
                                <h3>Spending Trend</h3>
                            </div>
                            <SpendingTrendChart statements={statementList} />
                        </motion.div>

                        {/* Statistic widget */}
                        <motion.div 
                            className="widget"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <div className="widget-head">
                                <h3>Spending Stats</h3>
                            </div>
                            <div className="widget-body">
                                <SpendingStatistics statements={statementList} />
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