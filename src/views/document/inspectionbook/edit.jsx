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
  Badge,
  TabContent,
  TabPane,
  Nav,
  Form,
  Label,
  NavItem,
  NavLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  CardHeader,
  CardTitle,
  CardBody,
} from "reactstrap";
import Select from "react-select";
import { Plus, AlertCircle, Check } from "react-feather";
import RequestService from "../../../services/document/request.service";
import Overlay from "../../../components/Webase/components/Overlay";
import ManualService from "../../../services/other/manual.service";
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
import RequestPostponementService from "../../../services/document/requestpostponement.service";
import InspectionResultService from "../../../services/document/inspectionresult.service";
import request from ".";
import { map } from "jquery";
import RejectionReasonService from "../../../services/info/rejectionreason.service";
import HtmlReportService from "../../../services/reports/HtmlReport.service";
import axios from "axios";
import InspectionBookService from "../../../services/document/inspectionbook.service";
import ControlFunctionService from "../../../services/info/controlfunction.service";
import EmployeeService from "../../../services/info/employee.service";
import style from "../inspectionbook/style.css";
// import { DatePicker } from "antd";
import "moment/locale/ru";
import locale from "antd/es/date-picker/locale/ru_RU";
import DatePicker, { registerLocale } from "react-datepicker";
import MaskedTextInput from "react-text-mask";
import InputMask from "react-input-mask";
import uz from "date-fns/locale/uz";
import uzCyrl from "date-fns/locale/uz-Cyrl";
import ru from "date-fns/locale/ru";
registerLocale("uz", uz);
registerLocale("uzCyrl", uzCyrl);
registerLocale("ru", ru);
const { t1, t2 } = Translate;
const { can } = Permission;
const { errorToast, successToast } = Notification;

const initialSpecial = {
  id: 0,
  inspectionBookId: 0,
  fullName: "",
  workplace: "",
  directionOfActivity: "",
  contractNumber: "",
};
class EditInspectionResult extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      inspectionnook: {
        contractor: {},
      },
      loading: false,
      loadingPostponement: false,
      SaveLoading: false,
      activeTab: "1",

      downloadLoad: { check: false, id: null },
      ControlFunctionsList: [],
      EmployList: [],
      modal: false,

      special: initialSpecial,
    };
  }
  //Created
  componentDidMount() {
    this.Refresh();
    this.GetDataList();
  }
  // methods
  onSetSidebarOpen(open) {
    this.setState({ sideBarOpen: open });
  }
  toggleModal = (name) => {
    this.setState({ activeModal: name });
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
    this.state.receive.id = this.state.request.id;
  };
  toggleModalSpecial = (name) => {
    this.setState({
      special: {
        id: 0,
        inspectionBookId: 0,
        fullName: "",
        workplace: "",
        directionOfActivity: "",
        contractNumber: "",
      },
    });
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  Refresh = () => {
    this.setState({ loading: true });
    if (
      !!this.props.location.state &&
      this.props.location.state.inspectionBtn
    ) {
      InspectionBookService.GetByRequestId(this.props.match.params.id)
        .then((res) => {
          this.setState({
            inspectionnook: res.data,
            loading: false,
          });
        })
        .catch((error) => {
          this.setState({ loading: false });
          errorToast(error.response.data);
        });
    } else {
      InspectionBookService.Get(this.props.match.params.id)
        .then((res) => {
          this.setState({
            inspectionnook: res.data,
            loading: false,
          });
        })
        .catch((error) => {
          this.setState({ loading: false });
          errorToast(error.response.data);
        });
    }
  };

  GetDataList = () => {
    ManualService.StateSelectList().then((res) => {
      this.setState({ StateList: res.data });
    });
    RejectionReasonService.GetAsSelectList().then((res) => {
      this.setState({ RejectList: res.data });
    });
    ControlFunctionService.GetAsSelectList().then((res) => {
      this.setState({ ControlFunctionsList: res.data });
    });
    EmployeeService.GetAsSelectList({}).then((res) => {
      this.setState({ EmployList: res.data.rows });
    });
  };
  handleChange(event, field, data) {
    var requestpostponement = this.state.requestpostponement;
    requestpostponement[field] = !!event.target
      ? event.target.value
      : data.value;
    this.setState({ requestpostponement: requestpostponement });
    if (field == "orderedOrganizationId") {
      this.changeOrderedOrg(data.value);
      this.changeCheckingQuiz(data.value);
      this.changeAuthorizedOrganization(data.value);
    }
  }
  handleChangeEdit(event, field, data) {
    var request = this.state.inspectionnook;
    request[field] = !!event?.target ? event.target.value : data.value;

    if (field == "parentOrganizationId") {
      this.changeParentOrg(data.value);
      request.parentOrganization = this.state.ParentList.filter(
        (item) => item.value == data.value
      )[0].text;
    }
    if (field == "organizationId") {
      request.organization = this.state.OrganizationList.filter(
        (item) => item.value == data.value
      )[0].text;
    }
    this.setState({ inspectionnook: request });
  }
  handleChangeModal(event, field, data) {
    var request = this.state.special;
    request[field] = !!event?.target ? event.target.value : data.value;

    this.setState({ special: request });
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  SaveData = () => {
    this.setState({ SaveLoading: true });
    InspectionBookService.Update(this.state.inspectionnook)
      .then((res) => {
        this.setState({ SaveLoading: false });
        successToast(t2("SuccessSave", this.props.intl));
        setTimeout(() => {
          this.props.history.push(
            "/document/viewinspectionbook/" + res.data.id
          );
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ SaveLoading: false });
      });
  };

  getColor = (id) => {
    switch (id) {
      case 1:
        return "info";
        break;
      case 2:
        return "warning";
        break;
      case 3:
        return "success";
        break;

      default:
        return "light";
        break;
    }
  };
  AddSpecial = () => {
    if (this.state.activeModal === "edit") {
      this.state.inspectionnook.specialists[this.state.activeIdx] =
        this.state.special;
    } else {
      this.setState((prevState) => ({
        inspectionnook: {
          ...prevState.inspectionnook,
          specialists: [
            ...prevState.inspectionnook.specialists,
            this.state.special,
          ],
        },
      }));
    }
  };
  Edit(item) {
    let initialSpecialIndex = this.state.inspectionnook.specialists?.findIndex(
      (element) => element === item
    );
    this.setState({
      special: new Object({
        ...item,
      }),
      activeIdx: initialSpecialIndex,
    });
  }
  DeleteItems(item) {
    let initialSpecialIndex =
      this.state.inspectionnook.specialists.indexOf(item);

    if (initialSpecialIndex > -1) {
      this.state.inspectionnook.specialists.splice(initialSpecialIndex, 1);
      this.setState({ activeIdx: initialSpecialIndex }); // 2nd parameter means remove one item only
    }
  }

  render() {
    const {
      loading,
      inspectionnook,
      downloadLoad,
      ControlFunctionsList,
      EmployList,
      modal,
      SaveLoading,
      special,
    } = this.state;
    const { history, intl } = this.props;
    //template
    return (
      <Overlay show={loading}>
        <Modal
          isOpen={modal}
          toggle={this.toggleModalSpecial}
          className={this.props.className}
          size="lg"
        >
          <ModalHeader toggle={this.toggleModalSpecial}>
            {t1("specialists")}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col sm={12} md={6} lg={12}>
                <FormGroup>
                  <h5 className="text-bold-600"> {t1("fullName")} </h5>
                  <Input
                    type="text"
                    value={special.fullName || ""}
                    onChange={(e) => this.handleChangeModal(e, "fullName")}
                    id="fullName"
                    placeholder={t2("fullName", intl)}
                  />
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={12}>
                <FormGroup>
                  <h5 className="text-bold-600"> {t1("workplace")} </h5>
                  <Input
                    type="text"
                    value={special.workplace || ""}
                    onChange={(e) => this.handleChangeModal(e, "workplace")}
                    id="workplace"
                    placeholder={t2("workplace", intl)}
                  />
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={12}>
                <FormGroup>
                  <h5 className="text-bold-600">
                    {" "}
                    {t1("directionOfActivity")}{" "}
                  </h5>
                  <Input
                    type="text"
                    value={special.directionOfActivity || ""}
                    onChange={(e) =>
                      this.handleChangeModal(e, "directionOfActivity")
                    }
                    id="directionOfActivity"
                    placeholder={t2("directionOfActivity", intl)}
                  />
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={12}>
                <FormGroup>
                  <h5 className="text-bold-600"> {t1("contractNumber")} </h5>
                  <Input
                    type="text"
                    value={special.contractNumber || ""}
                    onChange={(e) =>
                      this.handleChangeModal(e, "contractNumber")
                    }
                    id="contractNumber"
                    placeholder={t2("contractNumber", intl)}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                this.toggleModalSpecial();
                this.AddSpecial();
              }}
            >
              {t1("Accept")}
            </Button>
          </ModalFooter>
        </Modal>
        <Card className="p-2">
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
                    <h2> {t1("InspectionBook")} </h2>
                  </Col>
                </Row>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col sm={12} md={10} lg={10}>
                  <Table>
                    <tbody>
                      <tr>
                        <td className="text-center" colSpan={4}>
                          <h6
                            className="text-bold-600"
                            style={{ fontSize: "20px" }}
                          >
                            {t1("PersonalInfo")}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">
                          <h6 className="text-bold-600">{t1("inn")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionnook.contractor.innOrPinfl}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">{t1("contractor")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionnook.contractor.fullName}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">{t1("Region")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionnook.contractor.region}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">{t1("District")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionnook.contractor.district}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">
                          <h6 className="text-bold-600">{t1("Oked")}</h6>
                        </td>
                        <td colSpan={3}>
                          <h6 className="text-bold-900">
                            {inspectionnook.contractor.oked}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">
                          <h6 className="text-bold-600">
                            {t1("orderedOrganizationId")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionnook.orderedOrganization}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">
                            {t1("inspectionOrganizationId")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionnook.inspectionOrganization}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">
                          <h6 className="text-bold-600">
                            {t1("authorizedOrganizationId")}
                          </h6>
                        </td>
                        <td colSpan={3}>
                          <h6 className="text-bold-900">
                            {inspectionnook.authorizedOrganization}
                          </h6>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col className="text-right" sm={12} md={2} lg={2}>
                  <Button
                    style={{ width: "100%", marginBottom: "5px" }}
                    color="danger"
                    onClick={() => history.goBack()}
                  >
                    {" "}
                    {t1("back")}{" "}
                  </Button>
                  <Button
                    style={{ width: "100%", marginBottom: "5px" }}
                    color="success"
                    onClick={this.SaveData}
                  >
                    {" "}
                    {SaveLoading ? <Spinner size="sm" /> : ""} {t1("Save")}{" "}
                  </Button>
                </Col>
              </Row>
              {/* <Row>
            <Col>
              <Button color="danger" onClick={() => history.push("/info/news")}>
                {" "}
                {t1("back")}{" "}
              </Button>
            </Col>
            <Col className="text-right">
              <Button color="success" onClick={this.SaveData}>
                {" "}
                {SaveLoading ? <Spinner size="sm" /> : ""} {t1("Save")}{" "}
              </Button>
            </Col>
          </Row> */}
            </TabPane>
          </TabContent>

          <Row>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("docDate")} </h5>
                <InputGroup size="md" className="datePicker">
                  <DatePicker
                    dateFormat="dd.MM.yyyy"
                    selected={
                      this.state.inspectionnook.docDate
                        ? moment(
                            this.state.inspectionnook.docDate,
                            "DD.MM.YYYY"
                          ).toDate()
                        : ""
                    }
                    onChange={(date, dateString) => {
                      this.handleChangeFilters(date, "docDate", {
                        value: moment(new Date(date)).format("DD.MM.YYYY"),
                      });
                      this.child.Refresh();
                    }}
                    isClearable={
                      !!this.state.inspectionnook.docDate > 0 ? true : false
                    }
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
                          borderColor: "hsl(0,0%,70%)",
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
                    selectsEnd
                    startDate={
                      this.state.filters.startDate.value
                        ? moment(
                            this.state.filters.startDate.value,
                            "DD.MM.YYYY"
                          ).toDate()
                        : ""
                    }
                    endDate={
                      this.state.filters.endDate.value
                        ? moment(
                            this.state.filters.endDate.value,
                            "DD.MM.YYYY"
                          ).toDate()
                        : ""
                    }
                    minDate={
                      this.state.filters.endDate.value
                        ? moment(
                            this.state.filters.endDate.value,
                            "DD.MM.YYYY"
                          ).toDate()
                        : ""
                    }
                  />
                  <InputGroupAddon addonType="append">
                    <Button color="primary" size="sm">
                      <Icon.Calendar id={"translate"} size={15} />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                <DatePicker
                  defaultValue={
                    this.state.inspectionnook.docDate
                      ? moment(this.state.inspectionnook.docDate, "DD.MM.YYYY")
                      : ""
                  }
                  style={{ height: "38px", borderRadius: "5px", width: "100%" }}
                  format={"DD.MM.YYYY"}
                  placeholder={t2("docDate", intl)}
                  locale={locale}
                  onChange={(date) => {
                    this.handleChangeEdit(date, "docDate", {
                      value: moment(new Date(date)).format("DD.MM.YYYY"),
                    });
                  }}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("startDate")} </h5>
                {/* <Flatpickr
                  className="form-control"
                  value={inspectionnook.startDate}
                  placeholder={t2("startDate", intl)}
                  options={{
                    dateFormat: "d.m.Y",
                    locale:
                      intl.locale == "ru"
                        ? Russian
                        : intl.locale == "cl"
                        ? Uzbek
                        : UzbekLatin,
                  }}
                  onChange={(date) => {
                    this.handleChangeEdit(date, "startDate", {
                      value: moment(new Date(date)).format("DD.MM.YYYY"),
                    });
                  }}
                /> */}
                <DatePicker
                  defaultValue={
                    this.state.inspectionnook.startDate
                      ? moment(
                          this.state.inspectionnook.startDate,
                          "DD.MM.YYYY"
                        )
                      : ""
                  }
                  style={{ height: "38px", borderRadius: "5px", width: "100%" }}
                  format={"DD.MM.YYYY"}
                  placeholder={t2("startDate", intl)}
                  locale={locale}
                  onChange={(date) => {
                    this.handleChangeEdit(date, "startDate", {
                      value: moment(new Date(date)).format("DD.MM.YYYY"),
                    });
                  }}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("endDate")} </h5>
                {/* <Flatpickr
                  className="form-control"
                  value={inspectionnook.endDate}
                  placeholder={t2("endDate", intl)}
                  options={{
                    dateFormat: "d.m.Y",
                    locale:
                      intl.locale == "ru"
                        ? Russian
                        : intl.locale == "cl"
                        ? Uzbek
                        : UzbekLatin,
                  }}
                  onChange={(date) => {
                    this.handleChangeEdit(date, "endDate", {
                      value: moment(new Date(date)).format("DD.MM.YYYY"),
                    });
                  }}
                /> */}
                <DatePicker
                  defaultValue={
                    this.state.inspectionnook.endDate
                      ? moment(this.state.inspectionnook.endDate, "DD.MM.YYYY")
                      : ""
                  }
                  style={{ height: "38px", borderRadius: "5px", width: "100%" }}
                  format={"DD.MM.YYYY"}
                  placeholder={t2("endDate", intl)}
                  locale={locale}
                  onChange={(date) => {
                    this.handleChangeEdit(date, "endDate", {
                      value: moment(new Date(date)).format("DD.MM.YYYY"),
                    });
                  }}
                  disabledDate={
                    (current) =>
                      !current ||
                      current.isBefore(
                        moment(
                          this.state.inspectionnook.startDate,
                          "DD.MM.YYYY"
                        )
                      )
                    // current && current.valueOf() < Date.now()
                  }
                />
              </FormGroup>
            </Col>

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("checkDaysNumber")} </h5>
                <Input
                  type="number"
                  value={inspectionnook.checkDaysNumber || ""}
                  onChange={(e) => this.handleChangeEdit(e, "checkDaysNumber")}
                  id="checkDaysNumber"
                  placeholder={t2("checkDaysNumber", intl)}
                />
              </FormGroup>
            </Col>

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("orderNumber")} </h5>
                <Input
                  type="textarea"
                  value={inspectionnook.orderNumber || ""}
                  onChange={(e) => this.handleChangeEdit(e, "orderNumber")}
                  id="orderNumber"
                  placeholder={t2("orderNumber", intl)}
                />
              </FormGroup>
            </Col>
            {/* <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("message")} </h5>
                <Input
                  type="text"
                  value={inspectionnook.message || ""}
                  onChange={(e) => this.handleChangeEdit(e, "message")}
                  id="message"
                  placeholder={t2("message", intl)}
                />
              </FormGroup>
            </Col> */}
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("controlFunctions")}</h5>
                <Select
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 200 }),
                  }}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isMulti
                  placeholder={t2("controlFunctions", intl)}
                  defaultValue={
                    !!inspectionnook.controlFunctions &&
                    inspectionnook.controlFunctions.length > 0
                      ? ControlFunctionsList.filter((item) =>
                          inspectionnook.controlFunctions.includes(item.value)
                        )
                      : []
                  }
                  name="color"
                  options={ControlFunctionsList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => {
                    this.handleChangeEdit(false, "controlFunctions", {
                      value: e.map((item) => item.value),
                    });
                  }}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("inspectors")}</h5>
                <Select
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 200 }),
                  }}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isMulti
                  placeholder={t2("inspectors", intl)}
                  defaultValue={
                    !!inspectionnook.inspectors &&
                    inspectionnook.inspectors.length > 0
                      ? EmployList.filter((item) =>
                          inspectionnook.inspectors.includes(item.value)
                        )
                      : []
                  }
                  name="color"
                  options={EmployList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => {
                    this.handleChangeEdit(false, "inspectors", {
                      value: e.map((item) => item.value),
                    });
                  }}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}></Col>
            <Col sm={12} md={6} lg={4} className="text-right">
              <Button
                style={{ width: "50%" }}
                color="info"
                className="mt-2"
                onClick={() => {
                  this.toggleModalSpecial();
                  this.setState({ activeModal: "add" });
                }}
              >
                {t1("Add")}
              </Button>
            </Col>
          </Row>

          <Row>
            <Col sm={12} md={6} lg={12}>
              <Table
                bordered
                borderless
                striped
                style={{ marginBottom: "300px" }}
              >
                <thead className="bg-primary text-white">
                  <tr>
                    <th> {t1("fullname")}</th>
                    <th>{t1("workplace")}</th>
                    <th>{t1("directionOfActivity")}</th>
                    <th>{t1("contractNumber")}</th>
                    <th>{t1("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {inspectionnook.specialists?.map((item, idx) => (
                    <tr key={idx}>
                      <th>{item.fullName}</th>
                      <th>{item.workplace}</th>
                      <th>{item.directionOfActivity}</th>
                      <th>{item.contractNumber}</th>

                      <th>
                        <Row>
                          <div
                            onClick={() => {
                              this.toggleModalSpecial();
                              this.Edit(item);
                              this.setState({ activeModal: "edit" });
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <Icon.Edit size={20} />
                          </div>
                          <div
                            onClick={() => this.DeleteItems(item)}
                            style={{ cursor: "pointer" }}
                          >
                            <Icon.Trash2 size={20} />
                          </div>
                        </Row>
                      </th>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Card>
      </Overlay>
    );
  }
}
export default injectIntl(EditInspectionResult);
