import React, { createContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/BaseUrl';

// Create the context
export const AccountsContext = createContext();

// Create a provider component
export const AccountsProvider = ({ children }) => {
    const [accounts, setAccounts] = useState([]);
    const [accountsLoading, setAccountsLoading] = useState(true);
    const [accountsError, setAccountsError] = useState(null);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/Account/GetAll`);
                const data = await response.json();
                setAccounts(data);
            }
            catch (err) {
                setAccountsError("Failed to fetch accounts.");
            }
            finally {
                setAccountsLoading(false);
            }
        };

        fetchAccounts();
    }, []); // This will run only once when the component mounts

    return (
        <AccountsContext.Provider value={{ accounts, accountsLoading, accountsError }}>
            {children}
        </AccountsContext.Provider>
    );
};