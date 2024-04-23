import React, { Fragment, useState } from 'react';
import './App.css';

// components
import Signin from './components/signin/Signin';
import Signout from './components/signout/Signout';

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
      {isLoggedIn && <Signout onSuccessfulLogout={handleSuccessfulLogout} />}
    </Fragment>
  );
}

export default App;