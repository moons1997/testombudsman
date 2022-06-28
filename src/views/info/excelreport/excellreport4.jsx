import React from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  InputGroup,
  InputGroupAddon,
  Table,
  Spinner,
} from "reactstrap";
import { injectIntl } from "react-intl";

import * as Icon from "react-feather";

import {
  Translate,
  Permission,
  Notification,
} from "../../../components/Webase/functions/index.js";
import Select from "react-select";
import moment from "moment";
import "moment/locale/ru";

import OrganizationService from "../../../services/management/organization.service";
import ExcelReportService from "../../../services/reports/ExcelReport.service";

import DatePicker, { registerLocale } from "react-datepicker";
import MaskedTextInput from "react-text-mask";

import uz from "date-fns/locale/uz";
import uzCyrl from "date-fns/locale/uz-Cyrl";
import ru from "date-fns/locale/ru";
import RegionService from "../../../services/info/region.service";
import "../../../components/Webase/components/heightstyle.css";

registerLocale("uz", uz);
registerLocale("uzCyrl", uzCyrl);
registerLocale("ru", ru);

const { t1, t2 } = Translate;
const { can } = Permission;
const { errorToast, successToast, customErrorToast } = Notification;
class ExcelReport4 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: "",
      endDate: "",
      ParentList: [],
      RegionList: [],
      parentOrganization: {},
      AuthorizedOrganizationList: [],
      authorizedOrganization: {},
      data: {},
      loading: false,
      excelLoad: false,
      errors: {
        startDate: null,
        endDate: null,
        // parentOrganization: null,
      },
    };
    this.child = React.createRef();
  }
  componentDidMount() {
    OrganizationService.GetAsSelectList(undefined, undefined, true).then(
      (res) => {
        this.setState({ ParentList: res.data });
      }
    );
    RegionService.GetAsSelectList(211).then((res) => {
      this.setState({ RegionList: res.data });
    });
    OrganizationService.GetAsSelectList(undefined, true, undefined).then(
      (res) => {
        this.setState({ AuthorizedOrganizationList: res.data });
      }
    );
  }

  validation = (callback) => {
    var { startDate, endDate, parentOrganization } = this.state;
    var errors = {
      startDate: !!startDate ? false : true,
      endDate: !!endDate ? false : true,
      // parentOrganization:
      //   Object.keys(parentOrganization).length !== 0 ? false : true,
    };
    this.setState({ errors: errors }, () => callback());
    if (errors.startDate) {
      customErrorToast(t2("startDateExcelNot", this.props.intl));
    } else if (errors.endDate) {
      customErrorToast(t2("endDateExcelNot", this.props.intl));
    }
    // else if (errors.parentOrganization) {
    //   customErrorToast(t2("parentOrganizationExcelNot", this.props.intl));
    // }
  };

  GetExcelReport() {
    const {
      startDate,
      endDate,
      parentOrganization,
      errors,
      authorizedOrganization,
    } = this.state;
    this.validation(() => {
      if (
        Object.values(this.state.errors).filter((item) => item == true)
          .length == 0
      ) {
        this.setState({ excelLoad: true });

        this.setState({ loading: true });
        ExcelReportService.GetReport4({
          startDate,
          endDate,
          regionId: parentOrganization.value,
          authorizedOrganizationId: authorizedOrganization?.value,
        })
          .then((res) => {
            // successToast(t1("DeleteSuccess"));
            this.setState({
              data: res.data,
              loading: false,
              excelLoad: false,
            });
          })
          .catch((error) => {
            errorToast(error.response.data);
            this.setState({ loading: false, excelLoad: false });
          });
      }
    });
  }
  GetExcel() {
    this.setState({ excelPrintLoad: true });
    ExcelReportService.Report4AsExcel({
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      regionId: this.state.parentOrganization.value,
      authorizedOrganizationId: this.state.authorizedOrganization?.value,
    })
      .then((res) => {
        successToast(t2("DownloadSuccess", this.props.intl));
        this.forceFileDownload(res);
        this.setState({ excelPrintLoad: false });
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ excelPrintLoad: false });
      });
  }
  forceFileDownload(response, name, attachfilename) {
    const { intl } = this.props;
    var blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", t2("ExcelReport4", intl) + "." + "xlsx");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }

  handleChange(event, field, data) {
    var request = {},
      authorizedOrganization = {};
    if (!!event) {
      request.value = !!event.target ? event.target.value : data.value;

      if (field == "regionId") {
        request.text = this.state.RegionList.filter(
          (item) => item.value == data.value
        )[0].text;
        this.setState({ parentOrganization: request }, () => {
          this.GetExcelReport();
        });
      }
      if (field == "authorizedOrganizationId") {
        authorizedOrganization.value = !!event.target
          ? event.target.value
          : data.value;

        authorizedOrganization.text =
          this.state.AuthorizedOrganizationList.filter(
            (item) => item.value == data.value
          )[0].text;
        this.setState(
          {
            authorizedOrganization,
          },
          () => {
            this.GetExcelReport();
          }
        );
      }
    } else {
      if (field === "regionId") {
        request.state = {};
        this.setState({ parentOrganization: request }, () => {
          this.GetExcelReport();
        });
      }
      if (field === "authorizedOrganizationId") {
        authorizedOrganization = {};
        this.setState({ authorizedOrganization }, () => {
          this.GetExcelReport();
        });
      }
    }
  }
  handleChangeFilters(event, field, data) {
    var filters = this.state;
    if (!!event) {
      filters[field] = !!event.target ? event.target.value : data.value;
      //   if (field === "startDate" || field === "endDate") {
      //     filters[field].matchMode = "equals";
      //   } else {
      //     filters[field].matchMode = "contains";
      //   }
      this.setState({ filters });
    } else {
      if (field === "startDate" || field === "endDate") {
        filters[field] = "";
        this.setState(filters);
      }
    }
  }

  render() {
    const { intl, history } = this.props;
    const {
      startDate,
      endDate,
      parentOrganization,
      ParentList,
      data,
      authorizedOrganization,
      AuthorizedOrganizationList,
    } = this.state;
    return (
      <div>
        <Card className="p-2">
          <Row>
            <Col className="text-center">
              <h1 className="pageTextView"> {t1("ExcelReport4")}</h1>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md="2">
              <h5>{t1("startDateExcel")}</h5>
              <InputGroup size="md" className="datePicker">
                <DatePicker
                  dateFormat="dd.MM.yyyy"
                  selected={
                    startDate ? moment(startDate, "DD.MM.YYYY").toDate() : ""
                  }
                  onChange={(date, dateString) => {
                    this.handleChangeFilters(date, "startDate", {
                      value: moment(new Date(date)).format("DD.MM.YYYY"),
                    });
                  }}
                  isClearable={!!startDate > 0 ? true : false}
                  locale={
                    intl.locale == "ru"
                      ? "ru"
                      : intl.locale == "cl"
                      ? "uzCyrl"
                      : "uz"
                  }
                  placeholderText={t2("startDateExcel", intl)}
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
                  selectsStart
                  startDate={
                    startDate ? moment(startDate, "DD.MM.YYYY").toDate() : ""
                  }
                  endDate={
                    endDate ? moment(endDate, "DD.MM.YYYY").toDate() : ""
                  }
                />
                <InputGroupAddon addonType="append">
                  <Button color="primary" size="sm">
                    <Icon.Calendar id={"translate"} size={15} />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </Col>
            <Col md="2">
              <h5>{t1("endDateExcel")}</h5>
              <InputGroup size="md" className="datePicker">
                <DatePicker
                  dateFormat="dd.MM.yyyy"
                  selected={
                    endDate ? moment(endDate, "DD.MM.YYYY").toDate() : ""
                  }
                  onChange={(date, dateString) => {
                    this.handleChangeFilters(date, "endDate", {
                      value: moment(new Date(date)).format("DD.MM.YYYY"),
                    });
                  }}
                  isClearable={!!endDate > 0 ? true : false}
                  locale={
                    intl.locale == "ru"
                      ? "ru"
                      : intl.locale == "cl"
                      ? "uzCyrl"
                      : "uz"
                  }
                  placeholderText={t2("endDateExcel", intl)}
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
                  selectsEnd
                  startDate={
                    startDate ? moment(startDate, "DD.MM.YYYY").toDate() : ""
                  }
                  endDate={
                    endDate ? moment(endDate, "DD.MM.YYYY").toDate() : ""
                  }
                  minDate={
                    startDate ? moment(startDate, "DD.MM.YYYY").toDate() : ""
                  }
                />
                <InputGroupAddon addonType="append">
                  <Button color="primary" size="sm">
                    <Icon.Calendar id={"translate"} size={15} />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </Col>

            <Col md="8" className="mb-2">
              <h5>{t1("Region")}</h5>
              <Select
                className="React"
                styles={{
                  menu: (provided) => ({ ...provided, zIndex: 200 }),
                }}
                classNamePrefix="select"
                defaultValue={{
                  text: parentOrganization.text || t2("Choose", intl),
                }}
                value={{
                  text: parentOrganization.text || t2("Choose", intl),
                }}
                isClearable
                name="color"
                options={this.state.RegionList}
                label="text"
                getOptionLabel={(item) => item.text}
                onChange={(e) => {
                  this.handleChange(e, "regionId", e);
                  this.GetExcelReport();
                }}
              />
            </Col>
            <Col md="8" className="mb-2">
              <h5>{t1("authorizedOrganizationId")}</h5>
              <Select
                className="React"
                styles={{
                  menu: (provided) => ({ ...provided, zIndex: 200 }),
                }}
                classNamePrefix="select"
                defaultValue={{
                  text: authorizedOrganization?.text || t2("Choose", intl),
                }}
                value={{
                  text: authorizedOrganization?.text || t2("Choose", intl),
                }}
                isClearable
                name="color"
                options={AuthorizedOrganizationList}
                label="text"
                getOptionLabel={(item) => item.text}
                onChange={(e) => {
                  this.handleChange(e, "authorizedOrganizationId", e);

                  // this.change();
                }}
              />
            </Col>

            <Col md="12" className="text-right">
              <Button
                color="primary"
                onClick={() => this.GetExcelReport()}
                className="mr-2"
              >
                {this.state.excelLoad ? (
                  <>
                    <Spinner size="sm"></Spinner>
                    {t1("ExcelCalc")}
                  </>
                ) : (
                  <>
                    <Icon.Repeat size={14} /> {t1("ExcelCalc")}
                  </>
                )}
              </Button>
              <Button
                color="success"
                className="mr-2"
                onClick={() => this.GetExcel()}
              >
                {this.state.excelPrintLoad ? (
                  <>
                    <Spinner size="sm"></Spinner>
                    {t1("Print")}
                  </>
                ) : (
                  <>
                    <Icon.Printer size={14} /> {t1("Print")}
                  </>
                )}
              </Button>
              <Button color="light" onClick={() => history.go(0)}>
                <Icon.RefreshCcw size={14} /> {t1("Refresh")}
              </Button>
            </Col>
          </Row>

          {data.regionItems?.length > 0 ? (
            <Table responsive className="excel-table">
              <thead
                style={{
                  // position: "sticky",
                  // backgroundColor: "#003E6D",
                  top: 0,
                  zIndex: 100,
                }}
              >
                <tr>
                  <th colSpan={21}>
                    <h4 className="text-center mb-0">
                      <strong style={{ color: "white" }}>
                        {t1("ExcelReport4")} {t1("cRu")}{" "}
                        {data.request.startDate} {t1("poRu")}{" "}
                        {data.request.endDate} {t1("toCl")}
                      </strong>
                    </h4>
                  </th>
                </tr>

                <tr
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    // color: "white",
                  }}
                >
                  <td rowSpan={3}>№</td>
                  <td rowSpan={3}>{t1("parentOrganization")}</td>
                  <td colSpan={7}>{t1("NotifiedExcel")}</td>
                  <td colSpan={9}>{t1("AgreeTypeExcel")}</td>
                  <td rowSpan={3}>{t1("ExecutedExcel")}</td>
                  <td rowSpan={3}>{t1("ViolationsDetectExcel")}</td>
                </tr>
                <tr
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    // color: "white",
                  }}
                >
                  <td rowSpan={2}>{t1("NotifiedAllExcel")}</td>
                  <td rowSpan={2}>{t1("NotifiedExecutedExcel")}</td>
                  <td colSpan={4}>{t1("NotifiedIncludingExcel")}</td>
                  <td rowSpan={2}>{t1("NotifiedViolationsDetectedExcel")}</td>
                  <td rowSpan={2}>{t1("AgreeTypeAllExcel")}</td>
                  <td colSpan={2}>{t1("NotifiedIncludingExcel")}</td>
                  <td rowSpan={2}>{t1("AgreeTypeRejectedExcel")}</td>
                  <td rowSpan={2}>{t1("AgreeAllExcel")}</td>
                  <td rowSpan={2}>{t1("NotifiedExecutedExcel")}</td>
                  <td colSpan={2}>{t1("NotifiedIncludingExcel")}</td>
                  <td rowSpan={2}>{t1("AgreeViolationDetectedExcel")}</td>
                </tr>
                <tr
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    // color: "white",
                  }}
                >
                  <td>{t1("AgreeTypeIncluding1Excel")}</td>
                  <td>{t1("AgreeTypeIncluding2Excel")}</td>
                  <td>{t1("AgreeTypeIncluding3Excel")}</td>
                  <td>{t1("AgreeTypeIncluding4Excel")}</td>
                  <td>{t1("AgreeTypeIncluding1Excel")}</td>
                  <td>{t1("AgreeTypeIncluding2Excel")}</td>
                  <td>{t1("AgreeIncluding1Excel")}</td>
                  <td>{t1("AgreeIncluding2Excel")}</td>
                </tr>
              </thead>
              <tbody>
                {data.regionItems.map((item, idx) => (
                  <tr style={{ textAlign: "center" }}>
                    <td>{idx + 1}</td>
                    <td style={{ textAlign: "left" }}>{item.organization}</td>
                    <td>{item.notified.all}</td>
                    <td>{item.notified.executed}</td>
                    <td>{item.notified.includingOn[0]?.count}</td>
                    <td>{item.notified.includingOn[1]?.count}</td>
                    <td>{item.notified.includingOn[2]?.count}</td>
                    <td>{item.notified.includingOn[3]?.count}</td>
                    <td>{item.notified.violationsDetected}</td>
                    <td>{item.allAgreeType.all}</td>
                    <td>{item.allAgreeType.includingOn[0]?.count}</td>
                    <td>{item.allAgreeType.includingOn[1]?.count}</td>
                    <td>{item.rejected}</td>

                    <td>{item.agreed.all}</td>
                    <td>{item.agreed.executed}</td>
                    <td>{item.agreed.includingOn[0]?.count}</td>
                    <td>{item.agreed.includingOn[1]?.count}</td>
                    <td>{item.agreed.violationsDetected}</td>
                    <td>{item.allExecuted}</td>
                    <td>{item.allViolationsDetected}</td>
                  </tr>
                ))}
                <tr
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  <td></td>
                  <td style={{ textAlign: "left" }}>{t1("All")}</td>
                  <td>{data.total.notified.all}</td>
                  <td>{data.total.notified.executed}</td>
                  <td>{data.total.notified.includingOn[0]?.count}</td>
                  <td>{data.total.notified.includingOn[1]?.count}</td>
                  <td>{data.total.notified.includingOn[2]?.count}</td>
                  <td>{data.total.notified.includingOn[3]?.count}</td>
                  <td>{data.total.notified.violationsDetected}</td>
                  <td>{data.total.allAgreeType.all}</td>
                  <td>{data.total.allAgreeType.includingOn[0]?.count}</td>
                  <td>{data.total.allAgreeType.includingOn[1]?.count}</td>
                  <td>{data.total.rejected}</td>

                  <td>{data.total.agreed.all}</td>
                  <td>{data.total.agreed.executed}</td>
                  <td>{data.total.agreed.includingOn[0]?.count}</td>
                  <td>{data.total.agreed.includingOn[1]?.count}</td>
                  <td>{data.total.agreed.violationsDetected}</td>
                  <td>{data.total.allExecuted}</td>
                  <td>{data.total.allViolationsDetected}</td>
                </tr>
              </tbody>
            </Table>
          ) : (
            ""
          )}
        </Card>
      </div>
    );
  }
}
export default injectIntl(ExcelReport4);
