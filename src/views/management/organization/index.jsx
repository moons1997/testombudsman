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
import {
  Translate,
  Permission,
  Notification,
} from "../../../components/Webase/functions/index.js";
import Select from "react-select";
import OrganizationService from "../../../services/management/organization.service";
import RegionService from "../../../services/info/region.service";
import DistrictService from "../../../services/info/district.service";

import { connect } from "react-redux";
import changeAllFilter from "../../../redux/actions/filters/organization";

const { t1, t2 } = Translate;
const { can } = Permission;
const { errorToast, successToast, customErrorToast } = Notification;
class Organization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        inn: {},
        orderCode: {},
        fullName: {},
        regionId: {},
        districtId: {},
        address: {},
        director: {},
        parentId: {},
      },
      OrganizationList: [],
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
                  value={this.state.filters.orderCode.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "orderCode")}
                  id="orderCode"
                  placeholder={t2("orderCode", intl)}
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
                  value={this.state.filters.inn.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "inn")}
                  id="inn"
                  placeholder={t2("inn", intl)}
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
                  placeholder={t2("fullname", intl)}
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
            const { OrganizationList } = this.state;
            const { intl } = this.props;
            return (
              <Select
                className="React"
                classNamePrefix="select"
                // defaultValue={{
                //   text: request.contractor.region || t2("Choose", intl),
                // }}
                value={{
                  text: this.state.filters.parentId.text || t2("Choose", intl),
                }}
                name="color"
                options={OrganizationList}
                isClearable
                label="text"
                getOptionLabel={(item) => item.text}
                onChange={(e) => {
                  this.handleChangeFilters(e, "parentId", e);
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
            const { RegionList } = this.state;
            const { intl } = this.props;
            return (
              <Select
                className="React"
                classNamePrefix="select"
                // defaultValue={{
                //   text: request.contractor.region || t2("Choose", intl),
                // }}
                value={{
                  text: this.state.filters.regionId.text || t2("Choose", intl),
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
                  this.RegionChange();
                }}
              />
            );
          },
        },
        {
          filter: true,
          search: () => {
            const { DistrictList } = this.state;
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
                    this.state.filters.districtId.text || t2("Choose", intl),
                }}
                name="color"
                options={DistrictList}
                isClearable
                label="text"
                getOptionLabel={(item) => item.text}
                onChange={(e) => {
                  this.handleChangeFilters(e, "districtId", e);
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
                <Input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      this.child.props.values.page = 1;
                      this.child.Refresh();
                    }
                  }}
                  type="text"
                  value={this.state.filters.address.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "address")}
                  id="address"
                  placeholder={t2("Address", intl)}
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
                  value={this.state.filters.director.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "director")}
                  id="director"
                  placeholder={t2("Director", intl)}
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
      ],
      fields: [
        {
          key: "actions",
          label: t2("actions", props.intl),
        },

        { key: "id", label: "ID", sort: true },
        {
          key: "orderCode",
          label: t2("orgCode", props.intl),
          sort: true,
          style: {
            width: "150px",
          },
        },
        {
          key: "state",
          label: t2("state", props.intl),
          sort: true,
          badge: true,
        },
        { key: "inn", label: t2("inn", props.intl), sort: true },
        // { key: "shortName", label: t2("shortname", props.intl), sort: true },
        {
          key: "fullName",
          label: t2("fullname", props.intl),
          sort: true,
          style: {
            width: "400px",
          },
        },
        {
          key: "parent",
          label: t2("parentOld", props.intl),
          sort: false,
          style: {
            width: "400px",
          },
        },
        {
          key: "region",
          label: t2("Region", props.intl),
          sort: true,
          style: {
            width: "300px",
          },
        },
        {
          key: "district",
          label: t2("District", props.intl),
          sort: true,
          style: {
            width: "300px",
          },
        },
        // { key: "parentId", label: t2("Parent", props.intl), sort: true },
        {
          key: "address",
          label: t2("Address", props.intl),
          sort: true,
          style: {
            width: "300px",
          },
        },
        // {
        //   key: "phoneNumber",
        //   label: t2("PhoneNumber", props.intl),
        //   sort: true,
        // },
        {
          key: "director",
          label: t2("Director", props.intl),
          sort: true,
          style: {
            width: "300px",
          },
        },
      ],
      RegionList: [],
      DistrictList: [],
      filter: {
        search: "",
      },
      excelLoad: false,
    };
    this.child = React.createRef();
  }
  componentDidMount() {
    this.setState({ filters: this.props.values });

    RegionService.GetAsSelectList(211).then((res) => {
      this.setState({ RegionList: res.data });
    });
    OrganizationService.GetAsSelectList().then((res) => {
      this.setState({ OrganizationList: res.data });
    });
  }
  RegionChange = (id) => {
    if (!!id) {
      DistrictService.GetAsSelectList(id).then((res) => {
        this.setState({ DistrictList: res.data });
      });
    }
  };
  GetExcel() {
    this.setState({ excelLoad: true });

    OrganizationService.SaveAsExecel(this.state.filter)
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
      t2("organizationSidebar", intl) + "." + "xlsx"
    );
    // }
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }
  handleChangeFilters(event, field, data) {
    var filters = this.state.filters;
    if (!!event) {
      filters[field].value = !!event.target ? event.target.value : data.value;
      if (field === "regionId") {
        filters[field].matchMode = "equals";
        filters[field].text = data.text;
        this.RegionChange(data.value);
      } else if (field === "districtId") {
        filters[field].matchMode = "equals";
        filters[field].text = data.text;
      } else if (field === "parentId") {
        filters[field].matchMode = "equals";
        filters[field].text = data.text;
      } else {
        filters[field].matchMode = "contains";
      }
      this.setState({ filters });
      this.props.changeAllFilter(filters);
    } else {
      if (field === "regionId") {
        filters[field] = {};
        filters.districtId = {};
      }
      if (field === "districtId") {
        filters[field] = {};
      }
      if (field === "parentId") {
        filters[field] = {};
      }
      this.setState(filters);
      this.props.changeAllFilter(filters);
    }
  }
  handleChange(event, field, data) {
    var filter = this.state.filter;
    filter[field] = !!event.target ? event.target.value : data.value;
    this.setState({ filter: filter });
  }
  render() {
    const { intl, history } = this.props;
    const { fields, filter, searches, filters } = this.state;
    const routerName = "organization";
    return (
      <div>
        <Card className="p-2">
          <Row>
            <Col className="text-center">
              <h1 className="pageTextView"> {t1("organizationSidebar")} </h1>
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
                    {" "}
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
              {can("OrganizationCreate") || can("AllOrganizationCreate") ? (
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
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <WebaseTable
                fields={fields}
                filter={filter}
                searches={searches}
                filters={{ filters: this.props.values }}
                width={true}
                api={OrganizationService}
                childRef={(ref) => (this.child = ref)}
                actions={() => {
                  return {
                    edit: {
                      isView:
                        can("OrganizationEdit") || can("AllOrganizationEdit"),
                      router: "/management/edit" + routerName,
                    },
                    delete: {
                      isView:
                        can("OrganizationDelete") ||
                        can("AllOrganizationDelete"),
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
// export default injectIntl(Organization);

const mapStateToProps = (state) => {
  return {
    values: state.filters.organization,
  };
};

export default connect(mapStateToProps, {
  changeAllFilter,
})(injectIntl(Organization));
