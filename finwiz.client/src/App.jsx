import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Nav from './components/Nav';
import Overview from './pages/Overview';
import Account from './pages/Account';
import AddAccount from './pages/AddAccount';
import './App.css';
import { AccountsProvider } from './context/AccountsContext';

function App() {
    return (
        <AccountsProvider>
            <BrowserRouter>
                <div>
                    {/* Toast Container for toast alerts */}
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        // theme={localStorage.getItem("theme") === "light" ? "light" : "dark"}
                        closeOnClick
                        newestOnTop
                    />

                    <Nav />

                    <div className="app-content">
                        <div className="app-ctnr">
                            <Routes>
                                <Route path="/" element={<Overview />} />
                                <Route path="/overview" element={<Overview />} />
                                <Route path="/account/:accountId" element={<Account />} />
                                <Route path="/add-account" element={<AddAccount />} />

                                {/* Catch-all route for unknown paths */}
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        </AccountsProvider>
    );
}

export default App;