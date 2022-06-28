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
import NewsService from "../../../services/info/news.service";

import moment from "moment";

import DatePicker, { registerLocale } from "react-datepicker";
import MaskedTextInput from "react-text-mask";
import uz from "date-fns/locale/uz";
import uzCyrl from "date-fns/locale/uz-Cyrl";
import ru from "date-fns/locale/ru";

import { connect } from "react-redux";
import changeAllFilter from "../../../redux/actions/filters/news";

registerLocale("uz", uz);
registerLocale("uzCyrl", uzCyrl);
registerLocale("ru", ru);

// import { DatePicker, Space } from "antd";
// import "moment/locale/ru";
// import locale from "antd/es/date-picker/locale/ru_RU";

const { t1, t2 } = Translate;
const { can } = Permission;
class News extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: {
        title: {},
        date: {},
      },
      searches: [
        {
          filters: false,
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
                  value={this.state.filters.title.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "title")}
                  id="title"
                  placeholder={t2("Title", intl)}
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
              <InputGroup size="md" className="datePicker">
                <DatePicker
                  dateFormat="dd.MM.yyyy"
                  selected={
                    this.state.filters.date.value
                      ? moment(
                          this.state.filters.date.value,
                          "DD.MM.YYYY"
                        ).toDate()
                      : ""
                  }
                  onChange={(date, dateString) => {
                    this.handleChangeFilters(date, "date", {
                      value: moment(new Date(date)).format("DD.MM.YYYY"),
                    });
                    this.child.Refresh();
                  }}
                  isClearable={!!this.state.filters.date.value ? true : false}
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
                <InputGroupAddon addonType="append">
                  <Button color="primary" size="sm">
                    <Icon.Calendar id={"translate"} size={15} />
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
      ],
      fields: [
        {
          key: "id",
          label: t2("ID", props.intl),
          sort: true,
        },
        { key: "title", label: t2("Title", props.intl), sort: true },
        // { key: "content", label: t2("content", props.intl), sort: true },
        { key: "date", label: t2("docDate", props.intl), sort: true },
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
  componentDidMount() {
    this.setState({ filters: this.props.values });
  }
  handleChangeFilters(event, field, data) {
    var filters = this.state.filters;
    if (!!event) {
      filters[field].value = !!event.target ? event.target.value : data.value;
      if (field === "date") {
        filters[field].matchMode = "equals";
      } else {
        filters[field].matchMode = "contains";
      }
      this.setState({ filters });
      this.props.changeAllFilter(filters);
    } else {
      if (field === "date") {
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
    const { fields, filter, filters, searches } = this.state;
    const routerName = "news";
    return (
      <div>
        <Card className="p-2">
          <Row>
            <Col className="text-center">
              <h1 className="pageTextView"> {t1("News")} </h1>
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
                    {" "}
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
              {can("NewsCreate") ? (
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
                filters={{ filters: this.props.values }}
                searches={searches}
                api={NewsService}
                childRef={(ref) => (this.child = ref)}
                actions={() => {
                  return {
                    edit: {
                      isView: can("NewsEdit"),
                      router: "/info/edit" + routerName,
                    },
                    delete: {
                      isView: can("NewsDelete"),
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
// export default injectIntl(News);

const mapStateToProps = (state) => {
  return {
    values: state.filters.news,
  };
};

export default connect(mapStateToProps, {
  changeAllFilter,
})(injectIntl(News));
