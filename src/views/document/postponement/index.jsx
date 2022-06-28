import React from "react";
import {
  Card,
  Row,
  Col,
  InputGroup,
  Input,
  Button,
  ButtonGroup,
  InputGroupAddon,
  Spinner,
} from "reactstrap";
import { injectIntl } from "react-intl";
import Select from "react-select";
import moment from "moment";
import WebaseTable from "../../../components/Webase/components/Table";
import RequestPostponementService from "../../../services/document/requestpostponement.service";
import * as Icon from "react-feather";

// import { DatePicker } from "antd";
import "moment/locale/ru";

import {
  Translate,
  Permission,
  Notification,
} from "../../../components/Webase/functions/index.js";
import {
  draftStatus,
  processModeratorStatus,
  processCeoStatus,
  sendStatus,
  onTheProcessStatus,
  toAgreeStatus,
  toRejectStatus,
  agreeStatus,
  archiveSatus,
  newCeoStatus,
  cancelledStatus,
  notAgreeSatus,
  completedStatus,
} from "../../../components/Webase/functions/RequestStatus";
import InputMask from "react-input-mask";
import DatePicker, { registerLocale } from "react-datepicker";
import MaskedTextInput from "react-text-mask";
import uz from "date-fns/locale/uz";
import uzCyrl from "date-fns/locale/uz-Cyrl";
import ru from "date-fns/locale/ru";

import { connect } from "react-redux";
import changeAllFilter, {
  statusIds,
} from "../../../redux/actions/filters/postponoment";
import OrganizationService from "../../../services/management/organization.service";

registerLocale("uz", uz);
registerLocale("uzCyrl", uzCyrl);
registerLocale("ru", ru);
const { t1, t2 } = Translate;
const { can } = Permission;
const { errorToast, successToast } = Notification;
class RequestPostponement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      OrganizationList: [],
      InspectionOrganizationList: [],
      AuthorizedOrganizationList: [],
      filters: {
        requestDocNumber: {},
        endDate: {},
        startDate: {},
        docDate: {},
        contractorInn: {},
        contractor: {},
        orderedOrganizationId: {},
        inspectionOrganizationId: {},
        authorizedOrganizationId: {},
      },
      statusIds: [],
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
        {
          filter: true,
          search: () => {
            const { intl } = this.props;
            return (
              <InputGroup size="md">
                {/* <Input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      this.child.Refresh();
                    }
                  }}
                  type="text"
                  value={this.state.filters.requestDocNumber.value || ""}
                  onChange={(e) =>
                    this.handleChangeFilters(e, "requestDocNumber")
                  }
                  id="requestDocNumber"
                  placeholder={t2("docNumber", intl)}
                /> */}
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
                  value={this.state.filters.requestDocNumber.value || ""}
                  onChange={(e) =>
                    this.handleChangeFilters(e, "requestDocNumber")
                  }
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
                  placeholder={t2("inn", intl)}
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
            const { intl } = this.props;
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
                  placeholder={t2("contractor", intl)}
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
            const { intl } = this.props;
            return (
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
                {/* <InputGroupAddon addonType="append">
                  <Button color="primary" size="sm">
                    <Icon.Calendar id={"translate"} size={15} />
                  </Button>
                </InputGroupAddon> */}
              </InputGroup>
            );
          },
        },
        {
          filter: true,
          search: () => {
            const { intl } = this.props;
            return (
              <InputGroup size="md">
                <DatePicker
                  dateFormat="dd.MM.yyyy"
                  selected={
                    this.state.filters.startDate.value
                      ? moment(
                          this.state.filters.startDate.value,
                          "DD.MM.YYYY"
                        ).toDate()
                      : ""
                  }
                  onChange={(date, dateString) => {
                    this.handleChangeFilters(date, "startDate", {
                      value: moment(new Date(date)).format("DD.MM.YYYY"),
                    });
                    this.child.props.values.page = 1;
                    this.child.Refresh();
                  }}
                  isClearable={
                    !!this.state.filters.startDate.value > 0 ? true : false
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
                  selectsStart
                  startDate={
                    this.state.filters.startDate.value
                      ? moment(
                          this.state.filters.startDate.value,
                          "DD.MM.YYYY"
                        ).toDate()
                      : ""
                  }
                  endDate={
                    this.state.filters.startDate.value
                      ? moment(
                          this.state.filters.startDate.value,
                          "DD.MM.YYYY"
                        ).toDate()
                      : ""
                  }
                />
                {/* <InputGroupAddon addonType="append">
                  <Button color="primary" size="sm">
                    <Icon.Calendar id={"translate"} size={15} />
                  </Button>
                </InputGroupAddon> */}
              </InputGroup>
            );
          },
        },
        {
          filter: true,
          search: () => {
            const { intl } = this.props;
            return (
              <InputGroup size="md">
                <DatePicker
                  dateFormat="dd.MM.yyyy"
                  selected={
                    this.state.filters.endDate.value
                      ? moment(
                          this.state.filters.endDate.value,
                          "DD.MM.YYYY"
                        ).toDate()
                      : ""
                  }
                  onChange={(date, dateString) => {
                    this.handleChangeFilters(date, "endDate", {
                      value: moment(new Date(date)).format("DD.MM.YYYY"),
                    });
                    this.child.props.values.page = 1;
                    this.child.Refresh();
                  }}
                  isClearable={
                    !!this.state.filters.endDate.value > 0 ? true : false
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
                  selectsEnd
                  startDate={
                    this.state.filters.startDate.value
                      ? moment(
                          this.state.filters.startDate.value,
                          "DD.MM.YYYY"
                        ).toDate()
                      : ""
                  }
                  endDate={
                    this.state.filters.endDate.value
                      ? moment(
                          this.state.filters.endDate.value,
                          "DD.MM.YYYY"
                        ).toDate()
                      : ""
                  }
                  minDate={
                    this.state.filters.endDate.value
                      ? moment(
                          this.state.filters.endDate.value,
                          "DD.MM.YYYY"
                        ).toDate()
                      : ""
                  }
                />
                {/* <InputGroupAddon addonType="append">
                  <Button color="primary" size="sm">
                    <Icon.Calendar id={"translate"} size={15} />
                  </Button>
                </InputGroupAddon> */}
              </InputGroup>
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
          filter: true,
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
          key: "idNomer",
          label: t2("№", props.intl),
          sort: false,
          style: {
            width: "2%",
          },
        },
        {
          key: "actions",
          label: t2("actions", props.intl),
          style: { width: "2%" },
        },
        // {
        //   key: "id",
        //   label: t2("ID", props.intl),
        //   sort: true,
        // },
        {
          key: "status",
          statusSort:
            can("RequestAgree") || can("AllRequestAgree")
              ? "status"
              : can("RequestReceive") || can("AllRequestReceive")
              ? "status"
              : can("RequestView") ||
                can("BranchesRequestView") ||
                can("AllRequestView")
              ? "status"
              : "status",
          label: t2("state", props.intl),
          sort: true,
          badge: true,
          // style: { width: "4%" },
        },

        {
          key: "requestDocNumber",
          label: t2("docNumber", props.intl),
          sort: true,
          // style: { width: "5%" },
        },
        {
          key: "contractorInn",
          label: t2("inn", props.intl),
          sort: true,
          // style: { width: "5%" },
        },
        {
          key: "contractor",
          label: t2("contractor", props.intl),
          sort: true,
          // style: { width: "10%" },
        },
        {
          key: "docDate",
          label: t2("docDateDocument", props.intl),
          sort: true,
          // style: { width: "5%" },
        },
        {
          key: "startDate",
          label: t2("startDateDocument", props.intl),
          sort: true,
          // style: { width: "5%" },
        },
        {
          key: "endDate",
          label: t2("endDateDocument", props.intl),
          sort: true,
          // style: { width: "5%" },
        },
        {
          key: "orderedOrganization",
          label: t2("orderedOrganizationId", props.intl),
          sort: true,
          // style: {
          //   width: "10%",
          // },
        },
        {
          key: "inspectionOrganization",
          label: t2("inspectionOrganizationId", props.intl),
          sort: true,
          // style: {
          //   width: "10%",
          // },
        },
        {
          key: "authorizedOrganization",
          label: t2("authorizedOrganizationId", props.intl),
          sort: true,
          // style: {
          //   width: "10%",
          // },
        },
        {
          key: "reason",
          label: t2("reason", props.intl),
          sort: true,
          // style: { width: "5%" },
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
    this.setState({
      filters: this.props.values.filters,
      statusIds: this.props.values.statusIds,
    });
    OrganizationService.GetAsSelectList(null).then((res) => {
      this.setState({ OrganizationList: res.data });
    });
    this.changeAuthorizedOrganization();
  }
  changeOrderedOrg = (id) => {
    OrganizationService.GetAsSelectList(id, false, true).then((res) => {
      this.setState({ InspectionOrganizationList: res.data });
    });
  };

  changeAuthorizedOrganization = (id) => {
    OrganizationService.GetAsSelectList(null, true, false).then((res) => {
      this.setState({ AuthorizedOrganizationList: res.data });
    });
  };

  handleChange(event, field, data) {
    var filter = this.state.filter;
    filter[field] = !!event.target ? event.target.value : data.value;
    this.setState({ filter: filter });
  }
  GetExcel() {
    this.setState({ excelLoad: true });
    RequestPostponementService.SaveAsExecel(this.state.filter)
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
    const { intl } = this.props;
    var blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    // let format = attachfilename.split(".");
    const link = document.createElement("a");
    link.href = url;
    // if (format.length > 0) {
    link.setAttribute(
      "download",
      t2("RequestPostponement", intl) + "." + "xlsx"
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
  handleChangeFilters(event, field, data) {
    var filters = this.state.filters;
    // var filters = this.props.values.filters;
    if (!!event) {
      filters[field].value = !!event.target ? event.target.value : data.value;
      if (field === "organizationId") {
        filters[field].matchMode = "equals";
      } else if (field === "orderedOrganizationId") {
        filters[field].matchMode = "equals";
        filters[field].text = data.text;
        this.changeOrderedOrg(data.value);
      } else if (
        field === "startDate" ||
        field === "endDate" ||
        field === "docDate" ||
        field === "inspectionOrganizationId" ||
        field === "authorizedOrganizationId"
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
      if (field === "authorizedOrganizationId") {
        filters[field] = {};
        filters.authorizedOrganizationId = {};
      }
      if (field === "organizationId") {
        filters[field] = {};
      }
      if (field === "docDate") {
        filters[field] = {};
      }
      if (field === "startDate") {
        filters[field] = {};
      }
      if (field === "endDate") {
        filters[field] = {};
      }
      this.setState({ filters });
      this.props.changeAllFilter(filters);
    }
  }
  render() {
    const { intl, history } = this.props;
    const { fields, filter, searches, filters, statusIds } = this.state;

    return (
      <div>
        <Card className="p-2">
          <Row>
            <Col className="text-center">
              <h1 className="pageTextView"> {t1("RequestPostponement")} </h1>
            </Col>
          </Row>
          <Row>
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
            <Col sm={12} md={6} lg={8} className="text-right">
              <Button
                className="mr-1"
                color="primary"
                onClick={() => history.go(0)}
              >
                <Icon.RefreshCw size={18} /> {t1("Refresh")}
              </Button>
              <Button color="primary" onClick={() => this.GetExcel()}>
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
              </Button>

              {/* {can("RequestCreate") ? (
                <Button
                  color="primary"
                  onClick={() => history.push(`/document/editrequest/0`)}
                >
                  {" "}
                  <Icon.Plus size={14} /> {t1("Create")}{" "}
                </Button>
              ) : (
                ""
              )} */}
              {/* <img
                onClick={() => this.GetExcel()}
                width={50}
                style={{ cursor: "pointer" }}
                src={img}
                alt=""
              /> */}
            </Col>
          </Row>
          <Row className="mt-1">
            <Col>
              <ButtonGroup>
                <Button
                  color={statusIds.length === 0 ? "primary" : "outline-primary"}
                  onClick={() => {
                    this.setState({ statusIds: [], classInitial: "" }, () =>
                      this.child.Refresh()
                    );
                    this.props.statusIds([]);
                  }}
                >
                  {t1("All")}
                </Button>
                {can("RequestAgree") || can("AllRequestAgree") ? (
                  <Button
                    color={
                      this.checkColor(statusIds, newCeoStatus())
                        ? "primary"
                        : "outline-primary"
                    }
                    onClick={() => {
                      this.setState(
                        { statusIds: newCeoStatus(), classInitial: "" },
                        () => this.child.Refresh()
                      );
                      this.props.statusIds(newCeoStatus());
                    }}
                  >
                    {t1("newsCount")}
                  </Button>
                ) : (
                  ""
                )}
                {/* <Button
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
                </Button> */}

                {/* <Button
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
                </Button> */}
                <Button
                  color={
                    this.checkColor(statusIds, notAgreeSatus())
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() => {
                    // let fil = filters;
                    // fil["checkTypeId"].value = 1;
                    // fil["checkTypeId"].matchMode = "equals";

                    this.setState(
                      {
                        statusIds: notAgreeSatus(),
                        classInitial: "",
                      },
                      () => this.child.Refresh()
                    );
                    this.props.statusIds(notAgreeSatus());
                  }}
                >
                  {t1("NotAgree")}
                </Button>
                {can("RequestView") ||
                can("BranchesRequestView") ||
                can("AllRequestView") ? (
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
                      this.props.statusIds(cancelledStatus());
                    }}
                  >
                    {t1("Cancelled")}
                  </Button>
                ) : (
                  ""
                )}
              </ButtonGroup>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <WebaseTable
                fields={fields}
                filter={filter}
                searches={searches}
                filters={{
                  filters: this.props.values.filters,
                  statusIds: this.props.values.statusIds,
                }}
                width={false}
                api={RequestPostponementService}
                childRef={(ref) => (this.child = ref)}
                actions={(id) => {
                  return {
                    view: {
                      isView: true,
                      router: "/document/view",
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
                      router: "/document/postEdit",
                    },
                    // delete: {
                    //   isView: can("RequestDelete"),
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
// export default injectIntl(RequestPostponement);

const mapStateToProps = (state) => {
  return {
    values: state.filters.postponoment,
  };
};

export default connect(mapStateToProps, {
  changeAllFilter,
  statusIds,
})(injectIntl(RequestPostponement));
