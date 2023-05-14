import React from "react";
import FacebookLogin from "react-facebook-login";

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

export default FacebookButton;
