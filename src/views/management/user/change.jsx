import React from "react";
import {
  Card,
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  Spinner,
  InputGroup,
  InputGroupAddon,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  CustomInput,
} from "reactstrap";
import Overlay from "../../../components/Webase/components/Overlay";
import AccountService from "../../../services/account.service";
import { Notification, Translate } from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
import * as Icon from "react-feather";
import style from "../../document/inspectionbook/style.css";
const { t1, t2 } = Translate;
const { errorToast, successToast } = Notification;
class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      UserList: {},
      account: {},
      SaveLoading: false,
    };
  }
  componentDidMount() {
    AccountService.GetUserInfo().then((res) => {
      this.setState({ UserList: res.data });
    });
  }
  handleChange(event, field, data) {
    var account = this.state.account;
    account[field] = !!event.target ? event.target.value : data.value;
    this.setState({ account: account });
  }
  SaveData = () => {
    this.setState({ SaveLoading: true });
    AccountService.ChangePassword(this.state.account)
      .then((res) => {
        this.setState({ SaveLoading: false });
        successToast(t2("SuccessSave", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/dashboard");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ SaveLoading: false });
      });
  };
  render() {
    const { history, intl } = this.props;
    const { loading, account, SaveLoading, UserList } = this.state;
    return (
      <Overlay show={loading}>
        <Card>
          <Row className="mt-2">
            <Col>
              <h1 style={{ fontWeight: "bold" }} className="text-center">
                {" "}
                {t1("change")}
              </h1>
            </Col>
          </Row>
          {/* <Row className="m-1">
            <Col>
              <h2 className="text-success ">
                {" "}
                <Icon.User size={35} className="mb-1" /> {UserList.fullName}{" "}
              </h2>
            </Col>
          </Row> */}
          <Row className="m-1">
            <Col sm={12} lg={3}></Col>
            <Col className="text-center">
              <Table striped className="text-left" style={{ width: "100%" }}>
                <tbody>
                  <tr className="text-center">
                    <td colSpan={2}>
                      <h2 className="text-success ">
                        {" "}
                        <Icon.User size={35} className="mb-1" />{" "}
                        {UserList.fullName}{" "}
                      </h2>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>
                      {t1("parentOrganization")}
                    </td>
                    <td className="text-success ">
                      {UserList.parentOrganization} <Icon.CheckCircle />
                    </td>
                  </tr>
                  {UserList.organization ? (
                    <tr>
                      <td style={{ fontWeight: "bold" }}>
                        {t1("organization")}
                      </td>
                      <td className="text-success ">
                        {UserList.organization}
                        <Icon.CheckCircle />
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}
                  <tr>
                    <td style={{ fontWeight: "bold" }}>{t1("shortname")}</td>
                    <td className="text-success ">
                      {UserList.shortName}
                      <Icon.CheckCircle />
                    </td>
                  </tr>
                  {UserList.position ? (
                    <tr>
                      <td style={{ fontWeight: "bold" }}>{t1("position")}</td>
                      <td className="text-success ">
                        {UserList.position}
                        <Icon.CheckCircle />
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}
                  <tr>
                    <td style={{ fontWeight: "bold" }}>{t1("phoneNumber")}</td>
                    <td className="text-success ">
                      {UserList.phoneNumber}
                      <Icon.CheckCircle />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>{t1("Username")}</td>
                    <td className="text-success ">
                      {UserList.userName}
                      <Icon.CheckCircle />
                    </td>
                  </tr>
                  {UserList.email ? (
                    <tr>
                      <td style={{ fontWeight: "bold" }}>{t1("Email")}</td>
                      <td className="text-success ">
                        {UserList.email}
                        <Icon.CheckCircle />
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}
                  <tr>
                    <td style={{ fontWeight: "bold", color: "red" }}>
                      {t1("old")}
                    </td>
                    <td>
                      {" "}
                      <Input
                        type="password"
                        value={account.currentPassword || ""}
                        onChange={(e) =>
                          this.handleChange(e, "currentPassword")
                        }
                        id="currentPassword"
                        placeholder={t2("old", intl)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", color: "red" }}>
                      {t1("new")}
                    </td>
                    <td>
                      {" "}
                      <Input
                        type="password"
                        value={account.newPassword || ""}
                        onChange={(e) => this.handleChange(e, "newPassword")}
                        id="newPassword"
                        placeholder={t2("new", intl)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", color: "red" }}>
                      {t1("confirm")}
                    </td>
                    <td>
                      {" "}
                      <Input
                        type="password"
                        value={account.confirmNewPassword || ""}
                        onChange={(e) =>
                          this.handleChange(e, "confirmNewPassword")
                        }
                        id="confirmNewPassword"
                        placeholder={t2("confirm", intl)}
                      />
                    </td>
                  </tr>
                </tbody>
              </Table>
              <Row>
                <Col className="text-left">
                  <Button
                    color="danger"
                    onClick={() => history.push("/dashboard")}
                  >
                    {" "}
                    {t1("back")}{" "}
                  </Button>
                </Col>
                <Col className="text-right">
                  <Button color="success" onClick={this.SaveData}>
                    {" "}
                    {SaveLoading ? <Spinner size="sm" /> : ""} {t1("Save")}{" "}
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col sm={12} lg={3}></Col>
          </Row>
        </Card>
      </Overlay>
    );
  }
}
export default injectIntl(ChangePassword);
