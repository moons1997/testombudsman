import React, { Component } from "react"
import { Img } from "reactstrap";
import { NavLink } from "react-router-dom";
import { Disc, X, Circle } from "react-feather";
import classnames from "classnames";
import {
  Translate,
  Permission,
  Notification,
} from "../../../../components/Webase/functions/index.js";
import * as Icon from "react-feather";
const { t1, t2 } = Translate;
const { can } = Permission;
class SidebarHeader extends Component {
  render() {
    let {
      toggleSidebarMenu,
      activeTheme,
      collapsed,
      toggle,
      sidebarVisibility,
      menuShadow,
    } = this.props;
    return (
      <div className="navbar-header">
        <ul className="nav navbar-nav flex-row">
          {/* {can("DashboardView") ? ( */}
          <li className="nav-item mr-auto">
            <h6
              className="brand-text mb-0 mt-1"
              style={{
                color: "white",
                // fontFamily: "Times New Roman"
              }}
            >
              {t1("NameProjectLogo")}
            </h6>
            {/* <NavLink to="/" className="navbar-brand">
              <Icon.Home style={{ color: "white" }} size={18} />
              <h
                className="brand-text mb-0 mt-0"
                style={{
                  color: "white",
                  // fontFamily: "Times New Roman"
                }}
              >
                {t1("NameProjectLogo")}
              </h>
            </NavLink> */}
          </li>
          {/* ) : (
            ""
          )} */}
          <li className="nav-item nav-toggle">
            <div className="nav-link modern-nav-toggle">
              {collapsed === false ? (
                <>{""}</>
              ) : (
                // <Disc
                //   onClick={() => {
                //     // toggleSidebarMenu(true);
                //     // toggle();
                //   }}
                //   className={classnames(
                //     "toggle-icon icon-x d-none d-xl-block font-medium-4",
                //     {
                //       "text-primary": activeTheme === "primary",
                //       "text-success": activeTheme === "success",
                //       "text-danger": activeTheme === "danger",
                //       "text-info": activeTheme === "info",
                //       "text-warning": activeTheme === "warning",
                //       "text-dark": activeTheme === "dark",
                //     }
                //   )}
                //   size={20}
                //   data-tour="toggle-icon"
                // />
                <Circle
                  onClick={() => {
                    // toggleSidebarMenu(false);
                    // toggle();
                  }}
                  className={classnames(
                    "toggle-icon icon-x d-none d-xl-block font-medium-4",
                    {
                      "text-primary": activeTheme === "primary",
                      "text-success": activeTheme === "success",
                      "text-danger": activeTheme === "danger",
                      "text-info": activeTheme === "info",
                      "text-warning": activeTheme === "warning",
                      "text-dark": activeTheme === "dark",
                    }
                  )}
                  size={20}
                />
              )}
              <X
                onClick={sidebarVisibility}
                className={classnames(
                  "toggle-icon icon-x d-block d-xl-none font-medium-4",
                  {
                    "text-primary": activeTheme === "primary",
                    "text-success": activeTheme === "success",
                    "text-danger": activeTheme === "danger",
                    "text-info": activeTheme === "info",
                    "text-warning": activeTheme === "warning",
                    "text-dark": activeTheme === "dark",
                  }
                )}
                size={20}
              />
            </div>
          </li>
        </ul>
        <div
          className={classnames("shadow-bottom", {
            "d-none": menuShadow === false,
          })}
        />
      </div>
    );
  }
}

export default SidebarHeader
