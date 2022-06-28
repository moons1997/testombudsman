import React from "react";
import {
  Card,
  Row,
  Col,
  InputGroup,
  Input,
  Button,
  InputGroupAddon,
  Spinner,
} from "reactstrap";
import { injectIntl } from "react-intl";
import WebaseTable from "../../../components/Webase/components/Table";
import * as Icon from "react-feather";
import Select from "react-select";
import OrganizationService from "../../../services/management/organization.service";
import {
  Translate,
  Permission,
  Notification,
} from "../../../components/Webase/functions/index.js";
import EmployeeService from "../../../services/info/employee.service";

import { connect } from "react-redux";
import changeAllFilter from "../../../redux/actions/filters/employee";

const { t1, t2 } = Translate;
const { can } = Permission;
const { errorToast, successToast, customErrorToast } = Notification;

class Bank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      OrganizationList: [],
      ChildOrganizationList: [],
      fields: [
        {
          key: "idNomer",
          label: t2("№", props.intl),
          sort: false,
          style: {
            width: "4%",
          },
        },
        // { key: "id", label: "ID", sort: true },
        {
          key: "fullName",
          label: t2("fio", props.intl),
          sort: true,
          show: true,
          style: {
            width: "300px",
          },
        },
        {
          key: "parentOrganization",
          label: t2("parentOrganization", props.intl),
          sort: true,
          style: {
            width: "500px",
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
        { key: "position", label: t2("Position", props.intl), sort: true },
        { key: "user", label: t2("User", props.intl), sort: true },
        {
          key: "attestationId",
          label: t2("attestationId", props.intl),
          sort: true,
          attestationIdShow: true,
        },
        {
          key: "isPassedAttestation",
          label: t2("isPassedAttestation", props.intl),
          sort: true,
          expired: true,
        },
        {
          key: "state",
          label: t2("state", props.intl),
          sort: true,
          badge: true,
        },
        {
          key: "actions",
          label: t2("actions", props.intl),
        },
      ],
      filters: {
        fullName: {},
        parentOrganizationId: {},
        organizationId: {},
        user: {},
        position: {},
        isHr: {
          value: "false",
          matchMode: "equals",
        },
      },
      searches: [
        {
          filter: false,
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
                  value={this.state.filters.fullName.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "fullName")}
                  id="fullName"
                  placeholder={t2("fio", intl)}
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
            const { OrganizationList, filters } = this.state;
            const org = JSON.parse(localStorage.getItem("user_info"));
            const { intl } = this.props;
            if (can("AllEmployeeView")) {
              // filters.organizationId = {};
              // this.state.ChildOrganizationList=[]
            }
            //  else if (can("AttestationHeld")) {
            // filters.organizationId = {};
            // this.state.ChildOrganizationList=[]
            // }
            else if (
              can("BranchesEmployeeView") ||
              // can("AttestationHeld") ||
              can("EmployeeView")
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
                {can("AllEmployeeView") ? (
                  <Select
                    className="React"
                    classNamePrefix="select"
                    // defaultValue={{
                    //   text: request.contractor.region || t2("Choose", intl),
                    // }}
                    value={{
                      text:
                        this.state.filters.parentOrganizationId.text ||
                        t2("Choose", intl),
                    }}
                    name="color"
                    options={OrganizationList}
                    isClearable
                    label="text"
                    getOptionLabel={(item) => item.text}
                    onChange={(e) => {
                      this.handleChangeFilters(e, "parentOrganizationId", e);
                      this.ClearOrganization();
                      this.child.props.values.page = 1;
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
            const orgChild = JSON.parse(localStorage.getItem("user_info"));
            const { intl } = this.props;
            if (
              can("BranchesEmployeeView") ||
              // can("AttestationHeld") ||
              can("EmployeeView")
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
                {can("BranchesEmployeeView") || can("AllEmployeeView") ? (
                  <Select
                    className="React"
                    classNamePrefix="select"
                    // defaultValue={{
                    //   text: request.contractor.region || t2("Choose", intl),
                    // }}
                    value={{
                      text:
                        this.state.filters.organizationId.text ||
                        t2("Choose", intl),
                    }}
                    name="color"
                    options={ChildOrganizationList}
                    isClearable
                    label="text"
                    getOptionLabel={(item) => item.text}
                    onChange={(e) => {
                      this.handleChangeFilters(e, "organizationId", e);
                      this.child.props.values.page = 1;
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
                  value={this.state.filters.position.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "position")}
                  id="position"
                  placeholder={t2("position", props.intl)}
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
                  value={this.state.filters.user.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "user")}
                  id="user"
                  placeholder={t2("User", props.intl)}
                  // bsSize="sm"
                />
              </InputGroup>
            );
          },
        },
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
          filter: false,
        },
      ],
      filter: {
        search: "",
        filters: {
          isHr: {
            value: "false",
            matchMode: "equals",
          },
        },
      },
      excelLoad: false,
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
  }
  GetExcel() {
    this.setState({ excelLoad: true });

    EmployeeService.SaveAsExecel1(this.state.filter)
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
    link.setAttribute("download", t2("Employee", intl) + "." + "xlsx");
    // }
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
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
      } else {
        filters[field].matchMode = "contains";
      }
      this.setState({ filters });
      this.props.changeAllFilter(filters);
    } else {
      if (field === "parentOrganizationId") {
        filters[field] = {};
        filters.parentOrganizationId = {};
        filters.organizationId = {};
        this.setState(filters);
      }
      if (field === "organizationId") {
        filters[field] = {};
        this.setState(filters);
      }
      this.setState(filters);
      this.props.changeAllFilter(filters);
    }
  }
  ClearOrganization() {
    this.state.filters.organizationId = {};
  }
  changeAuthorizedOrganization = (id) => {
    OrganizationService.GetAsSelectList(id).then((res) => {
      this.setState({ ChildOrganizationList: res.data });
    });
  };
  handleChange(event, field, data) {
    var filter = this.state.filter;
    filter[field] = !!event.target ? event.target.value : data.value;
    this.setState({ filter: filter });
  }
  render() {
    const { intl, history } = this.props;
    const { fields, filter, searches, filters } = this.state;
    const routerName = "employee";
    return (
      <div>
        <Card className="p-2">
          <Row>
            <Col className="text-center">
              <h1 className="pageTextView"> {t1("Employee")} </h1>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6} lg={3}>
              <InputGroup>
                <Input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      this.child.props.values.page = 1;
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
                      this.child.props.values.page = 1;
                      this.child.Refresh();
                    }}
                  >
                    {" "}
                    <Icon.Search size={14} /> {t1("Search")}{" "}
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </Col>
            <Col sm={12} md={12} lg={9} className="text-right">
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
              {can("EmployeeCreate") || can("BranchesEmployeeCreate") ? (
                <Button
                  color="primary"
                  onClick={() =>
                    history.push({
                      pathname: `/info/edit${routerName}/0`,
                      state: { isHr: false },
                    })
                  }
                >
                  {" "}
                  <Icon.Plus size={18} /> {t1("Create")}{" "}
                </Button>
              ) : (
                ""
              )}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <WebaseTable
                {...this.props}
                fields={fields}
                filter={filter}
                searches={searches}
                filters={{ filters: this.props.values }}
                api={EmployeeService}
                childRef={(ref) => (this.child = ref)}
                actions={() => {
                  return {
                    edit: {
                      isView:
                        can("EmployeeEdit") ||
                        can("BranchesEmployeeEdit") ||
                        can("AllEmployeeEdit"),
                      router: "/info/edit" + routerName,
                    },
                    view: {
                      isView: true,
                      router: "/info/view" + routerName,
                    },
                    delete: {
                      isView:
                        can("EmployeeDelete") || can("BranchesEmployeeDelete"),
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
// export default injectIntl(Bank);

const mapStateToProps = (state) => {
  return {
    values: state.filters.employee,
  };
};

export default connect(mapStateToProps, {
  changeAllFilter,
})(injectIntl(Bank));
