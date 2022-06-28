import React from "react"
import Routerw from "./Router"
import "./components/@vuexy/rippleButton/RippleButton"
import "react-perfect-scrollbar/dist/css/styles.css"
import "prismjs/themes/prism-tomorrow.css"
import { Component } from "react"
import { Route, Router,Switch } from "react-router-dom"
import { history } from "./history"
import PrivateRoute from './privateRouter'
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import "react-toggle/style.css"
import "./assets/scss/plugins/forms/switch/react-toggle.scss"
import "react-datepicker/dist/react-datepicker.css";

import "flatpickr/dist/themes/light.css";
import "./assets/scss/plugins/forms/flatpickr/flatpickr.scss"
const Login = React.lazy(() => import("./views/pages/authentication/login/Login"))

class App extends Component{
  render(){
    return(
      <Router history={history}>
        <Switch>
          <Route path="/pages/login" component={Login} />
          <PrivateRoute   path="/" component={Routerw} />
        </Switch>
        <ToastContainer />
      </Router>
    )
  }
}
export default App
