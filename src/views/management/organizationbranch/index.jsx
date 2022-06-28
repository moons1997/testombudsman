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
import {
  Translate,
  Permission,
} from "../../../components/Webase/functions/index.js";
import OrganizationBranchService from "../../../services/management/organizationbranch.service";
const { t1, t2 } = Translate;
const { can } = Permission;
class OrganizationBranch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [
        { key: "id", label: "ID", sort: true },
        { key: "code", label: t2("code", props.intl), sort: true },
        // { key: "shortName", label: t2("shortname", props.intl), sort: true },
        { key: "fullName", label: t2("fullname", props.intl), sort: true },
        { key: "region", label: t2("Region", props.intl), sort: true },
        { key: "district", label: t2("District", props.intl), sort: true },
        {
          key: "organization",
          label: t2("Organization", props.intl),
          sort: true,
        },
        { key: "address", label: t2("Address", props.intl), sort: true },
        {
          key: "bank",
          label: t2("Bank", props.intl),
          sort: true,
        },
        { key: "bankCode", label: t2("BankCode", props.intl), sort: true },
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
      filter: {
        search: "",
      },
    };
    this.child = React.createRef();
  }
  componentDidMount() {}

  handleChange(event, field, data) {
    var filter = this.state.filter;
    filter[field] = !!event.target ? event.target.value : data.value;
    this.setState({ filter: filter });
  }
  render() {
    const { intl, history } = this.props;
    const { fields, filter } = this.state;
    const routerName = "organizationbranch";
    return (
      <div>
        <Card className="p-2">
          <Row>
            <Col>
              <h1 style={{ fontWeight: "bold" }}>
                {" "}
                {t1("OrganizationBranch")}{" "}
              </h1>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6} lg={4}>
              <InputGroup>
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
              </InputGroup>
            </Col>
            <Col sm={12} md={6} lg={8} className="text-right">
              {can("OrganizationBranchCreate") ? (
                <Button
                  color="primary"
                  onClick={() =>
                    history.push(`/management/edit${routerName}/0`)
                  }
                >
                  {" "}
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
                fields={fields}
                filter={filter}
                api={OrganizationBranchService}
                childRef={(ref) => (this.child = ref)}
                actions={() => {
                  return {
                    edit: {
                      isView: can("OrganizationBranchEdit"),
                      router: "/management/edit" + routerName,
                    },
                    delete: {
                      isView: can("OrganizationBranchDelete"),
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
export default injectIntl(OrganizationBranch);
