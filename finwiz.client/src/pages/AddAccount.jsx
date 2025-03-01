import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from '../utils/BaseUrl';
import { showToast } from '../utils/Toast';
import '../stylesheets/pages/AddAccount.css';

function AddAccount() {
    const navigate = useNavigate();

    const [accountData, setAccountData] = useState({
        Type: 0,  // Default to "Credit"
        Name: null,
        Provider: null,
        CreditLimit: null,
        StatementDate: null,
        PaymentDate: null,
        DueDate: null,
        IsAutopayOn: false,
        AnnualFee: null,
        FeeDate: null,
        ImagePath: null,
        Notes: null,
        APY: null
    });

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // console.log("CHANGED:", name, value);

        setAccountData(prevState => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        try {
            // console.log("SENDING DATA:", accountData);

            const response = await fetch(`${API_BASE_URL}/api/Account/Create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(accountData)
            });

            const data = await response.json();

            if (response.ok) {
                showToast("Account created successfully!", "success");
                navigate("/overview");
            } 
            else {
                console.error("Error: " + (data.message || "Failed to create account"));
                showToast("Failed to create account.", "error");
            }
        } 
        catch (error) {
            console.error("Error:", error);
            showToast("Failed to create account. Please try again.", "error", "(catch)");
        }
    };

    return (
    <>
        <div className="page-header">
            <h1>Account Details</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="account-form">
            <div className="inputs-ctnr">
                <div className="input-row">
                    {/* Type */}
                    <div className="input-w-label">
                        <label>Type *</label>
                        <select
                            name="Type" 
                            value={accountData.Type} 
                            onChange={handleChange}
                        >
                            <option value={0}>Credit</option>
                            <option value={1}>Savings</option>
                        </select>
                    </div>
                    {/* Name */}
                    <div className="input-w-label">
                        <label>Name *</label>
                        <input
                            type="text"
                            name="Name"
                            placeholder="(e.g., Gold Card)"
                            value={accountData.Name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Provider */}
                    <div className="input-w-label">
                        <label>Provider *</label>
                        <input
                            type="text"
                            name="Provider"
                            placeholder="(e.g., American Express)"
                            value={accountData.Provider}
                            onChange={handleChange} required
                        />
                    </div>
                    {/* Image URL */}
                    <div className="input-w-label">
                        <label>Image URL</label>
                        <input
                            type="text"
                            name="ImagePath"
                            placeholder="URL"
                            value={accountData.ImagePath}
                            onChange={handleChange}
                        />
                    </div>
                    {/* Credit Limit */}
                    {accountData.Type == 0 && (
                        <div className="input-w-label">
                            <label>Credit Limit</label>
                            <input
                                type="number"
                                name="CreditLimit"
                                placeholder="$"
                                value={accountData.CreditLimit}
                                onChange={handleChange}
                            />
                        </div>
                    )} 
                </div>

                <div className="input-row">
                    {/* Statement Date */}
                    {accountData.Type == 0 && (
                        <div className="input-w-label">
                            <label>Statement Date</label>
                            <input
                                type="date"
                                name="StatementDate"
                                value={accountData.StatementDate}
                                onChange={handleChange}
                            />
                        </div>
                    )}
                    {/* Payment Date */}
                    <div className="input-w-label">
                        <label>Payment Date</label>
                        <input
                            type="date"
                            name="PaymentDate"
                            value={accountData.PaymentDate}
                            onChange={handleChange}
                        />
                    </div>
                    {/* Due Date */}
                    {accountData.Type == 0 && (
                        <div className="input-w-label">
                            <label>Due Date</label>
                            <input
                                type="date"
                                name="DueDate"
                                value={accountData.DueDate}
                                onChange={handleChange}
                            />
                        </div>
                    )}
                    {/* Annual Fee */}
                    {accountData.Type == 0 && (
                        <div className="input-w-label">
                            <label>Annual Fee</label>
                            <input
                                type="number"
                                name="AnnualFee"
                                placeholder="$"
                                value={accountData.AnnualFee}
                                onChange={handleChange}
                            />
                        </div>
                    )}
                    
                    {/* Fee Date */}
                    {accountData.Type == 0 && (
                        <div className="input-w-label">
                            <label>Fee Date</label>
                            <input
                                type="date"
                                name="FeeDate"
                                value={accountData.FeeDate}
                                onChange={handleChange}
                            />
                        </div>
                    )}
                    
                    {/* APY */}
                    {accountData.Type == 1 && (
                        <div className="input-w-label">
                            <label>APY</label>
                            <input
                                type="number"
                                name="APY"
                                placeholder="APY"
                                value={accountData.APY}
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
                            name="Notes"
                            placeholder="(e.g., 'Use for groceries and restaurants')"
                            value={accountData.Notes}
                            onChange={handleChange}
                        />
                    </div>
                    {/* Autopay? */}
                    <div className="input-w-label checkbox">
                        <label>Autopay? *</label>
                        <input 
                            type="checkbox" 
                            className="checkbox"
                            name="IsAutopayOn" 
                            checked={accountData.IsAutopayOn} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
            </div>

            {/* Submit button */}
            <button type="submit" className="btn btn-accent">Save</button>
        </form>
    </>
    )
}

export default AddAccount;