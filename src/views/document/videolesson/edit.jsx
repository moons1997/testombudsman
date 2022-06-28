import React from "react";
import { Card, Row, Col, FormGroup, Input, Button, Spinner } from "reactstrap";
import Overlay from "../../../components/Webase/components/Overlay";
import ManualService from "../../../services/other/manual.service";
import Select from "react-select";
import { Notification, Translate } from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
import VideoLessonService from "../../../services/document/videolesson.service";

import * as Icon from "react-feather";
import VideoCategoryService from "../../../services/info/videocategory.service";
const { t1, t2 } = Translate;
const { errorToast, successToast } = Notification;
class EditVideoLesson extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      SaveLoading: false,
      StateList: [],
      modal: false,
      languageList: [],
      activeModal: "",
      videolesson: {},
      CategoryList: [],
    };
  }
  //Created
  componentDidMount() {
    this.Refresh();
    this.GetDataList();
  }

  // methods
  Refresh = () => {
    this.setState({ loading: true });
    VideoLessonService.Get(this.props.match.params.id)
      .then((res) => {
        this.setState({
          videolesson: {
            ...res.data,
          },
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        errorToast(error.response.data);
      });
  };
  GetDataList = () => {
    ManualService.StateSelectList().then((res) => {
      this.setState({ StateList: res.data });
    });
    VideoCategoryService.GetAsSelectList().then((res) => {
      this.setState({ CategoryList: res.data });
    });
  };
  handleChange(event, field, data) {
    var videolesson = this.state.videolesson;
    if (!!event) {
      videolesson[field] = !!event.target ? event.target.value : data.value;

      this.setState({ videolesson: videolesson });

      if (field == "categoryId") {
        videolesson.category = this.state.CategoryList.filter(
          (item) => item.value === videolesson.categoryId
        )[0].text;
      }
      if (field == "stateId") {
        videolesson.state = this.state.StateList.filter(
          (item) => item.value === videolesson.stateId
        )[0].text;
      }
    } else {
      if (field === "stateId") {
        videolesson.stateId = null;
        videolesson.state = "";
      }
      if (field === "categoryId") {
        videolesson.categoryId = null;
        videolesson.category = "";
      }
      this.setState({ videolesson: videolesson });
    }
  }

  SaveData = () => {
    this.setState({ SaveLoading: true });
    VideoLessonService.Update(this.state.videolesson)
      .then((res) => {
        this.setState({ SaveLoading: false });
        successToast(t2("SuccessSave", this.props.intl));

        setTimeout(() => {
          this.props.history.push("/document/videolesson");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ SaveLoading: false });
      });
  };

  render() {
    const { loading, SaveLoading, StateList, videolesson, CategoryList } =
      this.state;
    const { history, intl } = this.props;
    //template
    return (
      <Overlay show={loading}>
        <Card className="p-2">
          <Row>
            <Col className="text-center mb-2">
              <h2 className="pageTextView"> {t1("Videolesson")} </h2>
            </Col>
          </Row>
          <Row>
            {/* <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("code")} </h5>
                <Input
                  type="text"
                  value={videolesson.number || ""}
                  onChange={(e) => this.handleChange(e, "number")}
                  id="code"
                  placeholder={t2("code", intl)}
                />
              </FormGroup>
            </Col> */}

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("theme")} </h5>
                <Input
                  type="text"
                  value={videolesson.theme || ""}
                  onChange={(e) => this.handleChange(e, "theme")}
                  id="theme"
                  placeholder={t2("theme", intl)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("tag")} </h5>
                <Input
                  type="text"
                  value={videolesson.tag || ""}
                  onChange={(e) => this.handleChange(e, "tag")}
                  id="tag"
                  placeholder={t2("tag", intl)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("uri")} </h5>
                <Input
                  type="text"
                  value={videolesson.uri || ""}
                  onChange={(e) => this.handleChange(e, "uri")}
                  id="uri"
                  placeholder={t2("uri", intl)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("category")}</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{
                    text: videolesson.category || t2("Choose", intl),
                  }}
                  value={{
                    text: videolesson.category || t2("Choose", intl),
                  }}
                  isClearable
                  name="state"
                  options={CategoryList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => this.handleChange(e, "categoryId", e)}
                />
              </FormGroup>
            </Col>
            {this.props.match.params.id == 0 ? (
              ""
            ) : (
              <Col sm={12} md={6} lg={4}>
                <FormGroup>
                  <h5 className="text-bold-600">{t1("state")}</h5>
                  <Select
                    className="React"
                    classNamePrefix="select"
                    defaultValue={{
                      text: videolesson.state || t2("Choose", intl),
                    }}
                    value={{
                      text: videolesson.state || t2("Choose", intl),
                    }}
                    isClearable
                    name="state"
                    options={StateList}
                    label="text"
                    getOptionLabel={(item) => item.text}
                    onChange={(e) => this.handleChange(e, "stateId", e)}
                  />
                </FormGroup>
              </Col>
            )}
          </Row>
          <Row>
            <Col className="text-right">
              <Button
                className="mr-1"
                color="danger"
                onClick={() => history.push("/document/videolesson")}
              >
                {" "}
                {t1("back")}{" "}
              </Button>
              {/* </Col>
            <Col className="text-right"> */}
              <Button color="success" onClick={this.SaveData}>
                {" "}
                {SaveLoading ? <Spinner size="sm" /> : ""} {t1("Save")}{" "}
              </Button>
            </Col>
          </Row>
        </Card>
      </Overlay>
    );
  }
}
export default injectIntl(EditVideoLesson);
