import React, { Fragment, useState } from 'react';
import './App.css';

// components
import Signin from './components/signin/Signin';
import Inbox from './components/inbox/Inbox';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSuccessfulLogin = () => {
    setIsLoggedIn(true);
  };

  const handleSuccessfulLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Fragment>
      {!isLoggedIn && <Signin onSuccessfulLogin={handleSuccessfulLogin} />}
      {isLoggedIn && <Inbox onSuccessfulLogout={handleSuccessfulLogout} />}
    </Fragment>
  );
}

export default App;