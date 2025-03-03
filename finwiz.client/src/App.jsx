import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AccountsProvider } from './context/AccountsContext';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Account from './pages/Account';
import Statements from './pages/Statements';
import AccountDetails from './pages/AccountDetails';
import './App.css';

function App() {
    return (
        <AccountsProvider>
            <BrowserRouter>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    closeOnClick
                    newestOnTop
                />

                <Routes>
                    {/* Routes inside Layout will have Nav */}
                    <Route element={<Layout />}>
                        <Route path="/" element={<Overview />} />
                        <Route path="/overview" element={<Overview />} />
                        <Route path="/account/:accountId" element={<Account />} />
                        <Route path="/statements/:accountId" element={<Statements />} />
                        <Route path="/details/:accountId?" element={<AccountDetails />} />
                    </Route>

                    {/* Catch-all route for unknown paths */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </AccountsProvider>
    );
}

export default App;