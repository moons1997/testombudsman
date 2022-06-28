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
import Overlay from "../../../components/Webase/components/Overlay";
import ManualService from "../../../services/other/manual.service";
import Select from "react-select";
import { Notification, Translate } from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
import RejectionReasonService from "../../../services/info/rejectionreason.service";
import * as Icon from "react-feather";
const { t1, t2 } = Translate;
const { errorToast, successToast } = Notification;
class EditRejectionReason extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.state = {
      checktype: {},
      loading: false,
      SaveLoading: false,
      StateList: [],
      reject: [],
      modal: false,
      languageList: [],
      activeModal: "",
    };
  }
  //Created
  componentDidMount() {
    this.Refresh();
    this.GetDataLanguage();
  }
  GetDataLanguage = () => {
    ManualService.LanguageSelectList()
      .then((res) => {
        this.setState({ languageList: res.data }, () => {
          this.GetDataList();
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
    RejectionReasonService.Get(this.props.match.params.id)
      .then((res) => {
        this.setState({
          reject: {
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
  };
  handleChange(event, field, data) {
    var reject = this.state.reject;
    if (!!event) {
      reject[field] = !!event.target ? event.target.value : data.value;
      if (field == "stateId") {
        reject.state = this.state.StateList.filter(
          (item) => item.value == data.value
        )[0].text;
      }
      this.setState({ reject: reject });
    } else {
      if (field === "stateId") {
        reject.state = "";
        reject.stateId = null;
      }
      this.setState({ reject: reject });
    }
  }
  changeTranslate(value, item) {
    const { reject, activeModal } = this.state;

    // item.languageId
    if (item.languageId == 1 && activeModal == "full_name") {
      reject.fullName = value.target.value;
    }
    // if (item.languageId == 1 && activeModal == "short_name") {
    //   reject.shortName = value.target.value;
    // }
    reject.translates.map(function (el) {
      if (el.languageId == item.languageId && el.columnName == activeModal) {
        el.translateText = value.target.value;
      }
    });
    this.setState({ reject: reject });
  }
  SaveData = () => {
    this.setState({ SaveLoading: true });
    RejectionReasonService.Update(this.state.reject)
      .then((res) => {
        this.setState({ SaveLoading: false });
        successToast(t2("SuccessSave", this.props.intl));

        setTimeout(() => {
          this.props.history.push("/info/rejectionreason");
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
    const { loading, SaveLoading, StateList, reject, modal, activeModal } =
      this.state;
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
            {reject.translates?.map((item, index) =>
              item.columnName == this.state.activeModal ? (
                <FormGroup key={index}>
                  <div>{item.language}</div>
                  <Input
                    type="textarea"
                    value={item.translateText || ""}
                    onChange={(e) => this.changeTranslate(e, item)}
                    id={item.languageId}
                  />
                  {/* <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      {item.language}
                    </InputGroupAddon>
                    <Input
                      type="textarea"
                      value={item.translateText || ""}
                      onChange={(e) => this.changeTranslate(e, item)}
                      id={item.languageId}
                    />
                  </InputGroup> */}
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
              <h1 className="pageTextView"> {t1("RejectionReason")} </h1>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("code")} </h5>
                <Input
                  type="text"
                  value={reject.code || ""}
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
                    type="textarea"
                    value={reject.shortName || ""}
                    onChange={(e) => this.handleChange(e, "shortName")}
                    id="shortName"
                    placeholder={t2("shortname", intl)}
                    // disabled
                  />
                  
                </InputGroup>
              </FormGroup>
            </Col> */}
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("name")} </h5>

                <InputGroup>
                  <Input
                    type="textarea"
                    value={reject.fullName || ""}
                    onChange={(e) => this.handleChange(e, "fullName")}
                    id="fullName"
                    placeholder={t2("name", intl)}
                    // disabled
                  />
                  {/* <InputGroupAddon addonType="append">
                    <Button
                      color="primary"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "full_name" });
                      }}
                    >
                      <Icon.Globe id={"translate"} size={16} />
                    </Button>
                  </InputGroupAddon> */}
                </InputGroup>
              </FormGroup>
            </Col>
            {/* <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("orderCode")} </h5>
                <Input
                  type="text"
                  value={reject.orderCode || ""}
                  onChange={(e) => this.handleChange(e, "orderCode")}
                  id="fullName"
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
                      text: reject.state || t2("Choose", intl),
                    }}
                    value={{
                      text: reject.state || t2("Choose", intl),
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
                onClick={() => history.push("/info/rejectionreason")}
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
export default injectIntl(EditRejectionReason);
