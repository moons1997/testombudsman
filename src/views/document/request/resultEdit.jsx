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
} from "reactstrap";
import RequestService from "../../../services/document/request.service";
import Overlay from "../../../components/Webase/components/Overlay";
import Select from "react-select";
import AsynSelect from "react-select/async";
import {
  Notification,
  Translate,
  Permission,
} from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
import { UzbekLatin } from "flatpickr/dist/l10n/uz_latn";
import { Russian } from "flatpickr/dist/l10n/ru";
import { Uzbek } from "flatpickr/dist/l10n/uz";
import moment from "moment";
import Flatpickr from "react-flatpickr";
import * as Icon from "react-feather";
import CheckingQuizService from "../../../services/info/checkingquiz.service";
import EmployeeService from "../../../services/info/employee.service";
import InspectionResultService from "../../../services/document/inspectionresult.service";
import style from "../inspectionbook/style.css";
// import { DatePicker } from "antd";
import "moment/locale/ru";
import locale from "antd/es/date-picker/locale/ru_RU";
import CheckValidation from "../../../components/Webase/functions/checkvalidation";
import DatePicker, { registerLocale } from "react-datepicker";
import MaskedTextInput from "react-text-mask";
import uz from "date-fns/locale/uz";
import uzCyrl from "date-fns/locale/uz-Cyrl";
import ru from "date-fns/locale/ru";
import { changeAll } from "../../../redux/actions/pagination";
import { connect } from "react-redux";
import date from "./date.css";

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
      inspectionresult: {
        contractor: {},
      },
      loading: false,
      SaveLoading: false,
      CheckingQuizzesList: [],
      activeTab: "1",
      modal: false,
      EmployeeList: [],
      SaveInspectionResultLoading: false,
      page: {
        sortBy: "",
        orderType: "asc",
        page: 1,
        pageSize: 5,
      },
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
      this.props.location.state.inspctionresultBtn
    ) {
      InspectionResultService.GetByRequestId(this.props.match.params.id)
        .then((res) => {
          this.setState({ inspectionresult: res.data, loading: false }, () => {
            this.employeechange();
          });
          this.changeCheckingQuiz(
            this.state.inspectionresult.orderedOrganizationId
          );
        })
        .catch((error) => {
          this.setState({ loading: false });
          errorToast(error.response.data);
        });
    } else {
      InspectionResultService.Get(this.props.match.params.id)
        .then((res) => {
          this.setState({ inspectionresult: res.data, loading: false }, () => {
            this.employeechange();
          });
          this.changeCheckingQuiz(
            this.state.inspectionresult.orderedOrganizationId
          );
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
  };
  employeechange = () => {
    const { page, search, inspectionresult } = this.state;

    EmployeeService.GetAsSelectList({
      parentOrganizationId: inspectionresult.orderedOrganizationId,
      organizationId: inspectionresult.inspectionOrganizationId,
      inspectionOrganizationId: true,
      sortBy: page.sortBy,
      orderType: page.orderType,
      page: page.page,
      pageSize: page.pageSize,
      search: search,
    }).then((res) => {
      let arrayTemp = [];
      this.setState({ EmployeeList: res.data });
      res.data.rows.map((item) => {
        arrayTemp.push(item.value);
      });

      this.state.inspectionresult.inspectors.map((item, index) => {
        if (arrayTemp.includes(item)) {
        } else {
          this.setState((prevState) => ({
            EmployeeList: {
              ...prevState.EmployeeList,
              rows: [
                ...prevState.EmployeeList.rows,
                {
                  value: item,
                  text: this.state.inspectionresult.inspectorNames[index],
                },
              ],
            },
          }));
        }
      });
    });
  };
  handleChangeInspectionResult = (event, field, data) => {
    // var inspectionresult = this.state.inspectionresult;
    let { EmployeeList, inspectionresult } = this.state;
    let arrayTemp = [];

    if (!!event) {
      if (field === "inspectors") {
        EmployeeList.rows.map((item) => arrayTemp.push(item.value));
        event.map((item) => {
          if (arrayTemp.includes(item.value)) {
          } else {
            this.setState((prevState) => ({
              EmployeeList: {
                ...prevState.EmployeeList,
                rows: [...prevState.EmployeeList.rows, item],
              },
            }));
          }
        });
      }
      inspectionresult[field] = !!event?.target
        ? event.target.value
        : data.value;

      this.setState({ inspectionresult: inspectionresult });
    } else {
      if (field === "inspectors") {
        inspectionresult[field] = [];
      }
      if (field === "docDate" || field === "startDate" || field === "endDate") {
        inspectionresult[field] = "";
      }
      this.setState({ inspectionresult: inspectionresult });
    }
  };

  changeCheckingQuiz = () => {
    CheckingQuizService.GetAsSelectList(
      this.state.inspectionresult.orderedOrganizationId
    ).then((res) => {
      this.setState({ CheckingQuizzesList: res.data });
    });
  };
  sendChange(event, field, data) {
    var send = this.state.send;
    send[field] = !!event.target ? event.target.value : data.value;
    this.setState({ send: send });
    this.state.send.id = this.state.request.id;
  }

  handleChangeInspection = (file, field) => {
    if (file.length > 0) {
      if (!checkFilePdf20mb(file[0], this.props.intl)) {
        return false;
      }
    }
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
  DeleteFile = (data, index, field) => {
    let inspectionresult = this.state.inspectionresult;
    let test;
    if (field == "actFiles") {
      test = inspectionresult.actFiles.filter((item) => item.id !== data.id);
      this.setState((prevState) => ({
        inspectionresult: {
          ...prevState.inspectionresult,
          actFiles: test,
        },
      }));
    }
    if (field == "measuresOfInfluenceFiles") {
      test = inspectionresult.measuresOfInfluenceFiles.filter(
        (item) => item.id !== data.id
      );
      this.setState((prevState) => ({
        inspectionresult: {
          ...prevState.inspectionresult,
          measuresOfInfluenceFiles: test,
        },
      }));
    }
    if (field == "measuresResultFiles") {
      test = inspectionresult.measuresResultFiles.filter(
        (item) => item.id !== data.id
      );
      this.setState((prevState) => ({
        inspectionresult: {
          ...prevState.inspectionresult,
          measuresResultFiles: test,
        },
      }));
    }
    if (field == "cancelledMeasuresFiles") {
      test = inspectionresult.cancelledMeasuresFiles.filter(
        (item) => item.id !== data.id
      );
      this.setState((prevState) => ({
        inspectionresult: {
          ...prevState.inspectionresult,
          cancelledMeasuresFiles: test,
        },
      }));
    }
  };
  // DeleteFile = (item, index, field) => {
  //   if (field == "basic") {
  //     RequestService.DeleteBasicFile(item.id)
  //       .then((res) => {
  //         successToast(t2("DeleteSuccess", this.props.intl));
  //         const { request } = this.state;
  //         request.basicFiles.splice(index, 1);
  //         this.setState({ request: request });
  //       })
  //       .catch((error) => {
  //         errorToast(error.response.data);
  //       });
  //   }
  // };
  check() {
    const { inspectionresult } = this.state;
    // inspectionresult.actFiles;
    if (
      inspectionresult.actFiles === null ||
      inspectionresult.actFiles === 0 ||
      inspectionresult.actFiles === "" ||
      inspectionresult.actFiles === undefined ||
      inspectionresult.actFiles.length === 0
    ) {
      customErrorToast(t2("AktFileNotSelect", this.props.intl));
      return false;
    }

    // for (let i = 0; i < inspectionresult.actFiles.length; i++) {
    //   if (
    //     inspectionresult.actFiles[i].orderTypeId === "" ||
    //     inspectionresult.actFiles[i].orderTypeId === 0 ||
    //     inspectionresult.actFiles[i].orderTypeId === null ||
    //     inspectionresult.actFiles[i].orderTypeId === undefined
    //   ) {
    //     customErrorToast(t2("Akt file not selected", this.props.intl));
    //     return false;
    //   }
    // }

    return true;
  }
  SaveDataInspectionResult = () => {
    if (!this.check()) {
      return false;
    }
    this.setState({ SaveInspectionResultLoading: false });
    if (this.state.inspectionresult.statusId === 2) {
      InspectionResultService.UpdateAfterSent(this.state.inspectionresult)
        .then((res) => {
          this.setState({ SaveInspectionResultLoading: false });
          successToast(t2("SuccessSave", this.props.intl));
          this.props.history.push("/document/viewInspection/" + res.data.id);
          this.props.changeAll({
            sortBy: "",
            orderType: "asc",
            page: 1,
            pageSize: 20,
          });
          setTimeout(() => {}, 500);
        })
        .catch((error) => {
          errorToast(error.response.data);
          this.setState({ SaveInspectionResultLoading: false });
        });
    } else {
      InspectionResultService.Update(this.state.inspectionresult)
        .then((res) => {
          this.setState({ SaveInspectionResultLoading: false });
          successToast(t2("SuccessSave", this.props.intl));
          this.props.history.push("/document/viewInspection/" + res.data.id);
          this.props.changeAll({
            sortBy: "",
            orderType: "asc",
            page: 1,
            pageSize: 20,
          });
          setTimeout(() => {}, 500);
        })
        .catch((error) => {
          errorToast(error.response.data);
          this.setState({ SaveInspectionResultLoading: false });
        });
    }
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

  loadOptions = async (inputText, callback) => {
    const { page, inspectionresult, EmployeeList } = this.state;
    const res = await EmployeeService.GetAsSelectList({
      parentOrganizationId: inspectionresult.orderedOrganizationId,
      organizationId: inspectionresult.inspectionOrganizationId,
      inspectionOrganizationId: true,
      sortBy: page.sortBy,
      orderType: page.orderType,
      page: page.page,
      pageSize: page.pageSize,
      search: inputText,
    });

    callback(
      res.data.rows.map((item) => ({ text: item.text, value: item.value }))
    );
  };
  render() {
    const {
      loading,
      SaveInspectionResultLoading,
      inspectionresult,
      CheckingQuizzesList,
      EmployeeList,
    } = this.state;
    const { history, intl } = this.props;
    //template
    return (
      <Overlay show={loading}>
        <Card className="p-2">
          <Nav tabs>
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
                    <h2> {t1("InspectionResult")} </h2>
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
                    </tbody>
                  </Table>
                </Col>
              </Row>
              <Row>
                {/* <Col sm={12} md={6} lg={3}>
                  <FormGroup>
                    <h5 className="text-bold-600"> {t1("docDate")} </h5>
                    <InputGroup size="md" className="datePicker">
                      <DatePicker
                        dateFormat="dd.MM.yyyy"
                        selected={
                          inspectionresult.docDate
                            ? moment(
                                inspectionresult.docDate,
                                "DD.MM.YYYY"
                              ).toDate()
                            : ""
                        }
                        onChange={(date, dateString) => {
                          this.handleChangeInspectionResult(date, "docDate", {
                            value: moment(new Date(date)).format("DD.MM.YYYY"),
                          });
                        }}
                        isClearable={!!inspectionresult.docDate ? true : false}
                        locale={
                          intl.locale == "ru"
                            ? "ru"
                            : intl.locale == "cl"
                            ? "uzCyrl"
                            : "uz"
                        }
                        placeholderText={t2("docDate", intl)}
                        customInput={
                          <MaskedTextInput
                            type="text"
                            style={{
                              height: "38px",
                              borderRadius: "5px",
                              width: "100%",
                              borderColor: "hsl(0,0%,70%)",
                              padding: "2px 10px 2px 8px",
                              outlineColor: "#1890ff",
                            }}
                            mask={[
                              /\d/,
                              /\d/,
                              ".",
                              /\d/,
                              /\d/,
                              ".",
                              /\d/,
                              /\d/,
                              /\d/,
                              /\d/,
                            ]}
                          />
                        }
                      />
                      <InputGroupAddon addonType="append">
                        <Button color="primary" size="sm">
                          <Icon.Calendar id={"translate"} size={15} />
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                </Col> */}
                <Col sm={12} md={6} lg={3}>
                  <FormGroup>
                    <h5 className="text-bold-600"> {t1("startDateTab4")} </h5>
                    <InputGroup size="md" className="datePicker">
                      <DatePicker
                        dateFormat="dd.MM.yyyy"
                        selected={
                          inspectionresult.startDate
                            ? moment(
                                inspectionresult.startDate,
                                "DD.MM.YYYY"
                              ).toDate()
                            : ""
                        }
                        onChange={(date, dateString) => {
                          this.handleChangeInspectionResult(date, "startDate", {
                            value: moment(new Date(date)).format("DD.MM.YYYY"),
                          });
                        }}
                        isClearable={
                          !!inspectionresult.startDate ? true : false
                        }
                        locale={
                          intl.locale == "ru"
                            ? "ru"
                            : intl.locale == "cl"
                            ? "uzCyrl"
                            : "uz"
                        }
                        disabled={
                          inspectionresult.statusId === 2 ? true : false
                        }
                        placeholderText={t2("docDate", intl)}
                        customInput={
                          <MaskedTextInput
                            type="text"
                            style={{
                              height: "38px",
                              borderRadius: "5px",
                              width: "100%",
                              borderColor: "hsl(0,0%,70%)",
                              padding: "2px 10px 2px 8px",
                              outlineColor: "#1890ff",
                            }}
                            mask={[
                              /\d/,
                              /\d/,
                              ".",
                              /\d/,
                              /\d/,
                              ".",
                              /\d/,
                              /\d/,
                              /\d/,
                              /\d/,
                            ]}
                          />
                        }
                      />
                      <InputGroupAddon addonType="append">
                        <Button color="primary" size="sm">
                          <Icon.Calendar id={"translate"} size={15} />
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                    {/* <DatePicker
                      defaultValue={
                        inspectionresult.startDate
                          ? moment(inspectionresult.startDate, "DD.MM.YYYY")
                          : ""
                      }
                      style={{
                        height: "38px",
                        borderRadius: "5px",
                        width: "100%",
                      }}
                      format={"DD.MM.YYYY"}
                      placeholder={t2("startDateTab4", intl)}
                      locale={locale}
                      onChange={(date) => {
                        this.handleChangeInspectionResult(date, "startDate", {
                          value: moment(new Date(date)).format("DD.MM.YYYY"),
                        });
                      }}
                    /> */}
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={3}>
                  <FormGroup>
                    <h5 className="text-bold-600"> {t1("endDateTab4")} </h5>
                    <InputGroup size="md" className="datePicker">
                      <DatePicker
                        dateFormat="dd.MM.yyyy"
                        selected={
                          inspectionresult.endDate
                            ? moment(
                                inspectionresult.endDate,
                                "DD.MM.YYYY"
                              ).toDate()
                            : ""
                        }
                        onChange={(date, dateString) => {
                          this.handleChangeInspectionResult(date, "endDate", {
                            value: moment(new Date(date)).format("DD.MM.YYYY"),
                          });
                        }}
                        disabled={
                          inspectionresult.statusId === 2 ? true : false
                        }
                        isClearable={!!inspectionresult.endDate ? true : false}
                        locale={
                          intl.locale == "ru"
                            ? "ru"
                            : intl.locale == "cl"
                            ? "uzCyrl"
                            : "uz"
                        }
                        placeholderText={t2("docDate", intl)}
                        customInput={
                          <MaskedTextInput
                            type="text"
                            style={{
                              height: "38px",
                              borderRadius: "5px",
                              width: "100%",
                              borderColor: "hsl(0,0%,70%)",
                              padding: "2px 10px 2px 8px",
                              outlineColor: "#1890ff",
                            }}
                            mask={[
                              /\d/,
                              /\d/,
                              ".",
                              /\d/,
                              /\d/,
                              ".",
                              /\d/,
                              /\d/,
                              /\d/,
                              /\d/,
                            ]}
                          />
                        }
                      />
                      <InputGroupAddon addonType="append">
                        <Button color="primary" size="sm">
                          <Icon.Calendar id={"translate"} size={15} />
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={3}></Col>
                <Col sm={12} md={6} lg={6}>
                  <FormGroup>
                    <h5 className="text-bold-600">{t1("inspectors")}</h5>
                    <AsynSelect
                      className="basic-multi-select"
                      classNamePrefix="select"
                      isMulti
                      placeholder={t2("inspectors", intl)}
                      value={
                        !!inspectionresult.inspectors &&
                        inspectionresult.inspectors.length > 0
                          ? EmployeeList.rows?.filter((item) =>
                              inspectionresult.inspectors.includes(item.value)
                            )
                          : []
                      }
                      defaultValue={
                        !!inspectionresult.inspectors &&
                        inspectionresult.inspectors.length > 0
                          ? EmployeeList.rows?.filter((item) =>
                              inspectionresult.inspectors.includes(item.value)
                            )
                          : []
                      }
                      isDisabled={
                        inspectionresult.statusId === 2 ? true : false
                      }
                      // value={this.state.value}
                      name="color"
                      defaultOptions={EmployeeList.rows}
                      label="text"
                      getOptionLabel={(item) => item.text}
                      loadOptions={this.loadOptions}
                      onChange={(e) => {
                        this.handleChangeInspectionResult(e, "inspectors", {
                          text: e?.length > 0 ? e.map((item) => item.text) : [],
                          value:
                            e?.length > 0 ? e.map((item) => item.value) : [],
                        });
                      }}
                    />
                    {/* <Select
                      className="basic-multi-select"
                      classNamePrefix="select"
                      isMulti
                      placeholder={t2("inspectors", intl)}
                      defaultValue={
                        !!inspectionresult.inspectors &&
                        inspectionresult.inspectors.length > 0
                          ? EmployeeList.rows?.filter((item) =>
                              inspectionresult.inspectors.includes(item.value)
                            )
                          : []
                      }
                      isDisabled={
                        inspectionresult.statusId === 2 ? true : false
                      }
                      // value={this.state.value}
                      name="color"
                      options={EmployeeList.rows}
                      label="text"
                      getOptionLabel={(item) => item.text}
                      onChange={(e) => {
                        this.handleChangeInspectionResult(false, "inspectors", {
                          value:
                            e?.length > 0 ? e.map((item) => item.value) : [],
                        });
                      }}
                    /> */}
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <FormGroup>
                    <h5 className="text-bold-600">
                      {t1("CheckingQuizResultEdit")}
                    </h5>
                    <Select
                      styles={{
                        menu: (provided) => ({ ...provided, zIndex: 2 }),
                      }}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      isMulti
                      placeholder={t2("CheckingQuizResultEdit", intl)}
                      isDisabled={
                        inspectionresult.statusId === 2 ? true : false
                      }
                      defaultValue={
                        !!inspectionresult.checkingQuizzes &&
                        inspectionresult.checkingQuizzes.length > 0
                          ? CheckingQuizzesList?.filter((item) =>
                              inspectionresult.checkingQuizzes.includes(
                                item.value
                              )
                            )
                          : []
                      }
                      name="color"
                      options={CheckingQuizzesList}
                      label="text"
                      getOptionLabel={(item) => item.text}
                      onChange={(e) => {
                        this.handleChangeInspectionResult(
                          false,
                          "checkingQuizzes",
                          {
                            value:
                              e?.length > 0 ? e.map((item) => item.value) : [],
                          }
                        );
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <FormGroup>
                    <h5 className="text-bold-600"> {t1("comment")} </h5>
                    <Input
                      type="textarea"
                      value={inspectionresult.comment || ""}
                      onChange={(e) =>
                        this.handleChangeInspectionResult(e, "comment")
                      }
                      disabled={inspectionresult.statusId === 2 ? true : false}
                      id="comment"
                      placeholder={t2("comment", intl)}
                    />
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <FormGroup>
                    <h5 className="text-bold-600">
                      <span style={{ color: "red" }}>*</span>
                      {t1("actFiles")}
                    </h5>
                    <Row>
                      <Col>
                        <CustomInput
                          accept="application/pdf"
                          id="exampleFile"
                          name="file"
                          type="file"
                          disabled={
                            inspectionresult.statusId === 2 ? true : false
                          }
                          label="Прикрепить файл"
                          dataBrowse="Прикрепить файл"
                          onChange={(e) => {
                            this.handleChangeInspection(
                              e.target.files,
                              "actFiles"
                            );
                          }}
                        />
                      </Col>
                      <Col>
                        {inspectionresult.actFiles?.map((item, index) => (
                          <Badge
                            id="actFiles"
                            color="primary"
                            className="mr-1"
                            key={index}
                          >
                            {item.fileName || item.name}{" "}
                            <Icon.Trash
                              onClick={() =>
                                this.DeleteFile(item, index, "actFiles")
                              }
                              style={{ cursor: "pointer" }}
                              size={15}
                            />{" "}
                            <UncontrolledTooltip
                              placement="top"
                              target="actFiles"
                            >
                              {t1("dateOfCreatedFile")} - {item.dateOfCreated}
                            </UncontrolledTooltip>
                          </Badge>
                        ))}
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <FormGroup>
                    <h5 className="text-bold-600">
                      {" "}
                      {t1("measuresOfInfluence")}{" "}
                    </h5>
                    <Input
                      type="textarea"
                      value={inspectionresult.measuresOfInfluence || ""}
                      onChange={(e) =>
                        this.handleChangeInspectionResult(
                          e,
                          "measuresOfInfluence"
                        )
                      }
                      id="measuresOfInfluence"
                      placeholder={t2("measuresOfInfluence", intl)}
                    />
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <FormGroup>
                    <h5 className="text-bold-600">
                      {t1("measuresOfInfluenceFiles")}
                    </h5>
                    <Row>
                      <Col>
                        <CustomInput
                          accept="application/pdf"
                          id="exampleFile"
                          name="file"
                          type="file"
                          label="Прикрепить файл"
                          dataBrowse="Прикрепить файл"
                          onChange={(e) => {
                            this.handleChangeInspection(
                              e.target.files,
                              "measuresOfInfluenceFiles"
                            );
                          }}
                        />
                      </Col>
                      <Col>
                        {/* <h4 class="d-flex align-items-center">
                          <span style={{ color: "red", marginBottom: "15px" }}>
                            {" "}
                            *{" "}
                          </span>
                          <span> {t1("checkFilePdf20mb")} </span>
                        </h4> */}
                        {inspectionresult.measuresOfInfluenceFiles?.map(
                          (item, index) => (
                            <Badge
                              id="measuresOfInfluenceFiles"
                              color="primary"
                              className="mr-1"
                              key={index}
                            >
                              {item.fileName || item.name}{" "}
                              <Icon.Trash
                                onClick={() =>
                                  this.DeleteFile(
                                    item,
                                    index,
                                    "measuresOfInfluenceFiles"
                                  )
                                }
                                style={{ cursor: "pointer" }}
                                size={15}
                              />{" "}
                              <UncontrolledTooltip
                                placement="top"
                                target="measuresOfInfluenceFiles"
                              >
                                {t1("dateOfCreatedFile")} - {item.dateOfCreated}
                              </UncontrolledTooltip>
                            </Badge>
                          )
                        )}
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <FormGroup>
                    <h5 className="text-bold-600"> {t1("measuresResult")} </h5>
                    <Input
                      type="textarea"
                      value={inspectionresult.measuresResult || ""}
                      onChange={(e) =>
                        this.handleChangeInspectionResult(e, "measuresResult")
                      }
                      id="measuresResult"
                      placeholder={t2("measuresResult", intl)}
                    />
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <FormGroup>
                    <h5 className="text-bold-600">
                      {t1("measuresResultFiles")}
                    </h5>
                    <Row>
                      <Col>
                        <CustomInput
                          accept="application/pdf"
                          id="exampleFile"
                          name="file"
                          type="file"
                          label="Прикрепить файл"
                          dataBrowse="Прикрепить файл"
                          onChange={(e) => {
                            this.handleChangeInspection(
                              e.target.files,
                              "measuresResultFiles"
                            );
                          }}
                        />
                      </Col>
                      <Col>
                        {/* <h4 class="d-flex align-items-center">
                          <span style={{ color: "red", marginBottom: "15px" }}>
                            {" "}
                            *{" "}
                          </span>
                          <span> {t1("checkFilePdf20mb")} </span>
                        </h4> */}
                        {inspectionresult.measuresResultFiles?.map(
                          (item, index) => (
                            <Badge
                              id="measuresResultFiles"
                              color="primary"
                              className="mr-1"
                              key={index}
                            >
                              {item.fileName || item.name}{" "}
                              <Icon.Trash
                                onClick={() =>
                                  this.DeleteFile(
                                    item,
                                    index,
                                    "measuresResultFiles"
                                  )
                                }
                                style={{ cursor: "pointer" }}
                                size={15}
                              />{" "}
                              <UncontrolledTooltip
                                placement="top"
                                target="measuresResultFiles"
                              >
                                {t1("dateOfCreatedFile")} - {item.dateOfCreated}
                              </UncontrolledTooltip>
                            </Badge>
                          )
                        )}
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <FormGroup>
                    <h5 className="text-bold-600">
                      {t1("cancelledMeasures")}{" "}
                    </h5>
                    <Input
                      type="textarea"
                      value={inspectionresult.cancelledMeasures || ""}
                      onChange={(e) =>
                        this.handleChangeInspectionResult(
                          e,
                          "cancelledMeasures"
                        )
                      }
                      id="cancelledMeasures"
                      placeholder={t2("cancelledMeasures", intl)}
                    />
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <FormGroup>
                    <h5 className="text-bold-600">
                      {t1("cancelledMeasuresFiles")}
                    </h5>
                    <Row>
                      <Col>
                        <CustomInput
                          accept="application/pdf"
                          id="exampleFile"
                          name="file"
                          type="file"
                          label="Прикрепить файл"
                          dataBrowse="Прикрепить файл"
                          onChange={(e) => {
                            this.handleChangeInspection(
                              e.target.files,
                              "cancelledMeasuresFiles"
                            );
                          }}
                        />
                      </Col>
                      <Col>
                        {/* <h4 class="d-flex align-items-center">
                          <span style={{ color: "red", marginBottom: "15px" }}>
                            {" "}
                            *{" "}
                          </span>
                          <span> {t1("checkFilePdf20mb")} </span>
                        </h4> */}
                        {inspectionresult.cancelledMeasuresFiles?.map(
                          (item, index) => (
                            <Badge
                              id="cancelledMeasuresFiles"
                              color="primary"
                              className="mr-1"
                              key={index}
                            >
                              {item.fileName || item.name}{" "}
                              <Icon.Trash
                                onClick={() =>
                                  this.DeleteFile(
                                    item,
                                    index,
                                    "cancelledMeasuresFiles"
                                  )
                                }
                                style={{ cursor: "pointer" }}
                                size={15}
                              />{" "}
                              <UncontrolledTooltip
                                placement="top"
                                target="cancelledMeasuresFiles"
                              >
                                {t1("dateOfCreatedFile")} - {item.dateOfCreated}
                              </UncontrolledTooltip>
                            </Badge>
                          )
                        )}
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className="text-right">
                  <Button
                    className="mr-1"
                    color="danger"
                    onClick={() => history.push("/document/inspectionresult")}
                  >
                    {" "}
                    {t1("back")}{" "}
                  </Button>
                  {/* </Col>
                <Col className="text-right"> */}
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
              </Row>
            </TabPane>
          </TabContent>
        </Card>
      </Overlay>
    );
  }
}

// export default injectIntl(EditRequest);

const mapStateToProps = (state) => {
  return {
    values: state.pagination,
  };
};

export default connect(mapStateToProps, {
  changeAll,
})(injectIntl(EditRequest));
