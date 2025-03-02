import { Outlet } from 'react-router-dom';
import Nav from './Nav';

const Layout = () => {
    return (
        <div>
            <Nav />
            
            <div className="app-content">
                <div className="app-ctnr">
                    <Outlet /> {/* This renders the current route's component */}
                </div>
            </div>
        </div>
    );
};

export default Layout;