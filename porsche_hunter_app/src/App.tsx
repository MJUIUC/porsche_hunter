import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthenticateView from './views/AuthenticateView';
import ProfileView from './views/ProfileView';
import WallView from './views/WallView';
import PostView from './views/SinglePostView';
import CreatePostView from './views/CreatePostView';
import EditPostView from './views/EditPostView';
import './App.css';
import UniversalNavBar from './components/universal_nav_bar/UniversalNavBar';
import { useEffect } from 'react';

import { useAuthentication } from './hooks/UseAuthentication';

function App() {

  const { tokenLogIn } = useAuthentication();

  useEffect(() => {
    tokenLogIn();
  }, []);

  return (
    <div className="App">
      <Router>
        <UniversalNavBar />
        <Routes>
          <Route path='/' element={<WallView />}></Route>
          <Route path='/authenticate' element={<AuthenticateView />}></Route>
          <Route path='/profile/:hunterName' element={<ProfileView />}></Route>
          <Route path='/postcreator' element={<CreatePostView />}></Route>
          <Route path='/posteditor/:postUuid' element={<EditPostView />}></Route>
          <Route path='/post/:postUuid' element={<PostView />}></Route>
          <Route path='*' element={<h1>Page Not Found</h1>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
