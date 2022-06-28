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
import VideoLessonService from "../../../services/document/videolesson.service";

import { connect } from "react-redux";
import changeAllFilter from "../../../redux/actions/filters/videolesson";

const { t1, t2 } = Translate;
const { can } = Permission;
class VideoLesson extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        tag: {},
        theme: {},
        category: {},
        number: {},
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
                  value={this.state.filters.number.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "number")}
                  id="number"
                  placeholder={t2("docNumber", intl)}
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
                  value={this.state.filters.category.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "category")}
                  id="category"
                  placeholder={t2("category", intl)}
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
                  value={this.state.filters.theme.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "theme")}
                  id="theme"
                  placeholder={t2("theme", intl)}
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
                  value={this.state.filters.tag.value || ""}
                  onChange={(e) => this.handleChangeFilters(e, "tag")}
                  id="tag"
                  placeholder={t2("tag", intl)}
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
      ],
      fields: [
        { key: "id", label: "ID", sort: true },
        // { key : 'shortName',label : t2("shortname",props.intl),sort : true },
        { key: "number", label: t2("docNumber", props.intl), sort: true },
        { key: "category", label: t2("category", props.intl), sort: true },
        { key: "theme", label: t2("theme", props.intl), sort: true },
        { key: "tag", label: t2("tag", props.intl), sort: true },
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

  handleChange(event, field, data) {
    var filter = this.state.filter;
    filter[field] = !!event.target ? event.target.value : data.value;
    this.setState({ filter: filter });
  }
  handleChangeFilters(event, field, data) {
    var filters = this.state.filters;
    if (!!event) {
      filters[field].value = !!event.target ? event.target.value : data.value;
      if (field === "organizationId") {
        filters[field].matchMode = "equals";
      } else {
        filters[field].matchMode = "contains";
      }
      this.setState({ filters });
      this.props.changeAllFilter(filters);
    } else {
      if (field === "organizationId") {
        filters[field] = {};
        this.setState(filters);
        this.props.changeAllFilter(filters);
      }
    }
  }
  render() {
    const { intl, history } = this.props;
    const { fields, filter, searches, filters } = this.state;
    const routerName = "videolesson";
    return (
      <div>
        <Card className="p-2">
          <Row>
            <Col className="text-center">
              <h1 className="pageTextView"> {t1("Videolesson")} </h1>
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
              {can("VideoLessonCreate") ? (
                <Button
                  color="primary"
                  onClick={() => history.push(`/document/edit${routerName}/0`)}
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
                filters={{ filters: this.props.values }}
                searches={searches}
                api={VideoLessonService}
                childRef={(ref) => (this.child = ref)}
                actions={(id) => {
                  return {
                    edit: {
                      isView: can("VideoLessonEdit"),
                      router: "/document/edit" + routerName,
                    },
                    delete: {
                      isView: can("VideoLessonDelete"),
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
// export default injectIntl(VideoLesson);

const mapStateToProps = (state) => {
  return {
    values: state.filters.videolesson,
  };
};

export default connect(mapStateToProps, {
  changeAllFilter,
})(injectIntl(VideoLesson));
