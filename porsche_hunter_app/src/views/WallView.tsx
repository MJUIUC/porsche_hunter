import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppStateContext } from '../contexts/AppState';
import { useAuthentication } from '../hooks/UseAuthentication';

export default function WallView() {
    const navigate = useNavigate();
    const auth = useAuthentication();
    const { appState } = useContext(AppStateContext);
    const [wallData, setWallData] = useState<any>(null);
    // extract auth functions
    const jwtCookie = auth.getCookie('jwt');
    const tokenLogIn = auth.tokenLogIn;

    useEffect(() => {
        (async () => {
            if (!appState?.authenticatedHunter) {
                const authenticated = await tokenLogIn();
                if (!authenticated) {
                    navigate('/authenticate');
                }
            }
        })()

    }, [navigate, appState?.authenticatedHunter, tokenLogIn]);


    // If there is a logged in user, fetch the wall data for the authenticated user.
    useEffect(() => {
        if (!appState?.authenticatedHunter) {
            return;
        } else {
            (async () => {
                try {
                    const jwt = jwtCookie;
                    const response = await fetch(`/api/v1/wall/render-wall`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${jwt}`,
                        },
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setWallData(data);
                } catch (error) {
                    console.error('Error fetching wall data:', error);
                }
            })()
        }

        return () => {
            setWallData(null);
        }
    }, [appState, jwtCookie]);

    if (wallData) {
        return (
            <div>
                <h1>WallView</h1>
                <div className='wallview'>
                    { }
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }
};
