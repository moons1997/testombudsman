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
  CustomInput,
  Badge,
  TabContent,
  TabPane,
  Nav,
  Form,
  Label,
  NavItem,
  NavLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  CardHeader,
  CardTitle,
  CardBody,
  Alert,
} from "reactstrap";
import Overlay from "../../../components/Webase/components/Overlay";
import {
  Notification,
  Translate,
  Permission,
} from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
import * as Icon from "react-feather";
import InspectionBookService from "../../../services/document/inspectionbook.service";
import { isSend } from "../../../components/Webase/functions/RequestStatus";
import style from "./style.css";
const { t1, t2 } = Translate;
const { can } = Permission;
const { errorToast, successToast } = Notification;

const initialSpecial = {
  id: 0,
  inspectionBookId: 0,
  fullName: "",
  workplace: "",
  directionOfActivity: "",
  contractNumber: "",
};
const tableStyle = {
  //    .table.table-bordered  .tbody  .tr  .td{
  //     border:'1px solid #A6A6A6'
  // }
};
class EditInspectionResult extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      inspectionnook: {
        contractor: {},
      },
      loading: false,
      loadingPostponement: false,
      SaveLoading: false,
      activeTab: "1",
      histories: [],
      send: {},
      SendLoading: false,
      modal: false,
    };
  }
  //Created
  componentDidMount() {
    this.Refresh();
    this.GetDataList();
  }
  // methods

  Refresh = () => {
    this.setState({ loading: true });
    if (
      !!this.props.location.state &&
      this.props.location.state.inspectionBtn
    ) {
      // alert("inspectionBtn");
      InspectionBookService.GetByRequestId(this.props.match.params.id)
        .then((res) => {
          this.setState({
            inspectionnook: res.data,
            loading: false,
          });
        })
        .catch((error) => {
          this.setState({ loading: false });
          errorToast(error.response.data);
        });
    } else {
      InspectionBookService.Get(this.props.match.params.id)
        .then((res) => {
          this.setState({
            inspectionnook: res.data,
            loading: false,
          });
        })
        .catch((error) => {
          this.setState({ loading: false });
          errorToast(error.response.data);
        });
    }
  };

  GetDataList = () => {
    InspectionBookService.GetHistoryList({}, this.props.match.params.id).then(
      (res) => {
        this.setState({ histories: res.data.rows });
      }
    );
  };
  sendChange(event, field, data) {
    var send = this.state.send;
    send[field] = !!event.target ? event.target.value : data.value;
    this.setState({ send: send });
  }
  SendFunction = () => {
    this.setState({ SendLoading: true });
    InspectionBookService.Send(this.state.send)
      .then((res) => {
        this.setState({ SendLoading: false });
        successToast(t2("SuccessSend", this.props.intl));
        this.setState({ modal: false });
        setTimeout(() => {
          this.props.history.push("/document/inspectionbook");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ SendLoading: false });
      });
  };
  handleChangeTextArr(event, field, state, data) {
    if (state === "send") {
      var send = this.state.send;
      send[field] = !!event.target ? event.target.value : data.value;
      // this.state.send.id = this.state.request.id;
      this.setState({ send });
    }
  }
  toggleModal = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }
  getAlertColor = (id) => {
    switch (id) {
      case 1:
        return "info";
        break;
      case 12:
        return "info";
        break;
      default:
        return "info";
        break;
    }
  };
  getColor = (id) => {
    switch (id) {
      case 1:
        return "info";
        break;
      case 2:
        return "warning";
        break;
      case 3:
        return "success";
        break;

      default:
        return "light";
        break;
    }
  };

  render() {
    const { loading, inspectionnook, histories, SendLoading, send } =
      this.state;
    const { history, intl } = this.props;
    //template
    return (
      <Overlay show={loading}>
        {inspectionnook.statusId == 1 || inspectionnook.statusId == 12 ? (
          <Card>
            <Alert
              className="m-1"
              color={this.getAlertColor(inspectionnook.statusId)}
            >
              <p style={{ color: "black" }}>
                {" "}
                {t1("DocumentStatus")} - {inspectionnook.status} -{" "}
                {t1("sendStatus")}
              </p>
            </Alert>
          </Card>
        ) : (
          ""
        )}
        <Card className="p-2">
          <Nav pills>
            <NavItem>
              <NavLink
                className={{ active: this.state.activeTab === "1" }}
                onClick={() => {
                  this.toggle("1");
                }}
              >
                <span style={{ fontSize: "24px" }}>
                  {" "}
                  {t1("InspectionBook")}{" "}
                </span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={{ active: this.state.activeTab === "2" }}
                onClick={() => {
                  this.toggle("2");
                }}
              >
                <span style={{ fontSize: "24px" }}> {t1("History")} </span>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col sm={12} md={10} lg={10}>
                  <Table>
                    <tbody>
                      <tr>
                        <td className="text-center" colSpan={4}>
                          <h6
                            className="text-bold-600"
                            style={{ fontSize: "20px" }}
                          >
                            {t1("PersonalInfo")}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">
                          <h6 className="text-bold-600">{t1("inn")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionnook.contractor.innOrPinfl}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">{t1("contractor")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionnook.contractor.fullName}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">{t1("Region")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionnook.contractor.region}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">{t1("District")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionnook.contractor.district}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">
                          <h6 className="text-bold-600">{t1("Oked")}</h6>
                        </td>
                        <td colSpan={3}>
                          <h6 className="text-bold-900">
                            {inspectionnook.contractor.oked}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">
                          <h6 className="text-bold-600">
                            {t1("orderedOrganizationId")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionnook.orderedOrganization}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">
                            {t1("inspectionOrganizationId")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionnook.inspectionOrganization}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">
                          <h6 className="text-bold-600">
                            {t1("authorizedOrganizationId")}
                          </h6>
                        </td>
                        <td colSpan={3}>
                          <h6 className="text-bold-900">
                            {inspectionnook.authorizedOrganization}
                          </h6>
                        </td>
                      </tr>
                      {/* Hujjat davomi..................... */}
                      <tr>
                        <td scope="row">
                          <h6 className="text-bold-600">{t1("docDate")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionnook.docDate}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">
                            {t1("checkDaysNumber")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionnook.checkDaysNumber}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">
                          <h6 className="text-bold-600">{t1("startDate")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionnook.startDate}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">{t1("endDate")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionnook.endDate}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">
                          <h6 className="text-bold-600">{t1("orderNumber")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionnook.orderNumber}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">
                            {t1("controlFunctions")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionnook.inspectorNames?.map(
                              (item, index) => (
                                <Badge
                                  style={{ marginBottom: "2px" }}
                                  color="success"
                                  className="mr-1"
                                  key={index}
                                >
                                  {item}{" "}
                                </Badge>
                              )
                            )}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">
                          <h6 className="text-bold-600">{t1("inspectors")}</h6>
                        </td>
                        <td colSpan={3}>
                          <h6 className="text-bold-900">
                            {inspectionnook.inspectorNames?.map(
                              (item, index) => (
                                <Badge
                                  style={{ marginBottom: "2px" }}
                                  color="success"
                                  className="mr-1"
                                  key={index}
                                >
                                  {item}{" "}
                                </Badge>
                              )
                            )}
                          </h6>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Row>
                    <Col sm={12} md={6} lg={12}>
                      <Table responsive bordered borderless striped>
                        <thead className="bg-primary text-white">
                          <tr>
                            {/* <th>{t1("ID")}</th> */}
                            <th> {t1("fullname")}</th>
                            <th>{t1("workplace")}</th>
                            <th>{t1("directionOfActivity")}</th>
                            <th>{t1("contractNumber")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inspectionnook.specialists?.map((item, idx) => (
                            <tr key={idx}>
                              {/* <th>{item.id}</th> */}
                              <th>{item.fullName}</th>
                              <th>{item.workplace}</th>
                              <th>{item.directionOfActivity}</th>
                              <th>{item.contractNumber}</th>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </Col>
                <Col className="text-right" sm={12} md={2} lg={2}>
                  <Button
                    style={{ width: "100%", marginBottom: "5px" }}
                    className="ml-1"
                    color="danger"
                    onClick={() => history.goBack()}
                  >
                    {" "}
                    {t1("back")}{" "}
                  </Button>
                  {can("RequestSend") && isSend(inspectionnook.statusId) ? (
                    <Button
                      style={{ width: "100%", marginBottom: "5px" }}
                      className="ml-1"
                      color="success"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "Send" });
                        this.setState((prevState) => ({
                          send: {
                            ...prevState.send,
                            id: inspectionnook.id,
                          },
                        }));
                      }}
                    >
                      {" "}
                      {t1("Send")}{" "}
                    </Button>
                  ) : (
                    ""
                  )}
                </Col>
                <Modal
                  isOpen={this.state.modal}
                  toggle={this.toggleModal}
                  className={this.props.className}
                >
                  <ModalHeader>
                    {this.state.activeModal === "Send" && t1("Send", intl)}
                  </ModalHeader>
                  <ModalBody>
                    <h5>{t1("message", intl)}</h5>
                    {this.state.activeModal === "Send" && (
                      <Input
                        type="textarea"
                        value={send.message || ""}
                        onChange={(e) =>
                          this.handleChangeTextArr(e, "message", "send")
                        }
                        id="message"
                        placeholder={t2("message", intl)}
                      />
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" onClick={this.toggleModal}>
                      {t1("back", intl)}
                    </Button>{" "}
                    {this.state.activeModal === "Send" && (
                      <Button color="success" onClick={this.SendFunction}>
                        {SendLoading ? <Spinner size="sm" /> : ""}
                        {t1("yes", intl)}
                      </Button>
                    )}
                  </ModalFooter>
                </Modal>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Card>
                <CardHeader>
                  <CardTitle>{t1("HistoryDocument")}</CardTitle>
                </CardHeader>
                <CardBody>
                  <div
                    className="test"
                    style={{
                      maxHeight: "400px",
                      overflow: "auto",
                      height: "100%",
                    }}
                  >
                    <ul className="activity-timeline timeline-left list-unstyled">
                      {histories?.map((item, idx) => (
                        <li>
                          <div
                            className={`timeline-icon bg-${this.getColor(
                              item.statusId
                            )}`}
                          >
                            <Icon.Plus size={16} />
                          </div>
                          <div className="timeline-info">
                            <p className="font-weight-bold mb-0">
                              {item.userInfo}
                            </p>
                            <span className="font-small-3">
                              -
                              <Badge
                                color={this.getColor(item.statusId)}
                                className="mr-1"
                              >
                                {item.status}
                              </Badge>
                              {item.parentOrganization}
                            </span>
                            <p>
                              {t1("dateOfCreated")} - {item.dateOfCreated}
                            </p>
                            <p>
                              {t1("message")} - {item.message}
                            </p>
                          </div>
                          <small className="text-muted"></small>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardBody>
              </Card>
            </TabPane>
          </TabContent>
        </Card>
      </Overlay>
    );
  }
}
export default injectIntl(EditInspectionResult);
