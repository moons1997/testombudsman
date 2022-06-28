import React from "react";
import { Link } from "react-router-dom";
import {
  CardBody,
  FormGroup,
  Form,
  Input,
  Button,
  Label,
  Spinner,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy";
import { Mail, Lock, Check, User } from "react-feather";
import { loginWithJWT } from "../../../../redux/actions/auth/loginActions";
import { connect } from "react-redux";
import { history } from "../../../../history";
import { IntlContext } from "../../../../utility/context/Internationalization";
import AccountService from "../../../../services/account.service";
import "react-toastify/dist/ReactToastify.css";
import {
  Translate,
  Notification,
  Permission,
} from "../../../../components/Webase/functions/index";
import { injectIntl } from "react-intl";
import UzbEmblem from "../../../../assets/img/download.png";
import BG from "../../../../assets/img/authorization_bg.jpg";
import Login_bg from "../../../../assets/img/8.svg";
import Phone from "../../../../assets/img/phone_icon.png";
const { t1, t2 } = Translate;
const { errorToast } = Notification;
const { can } = Permission;

class LoginJWT extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      remember: false,
      loading: false,
      langDropdown: false,
    };
  }
  login = () => {
    this.setState({ loading: true });
    AccountService.Login({
      username: this.state.username,
      password: this.state.password,
      domain: window.location.host,
    })
      .then((res) => {
        window.location.reload(true);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user_info", JSON.stringify(res.data.user));
        // {
        //   can("DashboardView")
        //     ?
        history.push("/dashboard");
        //     : can("AttestationView") ||
        //       can("BranchesAttestationView") ||
        //       can("AllAttestationView")
        //     ? history.push("/document/attestation")
        //     : can("RequestView") ||
        //       can("AllRequestAgree") ||
        //       can("RequestAgree") ||
        //       can("AllRequestReceive") ||
        //       can("RequestReceive") ||
        //       can("AllRequestView") ||
        //       can("BranchesRequestView")
        //     ? history.push("/document/request")
        //     : history.push("/document/videolessonview");
        // }
        this.setState({ loading: false });
        localStorage.setItem(
          "locale",
          res.data.user.languageId == 2
            ? "cl"
            : res.data.user.languageId == 3
            ? "ln"
            : "ru"
        );
        window.location.reload();
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ loading: false });
      });
  };
  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      this.login();
    }
  };
  handleLangDropdown = () =>
    this.setState({ langDropdown: !this.state.langDropdown });
  render() {
    // let langArr = {
    //   ln: "UZ",
    //   cl: "ЎЗ",
    //   ru: "РУ",
    // };
    // var lang = JSON.parse(localStorage.getItem("user_info"));
    const { loading, username, password, date } = this.state;
    const { intl } = this.props;
    return (
      <React.Fragment>
        <div
          className="container-fluid login-page"
          style={{
            backgroundImage: `url(${Login_bg})`,
            backgroundSize: "cover",
          }}
        >
          {/* <div className="login-page__row">
            <div className="login-page__left"></div>
            <div className="login-page__right"></div>
          </div> */}
          <main class="row" style={{ height: "100%" }}>
            <section class="col-md-1"></section>
            <section class="col-md-4" id="panel-right">
              <div class="container" style={{ marginTop: "-10rem" }}>
                <div class="row">
                  <div class="col-12 logo-container d-flex justify-content-center">
                    <img
                      src={UzbEmblem}
                      style={{ width: "250px" }}
                      alt="uzbekistan emblem"
                    />
                  </div>
                </div>
                {/* <div class="row">
                  <h1 class="col-12 text-center">ЕГК</h1>
                </div> */}
                <div class="row">
                  <p class="col-12 text-center description">
                    {/* ИС "ЕДИНЫЙ ГОСУДАРСТВЕННЫЙ КОНТРОЛЬ" */}
                    {t1("NameProject")}
                  </p>
                </div>
                <div class="row mb-5">
                  <h3
                    class="col-12 text-center"
                    style={{ color: "#004D8D", fontWeight: "bold" }}
                  >
                    {t1("Auth")}
                  </h3>
                  <h5 class="col-12 text-center">{t1("NameProject2")}</h5>
                </div>
                <div class="row" style={{ textAlign: "center !important" }}>
                  <Form
                    style={{ width: "80%", margin: "0 auto" }}
                    className="pl-5 pr-5"
                  >
                    <FormGroup className="form-label-group position-relative has-icon-left">
                      <Input
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            this.login();
                          }
                        }}
                        // bsSize="lg"
                        type="text"
                        style={{ width: "80%" }}
                        placeholder={t2("Username", intl)}
                        value={username}
                        onChange={(e) =>
                          this.setState({ username: e.target.value })
                        }
                        required
                      />
                      <div
                        style={{ backgroundColor: "#E6E6E6" }}
                        className="form-control-position"
                      >
                        <User color="black" size={16} />
                      </div>
                    </FormGroup>
                    <FormGroup className="form-label-group position-relative has-icon-left">
                      <Input
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            this.login();
                          }
                        }}
                        // bsSize="lg"
                        style={{ width: "80%" }}
                        type="password"
                        placeholder={t2("Password", intl)}
                        value={password}
                        onChange={(e) =>
                          this.setState({ password: e.target.value })
                        }
                        required
                        onKeyPress={this.handleKeyPress}
                      />
                      <div className="form-control-position">
                        <Lock color="black" size={16} />
                      </div>
                    </FormGroup>
                    <FormGroup className="d-flex justify-content-between align-items-center"></FormGroup>
                    <div className="d-flex justify-content-start">
                      <Button.Ripple
                        style={{ fontSize: "14px" }}
                        color="primary"
                        onClick={this.login}
                        type="button"
                      >
                        {loading ? <Spinner color="white" size="sm" /> : ""}{" "}
                        {t1("Login")}
                      </Button.Ripple>
                    </div>
                    <div>
                      <IntlContext.Consumer>
                        {(context) => {
                          let langArr = {
                            ln: "UZ",
                            cl: "ЎЗ",
                            ru: "РУ",
                          };
                          var lang = JSON.parse(
                            localStorage.getItem("user_info")
                          );
                          return (
                            <Dropdown
                              className="mt-1"
                              isOpen={this.state.langDropdown}
                              toggle={this.handleLangDropdown}
                            >
                              <DropdownToggle className="btn-primary">
                                {t1("language")} :
                                <span className="d-sm-inline-block d-none text-capitalize align-middle ml-50">
                                  {langArr[context.state.locale]}
                                </span>
                              </DropdownToggle>
                              <DropdownMenu container="body">
                                <DropdownItem
                                  onClick={(e) => {
                                    context.switchLanguage("ln");
                                    // AccountService.ChangeLanguage({
                                    //   languageId: 3,
                                    // }).then((res) => {
                                    //   // localStorage.setItem("locale", "ln");
                                    // });
                                  }}
                                >
                                  UZ
                                </DropdownItem>
                                <DropdownItem
                                  onClick={(e) => {
                                    context.switchLanguage("cl");
                                    // AccountService.ChangeLanguage({
                                    //   languageId: 2,
                                    // }).then((res) => {
                                    //   // localStorage.setItem(
                                    //   //   "user_info",
                                    //   //   JSON.stringify()
                                    //   // );
                                    // });
                                  }}
                                >
                                  ЎЗ
                                </DropdownItem>
                                <DropdownItem
                                  onClick={(e) => {
                                    context.switchLanguage("ru");
                                    // AccountService.ChangeLanguage({
                                    //   languageId: 1,
                                    // }).then((res) => {});
                                  }}
                                >
                                  РУ
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                            // <Dropdown
                            //   tag="li"
                            //   style={{ fontSize: "18px" }}
                            //   className="dropdown-user nav-item mt-1"
                            //   isOpen={this.state.langDropdown}
                            //   toggle={this.handleLangDropdown}
                            //   data-tour="language"
                            // >
                            //   <DropdownToggle tag="a" className="nav-link">
                            //     <span className="d-sm-inline-block d-none text-capitalize align-middle ml-50">
                            //       {langArr[context.state.locale]}
                            //     </span>
                            //   </DropdownToggle>
                            //   <DropdownMenu caret>
                            //     <DropdownItem
                            //       tag="a"
                            //       onClick={(e) => {
                            //         context.switchLanguage("ln");
                            //         AccountService.ChangeLanguage({
                            //           languageId: 3,
                            //         }).then((res) => {
                            //           // window.location.reload();
                            //           // localStorage.setItem("locale", "ln");
                            //         });
                            //       }}
                            //     >
                            //       <span className="ml-1">UZ</span>
                            //     </DropdownItem>
                            //     <DropdownItem
                            //       tag="a"
                            //       onClick={(e) => {
                            //         context.switchLanguage("cl");
                            //         AccountService.ChangeLanguage({
                            //           languageId: 2,
                            //         }).then((res) => {
                            //           // window.location.reload();
                            //           // localStorage.setItem(
                            //           //   "user_info",
                            //           //   JSON.stringify()
                            //           // );
                            //         });
                            //       }}
                            //     >
                            //       <span className="ml-1">ЎЗ</span>
                            //     </DropdownItem>
                            //     <DropdownItem
                            //       tag="a"
                            //       onClick={(e) => {
                            //         context.switchLanguage("ru");
                            //         AccountService.ChangeLanguage({
                            //           languageId: 1,
                            //         }).then((res) => {
                            //           // window.location.reload();
                            //         });
                            //       }}
                            //     >

                            //       <span className="ml-1"> РУ </span>
                            //     </DropdownItem>

                            //   </DropdownMenu>
                            // </Dropdown>
                          );
                        }}
                      </IntlContext.Consumer>
                    </div>
                  </Form>
                </div>
              </div>
            </section>
            <section
              class="col-md-7"
              id="panel-left"
              // style={{ backgroundImage: `url(${BG})`, backgroundSize: "cover" }}
            >
              {/* <div class="container align-self-center">
                <div class="row mt-3">
                  <div class="col-12 logo-container d-flex justify-content-center">
                    <img
                      src={UzbEmblem}
                      style={{ width: "300px" }}
                      alt="uzbekistan emblem"
                    />
                  </div>
                </div>
                <div class="row">
                  <h1 class="col-12 text-center">ЕГК</h1>
                </div>
                <div class="row">
                  <p class="col-12 text-center description">
                    ИС "ЕДИНЫЙ ГОСУДАРСТВЕННЫЙ КОНТРОЛЬ"
                  </p>
                </div>
                <div class="row justify-content-center">
                  <div className="mt-3">
                    <a
                      href="#"
                      style={{
                        color: "#fff",
                        textDecoration: "underline",
                        fontSize: "20px",
                      }}
                    >
                      Инструкция пользователя{" "}
                    </a>
                  </div>
                  <div className="pl-3 pr-3" style={{ textAlign: "center" }}>
                    <div className="text-center">
                    </div>
                    <div
                      className="mt-3"
                      style={{ color: "#fff", fontSize: "20px" }}
                    >
                      Служба технической поддержки:
                    </div>
                    <div style={{ fontSize: "25px", color: "#fff" }}>
                      +998 71 239-25-81
                    </div>
                  </div>
                </div>
                <div
                  className="pl-3 text-center"
                  style={{ marginTop: "150px" }}
                >
                  <p style={{ color: "#fff", fontSize: "20px" }}>
                    © {new Date().getFullYear()} - ПК "ЕГК"
                  </p>
                </div>
              </div> */}
            </section>
          </main>
        </div>

        {/* <CardBody className="pt-1">
          <Form>
            <FormGroup className="form-label-group position-relative has-icon-left">
              <Input
                type="text"
                placeholder={t2("Username", intl)}
                value={username}
                onChange={(e) => this.setState({ username: e.target.value })}
                required
              />
              <div className="form-control-position">
                <Mail size={15} />
              </div>
            </FormGroup>
            <FormGroup className="form-label-group position-relative has-icon-left mt-3">
              <Input
                type="password"
                placeholder={t2("Password", intl)}
                value={password}
                onChange={(e) => this.setState({ password: e.target.value })}
                required
                onKeyPress={this.handleKeyPress}
              />
              <div className="form-control-position">
                <Lock size={15} />
              </div>
            </FormGroup>
            <FormGroup className="d-flex justify-content-between align-items-center"></FormGroup>
            <div className="d-flex justify-content-end">
              <Button.Ripple color="primary" onClick={this.login} type="button">
                {loading ? <Spinner color="white" size="sm" /> : ""}{" "}
                {t1("Login")}
              </Button.Ripple>
            </div>
          </Form>
        </CardBody> */}
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    values: state.auth.login,
  };
};
export default injectIntl(connect(mapStateToProps, { loginWithJWT })(LoginJWT));
