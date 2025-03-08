import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { AccountsContext } from '../context/AccountsContext';
import { getCurrentAccount } from '../utils/CurrentAccountFinder';
import { showToast } from '../utils/Toast';
import { API_BASE_URL } from '../utils/BaseUrl';
import { formatCurrency } from '../utils/CurrencyFormatter';
import { formatDate } from '../utils/DateFormatter';
import '../stylesheets/pages/Statements.css';

function Statements() {
    const navigate = useNavigate();
    const { accountId } = useParams();
    const { accounts, accountsLoading, accountsError } = useContext(AccountsContext);

    const [currentAccount, setCurrentAccount] = useState(null);
    const [statementList, setStatementList] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [newStatementData, setNewStatementData] = useState({
        statementStart: null,
        statementEnd: null,
        paymentDate: null,
        dueDate: null,
        amount: null,
        isPaid: false
    });

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
                console.log(data);

                if (!data || data.length === 0) {
                    setStatementList([]);
                    return;
                }
                else setStatementList(data);
            }
            catch (error) {
                console.error("(catch) Error fetching statements:", error);
                showToast("An error occurred", "error");
            }
        }

        fetchStatements();
    }, [currentAccount]);

    const handleNavigateAddStatement = () => navigate(`/statement-details`);

    const handleChangeCreate = (e) => {
        const { name, value, type, checked } = e.target;

        setNewStatementData(prevState => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    const handleSubmitCreate = async (e) => {
        e.preventDefault(); // Prevent page reload

        // Create sanitizedData by checking each value in accountData
        // Replace any "" values with null
        let sanitizedData = Object.keys(newStatementData).reduce((statement, key) => {
            statement[key] = newStatementData[key] === "" ? null : newStatementData[key];
            return statement;
        }, {});

        // sanitizedData.amount = Number(sanitizedData.amount);

        try {
            // console.log("SENDING DATA:", sanitizedData);

            const response = await fetch(`${API_BASE_URL}/api/Statement/${accountId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sanitizedData)
            });

            const data = await response.json();

            if (response.ok) {
                showToast("Statement created successfully!", "success");

                // Optimistically update the statement list
                setStatementList(prevList => [...prevList, data]);

                // Reset form and close modal
                setNewStatementData({
                    statementStart: null,
                    statementEnd: null,
                    paymentDate: null,
                    dueDate: null,
                    amount: null,
                    isPaid: false
                });
                
                setIsAdding(false);
            } 
            else {
                console.error("Error: " + (data.message || "Failed to create statement"));
                showToast("Failed to create statement", "error");
            }
        } 
        catch (error) {
            console.error("Error:", error);
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
    <div className="page-ctnr Statements">
        <div className="widget">
            <div className="widget-head">
                <h2>Statement History</h2>
                <AnimatePresence>
                    {!isAdding && (
                        <motion.abbrbutton 
                            type="button" 
                            className="btn btn-accent"
                            onClick={() => setIsAdding(true)}

                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            Add
                        </motion.abbrbutton>
                    )}
                </AnimatePresence>
            </div>

            {/* NEW STATMENT FORM */}
            <AnimatePresence>
                {isAdding && (
                    <motion.form 
                        className="statement-form"
                        onSubmit={handleSubmitCreate}

                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inputs-ctnr">
                            {/* Statement Start */}
                            <div className="input-w-label">
                                <label>Statement Start *</label>
                                <input
                                    type="date"
                                    name="statementStart"
                                    value={newStatementData.statementStart}
                                    onChange={handleChangeCreate}
                                    required
                                />
                            </div>
                            {/* Statement End */}
                            <div className="input-w-label">
                                <label>Statement End *</label>
                                <input
                                    type="date"
                                    name="statementEnd"
                                    value={newStatementData.statementEnd}
                                    onChange={handleChangeCreate}
                                    required
                                />
                            </div>
                            {/* Payment Date */}
                            <div className="input-w-label">
                                <label>Payment Date *</label>
                                <input
                                    type="date"
                                    name="paymentDate"
                                    value={newStatementData.paymentDate}
                                    onChange={handleChangeCreate}
                                    required
                                />
                            </div>
                            {/* Due Date */}
                            <div className="input-w-label">
                                <label>Due Date</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={newStatementData.dueDate}
                                    onChange={handleChangeCreate}
                                />
                            </div>
                            {/* Amount */}
                            <div className="input-w-label">
                                <label>Amount *</label>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="$"
                                    value={newStatementData.amount}
                                    onChange={handleChangeCreate}
                                    required
                                />
                            </div>
                            {/* Is Paid? */}
                            <div className="input-w-label checkbox">
                                <label>Paid? *</label>
                                <input 
                                    type="checkbox" 
                                    className="checkbox"
                                    name="isPaid" 
                                    value={newStatementData.isPaid}
                                    onChange={handleChangeCreate}
                                />
                            </div>
                        </div>
                        
                        {/* Buttons */}
                        <div className="btn-row">
                            <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
                            <button type="submit" className="btn btn-accent">Save</button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
            
            

            {statementList && statementList.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Statement Period</th>
                            <th>Payment Date</th>
                            <th>Due Date</th>
                            <th>Amount</th>
                            <th>Paid?</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {statementList.map((s, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{formatDate(s.statementStart)} - {formatDate(s.statementEnd)}</td>
                                <td>{formatDate(s.paymentDate)}</td>
                                <td>{formatDate(s.dueDate)}</td>
                                <td>{formatCurrency(s.amount)}</td>
                                <td>{s.isPaid ? "Yes" : "No"}</td>
                                <td>
                                    <button>x</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No statements yet.</p>
            )}
        </div>
    </div>
    )
}

export default Statements;