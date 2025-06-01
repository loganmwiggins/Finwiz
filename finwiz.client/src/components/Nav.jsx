import { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { AccountsContext } from '../context/AccountsContext';
import { useTheme } from '../context/ThemeContext';
import { getCurrentAccount } from '../utils/CurrentAccountFinder';
import '../stylesheets/components/Nav.css';

function Nav() {
    const navigate = useNavigate();
    const location = useLocation();
    const { accountId } = useParams();
    const { accounts, accountsLoading, accountsError } = useContext(AccountsContext);
    const { theme, setTheme } = useTheme();

    const [currentAccount, setCurrentAccount] = useState(null);
    const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

    // Retrieve current account
    useEffect(() => {
        if (!accountsLoading && accounts.length > 0) {
            if (accountId) setCurrentAccount(getCurrentAccount(accounts, accountId));
            else setCurrentAccount(null);
        }
    }, [accounts, accountId, accountsLoading]);

    // Handle click outside of menu dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".menu-btn")) {
                setMenuDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    });

    // Handle click outside of account dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".account-btn")) {
                setAccountDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    });

    const toggleMenuDropdown = () => {
        setMenuDropdownOpen((prev) => !prev)
    }

    const toggleAccountDropdown = () => {
        setAccountDropdownOpen((prev) => !prev)
    }

    const handleThemeChange = () => {
        setTheme(theme === "light" ? "dark" : "light");
    }

    // Handle navigation to other components
    const handleNavigateOverview = () => navigate("/overview");
    const handleNavigateHome = () => navigate(`/account/${accountId}`);
    const handleNavigateAccount = (accountId) => navigate(`/account/${accountId}`);
    const handleNavigateStatements = () => navigate(`/statements/${accountId}`);
    const handleNavigateDetails = () => navigate(`/details/${accountId}`);

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

    return(
        <div className="nav">
            <div className="main-row">
                <div className="nav-ctnr">
                    <div className="header" onClick={handleNavigateOverview}>
                        <img src="/assets/icons/witch-hat.svg" draggable="false" />
                        <p>Finwiz</p>
                    </div>
                    <div className="btn-row">
                        {/* Home button */}
                        <motion.button
                            title="Overview"
                            className="menu-btn"
                            onClick={() => navigate("/overview")}
                            whileTap={{scale: 0.9}}
                        >
                            <img src="/assets/icons/wallet.svg" className="icon" draggable="false" />
                        </motion.button>

                        {/* Hamburger menu */}
                        <div className="menu-ctnr">
                            <motion.button
                                type="button"
                                className="menu-btn"
                                onClick={toggleMenuDropdown}
                                whileTap={{scale: 0.9}}
                            >
                                <img src="/assets/icons/menu-burger.svg" className="icon" draggable="false" />
                            </motion.button>
                            <AnimatePresence>
                                {menuDropdownOpen && (
                                    <motion.div
                                        className="menu-dropdown"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                    >
                                        <button type="button" onClick={handleThemeChange}>
                                            {theme === "light" ? "Dark Mode" : "Light Mode"}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div className="secondary-row">
                <div className="nav-ctnr">
                    {/* Account dropdown */}
                    <button 
                        type="button"
                        className="account-btn"
                        onClick={toggleAccountDropdown}
                    >
                        {currentAccount ? (
                            <div className="card-option">
                                {currentAccount.imagePath ? (
                                    <img src={currentAccount.imagePath} draggable="false" />
                                ) : (
                                    <img src="/assets/images/example-card.webp" draggable="false" />
                                )}
                                <p>{currentAccount.provider} {currentAccount.name}</p>
                            </div>
                        ) : (
                            <p>All Accounts</p>
                        )}
                        
                        <motion.img
                            src="/assets/icons/angle-small-down.svg"
                            className="icon-dynamic"
                            draggable="false"
                            animate={{ rotate: accountDropdownOpen ? 180 : 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                        />
                    </button>
                    <AnimatePresence>
                        {accountDropdownOpen && (
                            <motion.div
                                className="account-dropdown"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                            >
                                <button type="button" onClick={handleNavigateOverview}>All Accounts</button>
                                {accounts.map(acc => (
                                    <button
                                        type="button" 
                                        className="card-option" 
                                        key={acc.id} 
                                        onClick={() => handleNavigateAccount(acc.id)}
                                    >
                                        {acc.imagePath ? (
                                            <img src={acc.imagePath} draggable="false" />
                                        ) : (
                                            <img src="/assets/images/example-card.webp" draggable="false" />
                                        )}
                                        <p>{acc.provider} {acc.name}</p>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Account directory */}
                    <AnimatePresence>
                        {accountId ? (
                            <motion.div 
                                className="account-directory"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                <button
                                    type="button"
                                    className={location.pathname.includes("/account/") ? "active-btn" : ""}
                                    onClick={handleNavigateHome}
                                >
                                    Home
                                </button>
                                <button
                                    type="button"
                                    className={location.pathname.includes("/statements") ? "active-btn" : ""}
                                    onClick={handleNavigateStatements}
                                >
                                    Statements
                                </button>
                                <button
                                    type="button"
                                    className={location.pathname.includes("/details") ? "active-btn" : ""}
                                    onClick={handleNavigateDetails}
                                >
                                    Edit Details
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div 
                                className="account-directory"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                <button
                                    type="button"
                                    className={location.pathname.includes("/overview") ? "active-btn" : ""}
                                >
                                    Overview
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default Nav;