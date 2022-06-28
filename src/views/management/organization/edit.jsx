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
import * as Icon from "react-feather";
import OrganizationService from "../../../services/management/organization.service";
import CountryService from "../../../services/info/country.service";
import RegionService from "../../../services/info/region.service";
import DistrictService from "../../../services/info/district.service";
import OkedService from "../../../services/info/oked.service";
import Overlay from "../../../components/Webase/components/Overlay";
import ManualService from "../../../services/other/manual.service";
import Select from "react-select";
import InputMask from "react-input-mask";
import {
  Notification,
  Translate,
  Permission,
} from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
import AsyncSelect from "react-select/async";
const { t1, t2 } = Translate;
const { errorToast, successToast } = Notification;
const { can } = Permission;
class EditOrganization extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.state = {
      organization: {},
      loading: false,
      InnLoading: false,
      SaveLoading: false,
      activeInn: false,
      StateList: [],
      RegionList: [],
      CountryList: [],
      DistrictList: [],
      OkedList: [],
      ParentList: [],
      activeModal: "",
      modal: false,
      languageList: [],
      errors: {
        // fullName: null,
        // shortName: null,
        countryId: null,
      },
    };
  }

  validation = (callback) => {
    var data = this.state.organization;
    var errors = {
      // fullName: !!data.fullName ? false : true,
      // shortName: !!data.shortName ? false : true,
      countryId: !!data.countryId ? false : true,
    };
    this.setState({ errors: errors }, () => callback());
  };
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
    if (data.organizationTranslates.length === 0) {
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
      return data.organizationTranslates;
    }
  };
  Refresh = () => {
    this.setState({ loading: true });
    OrganizationService.Get(this.props.match.params.id)
      .then((res) => {
        this.setState({
          organization: {
            ...res.data,
            organizationTranslates: this.translateObjects(res.data),
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
    CountryService.GetAsSelectList().then((res) => {
      this.setState({ CountryList: res.data });
    });
    RegionService.GetAsSelectList(211).then((res) => {
      this.setState({ RegionList: res.data });
    });
    OkedService.GetAsSelectList(5).then((res) => {
      this.setState({ OkedList: res.data });
    });
    OrganizationService.GetAsSelectList().then((res) => {
      this.setState({ ParentList: res.data });
    });
  };
  Search() {
    this.setState({ InnLoading: true });
    OrganizationService.GetByInn(this.state.organization.inn)
      .then((res) => {
        this.setState({ InnLoading: false });
        this.setState({ organization: res.data });
        this.regionChange();
        this.setState({ activeInn: true });
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ InnLoading: false });
      });
  }
  handleChange(event, field, data) {
    var organization = this.state.organization;
    if (!!event) {
      organization[field] = !!event.target ? event.target.value : data.value;
      this.setState({ organization: organization });
      if (field == "countryId") {
        organization.country = this.state.CountryList.filter(
          (item) => item.value === organization.countryId
        )[0].text;
      }
      if (field == "parentId") {
        organization.parent = this.state.ParentList.filter(
          (item) => item.value === organization.parentId
        )[0].text;
      }
      if (field == "regionId") {
        organization.region = this.state.RegionList.filter(
          (item) => item.value === organization.regionId
        )[0].text;
      }
      if (field == "districtId") {
        organization.district = this.state.DistrictList.filter(
          (item) => item.value === organization.districtId
        )[0].text;
      }
      if (field == "okedId") {
        organization.oked = this.state.OkedList.filter(
          (item) => item.value === organization.okedId
        )[0].text;
      }
      if (field == "stateId") {
        organization.state = this.state.StateList.filter(
          (item) => item.value === organization.stateId
        )[0].text;
      }
    } else {
      if (field === "countryId") {
        organization.country = "";
        organization.countryId = null;
      }
      if (field === "regionId") {
        organization.region = "";
        organization.regionId = null;
        organization.district = "";
        organization.districtId = null;
      }
      if (field === "districtId") {
        organization.district = "";
        organization.districtId = null;
      }
      if (field === "parentId") {
        organization.parent = "";
        organization.parentId = null;
      }
      if (field === "okedId") {
        organization.oked = "";
        organization.okedId = null;
      }
      if (field === "stateId") {
        organization.state = "";
        organization.stateId = null;
      }
      this.setState({ organization: organization });
    }
    this.validation(() => {});
  }
  regionChange() {
    DistrictService.GetAsSelectList(this.state.organization.regionId).then(
      (res) => {
        this.setState({ DistrictList: res.data });
      }
    );
  }
  regionChangeValue() {
    this.state.organization.districtId = null;
    this.state.organization.district = "";
  }
  SaveData = () => {
    this.validation(() => {
      if (
        Object.values(this.state.errors).filter((item) => item == true)
          .length == 0
      ) {
        this.setState({ SaveLoading: true });
        OrganizationService.Update(this.state.organization)
          .then((res) => {
            this.setState({ SaveLoading: false });
            successToast(t2("SuccessSave", this.props.intl));

            setTimeout(() => {
              this.props.history.push("/management/organization");
            }, 500);
          })
          .catch((error) => {
            errorToast(error.response.data);
            this.setState({ SaveLoading: false });
          });
      }
    });
  };
  toggleModal = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  changeTranslate(value, item) {
    const { organization, activeModal } = this.state;

    if (item.languageId == 1 && activeModal == "full_name") {
      organization.fullName = value.target.value;
    }
    // if (item.languageId == 1 && activeModal == "short_name") {
    //   organization.shortName = value.target.value;
    // }

    organization.organizationTranslates.map(function (el) {
      if (el.languageId == item.languageId && el.columnName == activeModal) {
        el.translateText = value.target.value;
      }
    });
    this.setState({ organization: organization });
  }

  render() {
    const {
      loading,
      SaveLoading,
      InnLoading,
      StateList,
      organization,
      CountryList,
      RegionList,
      DistrictList,
      OkedList,
      ParentList,
      modal,
      activeModal,
      activeInn,
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
            {organization.organizationTranslates?.map((item, index) =>
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
              <h1 className="pageTextView"> {t1("Org")} </h1>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6} lg={4}>
              <h5 className="text-bold-600"> {t1("inn")} </h5>
              <InputGroup>
                <InputMask
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      this.Search();
                    }
                  }}
                  className="form-control"
                  mask="999999999"
                  placeholder={t2("contractorInn", intl)}
                  value={organization.inn || ""}
                  onChange={(e) => this.handleChange(e, "inn")}
                />
                <InputGroupAddon addonType="append">
                  <Button
                    disabled={!organization.inn}
                    color="primary"
                    onClick={() => {
                      this.Search();
                    }}
                  >
                    {" "}
                    {InnLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      <Icon.Search size={14} />
                    )}{" "}
                    {t1("Search")}{" "}
                  </Button>
                  <Button
                    disabled={!organization.inn}
                    color="danger"
                    onClick={() => {
                      this.Refresh();
                      this.setState({ activeInn: false });
                    }}
                  >
                    {" "}
                    {InnLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      <Icon.Delete size={14} />
                    )}{" "}
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("orgCode")} </h5>
                <Input
                  type="text"
                  value={organization.orderCode || ""}
                  onChange={(e) => this.handleChange(e, "orderCode")}
                  id="orderCode"
                  placeholder={t2("orgCode", intl)}
                />
              </FormGroup>
            </Col>
            {/* <Col sm={12} md={6} lg={4}>
              <h5 className="text-bold-600"> {t1("shortname")} </h5>
              <InputGroup>
                <Input
                  type="textarea"
                  value={organization.shortName || ""}
                  onChange={(e) => this.handleChange(e, "shortName")}
                  id="shortName"
                  placeholder={t2("shortname", intl)}
                  disabled={activeInn}
                />
                <InputGroupAddon addonType="append">
                  <Button
                    // disabled
                    color="primary"
                    onClick={() => {
                      this.toggleModal();
                      this.setState({ activeModal: "short_name" });
                    }}
                  >
                    <Icon.Globe size={14} />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </Col> */}
            <Col sm={12} md={6} lg={4}>
              <h5 className="text-bold-600"> {t1("name")} </h5>
              <InputGroup>
                <Input
                  type="textarea"
                  value={organization.fullName || ""}
                  onChange={(e) => this.handleChange(e, "fullName")}
                  id="fullName"
                  placeholder={t2("name", intl)}
                  disabled={activeInn}
                  // disabled={organization.fullName != null ? true : false}
                />
                <InputGroupAddon addonType="append">
                  <Button
                    // disabled
                    color="primary"
                    onClick={() => {
                      this.toggleModal();
                      this.setState({ activeModal: "full_name" });
                    }}
                  >
                    <Icon.Globe size={14} />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">
                  <span style={{ color: "red" }}>*</span>
                  {t1("Country")}
                </h5>
                <Select
                  className={this.state.errors.countryId ? "invalid" : ""}
                  classNamePrefix="select"
                  defaultValue={{
                    text: organization.country || t2("Choose", intl),
                  }}
                  value={{
                    text: organization.country || t2("Choose", intl),
                  }}
                  isClearable
                  name="color"
                  options={CountryList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => this.handleChange(e, "countryId", e)}
                />
                {this.state.errors.countryId ? (
                  <div>
                    <span className="text-danger">
                      {t2("countryIdValidation", this.props.intl)}
                    </span>
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("Region")}</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{
                    text: organization.region || t2("Choose", intl),
                  }}
                  value={{
                    text: organization.region || t2("Choose", intl),
                  }}
                  isClearable
                  name="color"
                  options={RegionList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => {
                    this.handleChange(e, "regionId", e);
                    this.regionChange();
                    this.regionChangeValue();
                  }}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("District")}</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{
                    text: organization.district || t2("Choose", intl),
                  }}
                  value={{
                    text: organization.district || t2("Choose", intl),
                  }}
                  isClearable
                  name="color"
                  options={DistrictList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => this.handleChange(e, "districtId", e)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("Address")} </h5>
                <Input
                  type="text"
                  value={organization.address || ""}
                  onChange={(e) => this.handleChange(e, "address")}
                  id="address"
                  placeholder={t2("Address", intl)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("Oked")}</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{
                    text: organization.oked || t2("Choose", intl),
                  }}
                  value={{
                    text: organization.oked || t2("Choose", intl),
                  }}
                  isClearable
                  name="color"
                  options={OkedList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => this.handleChange(e, "okedId", e)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("Director")} </h5>
                <Input
                  type="text"
                  value={organization.director || ""}
                  onChange={(e) => this.handleChange(e, "director")}
                  id="director"
                  placeholder={t2("Director", intl)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("Accounter")} </h5>
                <Input
                  type="text"
                  value={organization.accounter || ""}
                  onChange={(e) => this.handleChange(e, "accounter")}
                  id="accounter"
                  placeholder={t2("Accounter", intl)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("PhoneNumber")} </h5>
                <InputMask
                  // onKeyDown={(e) => {
                  //   if (e.key === "Enter") {
                  //     this.SearchbyInn();
                  //   }
                  // }}
                  mask="(\9\98)99-999-99-99"
                  maskChar={null}
                  className="form-control"
                  // style={{
                  //   borderColor: errors.phoneNumber ? "red" : "inherit",
                  // }}
                  placeholder={t2("phoneNumber", intl)}
                  value={organization.phoneNumber || ""}
                  onChange={(e) => this.handleChange(e, "phoneNumber", e)}
                />
                {/* <Input
                  type="text"
                  value={organization.phoneNumber || ""}
                  onChange={(e) => this.handleChange(e, "phoneNumber")}
                  id="phoneNumber"
                  placeholder={t2("PhoneNumber", intl)}
                /> */}
              </FormGroup>
            </Col>
            {/* <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("letterSigner")} </h5>
                <Input
                  type="text"
                  value={organization.letterSigner || ""}
                  onChange={(e) => this.handleChange(e, "letterSigner")}
                  id="letterSigner"
                  placeholder={t2("letterSigner", intl)}
                />
              </FormGroup>
            </Col> */}
            {/* <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">
                  {" "}
                  {t1("letterSignerPosition")}{" "}
                </h5>
                <Input
                  type="text"
                  value={organization.letterSignerPosition || ""}
                  onChange={(e) => this.handleChange(e, "letterSignerPosition")}
                  id="letterSignerPosition"
                  placeholder={t2("letterSignerPosition", intl)}
                />
              </FormGroup>
            </Col> */}
            <Col sm={12} md={8} lg={8}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("parent")}</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{
                    text: organization.parent || t2("Choose", intl),
                  }}
                  value={{
                    text: organization.parent || t2("Choose", intl),
                  }}
                  isClearable
                  name="color"
                  options={ParentList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => this.handleChange(e, "parentId", e)}
                  isDisabled={
                    can("AllOrganizationCreate") || can("AllOrganizationEdit")
                      ? false
                      : true
                  }
                />
              </FormGroup>
            </Col>

            {organization.id !== 0 && (
              <Col sm={12} md={6} lg={4}>
                <FormGroup>
                  <h5 className="text-bold-600">{t1("state")}</h5>
                  <Select
                    className="React"
                    classNamePrefix="select"
                    defaultValue={{
                      text: organization.state || t2("Choose", intl),
                    }}
                    value={{
                      text: organization.state || t2("Choose", intl),
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
                onClick={() => history.push("/management/organization")}
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
export default injectIntl(EditOrganization);
