import { useContext } from 'react';
import { AppStateContext, _AppState } from '../contexts/AppState';



export function useAuthentication() {
  const { appState, updateAppState } = useContext(AppStateContext);

  const getCookie = (cookieName: string) => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === cookieName) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  const tokenLogIn = async () => {
    const jwt = getCookie('jwt');
    if (jwt == null) return false;

    try {
      const response = await fetch('/api/v1/auth/token-login', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${jwt}`,
        }
      });
      const { authenticated, hunter } = await response.json();
      if (authenticated) {
        const newAppState: _AppState = { authenticatedHunter: hunter, activeToken: jwt };
        updateAppState(newAppState);
        return true;
      }
    } catch (error) {
      console.log('Error validating token:', error);
    }
    return false;
  };

  const authenticate = async (credentials: { emailAddress: string; password: string }) => {
    try {
      // Send a request to your server to authenticate the user
      // You can use fetch, axios, or any other library to make the request
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const authenticatedHunter = await response.json();

        // Store the token in the browser cookies. Not sure about age yet.
        document.cookie = `jwt=${authenticatedHunter.token}; path=/; expires=${authenticatedHunter.expiresIn}; Secure; SameSite=None`;
        const jwt = getCookie('jwt') || undefined;
        const newAppState: _AppState = { authenticatedHunter, activeToken: jwt };
        updateAppState(newAppState);
        return true; // Authentication success
      } else {
        // Handle authentication failure here (e.g., show an error message)
        return false; // Authentication failure
      }
    } catch (error) {
      // Handle any network or other errors here
      console.error('Authentication error:', error);
      return false; // Authentication failure
    }
  };

  const signup = async (userData: any) => {
    const { $D, $M, $y } = userData.dateOfBirth;
    const dob = `${$D}-${$M}-${$y}`;
    try {
      const response = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...userData, dateOfBirth: dob })
      });

      if (response.ok) {
        const authenticatedHunter = await response.json();
        const jwt = getCookie('jwt') || undefined;
        const newAppState: _AppState = { authenticatedHunter, activeToken: jwt };
        updateAppState(newAppState);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  // Define a function to log out the user
  const logout = () => {
    // Perform any necessary cleanup (e.g., clearing cookies or tokens)
    // and update the app state to remove the authenticated user
    document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=None';
    console.log('Logging out');
    updateAppState({});
  };

  return {
    authenticatedHunter: appState?.authenticatedHunter,
    signup,
    tokenLogIn,
    login: authenticate,
    logout,
    getCookie
  };
}