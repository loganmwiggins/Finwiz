import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { showToast } from '../utils/Toast';
import Switch from '@mui/material/Switch';
import { HexColorPicker } from 'react-colorful';

import MonthDayPicker from '../components/MonthDayPicker';
import { AccountsContext } from '../context/AccountsContext';
import { getCurrentAccount } from '../utils/CurrentAccountFinder';
import { API_BASE_URL } from '../utils/BaseUrl';
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
        feeMonth: null,
        feeDay: null,
        imagePath: null,
        notes: null,
        apy: null,
        colorHex: "#1fa846"
    });
    const [showColorPicker, setShowColorPicker] = useState(false);

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
                isAutopayOn: currentAccount.isAutopayOn,
                annualFee: currentAccount.annualFee || null,
                feeMonth: currentAccount.feeMonth || null,
                feeDay: currentAccount.feeDay || null,
                imagePath: currentAccount.imagePath || null,
                notes: currentAccount.notes || null,
                apy: currentAccount.apy || null,
                colorHex: currentAccount.colorHex || "#1fa846"
            });
        }
    }, [currentAccount]);

    // Close color picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".color-picker-ctnr")) {
                setShowColorPicker(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Handle cancel button
    const handleCancel = () => {
        showToast("Changes were not saved.", "warning");

        if (accountId) navigate(`/account/${accountId}`);
        else navigate("/overview");
    }

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Special reset logic ONLY when selecting account type
        if (name === "type") {
            setAccountData({
                type: Number(value),
                name: "",
                provider: "",
                creditLimit: "",
                statementDay: "",
                paymentDay: "",
                dueDay: "",
                isAutopayOn: false,
                annualFee: "",
                feeMonth: "",
                feeDay: "",
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

    // Handle change color with picker
    const handleColorChange = (newColor) => {
        setAccountData(prev => ({ ...prev, colorHex: newColor }));
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
            console.log("SENDING DATA:", sanitizedData);

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
                    showToast("Account updated!", "success");

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
                                <MonthDayPicker
                                    label="Statement Day"
                                    askForMonth={false}
                                    askForDay={true}
                                    dayName="statementDay"
                                    dayValue={accountData.statementDay}
                                    onChange={handleChange}
                                />
                            )}
                            {/* Payment Day */}
                            <MonthDayPicker
                                label="Payment Day"
                                askForMonth={false}
                                askForDay={true}
                                dayName="paymentDay"
                                dayValue={accountData.paymentDay}
                                onChange={handleChange}
                            />
                            {/* Due Day */}
                            {accountData.type == 0 && (
                                <MonthDayPicker
                                    label="Due Day"
                                    askForMonth={false}
                                    askForDay={true}
                                    dayName="dueDay"
                                    dayValue={accountData.dueDay}
                                    onChange={handleChange}
                                />
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
                            <MonthDayPicker
                                label="Fee Date"
                                monthName="feeMonth"
                                dayName="feeDay"
                                monthValue={accountData.feeMonth}
                                dayValue={accountData.feeDay}
                                onChange={handleChange}
                            />
                            
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
                            <div className="input-w-label mwfc">
                                <label>Autopay? *</label>
                                <Switch
                                    name="isAutopayOn"
                                    checked={accountData.isAutopayOn}
                                    onChange={handleChange}
                                    color="success"
                                />
                            </div>

                            {/* Color */}
                            <div className="input-w-label mwfc">
                                <label>Color</label>
                                <div className="color-picker-ctnr">
                                    <motion.button
                                        type="button"
                                        className="color-btn"
                                        style={{ background: accountData.colorHex }}
                                        onClick={() => setShowColorPicker(!showColorPicker)}
                                        whileTap={{ scale: 0.8  }}
                                    ></motion.button>

                                    <AnimatePresence>
                                        {showColorPicker && (
                                            <motion.div
                                                className="color-picker"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                            >
                                                <div className="rgb-txt">{accountData.colorHex}</div>
                                                <HexColorPicker color={accountData.colorHex} onChange={handleColorChange} />
                                                <button type="button" className="btn btn-outline" onClick={() => handleColorChange("#1fa846")}>Reset to Default</button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
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
    );
}

export default AccountDetails;