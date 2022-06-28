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
  Table,
  Badge,
  CardHeader,
  CardTitle,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledTooltip,
  Alert,
} from "reactstrap";
import { Plus, AlertCircle, Check } from "react-feather";
import RequestService from "../../../services/document/request.service";
import Overlay from "../../../components/Webase/components/Overlay";
import {
  Notification,
  Translate,
  Permission,
} from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
import * as Icon from "react-feather";
import InspectionConclusionService from "../../../services/document/inspectionconclusion.service";
import CheckingQuizService from "../../../services/info/checkingquiz.service";
import EmployeeService from "../../../services/info/employee.service";
import InspectionResultService from "../../../services/document/inspectionresult.service";
import { isSend } from "../../../components/Webase/functions/RequestStatus";
import style from "../inspectionbook/style.css";
import axios from "axios";
const { t1, t2 } = Translate;
const { errorToast, successToast } = Notification;
const { can } = Permission;

class EditRequest extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.state = {
      inspectionresult: { contractor: {} },
      loading: false,
      SaveLoading: false,
      CheckingQuizzesList: [],
      activeTab: "1",
      activeTabFile: "1",
      modal: false,
      EmployeeList: [],
      SaveInspectionResultLoading: false,
      histories: [],
      send: {},
      inspectionconclusion: {},
      activeModal: "",
      SendLoading: false,
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
    if (this.props.match.params.id == 0) {
      InspectionResultService.GetByRequestId(this.props.match.params.id)
        .then((res) => {
          this.setState({ inspectionresult: res.data, loading: false });
        })
        .catch((error) => {
          this.setState({ loading: false });
          errorToast(error.response.data);
        });
    }
    if (this.props.match.params.id !== 0) {
      InspectionResultService.Get(this.props.match.params.id)
        .then((res) => {
          this.setState({ inspectionresult: res.data, loading: false });
        })
        .catch((error) => {
          this.setState({ loading: false });
          errorToast(error.response.data);
        });
    }
  };
  GetDataList = () => {
    // EmployeeService.GetAsSelectList({}).then((res) => {
    //   this.setState({ EmployeeList: res.data });
    // });
    InspectionResultService.GetHistoryList({}, this.props.match.params.id).then(
      (res) => {
        this.setState({ histories: res.data.rows });
      }
    );
  };
  InspectionConclusion = (id) => {
    this.setState({ loadingInspection: true });
    InspectionConclusionService.GetByRequestId(
      this.state.inspectionresult.requestId
    )
      .then((res) => {
        this.setState({
          inspectionconclusion: res.data,
          loadingInspection: false,
        });
        this.props.history.push({
          pathname:
            this.state.inspectionresult.inspectionConclusionId === null
              ? "/document/editinspectionconclusion/" +
                this.state.inspectionresult.requestId
              : "/document/viewinspectionconclusion/" +
                this.state.inspectionresult.inspectionConclusionId,
          state: { inspctionconclusiontBtn: true, id },
        });

        console.log(this.state.inspectionresult.requestId);
      })
      .catch((error) => {
        this.setState({ loadingInspection: false });
        errorToast(error.response.data);
      });
  };
  employeechange = ({}) => {
    EmployeeService.GetAsSelectList({}).then((res) => {
      this.setState({ EmployeeList: res.data });
    });
  };
  handleChangeInspectionResult = (event, field, data) => {
    var inspectionresult = this.state.inspectionresult;
    inspectionresult[field] = !!event.target ? event.target.value : data.value;
    this.setState({ inspectionresult: inspectionresult });
  };
  changeCheckingQuiz = (id) => {
    CheckingQuizService.GetAsSelectList(id).then((res) => {
      this.setState({ CheckingQuizzesList: res.data });
    });
  };
  sendChange(event, field, data) {
    var send = this.state.send;
    send[field] = !!event.target ? event.target.value : data.value;
    // this.state.send.id = this.state.request.id;
    this.setState({ send });
    // this.state.send.id = this.state.inspectionresult.requestId;
  }
  handleChangeTextArr(event, field, state, data) {
    if (state === "send") {
      var send = this.state.send;
      send[field] = !!event.target ? event.target.value : data.value;
      // this.state.send.id = this.state.request.id;
      this.setState({ send });
    }
  }
  DownloadFileInspectionAct = (item, index, field) => {
    this.setState({ downloadLoad: { check: true, id: item.id } });
    InspectionResultService.DownloadActFile(item.id)
      .then((res) => {
        this.setState({ downloadLoad: { check: false, id: item.id } });
        successToast(t2("DownloadSuccess", this.props.intl));
        this.forceFileDownload(res, item.id, item.fileName);
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
  };
  DeleteFileMeasuresOfInfluence = (item, index, field) => {
    this.setState({ downloadLoad: { check: true, id: item.id } });
    InspectionResultService.DownloadMeasuresOfInfluenceFile(item.id)
      .then((res) => {
        this.setState({ downloadLoad: { check: false, id: item.id } });
        successToast(t2("DownloadSuccess", this.props.intl));
        this.forceFileDownload(res, item.id, item.fileName);
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
  };
  DeleteFileCancelledMeasures = (item, index, field) => {
    this.setState({ downloadLoad: { check: true, id: item.id } });
    InspectionResultService.DownloadCancelledMeasuresFile(item.id)
      .then((res) => {
        this.setState({ downloadLoad: { check: false, id: item.id } });
        successToast(t2("DownloadSuccess", this.props.intl));
        this.forceFileDownload(res, item.id, item.fileName);
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
  };
  DeleteFileMeasuresResult = (item, index, field) => {
    this.setState({ downloadLoad: { check: true, id: item.id } });
    InspectionResultService.DownloadMeasuresResultFile(item.id)
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

  handleChangeInspection = (file, field) => {
    if (field == "actFiles") {
      let formData = new FormData();
      for (let i = 0; i < file.length; i++) {
        formData.append(`files`, file[i]);
      }
      const { inspectionresult } = this.state;
      InspectionResultService.UploadActFile(formData).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          inspectionresult.actFiles.push({
            id: res.data[i].fileId,
            name: res.data[i].fileName,
          });
        }
        this.setState({ inspectionresult: inspectionresult });
      });
    }
    if (field == "measuresOfInfluenceFiles") {
      let formData = new FormData();
      for (let i = 0; i < file.length; i++) {
        formData.append(`files`, file[i]);
      }
      const { inspectionresult } = this.state;
      InspectionResultService.UploadMeasuresOfInfluenceFile(formData).then(
        (res) => {
          for (let i = 0; i < res.data.length; i++) {
            inspectionresult.measuresOfInfluenceFiles.push({
              id: res.data[i].fileId,
              name: res.data[i].fileName,
            });
          }
          this.setState({ inspectionresult: inspectionresult });
        }
      );
    }
    if (field == "measuresResultFiles") {
      let formData = new FormData();
      for (let i = 0; i < file.length; i++) {
        formData.append(`files`, file[i]);
      }
      const { inspectionresult } = this.state;
      InspectionResultService.UploadMeasuresResultFiles(formData).then(
        (res) => {
          for (let i = 0; i < res.data.length; i++) {
            inspectionresult.measuresResultFiles.push({
              id: res.data[i].fileId,
              name: res.data[i].fileName,
            });
          }
          this.setState({ inspectionresult: inspectionresult });
        }
      );
    }
    if (field == "cancelledMeasuresFiles") {
      let formData = new FormData();
      for (let i = 0; i < file.length; i++) {
        formData.append(`files`, file[i]);
      }
      const { inspectionresult } = this.state;
      InspectionResultService.UploadCancelledMeasuresFiles(formData).then(
        (res) => {
          for (let i = 0; i < res.data.length; i++) {
            inspectionresult.cancelledMeasuresFiles.push({
              id: res.data[i].fileId,
              name: res.data[i].fileName,
            });
          }
          this.setState({ inspectionresult: inspectionresult });
        }
      );
    }
  };
  DeleteFile = (item, index, field) => {
    if (field == "basic") {
      RequestService.DeleteBasicFile(item.id)
        .then((res) => {
          successToast(t2("DeleteSuccess", this.props.intl));
          const { request } = this.state;
          request.basicFiles.splice(index, 1);
          this.setState({ request: request });
        })
        .catch((error) => {
          errorToast(error.response.data);
        });
    }
  };

  SaveDataInspectionResult = () => {
    this.setState({ SaveInspectionResultLoading: false });
    InspectionResultService.Update(this.state.inspectionresult)
      .then((res) => {
        this.setState({ SaveInspectionResultLoading: false });
        successToast(t2("SuccessSave", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/inspectionresult");
        }, 500);
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
  toggleTabFile(tab) {
    if (this.state.activeTabFile !== tab) {
      this.setState({
        activeTabFile: tab,
      });
    }
  }
  toggleModal = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  SendFunction = () => {
    this.setState({ SendLoading: true });
    InspectionResultService.Send(this.state.send)
      .then((res) => {
        this.setState({ SendLoading: false });
        successToast(t2("SuccessSend", this.props.intl));
        this.setState({ modal: false });
        setTimeout(() => {
          this.props.history.push("/document/inspectionresult");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ SendLoading: false });
      });
  };
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
    const {
      loading,
      SaveInspectionResultLoading,
      inspectionresult,
      CheckingQuizzesList,
      EmployeeList,
      histories,
      SendLoading,
      send,
    } = this.state;
    const { history, intl } = this.props;
    //template

    return (
      <Overlay show={loading}>
        {inspectionresult.statusId == 1 || inspectionresult.statusId == 12 ? (
          <Card>
            <Alert
              className="m-1"
              color={this.getAlertColor(inspectionresult.statusId)}
            >
              <p style={{ color: "black" }}>
                {t1("DocumentStatus")} - {inspectionresult.status}
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
                  //   this.InspectionResult();
                }}
              >
                <Row>
                  <Col>
                    <span style={{ fontSize: "24px" }}>
                      {" "}
                      {t1("InspectionResult")}{" "}
                    </span>
                  </Col>
                </Row>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={{ active: this.state.activeTab === "2" }}
                onClick={() => {
                  this.toggle("2");
                }}
              >
                <Row>
                  <Col>
                    <span style={{ fontSize: "24px" }}> {t1("History")} </span>
                  </Col>
                </Row>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col sm={12} md={10} lg={10}>
                  <Table>
                    {/* <thead>
                      <tr>
                        <tr>{t1("DocumentInfo")}</tr>
                      </tr>
                    </thead> */}
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
                            {inspectionresult.contractor.innOrPinfl}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">{t1("contractor")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionresult.contractor.fullName}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">{t1("Region")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionresult.contractor.region}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">{t1("District")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionresult.contractor.district}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">
                          <h6 className="text-bold-600">{t1("Oked")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionresult.contractor.oked}
                          </h6>
                        </td>
                        <td scope="row">
                          <h6 className="text-bold-600">
                            {t1("orderedOrganizationId")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionresult.orderedOrganization}
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
                            {inspectionresult.inspectionOrganization}
                          </h6>
                        </td>
                        <td scope="row">
                          <h6 className="text-bold-600">
                            {t1("authorizedOrganizationId")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionresult.authorizedOrganization}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">{t1("docDate")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900 text-left">
                            {inspectionresult.docDate}
                          </h6>
                        </td>
                        <td></td>
                        <td></td>
                      </tr>
                      {/* <tr>
                        <th>
                          <h6 className="text-bold-600">{t1("docDate")}</h6>
                        </th>
                        <td>
                          <h6 className="text-bold-900 text-right">
                            {inspectionresult.docDate}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900 text-right">
                          </h6>
                        </td>
                      </tr> */}
                      <tr>
                        <td>
                          <h6 className="text-bold-600">
                            {t1("startDateTab4")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900 text-left">
                            {inspectionresult.startDate}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">{t1("endDateTab4")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900 text-left">
                            {inspectionresult.endDate}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600 mb-1">
                            {t1("inspectors")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900 text-left">
                            {inspectionresult.inspectorNames?.map(
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
                        <td>
                          {/* <h6 className="text-bold-600 mb-1">
                            {t1("checkSubjectsQuiz")}
                          </h6> */}
                          <h6 className="text-bold-600">
                            {t1("canViolatedLegalDocumentsQuiz")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900 text-left">
                            {/* {inspectionresult.checkSubjects?.map(
                              (item, index) => (
                                <Badge
                                  color="primary"
                                  className="mr-1 mb-1"
                                  key={index}
                                >
                                  {item}{" "}
                                </Badge>
                              )
                            )} */}
                            {inspectionresult.canViolatedLegalDocuments?.map(
                              (item, index) => (
                                <Badge
                                  color="success"
                                  className="mr-1"
                                  key={index}
                                  style={{ whiteSpace: "normal" }}
                                >
                                  {item}{" "}
                                </Badge>
                              )
                            )}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">{t1("comment")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900 text-left">
                            {inspectionresult.comment}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">{t1("actFiles")}</h6>
                        </td>
                        <td>
                          {inspectionresult.actFiles?.map((item, index) => (
                            <Badge
                              id="actFiles"
                              color="primary"
                              className="mr-1"
                              key={index}
                            >
                              <Icon.Download
                                onClick={() =>
                                  this.DownloadFileInspectionAct(item, index)
                                }
                                style={{ cursor: "pointer" }}
                                size={15}
                              />{" "}
                              {item.name || item.fileName}{" "}
                              <UncontrolledTooltip
                                placement="top"
                                target="actFiles"
                              >
                                {t1("dateOfCreatedFile")} - {item.dateOfCreated}
                              </UncontrolledTooltip>
                            </Badge>
                          ))}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">
                            {t1("measuresOfInfluence")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900 text-left">
                            {inspectionresult.measuresOfInfluence}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">
                            {t1("measuresOfInfluenceFiles")}
                          </h6>
                        </td>
                        <td>
                          {inspectionresult.measuresOfInfluenceFiles?.map(
                            (item, index) => (
                              <Badge
                                id="measuresOfInfluenceFiles"
                                color="primary"
                                className="mr-1"
                                key={index}
                              >
                                <Icon.Download
                                  onClick={() =>
                                    this.DeleteFileMeasuresOfInfluence(
                                      item,
                                      index
                                    )
                                  }
                                  style={{ cursor: "pointer" }}
                                  size={15}
                                />{" "}
                                {item.name || item.fileName}{" "}
                                <UncontrolledTooltip
                                  placement="top"
                                  target="measuresOfInfluenceFiles"
                                >
                                  {t1("dateOfCreatedFile")} -{" "}
                                  {item.dateOfCreated}
                                </UncontrolledTooltip>
                              </Badge>
                            )
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">
                            {t1("measuresResult")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900 text-left">
                            {inspectionresult.measuresResult}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">
                            {t1("measuresResultFiles")}
                          </h6>
                        </td>
                        <td>
                          {inspectionresult.measuresResultFiles?.map(
                            (item, index) => (
                              <Badge
                                id="measuresResultFiles"
                                color="primary"
                                className="mr-1"
                                key={index}
                              >
                                <Icon.Download
                                  onClick={() =>
                                    this.DeleteFileMeasuresResult(item, index)
                                  }
                                  style={{ cursor: "pointer" }}
                                  size={15}
                                />{" "}
                                {item.name || item.fileName}{" "}
                                <UncontrolledTooltip
                                  placement="top"
                                  target="measuresResultFiles"
                                >
                                  {t1("dateOfCreatedFile")} -{" "}
                                  {item.dateOfCreated}
                                </UncontrolledTooltip>
                              </Badge>
                            )
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">
                            {t1("cancelledMeasures")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900 text-left">
                            {inspectionresult.cancelledMeasures}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">
                            {t1("cancelledMeasuresFiles")}
                          </h6>
                        </td>
                        <td>
                          {inspectionresult.cancelledMeasuresFiles?.map(
                            (item, index) => (
                              <Badge
                                id="cancelledMeasuresFiles"
                                color="primary"
                                className="mr-1"
                                key={index}
                              >
                                <Icon.Download
                                  onClick={() =>
                                    this.DeleteFileCancelledMeasures(
                                      item,
                                      index
                                    )
                                  }
                                  style={{ cursor: "pointer" }}
                                  size={15}
                                />{" "}
                                {item.name || item.fileName}{" "}
                                <UncontrolledTooltip
                                  placement="top"
                                  target="cancelledMeasuresFiles"
                                >
                                  {t1("dateOfCreatedFile")} -{" "}
                                  {item.dateOfCreated}
                                </UncontrolledTooltip>
                              </Badge>
                            )
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Nav pills>
                    {inspectionresult?.actFiles?.length != 0 ? (
                      <NavItem>
                        <NavLink
                          className={{
                            active: this.state.activeTabFile === "1",
                          }}
                          onClick={() => {
                            this.toggleTabFile("1");
                          }}
                        >
                          <span style={{ fontSize: "20px" }}>
                            {" "}
                            {t1("actFiles")}
                          </span>
                        </NavLink>
                      </NavItem>
                    ) : (
                      ""
                    )}
                    {inspectionresult?.measuresOfInfluence?.length != 0 ? (
                      <NavItem>
                        <NavLink
                          className={{
                            active: this.state.activeTabFile === "2",
                          }}
                          onClick={() => {
                            this.toggleTabFile("2");
                          }}
                        >
                          <span style={{ fontSize: "20px" }}>
                            {" "}
                            {t1("measuresOfInfluenceFiles")}
                          </span>
                        </NavLink>
                      </NavItem>
                    ) : (
                      ""
                    )}
                    {inspectionresult?.measuresResultFiles?.length != 0 ? (
                      <NavItem>
                        <NavLink
                          className={{
                            active: this.state.activeTabFile === "3",
                          }}
                          onClick={() => {
                            this.toggleTabFile("3");
                          }}
                        >
                          <span style={{ fontSize: "20px" }}>
                            {" "}
                            {t1("measuresResultFiles")}
                          </span>
                        </NavLink>
                      </NavItem>
                    ) : (
                      ""
                    )}
                    {inspectionresult?.cancelledMeasuresFiles?.length != 0 ? (
                      <NavItem>
                        <NavLink
                          className={{
                            active: this.state.activeTabFile === "4",
                          }}
                          onClick={() => {
                            this.toggleTabFile("4");
                          }}
                        >
                          <span style={{ fontSize: "20px" }}>
                            {" "}
                            {t1("cancelledMeasuresFiles")}
                          </span>
                        </NavLink>
                      </NavItem>
                    ) : (
                      ""
                    )}
                  </Nav>
                  <TabContent activeTab={this.state.activeTabFile}>
                    <TabPane tabId="1">
                      <Row>
                        <Col sm={12} md={12} lg={12}>
                          {inspectionresult.actFiles?.map((item, index) => (
                            <Row key={index}>
                              <Col sm={12} md={12} lg={12}>
                                <iframe
                                  width={"100%"}
                                  height={"1000px"}
                                  src={
                                    axios.defaults.baseURL +
                                    `/InspectionResult/DownloadActFile/${item.id}`
                                  }
                                ></iframe>
                              </Col>
                            </Row>
                          ))}
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="2">
                      <Row>
                        <Col sm={12} md={12} lg={12}>
                          {inspectionresult.measuresOfInfluenceFiles?.map(
                            (item2, index2) => (
                              <Row key={index2}>
                                <Col sm={12} md={12} lg={12}>
                                  <iframe
                                    width={"100%"}
                                    height={"1000px"}
                                    src={
                                      axios.defaults.baseURL +
                                      `/InspectionResult/DownloadMeasuresOfInfluenceFile/${item2.id}`
                                    }
                                  ></iframe>
                                </Col>
                              </Row>
                            )
                          )}
                        </Col>
                      </Row>
                    </TabPane>{" "}
                    <TabPane tabId="3">
                      <Row>
                        <Col sm={12} md={12} lg={12}>
                          {inspectionresult.measuresResultFiles?.map(
                            (item3, index3) => (
                              <Row key={index3}>
                                <Col sm={12} md={12} lg={12}>
                                  <iframe
                                    width={"100%"}
                                    height={"1000px"}
                                    src={
                                      axios.defaults.baseURL +
                                      `/InspectionResult/DownloadMeasuresResultFile/${item3.id}`
                                    }
                                  ></iframe>
                                </Col>
                              </Row>
                            )
                          )}
                        </Col>
                      </Row>
                    </TabPane>{" "}
                    <TabPane tabId="4">
                      <Row>
                        <Col sm={12} md={12} lg={12}>
                          {inspectionresult.cancelledMeasuresFiles?.map(
                            (item4, index4) => (
                              <Row key={index4}>
                                <Col sm={12} md={12} lg={12}>
                                  <iframe
                                    width={"100%"}
                                    height={"1000px"}
                                    src={
                                      axios.defaults.baseURL +
                                      `/InspectionResult/DownloadCancelledMeasuresFile/${item4.id}`
                                    }
                                  ></iframe>
                                </Col>
                              </Row>
                            )
                          )}
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                </Col>
                <Col className="text-right" sm={12} md={2} lg={2}>
                  <Button
                    style={{ width: "100%", marginBottom: "5px" }}
                    className="ml-1"
                    color="danger"
                    onClick={() => history.push("/document/inspectionresult")}
                  >
                    {" "}
                    {t1("back")}{" "}
                  </Button>

                  <Button
                    style={{ width: "100%", marginBottom: "5px" }}
                    className="ml-1"
                    color="success"
                    onClick={() =>
                      history.push(
                        `/document/resultEdit/${inspectionresult.id}`
                      )
                    }
                  >
                    {" "}
                    {t1("Edit")}{" "}
                  </Button>
                  {can("InspectionConclusionCreate") ? (
                    //  &&
                    // isExecuteStatus(request.statusId)
                    //  &&
                    // request.inspectionBookId !== null
                    <Button
                      style={{ width: "100%", marginBottom: "5px" }}
                      color="primary"
                      className="ml-1"
                      onClick={() => {
                        this.InspectionConclusion(inspectionresult);
                      }}
                    >
                      {" "}
                      {t1("InspectionConclusion")}{" "}
                    </Button>
                  ) : (
                    ""
                  )}
                  {can("RequestSend") && isSend(inspectionresult.statusId) ? (
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
                            id: inspectionresult.id,
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
              {/* <Row>
                <Col>
                  <Button
                    color="danger"
                    onClick={() => history.push("/document/inspectionresult")}
                  >
                    {" "}
                    {t1("back")}{" "}
                  </Button>
                </Col>
                <Col className="text-right">
                  <Button
                    color="success"
                    onClick={this.SaveDataInspectionResult}
                  >
                    {" "}
                    {SaveInspectionResultLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      ""
                    )}{" "}
                    {t1("Save")}{" "}
                  </Button>
                </Col>
              </Row> */}
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

export default injectIntl(EditRequest);
