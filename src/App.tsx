import React, { useState } from "react";
import FacebookLogin from "react-facebook-login";
import "./App.css";

const FacebookButton = ({ onLoginSuccess, onLoginFailure }: any) => {
  return (
    <FacebookLogin
      appId={process.env.REACT_APP_FACEBOOK_APP_ID || ""}
      fields="name,email,picture,accounts"
      scope="pages_show_list"
      callback={onLoginSuccess}
      onFailure={onLoginFailure}
    />
  );
};

const PageList = ({ user }: any) => {
  const [pages, setPages] = useState([]);
  const [error, setError] = useState<any>(null);

  if (!user) {
    return null;
  }

  const handlePagesSuccess = (response: any) => {
    setPages(response.accounts.data);
  };

  const handlePagesFailure = (response: any) => {
    setError(response);
  };

  return (
    <div>
      <h2>Pages</h2>
      <ul>
        {pages.map((page: any) => (
          <li key={page.id}>
            <a
              href={`https://www.facebook.com/${page.id}`}
              target="_blank"
              rel="noopener noreferrer">
              {page.name}
            </a>
          </li>
        ))}
      </ul>
      {error && <p>{error.message}</p>}
      {!pages.length && (
        <FacebookLogin
          appId={process.env.REACT_APP_FACEBOOK_APP_ID || ""}
          fields="name,email,picture,accounts"
          scope="pages_show_list"
          callback={handlePagesSuccess}
          onFailure={handlePagesFailure}
        />
      )}
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState<any>(null);

  const handleLoginSuccess = (response: any) => {
    setUser(response);
  };

  const handleLoginFailure = (response: any) => {
    setError(response);
  };

  return (
    <div className="App">
      {user ? (
        <PageList user={user} />
      ) : (
        <header className="App-header">
          <FacebookButton onLoginSuccess={handleLoginSuccess} onLoginFailure={handleLoginFailure} />
        </header>
      )}
      {error && <p>{error.message}</p>}
    </div>
  );
};

export default App;
