// UniversalNavBar.tsx

import PorscheLogoSVG from '../PorscheLogoSVG';
import './UniversalNavBar.css'; // Create a CSS file for styling
import { useAuthentication } from '../../hooks/UseAuthentication';
import { useNavigate } from 'react-router-dom';

export default function UniversalNavBar() {
    const { authenticatedHunter, logout } = useAuthentication();
    const navigate = useNavigate();

    const handleLinkClick = (href: string) => {
        navigate(href);
    };

    return (
        <div className="app-bar">
            <div className="logo-container">
                <PorscheLogoSVG />
            </div>
            <div className="user-actions">
                {authenticatedHunter ? (
                    <>
                        <button className="link-button" onClick={() => { handleLinkClick(`/profile/${authenticatedHunter.hunterName}`) }}>Profile</button>
                        <button className="link-button" onClick={() => { handleLinkClick('/postcreator') }}>Post</button>
                        <button onClick={logout}>Logout</button>
                        {/* Add more link buttons as needed */}
                    </>
                ) : (
                    <button onClick={() => { handleLinkClick('/authenticate') }}>Login</button>
                )}
            </div>
        </div>
    );
}
