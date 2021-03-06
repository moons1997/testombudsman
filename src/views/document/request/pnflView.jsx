import React from "react";
import {
  Card,
  Row,
  Col,
  InputGroup,
  Input,
  Button,
  InputGroupAddon,
  FormGroup,
  Collapse,
  ButtonGroup,
  Spinner,
} from "reactstrap";
import Select from "react-select";
import { injectIntl } from "react-intl";
import WebaseTable from "../../../components/Webase/components/Table";
import RequestService from "../../../services/document/request.service";
import * as Icon from "react-feather";
import OrganizationService from "../../../services/management/organization.service";

import moment from "moment";
import {
  Translate,
  Permission,
  Notification,
} from "../../../components/Webase/functions/index.js";
import RegionService from "../../../services/info/region.service";
import ManualService from "../../../services/other/manual.service";
import InputMask from "react-input-mask";
import {
  draftStatus,
  // processModeratorStatus,
  // processCeoStatus,
  // sendStatus,
  // onTheProcessStatus,
  // toAgreeStatus,
  // toRejectStatus,
  agreeStatus,
  notAgreeSatus,
  // archiveSatus,
  cancelledStatus,
  // completedStatus,
} from "../../../components/Webase/functions/RequestStatus";
// import HeightStyle from "./heightstyle.css";
import DatePicker, { registerLocale } from "react-datepicker";
import MaskedTextInput from "react-text-mask";
import uz from "date-fns/locale/uz";
import uzCyrl from "date-fns/locale/uz-Cyrl";
import ru from "date-fns/locale/ru";
import date from "./date.css";

registerLocale("uz", uz);
registerLocale("uzCyrl", uzCyrl);
registerLocale("ru", ru);
const { t1, t2 } = Translate;
const { can } = Permission;
const { errorToast, successToast, customErrorToast } = Notification;
class PnflView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      OrganizationList: [],
      InspectionOrganizationList: [],
      AuthorizedOrganizationLis: [],
      RegionList: [],
      –°heckTypeList: [],
      filters: {
        contractorInn: {
          matchMode: "contains",
          value: this.props.location.state.inn,
        },
        contractor: {},
        docNumber: {},
        docDate: {},
        orderedOrganizationId: {},
        inspectionOrganizationId: {},
        authorizedOrganizationId: {},
        regionId: {},
        checkTypeId: {},
        statusId: {},
      },
      collapseID: false,
      toDocDate: "",
      fromDocDate: "",
      statusIds: [],
      StatusList: [],
      searches: [
        {
          filter: false,
        },
        {
          filter: false,
        },
        {
          filter: false,
          search: () => {
            const { StatusList } = this.state;
            const { intl } = this.props;
            return (
              <Select
                className="React"
                classNamePrefix="select"
                value={{
                  text: this.state.filters.statusId.text || t2("Choose", intl),
                }}
                name="color"
                options={StatusList}
                isClearable
                label="text"
                getOptionLabel={(item) => item.text}
                onChange={(e) => {
                  this.handleChangeFiltersInfo(e, "statusId", e);
                  this.child.Refresh();
                }}
              />
              // <InputGroup size="md">
              //   <Input
              //     onKeyDown={(e) => {
              //       if (e.key === "Enter") {
              //         this.child.Refresh();
              //       }
              //     }}
              //     type="text"
              //     value={this.state.filters.status.value || ""}
              //     onChange={(e) => this.handleChangeFilters(e, "status")}
              //     id="status"
              //     placeholder={t2("state", intl)}
              //   />
              //   <InputGroupAddon addonType="append">
              //     <Button
              //       color="primary"
              //       size="sm"
              //       onClick={() => {
              //         this.child.Refresh();
              //       }}
              //     >
              //       <Icon.Search id={"translate"} size={10} />
              //     </Button>
              //   </InputGroupAddon>
              // </InputGroup>
            );
          },
        },
        {
          filter: false,
          search: () => {
            return (
              <InputGroup size="md">
                <Input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      this.child.Refresh();
                    }
                  }}
                  type="number"
                  value={this.state.filters.contractorInn.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "contractorInn")}
                  id="contractorInn"
                  placeholder={t2("inn", props.intl)}
                  // bsSize="sm"
                />
                {/* <InputMask
                  className="form-control"
                  mask="99999999999999"
                  placeholder={t2("contractorInn", props.intl)}
                  value={this.state.filters.contractorInn.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "contractorInn")}
                /> */}
                {/* <InputGroupAddon addonType="append">
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => {
                      this.child.Refresh();
                    }}
                  >
                    <Icon.Search id={"translate"} size={10} />
                  </Button>
                </InputGroupAddon> */}
              </InputGroup>
            );
          },
        },
        {
          filter: false,
          search: () => {
            return (
              <InputGroup size="md">
                <Input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      this.child.Refresh();
                    }
                  }}
                  type="text"
                  value={this.state.filters.contractor.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "contractor")}
                  id="contractor"
                  placeholder={t2("contractor", props.intl)}
                  // bsSize="sm"
                />
                {/* <InputGroupAddon addonType="append">
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => {
                      this.child.Refresh();
                    }}
                  >
                    <Icon.Search id={"translate"} size={10} />
                  </Button>
                </InputGroupAddon> */}
              </InputGroup>
            );
          },
        },
        {
          filter: true,
          search: () => {
            return (
              <InputGroup size="md">
                <InputMask
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      this.child.Refresh();
                    }
                  }}
                  className="form-control"
                  mask="999-999-999"
                  placeholder={t2("docNumber", props.intl)}
                  value={this.state.filters.docNumber.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "docNumber")}
                />
                <InputGroupAddon addonType="append">
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => {
                      this.child.Refresh();
                    }}
                  >
                    <Icon.Search id={"translate"} size={10} />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            );
          },
        },
        {
          filter: true,
          search: () => {
            const { intl } = this.props;

            return (
              <>
                {/* className="datePicker" */}
                <InputGroup size="md">
                  <DatePicker
                    dateFormat="dd.MM.yyyy"
                    selected={
                      this.state.filters.docDate.value
                        ? moment(
                            this.state.filters.docDate.value,
                            "DD.MM.YYYY"
                          ).toDate()
                        : ""
                    }
                    onChange={(date, dateString) => {
                      this.handleChangeFilters(date, "docDate", {
                        value: moment(new Date(date)).format("DD.MM.YYYY"),
                      });
                      this.child.Refresh();
                    }}
                    isClearable={
                      !!this.state.filters.docDate.value ? true : false
                    }
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
                  {/* <InputGroupAddon addonType="append">
                    <Button color="primary" size="sm" >
                      <Icon.Calendar id={"translate"} size={15} />
                    </Button>
                  </InputGroupAddon> */}
                </InputGroup>
              </>
            );
          },
        },

        {
          filter: false,
          search: () => {
            const { OrganizationList } = this.state;
            const { intl } = this.props;
            return (
              <Select
                className="React"
                classNamePrefix="select"
                value={{
                  text:
                    this.state.filters.orderedOrganizationId.text ||
                    t2("Choose", intl),
                }}
                name="color"
                options={OrganizationList}
                isClearable
                label="text"
                getOptionLabel={(item) => item.text}
                onChange={(e) => {
                  this.handleChangeFilters(e, "orderedOrganizationId", e);
                  this.child.Refresh();
                }}
              />
            );
          },
        },
        {
          filter: false,
          search: () => {
            const { InspectionOrganizationList } = this.state;
            const { intl } = this.props;
            return (
              <Select
                className="React"
                classNamePrefix="select"
                value={{
                  text:
                    this.state.filters.inspectionOrganizationId.text ||
                    t2("Choose", intl),
                }}
                name="color"
                options={InspectionOrganizationList}
                isClearable
                label="text"
                getOptionLabel={(item) => item.text}
                onChange={(e) => {
                  this.handleChangeFilters(e, "inspectionOrganizationId", e);
                  this.child.Refresh();
                }}
              />
            );
          },
        },
        {
          filter: false,
          search: () => {
            const { AuthorizedOrganizationList } = this.state;
            const { intl } = this.props;
            return (
              <Select
                className="React"
                classNamePrefix="select"
                value={{
                  text:
                    this.state.filters.authorizedOrganizationId.text ||
                    t2("Choose", intl),
                }}
                name="color"
                options={AuthorizedOrganizationList}
                isClearable
                label="text"
                getOptionLabel={(item) => item.text}
                onChange={(e) => {
                  this.handleChangeFilters(e, "authorizedOrganizationId", e);
                  this.child.Refresh();
                }}
              />
            );
          },
        },
        {
          filter: false,
          search: () => {
            const { RegionList } = this.state;
            const { intl } = this.props;
            return (
              <Select
                className="React"
                classNamePrefix="select"
                value={{
                  text: this.state.filters.regionId.text || t2("region", intl),
                }}
                name="color"
                options={RegionList}
                isClearable
                label="text"
                getOptionLabel={(item) => item.text}
                onChange={(e) => {
                  this.handleChangeFilters(e, "regionId", e);
                  this.child.Refresh();
                }}
              />
            );
          },
        },

        {
          filter: false,
          search: () => {
            const { –°heckTypeList } = this.state;
            const { intl } = this.props;
            return (
              <Select
                className="React"
                classNamePrefix="select"
                value={{
                  text:
                    this.state.filters.checkTypeId.text || t2("Choose", intl),
                }}
                name="color"
                options={–°heckTypeList}
                isClearable
                label="text"
                getOptionLabel={(item) => item.text}
                onChange={(e) => {
                  this.handleChangeFilters(e, "checkTypeId", e);
                  this.child.Refresh();
                }}
              />
            );
          },
        },
      ],
      fields: [
        {
          key: "idNomer",
          label: t2("‚ĄĖ", props.intl),
          sort: false,
          style: {
            width: "4%",
          },
        },
        {
          key: "actions",
          label: t2("actions", props.intl),
          style: {
            width: "4%",
          },
        },
        // {
        //   key: "id",
        //   label: t2("ID", props.intl),
        //   sort: true,
        // },
        {
          key: "status",
          label: t2("state", props.intl),
          statusSort:
            can("RequestReceive") || can("AllRequestReceive")
              ? "moderatorStatus"
              : can("RequestAgree") || can("AllRequestAgree")
              ? "ceoStatus"
              : can("RequestView") ||
                can("BranchesRequestView") ||
                can("AllRequestView")
              ? "inspectorStatus"
              : "status",
          sort: true,
          badge: true,
          style: {
            width: "7%",
          },
        },
        {
          key: "contractorInn",
          label: t2("inn", props.intl),
          sort: true,
          style: {
            width: "5%",
          },
        },
        {
          key: "contractor",
          label: t2("contractor", props.intl),
          sort: true,
          style: {
            width: "10%",
          },
        },
        {
          key: "docNumber",
          label: t2("docNumber", props.intl),
          sort: true,
          style: {
            width: "8%",
          },
        },
        {
          key: "docDate",
          label: t2("docDate", props.intl),
          sort: true,
          style: {
            width: "7%",
          },
        },
        {
          key: "orderedOrganization",
          label: t2("orderedOrganizationId", props.intl),
          sort: true,
          style: {
            width: "10%",
          },
        },
        {
          key: "inspectionOrganization",
          label: t2("inspectionOrganizationId", props.intl),
          sort: true,
          style: {
            width: "10%",
          },
        },
        {
          key: "authorizedOrganization",
          label: t2("authorizedOrganizationId", props.intl),
          sort: true,
          style: {
            width: "10%",
          },
        },
        {
          key: "region",
          label: t2("Region", props.intl),
          sort: true,
          style: {
            width: "10%",
          },
        },
        {
          key: "checkType",
          label: t2("checkTypeId", props.intl),
          sort: true,
          style: {
            width: "10%",
          },
        },
      ],
      filter: {
        search: "",
      },
      excelLoad: false,
    };
    this.child = React.createRef();
  }

  onChangeDate(date, dateString) {}
  handleChangeFiltersInfo(event, field, data) {
    var filters = this.state.filters;
    if (!!event) {
      filters[field].value = !!event.target ? event.target.value : data.value;
      if (field === "statusId") {
        filters[field].matchMode = "equals";
        filters[field].text = data.text;
      } else {
        filters[field].matchMode = "contains";
      }
      this.setState({ filters });
    } else {
      if (field === "statusId") {
        filters[field] = {};
      }
      this.setState(filters);
    }
  }
  handleChangeFilters(event, field, data) {
    var filters = this.state.filters;
    if (!!event) {
      filters[field].value = !!event.target ? event.target.value : data.value;
      if (field === "orderedOrganizationId") {
        filters[field].matchMode = "equals";
        filters[field].text = data.text;
        this.changeOrderedOrg(data.value);
        this.changeAuthorizedOrganization(data.value);
      } else if (
        field === "inspectionOrganizationId" ||
        field === "authorizedOrganizationId" ||
        field === "statusId" ||
        field === "regionId" ||
        field === "checkTypeId" ||
        field === "docDate"
      ) {
        filters[field].matchMode = "equals";
        filters[field].text = data.text;
      } else {
        filters[field].matchMode = "contains";
      }
      this.setState({ filters });
    } else {
      if (field === "orderedOrganizationId") {
        filters[field] = {};
        filters.inspectionOrganizationId = {};
        filters.authorizedOrganizationId = {};
        this.setState({ AuthorizedOrganizationList: [] });
      }
      if (field === "inspectionOrganizationId") {
        filters[field] = {};
      }
      if (field === "statusId") {
        filters[field] = {};
      }
      if (field === "authorizedOrganizationId") {
        filters[field] = {};
        filters.authorizedOrganizationId = {};
      }
      if (field === "regionId") {
        filters[field] = {};
      }
      if (field === "checkTypeId") {
        filters[field] = {};
      }
      if (field === "docDate") {
        filters[field] = {};
      }
      this.setState(filters);
    }
  }
  componentDidMount() {
    OrganizationService.GetAsSelectList(null).then((res) => {
      this.setState({ OrganizationList: res.data });
    });
    RegionService.GetAsSelectList(211).then((res) => {
      this.setState({ RegionList: res.data });
    });
    ManualService.CheckTypeSelectList().then((res) => {
      this.setState({ –°heckTypeList: res.data });
    });
    ManualService.StatusSelectList().then((res) => {
      this.setState({ StatusList: res.data });
    });
  }
  // funButtonInn() {
  //   if (
  //     this.state.filters.contractorInn.value.length == 9 ||
  //     this.state.filters.contractorInn.value.length == 14
  //   ) {
  //     this.child.Refresh();
  //   } else {
  //     customErrorToast(t2("NotEnteredCorrectly", this.props.intl));
  //   }
  // }
  changeOrderedOrg = (id) => {
    OrganizationService.GetAsSelectList(id, false, true).then((res) => {
      this.setState({ InspectionOrganizationList: res.data });
    });
  };
  changeAuthorizedOrganization = (id) => {
    OrganizationService.GetAsSelectList(id, true, false).then((res) => {
      this.setState({ AuthorizedOrganizationList: res.data });
    });
  };
  GetExcel() {
    this.setState({ excelLoad: true });
    RequestService.SaveAsExecel({ filters: this.state.filters })
      .then((res) => {
        successToast(t2("DownloadSuccess", this.props.intl));
        this.forceFileDownload(res);
        this.setState({ excelLoad: false });
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ excelLoad: false });
      });
  }
  forceFileDownload(response, name, attachfilename) {
    var blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    // let format = attachfilename.split(".");
    const link = document.createElement("a");
    link.href = url;
    // if (format.length > 0) {
    link.setAttribute("download", "–ü—Ä–ĺ–≤–Ķ—Ä–ļ–ł" + "." + "xlsx");
    // }
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }
  handleChange(event, field, data) {
    var filter = this.state.filter;
    filter[field] = !!event.target ? event.target.value : data.value;
    this.setState({ filter: filter });
  }
  handleChangeFilDate(event, field, data) {
    if (!!event) {
      if (field === "fromDocDate") {
        this.setState(
          {
            fromDocDate: !!event?.target ? event.target.value : data.value,
          },
          () => {
            this.child.state.page.page = 1;
            this.child.Refresh();
          }
        );
      }
      if (field === "toDocDate") {
        this.setState(
          {
            toDocDate: !!event?.target ? event.target.value : data.value,
          },
          () => {
            this.child.state.page.page = 1;
            this.child.Refresh();
          }
        );
      }
    } else {
      // alert("test");
      if (field === "fromDocDate") {
        this.setState(
          (prevState) => ({
            fromDocDate: "",
            filter: { ...prevState.filter, fromDocDate: "", filters: null },
          }),
          () => {
            this.child.state.page.page = 1;
            this.child.Refresh();
          }
        );
      }
      if (field === "toDocDate") {
        this.setState(
          {
            toDocDate: "",
          },
          () => {
            this.child.state.page.page = 1;
            this.child.Refresh();
          }
        );
      }
    }
  }

  checkColor(arr1, arr2) {
    return (
      arr1.length === arr2.length &&
      arr1.every((value, index) => value === arr2[index])
    );
  }
  render() {
    const { intl, history } = this.props;
    const {
      fields,
      filter,
      collapseID,
      searches,
      filters,
      toDocDate,
      fromDocDate,
      statusIds,
    } = this.state;
    return (
      <div>
        <Card className="p-2">
          <Row>
            <Col sm={12} md={6} lg={3}>
              <Button
                color="info"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  this.setState((prevState) => ({
                    collapseID: !prevState.collapseID,
                  }))
                }
              >
                <Icon.Filter size={15} /> {t1("filter")}
              </Button>
            </Col>
            <Col sm={12} md={6} lg={6} className="text-center">
              <h1 className="text-success">
                {t1("inn")} - {this.props.location.state.inn}{" "}
              </h1>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col sm={12} md={6} lg={4}>
              {/* <InputGroup>
                <Input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      this.child.Refresh();
                    }
                  }}
                  placeholder={t2("Search", intl)}
                  onChange={(e) => this.handleChange(e, "search")}
                />
                <InputGroupAddon addonType="append">
                  <Button
                    color="primary"
                    onClick={() => {
                      this.child.state.page.page = 1;
                      this.child.Refresh();
                    }}
                  >
                    {" "}
                    <Icon.Search size={14} /> {t1("Search")}{" "}
                  </Button>
                </InputGroupAddon>
              </InputGroup> */}
            </Col>
            <Col sm={12} md={4} lg={4}></Col>
            <Col sm={12} md={6} lg={4} className="text-right">
              <Button
                className="mr-1"
                color="primary"
                onClick={() => history.go(0)}
              >
                <Icon.RefreshCw size={18} /> {t1("Refresh")}
              </Button>
              <Button
                color="primary"
                className="mr-2"
                onClick={() => this.GetExcel()}
              >
                {this.state.excelLoad ? (
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
              <Button color="danger" onClick={() => history.goBack()}>
                {/* {" "}
                <Icon.ArrowDownLeft size={18} /> */}
                {t1("back")}{" "}
              </Button>
              {/* {can("RequestCreate") ||
              can("BranchesRequestCreate") ||
              can("AllRequestCreate") ? (
                <Button
                  color="primary"
                  onClick={() => history.push(`/document/editrequest/0`)}
                >
                  {" "}
                  <Icon.Plus size={18} /> {t1("Create")}{" "}
                </Button>
              ) : (
                ""
              )} */}
            </Col>
            <Col sm={12} md={12} lg={12}>
              <div>
                <Collapse isOpen={collapseID}>
                  <Row>
                    <Col sm={4} md={4} lg={3}>
                      <InputGroup size="md" className="datePicker">
                        <DatePicker
                          dateFormat="dd.MM.yyyy"
                          selected={
                            fromDocDate
                              ? moment(fromDocDate, "DD.MM.YYYY").toDate()
                              : ""
                          }
                          onChange={(date) => {
                            this.handleChangeFilDate(date, "fromDocDate", {
                              value: moment(new Date(date)).format(
                                "DD.MM.YYYY"
                              ),
                            });
                          }}
                          isClearable={!!fromDocDate ? true : false}
                          locale={
                            intl.locale == "ru"
                              ? "ru"
                              : intl.locale == "cl"
                              ? "uzCyrl"
                              : "uz"
                          }
                          placeholderText={t2("fromDocDate", intl)}
                          selectsStart
                          startDate={
                            fromDocDate
                              ? moment(fromDocDate, "DD.MM.YYYY").toDate()
                              : ""
                          }
                          endDate={
                            toDocDate
                              ? moment(toDocDate, "DD.MM.YYYY").toDate()
                              : ""
                          }
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
                        allowClear={true}
                        defaultValue={
                          fromDocDate ? moment(fromDocDate, "DD.MM.YYYY") : ""
                        }
                        style={{
                          height: "38px",
                          borderRadius: "5px",
                          width: "100%",
                        }}
                        format="DD.MM.YYYY"
                        placeholder={t2("fromDocDate", intl)}
                        locale={locale}
                        onChange={(date) => {
                          this.handleChangeFilDate(date, "fromDocDate", {
                            value: moment(new Date(date)).format("DD.MM.YYYY"),
                          });
                          this.child.state.page.page = 1;
                          this.child.Refresh();
                        }}
                      /> */}
                    </Col>
                    <Col sm={4} md={4} lg={3}>
                      <InputGroup size="md" className="datePicker">
                        <DatePicker
                          dateFormat="dd.MM.yyyy"
                          selected={
                            toDocDate
                              ? moment(toDocDate, "DD.MM.YYYY").toDate()
                              : ""
                          }
                          onChange={(date, dateString) => {
                            this.handleChangeFilDate(date, "toDocDate", {
                              value: moment(new Date(date)).format(
                                "DD.MM.YYYY"
                              ),
                            });
                            // this.child.Refresh();
                          }}
                          isClearable={!!toDocDate ? true : false}
                          locale={
                            intl.locale == "ru"
                              ? "ru"
                              : intl.locale == "cl"
                              ? "uzCyrl"
                              : "uz"
                          }
                          placeholderText={t2("toDocDate", intl)}
                          selectsEnd
                          startDate={
                            fromDocDate
                              ? moment(fromDocDate, "DD.MM.YYYY").toDate()
                              : ""
                          }
                          endDate={
                            toDocDate
                              ? moment(toDocDate, "DD.MM.YYYY").toDate()
                              : ""
                          }
                          minDate={
                            fromDocDate
                              ? moment(fromDocDate, "DD.MM.YYYY").toDate()
                              : ""
                          }
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
                          toDocDate ? moment(toDocDate, "DD.MM.YYYY") : ""
                        }
                        style={{
                          height: "38px",
                          borderRadius: "5px",
                          width: "100%",
                        }}
                        format={"DD.MM.YYYY"}
                        placeholder={t2("toDocDate", intl)}
                        locale={locale}
                        onChange={(date) => {
                          this.handleChangeFilDate(date, "toDocDate", {
                            value: moment(new Date(date)).format("DD.MM.YYYY"),
                          });
                          this.child.state.page.page = 1;
                          this.child.Refresh();
                        }}
                        disabledDate={
                          (current) =>
                            !current ||
                            current.isBefore(moment(fromDocDate, "DD.MM.YYYY"))
                        }
                      /> */}
                    </Col>
                  </Row>
                </Collapse>
              </div>
            </Col>
          </Row>
          <Row className="mt-1">
            <Col>
              <ButtonGroup>
                <Button
                  color={statusIds.length === 0 ? "primary" : "outline-primary"}
                  onClick={() =>
                    this.setState({ statusIds: [], classInitial: "" }, () =>
                      this.child.Refresh()
                    )
                  }
                >
                  {t1("All")}
                </Button>

                {can("RequestCreate") ? (
                  <Button
                    color={
                      this.checkColor(statusIds, draftStatus())
                        ? "primary"
                        : "outline-primary"
                    }
                    onClick={() =>
                      this.setState(
                        { statusIds: draftStatus(), classInitial: "" },
                        () => this.child.Refresh()
                      )
                    }
                  >
                    {t1("Draft")}
                  </Button>
                ) : (
                  ""
                )}
                {/* <Button
                      color={
                        this.checkColor(statusIds, sendStatus())
                          ? "primary"
                          : "outline-primary"
                      }
                      onClick={() => {
                        this.setState(
                          { statusIds: sendStatus(), classInitial: "" },
                          () => this.child.Refresh()
                        );
                      }}
                    >
                      {t1("Sendding")}
                    </Button>
                    <Button
                      color={
                        this.checkColor(statusIds, onTheProcessStatus())
                          ? "primary"
                          : "outline-primary"
                      }
                      onClick={() => {
                        this.setState(
                          { statusIds: onTheProcessStatus(), classInitial: "" },
                          () => this.child.Refresh()
                        );
                      }}
                    >
                      {t1("OnTheProcess")}
                    </Button> */}
                <Button
                  color={
                    this.checkColor(statusIds, agreeStatus())
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() => {
                    this.setState(
                      { statusIds: agreeStatus(), classInitial: "" },
                      () => this.child.Refresh()
                    );
                  }}
                >
                  {t1("AgreeMenu")}
                </Button>
                <Button
                  color={
                    this.checkColor(statusIds, notAgreeSatus()) &&
                    filters.checkTypeId.value === 1
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() => {
                    let fil = filters;
                    fil["checkTypeId"].value = 1;
                    fil["checkTypeId"].matchMode = "equals";

                    this.setState(
                      {
                        statusIds: notAgreeSatus(),
                        filters: fil,
                        classInitial: "",
                      },
                      () => this.child.Refresh()
                    );
                  }}
                >
                  {t1("NotAgree")}
                </Button>
                <Button
                  color={
                    this.checkColor(statusIds, cancelledStatus())
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() => {
                    this.setState(
                      { statusIds: cancelledStatus(), classInitial: "" },
                      () => this.child.Refresh()
                    );
                  }}
                >
                  {t1("Cancelled")}
                </Button>
                {/* <Button
                      color={
                        filters.checkTypeId.value === 2 &&
                        this.state.classInitial === "NotificatioN"
                          ? "primary"
                          : "outline-primary"
                      }
                      onClick={(e) => {
                        let fil = filters;
                        fil["checkTypeId"].value = 2;
                        fil["checkTypeId"].matchMode = "equals";

                        this.setState(
                          {
                            filters: fil,
                            classInitial: "NotificatioN",
                            statusIds: [],
                          },
                          () => this.child.Refresh()
                        );
                      }}
                    >
                      {t1("NotificatioN")}
                    </Button>
                    <Button
                      color={
                        this.checkColor(statusIds, archiveSatus())
                          ? "primary"
                          : "outline-primary"
                      }
                      onClick={() => {
                        this.setState(
                          { statusIds: archiveSatus(), classInitial: "" },
                          () => this.child.Refresh()
                        );
                      }}
                    >
                      {t1("Archived")}
                    </Button>
                    <Button
                      color={
                        this.checkColor(statusIds, cancelledStatus())
                          ? "primary"
                          : "outline-primary"
                      }
                      onClick={() => {
                        this.setState(
                          { statusIds: cancelledStatus(), classInitial: "" },
                          () => this.child.Refresh()
                        );
                      }}
                    >
                      {t1("Cancelled")}
                    </Button> */}
                {/* <Button
                  color={statusIds[0] === 2 ? "primary" : "outline-primary"}
                  onClick={() => {
                    this.setState({ statusIds: [2, 3] }, () =>
                      this.child.Refresh()
                    );
                  }}
                >
                  {t1("status13")}
                </Button> */}
                {/* <Button
                      color={
                        this.checkColor(statusIds, completedStatus())
                          ? "primary"
                          : "outline-primary"
                      }
                      onClick={() => {
                        this.setState({ statusIds: completedStatus() }, () =>
                          this.child.Refresh()
                        );
                      }}
                    >
                      {t1("Completed")}
                    </Button> */}

                {/* {can("AllRequestView") ||
                can("BranchesRequestView") ||
                can("AllRequestView") ? (
                  <></>
                ) : null} */}

                {/* <Button
                  color={
                    this.checkColor(statusIds, processCeoStatus())
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() => {
                    this.setState(
                      { statusIds: processCeoStatus(), classInitial: "" },
                      () => this.child.Refresh()
                    );
                  }}
                >
                  {t1("ProcessCEO")}
                </Button>
                <Button
                  color={
                    this.checkColor(statusIds, processModeratorStatus())
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() => {
                    this.setState(
                      { statusIds: processModeratorStatus(), classInitial: "" },
                      () => this.child.Refresh()
                    );
                  }}
                >
                  {t1("ProcessModerator")}
                </Button>

                <Button
                  color={
                    this.checkColor(statusIds, toAgreeStatus())
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() => {
                    this.setState(
                      { statusIds: toAgreeStatus(), classInitial: "" },
                      () => this.child.Refresh()
                    );
                  }}
                >
                  {t1("ToAgree")}
                </Button>
                <Button
                  color={
                    this.checkColor(statusIds, toRejectStatus())
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() => {
                    this.setState(
                      { statusIds: toRejectStatus(), classInitial: "" },
                      () => this.child.Refresh()
                    );
                  }}
                >
                  {t1("ToReject")}
                </Button> */}

                {/* <Button
                  color={ this.checkColor(statusIds, agreeStatus()) ? "primary" : "outline-primary"}
                  onClick={() => {
                    this.setState({ statusIds: toRejectStatus(),classInitial:"" }, () =>
                      this.child.Refresh()
                    );
                  }}
                >
                  {t1("Marked")}
                </Button> */}
              </ButtonGroup>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <WebaseTable
                fields={fields}
                filter={filter}
                searches={searches}
                api={RequestService}
                filters={{
                  filters: filters,
                  toDocDate,
                  fromDocDate,
                  statusIds,
                }}
                width={false}
                childRef={(ref) => (this.child = ref)}
                actions={(id) => {
                  return {
                    view: {
                      isView: true,
                      router: "/document/viewrequest",
                    },
                    edit: {
                      isView:
                        (can("RequestView") ||
                          can("BranchesRequestView") ||
                          can("AllRequestView") ||
                          can("RequestReceive") ||
                          can("AllRequestReceive") ||
                          can("RequestAgree") ||
                          can("AllRequestAgree")) &&
                        (id === 1 || id === 12),
                      router: "/document/editrequest",
                    },

                    // delete: {
                    //   isView: can("RequestDelete"),
                    // },
                    // send: {
                    //   isView: can("RequestSend"),
                    // },
                    // revoke: {
                    //   isView: can("RequestSend"),
                    // },
                    // receive: {
                    //   isView: can("RequestReceive"),
                    // },
                    // refuseByModerator: {
                    //   isView: can("RequestReceive"),
                    // },
                    // toApprove: {
                    //   isView: can("RequestReceive"),
                    // },
                    // returnToModerator: {
                    //   isView: can("RequestAgree"),
                    // },
                    // reject: {
                    //   isView: can("RequestAgree"),
                    // },
                    // agree: {
                    //   isView: can("RequestAgree"),
                    // },
                    // cancelAgreement: {
                    //   isView: can("RequestAgree"),
                    // },
                    // archive: {
                    //   isView: can("RequestArchive"),
                    // },
                  };
                }}
              />
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
export default injectIntl(PnflView);
