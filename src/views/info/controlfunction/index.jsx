import React from "react";
import {
  Card,
  Row,
  Col,
  InputGroup,
  Input,
  Button,
  InputGroupAddon,
} from "reactstrap";
import { injectIntl } from "react-intl";
import WebaseTable from "../../../components/Webase/components/Table";
import * as Icon from "react-feather";
import Select from "react-select";
import {
  Translate,
  Permission,
} from "../../../components/Webase/functions/index.js";
import ControlFunctionService from "../../../services/info/controlfunction.service";
import OrganizationService from "../../../services/management/organization.service";

import { connect } from "react-redux";
import changeAllFilter from "../../../redux/actions/filters/controlfunction";

const { t1, t2 } = Translate;
const { can } = Permission;
class ControlFunction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        name: {},
        form: {},
        parentOrganizationId: {},
        normativeLegalDoc: {},
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
                  value={this.state.filters.name.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "name")}
                  id="name"
                  placeholder={t2("name", intl)}
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
                  value={this.state.filters.form.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "form")}
                  id="form"
                  placeholder={t2("form", intl)}
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
                  value={this.state.filters.normativeLegalDoc.value || ""}
                  onChange={(e) =>
                    this.handleChangeFilters(e, "normativeLegalDoc")
                  }
                  id="normativeLegalDoc"
                  placeholder={t2("normativeLegalDoc", intl)}
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
          filter: false,
        },
        // {
        //   filter: false,
        // },
      ],
      fields: [
        { key: "id", label: "ID", sort: true },
        // { key : 'shortName',label : t2("shortname",props.intl),sort : true },
        { key: "name", label: t2("name", props.intl), sort: true },
        { key: "form", label: t2("form", props.intl), sort: true },
        {
          key: "parentOrganization",
          label: t2("parent", props.intl),
          sort: true,
          style: { width: "450px" },
        },
        {
          key: "normativeLegalDoc",
          label: t2("normativeLegalDoc", props.intl),
          sort: true,
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
      ParentOrganizationList: [],
      filter: {
        search: "",
      },
    };
    this.child = React.createRef();
  }
  componentDidMount() {
    this.setState({ filters: this.props.values });

    OrganizationService.GetAsSelectList().then((res) => {
      this.setState({ ParentOrganizationList: res.data });
    });
  }

  handleChange(event, field, data) {
    var filter = this.state.filter;
    filter[field] = !!event.target ? event.target.value : data.value;
    this.setState({ filter: filter });
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
      } else {
        filters[field].matchMode = "contains";
      }
      this.setState({ filters });
      this.props.changeAllFilter(filters);
    } else {
      if (field === "parentOrganizationId") {
        filters[field] = {};
      }
      this.setState(filters);
      this.props.changeAllFilter(filters);
    }
  }
  render() {
    const { intl, history } = this.props;
    const { fields, filter, searches, filters } = this.state;
    const routerName = "controlfunction";
    return (
      <div>
        <Card className="p-2">
          <Row>
            <Col className="text-center">
              <h1 className="pageTextView"> {t1("ControlFunction")} </h1>
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
              {can("ControlFunctionCreate") ||
              can("AllControlFunctionCreate") ? (
                <Button
                  color="primary"
                  onClick={() => history.push(`/info/edit${routerName}/0`)}
                >
                  <Icon.Plus size={14} /> {t1("Create")}{" "}
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
                api={ControlFunctionService}
                childRef={(ref) => (this.child = ref)}
                actions={() => {
                  return {
                    edit: {
                      isView:
                        can("ControlFunctionEdit") ||
                        can("AllControlFunctionEdit"),
                      router: "/info/edit" + routerName,
                    },
                    delete: {
                      isView:
                        can("ControlFunctionDelete") ||
                        can("AllControlFunctionDelete"),
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
// export default injectIntl(ControlFunction);

const mapStateToProps = (state) => {
  return {
    values: state.filters.controlfunction,
  };
};

export default connect(mapStateToProps, {
  changeAllFilter,
})(injectIntl(ControlFunction));
