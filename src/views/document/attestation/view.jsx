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
  UncontrolledTooltip,
  CardHeader,
  CardTitle,
  CardBody,
  Alert,
} from "reactstrap";
import { Plus, AlertCircle, Check } from "react-feather";
import Overlay from "../../../components/Webase/components/Overlay";
import {
  Notification,
  Translate,
  Permission,
} from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
import * as Icon from "react-feather";
import axios from "axios";
import {
  isSend,
  isHeldStatus,
  isCancelHeldStatus,
} from "../../../components/Webase/functions/RequestStatus";
import style from "./style.css";
import AttestationService from "../../../services/document/attestation.service";
const { t1, t2 } = Translate;
const { can } = Permission;
const { errorToast, successToast } = Notification;

class EditInspectionResult extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    // this.toggle = this.toggle.bind(this);
    this.state = {
      attestation: {},
      attestationHistory: {},
      loading: false,
      loadingPostponement: false,
      SaveLoading: false,
      activeTab: "1",
      send: {},
      reject: {},
      held: {},
      cancelheld: {},
      SendLoading: false,
      RejectLoading: false,
      modal: false,
      HeldLoading: false,
    };
  }
  //Created
  componentDidMount() {
    this.Refresh();
    this.GetDataList();
  }
  // methods

  Refresh() {
    this.setState({ loading: true });
    AttestationService.Get(this.props.match.params.id)
      .then((res) => {
        this.setState({ attestation: res.data, loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
        errorToast(error.response.data);
      });
  }

  GetDataList = () => {};
  // sendChange(event, field, data) {
  //   var send = this.state.send;
  //   send[field] = !!event.target ? event.target.value : data.value;
  //   this.setState({ send: send });
  // }
  SendFunction = () => {
    this.setState({ SendLoading: true });
    AttestationService.Send(this.state.send)
      .then((res) => {
        this.setState({ SendLoading: false });
        successToast(t2("SuccessSend", this.props.intl));
        this.setState({ modal: false });
        setTimeout(() => {
          this.props.history.push("/document/attestation");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ SendLoading: false });
      });
  };
  RejectFunction = () => {
    this.setState({ RejectLoading: true });
    AttestationService.Reject(this.state.reject)
      .then((res) => {
        this.setState({ RejectLoading: false });
        successToast(t2("SuccessReject", this.props.intl));
        this.setState({ modal: false });
        setTimeout(() => {
          this.props.history.push("/document/attestation");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ RejectLoading: false });
      });
  };
  HeldFunction = () => {
    this.setState({ HeldLoading: true });
    AttestationService.Held(this.state.held)
      .then((res) => {
        this.setState({ HeldLoading: false });
        successToast(t2("SuccessHeld", this.props.intl));
        this.setState({ modal: false });
        setTimeout(() => {
          this.props.history.push("/document/attestation");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ HeldLoading: false });
      });
  };
  CancelHeldFunction = () => {
    this.setState({ HeldLoading: true });
    AttestationService.CancelHeld(this.state.cancelheld)
      .then((res) => {
        this.setState({ HeldLoading: false });
        successToast(t2("SuccessHeld", this.props.intl));
        this.setState({ modal: false });
        setTimeout(() => {
          this.props.history.push("/document/attestation");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ HeldLoading: false });
      });
  };
  DownloadFilePost = (item, index, field) => {
    this.setState({ downloadLoad: { check: true, id: item.id } });
    AttestationService.DownloadFile(item.id)
      .then((res) => {
        this.setState({ downloadLoad: { check: false, id: item.id } });
        successToast(t2("DownloadSuccess", this.props.intl));
        this.forceFileDownload(res, item.id, item.fileName);
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
  };
  forceFileDownload(response, name, attachfilename) {
    var blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    let format = attachfilename.split(".");
    const link = document.createElement("a");
    link.href = url;
    if (format.length > 0) {
      link.setAttribute(
        "download",
        format[0] + "." + format[format.length - 1]
      );
    }
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }
  handleChangeTextArr(event, field, state, data) {
    if (state === "send") {
      var send = this.state.send;
      send[field] = !!event.target ? event.target.value : data.value;
      // this.state.send.id = this.state.request.id;
      this.setState({ send });
    }
    if (state === "held") {
      var held = this.state.held;
      held[field] = !!event.target ? event.target.value : data.value;
      // this.state.send.id = this.state.request.id;
      this.setState({ held });
    }
    if (state === "cancelheld") {
      var cancelheld = this.state.cancelheld;
      cancelheld[field] = !!event.target ? event.target.value : data.value;
      // this.state.send.id = this.state.request.id;
      this.setState({ cancelheld });
    }
    if (state === "reject") {
      var reject = this.state.reject;
      reject[field] = !!event.target ? event.target.value : data.value;
      // this.state.send.id = this.state.request.id;
      this.setState({ reject });
    }
  }
  GetHistory = () => {
    this.setState({ loading: true });
    AttestationService.GetHistoryList({}, this.props.match.params.id)
      .then((res) => {
        this.setState({ attestationHistory: res.data, loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
        errorToast(error.response.data);
      });
  };
  toggle(tab) {
    // if(can("RequestAgree"))
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }
  toggleModal = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  getColor = (id) => {
    switch (id) {
      case 1:
        return "info";
        break;
      case 12:
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
    const {
      loading,
      HeldLoading,
      attestation,
      SendLoading,
      send,
      held,
      cancelheld,
      reject,
      attestationHistory,
      RejectLoading,
    } = this.state;
    const { history, intl } = this.props;
    //template
    return (
      <Overlay show={loading}>
        <Card className="p-2">
          <Nav pills>
            <NavItem>
              <NavLink
                className={{ active: this.state.activeTab === "1" }}
                onClick={() => {
                  this.toggle("1");
                }}
              >
                <span style={{ fontSize: "24px" }}> {t1("Attestation")} </span>{" "}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={{ active: this.state.activeTab === "2" }}
                onClick={() => {
                  this.toggle("2");
                  this.GetHistory();
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
                            {t1("PersonalInfo")} -{" "}
                            <span
                              style={{
                                color: "#004242",
                                fontSize: "22px",
                                fontWeight: "bold",
                              }}
                            >
                              {attestation.status}
                            </span>
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        {/* <td scope="row">
                          <h6 className="text-bold-600">
                            {t1("docNumberAttestation")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {attestation.docNumber}
                          </h6>
                        </td> */}
                        <td>
                          <h6 className="text-bold-600">
                            {t1("attestationDocDate")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {attestation.docDate}
                          </h6>
                        </td>
                        <td scope="row">
                          <h6 className="text-bold-600">
                            {t1("authorizedOrganization")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {attestation.authorizedOrganization}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">
                            {t1("parentOrganization")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {attestation.parentOrganization}
                          </h6>
                        </td>

                        <td scope="row">
                          <h6 className="text-bold-600">
                            {t1("organization")}
                          </h6>
                        </td>
                        <td colSpan={3}>
                          <h6 className="text-bold-900">
                            {attestation.organization}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">
                          <h6 className="text-bold-600">{t1("Files")}</h6>
                        </td>
                        <td>
                          {attestation.files?.map((item, index) => (
                            <Badge
                              id="positionTop"
                              color="primary"
                              style={{ margin: "2px" }}
                              key={index}
                            >
                              <Icon.Download
                                onClick={() =>
                                  this.DownloadFilePost(item, index)
                                }
                                style={{ cursor: "pointer" }}
                                size={15}
                              />{" "}
                              {item.name || item.fileName}{" "}
                              <UncontrolledTooltip
                                placement="top"
                                target="positionTop"
                              >
                                {t1("dateOfCreatedFile")} - {item.dateOfCreated}
                              </UncontrolledTooltip>
                            </Badge>
                          ))}
                        </td>
                        <td scope="row">
                          <h6 className="text-bold text-danger">ID</h6>
                        </td>
                        <td colSpan={3}>
                          <h6 className="text-bold">
                            <span
                              className="text-danger"
                              style={{ fontSize: "20px" }}
                            >
                              {attestation.id}
                            </span>
                          </h6>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Row>
                    <Col sm={12} md={12} lg={12}>
                      {attestation.files?.map((item, index) => (
                        <iframe
                          width="100%"
                          height="500px"
                          // dangerouslySetInnerHTML={{ __html: HtmlData }}
                          src={
                            axios.defaults.baseURL +
                            `/Attestation/DownloadFile/${item.id}`
                          }
                        ></iframe>
                      ))}
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col sm={12} md={6} lg={12}>
                      <Table bordered borderless striped>
                        <thead className="bg-primary text-white">
                          <tr>
                            <th>№</th>
                            <th>
                              {t1("fio")} -
                              <span
                                style={{ fontSize: "16px", marginLeft: "5px" }}
                              >
                                ( {t1("employeesCount")}:{" "}
                                {attestation.employeesCount})
                              </span>
                            </th>
                            <th>{t1("CertificateNumber")}</th>
                            <th> {t1("Date")}</th>
                            <th>{t1("OrderType")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attestation.items?.map((item, idx) => (
                            <tr key={idx}>
                              <th>{idx + 1}</th>
                              <th>{item.employeeName}</th>
                              <th>{item.certificateNumber}</th>
                              <th>{item.expirationDate}</th>
                              <th>{item.orderType}</th>
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
                    // onClick={() => history.push("/document/attestation")}
                  >
                    {" "}
                    {t1("back")}{" "}
                  </Button>
                  {(can("AttestationCreate") || can("AttestationEdit")) &&
                  isSend(attestation.statusId) ? (
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
                            id: attestation.id,
                          },
                        }));
                      }}
                    >
                      {" "}
                      <Icon.Send size={18} /> {t1("Send")}{" "}
                    </Button>
                  ) : (
                    ""
                  )}

                  {can("AttestationHeld") &&
                  isHeldStatus(attestation.statusId) ? (
                    <Button
                      style={{ width: "100%", marginBottom: "5px" }}
                      className="ml-1"
                      color="danger"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "Reject" });
                        this.setState((prevState) => ({
                          reject: {
                            ...prevState.reject,
                            id: attestation.id,
                          },
                        }));
                      }}
                    >
                      {t1("Reject")}
                    </Button>
                  ) : (
                    ""
                  )}
                  {can("AttestationHeld") &&
                  (attestation.statusId != 16 ||
                    isHeldStatus(attestation.statusId)) ? (
                    <Button
                      style={{ width: "100%", marginBottom: "5px" }}
                      className="ml-1"
                      color="info"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "Held" });
                        this.setState((prevState) => ({
                          held: {
                            ...prevState.held,
                            id: attestation.id,
                          },
                        }));
                      }}
                    >
                      {" "}
                      {t1("Held")}{" "}
                    </Button>
                  ) : (
                    ""
                  )}
                  {can("AttestationCancelHeld") &&
                  attestation.statusId == 16 ? (
                    <Button
                      style={{ width: "100%", marginBottom: "5px" }}
                      className="ml-1"
                      color="info"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "CancelHeld" });
                        this.setState((prevState) => ({
                          cancelheld: {
                            ...prevState.cancelheld,
                            id: attestation.id,
                          },
                        }));
                      }}
                    >
                      {" "}
                      {t1("CancelHeld")}{" "}
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
                    {this.state.activeModal === "Held" && t1("Held", intl)}
                    {this.state.activeModal === "CancelHeld" &&
                      t1("CancelHeld", intl)}
                    {this.state.activeModal === "Reject" && t1("Reject", intl)}
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
                    {this.state.activeModal === "Reject" && (
                      <Input
                        type="textarea"
                        value={reject.message || ""}
                        onChange={(e) =>
                          this.handleChangeTextArr(e, "message", "reject")
                        }
                        id="message"
                        placeholder={t2("message", intl)}
                      />
                    )}
                    {this.state.activeModal === "Held" && (
                      <Input
                        type="textarea"
                        value={held.message || ""}
                        onChange={(e) =>
                          this.handleChangeTextArr(e, "message", "held")
                        }
                        id="message"
                        placeholder={t2("message", intl)}
                      />
                    )}
                    {this.state.activeModal === "CancelHeld" && (
                      <Input
                        type="textarea"
                        value={cancelheld.message || ""}
                        onChange={(e) =>
                          this.handleChangeTextArr(e, "message", "cancelheld")
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
                    {this.state.activeModal === "Reject" && (
                      <Button color="success" onClick={this.RejectFunction}>
                        {RejectLoading ? <Spinner size="sm" /> : ""}
                        {t1("yes", intl)}
                      </Button>
                    )}
                    {this.state.activeModal === "Held" && (
                      <Button color="success" onClick={this.HeldFunction}>
                        {HeldLoading ? <Spinner size="sm" /> : ""}
                        {t1("yes", intl)}
                      </Button>
                    )}
                    {this.state.activeModal === "CancelHeld" && (
                      <Button color="success" onClick={this.CancelHeldFunction}>
                        {HeldLoading ? <Spinner size="sm" /> : ""}
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
                      {attestationHistory.rows?.map((item, idx) => (
                        <li key={idx}>
                          <div
                            className={`timeline-icon bg-${this.getColor(
                              item.statusId
                            )}`}
                          >
                            <Plus size={16} />
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
