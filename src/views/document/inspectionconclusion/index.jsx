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
} from "reactstrap";
import { injectIntl } from "react-intl";
import WebaseTable from "../../../components/Webase/components/Table";
import InspectionConclusionService from "../../../services/document/inspectionconclusion.service";
import ManualService from "../../../services/other/manual.service";
import * as Icon from "react-feather";
import Flatpickr from "react-flatpickr";
import { UzbekLatin } from "flatpickr/dist/l10n/uz_latn";
import { Russian } from "flatpickr/dist/l10n/ru";
import { Uzbek } from "flatpickr/dist/l10n/uz";
import moment from "moment";
import RegionService from "../../../services/info/region.service";
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
import InputMask from "react-input-mask";
import Select from "react-select";
import DatePicker, { registerLocale } from "react-datepicker";
import MaskedTextInput from "react-text-mask";
import uz from "date-fns/locale/uz";
import uzCyrl from "date-fns/locale/uz-Cyrl";
import ru from "date-fns/locale/ru";
import OrganizationService from "../../../services/management/organization.service";

import { connect } from "react-redux";
import changeAllFilter from "../../../redux/actions/filters/inspectionconclusion";

registerLocale("uz", uz);
registerLocale("uzCyrl", uzCyrl);
registerLocale("ru", ru);
const { t1, t2 } = Translate;
const { can } = Permission;
const { errorToast, successToast } = Notification;
class InspectionConclusion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        requestDocNumber: {},
        dateOfCreated: {},
        commentedDate: {},
        commentedUser: {},
        startDate: {},
        docDate: {},
        contractor: {},
        contractorInn: {},
        conclusionId: {},
        comment: {},
        regionId: {},
        orderedOrganizationId: {},
        authorizedOrganizationId: {},
      },
      AuthorizedOrganizationLis: [],
      RegionList: [],
      OrganizationList: [],
      ConculasionList: [],
      statusIds: [],
      searches: [
        {
          filter: false,
        },
        {
          filter: false,
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
          filter: true,
          search: () => {
            const { intl } = this.props;
            return (
              <InputGroup size="md">
                <DatePicker
                  dateFormat="dd.MM.yyyy"
                  style={{ width: "100%" }}
                  // onKeyDown={(e) => {
                  //   if (e.key === "Enter") {
                  //     this.child.Refresh();
                  //   }
                  // }}
                  selected={
                    this.state.filters.commentedDate.value
                      ? moment(
                          this.state.filters.commentedDate.value,
                          "DD.MM.YYYY"
                        ).toDate()
                      : ""
                  }
                  onChange={(date, dateString) => {
                    this.handleChangeFilters(date, "commentedDate", {
                      value: moment(new Date(date)).format("DD.MM.YYYY"),
                    });
                    this.child.props.values.page = 1;
                    this.child.Refresh();
                  }}
                  isClearable={
                    !!this.state.filters.commentedDate.value ? true : false
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
                  value={this.state.filters.comment.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "comment")}
                  id="comment"
                  placeholder={t2("comment", props.intl)}
                  // bsSize="sm"
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
                  value={this.state.filters.commentedUser.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "commentedUser")}
                  id="commentedUser"
                  placeholder={t2("commentedUser", props.intl)}
                  // bsSize="sm"
                />
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
                <DatePicker
                  dateFormat="dd.MM.yyyy"
                  style={{ width: "100%" }}
                  // onKeyDown={(e) => {
                  //   if (e.key === "Enter") {
                  //     this.child.Refresh();
                  //   }
                  // }}
                  selected={
                    this.state.filters.dateOfCreated.value
                      ? moment(
                          this.state.filters.dateOfCreated.value,
                          "DD.MM.YYYY"
                        ).toDate()
                      : ""
                  }
                  onChange={(date, dateString) => {
                    this.handleChangeFilters(date, "dateOfCreated", {
                      value: moment(new Date(date)).format("DD.MM.YYYY"),
                    });
                    this.child.props.values.page = 1;
                    this.child.Refresh();
                  }}
                  isClearable={
                    !!this.state.filters.dateOfCreated.value ? true : false
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
            const { ConculasionList } = this.state;
            const { intl } = this.props;
            return (
              <Select
                className="React"
                classNamePrefix="select"
                value={{
                  text:
                    this.state.filters.conclusionId.text || t2("Choose", intl),
                }}
                name="color"
                options={ConculasionList}
                isClearable
                label="text"
                getOptionLabel={(item) => item.text}
                onChange={(e) => {
                  this.handleChangeFilters(e, "conclusionId", e);
                  this.child.props.values.page = 1;
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
        {
          key: "contractorInn",
          label: t2("contractorInn", props.intl),
          sort: true,
        },
        {
          key: "contractor",
          label: t2("contractor", props.intl),
          sort: true,
        },
        {
          key: "region",
          label: t2("region", props.intl),
          style: { width: "250px" },
          sort: true,
        },
        {
          key: "orderedOrganization",
          label: t2("orderedOrganization", props.intl),
          sort: true,
        },
        {
          key: "authorizedOrganization",
          label: t2("authorizedOrganization", props.intl),
          sort: true,
        },
        {
          key: "commentedDate",
          label: t2("commentedDate", props.intl),
          sort: true,
        },

        {
          key: "comment",
          label: t2("comment", props.intl),
          sort: true,
          style: { width: "250px" },
        },
        {
          key: "commentedUser",
          label: t2("commentedUser", props.intl),
          sort: true,
        },
        {
          key: "requestDocNumber",
          label: t2("docNumber", props.intl),
          sort: true,
          style: { width: "150px" },
        },
        {
          key: "dateOfCreated",
          label: t2("dateOfCreated", props.intl),
          sort: true,
        },
        {
          key: "conclusion",
          label: t2("conclusion", props.intl),
          sort: true,
          style: { width: "150px" },
        },
      ],
      filter: {
        search: "",
      },
    };
    this.child = React.createRef();
  }
  componentDidMount() {
    this.setState({ filters: this.props.values });
    OrganizationService.GetAsSelectList(null).then((res) => {
      this.setState({ OrganizationList: res.data });
    });
    ManualService.ConclusionSelectList().then((res) => {
      this.setState({ ConculasionList: res.data });
    });
    RegionService.GetAsSelectList(211).then((res) => {
      this.setState({ RegionList: res.data });
    });
    OrganizationService.GetAsSelectList(null, true, false).then((res) => {
      this.setState({ AuthorizedOrganizationList: res.data });
    });
  }

  handleChange(event, field, data) {
    var filter = this.state.filter;
    filter[field] = !!event.target ? event.target.value : data.value;
    this.setState({ filter: filter });
  }
  handleChangeFilters(event, field, data) {
    var filters = this.state.filters;
    if (!!event) {
      filters[field].value = !!event.target ? event.target.value : data.value;
      if (field === "orderedOrganizationId") {
        filters[field].matchMode = "equals";
        filters[field].text = data.text;
        // this.changeAuthorizedOrganization(data.value);
      } else if (
        field === "organizationId" ||
        field === "conclusionId" ||
        field === "authorizedOrganizationId" ||
        field === "docDate" ||
        field === "regionId" ||
        field === "dateOfCreated" ||
        field === "commentedDate" ||
        field === "endDate"
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
      }
      if (field === "organizationId") {
        filters[field] = {};
        // this.setState(filters);
      }
      if (field === "regionId") {
        filters[field] = {};
      }
      if (field === "authorizedOrganizationId") {
        filters[field] = {};
        filters.authorizedOrganizationId = {};
      }
      if (field === "conclusionId") {
        filters[field] = {};
        // this.setState(filters);
      }
      if (
        field === "docDate" ||
        field === "dateOfCreated" ||
        field === "commentedDate" ||
        field === "endDate"
      ) {
        filters[field] = {};
      }
      this.setState(filters);
      this.props.changeAllFilter(filters);
    }
  }
  //   GetExcel() {
  //     InspectionResultService.SaveAsExecel({ filters: this.state.filters })
  //       .then((res) => {
  //         successToast(t2("DownloadSuccess", this.props.intl));
  //         this.forceFileDownload(res);
  //       })
  //       .catch((error) => {
  //         errorToast(error.response.data);
  //       });
  //   }
  checkColor(arr1, arr2) {
    return (
      arr1.length === arr2.length &&
      arr1.every((value, index) => value === arr2[index])
    );
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
  render() {
    const { intl, history } = this.props;
    const { fields, filter, searches, filters, statusIds } = this.state;

    return (
      <div>
        <Card className="p-2">
          <Row>
            <Col className="text-center">
              <h1 className="pageTextView"> {t1("InspectionConclusion")} </h1>
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
                <Icon.Printer size={22} /> {t1("Print")}{" "}
              </Button> */}
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
              </ButtonGroup> */}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <WebaseTable
                fields={fields}
                filter={filter}
                filters={{ filters: this.props.values, statusIds }}
                searches={searches}
                api={InspectionConclusionService}
                // width={true}
                childRef={(ref) => (this.child = ref)}
                actions={(id) => {
                  return {
                    view: {
                      isView: true,
                      router: "/document/viewinspectionconclusion",
                    },
                    edit: {
                      isView:
                        can("InspectionConclusionEdit") &&
                        // ||
                        //   can("BranchesRequestView") ||
                        //   can("AllRequestView") ||
                        //   can("RequestReceive") ||
                        //   can("AllRequestReceive") ||
                        //   can("RequestAgree") ||
                        //   can("AllRequestAgree")
                        (id === 1 || id === 12),
                      router: "/document/editinspectionconclusion",
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
// export default injectIntl(InspectionConclusion);
const mapStateToProps = (state) => {
  return {
    values: state.filters.InspectionConclusion,
  };
};

export default connect(mapStateToProps, {
  changeAllFilter,
})(injectIntl(InspectionConclusion));
