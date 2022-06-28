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
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import { injectIntl } from "react-intl";
import WebaseTable from "../../../components/Webase/components/Table";
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
import "../../../components/Webase/components/heightstyle.css";
registerLocale("uz", uz);
registerLocale("uzCyrl", uzCyrl);
registerLocale("ru", ru);

const { t1, t2 } = Translate;
const { can } = Permission;
const { errorToast, successToast, customErrorToast } = Notification;
class ExcelReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: "",
      endDate: "",
      ParentList: [],
      parentOrganization: {},
      AuthorizedOrganizationList: [],
      authorizedOrganization: {},
      includeDistrict: false,
      data: {},
      loading: false,
      excelLoad: false,
      excelPrintLoad: false,
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
      this.setState({ includeDistrict: false });
    } else if (errors.endDate) {
      customErrorToast(t2("endDateExcelNot", this.props.intl));
      this.setState({ includeDistrict: false });
    }
    // else if (errors.parentOrganization) {
    //   customErrorToast(t2("parentOrganizationExcelNot", this.props.intl));
    // }
  };

  GetExcelReport() {
    this.validation(() => {
      if (
        Object.values(this.state.errors).filter((item) => item == true)
          .length == 0
      ) {
        this.setState({ excelLoad: true });

        const {
          startDate,
          endDate,
          parentOrganization,
          authorizedOrganization,
          includeDistrict,
        } = this.state;
        this.setState({ loading: true });
        ExcelReportService.GetReport1({
          startDate,
          endDate,
          parentOrganizationId: parentOrganization.value,
          authorizedOrganizationId: authorizedOrganization?.value,
          includeDistrict: includeDistrict,
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
    ExcelReportService.Report1AsExcel({
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      parentOrganizationId: this.state.parentOrganization.value,
      authorizedOrganizationId: this.state.authorizedOrganization?.value,
      includeDistrict: this.state.includeDistrict,
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
    link.setAttribute("download", t2("ExcelReport", intl) + "." + "xlsx");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }

  handleChange(event, field, data) {
    var request = {},
      authorizedOrganization = {};
    if (!!event) {
      if (field == "parentOrganization") {
        request.value = !!event.target ? event.target.value : data.value;

        request.text = this.state.ParentList.filter(
          (item) => item.value == data.value
        )[0].text;
        this.setState({ parentOrganization: request });
      }
      if (field == "authorizedOrganizationId") {
        authorizedOrganization.value = !!event.target
          ? event.target.value
          : data.value;

        authorizedOrganization.text =
          this.state.AuthorizedOrganizationList.filter(
            (item) => item.value == data.value
          )[0].text;
        this.setState({
          authorizedOrganization,
        });
      }
    } else {
      if (field === "parentOrganization") {
        request.state = {};
        this.setState({ parentOrganization: request });
      }
      if (field === "authorizedOrganizationId") {
        authorizedOrganization = {};
        this.setState({ authorizedOrganization });
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
      AuthorizedOrganizationList,
      authorizedOrganization,
    } = this.state;
    return (
      <div>
        <Card className="p-2">
          <Row>
            <Col className="text-center">
              <h1 className="pageTextView"> {t1("ExcelReport")}</h1>
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
              <h5>{t1("parentOrganization")}</h5>
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
                options={ParentList}
                label="text"
                getOptionLabel={(item) => item.text}
                onChange={(e) => {
                  this.handleChange(e, "parentOrganization", e);
                  this.GetExcelReport();
                  // this.change();
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
                  this.GetExcelReport();
                  // this.change();
                }}
              />
            </Col>
            <Col md="4">
              <h5>{t1("includeDistrict")}</h5>
              <Form>
                <FormGroup check inline>
                  <input
                    type="checkbox"
                    checked={this.state.includeDistrict}
                    onClick={() => {
                      this.setState((prevState) => ({
                        includeDistrict: !prevState.includeDistrict,
                      }));

                      this.GetExcelReport();
                    }}
                  />
                </FormGroup>
              </Form>
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
          {!!data.regionItems ? (
            <Table responsive className="excel-table">
              <thead
                style={{
                  // position: "sticky",
                  // backgroundColor: "#fff",
                  top: 0,
                  zIndex: 100,
                  textAlign: "center",
                }}
              >
                <tr
                // style={{
                //   color: "white",
                // }}
                >
                  <th colSpan={14}>
                    <h4 className="text-center mb-0">
                      <strong style={{ color: "white" }}>
                        {t1("ExcelReport")} {t1("cRu")} {data.request.startDate}{" "}
                        {t1("poRu")} {data.request.endDate} {t1("toCl")}
                      </strong>
                    </h4>
                  </th>
                </tr>
                <tr
                // style={{
                //   color: "white",
                // }}
                >
                  <th
                    rowSpan={3}
                    style={{
                      verticalAlign: "middle",
                      textAlign: "center",
                      width: "30px",
                    }}
                  >
                    №
                  </th>
                  <th
                    className="org_name"
                    rowSpan={3}
                    style={{
                      verticalAlign: "middle",
                      textAlign: "center",
                    }}
                  >
                    {t1("region")}
                  </th>
                  <th
                    colSpan={3}
                    style={{
                      width: "400px",
                      verticalAlign: "middle",
                    }}
                  >
                    {t1("prewYearExecuted")}
                  </th>
                  <th
                    colSpan={6}
                    style={{
                      width: "800px",
                      verticalAlign: "middle",
                    }}
                  >
                    {t1("thisYearStart")}
                  </th>
                  <th
                    colSpan={3}
                    style={{
                      width: "400px",
                      verticalAlign: "middle",
                    }}
                  >
                    {t1("differenceExecuted")}
                  </th>
                </tr>
                <tr
                // style={{
                //   color: "white",
                // }}
                >
                  <th
                    rowSpan={2}
                    style={{
                      verticalAlign: "middle",
                    }}
                  >
                    {t1("TotalCarriedYear")}
                  </th>
                  <th
                    colSpan={2}
                    style={{
                      verticalAlign: "middle",
                    }}
                  >
                    {t1("Including")}
                  </th>
                  <th
                    rowSpan={2}
                    style={{
                      verticalAlign: "middle",
                    }}
                  >
                    {t1("TotalEnteredISChecks")}
                  </th>
                  <th
                    colSpan={2}
                    style={{
                      verticalAlign: "middle",
                    }}
                  >
                    {t1("Including")}
                  </th>
                  <th
                    rowSpan={2}
                    style={{
                      verticalAlign: "middle",
                    }}
                  >
                    {t1("OfTheseOnly")}
                  </th>
                  <th
                    colSpan={2}
                    style={{
                      verticalAlign: "middle",
                    }}
                  >
                    {t1("Including")}
                  </th>
                  <th
                    rowSpan={2}
                    style={{
                      verticalAlign: "middle",
                    }}
                  >
                    {t1("Total")}
                  </th>
                  <th
                    colSpan={2}
                    style={{
                      verticalAlign: "middle",
                    }}
                  >
                    {t1("Including")}
                  </th>
                </tr>
                <tr
                // style={{
                //   color: "white",
                // }}
                >
                  <th>{t1("checksByNotification")}</th>
                  <th>{t1("agreementWithAuthorizedBody")}</th>
                  <th>{t1("checksByNotification")}</th>
                  <th>{t1("agreementWithAuthorizedBody")}</th>
                  <th>{t1("checksByNotification")}</th>
                  <th>{t1("agreementWithAuthorizedBody")}</th>
                  <th>{t1("checksByNotification")}</th>
                  <th>{t1("agreementWithAuthorizedBody")}</th>
                </tr>
              </thead>
              <tbody>
                {data.regionItems.map((item, idx) => (
                  <>
                    <tr
                      style={{
                        textAlign: "center",
                        backgroundColor:
                          item?.districtItems.length > 0 ? "#c3c3c3" : "#fff",
                      }}
                      key={idx}
                    >
                      <td style={{ fontWeight: "bold" }}>{idx + 1}</td>
                      <td
                        style={{
                          textAlign: "left",
                        }}
                      >
                        {item.region}
                      </td>
                      <td>{item.prewYearExecuted.all}</td>
                      <td>{item.prewYearExecuted.notified}</td>
                      <td>{item.prewYearExecuted.agreed}</td>

                      <td>{item.thisYearAll.all}</td>
                      <td>{item.thisYearAll.notified}</td>
                      <td>{item.thisYearAll.agreed}</td>

                      <td>{item.thisYearExecuted.all}</td>
                      <td>{item.thisYearExecuted.notified}</td>
                      <td>{item.thisYearExecuted.agreed}</td>

                      <td>{item.differenceExecuted.all}</td>
                      <td>{item.differenceExecuted.notified}</td>
                      <td>{item.differenceExecuted.agreed}</td>
                    </tr>
                    {
                      // item?.districtItems.length > 0
                      true
                        ? item?.districtItems.map((district, id) => (
                            // <h1>test</h1>
                            <tr
                              style={{
                                textAlign: "center",
                              }}
                              key={id}
                            >
                              <td>
                                {idx + 1}.{id + 1}
                              </td>
                              <td
                                style={{
                                  textAlign: "left",
                                }}
                              >
                                {district.district}
                              </td>
                              <td>{district.prewYearExecuted.all}</td>
                              <td>{district.prewYearExecuted.notified}</td>
                              <td>{district.prewYearExecuted.agreed}</td>

                              <td>{district.thisYearAll.all}</td>
                              <td>{district.thisYearAll.notified}</td>
                              <td>{district.thisYearAll.agreed}</td>

                              <td>{district.thisYearExecuted.all}</td>
                              <td>{district.thisYearExecuted.notified}</td>
                              <td>{district.thisYearExecuted.agreed}</td>

                              <td>{district.differenceExecuted.all}</td>
                              <td>{district.differenceExecuted.notified}</td>
                              <td>{district.differenceExecuted.agreed}</td>
                            </tr>
                          ))
                        : null
                    }
                  </>
                ))}
                <tr
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  <td></td>
                  <td
                    style={{
                      textAlign: "left",
                    }}
                  >
                    {t1("All")}
                  </td>
                  <td>{data.total.prewYearExecuted.all}</td>
                  <td>{data.total.prewYearExecuted.notified}</td>
                  <td>{data.total.prewYearExecuted.agreed}</td>

                  <td>{data.total.thisYearAll.all}</td>
                  <td>{data.total.thisYearAll.notified}</td>
                  <td>{data.total.thisYearAll.agreed}</td>

                  <td>{data.total.thisYearExecuted.all}</td>
                  <td>{data.total.thisYearExecuted.notified}</td>
                  <td>{data.total.thisYearExecuted.agreed}</td>

                  <td>{data.total.differenceExecuted.all}</td>
                  <td>{data.total.differenceExecuted.notified}</td>
                  <td>{data.total.differenceExecuted.agreed}</td>
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
export default injectIntl(ExcelReport);
