import React, { useEffect, useState } from "react";
import {
  NavItem,
  NavLink,
  UncontrolledDropdown,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Media,
  Badge,
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import axios from "axios";
import * as Icon from "react-feather";
import classnames from "classnames";
import ReactCountryFlag from "react-country-flag";
import Autocomplete from "../../../components/@vuexy/autoComplete/AutoCompleteComponent";
import { useAuth0 } from "../../../authServices/auth0/auth0Service";
import { history } from "../../../history";
import { IntlContext } from "../../../utility/context/Internationalization";
import { Translate } from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
import NotificationService from "../../../services/other/notification.service";
import styled from "styled-components";
import RequestPostponementService from "../../../services/document/requestpostponement.service";
import RequestService from "../../../services/document/request.service";
import InspectionResultService from "../../../services/document/inspectionresult.service";
import AccountService from "../../../services/account.service";
import UserService from "../../../services/management/user.service";
const { t1, t2 } = Translate;
const handleNavigation = (e, path) => {
  e.preventDefault();
  history.push(path);
};
const justNavigation = (path) => {
  history.push(path);
};

const UserDropdown = (props) => {
  const { logout, isAuthenticated } = useAuth0();

  return (
    <DropdownMenu right style={{ width: "30vh" }}>
      {/* <DropdownItem
        tag="a"
        href="#"
        onClick={e => handleNavigation(e, "/pages/profile")}
      >
        <Icon.User size={14} className="mr-50" />
        <span className="align-middle">Edit Profile</span>
      </DropdownItem>
      <DropdownItem
        tag="a"
        href="#"
        onClick={e => handleNavigation(e, "/email/inbox")}
      >
        <Icon.Mail size={14} className="mr-50" />
        <span className="align-middle">My Inbox</span>
      </DropdownItem>
      <DropdownItem
        tag="a"
        href="#"
        onClick={e => handleNavigation(e, "/todo/all")}
      >
        <Icon.CheckSquare size={14} className="mr-50" />
        <span className="align-middle">Tasks</span>
      </DropdownItem>
      <DropdownItem
        tag="a"
        href="#"
        onClick={e => handleNavigation(e, "/chat")}
      >
        <Icon.MessageSquare size={14} className="mr-50" />
        <span className="align-middle">Chats</span>
      </DropdownItem>
      <DropdownItem tag="a" href="#" onClick={e => handleNavigation(e, "/ecommerce/wishlist")}>
        <Icon.Heart size={14} className="mr-50" />
        <span className="align-middle">WishList</span>
      </DropdownItem>
      <DropdownItem divider /> */}
      <DropdownItem
        tag="a"
        onClick={() => {
          justNavigation("/management/myinformation");
        }}
      >
        <Icon.Info size={14} className="mr-50" />
        <span className="align-middle"> {t1("myInformation")} </span>
      </DropdownItem>
      <DropdownItem
        tag="a"
        onClick={() => {
          justNavigation("/management/changeuser");
        }}
      >
        <Icon.Key size={14} className="mr-50" />
        <span className="align-middle"> {t1("change")} </span>
      </DropdownItem>

      <DropdownItem
        tag="a"
        onClick={(e) => {
          e.preventDefault();
          localStorage.clear();
          window.location.reload();
          // if (isAuthenticated) {
          //   return logout({
          //     returnTo: window.location.origin + process.env.REACT_APP_PUBLIC_PATH
          //   })
          // } else {
          //   const provider = props.loggedInWith
          //   if (provider !== null) {
          //     if (provider === "jwt") {
          //       return props.logoutWithJWT()
          //     }
          //     if (provider === "firebase") {
          //       return props.logoutWithFirebase()
          //     }
          //   } else {
          //     history.push("/pages/login")
          //     localStorage.removeItem('token')
          //   }
          // }
        }}
      >
        <Icon.Power size={14} className="mr-50" />
        <span className="align-middle"> {t1("logout")} </span>
      </DropdownItem>
    </DropdownMenu>
  );
};

const ItemD = styled.span`
  color: red !important;
`;
class NavbarUser extends React.PureComponent {
  state = {
    navbarSearch: false,
    langDropdown: false,
    suggestions: [],
    userName: localStorage.getItem("user_info")
      ? JSON.parse(localStorage.getItem("user_info")).userName
      : "",
    shortName: localStorage.getItem("user_info")
      ? JSON.parse(localStorage.getItem("user_info")).shortName
      : "",
    languageId: localStorage.getItem("user_info")
      ? JSON.parse(localStorage.getItem("user_info")).languageId
      : "",
    // NotificationList: [],
  };

  componentDidMount() {
    axios.get("/api/main-search/data").then(({ data }) => {
      this.setState({ suggestions: data.searchResult });
    });
    // NotificationService.GetList({ notificationStatusId: 1 }).then((res) => {
    //   this.setState({ NotificationList: res.data });
    // });
    // var lang = JSON.parse(localStorage.getItem("user_info"));
    // this.setState({
    //   locale:
    //     lang?.languageId != 3 ? "ln" : lang?.languageId == 2 ? "cl" : "ru",
    // });

    // localStorage.setItem("user_info", JSON.stringify(lang));
    this.props.notificationRefresh();
  }

  handleNavbarSearch = () => {
    this.setState({
      navbarSearch: !this.state.navbarSearch,
    });
  };

  RouterFunction = () => {
    // if (item.typeId === 3) {
    //   RequestPostponementService.GetByRequestId(item.link).then((res) => {
    //     history.push("/document/view/" + item.link);
    //   });
    // } else if (item.typeId === 1) {
    //   RequestService.Get(item.link).then((res) => {
    //     history.push("/document/viewrequest/" + item.link);
    //   });
    // }
    history.push("/management/notification/");
  };
  handleLangDropdown = () =>
    this.setState({ langDropdown: !this.state.langDropdown });

  setUserInfo() {
    UserService.GetUserInfo().then((res) => {
      localStorage.setItem("user_info", JSON.stringify(res.data));
      setTimeout(() => {
        window.location.reload();
      }, 50);
    });
  }
  render() {
    // const { NotificationList } = this.state;
    const { history } = this.props;

    return (
      <ul className="nav navbar-nav navbar-nav-user float-right">
        <UncontrolledDropdown
          style={{ cursor: "pointer", marginRight: "10px" }}
          tag="li"
          className="dropdown-user nav-item"
        >
          <DropdownToggle
            onClick={() => this.RouterFunction()}
            tag="b"
            className="nav-link dropdown-user-link"
          >
            <div className="user-nav d-sm-flex d-none">
              <Icon.Bell style={{ marginTop: "10px" }} size={21} />
              {this.props.notificationTotal.total != 0 ? (
                <Badge color="danger" className="badge-up">
                  {this.props.notificationTotal.total}
                </Badge>
              ) : (
                ""
              )}
            </div>{" "}
          </DropdownToggle>

          {/* <DropdownMenu style={{ width: "500px" }} right>
            {NotificationList.rows?.map((item, index) => (
              <DropdownItem key={index} tag="a">
                <span
                  onClick={() => {
                    this.RouterFunction(item);
                  }}
                  style={{ mystyle }}
                >
                  <span style={{ fontSize: "16px" }} className="text-bold-600">
                    {" "}
                    {item.title}
                  </span>
                  <p style={{ whiteSpace: "pre-wrap", marginTop: "6px" }}>
                    {item.content}
                  </p>
                </span>
              </DropdownItem>
            ))}
          </DropdownMenu> */}
        </UncontrolledDropdown>
        <IntlContext.Consumer>
          {(context) => {
            let langArr = {
              ln: "UZ",
              cl: "ЎЗ",
              ru: "РУ",
            };
            var lang = JSON.parse(localStorage.getItem("user_info"));
            return (
              <Dropdown
                tag="li"
                style={{ fontSize: "18px" }}
                className="dropdown-user nav-item mt-1"
                isOpen={this.state.langDropdown}
                toggle={this.handleLangDropdown}
                data-tour="language"
              >
                <DropdownToggle tag="a" className="nav-link">
                  {/* <ReactCountryFlag
                  className="country-flag"
                    countryCode={
                      context.state.locale === "en"
                        ? "us"
                        : context.state.locale
                    }
                    svg
                  /> */}
                  <span className="d-sm-inline-block d-none text-capitalize align-middle ml-50">
                    {langArr[context.state.locale]}
                  </span>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem
                    tag="a"
                    onClick={(e) => {
                      context.switchLanguage("ln");
                      AccountService.ChangeLanguage({ languageId: 3 }).then(
                        (res) => {
                          this.setUserInfo();
                        }
                      );
                    }}
                  >
                    {/* <ReactCountryFlag className="country-flag" countryCode="us" svg /> */}

                    <span className="ml-1">UZ</span>
                  </DropdownItem>
                  <DropdownItem
                    tag="a"
                    onClick={(e) => {
                      context.switchLanguage("cl");
                      AccountService.ChangeLanguage({ languageId: 2 }).then(
                        (res) => {
                          this.setUserInfo();
                        }
                      );
                    }}
                  >
                    {/* <ReactCountryFlag className="country-flag" countryCode="fr" svg /> */}
                    <span className="ml-1">ЎЗ</span>
                  </DropdownItem>
                  <DropdownItem
                    tag="a"
                    onClick={(e) => {
                      context.switchLanguage("ru");
                      AccountService.ChangeLanguage({ languageId: 1 }).then(
                        (res) => {
                          this.setUserInfo();
                        }
                      );
                    }}
                  >
                    {/* <ReactCountryFlag className="country-flag" countryCode="de" svg /> */}
                    <span className="ml-1"> РУ </span>
                  </DropdownItem>
                  {/* <DropdownItem
                    tag="a"
                    onClick={e => context.switchLanguage("pt")}
                  >
                    <ReactCountryFlag className="country-flag" countryCode="pt" svg />
                    <span className="ml-1">Portuguese</span>
                  </DropdownItem> */}
                </DropdownMenu>
              </Dropdown>
            );
          }}
        </IntlContext.Consumer>

        <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
          <DropdownToggle tag="a" className="nav-link dropdown-user-link">
            <div className="user-nav d-sm-flex d-none">
              <span className="user-name text-bold-600">
                {this.state.userName}
              </span>
              <span className="user-status"> {this.state.shortName} </span>
            </div>
            <span data-tour="user">
              {/* <img
                src={this.props.userImg}
                className="round"
                height="40"
                width="40"
                alt="avatar"
              /> */}
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "40px",
                  height: "40px",
                  border: "1px solid",
                  borderRadius: "50%",
                }}
              >
                <Icon.User />
              </div>
            </span>
          </DropdownToggle>
          <UserDropdown {...this.props} />
        </UncontrolledDropdown>
      </ul>
    );
  }
}
export default injectIntl(NavbarUser);
