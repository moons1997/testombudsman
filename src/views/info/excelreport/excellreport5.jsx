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
  Collapse,
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
class ExcelReport5 extends React.Component {
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
      take: { text: "20", value: 20 },
      data: {},
      OptionList: [
        { value: 20, text: "20" },
        { value: 40, text: "40" },
        { value: 60, text: "60" },
        { value: 80, text: "80" },
        { value: 100, text: "100" },
      ],
      collapse: [],
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
      take,
      authorizedOrganization,
    } = this.state;
    this.validation(() => {
      if (
        Object.values(this.state.errors).filter((item) => item == true)
          .length == 0
      ) {
        this.setState({ excelLoad: true });

        this.setState({ loading: true });
        ExcelReportService.GetReport5({
          startDate,
          endDate,
          regionId: parentOrganization.value,
          authorizedOrganizationId: authorizedOrganization?.value,
          take: take?.value,
        })
          .then((res) => {
            // successToast(t1("DeleteSuccess"));
            this.setState({
              data: res.data,
              loading: false,
              excelLoad: false,
            });
            let temp = [];
            res.data.contractors.map((item, idx) => {
              temp.push(false);
              this.setState({
                collapse: temp,
              });
            });

            // state.data.contractors.map((contractor, idx) => ());
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
    ExcelReportService.Report5AsExcel({
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      regionId: this.state.parentOrganization.value,
      authorizedOrganizationId: this.state.authorizedOrganization?.value,
      take: this.state.take?.value,
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
    link.setAttribute("download", t2("ExcelReport5", intl) + "." + "xlsx");
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
      if (field == "take") {
        request.text = this.state.OptionList.filter(
          (item) => item.value == data.value
        )[0].text;
        this.setState({ take: request }, () => {
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
      if (field === "take") {
        request.state = {};
        this.setState({ take: request }, () => {
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
  toggleCollapse = (id) => {
    let { collapse } = this.state;

    collapse.map((item, idx) => (idx === id ? "" : ""));
    this.setState((state) => ({ collapse: !state.collapse }));
  };

  render() {
    const { intl, history } = this.props;
    const {
      startDate,
      endDate,
      parentOrganization,
      ParentList,
      take,
      OptionList,
      data,
      authorizedOrganization,
      AuthorizedOrganizationList,
    } = this.state;
    return (
      <div>
        <Card className="p-2">
          <Row>
            <Col className="text-center">
              <h1 className="pageTextView"> {t1("ExcelReport5")}</h1>
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
            <Col md="3" className="mb-2">
              <h5>{t1("take")}</h5>
              <Select
                className="React"
                styles={{
                  menu: (provided) => ({ ...provided, zIndex: 200 }),
                }}
                classNamePrefix="select"
                defaultValue={{
                  text: take?.value || t2("Choose", intl),
                }}
                value={{
                  text: take?.value || t2("Choose", intl),
                }}
                isClearable
                name="color"
                options={OptionList}
                label="text"
                getOptionLabel={(item) => item.text}
                onChange={(e) => {
                  this.handleChange(e, "take", e);

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

          {!!data.contractors && data?.contractors.length > 0 ? (
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
                  <th colSpan={19}>
                    <h4 className="text-center mb-0">
                      <strong style={{ color: "white" }}>
                        {t1("ExcelReport5")} {t1("cRu")}{" "}
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
                  <td>№</td>
                  <td>{t1("inn")}</td>
                  <td>{t1("contractor")}</td>
                  <td>{t1("docNumber")}</td>
                  <td>{t1("report5CreatedDate")}</td>
                  <td>{t1("Region")}</td>
                  <td>{t1("District")}</td>
                  <td>{t1("InspectionOrganization")}</td>
                </tr>
              </thead>
              <tbody>
                {data?.contractors.map((contractor, idx) => (
                  <>
                    <tr
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        backgroundColor: "rgb(241 239 239)",
                      }}
                      key={idx}
                      onClick={this.toggleCollapse}
                    >
                      <td>{idx + 1}</td>
                      <td>{contractor.innOrPinfl}</td>
                      <td>{contractor.contractor}</td>
                      <td colSpan={2}>{contractor.inspectionsCount}</td>
                      <td>{contractor.region}</td>
                      <td>{contractor.district}</td>
                      <td></td>
                    </tr>
                    {/* <Collapse isOpen={this.state.collapse[idx]}></Collapse> */}

                    {contractor.inspections.length > 0
                      ? contractor.inspections.map((item, id) => (
                          <tr key={`idx` + id}>
                            <td>
                              {idx + 1}.{id + 1}
                            </td>
                            <td>{contractor.innOrPinfl}</td>
                            <td>{contractor.contractor}</td>
                            <td>{item.docNumber}</td>
                            <td>{item.docDate}</td>
                            <td>{contractor.region}</td>
                            <td>{contractor.district}</td>
                            <td>{item.orderedOrganization}</td>
                          </tr>
                        ))
                      : ""}
                  </>
                ))}

                {/* <tr
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                </tr> */}
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
export default injectIntl(ExcelReport5);
