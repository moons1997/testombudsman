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
  Label,
} from "reactstrap";
// import EmojiIcon from "@atlaskit/icon/glyph/emoji";
import Overlay from "../../../components/Webase/components/Overlay";
import ManualService from "../../../services/other/manual.service";
import Select, { components, DropdownIndicatorProps } from "react-select";
import {
  Notification,
  Translate,
  Permission,
} from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
import MandatoryRequirementService from "../../../services/info/mandatoryrequirement.service";
import * as Icon from "react-feather";
import OrganizationService from "../../../services/management/organization.service";
import OkedService from "../../../services/info/oked.service";
import CheckValidation from "../../../components/Webase/functions/checkvalidation";
const { t1, t2 } = Translate;
const { errorToast, successToast } = Notification;

const { can } = Permission;
const { check, checkFilePdf20mb } = CheckValidation;
class EditMandatoryRequirement extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.state = {
      checktype: {},
      loading: false,
      SaveLoading: false,
      StateList: [],
      mandatoryRequirement: [],
      modal: false,
      languageList: [],
      activeModal: "",
      ParentList: [],
      OkedList: [],
      calkOked: {},
      selectOked: [],
      checkOked: false,
      copyOked: "",
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
      if ("name" in data) {
        this.state.languageList.map((item) => {
          objects.push({
            language: item.fullName,
            columnName: "name",
            languageId: item.value,
            translateText: "",
          });
        });
      }
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
      return objects;
    } else {
      return data.translates;
    }
  };
  // methods
  Refresh = () => {
    this.setState({ loading: true });
    MandatoryRequirementService.Get(this.props.match.params.id)
      .then((res) => {
        this.setState({
          mandatoryRequirement: {
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
      this.setState({ ParentList: res.data });
    });
    OkedService.GetAsSelectList(5).then((res) => {
      this.setState({ OkedList: res.data });
    });
  };
  handleChange(event, field, data) {
    var mandatoryRequirement = this.state.mandatoryRequirement;
    if (!!event) {
      if (field == "parentOrganizationId") {
        // this.changeParentOrg(data.value);
        mandatoryRequirement.parentOrganization = this.state.ParentList.filter(
          (item) => item.value == data.value
        )[0].text;
      }
      if (field == "stateId") {
        // this.changeParentOrg(data.value);
        mandatoryRequirement.state = this.state.StateList.filter(
          (item) => item.value == data.value
        )[0].text;
      }
      mandatoryRequirement[field] = !!event.target
        ? event.target.value
        : data.value;
      this.setState({ mandatoryRequirement: mandatoryRequirement });
    } else {
      if (field === "stateId") {
        mandatoryRequirement.state = "";
        mandatoryRequirement.stateId = null;
      }
      if (field === "parentOrganizationId") {
        mandatoryRequirement.parentOrganization = "";
        mandatoryRequirement.parentOrganizationId = null;
      }
      this.setState({ mandatoryRequirement: mandatoryRequirement });
    }
  }

  okedChange(event, field, data) {
    var calkOked = this.state.calkOked;
    calkOked[field] = !!event.target ? event.target.value : data.value;
    this.setState({ calkOked });
  }
  changeTranslate(value, item) {
    const { mandatoryRequirement, activeModal } = this.state;

    if (item.languageId == 1 && activeModal == "normative_legal_doc") {
      mandatoryRequirement.normativeLegalDoc = value.target.value;
    }
    if (item.languageId == 1 && activeModal == "name") {
      mandatoryRequirement.name = value.target.value;
    }
    mandatoryRequirement.translates.map(function (el) {
      if (el.languageId == item.languageId && el.columnName == activeModal) {
        el.translateText = value.target.value;
      }
    });
    this.setState({ mandatoryRequirement: mandatoryRequirement });
  }
  SaveData = () => {
    // const { request } = this.state;
    // const arr = [
    //   {
    //     data: request.contractor.inn,
    //     type: "string",
    //     message: "innNotSelect",
    //   },
    // ];
    // if (!check(arr, this.props.intl)) {
    //   return false;
    // }
    this.setState({ SaveLoading: true });
    MandatoryRequirementService.Update(this.state.mandatoryRequirement)
      .then((res) => {
        this.setState({ SaveLoading: false });
        successToast(t2("SuccessSave", this.props.intl));

        setTimeout(() => {
          this.props.history.push("/info/mandatoryrequirement");
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

  addOked() {
    const calkOked = this.state.calkOked;
    const { copyOked } = this.state;

    let start,
      end,
      total = [],
      copyOkedArray;

    if (!!calkOked) {
      start = this.state.OkedList.findIndex(
        (element) => element.orderCode === calkOked.from
      );
      end = this.state.OkedList.findIndex(
        (element) => element.orderCode === calkOked.to
      );
      total = this.state.OkedList.slice(start, end);
      // total.map((item, idx) => );
      this.setState({ selectOked: total });
      if (this.state.checkOked) {
        this.setState((prevState) => ({
          mandatoryRequirement: {
            ...prevState.mandatoryRequirement,
            okeds: this.state.OkedList.map((item) => parseInt(item.value)),
          },
        }));
      } else {
        this.setState((prevState) => ({
          mandatoryRequirement: {
            ...prevState.mandatoryRequirement,
            okeds: total.map((item) => parseInt(item.value)),
          },
        }));
      }
    }
    if (!!copyOked.length > 0) {
      copyOkedArray = copyOked.split(",").map(Number);
      // copyOkedArray = copyOkedArray.map((item) => item.trim());

      let t = this.state.OkedList.filter((item) =>
        copyOkedArray.includes(parseInt(item.orderCode))
      );
      t = t.map((item) => item.value);

      this.setState((prevState) => ({
        mandatoryRequirement: {
          ...prevState.mandatoryRequirement,
          okeds: t,
        },
      }));
    }
  }

  handleChangeSelect(e) {
    this.handleChange(e, "okeds", {
      value: e?.length > 0 ? e.map((item) => item.value) : [],
    });
  }
  render() {
    const {
      loading,
      SaveLoading,
      StateList,
      mandatoryRequirement,
      modal,
      activeModal,
      ParentList,
      OkedList,
      calkOked,
      checkOked,
      selectOked,
    } = this.state;
    const { history, intl } = this.props;
    //template

    const DropdownIndicator = (props) => {
      return (
        <components.DropdownIndicator {...props}>
          <div
            onClick={() => {
              this.toggleModal();
              this.setState({ activeModal: "oked" });
            }}
          >
            <Icon.PlusCircle id={"translate"} color="#5e50ee" size={16} />
          </div>
        </components.DropdownIndicator>
      );
    };
    return (
      <Overlay show={loading}>
        <Modal isOpen={modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            {activeModal == "name" && t1("name")}
            {activeModal == "normative_legal_doc" && t1("normativeLegalDoc")}
            {activeModal == "oked" && t1("Oked")}
          </ModalHeader>
          <ModalBody>
            {activeModal == "oked" ? (
              <Row>
                <Col sm={12} md={6} lg={6}>
                  <FormGroup>
                    <h5 className="text-bold-600">{t1("from")}</h5>
                    <Input
                      type="text"
                      value={calkOked.from || ""}
                      onChange={(e) => this.okedChange(e, "from")}
                      id="from"
                      placeholder={t2("from", intl)}
                      disabled={checkOked ? true : false}
                    />
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <FormGroup>
                    <h5 className="text-bold-600">{t1("to")}</h5>
                    <Input
                      type="text"
                      value={calkOked.to || ""}
                      onChange={(e) => this.okedChange(e, "to")}
                      id="to"
                      placeholder={t2("to", intl)}
                      disabled={checkOked ? true : false}
                    />
                  </FormGroup>
                </Col>
                <Col sm={12} md={12} lg={12}>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="checkbox"
                        id="checkbox2"
                        onChange={() =>
                          this.setState({ checkOked: !checkOked })
                        }
                        defaultChecked={checkOked}
                      />{" "}
                      {t1("all")}
                    </Label>
                  </FormGroup>
                </Col>
                <Col sm={12} md={12} lg={12} className="mt-2">
                  <FormGroup>
                    <h5 className="text-bold-600"> {t1("copyOked")} </h5>

                    <InputGroup>
                      <Input
                        style={{ height: "400px" }}
                        type="textarea"
                        value={this.state.copyOked || ""}
                        onChange={(e) =>
                          this.setState({
                            copyOked: e.target.value,
                          })
                        }
                        id="copyOked"
                        placeholder={t2("copyOked", intl)}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
            ) : (
              mandatoryRequirement.translates?.map((item, index) =>
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
              )
            )}
          </ModalBody>
          <ModalFooter>
            {activeModal == "oked" ? (
              <Button
                color="success"
                onClick={() => {
                  this.toggleModal();
                  this.addOked();
                }}
              >
                {t1("Add")}
              </Button>
            ) : (
              <Button
                color="success"
                onClick={() => {
                  this.toggleModal();
                }}
              >
                {t1("Add")}
              </Button>
            )}
          </ModalFooter>
        </Modal>
        <Card className="p-2">
          <Row>
            <Col className="text-center mb-1">
              <h1 className="pageTextView"> {t1("MandatoryRequirement")} </h1>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6} lg={4}>
              <h5 className="text-bold-600"> {t1("name")} </h5>
              <FormGroup>
                <InputGroup>
                  <Input
                    type="textarea"
                    value={mandatoryRequirement.name || ""}
                    onChange={(e) => this.handleChange(e, "name")}
                    id="name"
                    placeholder={t2("name", intl)}
                    // disabled
                  />
                  {/* <InputGroupAddon addonType="append">
                    <Button
                      color="primary"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "name" });
                      }}
                    >
                      <Icon.Globe id={"translate"} size={16} />
                    </Button>
                  </InputGroupAddon> */}
                </InputGroup>
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("normativeLegalDoc")} </h5>

                <InputGroup>
                  <Input
                    type="textarea"
                    value={mandatoryRequirement.normativeLegalDoc || ""}
                    onChange={(e) => this.handleChange(e, "normativeLegalDoc")}
                    id="fullName"
                    placeholder={t2("normativeLegalDoc", intl)}
                    // disabled
                  />
                  {/* <InputGroupAddon addonType="append">
                    <Button
                      color="primary"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "normative_legal_doc" });
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
                  value={mandatoryRequirement.orderCode || ""}
                  onChange={(e) => this.handleChange(e, "orderCode")}
                  id="fullName"
                  placeholder={t2("orderCode", intl)}
                />
              </FormGroup>
            </Col> */}
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("parent")}</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{
                    text:
                      mandatoryRequirement.parentOrganization ||
                      t2("Choose", intl),
                  }}
                  value={{
                    text:
                      mandatoryRequirement.parentOrganization ||
                      t2("Choose", intl),
                  }}
                  isClearable
                  name="color"
                  options={ParentList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  isDisabled={
                    can("AllMandatoryRequirementCreate") ||
                    can("AllMandatoryRequirementEdit")
                      ? false
                      : true
                  }
                  onChange={(e) =>
                    this.handleChange(e, "parentOrganizationId", e)
                  }
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("Oked")}</h5>
                <Row>
                  <Col sm={12} md={10} lg={10}>
                    <Select
                      className="basic-multi-select"
                      classNamePrefix="select"
                      isMulti
                      placeholder={
                        checkOked
                          ? "select all"
                          : Object.keys(calkOked).length !== 0
                          ? `${calkOked.from} - ${calkOked.to}`
                          : t2("Oked", intl)
                      }
                      isDisabled={checkOked || calkOked.from || calkOked.to}
                      // components={{ DropdownIndicator }}
                      defaultValue={
                        !!mandatoryRequirement.okeds &&
                        mandatoryRequirement.okeds.length > 0
                          ? OkedList.filter((item) =>
                              mandatoryRequirement.okeds.includes(item.value)
                            )
                          : []
                      }
                      value={
                        !!mandatoryRequirement.okeds &&
                        mandatoryRequirement.okeds.length > 0
                          ? OkedList.filter((item) =>
                              mandatoryRequirement.okeds.includes(item.value)
                            )
                          : []
                      }
                      isClearable
                      name="color"
                      options={OkedList}
                      label="text"
                      getOptionLabel={(item) => item.orderCode}
                      onChange={(e) =>
                        this.handleChangeSelect(
                          selectOked.length > 0 ? selectOked : e
                        )
                      }
                    />
                  </Col>
                  <Col sm={12} md={2} lg={2}>
                    <Button
                      color="primary"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "oked" });
                      }}
                    >
                      <Icon.PlusCircle id={"translate"} size={16} />
                    </Button>
                  </Col>
                </Row>

                <InputGroup>
                  <InputGroupAddon addonType="append"></InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </Col>
            {this.props.match.params.id == 0 ? (
              ""
            ) : (
              <Col sm={12} md={6} lg={2}>
                <FormGroup>
                  <h5 className="text-bold-600">{t1("state")}</h5>
                  <Select
                    className="React"
                    classNamePrefix="select"
                    defaultValue={{
                      text: mandatoryRequirement.state || t2("Choose", intl),
                    }}
                    value={{
                      text: mandatoryRequirement.state || t2("Choose", intl),
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
                onClick={() => history.push("/info/mandatoryrequirement")}
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
export default injectIntl(EditMandatoryRequirement);
