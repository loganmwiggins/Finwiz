import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Nav from './components/Nav';
import Overview from './pages/Overview';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <div>
                <Nav />

                <div className="app-content">
                    <Routes>
                        <Route path="/" element={<Overview />} />
                        <Route path="/overview" element={<Overview />} />
                        <Route path="/dashboard/:accountId?" element={<Dashboard />} />

                        {/* Catch-all route for unknown paths */}
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;