import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Required for Chart.js v3+

import { AccountsContext } from '../context/AccountsContext';
import { getCurrentAccount } from '../utils/CurrentAccountFinder';
import { showToast } from '../utils/Toast';
import { API_BASE_URL } from '../utils/BaseUrl';
import { formatCurrency } from '../utils/CurrencyFormatter';
import { formatDate, formatDateToInput } from '../utils/DateFormatter';
import '../stylesheets/pages/Statements.css';

function Statements() {
    const navigate = useNavigate();
    const { accountId } = useParams();
    const { accounts, accountsLoading, accountsError } = useContext(AccountsContext);

    const [currentAccount, setCurrentAccount] = useState(null);
    const [statementList, setStatementList] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState({});

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

    const handleChangeCreate = (e) => {
        const { name, value, type, checked } = e.target;

        setNewStatementData(prevState => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    // CREATE
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

    // UPDATE
    const handleEditClick = (statement) => {
        setIsEditing(statement.id);
        setEditValues({ ...statement }); // Initialize with current values
    };
    
    const handleChangeEdit = (e) => {
        const { name, value, type, checked } = e.target;
        
        setEditValues((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value, // Handle checkboxes properly
        }));
    };
    
    const handleSubmitEdit = async () => {
        if (!editValues) return;
    
        try {
            const response = await fetch(`${API_BASE_URL}/api/Statement/Update/${editValues.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editValues),
            });
    
            if (!response.ok) {
                showToast("Failed to update statement", "error");
                throw new Error("Failed to update statement");
            }
            else {
                showToast("Statement updated successfully", "success");
            }
    
            // Update the UI after a successful edit
            setStatementList((prev) =>
                prev.map((s) => (s.id === editValues.id ? { ...s, ...editValues } : s))
            );
    
            setIsEditing(null); // Exit edit mode
        } 
        catch (error) {
            showToast("Error updating statement. Please try again later.", "error");
            console.error("Error updating statement:", error);
        }
    };

    // DELETE
    const handleDeleteStatement = async (statementId) => {
        if (!window.confirm("Are you sure you want to delete this statement?")) return;
    
        try {
            const response = await fetch(`${API_BASE_URL}/api/Statement/${statementId}`, {
                method: "DELETE"
            });
    
            if (response.ok) {
                showToast("Statement deleted successfully!", "success");
    
                // Update the statement list by removing the deleted statement
                setStatementList(prevList => prevList.filter(s => s.id !== statementId));
            } 
            else {
                showToast("Failed to delete statement", "error");
            }
        } catch (error) {
            console.error("Error deleting statement:", error);
            showToast("An error occurred. Please try again.", "error");
        }
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
    <div className="page-ctnr Statements">
        {/* STATEMENT HISTORY WIDGET */}
        <div className="widget">
            <div className="widget-head">
                <h3>Statement History</h3>
                <AnimatePresence>
                    {!isAdding && (
                        <motion.button 
                            type="button" 
                            className="btn btn-accent"
                            onClick={() => setIsAdding(true)}

                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <span>+ New</span>
                        </motion.button>
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
                            <button type="button" className="btn btn-outline icon-dynamic" onClick={() => setIsAdding(false)}>Cancel</button>
                            <button type="submit" className="btn btn-accent icon-dynamic">Save</button>
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
                                {isEditing === s.id ? (
                                    <>
                                        <td></td>
                                        <td>
                                            <input 
                                                type="date" 
                                                name="statementStart" 
                                                value={editValues.statementStart ? formatDateToInput(editValues.statementStart) : ""} 
                                                onChange={handleChangeEdit} 
                                            /> &nbsp;&nbsp;→&nbsp;&nbsp;
                                            <input 
                                                type="date" 
                                                name="statementEnd" 
                                                value={editValues.statementEnd ? formatDateToInput(editValues.statementEnd) : ""} 
                                                onChange={handleChangeEdit} 
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="date" 
                                                name="paymentDate" 
                                                value={editValues.paymentDate ? formatDateToInput(editValues.paymentDate) : ""} 
                                                onChange={handleChangeEdit} 
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="date" 
                                                name="dueDate" 
                                                value={editValues.dueDate ? formatDateToInput(editValues.dueDate) : ""} 
                                                onChange={handleChangeEdit} 
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="number" 
                                                name="amount" 
                                                value={editValues.amount} 
                                                onChange={handleChangeEdit} 
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="checkbox" 
                                                name="isPaid" 
                                                checked={editValues.isPaid} 
                                                onChange={(e) => 
                                                    setEditValues((prev) => ({ ...prev, isPaid: e.target.checked }))
                                                }
                                            />
                                        </td>
                                        <td className="td-btn">
                                            
                                            <button type="button" onClick={() => setIsEditing(null)}>
                                                <img src="/assets/icons/cancel.svg" draggable="false" />
                                            </button>
                                            <button type="button" onClick={handleSubmitEdit}>
                                                <img src="/assets/icons/save.svg" draggable="false" />
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{statementList.length - index}</td>
                                        <td>{formatDate(s.statementStart)} → {formatDate(s.statementEnd)}</td>
                                        <td>{formatDate(s.paymentDate)}</td>
                                        <td>{formatDate(s.dueDate)}</td>
                                        <td>{formatCurrency(s.amount)}</td>
                                        <td>{s.isPaid ? "Yes" : "No"}</td>
                                        <td className="td-btn">
                                            <button type="button" onClick={() => handleEditClick(s)}>
                                                <img src="/assets/icons/pencil.svg" className="icon-dynamic" draggable="false" />
                                            </button>
                                            <button type="button" onClick={() => handleDeleteStatement(s.id)}>
                                                <img src="/assets/icons/trash.svg" className="icon-dynamic" draggable="false" />
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No statements yet.</p>
            )}
        </div>

        {statementList && statementList.length > 0 && (
            <div className="widget-row">
                <div className="widget">
                    <div className="widget-head">
                        <h3>Monthly Spending Trend</h3>
                    </div>
                    <Line data={processMonthlySpendingTrend()} />
                </div>
                <div className="widget">
                    <div className="widget-head">
                        <h3>Widget</h3>
                    </div>
                </div>
            </div>
            
        )}
    </div>
    )
}

export default Statements;