import React from "react";
import {
  Card,
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  Spinner,
  InputGroup,
  InputGroupAddon,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import CheckTypeService from "../../../services/info/checktype.service";
import Overlay from "../../../components/Webase/components/Overlay";
import ManualService from "../../../services/other/manual.service";
import Select from "react-select";
import { Notification, Translate } from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
import VideoCategoryService from "../../../services/info/videocategory.service";
import * as Icon from "react-feather";
const { t1, t2 } = Translate;
const { errorToast, successToast } = Notification;
class EditVideoCategory extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.state = {
      checktype: {},
      loading: false,
      SaveLoading: false,
      StateList: [],
      videocategory: [],
      modal: false,
      languageList: [],
      activeModal: "",
    };
  }
  //Created
  componentDidMount() {
    this.GetDataLanguage();
    this.GetDataList();
  }
  GetDataLanguage = () => {
    ManualService.LanguageSelectList()
      .then((res) => {
        this.setState({ languageList: res.data }, () => {
          this.Refresh();
        });
      })
      .then((res) => {});
  };
  translateObjects = (data) => {
    var objects = [];
    if (data.translates.length === 0) {
      // if ("shortName" in data) {
      //   this.state.languageList.map((item) => {
      //     objects.push({
      //       language: item.fullName,
      //       columnName: "short_name",
      //       languageId: item.value,
      //       translateText: "",
      //     });
      //   });
      // }
      if ("fullName" in data) {
        this.state.languageList.map((item) => {
          objects.push({
            language: item.fullName,
            columnName: "full_name",
            languageId: item.value,
            translateText: "",
          });
        });
      }
      return objects;
    } else {
      return data.translates;
    }
  };
  // methods
  Refresh = () => {
    this.setState({ loading: true });
    VideoCategoryService.Get(this.props.match.params.id)
      .then((res) => {
        this.setState({
          videocategory: {
            ...res.data,
            translates: this.translateObjects(res.data),
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
  };
  handleChange(event, field, data) {
    var videocategory = this.state.videocategory;
    if (!!event) {
      videocategory[field] = !!event.target ? event.target.value : data.value;
      if (field == "stateId") {
        videocategory.state = this.state.StateList.filter(
          (item) => item.value == data.value
        )[0].text;
      }
      this.setState({ videocategory: videocategory });
    } else {
      if (field === "stateId") {
        videocategory.state = "";
        videocategory.stateId = null;
      }
      this.setState({ videocategory: videocategory });
    }
  }
  changeTranslate(value, item) {
    const { videocategory, activeModal } = this.state;
    if (item.languageId == 1 && activeModal == "full_name") {
      videocategory.fullName = value.target.value;
    }
    // if (item.languageId == 1 && activeModal == "short_name") {
    //   videocategory.shortName = value.target.value;
    // }
    videocategory.translates.map(function (el) {
      if (el.languageId == item.languageId && el.columnName == activeModal) {
        el.translateText = value.target.value;
      }
    });
    this.setState({ videocategory: videocategory });
  }
  SaveData = () => {
    this.setState({ SaveLoading: true });
    VideoCategoryService.Update(this.state.videocategory)
      .then((res) => {
        this.setState({ SaveLoading: false });
        successToast(t2("SuccessSave", this.props.intl));

        setTimeout(() => {
          this.props.history.push("/info/videocategory");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ SaveLoading: false });
      });
  };
  toggleModal = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  render() {
    const {
      loading,
      SaveLoading,
      StateList,
      videocategory,
      modal,
      activeModal,
    } = this.state;
    const { history, intl } = this.props;
    //template
    return (
      <Overlay show={loading}>
        <Modal isOpen={modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            {activeModal == "short_name" && t1("shortname")}
            {activeModal == "full_name" && t1("fullname")}
          </ModalHeader>
          <ModalBody>
            {videocategory.translates?.map((item, index) =>
              item.columnName == this.state.activeModal ? (
                <FormGroup key={index}>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      {item.language}
                    </InputGroupAddon>
                    <Input
                      type="text"
                      value={item.translateText || ""}
                      onChange={(e) => this.changeTranslate(e, item)}
                      id={item.languageId}
                    />
                  </InputGroup>
                </FormGroup>
              ) : (
                ""
              )
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="success"
              onClick={() => {
                this.toggleModal();
              }}
            >
              {t1("Add")}
            </Button>{" "}
          </ModalFooter>
        </Modal>
        <Card className="p-2">
          <Row>
            <Col className="text-center mb-1">
              <h1 className="pageTextView"> {t1("Videocategory")} </h1>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("code")} </h5>
                <Input
                  type="text"
                  value={videocategory.code || ""}
                  onChange={(e) => this.handleChange(e, "code")}
                  id="code"
                  placeholder={t2("code", intl)}
                />
              </FormGroup>
            </Col>
            {/* <Col sm={12} md={6} lg={4}>
              <h5 className="text-bold-600"> {t1("shortname")} </h5>
              <FormGroup>
                <InputGroup>
                  <Input
                    type="text"
                    value={videocategory.shortName || ""}
                    onChange={(e) => this.handleChange(e, "shortName")}
                    id="shortName"
                    placeholder={t2("shortname", intl)}
                    disabled
                  />
                  <InputGroupAddon addonType="append">
                    <Button
                      color="primary"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "short_name" });
                      }}
                    >
                      <Icon.Globe id={"translate"} size={16} />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </Col> */}
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("name")} </h5>

                <InputGroup>
                  <Input
                    type="text"
                    value={videocategory.fullName || ""}
                    onChange={(e) => this.handleChange(e, "fullName")}
                    id="fullName"
                    placeholder={t2("name", intl)}
                    disabled
                  />
                  <InputGroupAddon addonType="append">
                    <Button
                      color="primary"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "full_name" });
                      }}
                    >
                      <Icon.Globe id={"translate"} size={16} />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </Col>
            {/* <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("orderCode")} </h5>
                <Input
                  type="text"
                  value={videocategory.orderCode || ""}
                  onChange={(e) => this.handleChange(e, "orderCode")}
                  id="orderCode"
                  placeholder={t2("orderCode", intl)}
                />
              </FormGroup>
            </Col> */}
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
                      text: videocategory.state || t2("Choose", intl),
                    }}
                    value={{
                      text: videocategory.state || t2("Choose", intl),
                    }}
                    isClearable
                    name="color"
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
                onClick={() => history.push("/info/videocategory")}
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
export default injectIntl(EditVideoCategory);
