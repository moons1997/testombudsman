import React, { useEffect, useState } from "react";
import { Row, Col, Navbar } from "reactstrap";
import { connect } from "react-redux";
import classnames from "classnames";
import { useAuth0 } from "../../../authServices/auth0/auth0Service";
import {
  logoutWithJWT,
  logoutWithFirebase,
} from "../../../redux/actions/auth/loginActions";
import NavbarBookmarks from "./NavbarBookmarks";
import NavbarUser from "./NavbarUser";
import userImg from "../../../assets/img/portrait/small/avatar-s-11.jpg";
import { Translate } from "../../../components/Webase/functions";
import AccountService from "../../../services/account.service";
import UserInfoTab from "../../../views/apps/user/edit/Information";

import { ContextLayout } from "../../../utility/context/Layout";
const { t1 } = Translate;
const UserName = (props) => {
  let username = "";
  if (props.userdata !== undefined) {
    username = props.userdata.name;
  } else if (props.user.login.values !== undefined) {
    username = props.user.login.values.name;
    if (
      props.user.login.values.loggedInWith !== undefined &&
      props.user.login.values.loggedInWith === "jwt"
    ) {
      username = props.user.login.values.loggedInUser.name;
    }
  } else {
    username = "John Doe";
  }

  return username;
};

const ThemeNavbar = (props) => {
  const { user } = useAuth0();
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    const org = JSON.parse(localStorage.getItem("user_info"));
    setUserInfo(org);
  }, []);
  const org = JSON.parse(localStorage.getItem("user_info"));

  const colorsArr = ["primary", "danger", "success", "info", "warning", "dark"];
  const navbarTypes = ["floating", "static", "sticky", "hidden"];
  return (
    <React.Fragment>
      <div className="content-overlay" />
      <div className="header-navbar-shadow" />
      <Navbar
        className={classnames(
          "header-navbar navbar-expand-lg navbar navbar-with-menu navbar-shadow",
          {
            "navbar-light":
              props.navbarColor === "default" ||
              !colorsArr.includes(props.navbarColor),
            "navbar-dark": colorsArr.includes(props.navbarColor),
            "bg-primary":
              props.navbarColor === "primary" && props.navbarType !== "static",
            "bg-danger":
              props.navbarColor === "danger" && props.navbarType !== "static",
            "bg-success":
              props.navbarColor === "success" && props.navbarType !== "static",
            "bg-info":
              props.navbarColor === "info" && props.navbarType !== "static",
            "bg-warning":
              props.navbarColor === "warning" && props.navbarType !== "static",
            "bg-dark":
              props.navbarColor === "dark" && props.navbarType !== "static",
            "d-none": props.navbarType === "hidden" && !props.horizontal,
            "floating-nav":
              (props.navbarType === "floating" && !props.horizontal) ||
              (!navbarTypes.includes(props.navbarType) && !props.horizontal),
            "navbar-static-top":
              props.navbarType === "static" && !props.horizontal,
            "fixed-top": props.navbarType === "sticky" || props.horizontal,
            scrolling: props.horizontal && props.scrolling,
          }
        )}
      >
        {/* <div className="navbar-wrapper">
          <div>
            <Row>
              <Col md={3} className="ml-1">
                <p className="text-white" style={{ fontSize: "14px" }}>
                  {t1("NameProjectLogo")}
                </p>
              </Col>
              <Col md={8}>
                <p className="text-white" style={{ fontSize: "14px" }}>
                  {t1("Org")}:{" "}
                  {userInfo.organization || userInfo.parentOrganization}
                </p>
                
              </Col>
            </Row>
          </div>
        </div> */}
        <div className="navbar-wrapper">
          <Row className="align-items-center">
            <Col md={6} lg={8} sm={6} xs={2}>
              <div className="bookmark-wrapper pl-2">
                <NavbarBookmarks
                  sidebarVisibility={props.sidebarVisibility}
                  handleAppOverlay={props.handleAppOverlay}
                />
              </div>
              <Row className="mobil-1200">
                {/* <Col md={2} className="ml-2">
                  <p className="text-white" style={{ fontSize: "14px" }}>
                    {t1("NameProjectLogo")}
                  </p>
                </Col> */}
                <Col md={12} className="ml-2">
                  <p
                    className="text-white"
                    style={{ fontSize: "14px", marginBottom: 0 }}
                  >
                    {t1("Org")}:{" "}
                    {userInfo.organization || userInfo.parentOrganization}
                  </p>
                  {/* <h5 className="text-white">
                  {t1("Position")}: {userInfo.position && userInfo.position}
                </h5> */}
                </Col>
              </Row>
            </Col>
            <Col md={6} lg={4} sm={6} xs={10}>
              <div className="navbar-container content">
                <div
                  className="navbar-collapse d-flex justify-content-between align-items-center"
                  id="navbar-mobile"
                >
                  <div className="bookmark-wrapper">
                    {/* <NavbarBookmarks
                  sidebarVisibility={props.sidebarVisibility}
                  handleAppOverlay={props.handleAppOverlay}
                /> */}
                  </div>
                  {props.horizontal ? (
                    <div className="logo d-flex align-items-center">
                      <div className="brand-logo mr-50"></div>
                      <h2 className="text-primary brand-text mb-0">
                        {t1("Main")}
                        {/* ЕГК */}
                      </h2>
                    </div>
                  ) : null}
                  <ContextLayout.Consumer>
                    {(context) => {
                      return (
                        <NavbarUser
                          notificationTotal={context.state.NotificationList}
                          notificationRefresh={context.notificationRefresh}
                          handleAppOverlay={props.handleAppOverlay}
                          changeCurrentLang={props.changeCurrentLang}
                          userName={<UserName userdata={user} {...props} />}
                          userImg={
                            props.user.login.values !== undefined &&
                            props.user.login.values.loggedInWith !== "jwt" &&
                            props.user.login.values.photoUrl
                              ? props.user.login.values.photoUrl
                              : user !== undefined && user.picture
                              ? user.picture
                              : userImg
                          }
                          loggedInWith={
                            props.user !== undefined &&
                            props.user.login.values !== undefined
                              ? props.user.login.values.loggedInWith
                              : null
                          }
                          logoutWithJWT={props.logoutWithJWT}
                          logoutWithFirebase={props.logoutWithFirebase}
                        />
                      );
                    }}
                  </ContextLayout.Consumer>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Navbar>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth,
  };
};

export default connect(mapStateToProps, {
  logoutWithJWT,
  logoutWithFirebase,
  useAuth0,
})(ThemeNavbar);
