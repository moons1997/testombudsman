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
} from "reactstrap";
import { injectIntl } from "react-intl";
import WebaseTable from "../../../components/Webase/components/Table";
import InspectionBookService from "../../../services/document/inspectionbook.service";
import * as Icon from "react-feather";
import Flatpickr from "react-flatpickr";
import { UzbekLatin } from "flatpickr/dist/l10n/uz_latn";
import { Russian } from "flatpickr/dist/l10n/ru";
import { Uzbek } from "flatpickr/dist/l10n/uz";
import moment from "moment";
import img from "../../../assets/img/xls.png";
import {
  Translate,
  Permission,
  Notification,
} from "../../../components/Webase/functions/index.js";
// import { DatePicker } from "antd";
import "moment/locale/ru";
import locale from "antd/es/date-picker/locale/ru_RU";
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
  archiveSatus,
  cancelledStatus,
  completedStatus,
} from "../../../components/Webase/functions/RequestStatus";
import DatePicker, { registerLocale } from "react-datepicker";
import MaskedTextInput from "react-text-mask";
import InputMask from "react-input-mask";
import uz from "date-fns/locale/uz";
import uzCyrl from "date-fns/locale/uz-Cyrl";
import ru from "date-fns/locale/ru";
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
        requestDocNumber: {},
        endDate: {},
        startDate: {},
        docDate: {},
        contractor: {},
        contractorInn: {},
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
                      this.child.Refresh();
                    }
                  }}
                  type="number"
                  value={this.state.filters.contractorInn.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "contractorInn")}
                  id="contractorInn"
                  placeholder={t2("inn", intl)}
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
                  placeholder={t2("contractor", intl)}
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
              <InputGroup size="md" className="datePicker">
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
                <InputGroupAddon addonType="append">
                  <Button color="primary" size="sm">
                    <Icon.Calendar id={"translate"} size={15} />
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
              <InputGroup size="md" className="datePicker">
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
                <InputGroupAddon addonType="append">
                  <Button color="primary" size="sm">
                    <Icon.Calendar id={"translate"} size={15} />
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
              <InputGroup size="md" className="datePicker">
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
                <InputGroupAddon addonType="append">
                  <Button color="primary" size="sm">
                    <Icon.Calendar id={"translate"} size={15} />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            );
          },
        },
      ],
      fields: [
        {
          key: "idNomer",
          label: t2("№", props.intl),
          sort: false,
          style: {
            width: "4%",
          },
        },
        {
          key: "actions",
          label: t2("actions", props.intl),
        },
        // {
        //   key: "id",
        //   label: t2("ID", props.intl),
        //   sort: true,
        // },
        {
          key: "status",
          statusSort:
            can("RequestView") ||
            can("BranchesRequestView") ||
            can("AllRequestView")
              ? "status"
              : "status",
          label: t2("state", props.intl),
          sort: true,
          badge: true,
        },

        {
          key: "requestDocNumber",
          label: t2("docNumber", props.intl),
          sort: true,
        },
        {
          key: "contractorInn",
          label: t2("inn", props.intl),
          sort: true,
          style: { width: "300px" },
        },
        {
          key: "contractor",
          label: t2("contractor", props.intl),
          sort: true,
          style: { width: "500px" },
        },
        {
          key: "docDate",
          label: t2("docDate", props.intl),
          sort: true,
          style: { width: "250px" },
        },
        {
          key: "startDate",
          label: t2("startDate", props.intl),
          sort: true,
          style: { width: "250px" },
        },
        {
          key: "endDate",
          label: t2("endDate", props.intl),
          sort: true,
          style: { width: "250px" },
        },
        // {
        //   key: "reason",
        //   label: t2("reason", props.intl),
        //   sort: true,
        // },
      ],
      filter: {
        search: "",
      },
      excelLoad: false,
    };
    this.child = React.createRef();
  }
  componentDidMount() {}

  handleChange(event, field, data) {
    var filter = this.state.filter;
    filter[field] = !!event.target ? event.target.value : data.value;
    this.setState({ filter: filter });
  }
  handleChangeFilters(event, field, data) {
    var filters = this.state.filters;
    if (!!event) {
      filters[field].value = !!event.target ? event.target.value : data.value;
      if (
        field === "organizationId" ||
        field === "docDate" ||
        field === "startDate" ||
        field === "endDate"
      ) {
        filters[field].matchMode = "equals";
      } else {
        filters[field].matchMode = "contains";
      }
      this.setState({ filters });
    } else {
      if (field === "organizationId") {
        filters[field] = {};
      }
      if (field === "docDate" || field === "startDate" || field === "endDate") {
        filters[field] = {};
      }
      this.setState(filters);
    }
  }
  GetExcel() {
    this.setState({ excelLoad: true });
    InspectionBookService.SaveAsExecel({ filters: this.state.filters })
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
    link.setAttribute("download", "Проверки" + "." + "xlsx");
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
    const { fields, filter, searches, filters, statusIds } = this.state;

    return (
      <div>
        <Card className="p-2">
          <Row>
            <Col className="text-center">
              <h1 className="pageTextView"> {t1("InspectionBook")} </h1>
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
              {/* <ButtonGroup>
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
                </Button> */}
              {/* <Button
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
                </Button> */}
              {/* <Button
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
              </ButtonGroup> */}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <WebaseTable
                fields={fields}
                filter={filter}
                filters={{ filters: filters, statusIds }}
                searches={searches}
                width={true}
                api={InspectionBookService}
                childRef={(ref) => (this.child = ref)}
                actions={(id) => {
                  return {
                    view: {
                      isView: true,
                      router: "/document/viewinspectionbook",
                    },
                    // edit: {
                    //   isView:
                    //     (can("RequestView") ||
                    //       can("BranchesRequestView") ||
                    //       can("AllRequestView") ||
                    //       can("RequestReceive") ||
                    //       can("AllRequestReceive") ||
                    //       can("RequestAgree") ||
                    //       can("AllRequestAgree")) &&
                    //     (id === 1 || id === 12),
                    //   router: "/document/editinspectionbook",
                    // },
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
export default injectIntl(InspectionResult);
