import React from "react";
import {
  Card,
  Row,
  Col,
  InputGroup,
  Input,
  Button,
  InputGroupAddon,
  FormGroup,
  ButtonGroup,
} from "reactstrap";
import Select from "react-select";
import { injectIntl } from "react-intl";
import WebaseTable from "../../../components/Webase/components/Table";
import ComplaintService from "../../../services/document/complaint.service";
import * as Icon from "react-feather";
import OrganizationService from "../../../services/management/organization.service";

import moment from "moment";
import {
  Translate,
  Permission,
  Notification,
} from "../../../components/Webase/functions/index.js";
import RegionService from "../../../services/info/region.service";
import InputMask from "react-input-mask";
import DatePicker, { registerLocale } from "react-datepicker";
import MaskedTextInput from "react-text-mask";
import uz from "date-fns/locale/uz";
import uzCyrl from "date-fns/locale/uz-Cyrl";
import ru from "date-fns/locale/ru";

import { connect } from "react-redux";
import changeAllFilter from "../../../redux/actions/filters/complaint";

registerLocale("uz", uz);
registerLocale("uzCyrl", uzCyrl);
registerLocale("ru", ru);

// import HeightStyle from "./heightstyle.css";
const { t1, t2 } = Translate;
const { can } = Permission;
const { errorToast, successToast } = Notification;
class Complaint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        dateOfCreated: {},
        requestDocNumber: {},
        docDate: {},
        contractorInn: {},
        contractor: {},
        suggestion: {},
        user: {},
      },
      statusIds: [],
      searches: [
        // {
        //   filter: false,
        // },
        {
          filter: false,
        },
        // {
        //   filter: false,
        // },
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
            return (
              <InputGroup size="md">
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
            const { intl } = this.props;
            return (
              <InputGroup size="md">
                <DatePicker
                  dateFormat="dd.MM.yyyy"
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
                  value={this.state.filters.suggestion.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "suggestion")}
                  id="suggestion"
                  placeholder={t2("suggestion", props.intl)}
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
        // {
        //   key: "status",
        //   label: t2("state", props.intl),
        //   sort: true,
        //   badge: true,
        // },

        {
          key: "contractorInn",
          label: t2("inn", props.intl),
          sort: true,
        },
        {
          key: "contractor",
          label: t2("contractor", props.intl),
          sort: true,
        },
        {
          key: "requestDocNumber",
          label: t2("docNumber", props.intl),
          sort: true,
        },
        {
          key: "docDate",
          label: t2("docDate", props.intl),
          sort: true,
        },

        {
          key: "dateOfCreated",
          label: t2("dateOfCreated", props.intl),
          sort: true,
          // style: {
          //   width: "200px",
          // },
        },
        {
          key: "suggestion",
          label: t2("suggestion", props.intl),
          sort: true,
        },
        {
          key: "user",
          label: t2("User", props.intl),
          sort: true,
        },
      ],
      filter: {
        search: "",
      },
    };
    this.child = React.createRef();
  }
  handleChangeFilters(event, field, data) {
    var filters = this.state.filters;
    if (!!event) {
      filters[field].value = !!event.target ? event.target.value : data.value;
      if (field === "docDate") {
        filters[field].matchMode = "equals";
      } else if (field === "dateOfCreated") {
        filters[field].matchMode = "equals";
      } else {
        filters[field].matchMode = "contains";
      }
      this.setState({ filters });
      this.props.changeAllFilter(filters);
    } else {
      if (field === "docDate" || field === "dateOfCreated") {
        filters[field] = {};
      }
      this.setState(filters);
      this.props.changeAllFilter(filters);
    }
  }
  // handleChangeFilters(event, field, data) {
  //   var filters = this.state.filters;
  //   if (!!event) {
  //     filters[field].value = !!event.target ? event.target.value : data.value;
  //     filters[field].matchMode = "contains";
  //     this.setState({ filters });
  //   } else if (field === "docDate") {
  //     filters[field].matchMode = "equals";
  //     filters[field].text = data.text;
  //   } else {
  //     if (field === "orderedOrganizationId") {
  //       filters[field] = {};
  //       filters.inspectionOrganizationId = {};
  //       filters.authorizedOrganizationId = {};
  //     }
  //     if (field === "docDate") {
  //       filters[field] = {};
  //     }
  //     this.setState(filters);
  //   }
  // }
  componentDidMount() {
    this.setState({ filters: this.props.values });
  }

  GetExcel() {
    ComplaintService.SaveAsExecel({ filters: this.state.filters })
      .then((res) => {
        successToast(t2("DownloadSuccess", this.props.intl));
        this.forceFileDownload(res);
      })
      .catch((error) => {
        errorToast(error.response.data);
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
  handleChange(event, field, data) {
    var filter = this.state.filter;
    filter[field] = !!event.target ? event.target.value : data.value;
    this.setState({ filter: filter });
  }
  render() {
    const { intl, history } = this.props;
    const { fields, filter, searches, filters, statusIds } = this.state;
    return (
      <div>
        <Card className="p-2">
          <Row>
            <Col className="text-center">
              <h1 className="pageTextView"> {t1("Complaint")}</h1>
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
            </Col>
            <Col sm={12} md={4} lg={4}></Col>
            <Col sm={12} md={6} lg={4} className="text-right">
              <Button
                className="mr-1"
                color="primary"
                onClick={() => history.go(0)}
              >
                <Icon.RefreshCw size={18} /> {t1("Refresh")}
              </Button>
              {/* <Button
                color="primary"
                className="mr-2"
                onClick={() => this.GetExcel()}
              >
                <Icon.Printer size={22} /> {t1("Print")}{" "}
              </Button>
              {can("RequestCreate") ||
              can("BranchesRequestCreate") ||
              can("AllRequestCreate") ? (
                <Button
                  color="primary"
                  onClick={() => history.push(`/document/editrequest/0`)}
                >
                  {" "}
                  <Icon.Plus size={22} /> {t1("Create")}{" "}
                </Button>
              ) : (
                ""
              )} */}
            </Col>
          </Row>
          {/* <Row className="mt-1">
            <Col>
              <ButtonGroup>
                <Button
                  color={statusIds.length === 0 ? "primary" : "outline-primary"}
                  onClick={() =>
                    this.setState({ statusIds: [] }, () => this.child.Refresh())
                  }
                >
                  {t1("All")}
                </Button>
                <Button
                  color={statusIds[0] === 1 ? "primary" : "outline-primary"}
                  onClick={() =>
                    this.setState({ statusIds: [1, 12] }, () =>
                      this.child.Refresh()
                    )
                  }
                >
                  {t1("Create")}
                </Button>
                <Button
                  color={statusIds[0] === 2 ? "primary" : "outline-primary"}
                  onClick={() => {
                    this.setState({ statusIds: [2, 3] }, () =>
                      this.child.Refresh()
                    );
                  }}
                >
                  {t1("Send")}
                </Button>
              </ButtonGroup>
            </Col>
          </Row> */}
          <Row className="mt-2">
            <Col>
              <WebaseTable
                fields={fields}
                filter={filter}
                searches={searches}
                api={ComplaintService}
                filters={{ filters: this.props.values, statusIds }}
                width={false}
                childRef={(ref) => (this.child = ref)}
                actions={(id) => {
                  return {
                    view: {
                      isView: true,
                      router: "/document/viewcomplaint",
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
// export default injectIntl(Complaint);
const mapStateToProps = (state) => {
  return {
    values: state.filters.complaint,
  };
};

export default connect(mapStateToProps, {
  changeAllFilter,
})(injectIntl(Complaint));
