import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import { AccountsContext } from '../context/AccountsContext';
import { getCurrentAccount } from '../utils/CurrentAccountFinder';
import { formatDateToInput } from '../utils/DateHelper';
import { API_BASE_URL } from '../utils/BaseUrl';
import { showToast } from '../utils/Toast';
import '../stylesheets/pages/AccountDetails.css';

function AccountDetails() {
    const navigate = useNavigate();
    const { accountId } = useParams();
    const { accounts, accountsLoading, accountsError, setAccounts } = useContext(AccountsContext);

    const [currentAccount, setCurrentAccount] = useState(null);
    const [accountData, setAccountData] = useState({
        type: 0,  // Default to "Credit"
        name: null,
        provider: null,
        creditLimit: null,
        statementDay: null,
        paymentDay: null,
        dueDay: null,
        isAutopayOn: false,
        annualFee: null,
        feeDate: null,
        imagePath: null,
        notes: null,
        apy: null
    });

    // Retrieve current account
    useEffect(() => {
        if (!accountsLoading && accounts.length > 0) {
            if (accountId) setCurrentAccount(getCurrentAccount(accounts, accountId));
            else setCurrentAccount(null);
        }
    }, [accounts, accountId, accountsLoading]);

    // Populate form if editing an existing account
    useEffect(() => {
        if (currentAccount) {
            setAccountData({
                type: currentAccount.type,
                name: currentAccount.name || null,
                provider: currentAccount.provider || null,
                creditLimit: currentAccount.creditLimit || null,
                statementDay: currentAccount.statementDay || null,
                paymentDay: currentAccount.paymentDay || null,
                dueDay: currentAccount.dueDay || null,
                isAutopayOn: currentAccount.isAutopayOn || false,
                annualFee: currentAccount.annualFee || null,
                feeDate: formatDateToInput(currentAccount.feeDate) || null,
                imagePath: currentAccount.imagePath || null,
                notes: currentAccount.notes || null,
                apy: currentAccount.apy || null
            });
        }
    }, [currentAccount]);

    // Handle cancel button
    const handleCancel = () => {
        showToast("Changes were not saved.", "warning");

        if (accountId) navigate(`/account/${accountId}`);
        else navigate("/overview");
    }

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "type") {
            setAccountData({
                name: "",
                provider: "",
                creditLimit: "",
                statementDay: "",
                paymentDay: "",
                dueDay: "",
                isAutopayOn: false,
                annualFee: "",
                feeDate: "",
                imagePath: "",
                notes: "",
                apy: ""
            });
        }

        setAccountData(prevState => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        const endpoint = currentAccount
            ? `${API_BASE_URL}/api/Account/Update/${currentAccount.id}` 
            : `${API_BASE_URL}/api/Account/Create`;

        const method = currentAccount ? 'PUT' : 'POST';

        // Create sanitizedData by checking each value in accountData
        // Replace any "" values with null
        let sanitizedData = Object.keys(accountData).reduce((acc, key) => {
            acc[key] = accountData[key] === "" ? null : accountData[key];
            return acc;
        }, {});

        sanitizedData.type = Number(sanitizedData.type);

        try {
            // console.log("SENDING DATA:", sanitizedData);

            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sanitizedData)
            });

            const data = await response.json();

            if (response.ok) {
                if (currentAccount) {
                    showToast("Account updated successfully!", "success");

                    // Update the context state with the updated account (NOT WORKING)
                    setAccounts((prevAccounts) => 
                        prevAccounts.map((account) => 
                            account.id === currentAccount.id ? { ...account, ...sanitizedData } : account
                        )
                    );
                    
                    navigate(`/account/${accountId}`);
                }
                else {
                    showToast("Account created successfully!", "success");
                    navigate("/overview");
                }
            } 
            else {
                if (currentAccount) {
                    console.error("Error: " + (data.message || "Failed to update account"));
                    showToast("Failed to update account.", "error");
                }
                else {
                    console.error("Error: " + (data.message || "Failed to create account"));
                    showToast("Failed to create account.", "error");
                }
            }
        } 
        catch (error) {
            console.error("Error:", error);
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
    <div className="page-ctnr AccountDetails">
        <motion.div 
            className="widget"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h3>{currentAccount ? "Account Details" : "New Account"}</h3>

            <form onSubmit={handleSubmit} className="account-form">
                <div className="inputs-ctnr">
                    <div className="input-row">
                        {/* Type */}
                        <div className="input-w-label">
                            <label>Type *</label>
                            <select
                                name="type" 
                                value={accountData.type} 
                                onChange={handleChange}
                            >
                                <option value={0}>Credit</option>
                                <option value={1}>Savings</option>
                            </select>
                        </div>
                        {/* Provider */}
                        <div className="input-w-label">
                            <label>Provider *</label>
                            <input
                                type="text"
                                name="provider"
                                placeholder="(e.g., Chase, Discover, Amex)" // FIX: Change placeholders based on account type
                                value={accountData.provider}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {/* Name */}
                        <div className="input-w-label">
                            <label>Name *</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="(e.g., Freedom Unlimited, Gold Card)"
                                value={accountData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {/* Image URL */}
                        <div className="input-w-label">
                            <label>Image URL</label>
                            <input
                                type="text"
                                name="imagePath"
                                placeholder="URL"
                                value={accountData.imagePath}
                                onChange={handleChange}
                            />
                        </div>
                        {/* Credit Limit */}
                        {accountData.type == 0 && (
                            <div className="input-w-label">
                                <label>Credit Limit</label>
                                <input
                                    type="number"
                                    name="creditLimit"
                                    placeholder="$"
                                    value={accountData.creditLimit}
                                    onChange={handleChange}
                                />
                            </div>
                        )} 
                    </div>

                    <div className="input-row">
                        {/* Statement Day */}
                        {accountData.type == 0 && (
                            <div className="input-w-label">
                                <label>Statement Day</label>
                                <input
                                    type="number"
                                    name="statementDay"
                                    value={accountData.statementDay}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        {/* Payment Day */}
                        <div className="input-w-label">
                            <label>Payment Day</label>
                            <input
                                type="number"
                                name="paymentDay"
                                value={accountData.paymentDay}
                                onChange={handleChange}
                            />
                        </div>
                        {/* Due Day */}
                        {accountData.type == 0 && (
                            <div className="input-w-label">
                                <label>Due Day</label>
                                <input
                                    type="number"
                                    name="dueDay"
                                    value={accountData.dueDay}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        {/* Annual Fee */}
                        {accountData.type == 0 && (
                            <div className="input-w-label">
                                <label>Annual Fee</label>
                                <input
                                    type="number"
                                    name="annualFee"
                                    placeholder="$"
                                    value={accountData.annualFee}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        
                        {/* Fee Date */}
                        {accountData.type == 0 && (
                            <div className="input-w-label">
                                <label>Fee Date</label>
                                <input
                                    type="date"
                                    name="feeDate"
                                    value={accountData.feeDate}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        
                        {/* APY */}
                        {accountData.type == 1 && (
                            <div className="input-w-label">
                                <label>APY</label>
                                <input
                                    type="number"
                                    name="apy"
                                    placeholder="Annual Percentage Yield"
                                    value={accountData.apy}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                    </div>

                    <div className="input-row">
                        {/* Notes */}
                        <div className="input-w-label">
                            <label>Notes</label>
                            <input 
                                type="text"
                                name="notes"
                                placeholder="(e.g., 'Use for groceries and restaurants')"
                                value={accountData.notes}
                                onChange={handleChange}
                            />
                        </div>
                        {/* Autopay? */}
                        <div className="input-w-label checkbox">
                            <label>Autopay? *</label>
                            <input 
                                type="checkbox" 
                                className="checkbox"
                                name="isAutopayOn" 
                                checked={accountData.isAutopayOn} 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="btn-row">
                    <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button>
                    <button type="submit" className="btn btn-accent">Save</button>
                </div>
            </form>
        </motion.div>
    </div>
    )
}

export default AccountDetails;