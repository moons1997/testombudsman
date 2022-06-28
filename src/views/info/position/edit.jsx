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
import PositionService from "../../../services/info/position.service";
import PositionClassifierService from "../../../services/info/positionclassifier.service";
import Overlay from "../../../components/Webase/components/Overlay";
import ManualService from "../../../services/other/manual.service";
import Select from "react-select";
import * as Icon from "react-feather";
import {
  Notification,
  Translate,
  Permission,
} from "../../../components/Webase/functions";

import { injectIntl } from "react-intl";
import OrganizationService from "../../../services/management/organization.service";
const { t1, t2 } = Translate;
const { errorToast, successToast } = Notification;
const { can } = Permission;
class EditBank extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.state = {
      position: {},
      loading: false,
      SaveLoading: false,
      StateList: [],
      PositionClassifierList: [],
      ParentList: [],
      activeModal: "",
      modal: false,
      languageList: [],
    };
  }
  //Created
  componentDidMount() {
    this.GetDataLanguage();
    this.GetDataList();
  }
  GetDataLanguage = () => {
    ManualService.LanguageSelectList().then((res) => {
      this.setState({ languageList: res.data }, () => {
        this.Refresh();
      });
    });
  };
  translateObjects = (data) => {
    var objects = [];
    if (data.translates.length === 0) {
      if ("shortName" in data) {
        this.state.languageList.map((item) => {
          objects.push({
            language: item.fullName,
            columnName: "short_name",
            languageId: item.value,
            translateText: "",
          });
        });
      }
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
    PositionService.Get(this.props.ID ? 0 : this.props.match.params.id)
      .then((res) => {
        this.setState({
          position: {
            ...res.data,
            // translates: this.translateObjects(res.data),
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
    // PositionClassifierService.GetAsSelectList().then((res) => {
    //   this.setState({ PositionClassifierList: res.data });
    // });
    OrganizationService.GetAsSelectList().then((res) => {
      this.setState({ ParentList: res.data });
    });
  };
  handleChange(event, field, data) {
    var position = this.state.position;
    if (!!event) {
      position[field] = !!event.target ? event.target.value : data.value;

      if (field == "parentOrganizationId") {
        position.parentOrganization = this.state.ParentList.filter(
          (item) => item.value == data.value
        )[0].text;
      }
      this.setState({ position: position });
    } else {
      if (field == "parentOrganizationId") {
        position.parentOrganization = "";
        position.parentOrganizationId = "";
      }
      if (field == "stateId") {
        position.stateId = "";
      }
      this.setState({ position: position });
    }
  }
  SaveData = () => {
    this.setState({ SaveLoading: true })
    this.state.position.stateId = 1
    PositionService.Update(this.state.position)
      .then((res) => {
        this.setState({ SaveLoading: false });
        successToast(t2("SuccessSave", this.props.intl));

        setTimeout(() => {
          if (this.props.ID) {
            // this.props.Refresh();
            this.props.CloseModal();
          } else {
            this.props.history.push("/info/position");
          }
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
  changeTranslate(value, item) {
    const { position, activeModal } = this.state;

    if (item.languageId == 1 && activeModal == "full_name") {
      position.fullName = value.target.value;
    }
    if (item.languageId == 1 && activeModal == "short_name") {
      position.shortName = value.target.value;
    }

    position.translates.map(function (el) {
      if (el.languageId == item.languageId && el.columnName == activeModal) {
        el.translateText = value.target.value;
      }
    });
    this.setState({ position: position });
  }

  render() {
    const {
      loading,
      SaveLoading,
      StateList,
      PositionClassifierList,
      position,
      ParentList,
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
            {position.translates?.map((item, index) =>
              item.columnName == this.state.activeModal ? (
                <FormGroup key={index}>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      {item.language}
                    </InputGroupAddon>
                    <Input
                      type="textarea"
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
              <h1 className="pageTextView"> {t1("Positions")} </h1>
            </Col>
          </Row>
          <Row>
            {/* <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("orderCode")} </h5>
                <Input
                  type="text"
                  value={position.orderCode || ""}
                  onChange={(e) => this.handleChange(e, "orderCode")}
                  id="orderCode"
                  placeholder={t2("orderCode", intl)}
                />
              </FormGroup>
            </Col> */}
            {/* <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("code")} </h5>
                <Input
                  type="text"
                  value={position.code || ""}
                  onChange={(e) => this.handleChange(e, "code")}
                  id="code"
                  placeholder={t2("code", intl)}
                />
              </FormGroup>
            </Col> */}
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("shortname")} </h5>

                <InputGroup>
                  <Input
                    type="textarea"
                    value={position.shortName || ""}
                    onChange={(e) => this.handleChange(e, "shortName")}
                    id="shortName"
                    placeholder={t2("shortname", intl)}
                    // disabled
                  />
                  <InputGroupAddon addonType="append">
                    {/* <Button
                      disabled
                      color="primary"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "short_name" });
                      }}
                    >
                      <Icon.Globe size={14} />
                    </Button> */}
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("fullname")} </h5>

                <InputGroup>
                  <Input
                    type="textarea"
                    value={position.fullName || ""}
                    onChange={(e) => this.handleChange(e, "fullName")}
                    id="fullName"
                    placeholder={t2("fullname", intl)}
                    // disabled
                  />
                  <InputGroupAddon addonType="append">
                    {/* <Button
                      disabled
                      color="primary"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "full_name" });
                      }}
                    >
                      <Icon.Globe size={14} />
                    </Button> */}
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </Col>
            {/* <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("PositionClassifier")}</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{
                    text: position.positionClassifier || t2("Choose", intl),
                  }}
                  name="color"
                  options={PositionClassifierList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) =>
                    this.handleChange(e, "positionClassifierId", e)
                  }
                />
              </FormGroup>
            </Col> */}
            {/* <Col sm={12} md={8} lg={8}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("parent")}</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{
                    text: position.parentOrganization || t2("Choose", intl),
                  }}
                  value={{
                    text: position.parentOrganization || t2("Choose", intl),
                  }}
                  name="color"
                  options={ParentList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  isDisabled={
                    can("AllPositionCreate")
                      ? false
                      : can("PositionCreate")
                      ? true
                      : false
                  }
                  onChange={(e) =>
                    this.handleChange(e, "parentOrganizationId", e)
                  }
                  isClearable
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("state")}</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{ text: position.state || t2("Choose", intl) }}
                  name="color"
                  options={StateList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => this.handleChange(e, "stateId", e)}
                  isClearable
                />
              </FormGroup>
            </Col> */}
          </Row>
          <Row>
            <Col className="text-right">
              {this.props.ID ? null : (
                <Button
                  className="mr-1"
                  color="danger"
                  onClick={() => history.push("/info/position")}
                >
                  {t1("back")}
                </Button>
              )}

              <Button color="success" onClick={this.SaveData}>
                {SaveLoading ? <Spinner size="sm" /> : ""} {t1("Save")}
              </Button>
            </Col>
          </Row>
        </Card>
      </Overlay>
    );
  }
}
export default injectIntl(EditBank);
