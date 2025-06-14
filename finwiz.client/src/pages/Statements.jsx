import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { showToast } from '../utils/Toast';
import Switch from '@mui/material/Switch';

import { AccountsContext } from '../context/AccountsContext';
import { getCurrentAccount } from '../utils/CurrentAccountFinder';
import { API_BASE_URL } from '../utils/BaseUrl';
import { formatCurrency } from '../utils/CurrencyFormatter';
import { formatDate, formatDateToInput } from '../utils/DateHelper';
import ConfirmModal from '../components/ConfirmModal';
import '../stylesheets/pages/Statements.css';

function Statements() {
    const { accountId } = useParams();
    const { accounts, accountsLoading, accountsError } = useContext(AccountsContext);

    const [currentAccount, setCurrentAccount] = useState(null);
    const [statementList, setStatementList] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [statementToDelete, setStatementToDelete] = useState(null);

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
                showToast("Statement added!", "success");

                // Optimistically update the statement list
                setStatementList(prevList => 
                    [...prevList, data].sort((a, b) => new Date(b.statementStart) - new Date(a.statementStart))
                );

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
                showToast("Statement updated!", "success");
            }
    
            // Optimistically update the statement list after a successful edit
            setStatementList((prev) =>
                prev
                    .map((s) => (s.id === editValues.id ? { ...s, ...editValues } : s))
                    .sort((a, b) => new Date(b.statementStart) - new Date(a.statementStart))
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
        try {
            const response = await fetch(`${API_BASE_URL}/api/Statement/${statementId}`, {
                method: "DELETE"
            });
    
            if (response.ok) {
                showToast("Statement deleted", "success");
    
                // Update the statement list by removing the deleted statement
                setStatementList(prevList => prevList.filter(s => s.id !== statementId));
            } 
            else {
                showToast("Failed to delete statement", "error");
            }
        } 
        catch (error) {
            console.error("Error deleting statement:", error);
            showToast("An error occurred. Please try again later.", "error");
        }
        finally {
            setShowDeleteModal(false);
            setStatementToDelete(null);
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
            <motion.div 
                className="widget"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
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
                                <img src="/assets/icons/plus.svg" draggable="false" />
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
                                <div className="input-w-label mwfc">
                                    <label>Paid? *</label>
                                    <Switch
                                        name="isPaid"
                                        checked={newStatementData.isPaid}
                                        onChange={handleChangeCreate}
                                        color="success"
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
                
                {/* STATEMENTS TABLE */}
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
                                        // Editing row
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
                                                <Switch
                                                    name="isPaid"
                                                    checked={editValues.isPaid}
                                                    onChange={(e) => 
                                                        setEditValues((prev) => ({ ...prev, isPaid: e.target.checked }))
                                                    }
                                                    color="success"
                                                />
                                            </td>
                                            <td className="td-btn">
                                                
                                                <button type="button" onClick={() => setIsEditing(null)}>
                                                    <img src="/assets/icons/cancel.svg" className="icon-dynamic" draggable="false" />
                                                </button>
                                                <button type="button" onClick={handleSubmitEdit}>
                                                    <img src="/assets/icons/save.svg" className="icon-dynamic" draggable="false" />
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        // Not editing
                                        <>
                                            <td>{statementList.length - index}</td>
                                            <td>{formatDate(s.statementStart)} → {formatDate(s.statementEnd)}</td>
                                            <td>{formatDate(s.paymentDate)}</td>
                                            <td>{formatDate(s.dueDate)}</td>
                                            <td>{formatCurrency(s.amount)}</td>
                                            <td>{s.isPaid ? "Yes" : "No"}</td>
                                            <td className="td-btn">
                                                <button type="button" onClick={() => handleEditClick(s)}>
                                                    <img src="/assets/icons/pencil.svg" className="icon" draggable="false" />
                                                </button>
                                                <button type="button" onClick={() => {
                                                    setStatementToDelete(s.id);
                                                    setShowDeleteModal(true);
                                                }}>
                                                    <img src="/assets/icons/trash.svg" className="icon" draggable="false" />
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    !isAdding && (
                        <p>
                            No statements yet.
                            <span className="p-action" onClick={() => setIsAdding(true)}> Create a new statement.</span>
                        </p>    
                    )
                )}
            </motion.div>

            {/* Confirm delete modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                header="Are you sure you want to delete this statement?"
                message="This action cannot be undone. The statement and all associated data will be permanently deleted."
                cancelBtn="Cancel"
                confirmBtn="Delete"
                onCancel={() => {
                    setShowDeleteModal(false);
                }}
                onConfirm={() => {
                    handleDeleteStatement(statementToDelete);
                }}
            />
        </div>
    );
}

export default Statements;