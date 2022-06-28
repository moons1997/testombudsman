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
import Select, { components, IndicatorsContainerProps } from "react-select";
import {
  Notification,
  Translate,
  Permission,
} from "../../../components/Webase/functions/index.js";
import UserService from "../../../services/management/user.service";
import AgGridTable from "../../../components/Webase/components/AgGridTable";
import img from "../../../assets/img/xls.png";
import OrganizationService from "../../../services/management/organization.service";

import { connect } from "react-redux";
import changeAllFilter from "../../../redux/actions/filters/user";

const { t1, t2 } = Translate;
const { can } = Permission;
const { errorToast, successToast } = Notification;
class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      OrganizationList: [],
      ParentOrganizationList: [],
      filters: {
        userName: {},
        fullName: {},
        parentOrganizationId: {},
        organizationId: {},
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
                  value={this.state.filters.userName.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "userName")}
                  id="userName"
                  placeholder={t2("Username", intl)}
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
                  type="text"
                  value={this.state.filters.fullName.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "fullName")}
                  id="fullName"
                  placeholder={t2("User", intl)}
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
            const { ParentOrganizationList, filter } = this.state;
            const { intl } = this.props;
            return (
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
                options={ParentOrganizationList}
                isClearable
                label="text"
                getOptionLabel={(item) => item.text}
                onChange={(e) => {
                  this.handleChangeFilters(e, "parentOrganizationId", e);
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
            const { OrganizationList, filter } = this.state;
            const { intl } = this.props;
            return (
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
                options={OrganizationList}
                isClearable
                label="text"
                getOptionLabel={(item) => item.text}
                onChange={(e) => {
                  this.handleChangeFilters(e, "organizationId", e);
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
        {
          filter: false,
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
        // { key: "id", label: "ID", sort: true },
        {
          key: "userName",
          label: t2("Username", props.intl),
          sort: true,
          style: {
            width: "350px",
          },
        },
        // {
        //   key: "shortName",
        //   label: t2("shortname", props.intl),
        //   sort: true,
        // },
        {
          key: "fullName",
          label: t2("User", props.intl),
          sort: true,
          show: true,
          style: {
            width: "350px",
          },
        },
        {
          key: "parentOrganization",
          label: t2("parentOrganization", props.intl),
          sort: true,
          style: {
            width: "350px",
          },
        },
        {
          key: "organization",
          label: t2("Organization", props.intl),
          sort: true,
          style: {
            width: "350px",
          },
        },
        {
          key: "roles",
          label: t2("Role", props.intl),
          sort: false,
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
      data: {},
      filter: {
        search: "",
      },
      excelLoad: false,
    };
    this.child = React.createRef();
  }
  componentDidMount() {
    this.setState({ filters: this.props.values });
    OrganizationService.GetAsSelectList().then((res) => {
      this.setState({ ParentOrganizationList: res.data });
    });
  }
  changeOrderedOrg = (id) => {
    OrganizationService.GetAsSelectList(id).then((res) => {
      this.setState({ OrganizationList: res.data });
    });
  };
  GetExcel() {
    this.setState({ excelLoad: true });

    UserService.SaveAsExecel(this.state.filter)
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
    link.setAttribute("download", t2("User", intl) + "." + "xlsx");
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
  handleChangeFilters(event, field, data) {
    var filters = this.state.filters;
    if (!!event) {
      filters[field].value = !!event.target ? event.target.value : data.value;
      if (field === "parentOrganizationId") {
        filters[field].matchMode = "equals";
        filters[field].text = data.text;
        this.changeOrderedOrg(data.value);
      } else if (field === "organizationId") {
        filters[field].matchMode = "equals";
        filters[field].text = data.text;
      } else {
        filters[field].matchMode = "contains";
      }
      this.setState({ filters });
      this.props.changeAllFilter(filters);
    } else {
      if (field === "organizationId" || field === "parentOrganizationId") {
        filters[field] = {};
        this.setState(filters);
        this.props.changeAllFilter(filters);
      }
    }
  }
  render() {
    const { intl, history } = this.props;
    const { fields, filter, searches, filters } = this.state;
    const routerName = "user";
    return (
      <div>
        {/* <AgGridTable api={UserService} intl={intl} /> */}
        <Card className="p-2">
          <Row>
            <Col className="text-center">
              <h1 className="pageTextView"> {t1("User")} </h1>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6} lg={1}>
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
                    <Icon.Search size={14} /> {t1("Search")}{" "}
                  </Button>
                </InputGroupAddon>
              </InputGroup> */}
            </Col>
            <Col sm={12} md={12} lg={11} className="text-right">
              <Button
                className="mr-1"
                color="primary"
                onClick={() => history.go(0)}
              >
                <Icon.RefreshCw size={18} /> {t1("Refresh")}
              </Button>
              <Button
                color="primary"
                className="mr-1"
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
              {can("UserCreate") ||
              can("BranchesUserCreate") ||
              can("AllUserCreate") ? (
                <Button
                  color="primary"
                  onClick={() =>
                    history.push(`/management/edit${routerName}/0`)
                  }
                >
                  {" "}
                  <Icon.Plus size={18} /> {t1("Create")}{" "}
                </Button>
              ) : (
                ""
              )}
              {/* <Button
                style={{ marginLeft: "2px" }}
                color="success"
                onClick={() => this.GetExcel()}
              >
                {" "}
                <Icon.File size={16} /> {t1("Excel")}{" "}
              </Button> */}
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
                {...this.props}
                fields={fields}
                filter={filter}
                filters={{ filters: this.props.values }}
                searches={searches}
                api={UserService}
                childRef={(ref) => (this.child = ref)}
                width={false}
                fullName={{
                  show: {
                    router: "/request/index",
                  },
                }}
                actions={() => {
                  return {
                    edit: {
                      isView:
                        can("UserEdit") ||
                        can("BranchesUserEdit") ||
                        can("AllUserEdit"),
                      router: "/management/edit" + routerName,
                    },
                    delete: {
                      isView:
                        can("UserDelete") ||
                        can("BranchesUserDelete") ||
                        can("AllUserDelete"),
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
// export default injectIntl(User);

const mapStateToProps = (state) => {
  return {
    values: state.filters.user,
  };
};

export default connect(mapStateToProps, {
  changeAllFilter,
})(injectIntl(User));
