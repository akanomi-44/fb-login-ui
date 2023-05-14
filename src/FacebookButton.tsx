import React from 'react';
import FacebookLogin from 'react-facebook-login';

const FacebookButton = ({ onLoginSuccess, onLoginFailure }: any) => {
  return (
    <FacebookLogin
      appId={process.env.REACT_APP_FACEBOOK_APP_ID || ""}
      fields="name,email,picture"
      callback={onLoginSuccess}
      onFailure={onLoginFailure}

      // render={(renderProps: any) => (
      //   <button onClick={renderProps.onClick}>Login with Facebook</button>
      // )}
    />
  );
};

export default FacebookButton;
