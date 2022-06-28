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
  CustomInput,
  TabContent,
  TabPane,
  NavItem,
  NavLink,
  Nav,
  Badge,
  CardHeader,
  CardBody,
  CardTitle,
  CardFooter,
  FormFeedback,
  UncontrolledTooltip,
} from "reactstrap";
import RequestService from "../../../services/document/request.service";
import Overlay from "../../../components/Webase/components/Overlay";
import ManualService from "../../../services/other/manual.service";
import CheckBasisService from "../../../services/info/checkbasis.service";
import OrganizationService from "../../../services/management/organization.service";
import ContractorService from "../../../services/info/contractor.service";
import Select from "react-select";
import {
  Notification,
  Translate,
  Permission,
} from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
import { UzbekLatin } from "flatpickr/dist/l10n/uz_latn";
import { Russian } from "flatpickr/dist/l10n/ru";
import { Uzbek } from "flatpickr/dist/l10n/uz";
import moment from "moment";
import Flatpickr from "react-flatpickr";
import * as Icon from "react-feather";
import InputMask from "react-input-mask";
import CheckingQuizService from "../../../services/info/checkingquiz.service";
import OrganizationInspectionTypeService from "../../../services/info/organizationinspectiontype.service";
import RegionService from "../../../services/info/region.service";
import DistrictService from "../../../services/info/district.service";
import OkedService from "../../../services/info/oked.service";
import BankService from "../../../services/info/bank.service";
import EmployeeService from "../../../services/info/employee.service";
// import { DatePicker } from "antd";
import "moment/locale/ru";
import locale from "antd/es/date-picker/locale/ru_RU";
import CheckValidation from "../../../components/Webase/functions/checkvalidation";
import DatePicker, { registerLocale } from "react-datepicker";
import MaskedTextInput from "react-text-mask";
import uz from "date-fns/locale/uz";
import uzCyrl from "date-fns/locale/uz-Cyrl";
import ru from "date-fns/locale/ru";
import date from "./date.css";
registerLocale("uz", uz);
registerLocale("uzCyrl", uzCyrl);
registerLocale("ru", ru);
const { t1, t2 } = Translate;
const { errorToast, successToast, customErrorToast } = Notification;
const { can } = Permission;
const { check, checkFilePdf20mb } = CheckValidation;

class EditRequest extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.state = {
      request: {
        contractor: {},
      },
      loading: false,
      SaveLoading: false,
      StateList: [],
      CheckTypeList: [],
      CheckBasisList: [],
      InspectionOrganizationList: [],
      OrderedOrganizationList: [],
      OrganizationBranchList: [],
      AuthorizedOrganizationList: [],
      CheckingQuizzesList: [],
      RegionList: [],
      DistrictList: [],
      FilialDistrictList: [],
      BankList: [],
      OkedList: [],
      InnLoading: false,
      activeTab: "1",
      EmployeeList: [],
      activeInn: false,
      page: {
        sortBy: "",
        orderType: "asc",
        page: 1,
        pageSize: 1000,
      },
      search: "",
      fileLoading: false,
      OrganizationInspectionTypes: [],
      errors: {
        innOrPinfl: null,
        fullName: null,
        okedId: null,
        regionId: null,
        districtId: null,
        docDate: null,
        checkStartDate: null,
        checkEndDate: null,
        checkDaysNumber: null,
        checkTypeId: null,
        checkBasisId: null,
        checkCoverageStartDate: null,
        checkCoverageEndDate: null,
        checkingQuizzes: null,
        filialDistrictId: null,
        filialRegionId: null,
        inspectionOrganizationId: null,
        organizationInspectionTypeId: null,
      },
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
    RequestService.Get(this.props.match.params.id)
      .then((res) => {
        this.setState({ request: res.data, loading: false });
        // if (
        //   request.orderedOrganizationId !== null ||
        //   request.inspectionOrganizationId !== null
        // ) {
        //   this.employeechange();
        // }
        this.changeOrderedOrg(
          this.state.request.orderedOrganizationId,
          false,
          true
        );
        this.employeechange();
        this.changeCheckingQuiz(this.state.request.orderedOrganizationId);
        this.changeAuthorizedOrganization(
          this.state.request.orderedOrganizationId,
          true,
          false
        );
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
    ManualService.CheckTypeSelectList().then((res) => {
      this.setState({ CheckTypeList: res.data });
    });
    OrganizationInspectionTypeService.GetAsSelectList().then((res) => {
      this.setState({ OrganizationInspectionTypes: res.data });
    });
    OrganizationService.GetAsSelectList(null).then((res) => {
      this.setState({ OrderedOrganizationList: res.data });
    });
    RegionService.GetAsSelectList(211).then((res) => {
      this.setState({ RegionList: res.data });
    });
    OkedService.GetAsSelectList(5).then((res) => {
      this.setState({ OkedList: res.data });
    });
    BankService.GetAsSelectList().then((res) => {
      this.setState({ BankList: res.data });
    });
    // EmployeeService.GetAsSelectList({
    //   parentOrganizationId: request.parentOrganizationId,
    //   organizationId: request.organizationId,
    //   sortBy: page.sortBy,
    //   orderType: page.orderType,
    //   page: page.page,
    //   pageSize: page.pageSize,
    //   search: search,
    // }).then((res) => {
    //   this.setState({ EmployeeList: res.data });
    // });
  };
  handleChange(event, field, data) {
    var request = this.state.request;
    // console.log("AAAAAAAAAAAAAAAA", data);
    // console.log("AAAAAAAAAAAAAAAA", field);
    if (!!event) {
      request[field] = !!event?.target ? event.target.value : data.value;

      if (field == "orderedOrganizationId") {
        this.changeOrderedOrg(data.value);
        this.changeCheckingQuiz(data.value);
        this.changeAuthorizedOrganization(data.value);
        this.employeechange();
      }
      if (field == "inspectionOrganizationId") {
        this.employeechange();
        request.inspectionOrganization =
          this.state.InspectionOrganizationList.filter(
            (item) => item.value == data.value
          )[0].text;
      }
      if (field == "checkBasisId") {
        request.checkBasis = this.state.CheckBasisList.filter(
          (item) => item.value == data.value
        )[0].text;
      }
      if (field == "checkTypeId") {
        request.checkType = this.state.CheckTypeList.filter(
          (item) => item.value == data.value
        )[0].text;
      }
      if (field == "filialRegionId") {
        request.filialRegion = this.state.RegionList.filter(
          (item) => item.value === request.filialRegionId
        )[0].text;
      }
      if (field == "filialDistrictId") {
        request.filialDistrict = this.state.FilialDistrictList.filter(
          (item) => item.value === request.filialDistrictId
        )[0].text;
      }
      if (field == "organizationInspectionTypeId") {
        request.organizationInspectionType =
          this.state.OrganizationInspectionTypes.filter(
            (item) => item.value == data.value
          )[0].text;
      }
      this.setState({ request: request });
      this.validation(() => {});
    } else {
      if (
        field === "docDate" ||
        field === "checkStartDate" ||
        field === "checkEndDate" ||
        field === "checkCoverageStartDate" ||
        field === "checkCoverageEndDate"
      ) {
        request[field] = "";
      }
      if (field == "organizationInspectionTypeId") {
        request.organizationInspectionType = "";
        request.organizationInspectionTypeId = "";
      }
      if (field === "filialRegionId") {
        request.filialRegionId = "";
        request.filialRegion = "";
      }
      if (field === "filialDistrictId") {
        request.filialDistrictId = "";
        request.filialDistrict = "";
      }
      if (field === "checkBasisId") {
        request.checkBasis = "";
        request.checkBasisId = null;
      }
      if (field === "checkTypeId") {
        request.checkType = "";
        request.checkTypeId = null;
        request.checkBasis = "";
        request.checkBasisId = null;
      }
      if (field === "orderedOrganizationId") {
        request[field] = "";
        request.orderedOrganization = "";
        request.inspectors = [];
        request.inspectionOrganizationId = "";
        request.inspectionOrganization = "";
      }
      if (field === "inspectionOrganizationId") {
        request[field] = "";
        request.inspectionOrganization = "";
        request.inspectors = [];
      }
      if (field === "authorizedOrganizationId") {
        request[field] = "";
        request.authorizedOrganization = "";
      }
      this.setState({ request: request });
      this.validation(() => {});
    }
    this.validation(() => {});
  }

  employeechange = () => {
    const { page, search, request } = this.state;
    EmployeeService.GetAsSelectList({
      parentOrganizationId: request.orderedOrganizationId,
      organizationId: request.inspectionOrganizationId,
      inspectionOrganizationId: true,
      isHr: false,
      isPassedAttestation: true,
      sortBy: page.sortBy,
      orderType: page.orderType,
      page: page.page,
      pageSize: page.pageSize,
      search: search,
    }).then((res) => {
      this.setState({ EmployeeList: res.data });
    });
  };
  handleChangeFilter = (data, field) => {
    var request = this.state.request;
    request.contractor[field] = data;

    this.setState({ request: request });
    // this.validation(() => {});
  };
  handleChangeContract(event, field, data) {
    var request = this.state.request;
    if (!!event) {
      request.contractor[field] = !!event.target
        ? event.target?.value
        : data.value;

      if (field == "okedId") {
        request.contractor.oked = this.state.OkedList.filter(
          (item) => item.value === request.contractor.okedId
        )[0].text;
      }
      if (field == "regionId") {
        request.contractor.region = this.state.RegionList.filter(
          (item) => item.value === request.contractor.regionId
        )[0].text;
      }
      if (field == "districtId") {
        request.contractor.district = this.state.DistrictList.filter(
          (item) => item.value === request.contractor.districtId
        )[0].text;
      }

      this.setState({ request: request });
      // this.validation(() => {});
    } else {
      if (field == "okedId") {
        request.contractor.oked = "";
        request.contractor.okedId = null;
      }
      if (field == "regionId") {
        request.contractor.region = "";
        request.contractor.regionId = null;
        request.contractor.district = "";
        request.contractor.districtId = null;
      }
      if (field == "districtId") {
        request.contractor.district = "";
        request.contractor.districtId = null;
      }
      // this.validation(() => {});
      this.setState({ request: request });
    }
  }
  changeOrderedOrg = (id) => {
    OrganizationService.GetAsSelectList(id, false, true).then((res) => {
      this.setState({ InspectionOrganizationList: res.data });
    });
  };
  changeCheckingQuiz = (id) => {
    CheckingQuizService.GetAsSelectList(id).then((res) => {
      this.setState({ CheckingQuizzesList: res.data });
    });
  };
  changeAuthorizedOrganization = (id) => {
    OrganizationService.GetAsSelectList(id, true, false).then((res) => {
      this.setState({ AuthorizedOrganizationList: res.data });
    });
  };
  SearchbyInn = () => {
    this.Refresh();
    this.setState({ InnLoading: true });
    const { request } = this.state;
    ContractorService.GetByInn(request.contractor.innOrPinfl)
      .then((res) => {
        request.contractor = res.data;
        request.contractor.innOrPinfl = res.data.innOrPinfl;
        request.contractor.okedId = res.data.okedId;
        request.contractor.fullName = res.data.fullName;
        request.contractor.regionId = res.data.regionId;
        this.setState({ InnLoading: false, request: request });
        this.regionChange();
        this.setState({ activeInn: true });
        // this.validation(() => {});
      })
      .catch((error) => {
        this.setState({ InnLoading: false });
        errorToast(error.response.data);
      });
    // this.validation(() => {});
  };
  SearchbyInnClear = () => {
    this.Refresh();
    this.setState({ activeInn: false });
  };
  // checkFile(file) {
  //   if (file.length > 0 && file[0].size > 5242880) {
  //     this.$makeToast(this.$t("morethen5mb"), "danger");
  //     return false;
  //   }
  // }
  handleChangeOrderFile = (file, field) => {
    if (file.length > 0) {
      if (!checkFilePdf20mb(file[0], this.props.intl)) {
        return false;
      }
    }
    // if (
    //  file. > 0 &&
    //   field.target.basicFiles[0].size > 5242880
    // ) {
    //   this.customErrorToast(this.$t("morethen5mb"), "danger");
    //   return false;
    // }

    if (field == "basic") {
      let formData = new FormData();
      for (let i = 0; i < file.length; i++) {
        formData.append(`files`, file[i]);
      }
      const { request } = this.state;
      this.setState({ fileLoading: true });
      RequestService.UploadBasicFile(formData).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          request.basicFiles.push({
            id: res.data[i].fileId,
            name: res.data[i].fileName,
          });
        }
        this.setState({ request: request });
        this.setState({ fileLoading: false });
      });
    }
    if (field == "order") {
      let formData = new FormData();
      for (let i = 0; i < file.length; i++) {
        formData.append(`files`, file[i]);
      }
      const { request } = this.state;
      this.setState({ fileLoading: true });
      RequestService.UploadOrderFile(formData).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          request.orderFiles.push({
            id: res.data[i].fileId,
            name: res.data[i].fileName,
          });
        }
        this.setState({ request: request });
        this.setState({ fileLoading: false });
      });
    }
  };
  regionChange() {
    DistrictService.GetAsSelectList(
      this.state.request.contractor.regionId
    ).then((res) => {
      this.setState({ DistrictList: res.data });
    });
  }
  regionChangeValue() {
    this.state.request.contractor.district = "";
    this.state.request.contractor.districtId = null;
  }
  regionFilialChange() {
    DistrictService.GetAsSelectList(this.state.request.filialRegionId).then(
      (res) => {
        this.setState({ FilialDistrictList: res.data });
      }
    );
  }
  regionFilialChangeValue() {
    this.state.request.district = "";
    this.state.request.districtId = null;
  }
  CheckBasisChange() {
    CheckBasisService.GetAsSelectList(this.state.request.checkTypeId).then(
      (res) => {
        this.setState({ CheckBasisList: res.data });
      }
    );
  }
  CheckBasisChangeValue() {
    this.state.request.checkBasisId = null;
    this.state.request.checkBasis = "";
  }
  DeleteFile = (data, index, field) => {
    let request = this.state.request;
    let test;
    if (field == "basic") {
      test = request.basicFiles.filter((item) => item.id !== data.id);
      this.setState((prevState) => ({
        request: {
          ...prevState.request,
          basicFiles: test,
        },
      }));
    }
    if (field == "order") {
      test = request.orderFiles.filter((item) => item.id !== data.id);
      this.setState((prevState) => ({
        request: {
          ...prevState.request,
          orderFiles: test,
        },
      }));
    }
  };
  checkFile() {
    if (this.state.request.basicFiles.length == 0) {
      customErrorToast(t2("basicFilesNotUpload", this.props.intl));
      return false;
    }
    return true;
  }
  checkInspectors() {
    if (
      this.state.request.orderFiles.length != 0 &&
      this.state.request.inspectors.length == 0
    ) {
      customErrorToast(t2("inspectorsNotSelected", this.props.intl));
      return false;
    }
    return true;
  }
  SaveData = () => {
    // const { request } = this.state;
    // const arr = [
    //   {
    //     data: request.basicFiles,
    //     type: "array",
    //     message: "innNotSelect",
    //   },
    // ];
    // if (!check(arr, this.props.intl)) {
    //   return false;
    // }
    if (!this.checkFile()) {
      return false;
    }
    if (!this.checkInspectors()) {
      return false;
    }
    this.validation(() => {
      if (
        Object.values(this.state.errors).filter((item) => item == true)
          .length == 0
      ) {
        this.setState({ SaveLoading: true });
        RequestService.Update(this.state.request)
          .then((res) => {
            this.setState({ SaveLoading: false });
            successToast(t2("SuccessSave", this.props.intl));

            setTimeout(() => {
              this.props.history.push("/document/viewrequest/" + res.data.id);
            }, 500);
          })
          .catch((error) => {
            errorToast(error.response.data);
            this.setState({ SaveLoading: false });
          });
      }
      // inspectionOrganizationId;
    });
  };
  validation = (callback) => {
    var request = this.state.request;
    var contractor = this.state.request.contractor;
    var errors = {
      innOrPinfl: !!contractor.innOrPinfl ? false : true,
      fullName: !!contractor.fullName ? false : true,
      // okedId: !!contractor.okedId ? false : true,
      regionId: !!contractor.regionId ? false : true,
      districtId: !!contractor.districtId ? false : true,
      // docDate: !!request.docDate ? false : true,
      checkStartDate: !!request.checkStartDate ? false : true,
      checkEndDate: !!request.checkEndDate ? false : true,
      checkDaysNumber: !!request.checkDaysNumber ? false : true,
      checkTypeId: !!request.checkTypeId ? false : true,
      checkBasisId: !!request.checkBasisId ? false : true,
      checkCoverageStartDate: !!request.checkCoverageStartDate ? false : true,
      checkCoverageEndDate: !!request.checkCoverageEndDate ? false : true,
      inspectionOrganizationId: !!request.inspectionOrganizationId
        ? false
        : true,
      checkingQuizzes:
        !!request.checkingQuizzes && !!request.checkingQuizzes.length > 0
          ? false
          : true,
      filialDistrictId: request.isFilial
        ? !!request.filialDistrictId
          ? false
          : true
        : false,
      filialRegionId: request.isFilial
        ? !!request.filialRegionId
          ? false
          : true
        : false,
      organizationInspectionTypeId:
        // ? false
        // : true,
        !!request.checkTypeId && request.checkTypeId == 2
          ? !!request.organizationInspectionTypeId
            ? false
            : true
          : false,
    };
    this.setState({ errors: errors }, () => callback());
  };
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }
  CanExecuteStatus = (id) => {
    return id === 7 || id === 13 || id === 14 || id === 17;
  };

  render() {
    const {
      loading,
      SaveLoading,
      request,
      CheckTypeList,
      CheckBasisList,
      CheckingQuizzesList,
      InspectionOrganizationList,
      AuthorizedOrganizationList,
      OrderedOrganizationList,
      InnLoading,
      RegionList,
      DistrictList,
      OkedList,
      EmployeeList,
      activeInn,
      errors,
      OrganizationInspectionTypes,
    } = this.state;
    const { history, intl } = this.props;
    //template
    return (
      <Overlay show={loading}>
        <Card className="p-2 pb-4 mb-4">
          <Nav tabs>
            <NavItem>
              <NavLink
                className={{ active: this.state.activeTab === "1" }}
                onClick={() => {
                  this.toggle("1");
                }}
              >
                <Row>
                  <Col>
                    <h2> {t1("Request")}</h2>
                  </Col>
                </Row>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              {this.state.fileLoading ? (
                <div className="loadDiv">
                  <div className="lds-spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {/* <Row>
                <Col>
                  <h2> {t1("Request")} </h2>
                </Col>
              </Row> */}
              <div
                style={{ backgroundColor: "#f8f8f8" }}
                className="p-2 rounded mb-2"
              >
                <Row>
                  <Col sm={12} md={6} lg={3}>
                    <FormGroup>
                      <h5 className="text-bold-600">
                        <span style={{ color: "red" }}>*</span>
                        {t1("inn")}{" "}
                      </h5>
                      <InputGroup>
                        <Input
                          invalid={errors.innOrPinfl}
                          className="form-control"
                          type="number"
                          maxLength={14}
                          // placeholder={t2("inn", intl)}
                          value={request.contractor.innOrPinfl || ""}
                          placeholder={t2("inn", intl)}
                          disabled={activeInn}
                          onChange={(e) => {
                            this.handleChangeContract(e, "innOrPinfl");
                            this.handleChangeFilter(
                              (e.target.value = Math.max(
                                0,
                                parseInt(e.target.value)
                              )
                                .toString()
                                .slice(0, 14)),
                              "inn"
                            );
                          }}
                        />
                        {/* <InputMask
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              this.SearchbyInn();
                            }
                          }}
                          type="number"
                          className="form-control"
                          placeholder={t2("inn", intl)}
                          value={request.contractor.inn || ""}
                          onChange={(e) => this.handleChangeContract(e, "inn")}
                          disabled={activeInn}
                        /> */}
                        <InputGroupAddon addonType="append">
                          <Button
                            color="primary"
                            disabled={!request.contractor.innOrPinfl}
                            onClick={() => this.SearchbyInn()}
                            size="sm"
                          >
                            {InnLoading ? (
                              <Spinner size="sm" />
                            ) : (
                              <Icon.Search size={14} />
                            )}{" "}
                          </Button>
                          <Button
                            color="danger"
                            disabled={!request.contractor.innOrPinfl}
                            onClick={() => this.SearchbyInnClear()}
                            size="sm"
                          >
                            {InnLoading ? (
                              <Spinner size="sm" />
                            ) : (
                              <Icon.Delete size={14} />
                            )}{" "}
                          </Button>
                        </InputGroupAddon>
                        {/* <FormFeedback>
                          {t2("innValidation", this.props.intl)}
                        </FormFeedback> */}
                        {errors.innOrPinfl ? (
                          <div>
                            <span className="text-danger">
                              {t2("checkTypeIdValidation", this.props.intl)}
                            </span>
                          </div>
                        ) : null}
                      </InputGroup>
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col sm={12} md={6} lg={3}>
                    <FormGroup>
                      <h5 className="text-bold-600">
                        {" "}
                        <span style={{ color: "red" }}>*</span>
                        {t1("contractor")}{" "}
                      </h5>
                      <Input
                        type="textarea"
                        value={request.contractor.fullName || ""}
                        placeholder={t2("contractor", intl)}
                        // disabled={activeInn}
                        disabled
                        onChange={(e) => {
                          this.handleChangeContract(e, "fullName");
                        }}
                        invalid={errors.fullName}
                      />
                      {/* <FormFeedback>
                        {t2("contractorFullNameValidation", this.props.intl)}
                      </FormFeedback> */}
                      {errors.fullName ? (
                        <div>
                          <span className="text-danger">
                            {t2("checkTypeIdValidation", this.props.intl)}
                          </span>
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                  {/* <Col sm={12} md={6} lg={3}>
                    <FormGroup>
                      <h5 className="text-bold-600">{t1("Oked")}</h5>
                      <Select
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 200 }),
                        }}
                        className={errors.okedId ? "invalid" : ""}
                        classNamePrefix="select"
                        defaultValue={{
                          text: request.contractor.oked || t2("Choose", intl),
                        }}
                        isClearable
                        value={{
                          text: request.contractor.oked || t2("Choose", intl),
                        }}
                        name="color"
                        options={OkedList}
                        label="text"
                        getOptionLabel={(item) => item.text}
                        isDisabled={
                          request.contractor.oked != null &&
                          request.contractor.okedId != null
                            ? true
                            : false
                        }
                        onChange={(e) =>
                          this.handleChangeContract(e, "okedId", e)
                        }
                      />
                      {errors.okedId ? (
                        <div>
                          <span className="text-danger">
                            {t2("okedIdValidation", this.props.intl)}
                          </span>orderedOrganizationId
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col> */}
                  <Col sm={12} md={6} lg={3}>
                    <FormGroup>
                      <h5 className="text-bold-600">{t1("Region")}</h5>
                      <Select
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 200 }),
                        }}
                        className={errors.regionId ? "invalid" : ""}
                        classNamePrefix="select"
                        defaultValue={{
                          text: request.contractor.region || t2("Choose", intl),
                        }}
                        isClearable
                        value={{
                          text: request.contractor.region || t2("Choose", intl),
                        }}
                        name="color"
                        options={RegionList}
                        label="text"
                        getOptionLabel={(item) => item.text}
                        onChange={(e) => {
                          this.handleChangeContract(e, "regionId", e);
                          this.regionChange();
                          this.regionChangeValue();
                        }}
                        isDisabled={activeInn}
                      />
                      {errors.regionId ? (
                        <div>
                          <span className="text-danger">
                            {t2("regionIdValidation", this.props.intl)}
                          </span>
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col sm={12} md={6} lg={3}>
                    <FormGroup>
                      <h5 className="text-bold-600">{t1("District")}</h5>
                      <Select
                        className={errors.districtId ? "invalid" : ""}
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 200 }),
                        }}
                        classNamePrefix="select"
                        defaultValue={{
                          text:
                            request.contractor.district || t2("Choose", intl),
                        }}
                        isClearable
                        value={{
                          text:
                            request.contractor.district || t2("Choose", intl),
                        }}
                        name="color"
                        options={DistrictList}
                        label="text"
                        getOptionLabel={(item) => item.text}
                        onChange={(e) =>
                          this.handleChangeContract(e, "districtId", e)
                        }
                        // isDisabled={activeInn}
                      />
                      {errors.districtId ? (
                        <div>
                          <span className="text-danger">
                            {t2("districtIdValidation", this.props.intl)}
                          </span>
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col sm={12} md={6} lg={12}>
                    <FormGroup>
                      <h5 className="text-bold-600">
                        {/* <span style={{ color: "red" }}>*</span> */}
                        {t1("isFilial")}
                      </h5>
                      <input
                        type="checkbox"
                        checked={request.isFilial}
                        onChange={(e) => {
                          this.setState(
                            (prevState) => ({
                              request: {
                                ...prevState.request,
                                isFilial: !prevState.request.isFilial,
                              },
                            }),
                            () => {
                              this.validation(() => {});
                            }
                          );
                        }}
                      />
                      <FormFeedback>
                        {t2("contractorFullNameValidation", this.props.intl)}
                      </FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>
                {request.isFilial ? (
                  <Row>
                    <Col sm={12} md={6} lg={3}>
                      <FormGroup>
                        <h5 className="text-bold-600">
                          <span style={{ color: "red" }}>*</span>
                          {t1("filialRegion")}
                        </h5>
                        <Select
                          styles={{
                            menu: (provided) => ({ ...provided, zIndex: 200 }),
                          }}
                          className={errors.filialRegionId ? "invalid" : ""}
                          classNamePrefix="select"
                          defaultValue={{
                            text: request.filialRegion || t2("Choose", intl),
                          }}
                          isClearable
                          value={{
                            text: request.filialRegion || t2("Choose", intl),
                          }}
                          name="color"
                          options={RegionList}
                          label="text"
                          getOptionLabel={(item) => item.text}
                          onChange={(e) => {
                            this.handleChange(e, "filialRegionId", e);
                            this.regionFilialChange();
                            this.regionFilialChangeValue();
                          }}
                          // isDisabled={activeInn}
                        />
                        {errors.filialRegionId ? (
                          <div>
                            <span className="text-danger">
                              {t2("regionIdValidation", this.props.intl)}
                            </span>
                          </div>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col sm={12} md={6} lg={3}>
                      <FormGroup>
                        <h5 className="text-bold-600">
                          <span style={{ color: "red" }}>*</span>
                          {t1("filialDistrict")}
                        </h5>
                        <Select
                          className={errors.filialDistrictId ? "invalid" : ""}
                          styles={{
                            menu: (provided) => ({ ...provided, zIndex: 200 }),
                          }}
                          classNamePrefix="select"
                          defaultValue={{
                            text: request.filialDistrict || t2("Choose", intl),
                          }}
                          isClearable
                          value={{
                            text: request.filialDistrict || t2("Choose", intl),
                          }}
                          name="color"
                          options={this.state.FilialDistrictList}
                          label="text"
                          getOptionLabel={(item) => item.text}
                          onChange={(e) =>
                            this.handleChange(e, "filialDistrictId", e)
                          }
                          // isDisabled={activeInn}
                        />
                        {errors.filialDistrictId ? (
                          <div>
                            <span className="text-danger">
                              {t2("districtIdValidation", this.props.intl)}
                            </span>
                          </div>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                ) : null}
              </div>

              <div
                style={{ backgroundColor: "#f8f8f8" }}
                className="p-2 mb-2 rounded"
              >
                <Row>
                  {/* <Col sm={12} md={6} lg={3}>
                    <FormGroup>
                      <h5 className="text-bold-600"> {t1("docDate")} </h5>
                      <InputGroup size="md" className="datePicker">
                        <DatePicker
                          dateFormat="dd.MM.yyyy"
                          selected={
                            request.docDate
                              ? moment(request.docDate, "DD.MM.YYYY").toDate()
                              : ""
                          }
                          onChange={(date, dateString) => {
                            this.handleChange(date, "docDate", {
                              value: moment(new Date(date)).format(
                                "DD.MM.YYYY"
                              ),
                            });
                          }}
                          isClearable={!!request.docDate ? true : false}
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
                                borderColor: errors.docDate
                                  ? "red"
                                  : "hsl(0,0%,70%)",
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
                        {errors.docDate ? (
                          <div>
                            <span className="text-danger">
                              {t2("docDateValidation", this.props.intl)}
                            </span>
                          </div>
                        ) : null}
                      </InputGroup>
                    </FormGroup>
                  </Col> */}
                  <Col sm={12} md={6} lg={3}>
                    <FormGroup>
                      <h5 className="text-bold-600">
                        <span style={{ color: "red" }}>*</span>
                        {t1("checkStartDate")}{" "}
                      </h5>
                      <InputGroup size="md" className="datePicker">
                        <DatePicker
                          dateFormat="dd.MM.yyyy"
                          selected={
                            request.checkStartDate
                              ? moment(
                                  request.checkStartDate,
                                  "DD.MM.YYYY"
                                ).toDate()
                              : ""
                          }
                          onChange={(date, dateString) => {
                            this.handleChange(date, "checkStartDate", {
                              value: moment(new Date(date)).format(
                                "DD.MM.YYYY"
                              ),
                            });
                          }}
                          isClearable={!!request.checkStartDate ? true : false}
                          locale={
                            intl.locale == "ru"
                              ? "ru"
                              : intl.locale == "cl"
                              ? "uzCyrl"
                              : "uz"
                          }
                          startDate={
                            request.checkStartDate
                              ? moment(
                                  request.checkStartDate,
                                  "DD.MM.YYYY"
                                ).toDate()
                              : ""
                          }
                          endDate={
                            request.checkEndDate
                              ? moment(
                                  request.checkEndDate,
                                  "DD.MM.YYYY"
                                ).toDate()
                              : ""
                          }
                          placeholderText={t2("docDate", intl)}
                          customInput={
                            <MaskedTextInput
                              type="text"
                              style={{
                                height: "38px",
                                borderRadius: "5px",
                                width: "100%",
                                borderColor: errors.checkStartDate
                                  ? "red"
                                  : "hsl(0,0%,70%)",
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
                        {errors.checkStartDate ? (
                          <div>
                            <span className="text-danger">
                              {t2("checkStartDateValidation", this.props.intl)}
                            </span>
                          </div>
                        ) : null}
                      </InputGroup>
                      {/* <DatePicker
                        defaultValue={
                          request.checkStartDate
                            ? moment(request.checkStartDate, "DD.MM.YYYY")
                            : ""
                        }
                        style={{
                          height: "38px",
                          borderRadius: "5px",
                          width: "100%",
                        }}
                        format={"DD.MM.YYYY"}
                        placeholder={t2("checkStartDate", intl)}
                        locale={locale}
                        onChange={(date) => {
                          this.handleChange(date, "checkStartDate", {
                            value: moment(new Date(date)).format("DD.MM.YYYY"),
                          });
                        }}
                      /> */}
                    </FormGroup>
                  </Col>
                  <Col sm={12} md={6} lg={3}>
                    <FormGroup>
                      <h5 className="text-bold-600">
                        <span style={{ color: "red" }}>*</span>
                        {t1("checkEndDate")}{" "}
                      </h5>
                      <InputGroup size="md" className="datePicker">
                        <DatePicker
                          dateFormat="dd.MM.yyyy"
                          selected={
                            request.checkEndDate
                              ? moment(
                                  request.checkEndDate,
                                  "DD.MM.YYYY"
                                ).toDate()
                              : ""
                          }
                          // styles={{
                          //   menu: (provided) => ({ ...provided, zIndex: 2000 }),
                          // }}
                          // style={{ zIndex: '2000 !important' }}
                          onChange={(date, dateString) => {
                            this.handleChange(date, "checkEndDate", {
                              value: moment(new Date(date)).format(
                                "DD.MM.YYYY"
                              ),
                            });
                          }}
                          isClearable={!!request.checkEndDate ? true : false}
                          locale={
                            intl.locale == "ru"
                              ? "ru"
                              : intl.locale == "cl"
                              ? "uzCyrl"
                              : "uz"
                          }
                          startDate={
                            request.checkStartDate
                              ? moment(
                                  request.checkStartDate,
                                  "DD.MM.YYYY"
                                ).toDate()
                              : ""
                          }
                          endDate={
                            request.checkEndDate
                              ? moment(
                                  request.checkEndDate,
                                  "DD.MM.YYYY"
                                ).toDate()
                              : ""
                          }
                          minDate={
                            request.checkStartDate
                              ? moment(
                                  request.checkStartDate,
                                  "DD.MM.YYYY"
                                ).toDate()
                              : ""
                          }
                          placeholderText={t2("docDate", intl)}
                          customInput={
                            <MaskedTextInput
                              type="text"
                              style={{
                                height: "38px",
                                borderRadius: "5px",
                                width: "100%",
                                borderColor: errors.checkEndDate
                                  ? "red"
                                  : "hsl(0,0%,70%)",
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
                        {errors.checkEndDate ? (
                          <div>
                            <span className="text-danger">
                              {t2("checkEndDateValidation", this.props.intl)}
                            </span>
                          </div>
                        ) : null}
                      </InputGroup>
                      {/* <DatePicker
                        defaultValue={
                          request.checkEndDate
                            ? moment(request.checkEndDate, "DD.MM.YYYY")
                            : ""
                        }
                        style={{
                          height: "38px",
                          borderRadius: "5px",
                          width: "100%",
                        }}
                        format={"DD.MM.YYYY"}
                        placeholder={t2("checkEndDate", intl)}
                        locale={locale}
                        onChange={(date) => {
                          this.handleChange(date, "checkEndDate", {
                            value: moment(new Date(date)).format("DD.MM.YYYY"),
                          });
                        }}
                        disabledDate={
                          (current) =>
                            !current ||
                            current.isBefore(
                              moment(request.checkStartDate, "DD.MM.YYYY")
                            )
                        }
                      /> */}
                    </FormGroup>
                  </Col>
                  <Col sm={12} md={6} lg={3}>
                    <FormGroup>
                      <h5 className="text-bold-600">
                        <span style={{ color: "red" }}>*</span>
                        {t1("checkDaysNumber")}{" "}
                      </h5>
                      <Input
                        type="text"
                        value={request.checkDaysNumber || ""}
                        onChange={(e) =>
                          this.handleChange(e, "checkDaysNumber")
                        }
                        id="checkDaysNumber"
                        placeholder={t2("checkDaysNumber", intl)}
                        invalid={errors.checkDaysNumber}
                      />
                      {/* <FormFeedback>
                        <span className="text-danger">
                          {t2("checkDaysNumberValidation", this.props.intl)}
                        </span>
                      </FormFeedback> */}
                      {errors.checkDaysNumber ? (
                        <div>
                          <span className="text-danger">
                            {t2("checkTypeIdValidation", this.props.intl)}
                          </span>
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col sm={12} md={6} lg={3}></Col>
                  <Col sm={12} md={6} lg={3}>
                    <FormGroup>
                      <h5 className="text-bold-600">
                        <span style={{ color: "red" }}>*</span>
                        {t1("checkTypeId")}
                      </h5>
                      <Select
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 200 }),
                        }}
                        className={errors.checkTypeId ? "invalid" : ""}
                        classNamePrefix="select"
                        defaultValue={{
                          text: request.checkType || t2("Choose", intl),
                        }}
                        value={{
                          text: request.checkType || t2("Choose", intl),
                        }}
                        isClearable
                        name="color"
                        options={CheckTypeList}
                        label="text"
                        getOptionLabel={(item) => item.text}
                        onChange={(e) => {
                          this.handleChange(e, "checkTypeId", e);
                          this.CheckBasisChange();
                          this.CheckBasisChangeValue();
                          // this.employeechange();
                        }}
                      />
                      {errors.checkTypeId ? (
                        <div>
                          <span className="text-danger">
                            {t2("checkTypeIdValidation", this.props.intl)}
                          </span>
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                  {request.checkTypeId == 2 ? (
                    <Col sm={12} md={6} lg={4}>
                      <FormGroup>
                        <h5 className="text-bold-600">
                          <span style={{ color: "red" }}>*</span>
                          {t1("organizationInspectionTypeId")}
                        </h5>
                        <Select
                          styles={{
                            menu: (provided) => ({ ...provided, zIndex: 2 }),
                          }}
                          className={
                            errors.organizationInspectionTypeId ? "invalid" : ""
                          }
                          classNamePrefix="select"
                          defaultValue={{
                            text:
                              request.organizationInspectionType ||
                              t2("Choose", intl),
                          }}
                          name="color"
                          options={OrganizationInspectionTypes}
                          label="text"
                          isClearable
                          getOptionLabel={(item) => item.text}
                          // isDisabled={
                          //   can("AllRequestCreate")
                          //     ? false
                          //     : can("AllRequestEdit")
                          //     ? false
                          //     : true
                          // }
                          onChange={(e) => {
                            this.handleChange(
                              e,
                              "organizationInspectionTypeId",
                              e
                            );
                            // this.employeechange();
                          }}
                        />
                        {errors.organizationInspectionTypeId ? (
                          <div>
                            <span className="text-danger">
                              {t2("checkTypeIdValidation", this.props.intl)}
                            </span>
                          </div>
                        ) : null}
                      </FormGroup>
                    </Col>
                  ) : (
                    ""
                  )}

                  <Col sm={12} md={6} lg={3}>
                    <FormGroup>
                      <h5 className="text-bold-600">
                        <span style={{ color: "red" }}>*</span>
                        {t1("checkBasisId")}
                      </h5>
                      <Select
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 200 }),
                        }}
                        isClearable
                        className={errors.checkBasisId ? "invalid" : ""}
                        classNamePrefix="select"
                        defaultValue={{
                          text: request.checkBasis || t2("Choose", intl),
                        }}
                        value={{
                          text: request.checkBasis || t2("Choose", intl),
                        }}
                        name="color"
                        options={CheckBasisList}
                        label="text"
                        getOptionLabel={(item) => item.text}
                        onChange={(e) => {
                          this.handleChange(e, "checkBasisId", e);
                        }}
                      />
                      {errors.checkBasisId ? (
                        <div>
                          <span className="text-danger">
                            {t2("checkBasisIdValidation", this.props.intl)}
                          </span>
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                  {request.checkTypeId == 2 ? (
                    ""
                  ) : (
                    <Col sm={12} md={6} lg={6}></Col>
                  )}

                  <Col sm={12} md={6} lg={3}>
                    <FormGroup>
                      <h5 className="text-bold-600">
                        <span style={{ color: "red" }}>*</span>
                        {t1("checkCoverageStartDate")}
                      </h5>
                      <InputGroup size="md" className="datePicker">
                        <DatePicker
                          dateFormat="dd.MM.yyyy"
                          selected={
                            request.checkCoverageStartDate
                              ? moment(
                                  request.checkCoverageStartDate,
                                  "DD.MM.YYYY"
                                ).toDate()
                              : ""
                          }
                          onChange={(date, dateString) => {
                            this.handleChange(date, "checkCoverageStartDate", {
                              value: moment(new Date(date)).format(
                                "DD.MM.YYYY"
                              ),
                            });
                          }}
                          isClearable={
                            !!request.checkCoverageStartDate ? true : false
                          }
                          locale={
                            intl.locale == "ru"
                              ? "ru"
                              : intl.locale == "cl"
                              ? "uzCyrl"
                              : "uz"
                          }
                          startDate={
                            request.checkCoverageStartDate
                              ? moment(
                                  request.checkCoverageStartDate,
                                  "DD.MM.YYYY"
                                ).toDate()
                              : ""
                          }
                          endDate={
                            request.checkCoverageEndDate
                              ? moment(
                                  request.checkCoverageEndDate,
                                  "DD.MM.YYYY"
                                ).toDate()
                              : ""
                          }
                          placeholderText={t2("docDate", intl)}
                          customInput={
                            <MaskedTextInput
                              type="text"
                              style={{
                                height: "38px",
                                borderRadius: "5px",
                                width: "100%",
                                borderColor: errors.checkCoverageStartDate
                                  ? "red"
                                  : "hsl(0,0%,70%)",
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
                        {errors.checkCoverageStartDate ? (
                          <div>
                            <span className="text-danger">
                              {t2(
                                "checkCoverageStartDateValidation",
                                this.props.intl
                              )}
                            </span>
                          </div>
                        ) : null}
                      </InputGroup>
                      {/* <DatePicker
                        defaultValue={
                          request.checkCoverageStartDate
                            ? moment(
                                request.checkCoverageStartDate,
                                "DD.MM.YYYY"
                              )
                            : ""
                        }
                        style={{
                          height: "38px",
                          borderRadius: "5px",
                          width: "100%",
                        }}
                        format={"DD.MM.YYYY"}
                        placeholder={t2("checkCoverageStartDate", intl)}
                        locale={locale}
                        onChange={(date) => {
                          this.handleChange(date, "checkCoverageStartDate", {
                            value: moment(new Date(date)).format("DD.MM.YYYY"),
                          });
                        }}
                      /> */}
                    </FormGroup>
                  </Col>
                  <Col sm={12} md={6} lg={3}>
                    <FormGroup>
                      <h5 className="text-bold-600">
                        <span style={{ color: "red" }}>*</span>
                        {t1("checkCoverageEndDate")}
                      </h5>
                      <InputGroup size="md" className="datePicker">
                        <DatePicker
                          dateFormat="dd.MM.yyyy"
                          selected={
                            request.checkCoverageEndDate
                              ? moment(
                                  request.checkCoverageEndDate,
                                  "DD.MM.YYYY"
                                ).toDate()
                              : ""
                          }
                          onChange={(date, dateString) => {
                            this.handleChange(date, "checkCoverageEndDate", {
                              value: moment(new Date(date)).format(
                                "DD.MM.YYYY"
                              ),
                            });
                          }}
                          isClearable={
                            !!request.checkCoverageEndDate ? true : false
                          }
                          locale={
                            intl.locale == "ru"
                              ? "ru"
                              : intl.locale == "cl"
                              ? "uzCyrl"
                              : "uz"
                          }
                          startDate={
                            request.checkCoverageStartDate
                              ? moment(
                                  request.checkCoverageStartDate,
                                  "DD.MM.YYYY"
                                ).toDate()
                              : ""
                          }
                          endDate={
                            request.checkCoverageEndDate
                              ? moment(
                                  request.checkCoverageEndDate,
                                  "DD.MM.YYYY"
                                ).toDate()
                              : ""
                          }
                          minDate={
                            request.checkCoverageStartDate
                              ? moment(
                                  request.checkCoverageStartDate,
                                  "DD.MM.YYYY"
                                ).toDate()
                              : ""
                          }
                          placeholderText={t2("docDate", intl)}
                          customInput={
                            <MaskedTextInput
                              type="text"
                              style={{
                                height: "38px",
                                borderRadius: "5px",
                                width: "100%",
                                borderColor: errors.checkCoverageEndDate
                                  ? "red"
                                  : "hsl(0,0%,70%)",
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
                        {errors.checkCoverageEndDate ? (
                          <div>
                            <span className="text-danger">
                              {t2(
                                "checkCoverageEndDateValidation",
                                this.props.intl
                              )}
                            </span>
                          </div>
                        ) : null}
                      </InputGroup>
                      {/* <DatePicker
                        defaultValue={
                          request.checkCoverageEndDate
                            ? moment(request.checkCoverageEndDate, "DD.MM.YYYY")
                            : ""
                        }
                        style={{
                          height: "38px",
                          borderRadius: "5px",
                          width: "100%",
                        }}
                        format={"DD.MM.YYYY"}
                        placeholder={t2("checkCoverageEndDate", intl)}
                        locale={locale}
                        onChange={(date) => {
                          this.handleChange(date, "checkCoverageEndDate", {
                            value: moment(new Date(date)).format("DD.MM.YYYY"),
                          });
                        }}
                        disabledDate={
                          (current) =>
                            !current ||
                            current.isBefore(
                              moment(
                                request.checkCoverageStartDate,
                                "DD.MM.YYYY"
                              )
                            )
                        }
                      /> */}
                    </FormGroup>
                  </Col>

                  <Col sm={12} md={6} lg={6}>
                    <FormGroup>
                      <h5 className="text-bold-600">
                        {" "}
                        <span style={{ color: "red" }}>*</span>
                        {t1("basicFiles")}
                      </h5>
                      <Row>
                        <Col>
                          <CustomInput
                            accept="application/pdf"
                            id="exampleFile"
                            // name="file"
                            value={null}
                            type="file"
                            label="Прикрепить файл"
                            dataBrowse={
                              this.state.fileLoading ? (
                                <Spinner size="sm"></Spinner>
                              ) : (
                                "Прикрепить файл"
                              )
                            }
                            onChange={(e) => {
                              this.handleChangeOrderFile(
                                e.target.files,
                                "basic"
                              );
                            }}
                          >
                            {" "}
                          </CustomInput>
                        </Col>
                        <Col>
                          {/* <h4 class="d-flex align-items-center">
                            <span
                              style={{ color: "red", marginBottom: "15px" }}
                            >
                              {" "}
                              *{" "}
                            </span>
                            <span> {t1("checkFilePdf20mb")} </span>
                          </h4> */}
                          {request.basicFiles?.map((item, index) => (
                            <Badge
                              id="positionTop"
                              color="primary"
                              className="mr-1"
                              key={index}
                            >
                              {item.fileName || item.name}{" "}
                              <Icon.Trash
                                onClick={() =>
                                  this.DeleteFile(item, index, "basic")
                                }
                                style={{ cursor: "pointer" }}
                                size={15}
                              />
                              <UncontrolledTooltip
                                placement="top"
                                target="positionTop"
                              >
                                {t1("dateOfCreatedFile")} - {item.dateOfCreated}
                              </UncontrolledTooltip>
                            </Badge>
                          ))}
                        </Col>
                      </Row>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
              <div
                style={{ backgroundColor: "#f8f8f8" }}
                className="p-2 mb-2 rounded"
              >
                <Row>
                  <Col sm={12} md={6} lg={4}>
                    <FormGroup>
                      <h5 className="text-bold-600">
                        {t1("orderedOrganizationId")}
                      </h5>
                      <Select
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 2 }),
                        }}
                        className="React"
                        classNamePrefix="select"
                        defaultValue={{
                          text:
                            request.orderedOrganization || t2("Choose", intl),
                        }}
                        name="color"
                        options={OrderedOrganizationList}
                        label="text"
                        isClearable
                        getOptionLabel={(item) => item.text}
                        isDisabled={
                          can("AllRequestCreate")
                            ? false
                            : can("AllRequestEdit")
                            ? false
                            : true
                        }
                        onChange={(e) => {
                          this.handleChange(e, "orderedOrganizationId", e);
                          this.employeechange();
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col sm={12} md={6} lg={4}>
                    <FormGroup>
                      <h5 className="text-bold-600">
                        <span style={{ color: "red" }}>*</span>
                        {t1("inspectionOrganizationId")}
                      </h5>
                      <Select
                        classNamePrefix="select"
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 200 }),
                        }}
                        className={
                          errors.inspectionOrganizationId ? "invalid" : ""
                        }
                        defaultValue={{
                          text:
                            request.inspectionOrganization ||
                            t2("Choose", intl),
                        }}
                        value={{
                          text:
                            request.inspectionOrganization ||
                            t2("Choose", intl),
                        }}
                        name="color"
                        options={InspectionOrganizationList}
                        label="text"
                        getOptionLabel={(item) => item.text}
                        isClearable
                        isDisabled={
                          can("BranchesRequestCreate") ||
                          can("AllRequestCreate") ||
                          can("BranchesRequestEdit") ||
                          can("AllRequestEdit")
                            ? false
                            : true
                        }
                        onChange={(e) => {
                          this.handleChange(e, "inspectionOrganizationId", e);
                          this.employeechange();
                        }}
                      />
                      {errors.inspectionOrganizationId ? (
                        <div>
                          <span className="text-danger">
                            {t2(
                              "inspectionOrganizationIdValidation",
                              this.props.intl
                            )}
                          </span>
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col sm={12} md={6} lg={4}>
                    <FormGroup>
                      <h5 className="text-bold-600">
                        {t1("authorizedOrganizationId")}
                      </h5>
                      <Select
                        className="React"
                        classNamePrefix="select"
                        defaultValue={{
                          text:
                            request.authorizedOrganization ||
                            t2("Choose", intl),
                        }}
                        isClearable
                        name="color"
                        options={AuthorizedOrganizationList}
                        label="text"
                        getOptionLabel={(item) => item.text}
                        onChange={(e) => {
                          this.handleChange(e, "authorizedOrganizationId", e);
                        }}
                        isDisabled={true}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </div>
              <div
                style={{ backgroundColor: "#f8f8f8" }}
                className="p-2 mb-2 rounded"
              >
                <Row>
                  <Col sm={12} md={12} lg={12}>
                    <FormGroup>
                      <h5 className="text-bold-600">
                        <span style={{ color: "red" }}>*</span>
                        {t1("CheckingQuiz")}
                      </h5>
                      <Select
                        className={errors.checkingQuizzes ? "invalid" : ""}
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 200 }),
                        }}
                        classNamePrefix="select"
                        isMulti
                        placeholder={t2("CheckingQuiz", intl)}
                        defaultValue={
                          !!request.checkingQuizzes
                            ? request.checkingQuizzes.length > 0
                              ? CheckingQuizzesList?.filter((item) =>
                                  request.checkingQuizzes.includes(item.value)
                                )
                              : []
                            : []
                        }
                        value={
                          !!request.checkingQuizzes
                            ? request.checkingQuizzes.length > 0
                              ? CheckingQuizzesList?.filter((item) =>
                                  request.checkingQuizzes.includes(item.value)
                                )
                              : []
                            : []
                        }
                        // value={
                        //   !!request.inspectors
                        //     ? request.inspectors.length > 0
                        //       ? EmployeeList.rows?.filter((item) =>
                        //           request.inspectors.includes(item.value)
                        //         )
                        //       : []
                        //     : []
                        // }
                        name="color"
                        options={CheckingQuizzesList}
                        label="text"
                        getOptionLabel={(item) =>
                          item.text + " - " + item.normativeLegalDoc
                        }
                        onChange={(e) => {
                          this.handleChange(e, "checkingQuizzes", {
                            value:
                              e?.length > 0 ? e.map((item) => item.value) : [],
                          });
                        }}
                      />
                      {errors.checkingQuizzes ? (
                        <div>
                          <span className="text-danger">
                            {t2("checkingQuizzesValidation", this.props.intl)}
                          </span>
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                </Row>
              </div>

              {request.checkTypeId == 2 ? (
                <div
                  style={{ backgroundColor: "#f8f8f8" }}
                  className="p-2 mb-2 rounded"
                >
                  <Row>
                    <Col sm={12} md={6} lg={3}>
                      <FormGroup>
                        <h5 className="text-bold-600"> {t1("orderNumber")} </h5>
                        <Input
                          type="text"
                          value={request.orderNumber || ""}
                          onChange={(e) => this.handleChange(e, "orderNumber")}
                          id="orderNumber"
                          placeholder={t2("orderNumber", intl)}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm={12} md={6} lg={3}>
                      <FormGroup>
                        <h5 className="text-bold-600"> {t1("orderDate")} </h5>
                        <InputGroup size="md" className="datePicker">
                          <DatePicker
                            dateFormat="dd.MM.yyyy"
                            selected={
                              request.orderDate
                                ? moment(
                                    request.orderDate,
                                    "DD.MM.YYYY"
                                  ).toDate()
                                : ""
                            }
                            onChange={(date, dateString) => {
                              this.handleChange(date, "orderDate", {
                                value: moment(new Date(date)).format(
                                  "DD.MM.YYYY"
                                ),
                              });
                            }}
                            isClearable={!!request.orderDate ? true : false}
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
                                  borderColor: errors.docDate
                                    ? "red"
                                    : "hsl(0,0%,70%)",
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
                          {errors.docDate ? (
                            <div>
                              <span className="text-danger">
                                {t2("docDateValidation", this.props.intl)}
                              </span>
                            </div>
                          ) : null}
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col sm={12} md={6} lg={5}>
                      <FormGroup>
                        <h5 className="text-bold-600">{t1("orderFiles")}</h5>
                        <Row>
                          <Col sm={12} md={6} lg={6}>
                            <CustomInput
                              accept="application/pdf"
                              id="exampleFile"
                              name="file"
                              type="file"
                              label="Прикрепить файл"
                              dataBrowse="Прикрепить файл"
                              onChange={(e) => {
                                this.handleChangeOrderFile(
                                  e.target.files,
                                  "order"
                                );
                              }}
                            />
                          </Col>
                          <Col sm={12} md={6} lg={6}>
                            {/* <h4 class="d-flex align-items-center">
                              <span
                                style={{ color: "red", marginBottom: "15px" }}
                              >
                                {" "}
                                *{" "}
                              </span>
                              <span> {t1("checkFilePdf20mb")} </span>
                            </h4> */}
                            {request.orderFiles?.map((item, index) => (
                              <Badge
                                id="position"
                                color="primary"
                                className="mr-1"
                                key={index}
                              >
                                {item.fileName || item.name}{" "}
                                <Icon.Trash
                                  onClick={() =>
                                    this.DeleteFile(item, index, "order")
                                  }
                                  style={{ cursor: "pointer" }}
                                  size={15}
                                />{" "}
                                <UncontrolledTooltip
                                  placement="top"
                                  target="position"
                                >
                                  {t1("dateOfCreatedFile")} -{" "}
                                  {item.dateOfCreated}
                                </UncontrolledTooltip>
                              </Badge>
                            ))}
                          </Col>
                        </Row>
                      </FormGroup>
                    </Col>
                    <Col sm={12} md={6} lg={4}>
                      <FormGroup>
                        <h5 className="text-bold-600">{t1("inspectors")}</h5>
                        <Select
                          className="basic-multi-select"
                          classNamePrefix="select"
                          isMulti
                          placeholder={t2("inspectors", intl)}
                          value={
                            !!request.inspectors
                              ? request.inspectors.length > 0
                                ? EmployeeList.rows?.filter((item) =>
                                    request.inspectors.includes(item.value)
                                  )
                                : []
                              : []
                          }
                          defaultValue={
                            !!request.inspectors
                              ? request.inspectors.length > 0
                                ? EmployeeList.rows?.filter((item) =>
                                    request.inspectors.includes(item.value)
                                  )
                                : []
                              : []
                          }
                          // value={this.state.value}
                          name="color"
                          options={EmployeeList.rows}
                          label="text"
                          getOptionLabel={(item) => item.text}
                          onChange={(e) => {
                            this.handleChange(e, "inspectors", {
                              value:
                                e?.length > 0
                                  ? e.map((item) => item.value)
                                  : [],
                            });
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
              ) : (
                ""
              )}

              <Row className="mb-4 pb-4">
                <Col className="text-right">
                  <Button
                    className="mr-1"
                    color="danger"
                    onClick={() => history.push("/document/request")}
                  >
                    {" "}
                    {t1("back")}{" "}
                  </Button>
                  <Button color="success" onClick={this.SaveData}>
                    {" "}
                    {SaveLoading ? <Spinner size="sm" /> : ""} {t1("Save")}{" "}
                  </Button>
                </Col>
              </Row>
            </TabPane>
            {/* <TabPane tabId="2">
              <Row>
                <Col>
                  <Button
                    color="danger"
                    onClick={() => history.push("/document/request")}
                  >
                    {" "}
                    {t1("back")}{" "}
                  </Button>
                </Col>
                <Col className="text-right">
                  <Button color="success" onClick={this.SaveDataAttachOrder}>
                    {" "}
                    {SaveAttachOrderLoading ? <Spinner size="sm" /> : ""}{" "}
                    {t1("Save")}{" "}
                  </Button>
                </Col>
              </Row>
            </TabPane> */}
          </TabContent>
        </Card>
      </Overlay>
    );
  }
}

export default injectIntl(EditRequest);
