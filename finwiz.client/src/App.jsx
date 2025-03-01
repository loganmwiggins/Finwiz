import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Nav from './components/Nav';
import Home from './pages/Home';
import Account from './pages/Account';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <div>
                <Nav />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/account/:accountI" element={<Account />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;