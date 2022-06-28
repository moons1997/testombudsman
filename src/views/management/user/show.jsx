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
import RequestService from "../../../services/document/request.service";
import * as Icon from "react-feather";
import {
  Translate,
  Permission,
} from "../../../components/Webase/functions/index.js";
import EmployeeService from "../../../services/info/employee.service";
const { t1, t2 } = Translate;
const { can } = Permission;
class Request extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [
        {
          key: "id",
          label: t2("ID", props.intl),
          sort: true,
        },
        {
          key: "contractorInn",
          label: t2("contractorInn", props.intl),
          sort: true,
        },
        { key: "contractor", label: t2("contractor", props.intl), sort: true },
        { key: "docNumber", label: t2("docNumber", props.intl), sort: true },
        {
          key: "orderedOrganization",
          label: t2("orderedOrganizationId", props.intl),
          sort: true,
        },
        {
          key: "inspectionOrganization",
          label: t2("inspectionOrganizationId", props.intl),
          sort: true,
        },
        {
          key: "authorizedOrganization",
          label: t2("authorizedOrganizationId", props.intl),
          sort: true,
        },
        {
          key: "region",
          label: t2("Region", props.intl),
          sort: true,
        },
        {
          key: "status",
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
      GetInfo: {},
    };
    this.child = React.createRef();
  }
  componentDidMount() {
    EmployeeService.Get(this.props.location.state.id).then((res) => {
      this.setState({ GetInfo: res.data.person });
    });
  }

  handleChange(event, field, data) {
    var filter = this.state.filter;
    filter[field] = !!event.target ? event.target.value : data.value;
    this.setState({ filter: filter });
  }
  render() {
    const { intl, history } = this.props;
    const { fields, filter, GetInfo } = this.state;

    return (
      <div>
        <Card className="p-2">
          {GetInfo.surnameLatin != null ? (
            <Row>
              <Col>
                <h1
                  style={{ fontWeight: "bold" }}
                  className="text-success mb-2"
                >
                  {" "}
                  <Icon.CheckCircle />{" "}
                  {GetInfo.surnameLatin +
                    " " +
                    GetInfo.nameLatin +
                    " " +
                    GetInfo.patronymLatin}{" "}
                </h1>
              </Col>
            </Row>
          ) : (
            ""
          )}
          <Row>
            <Col sm={12} md={6} lg={4}>
              <InputGroup>
                <Input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { this.child.props.values.page = 1;
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
            <Col className="text-right" sm={12} md={6} lg={4}></Col>
            <Col className="text-right" sm={12} md={6} lg={2}>
              <Button color="primary" onClick={() => history.go(0)}>
                <Icon.RefreshCw size={18} /> {t1("Refresh")}
              </Button>
            </Col>
            <Col className="text-right" sm={12} md={6} lg={2}>
              <Button
                style={{ width: "100%", marginBottom: "5px" }}
                className="mr-2"
                color="danger"
                onClick={() => history.goBack()}
              >
                <Icon.ArrowLeft size={18} /> {t1("back")}{" "}
              </Button>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <WebaseTable
                fields={fields}
                filter={filter}
                api={RequestService}
                options={{
                  statusIds: [],
                  fromDocDate: "",
                  toDocDate: "",
                  inspectorId: this.props.location.state.id,
                  search: "",
                  sortBy: "",
                  orderType: "asc",
                  page: 1,
                  pageSize: 20,
                }}
                childRef={(ref) => (this.child = ref)}
                actions={() => {
                  return {
                    view: {
                      isView: true,
                      router: "/document/viewrequest",
                    },
                    // edit: {
                    //   isView: can("RequestEdit"),
                    //   router: "/document/editrequest",
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
export default injectIntl(Request);
