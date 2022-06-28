import React from "react";
import {
  Card,
  Row,
  Col,
  InputGroup,
  Input,
  Button,
  InputGroupAddon,
  ButtonGroup,
  Spinner,
  Collapse,
} from "reactstrap";
import { injectIntl } from "react-intl";
import WebaseTable from "../../../components/Webase/components/Table";
import * as Icon from "react-feather";

import moment from "moment";
import {
  Translate,
  Permission,
  Notification,
} from "../../../components/Webase/functions/index.js";
import InspectionBookService from "../../../services/document/inspectionbook.service";
import Select from "react-select";
import {
  draftStatus,
  processModeratorStatus,
  processCeoStatus,
  sendStatus,
  onTheProcessStatus,
  toAgreeStatus,
  toRejectStatus,
  agreeStatus,
  notAgreeSatus,
  isInspectionBookStatus,
  archiveSatus,
  cancelledStatus,
  completedStatus,
} from "../../../components/Webase/functions/RequestStatus";
import InputMask from "react-input-mask";
import DatePicker, { registerLocale } from "react-datepicker";
import MaskedTextInput from "react-text-mask";
import uz from "date-fns/locale/uz";
import uzCyrl from "date-fns/locale/uz-Cyrl";
import ru from "date-fns/locale/ru";
import date from "../request/date.css";

import { connect } from "react-redux";
import changeAllFilter from "../../../redux/actions/filters/inspectionbookofcontractor";

registerLocale("uz", uz);
registerLocale("uzCyrl", uzCyrl);
registerLocale("ru", ru);

const { t1, t2 } = Translate;
const { can } = Permission;
const { errorToast, successToast } = Notification;
class InspectionResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        contractorInn: {},
        contractor: {},
        docNumber: {},
        docDate: {},
        orderedOrganizationId: {},
        inspectionOrganizationId: {},
        authorizedOrganizationId: {},
        regionId: {},
        checkTypeId: {},
        statusId: {},
        ceoStatusId: {},
        moderatorStatusId: {},
        inspectorStatusId: {},
      },
      toDocDate: "",
      fromDocDate: "",
      collapseID: false,
      statusIds: [7, 13, 14, 17, 18],
      searches: [
        {
          filter: false,
        },
        {
          filter: false,
        },
        {
          filter: false,
        },
        // {
        //   filter: true,
        //   search: () => {
        //     const { StatusList } = this.state;
        //     const { intl } = this.props;
        //     return (
        //       <Select
        //         className="React"
        //         classNamePrefix="select"
        //         value={{
        //           text:
        //             (can("RequestReceive") || can("AllRequestReceive")
        //               ? this.state.filters.moderatorStatusId.text
        //               : can("RequestAgree") || can("AllRequestAgree")
        //               ? this.state.filters.ceoStatusId.text
        //               : can("RequestView") ||
        //                 can("BranchesRequestView") ||
        //                 can("AllRequestView")
        //               ? this.state.filters.inspectorStatusId.text
        //               : this.state.filters.statusId.text) || t2("Choose", intl),
        //         }}
        //         name="color"
        //         options={StatusList}
        //         isClearable
        //         label="text"
        //         getOptionLabel={(item) => item.text}
        //         onChange={(e) => {
        //           this.handleChangeFiltersInfo(
        //             e,
        //             can("RequestReceive") || can("AllRequestReceive")
        //               ? "moderatorStatusId"
        //               : can("RequestAgree") || can("AllRequestAgree")
        //               ? "ceoStatusId"
        //               : can("RequestView") ||
        //                 can("BranchesRequestView") ||
        //                 can("AllRequestView")
        //               ? "inspectorStatusId"
        //               : "statusId",
        //             e
        //           );
        //           this.child.Refresh();
        //         }}
        //       />
        //     );
        //   },
        // },

        {
          filter: true,
          search: () => {
            return (
              <InputGroup size="md">
                <Input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      this.child.props.values.page = 1;
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
              </InputGroup>
            );
          },
        },

        {
          filter: true,
          search: () => {
            return (
              <InputGroup size="md">
                <Input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      this.child.props.values.page = 1;
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
                      this.child.props.values.page = 1;
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
                      this.child.props.values.page = 1;
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
                      this.child.props.values.page = 1;
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
                </InputGroup>
              </>
            );
          },
        },

        {
          filter: true,
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
                  this.child.props.values.page = 1;
                  this.child.Refresh();
                }}
              />
            );
          },
        },
        {
          filter: true,
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
                  this.child.props.values.page = 1;
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
                  this.child.props.values.page = 1;
                  this.child.Refresh();
                }}
              />
            );
          },
        },
        {
          filter: false,
        },
      ],
      fields: [
        {
          key: "id",
          label: t2("№", props.intl),
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

        {
          key: "status",
          label: t2("state", props.intl),
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
          showPnfl: false,
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
          key: "inspectionOrganizationName",
          label: t2("inspectionOrganizationId", props.intl),
          sort: true,
          style: {
            width: "10%",
          },
        },
        {
          key: "orderCode",
          label: t2("orderCode", props.intl),
          sort: true,
          style: {
            width: "10%",
          },
        },
        {
          key: "orderNumber",
          label: t2("orderNumber", props.intl),
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
  componentDidMount() {
    this.setState({ filters: this.props.values });
  }

  handleChange(event, field, data) {
    var filter = this.state.filter;
    filter[field] = !!event.target ? event.target.value : data.value;
    this.setState({ filter: filter });
  }
  handleChangeFiltersInfo(event, field, data) {
    var filters = this.state.filters;
    if (!!event) {
      filters[field].value = !!event.target ? event.target.value : data.value;
      if (
        field === "statusId"
        //  ||
        // field === "ceoStatusId" ||
        // field === "moderatorStatusId" ||
        // field === "inspectorStatusId"
      ) {
        filters[field].matchMode = "equals";
        filters[field].text = data.text;
      } else {
        filters[field].matchMode = "contains";
      }
      this.setState({ filters });
    } else {
      if (
        field === "statusId"
        // ||
        // field === "ceoStatusId" ||
        // field === "moderatorStatusId" ||
        // field === "inspectorStatusId"
      ) {
        filters[field] = {};
      }
      this.setState(filters);
    }
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
        // field === "ceoStatusId" ||
        // field === "moderatorStatusId" ||
        // field === "inspectorStatusId" ||
        field === "docDate"
      ) {
        filters[field].matchMode = "equals";
        filters[field].text = data.text;
      } else {
        filters[field].matchMode = "contains";
      }
      this.setState({ filters });
      this.props.changeAllFilter(filters);
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
      if (
        field === "statusId"
        // ||
        // field === "ceoStatusId" ||
        // field === "moderatorStatusId" ||
        // field === "inspectorStatusId"
      ) {
        filters[field] = {};
      }
      if (field === "authorizedOrganizationId") {
        filters[field] = {};
        filters.authorizedOrganizationId = {};
      }

      if (field === "docDate") {
        filters[field] = {};
      }
      this.setState(filters);
      this.props.changeAllFilter(filters);
    }
  }
  GetExcel() {
    this.setState({ excelLoad: true });
    // InspectionResultService.SaveAsExecel({ filters: this.state.filters })
    //   .then((res) => {
    //     successToast(t2("DownloadSuccess", this.props.intl));
    //     this.forceFileDownload(res);
    // this.setState({ excelLoad: false});
    //
    //   })
    //   .catch((error) => {
    //     errorToast(error.response.data);
    // this.setState({ excelLoad: false});

    //   });
  }
  forceFileDownload(response, name, attachfilename) {
    const { intl } = this.props;
    var blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    // let format = attachfilename.split(".");
    const link = document.createElement("a");
    link.href = url;
    // if (format.length > 0) {
    link.setAttribute(
      "download",
      t2("InspectionBookOfContractor", intl) + "." + "xlsx"
    );
    // }
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
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
      toDocDate,
      fromDocDate,
      searches,
      filters,
      statusIds,
    } = this.state;

    return (
      <div>
        <Card className="p-2">
          <Row>
            <Col className="text-center">
              <h1 className="pageTextView">
                {" "}
                {t1("InspectionBookOfContractor")}{" "}
              </h1>
            </Col>
          </Row>
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
          </Row>
          <Row>
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
          <Row>
            <Col sm={12} md={6} lg={4}></Col>
            <Col sm={12} md={6} lg={8} className="text-right">
              <Button
                className="mr-1"
                color="primary"
                onClick={() => history.go(0)}
              >
                <Icon.RefreshCw size={18} /> {t1("Refresh")}
              </Button>
              {/* <Button color="primary" onClick={() => this.GetExcel()}>
                {this.state.excelLoad ? (
                  <>
                    <Spinner size="sm"></Spinner>
                    {t1("Print")}
                  </>
                ) : (
                  <>
                    <Icon.Printer size={18} /> {t1("Print")}
                  </>
                )}
              </Button> */}
            </Col>
          </Row>
          {/* <Row className="mt-1">
            <Col>
              <ButtonGroup>
                <Button
                  color={statusIds.length === 0 ? "primary" : "outline-primary"}
                  onClick={() =>
                    this.setState(
                      { statusIds: isInspectionBookStatus(), classInitial: "" },
                      () => this.child.Refresh()
                    )
                  }
                >
                  {t1("All")}
                </Button>

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
              </ButtonGroup>
            </Col>
          </Row> */}
          <Row className="mt-2">
            <Col>
              <WebaseTable
                fields={fields}
                filter={filter}
                filters={{
                  filters: this.props.values,
                  toDocDate,
                  fromDocDate,
                  // statusIds,
                }}
                searches={searches}
                api={InspectionBookService}
                childRef={(ref) => (this.child = ref)}
                actions={(id, item) => {
                  return {
                    view: {
                      isView: true,
                      // !!item &&
                      // (!!item.inspectionBookId ||
                      //   !!item.inspectionBookOfContractorId)
                      //   ? true
                      //   : false,
                      router: "/document/viewinspectionbookofcontractor",
                    },
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
// export default injectIntl(InspectionResult);
const mapStateToProps = (state) => {
  return {
    values: state.filters.inspectionbookofcontractor,
  };
};

export default connect(mapStateToProps, {
  changeAllFilter,
})(injectIntl(InspectionResult));
