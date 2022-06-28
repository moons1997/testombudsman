import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Auth0Provider } from "./authServices/auth0/auth0Service";
import config from "./authServices/auth0/auth0Config.json";
import { IntlProviderWrapper } from "./utility/context/Internationalization";
import { Layout } from "./utility/context/Layout";
import * as serviceWorker from "./serviceWorker";
import { store } from "./redux/storeConfig/store";
import Spinner from "./components/@vuexy/spinner/Fallback-spinner";
import "./index.scss";
import "./@fake-db";
import axios from "axios";
import ApiService from "./services/api.service";
import "antd/dist/antd.css";
import "react-datepicker/dist/react-datepicker.css";
ApiService.mount401Interceptor();
axios.defaults.baseURL = "http://bo-api.apptest.uz";

// axios.defaults.baseURL = "http://test-api.biznesvakil.uz"
if (window.location.href.indexOf("http://test.biznesvakil.uz/") > -1) {
  axios.defaults.baseURL = "http:/api.govcontrol.uz";
}
if (window.location.href.indexOf("https://test.biznesvakil.uz/") > -1) {
  axios.defaults.baseURL = "https://test-api.biznesvakil.uz";
}
if (window.location.href.indexOf("http://govcontrol.uz/") > -1) {
  axios.defaults.baseURL = "http://api.govcontrol.uz";
}
if (window.location.href.indexOf("https://govcontrol.uz/") > -1) {
  axios.defaults.baseURL = "https://api.govcontrol.uz";
}
if (window.location.href.indexOf("http://tt.govcontrol.uz") > -1) {
  axios.defaults.baseURL = "http://api.govcontrol.uz";
}
if (window.location.href.indexOf("http://tt.govcontrol.uz") > -1) {
  axios.defaults.baseURL = "https://api.govcontrol.uz";
}
if (window.location.href.indexOf("https://tt.govcontrol.uz") > -1) {
  axios.defaults.baseURL = "http://api.govcontrol.uz";
}
if (window.location.href.indexOf("https://tt.govcontrol.uz") > -1) {
  axios.defaults.baseURL = "https://api.govcontrol.uz";
}
if (window.location.href.indexOf("http://inspector.govcontrol.uz") > -1) {
  axios.defaults.baseURL = "http://api.govcontrol.uz";
}
if (window.location.href.indexOf("https://inspector.govcontrol.uz") > -1) {
  axios.defaults.baseURL = "https://api.govcontrol.uz";
}
const LazyApp = lazy(() => import("./App"));

// configureDatabase()

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin + process.env.REACT_APP_PUBLIC_PATH}
  >
    <Provider store={store}>
      <Suspense fallback={<Spinner />}>
        <Layout>
          <IntlProviderWrapper>
            <LazyApp />
          </IntlProviderWrapper>
        </Layout>
      </Suspense>
    </Provider>
  </Auth0Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
  onUpdate: (registration) => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
    window.location.reload();
  },
});
