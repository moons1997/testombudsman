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
import ControlFunctionService from "../../../services/info/controlfunction.service";
import ControlFunctionFormService from "../../../services/info/controlfunctionform.service";
import * as Icon from "react-feather";
import OrganizationService from "../../../services/management/organization.service";
import OkedService from "../../../services/info/oked.service";
const { t1, t2 } = Translate;
const { errorToast, successToast } = Notification;
const { can } = Permission;

class EditControlFunction extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.state = {
      checktype: {},
      loading: false,
      SaveLoading: false,
      StateList: [],
      controlfunction: {},
      modal: false,
      languageList: [],
      activeModal: "",
      ParentList: [],
      OkedList: [],
      calkOked: {},
      selectOked: [],
      checkOked: false,
      ControlFormList: [],
      copyOked: "",
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
    ControlFunctionService.Get(this.props.match.params.id)
      .then((res) => {
        this.setState({
          controlfunction: {
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
    ControlFunctionFormService.GetAsSelectList().then((res) => {
      this.setState({ ControlFormList: res.data });
    });
  };
  handleChange(event, field, data) {
    var controlfunction = this.state.controlfunction;

    if (!!event) {
      if (field == "parentOrganizationId") {
        // this.changeParentOrg(data.value);
        controlfunction.parentOrganization = this.state.ParentList.filter(
          (item) => item.value == data.value
        )[0].text;
      }
      if (field == "stateId") {
        // this.changeParentOrg(data.value);
        controlfunction.state = this.state.StateList.filter(
          (item) => item.value == data.value
        )[0].text;
      }
      // if (field == "formId") {
      //   // this.changeParentOrg(data.value);
      //   controlfunction.form = this.state.ControlFormList.filter(
      //     (item) => item.value == data.value
      //   )[0].text;
      // }
      controlfunction[field] = !!event.target ? event.target.value : data.value;
      this.setState({ controlfunction: controlfunction });
    } else {
      if (field === "stateId") {
        controlfunction.state = "";
        controlfunction.stateId = null;
      }
      if (field === "parentOrganizationId") {
        controlfunction.parentOrganization = "";
        controlfunction.parentOrganizationId = null;
      }
      if (field === "forms") {
        controlfunction.forms = [];
      }
      if (field === "okeds") {
        controlfunction.okeds = [];
      }
      this.setState({ controlfunction });
    }
  }

  okedChange(event, field, data) {
    var calkOked = this.state.calkOked;
    calkOked[field] = !!event.target ? event.target.value : data.value;
    this.setState({ calkOked });
  }
  changeTranslate(value, item) {
    const { controlfunction, activeModal } = this.state;

    if (item.languageId == 1 && activeModal == "name") {
      controlfunction.name = value.target.value;
    }
    if (item.languageId == 1 && activeModal == "normative_legal_doc") {
      controlfunction.normativeLegalDoc = value.target.value;
    }
    controlfunction.translates.map(function (el) {
      if (el.languageId == item.languageId && el.columnName == activeModal) {
        el.translateText = value.target.value;
      }
    });
    this.setState({ controlfunction: controlfunction });
  }
  SaveData = () => {
    this.setState({ SaveLoading: true });
    ControlFunctionService.Update(this.state.controlfunction)
      .then((res) => {
        this.setState({ SaveLoading: false });
        successToast(t2("SuccessSave", this.props.intl));

        setTimeout(() => {
          this.props.history.push("/info/controlfunction");
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
    }
    if (this.state.checkOked) {
      this.setState((prevState) => ({
        controlfunction: {
          ...prevState.controlfunction,
          okeds: this.state.OkedList.map((item) => parseInt(item.value)),
        },
      }));
    } else {
      this.setState((prevState) => ({
        controlfunction: {
          ...prevState.controlfunction,
          okeds: total.map((item) => parseInt(item.value)),
        },
      }));
    }
    if (!!copyOked.length > 0) {
      copyOkedArray = copyOked.split(",").map(Number);
      // copyOkedArray = copyOkedArray.map((item) => item.trim());

      let t = this.state.OkedList.filter((item) =>
        copyOkedArray.includes(parseInt(item.orderCode))
      );
      t = t.map((item) => item.value);

      this.setState((prevState) => ({
        controlfunction: {
          ...prevState.controlfunction,
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
      controlfunction,
      modal,
      activeModal,
      ParentList,
      OkedList,
      calkOked,
      checkOked,
      selectOked,
      ControlFormList,
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
              controlfunction.translates?.map((item, index) =>
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
              <h1 className="pageTextView" s>
                {" "}
                {t1("ControlFunction")}{" "}
              </h1>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6} lg={4}>
              <h5 className="text-bold-600"> {t1("name")} </h5>
              <FormGroup>
                <InputGroup>
                  <Input
                    type="textarea"
                    value={controlfunction.name || ""}
                    onChange={(e) => this.handleChange(e, "name")}
                    id="shortName"
                    placeholder={t2("shortname", intl)}
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
                    value={controlfunction.normativeLegalDoc || ""}
                    onChange={(e) => this.handleChange(e, "normativeLegalDoc")}
                    id="normativeLegalDoc"
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
                  value={controlfunction.orderCode || ""}
                  onChange={(e) => this.handleChange(e, "orderCode")}
                  id="orderCode"
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
                      controlfunction.parentOrganization || t2("Choose", intl),
                  }}
                  value={{
                    text:
                      controlfunction.parentOrganization || t2("Choose", intl),
                  }}
                  isClearable
                  name="color"
                  options={ParentList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  isDisabled={
                    can("AllControlFunctionCreate") ||
                    can("AllControlFunctionEdit")
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
                  <Col sm={12} md={9} lg={9}>
                    <Select
                      className="basic-multi-select"
                      classNamePrefix="select"
                      isMulti
                      placeholder={
                        checkOked
                          ? t1("all")
                          : Object.keys(calkOked).length !== 0
                          ? `${calkOked.from} - ${calkOked.to}`
                          : t2("Oked", intl)
                      }
                      isClearable
                      isDisabled={checkOked || calkOked.from || calkOked.to}
                      // components={{ DropdownIndicator }}
                      defaultValue={
                        !!controlfunction.okeds &&
                        controlfunction.okeds.length > 0
                          ? OkedList.filter((item) =>
                              controlfunction.okeds.includes(item.value)
                            )
                          : []
                      }
                      value={
                        !!controlfunction.okeds &&
                        controlfunction.okeds.length > 0
                          ? OkedList.filter((item) =>
                              controlfunction.okeds.includes(item.value)
                            )
                          : []
                      }
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
                  <Col sm={12} md={3} lg={3}>
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
            <Col sm={12} md={6} lg={3}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("form")}</h5>
                <Select
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder={t2("Choose", intl)}
                  isMulti
                  value={
                    !!controlfunction.forms && controlfunction.forms.length > 0
                      ? ControlFormList.filter((item) =>
                          controlfunction.forms.includes(item.value)
                        )
                      : []
                  }
                  defaultValue={
                    !!controlfunction.forms && controlfunction.forms.length > 0
                      ? ControlFormList.filter((item) =>
                          controlfunction.forms.includes(item.value)
                        )
                      : []
                  }
                  isClearable
                  name="color"
                  options={ControlFormList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) =>
                    this.handleChange(e, "forms", {
                      value: e?.length > 0 ? e.map((item) => item.value) : [],
                    })
                  }
                  // value: e?.length > 0 ? e.map((item) => item.value) : [],
                />
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
                      text: controlfunction.state || t2("Choose", intl),
                    }}
                    value={{
                      text: controlfunction.state || t2("Choose", intl),
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
                onClick={() => history.push("/info/controlfunction")}
              >
                {t1("back")}
              </Button>
              {/* </Col>
            <Col className="text-right"> */}
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
export default injectIntl(EditControlFunction);
