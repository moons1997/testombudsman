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
import AttestationService from "../../../services/document/attestation.service";
import * as Icon from "react-feather";
import Flatpickr from "react-flatpickr";
import { UzbekLatin } from "flatpickr/dist/l10n/uz_latn";
import { Russian } from "flatpickr/dist/l10n/ru";
import { Uzbek } from "flatpickr/dist/l10n/uz";
import moment from "moment";
import img from "../../../assets/img/xls.png";
import Select from "react-select";
import {
  draftStatus,
  newAttestationStatus,
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
import {
  Translate,
  Permission,
  Notification,
} from "../../../components/Webase/functions/index.js";
import InputMask from "react-input-mask";
import OrganizationService from "../../../services/management/organization.service";
// import { DatePicker, Space } from "antd";
import "moment/locale/ru";
import locale from "antd/es/date-picker/locale/ru_RU";
import DatePicker, { registerLocale } from "react-datepicker";
import MaskedTextInput from "react-text-mask";
import uz from "date-fns/locale/uz";
import uzCyrl from "date-fns/locale/uz-Cyrl";
import ru from "date-fns/locale/ru";
import ManualService from "../../../services/other/manual.service";

import { connect } from "react-redux";
import changeAllFilter from "../../../redux/actions/filters/attestation";
registerLocale("uz", uz);
registerLocale("uzCyrl", uzCyrl);
registerLocale("ru", ru);
const { t1, t2 } = Translate;
const { can } = Permission;
const { errorToast, successToast } = Notification;
class Attestation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      OrganizationList: [],
      ChildOrganizationList: [],
      filters: {
        docNumber: {},
        contractorInn: {},
        contractor: {},
        docDate: {
          // value: localStorage.getItem("docDate"),
          // matchMode: "equals",
        },
        parentOrganizationId: {},
        organizationId: {},
        id: {},
        statusId: {},
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
                  value={this.state.filters.id.value || ""}
                  onChange={(e) => this.handleChangeFiltersID(e, "id")}
                  id="id"
                  placeholder={t2("ID", props.intl)}
                  // bsSize="sm"
                />
              </InputGroup>
            );
          },
        },
        {
          filter: true,
          search: () => {
            const { AttestationStatusSelectList } = this.state;
            const { intl } = this.props;

            return (
              <>
                <Select
                  className="React"
                  classNamePrefix="select"
                  value={{
                    text:
                      this.state.filters.statusId.text || t2("Choose", intl),
                  }}
                  defaultValue={{
                    text:
                      this.state.filters.statusId.text || t2("Choose", intl),
                  }}
                  name="color"
                  options={AttestationStatusSelectList}
                  isClearable
                  label="text"
                  // isDisabled={(can("AllAttestationView")||can("AttestationHeld"))?false:true}
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => {
                    this.handleChangeFilters(e, "statusId", e);
                    // this.ChangeParentOrganization();
                    this.child.props.values.page = 1;
                    this.child.Refresh();
                  }}
                />
              </>
            );
          },
        },
        // {
        //   filter: false,
        // },
        {
          filter: false,
        },
        // {
        //   filter: true,
        //   search: () => {
        //     const { intl } = this.props;
        //     return (
        //       <InputGroup size="md">
        //         {/* <Input
        //           onKeyDown={(e) => {
        //             if (e.key === "Enter") {
        //               this.child.Refresh();
        //             }
        //           }}
        //           type="text"
        //           value={this.state.filters.docNumber.value || ""}
        //           onChange={(e) => this.handleChangeFilters(e, "docNumber")}
        //           id="docNumber"
        //           placeholder={t2("docNumberAttestation", intl)}
        //         /> */}
        //         <InputMask
        //           onKeyDown={(e) => {
        //             if (e.key === "Enter") {
        //               this.child.Refresh();
        //             }
        //           }}
        //           className="form-control"
        //           mask="999-999-999"
        //           placeholder={t2("docNumberAttestation", props.intl)}
        //           value={this.state.filters.docNumber.value || ""}
        //           onChange={(e) => this.handleChangeFilters(e, "docNumber")}
        //         />
        //         <InputGroupAddon addonType="append">
        //           <Button
        //             color="primary"
        //             size="sm"
        //             onClick={() => {
        //               this.child.Refresh();
        //             }}
        //           >
        //             <Icon.Search id={"translate"} size={10} />
        //           </Button>
        //         </InputGroupAddon>
        //       </InputGroup>
        //     );
        //   },
        // },
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
            const { OrganizationList, filters } = this.state;
            const org = JSON.parse(localStorage.getItem("user_info"));
            const { intl } = this.props;

            if (can("AllAttestationView")) {
              // filters.organizationId = {};
              // this.state.ChildOrganizationList=[]
            } else if (can("AttestationHeld")) {
              // filters.organizationId = {};
              // this.state.ChildOrganizationList=[]
            } else if (
              can("BranchesAttestationView") ||
              can("AttestationHeld") ||
              can("AttestationView")
            ) {
              if (org.parentOrganizationId) {
                filters.parentOrganizationId = {
                  matchMode: "equals",
                  text: org.parentOrganization,
                  value: org.parentOrganizationId,
                };
                // this.changeAuthorizedOrganization(org.parentOrganizationId);
                this.state.filters.parentOrganizationId.text =
                  org.parentOrganization;
                // this.state.filters.parentOrganizationId.value = org.parentOrganizationId
              }
            }
            return (
              <>
                {can("AllAttestationView") || can("AttestationHeld") ? (
                  <Select
                    className="React"
                    classNamePrefix="select"
                    value={{
                      text:
                        this.state.filters.parentOrganizationId.text ||
                        t2("Choose", intl),
                    }}
                    defaultValue={{
                      text:
                        this.state.filters.parentOrganizationId.text ||
                        t2("Choose", intl),
                    }}
                    name="color"
                    options={OrganizationList}
                    isClearable
                    label="text"
                    // isDisabled={(can("AllAttestationView")||can("AttestationHeld"))?false:true}
                    getOptionLabel={(item) => item.text}
                    onChange={(e) => {
                      this.handleChangeFilters(e, "parentOrganizationId", e);
                      this.ChangeParentOrganization();
                      this.child.Refresh();
                    }}
                  />
                ) : (
                  ""
                )}
              </>
            );
          },
        },

        {
          filter: true,
          search: () => {
            const { ChildOrganizationList, filters } = this.state;
            const { intl } = this.props;
            const orgChild = JSON.parse(localStorage.getItem("user_info"));
            // if (can("AllAttestationView") || can("AttestationHeld")) {
            //   filters.organizationId = {
            //     matchMode: "equals",
            //     text: this.state.filters.organizationId.text,
            //     value: this.state.filters.organizationId.value,
            //   };
            // } else
            if (
              can("BranchesAttestationView") ||
              can("AttestationHeld") ||
              can("AttestationView")
            ) {
              if (orgChild.organizationId) {
                filters.organizationId = {
                  matchMode: "equals",
                  text: orgChild.organization,
                  value: orgChild.organizationId,
                };
                this.state.filters.organizationId.text = orgChild.organization;
              }
            }
            return (
              <>
                {can("AllAttestationView") ||
                can("AttestationHeld") ||
                can("BranchesAttestationView") ? (
                  <Select
                    className="React"
                    classNamePrefix="select"
                    value={{
                      text:
                        this.state.filters.organizationId.text ||
                        t2("Choose", intl),
                    }}
                    defaultValue={{
                      text:
                        this.state.filters.organizationId.text ||
                        t2("Choose", intl),
                    }}
                    name="color"
                    options={ChildOrganizationList}
                    isClearable
                    //  isDisabled={(can("AllAttestationView")||can("AttestationHeld")||can("BranchesAttestationView"))?false:true}
                    label="text"
                    getOptionLabel={(item) => item.text}
                    onChange={(e) => {
                      this.handleChangeFilters(e, "organizationId", e);
                      this.child.Refresh();
                    }}
                  />
                ) : (
                  ""
                )}
              </>
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
            width: "4%",
          },
        },
        {
          key: "actions",
          label: t2("actions", props.intl),
        },
        { key: "id", label: t2("ID", props.intl), sort: true },
        {
          key: "status",
          statusSort: "status",
          label: t2("state", props.intl),
          sort: true,
          badge: true,
          style: { width: "200px" },
        },

        // {
        //   key: "employeesCount",
        //   label: t2("employeesCount", props.intl),
        //   sort: true,
        // },

        // {
        //   key: "passedEmployeesCount",
        //   label: t2("passedEmployeesCount", props.intl),
        //   sort: true,
        // },

        {
          key: "notPassedEmployeesCount",
          label: t2("employeesCount", props.intl),
          sort: false,
          notPassedEmp: true,
          style: { width: "200px" },
        },
        // {
        //   key: "docNumber",
        //   label: t2("docNumberAttestation", props.intl),
        //   sort: true,
        //   style: {
        //     width: "200px",
        //   },
        // },
        {
          key: "docDate",
          label: t2("attestationDocDate", props.intl),
          sort: true,
          style: { width: "300px" },
        },
        {
          key: "parentOrganization",
          label: t2("parentOrganization", props.intl),
          sort: true,
          style: {
            width: "400px",
          },
        },
        {
          key: "organization",
          label: t2("organization", props.intl),
          sort: true,
          style: {
            width: "400px",
          },
        },
        {
          key: "message",
          label: t2("comment", props.intl),
          sort: true,
          style: { width: "400px" },
        },
      ],
      filter: {
        search: "",
      },
      excelLoad: false,
      AttestationStatusSelectList: [],
    };
    this.child = React.createRef();
  }
  componentDidMount() {
    this.setState({ filters: this.props.values });
    OrganizationService.GetAsSelectList().then((res) => {
      this.setState({ OrganizationList: res.data });
    });
    const org = JSON.parse(localStorage.getItem("user_info"));
    if (org.parentOrganizationId) {
      this.changeAuthorizedOrganization(org.parentOrganizationId);
    }
    ManualService.AttestationStatusSelectList().then((res) => {
      this.setState({ AttestationStatusSelectList: res.data });
    });
    // var notPassedEmployeesCount
    // notPassedEmployeesCount = employeesCount -passedEmployeesCount
  }

  handleChange(event, field, data) {
    var filter = this.state.filter;
    filter[field] = !!event?.target ? event.target.value : data.value;
    this.setState({ filter: filter });
  }
  ChangeParentOrganization() {
    this.state.filters.organizationId = {};
    this.setState({ ChildOrganizationList: [] });
  }
  GetExcel() {
    this.setState({ excelLoad: true });
    AttestationService.SaveAsExecel(this.state.filter)
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
    link.setAttribute("download", t2("Attestation", intl) + "." + "xlsx");
    // }
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }
  changeAuthorizedOrganization = (id) => {
    OrganizationService.GetAsSelectList(id).then((res) => {
      this.setState({ ChildOrganizationList: res.data });
    });
  };
  handleChangeFiltersID(event, field, data) {
    var filters = this.state.filters;
    filters[field].value = !!event.target ? event.target.value : data.value;
    if (field === "id") {
      filters[field].matchMode = "equals";
    }
    // this.setState({ filters });
    if (filters.id.value.length == 0) {
      filters[field] = {};
      filters.id = {};
    }
    this.setState(filters);
    this.props.changeAllFilter(filters);
  }
  handleChangeFilters(event, field, data) {
    var filters = this.state.filters;
    if (!!event) {
      filters[field].value = !!event.target ? event.target.value : data.value;
      if (field === "parentOrganizationId") {
        filters[field].matchMode = "equals";
        filters[field].text = data.text;
        this.changeAuthorizedOrganization(data.value);
      } else if (field === "organizationId") {
        filters[field].matchMode = "equals";
        filters[field].text = data.text;
      } else if (
        field === "docDate" ||
        field === "id" ||
        field === "statusId"
      ) {
        filters[field].matchMode = "equals";
        // localStorage.setItem('docDate',this.state.filters.docDate.value)
      } else {
        filters[field].matchMode = "contains";
      }
      this.setState({ filters });
      this.props.changeAllFilter(filters);
    } else {
      if (field === "parentOrganizationId") {
        filters[field] = {};
        filters.organizationId = {};
        this.setState({ ChildOrganizationList: [] });
      }
      if (field === "organizationId") {
        filters[field] = {};
      }
      if (field === "statusId") {
        filters[field] = {};
      }
      if (field === "docDate") {
        filters[field] = {};
        // localStorage.removeItem("docDate");
      }
      if (field === "id") {
        filters[field] = {};
      }
      this.setState(filters);
      this.props.changeAllFilter(filters);
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
    const { fields, filter, searches, filters, statusIds } = this.state;

    return (
      <div>
        {/* <DataTables /> */}
        <Card className="p-2">
          <Row>
            <Col className="text-center">
              <h1 className="pageTextView"> {t1("Attestation")} </h1>
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

                {can(
                  "AttestationHeld" ? (
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
                      {t1("newsCount")}
                    </Button>
                  ) : (
                    ""
                  )
                )}
                {can("AttestationView") ? (
                  <Button
                    color={
                      this.checkColor(statusIds, newAttestationStatus())
                        ? "primary"
                        : "outline-primary"
                    }
                    onClick={() =>
                      this.setState(
                        { statusIds: newAttestationStatus(), classInitial: "" },
                        () => this.child.Refresh()
                      )
                    }
                  >
                    {t1("newsCount")}
                  </Button>
                ) : (
                  ""
                )}
              </ButtonGroup>
            </Col>
            <Col sm={12} md={12} lg={8} className="text-right">
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
                    <Icon.Printer size={18} /> {t1("Print")}
                  </>
                )}
              </Button>
              {can("AttestationCreate") ||
              can("BranchesAttestationCreate") ||
              can("AllAttestationCreate") ? (
                <Button
                  color="primary"
                  onClick={() => history.push(`/document/editattestation/0`)}
                >
                  {" "}
                  <Icon.Plus size={18} /> {t1("Create")}{" "}
                </Button>
              ) : (
                ""
              )}
              {/* <img
                onClick={() => this.GetExcel()}
                width={50}
                style={{ cursor: "pointer" }}
                src={img}
                alt=""
              /> */}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <WebaseTable
                fields={fields}
                filter={filter}
                searches={searches}
                filters={{ filters: this.props.values, statusIds }}
                width={false}
                api={AttestationService}
                childRef={(ref) => (this.child = ref)}
                actions={(id) => {
                  return {
                    edit: {
                      isView:
                        (can("AttestationEdit") ||
                          can("BranchesAttestationEdit") ||
                          can("AllAttestationEdit")) &&
                        (id === 1 || id === 12 || id === 8),
                      router: `/document/editattestation`,
                    },
                    view: {
                      isView: true,
                      router: `/document/viewattestation`,
                    },
                    print: {
                      isView: true,
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
// export default injectIntl(Attestation);

const mapStateToProps = (state) => {
  return {
    values: state.filters.attestation,
  };
};

export default connect(mapStateToProps, {
  changeAllFilter,
})(injectIntl(Attestation));
