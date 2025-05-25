import React, { createContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/BaseUrl';

// Create the context
export const AccountsContext = createContext();

// Create a provider component
export const AccountsProvider = ({ children }) => {
    const [accounts, setAccounts] = useState([]);
    const [allStatements, setAllStatements] = useState([]);
    const allAvailableYears = Array.from(
        new Set(allStatements.map(s => new Date(s.statementEnd).getFullYear()))
    ).sort();

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

    // Populate all statements
    useEffect(() => {
        setAllStatements(accounts.flatMap(account => account.statements || []));
    }, [accounts]);

    return (
        <AccountsContext.Provider value={{ accounts, allStatements, allAvailableYears, accountsLoading, accountsError, setAccounts }}>
            {children}
        </AccountsContext.Provider>
    );
};