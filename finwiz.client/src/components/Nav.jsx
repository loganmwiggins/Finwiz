import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../stylesheets/components/Nav.css';

function Nav() {
    const navigate = useNavigate();

    return(
        <div className="nav-ctnr">
            <div className="main-row">
                <h3>Finwiz</h3>
                <button type="button" className="menu-btn">
                    <img src="/assets/icons/menu-burger.svg" draggable="false" />
                </button>
            </div>
            <div className="secondary-row">
                <div className="account-btn">
                    <p>American Express Gold Card</p>
                    <img src="/assets/icons/angle-small-down.svg" draggable="false" />
                </div>
                <div className="account-directory">
                    <p>Home</p>
                    <p>Statements & Activity</p>
                    <p>Payments</p>
                </div>
            </div>
        </div>
    );
}

export default Nav;