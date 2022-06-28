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
import CheckingQuizService from "../../../services/info/checkingquiz.service";
import Overlay from "../../../components/Webase/components/Overlay";
import ManualService from "../../../services/other/manual.service";
import Select from "react-select";
import {
  Notification,
  Translate,
  Permission,
} from "../../../components/Webase/functions";
import * as Icon from "react-feather";
import { injectIntl } from "react-intl";
import OrganizationService from "../../../services/management/organization.service";
const { t1, t2 } = Translate;
const { errorToast, successToast } = Notification;
const { can } = Permission;
class EditCheckingQuiz extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.state = {
      checkingquiz: {},
      loading: false,
      SaveLoading: false,
      StateList: [],
      OrganizationList: [],
      activeModal: "",
      modal: false,
      languageList: [],
    };
  }
  //Created
  componentDidMount() {
    this.GetDataLanguage();
    this.Refresh();
    this.GetDataList();
  }
  GetDataLanguage = () => {
    ManualService.LanguageSelectList().then((res) => {
      this.setState({ languageList: res.data });
    });
  };
  translateObjects = (data) => {
    var objects = [];
    if (data.translates.length === 0) {
      if ("normativeLegalDoc" in data) {
        this.state.languageList.map((item) => {
          objects.push({
            language: item.fullName,
            columnName: "normative_legal_doc",
            languageId: item.value,
            translateText: "",
          });
        });
      }
      if ("question" in data) {
        this.state.languageList.map((item) => {
          objects.push({
            language: item.fullName,
            columnName: "question",
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
    CheckingQuizService.Get(this.props.match.params.id)
      .then((res) => {
        this.setState({
          checkingquiz: {
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
    OrganizationService.GetAsSelectList().then((res) => {
      this.setState({ OrganizationList: res.data });
    });
  };
  handleChange(event, field, data) {
    var checkingquiz = this.state.checkingquiz;
    if (!!event) {
      checkingquiz[field] = !!event.target ? event.target.value : data.value;
      if (field == "organizationId") {
        checkingquiz.organization = this.state.OrganizationList.filter(
          (item) => item.value == data.value
        )[0].text;
      }
      if (field == "stateId") {
        checkingquiz.state = this.state.StateList.filter(
          (item) => item.value == data.value
        )[0].text;
      }
      this.setState({ checkingquiz: checkingquiz });
    } else {
      if (field === "organizationId") {
        checkingquiz.organization = "";
        checkingquiz.organizationId = null;
      }
      if (field === "stateId") {
        checkingquiz.state = "";
        checkingquiz.stateId = null;
      }
      this.setState({ checkingquiz: checkingquiz });
    }
  }
  SaveData = () => {
    this.setState({ SaveLoading: true });
    CheckingQuizService.Update(this.state.checkingquiz)
      .then((res) => {
        this.setState({ SaveLoading: false });
        successToast(t2("SuccessSave", this.props.intl));

        setTimeout(() => {
          this.props.history.push("/info/checkingquiz");
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
    const { checkingquiz, activeModal } = this.state;

    if (item.languageId == 1 && activeModal == "normative_legal_doc") {
      checkingquiz.normativeLegalDoc = value.target.value;
    }
    if (item.languageId == 1 && activeModal == "question") {
      checkingquiz.question = value.target.value;
    }

    checkingquiz.translates.map(function (el) {
      if (el.languageId == item.languageId && el.columnName == activeModal) {
        el.translateText = value.target.value;
      }
    });
    this.setState({ checkingquiz: checkingquiz });
  }

  render() {
    const {
      loading,
      SaveLoading,
      StateList,
      OrganizationList,
      checkingquiz,
      modal,
      activeModal,
    } = this.state;
    const { history, intl } = this.props;
    //template
    return (
      <Overlay show={loading}>
        <Modal isOpen={modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            {activeModal == "question" && t1("Question")}
            {activeModal == "normative_legal_doc" && t1("normativeLegalDoc")}
          </ModalHeader>
          <ModalBody>
            {checkingquiz.translates?.map((item, index) =>
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
              <h1 className="pageTextView"> {t1("CheckingQuiz")} </h1>
            </Col>
          </Row>
          <Row>
            {/* <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("code")} </h5>
                <Input
                  type="text"
                  value={checkingquiz.code || ""}
                  onChange={(e) => this.handleChange(e, "code")}
                  id="code"
                  placeholder={t2("code", intl)}
                />
              </FormGroup>
            </Col> */}
            {/* <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("orderCode")} </h5>
                <Input
                  type="text"
                  value={checkingquiz.orderCode || ""}
                  onChange={(e) => this.handleChange(e, "orderCode")}
                  id="orderCode"
                  placeholder={t2("orderCode", intl)}
                />
              </FormGroup>
            </Col> */}
            <Col sm={12} md={6} lg={6}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("Question")} </h5>

                <InputGroup>
                  <Input
                    type="textarea"
                    value={checkingquiz.question || ""}
                    onChange={(e) => this.handleChange(e, "question")}
                    id="question"
                    placeholder={t2("Question", intl)}
                  />
                  {/* <InputGroupAddon addonType="append">
                    <Button
                      color="primary"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "question" });
                      }}
                    >
                      <Icon.Globe size={14} />
                    </Button>
                  </InputGroupAddon> */}
                </InputGroup>
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={6}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("normativeLegalDoc")} </h5>

                <InputGroup>
                  <Input
                    type="textarea"
                    value={checkingquiz.normativeLegalDoc || ""}
                    onChange={(e) => this.handleChange(e, "normativeLegalDoc")}
                    id="normativeLegalDoc"
                    placeholder={t2("normativeLegalDoc", intl)}
                  />
                  {/* <InputGroupAddon addonType="append">
                    <Button
                      color="primary"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "normative_legal_doc" });
                      }}
                    >
                      <Icon.Globe size={14} />
                    </Button>
                  </InputGroupAddon> */}
                </InputGroup>
              </FormGroup>
            </Col>
            <Col sm={12} md={12} lg={12}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("parent")}</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{
                    text: checkingquiz.organization || t2("Choose", intl),
                  }}
                  value={{
                    text: checkingquiz.organization || t2("Choose", intl),
                  }}
                  isClearable
                  name="color"
                  options={OrganizationList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => this.handleChange(e, "organizationId", e)}
                  isDisabled={
                    can("AllCheckingQuizCreate") || can("AllCheckingQuizEdit")
                      ? false
                      : true
                  }
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
                      text: checkingquiz.state || t2("Choose", intl),
                    }}
                    value={{
                      text: checkingquiz.state || t2("Choose", intl),
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
                onClick={() => history.push("/info/checkingquiz")}
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
export default injectIntl(EditCheckingQuiz);
