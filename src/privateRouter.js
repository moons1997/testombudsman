import React from 'react';
import axios from 'axios'
import {
    Route,
    Redirect
  } from "react-router-dom";
function PrivateRoute({ component : Component, ...rest }) {
    let auth = localStorage.getItem('token')
    if(!!auth){
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth
    }
    
    return (
      <Route
        {...rest}
        render={({ location },props) =>
        // <Component {...props} />
          auth ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/pages/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }
  export default PrivateRoute