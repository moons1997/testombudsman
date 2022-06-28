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
import PositionService from "../../../services/info/position.service";
const { t1, t2 } = Translate;
const { can } = Permission;
const { errorToast, successToast, customErrorToast } = Notification;
class Position extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
        // { key: "code", label: t2("code", props.intl), sort: true },
        // { key: "orderCode", label: t2("orderCode", props.intl), sort: true },
        // { key: "shortName", label: t2("shortname", props.intl), sort: true },
        { key: "fullName", label: t2("fullname", props.intl), sort: true },
        {
          key: "parentOrganization",
          label: t2("parentOrganization", props.intl),
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
      excelLoad: false,
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
  GetExcel() {
    this.setState({ excelLoad: true });
    PositionService.SaveAsExecel(this.state.filter)
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
    link.setAttribute("download", t2("Position", intl) + "." + "xlsx");
    // }
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }
  render() {
    const { intl, history } = this.props;
    const { fields, filter } = this.state;
    const routerName = "position";
    return (
      <div>
        <Card className="p-2">
          <Row>
            <Col className="text-center">
              <h1 className="pageTextView"> {t1("Positions")} </h1>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6} lg={4}>
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
            <Col sm={12} md={6} lg={8} className="text-right">
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
              {can("PositionCreate") || can("AllPositionCreate") ? (
                <Button
                  color="primary"
                  onClick={() => history.push(`/info/edit${routerName}/0`)}
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
                api={PositionService}
                childRef={(ref) => (this.child = ref)}
                actions={() => {
                  return {
                    edit: {
                      isView: can("PositionEdit"),
                      router: "/info/edit" + routerName,
                    },
                    delete: {
                      isView: can("PositionDelete"),
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
export default injectIntl(Position);
