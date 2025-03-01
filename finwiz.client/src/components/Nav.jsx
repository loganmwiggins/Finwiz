import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import '../stylesheets/components/Nav.css';

function Nav() {
    const navigate = useNavigate();
    const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

    // Handle click outside of menu dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".menu-btn")) {
                setMenuDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    })

    // Handle click outside of account dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".account-btn")) {
                setAccountDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    })

    const toggleMenuDropdown = () => {
        setMenuDropdownOpen((prev) => !prev)
    }

    const toggleAccountDropdown = () => {
        setAccountDropdownOpen((prev) => !prev)
    }

    // Handle navigation to other components
    const handleNavigateOverview = () => navigate("/overview");
    const handleNavigateAddAccount = () => navigate("/add-account");

    return(
        <div className="nav">
            <div className="main-row">
                <div className="nav-ctnr">
                    <div className="header" onClick={handleNavigateOverview}>
                        <img src="/assets/icons/witch-hat.svg" draggable="false" />
                        <p>Finwiz</p>
                    </div>
                    <div className="menu-ctnr">
                        <motion.button
                            type="button"
                            className="menu-btn"
                            onClick={toggleMenuDropdown}
                            whileTap={{scale: 0.9}}
                        >
                            <img src="/assets/icons/menu-burger.svg" draggable="false" />
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
                                    <button type="button" onClick={handleNavigateAddAccount}>Add Account</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
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
                        <p>American Express Gold Card</p>
                        <img src="/assets/icons/angle-small-down.svg" draggable="false" />
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
                                <button type="button" onClick={handleNavigateOverview}>All Accounts (Overview)</button>
                                <button type="button">Account 1</button>
                                <button type="button">Account 2</button>
                                <button type="button">Account 3</button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Account directory */}
                    <div className="account-directory">
                        <button type="button">Home</button>
                        <button type="button">Statements & Activity</button>
                        <button type="button">Edit Details</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Nav;