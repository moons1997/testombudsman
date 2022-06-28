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
class MyInformation extends React.Component {
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
                {t1("myInformation")}
              </h1>
            </Col>
          </Row>
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
                    <td style={{ fontWeight: "bold" }}>{t1("Role")}</td>
                    <td className="text-success ">
                      {UserList.roles?.map((item) => (
                        <div>
                          {item} <Icon.CheckCircle />
                        </div>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>{t1("pinfl")}</td>
                    <td className="text-success ">
                      {UserList.pinfl} <Icon.CheckCircle />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>{t1("language")}</td>
                    <td className="text-success ">
                      {UserList.language} <Icon.CheckCircle />
                    </td>
                  </tr>

                  <tr>
                    <td style={{ fontWeight: "bold" }}>
                      {t1("certificateNumber")}
                    </td>
                    <td className="text-success ">
                      {UserList.certificateNumber} <Icon.CheckCircle />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>
                      {t1("expirationDate")}
                    </td>
                    <td className="text-success ">
                      {UserList.expirationDate} <Icon.CheckCircle />
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
                </tbody>
              </Table>
              <Row>
                <Col className="text-left">
                  {/* <Button
                    color="danger"
                    onClick={() => history.push("/dashboard")}
                  >
                    {" "}
                    {t1("back")}{" "}
                  </Button> */}
                </Col>
                <Col className="text-right">
                  <Button
                    color="danger"
                    onClick={() => history.push("/dashboard")}
                  >
                    {" "}
                    {t1("back")}{" "}
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
export default injectIntl(MyInformation);
