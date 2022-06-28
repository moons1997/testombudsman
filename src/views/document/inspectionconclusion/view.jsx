import React from "react";
import {
  Card,
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  Spinner,
  CustomInput,
  TabContent,
  TabPane,
  NavItem,
  NavLink,
  Nav,
  Badge,
  Table,
  InputGroup,
  InputGroupAddon,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardHeader,
  CardTitle,
  CardBody,
} from "reactstrap";
import Overlay from "../../../components/Webase/components/Overlay";
import Select from "react-select";
import {
  Notification,
  Translate,
  Permission,
} from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
import moment from "moment";
import * as Icon from "react-feather";
import CheckingQuizService from "../../../services/info/checkingquiz.service";
import EmployeeService from "../../../services/info/employee.service";
import InspectionConclusionService from "../../../services/document/inspectionconclusion.service";
import style from "../inspectionbook/style.css";
import "moment/locale/ru";
import CheckValidation from "../../../components/Webase/functions/checkvalidation";
import DatePicker, { registerLocale } from "react-datepicker";
import MaskedTextInput from "react-text-mask";
import uz from "date-fns/locale/uz";
import uzCyrl from "date-fns/locale/uz-Cyrl";
import ru from "date-fns/locale/ru";
import date from "../request/date.css";
import ManualService from "../../../services/other/manual.service";
import { isSend } from "../../../components/Webase/functions/RequestStatus";
registerLocale("uz", uz);
registerLocale("uzCyrl", uzCyrl);
registerLocale("ru", ru);
const { t1, t2 } = Translate;
const { errorToast, successToast, customErrorToast } = Notification;
const { can } = Permission;

const { check, checkFilePdf20mb } = CheckValidation;
class EditRequest extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.state = {
      inspectionconclusion: {
        contractor: {},
      },
      send: {},
      SendLoading: false,
      loading: false,
      SaveLoading: false,
      CheckingQuizzesList: [],
      activeTab: "1",
      modal: false,
      EmployeeList: [],
      ConclusionList: [],
      SaveInspectionResultLoading: false,
      loadingHistory: false,
      inspectionconclusionHistory: [],
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
      this.props.location.state.inspctionconclusiontBtn
    ) {
      InspectionConclusionService.GetByRequestId(this.props.match.params.id)
        .then((res) => {
          this.setState({ inspectionconclusion: res.data, loading: false });
          //   this.changeCheckingQuiz(
          //     this.state.inspectionconclusion.orderedOrganizationId
          //   );
        })
        .catch((error) => {
          this.setState({ loading: false });
          errorToast(error.response.data);
        });
    } else {
      InspectionConclusionService.Get(this.props.match.params.id)
        .then((res) => {
          this.setState({ inspectionconclusion: res.data, loading: false });
          //   this.changeCheckingQuiz(
          //     this.state.inspectionconclusion.orderedOrganizationId
          //   );
        })
        .catch((error) => {
          this.setState({ loading: false });
          errorToast(error.response.data);
        });
    }
  };
  GetDataList = () => {
    ManualService.ConclusionSelectList().then((res) => {
      this.setState({ ConclusionList: res.data });
    });
  };
  employeechange = ({}) => {
    EmployeeService.GetAsSelectList({}).then((res) => {
      this.setState({ EmployeeList: res.data });
    });
  };
  handleChangeInspectionResult = (event, field, data) => {
    var inspectionconclusion = this.state.inspectionconclusion;
    if (!!event) {
      inspectionconclusion[field] = !!event?.target
        ? event.target.value
        : data.value;
      if (field == "conclusionId") {
        inspectionconclusion.conclusion = this.state.ConclusionList.filter(
          (item) => item.value === inspectionconclusion.conclusionId
        )[0].text;
      }
      this.setState({ inspectionconclusion: inspectionconclusion });
    } else {
      if (field === "dateOfCreated" || field === "dateOfModified") {
        inspectionconclusion[field] = "";
      }
      if (field == "conclusionId") {
        inspectionconclusion.conclusion = "";
        inspectionconclusion.conclusionId = null;
      }
      this.setState({ inspectionconclusion: inspectionconclusion });
    }
  };
  changeCheckingQuiz = () => {
    CheckingQuizService.GetAsSelectList(
      this.state.inspectionconclusion.orderedOrganizationId
    ).then((res) => {
      this.setState({ CheckingQuizzesList: res.data });
    });
  };
  sendChange(event, field, data) {
    var send = this.state.send;
    send[field] = !!event.target ? event.target.value : data.value;
    this.setState({ send: send });
    // this.state.send.id = this.state.request.id;
  }
  SendFunction = () => {
    this.setState({ SendLoading: true });
    InspectionConclusionService.Send(this.state.send)
      .then((res) => {
        this.setState({ SendLoading: false });
        successToast(t2("SuccessSend", this.props.intl));
        this.setState({ modal: false });
        setTimeout(() => {
          this.props.history.push("/document/inspectionconclusion");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ SendLoading: false });
      });
  };
  SaveDataInspectionResult = () => {
    this.setState({ SaveInspectionResultLoading: false });
    InspectionConclusionService.Update(this.state.inspectionconclusion)
      .then((res) => {
        this.setState({ SaveInspectionResultLoading: false });
        successToast(t2("SuccessSave", this.props.intl));
        this.props.history.push(
          "/document/inspectionconclusion/" + res.data.id
        );
        setTimeout(() => {}, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ SaveInspectionResultLoading: false });
      });
  };
  toggle(tab) {
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
  GetHistory = () => {
    this.setState({ loadingHistory: true });
    InspectionConclusionService.GetHistoryList(
      this.state.inspectionconclusion.id,
      {}
    )
      .then((res) => {
        this.setState({
          inspectionconclusionHistory: res.data.rows,
          loadingHistory: false,
        });
      })
      .catch((error) => {
        this.setState({ loadingHistory: false });
        errorToast(error.response.data);
      });
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
      SaveInspectionResultLoading,
      inspectionconclusion,
      CheckingQuizzesList,
      EmployeeList,
      ConclusionList,
      inspectionconclusionHistory,
      loadingHistory,
      SendLoading,
      send,
      activeTab,
    } = this.state;
    const { history, intl } = this.props;
    //template
    return (
      <Overlay show={loading}>
        <Card className="p-2">
          <Nav tabs>
            <NavItem>
              <NavLink
                className={{ active: activeTab === "1" }}
                onClick={() => {
                  this.toggle("1");
                  //   this.InspectionResult();
                }}
              >
                <Row>
                  <Col>
                    <h2> {t1("InspectionConclusion")} </h2>
                  </Col>
                </Row>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={{ active: activeTab === "2" }}
                onClick={() => {
                  this.toggle("2");
                  this.GetHistory();
                }}
              >
                <Row>
                  <Col>
                    <h2> {t1("History")} </h2>
                  </Col>
                </Row>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col>
                  <Table>
                    <tbody>
                      <tr>
                        <td className="text-center" colSpan={4}>
                          <h6
                            style={{
                              color: "#4177C9",
                              fontSize: "20px",
                            }}
                            className="text-bold-600"
                          >
                            {t1("DocumentInfo")}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">{t1("docNumber")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900 text-left">
                            {inspectionconclusion.requestDocNumber}
                          </h6>
                        </td>
                        <td></td>
                        <td></td>
                      </tr>
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
                            {inspectionconclusion.contractor.innOrPinfl}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">{t1("contractor")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionconclusion.contractor.fullName}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">{t1("Region")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionconclusion.contractor.region}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">{t1("District")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionconclusion.contractor.district}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">
                          <h6 className="text-bold-600">{t1("Oked")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionconclusion.contractor.oked}
                          </h6>
                        </td>
                        <td scope="row">
                          <h6 className="text-bold-600">
                            {t1("orderedOrganizationId")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionconclusion.orderedOrganization}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">
                            {t1("inspectionOrganizationId")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionconclusion.inspectionOrganization}
                          </h6>
                        </td>
                        <td scope="row">
                          <h6 className="text-bold-600">
                            {t1("authorizedOrganizationId")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionconclusion.authorizedOrganization}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">
                          <h6 className="text-bold-600">{t1("conclusion")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionconclusion.conclusion}
                          </h6>
                        </td>
                        <td scope="row">
                          <h6 className="text-bold-600">{t1("comment")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionconclusion.comment}
                          </h6>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col className="text-right" sm={12} md={2} lg={2}>
                  <Button
                    style={{ width: "100%", marginBottom: "5px" }}
                    className="ml-1"
                    color="danger"
                    onClick={() =>
                      history.push("/document/inspectionconclusion")
                    }
                  >
                    {" "}
                    {t1("back")}{" "}
                  </Button>

                  {can("RequestSend") &&
                  isSend(inspectionconclusion.statusId) ? (
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
                            id: inspectionconclusion.id,
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
                        onChange={(e) => this.sendChange(e, "message", "send")}
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
                      {loadingHistory ? (
                        <Spinner size="sm" />
                      ) : (
                        inspectionconclusionHistory.map((item, idx) => (
                          <li key={idx}>
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
                        ))
                      )}
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

export default injectIntl(EditRequest);
