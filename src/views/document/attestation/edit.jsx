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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Tooltip,
  TooltipItem,
  UncontrolledTooltip,
  Label,
} from "reactstrap";
import Overlay from "../../../components/Webase/components/Overlay";
import ManualService from "../../../services/other/manual.service";
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
import RegionService from "../../../services/info/region.service";
import EmployeeService from "../../../services/info/employee.service";
import AttestationService from "../../../services/document/attestation.service";
import OrganizationService from "../../../services/management/organization.service";
import ReactPaginate from "react-paginate";
import "../../../assets/scss/plugins/extensions/react-paginate.scss";
import "./style.css";
// import { DatePicker, Space } from "antd";
import "moment/locale/ru";
import locale from "antd/es/date-picker/locale/ru_RU";
import CheckValidation from "../../../components/Webase/functions/checkvalidation";
import axios from "axios";
import EditEmployee from "../../info/employee/edit";
import DatePicker, { registerLocale } from "react-datepicker";
import MaskedTextInput from "react-text-mask";
import uz from "date-fns/locale/uz";
import uzCyrl from "date-fns/locale/uz-Cyrl";
import ru from "date-fns/locale/ru";
registerLocale("uz", uz);
registerLocale("uzCyrl", uzCyrl);
registerLocale("ru", ru);
const { t1, t2 } = Translate;
const { errorToast, successToast, customErrorToast } = Notification;

const { can } = Permission;
const { check, checkFilePdf20mb } = CheckValidation;
let items = [];
let ObjItems = [];


if (window.performance) {
  if (performance.navigation.type == 1) {
    localStorage.removeItem("itemsPerson");
    localStorage.removeItem("ObjItems");
  }
}
class EditRequest extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      SaveLoading: false,
      StateList: [],
      RegionList: [],
      DistrictList: [],
      InnLoading: false,
      attestation: {
        files: [],
      },
      modal: false,
      modalEmp: false,
      value: "",
      filteredData: [],
      employee: [],
      empSelectAll: false,
      columns: [
        {
          name: "№",
          selector: "number",
          sortable: false,
        },
        {
          // name: (
          //   <FormGroup check inline>
          //     <Input
          //       type="checkbox"
          //       // defaultChecked={this.state.empSelectAll}
          //       onClick={this.handleRowClickedAll}
          //     />
          //   </FormGroup>
          // ),
          name: "",
          selector: "checkbox",
          sortable: false,
        },
        {
          name: t1("passportInfo"),
          selector: "passportInfo",
          sortable: true,
        },
        {
          name: t1("Name"),
          selector: "text",
          sortable: true,
        },

        {
          name: t1("region"),
          selector: "region",
          sortable: true,
        },
        {
          name: t1("district"),
          selector: "district",
          sortable: true,
        },
        {
          name: t1("parentOrganization"),
          selector: "parentOrganizaton",
          sortable: true,
        },
        {
          name: t1("organization"),
          selector: "organization",
          sortable: true,
        },
        {
          name: t1("position"),
          selector: "position",
          sortable: true,
        },
      ],
      employeeInitial: [],
      checkEmployId: null,
      OrderTypeSelect: [],
      OrganizationList: [],
      ParentList: [],
      tempSize: [],
      errors: {
        docDate: null,
        // items: null,
      },
      errors2: {},
      page: {
        sortBy: "",
        orderType: "asc",
        page: 1,
        pageSize: 20,
        filters: {
          isHr: {
            value: "false",
            matchMode: "equals",
          },
        },
      },
      pageSelectList: [5, 20, 50, 100, 200],
      total: 0,
      search: "",
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
    AttestationService.Get(this.props.match.params.id)
      .then((res) => {
        this.setState({ attestation: res.data, loading: false });
        if (
          res.data.parentOrganizationId !== "" ||
          res.data.organizationId !== ""
        ) {
          this.GetDataEmployee();
        }
        if (this.props.ID ? 0 : this.props.match.params.id != 0) {
          this.changeParentOrg(this.state.attestation.parentOrganizationId);
        }
        this.changeParentOrg(res.data.parentOrganizationId);
      })
      .then(() => {})
      .catch((error) => {
        this.setState({ loading: false });
        errorToast(error.response.data);
      });
  };
  GetDataEmployee = (parentOrganizationId, organizationId) => {
    const { page, attestation, search } = this.state;
    EmployeeService.GetAsSelectList({
      parentOrganizationId: attestation.parentOrganizationId,
      organizationId: attestation.organizationId,
      sortBy: page.sortBy,
      orderType: page.orderType,
      page: page.page,
      pageSize: page.pageSize,
      search: search,
      isHr: false,
    }).then((res) => {
      let { attestation } = this.state,
        testInitialItemArr = [];

      for (let j = 0; j < attestation.items.length; j++) {
        testInitialItemArr.push(attestation.items[j].employeeId);
      }

      this.setState({
        employee:
          res.data.rows.length > 0
            ? res.data.rows.map((item, idx) => {
                let ted = JSON.parse(localStorage.getItem("itemsPerson"));
                // console.log("GGGGGGGGGG", ted);
                if (ted?.length > 0) {
                  if (ted.includes(item.value)) {
                    return { ...item, toggleSelected: true };
                  } else {
                    return { ...item, toggleSelected: false };
                  }
                } else {
                  if (testInitialItemArr.includes(item.value)) {
                    return { ...item, toggleSelected: true };
                  } else {
                    return { ...item, toggleSelected: false };
                  }
                }
              })
            : [],
        loadingModal: false,
        total: res.data.total,
      });
      let tempArray = [];
      for (let i = 0; i < res.data.total; i++) {
        tempArray.push(i + 1);
      }
      let start = this.state.page.pageSize * (page.page - 1);
      let end = start + this.state.page.pageSize;
      let tempSize = tempArray.slice(start, end);
      this.setState({ tempSize });
    });
  };
  GetDataList = () => {
    ManualService.StateSelectList().then((res) => {
      this.setState({ StateList: res.data });
    });
    ManualService.OrderTypeSelect().then((res) => {
      this.setState({ OrderTypeSelect: res.data });
    });
    RegionService.GetAsSelectList(211).then((res) => {
      this.setState({ RegionList: res.data });
    });
    // this.GetDataEmployee();
    OrganizationService.GetAsSelectList().then((res) => {
      this.setState({ ParentList: res.data });
    });
  };
  changeParentOrg = (id) => {
    this.state.employee = [];
    OrganizationService.GetAsSelectList(id, false, false).then((res) => {
      this.setState({ OrganizationList: res.data });
    });
  };
  handleChange(event, field, data) {
    var request = this.state.attestation;
    if (!!event) {
      request[field] = !!event?.target ? event.target.value : data.value;
      if (field == "parentOrganizationId") {
        this.changeParentOrg(data.value);
        request.parentOrganization = this.state.ParentList.filter(
          (item) => item.value == data.value
        )[0].text;
        this.GetDataEmployee();
      }
      if (field == "organizationId") {
        request.organization = this.state.OrganizationList.filter(
          (item) => item.value == data.value
        )[0].text;
        this.GetDataEmployee();
      }
      this.setState({ request: request });
      this.validation(() => {});
    } else {
      if (field === "docDate" || field === "parentOrganizationId") {
        request[field] = "";
      }
      if (field === "parentOrganizationId") {
        request.parentOrganization = "";
        request.parentOrganizationId = null;

        request.organization = "";
        request.organizationId = null;
      }
      if (field === "organizationId") {
        request.organization = "";
        request.organizationId = null;
      }

      this.setState({ request: request });
      this.validation(() => {});
    }
    this.validation(() => {});
  }
  handleChangeOrderFile = (file, field) => {
    if (file.length > 0) {
      if (!checkFilePdf20mb(file[0], this.props.intl)) {
        return false;
      }
    }
    if (field == "attestation") {
      let formData = new FormData();
      for (let i = 0; i < file.length; i++) {
        formData.append(`files`, file[i]);
      }
      const { attestation } = this.state;
      AttestationService.UploadFile(formData).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          attestation.files.push({
            id: res.data[i].fileId,
            name: res.data[i].fileName,
          });
        }
        this.setState({ attestation: attestation });
      });
    }
  };

  DeleteFile = (data, index, field) => {
    let request = this.state.attestation;
    let test;
    if (field == "attestation") {
      test = request.files.filter((item) => item.id !== data.id);
      this.setState((prevState) => ({
        attestation: {
          ...prevState.attestation,
          files: test,
        },
      }));
    }
  };
  check() {
    const { attestation } = this.state;
    if (
      attestation.parentOrganizationId === null ||
      attestation.parentOrganizationId === 0 ||
      attestation.parentOrganizationId === "" ||
      attestation.parentOrganizationId === undefined
    ) {
      customErrorToast(t2("parentOrganizationNotSelected", this.props.intl));
      return false;
    }
    if (
      attestation.authorizedOrganizationId === null ||
      attestation.authorizedOrganizationId === 0 ||
      attestation.authorizedOrganizationId === "" ||
      attestation.authorizedOrganizationId === undefined
    ) {
      customErrorToast(
        t2("authorizedOrganizationNotSelected", this.props.intl)
      );
      return false;
    }
    if (
      attestation.items === null ||
      attestation.items === 0 ||
      attestation.items === "" ||
      attestation.items === undefined ||
      attestation.items.length === 0
    ) {
      customErrorToast(t2("itemsNotSelected", this.props.intl));
      return false;
    }
    for (let i = 0; i < attestation.items.length; i++) {
      if (
        attestation.items[i].orderTypeId === "" ||
        attestation.items[i].orderTypeId === 0 ||
        attestation.items[i].orderTypeId === null ||
        attestation.items[i].orderTypeId === undefined
      ) {
        customErrorToast(t2("orderTypeIdNotSelected", this.props.intl));
        return false;
      }
    }
    // for (let i = 0; i < attestation.items.length; i++) {
    //   if (
    //     attestation.items[i].expirationDate === "" ||
    //     attestation.items[i].expirationDate === 0 ||
    //     attestation.items[i].expirationDate === null ||
    //     attestation.items[i].expirationDate === undefined
    //   ) {
    //     customErrorToast(t2("expirationDateIdNotSelected", this.props.intl));
    //     return false;
    //   }
    // }

    return true;
  }
  SaveData = () => {
    // if (!this.check()) {
    //   return false;
    // }
    this.validation(() => {
      if (
        Object.values(this.state.errors).filter((item) => item == true)
          .length == 0
        //   ||
        // Object.values(this.state.errors2).filter((item) => item == true)
        //   .length == 0
      ) {
        this.setState({ SaveLoading: true });
        AttestationService.Update(this.state.attestation)
          .then((res) => {
            this.setState({ SaveLoading: false });
            successToast(t2("SuccessSave", this.props.intl));

            setTimeout(() => {
              this.props.history.push(
                "/document/viewattestation/" + res.data.id
              );
            }, 500);
          })
          .catch((error) => {
            errorToast(error.response.data);
            this.setState({ SaveLoading: false });
          });
      }
    });
    localStorage.removeItem("itemsPerson");
    localStorage.removeItem("ObjItems");
  };
  validation = (callback) => {
    var attestation = this.state.attestation;
    var errors2,
      errors = {
        docDate: !!attestation.docDate ? false : true,
        // items: attestation.existing,
      };
    // if (attestation.existing && attestation.items.length > 0) {
    //   attestation.items.map((item,idx) => {
    //     errors2 = {errors2[idx]: ''}
    //   })
    // }
    this.setState({ errors: errors }, () => callback());
  };

  toggleModal = () => {
    if (!this.isCheck()) {
      return false;
    }
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  isCheck() {
    if (
      this.state.attestation.docDate?.length === 0 ||
      this.state.attestation.docDate === null
    ) {
      customErrorToast(t2("docDateValidation", this.props.intl));
      return false;
    }
    if (this.state.attestation.files.length === 0) {
      customErrorToast(t2("FileNotUpload", this.props.intl));
      return false;
    }

    return true;
  }
  toggleModalEmp = () => {
    this.setState((prevState) => ({
      modalEmp: !prevState.modalEmp,
    }));
  };

  handleSearchBtn() {
    let data = this.state.employee;
    let filteredData = this.state.filteredData;
    let value = this.state.value;

    if (value.length) {
      filteredData = data.filter((item) => {
        let startsWithCondition = item.passportInfo
          .toLowerCase()
          .startsWith(value.toLowerCase());
        let includesCondition = item.passportInfo
          .toLowerCase()
          .includes(value.toLowerCase());

        if (startsWithCondition) {
          return startsWithCondition;
        } else if (!startsWithCondition && includesCondition) {
          return includesCondition;
        } else return null;
      });
      this.setState({ filteredData });
    }
  }
  conditionalRowStyles = [
    {
      when: (row) => row.toggleSelected,
      style: {
        backgroundColor: "#e3f2fd",
        userSelect: "none",
      },
    },
  ];
  handleRowClicked = (row) => {
    let updatedData;
    updatedData = this.state.employee.map((item) => {
      if (row.value !== item.value) {
        return item;
      }
      return {
        ...item,
        toggleSelected: !item.toggleSelected,
      };
    });

    const temp = JSON.parse(localStorage.getItem("itemsPerson"));
    // console.log("AAAAAA", temp);
    updatedData.filter((item) => {
      if (item.toggleSelected) {
        if (temp?.includes(item.value)) {
          // items = items.filter((data) => data !== item.value);
        } else {
          items.push(item.value);
          localStorage.setItem("itemsPerson", JSON.stringify(items));
          ObjItems.push(item);
          localStorage.setItem("ObjItems", JSON.stringify(ObjItems));
        }
      } else {
        if (temp?.includes(item.value)) {
          items = items.filter((data) => data !== item.value);
          localStorage.setItem("itemsPerson", JSON.stringify(items));
          ObjItems = ObjItems.filter((data) => data.value !== item.value);
          localStorage.setItem("ObjItems", JSON.stringify(ObjItems));
        } else {
          // items.push(item.value);
        }
      }
    });
    // ObjItems = updatedData.filter((item) => {
    //   if (items.includes(item.value)) {
    //     return item;
    //   }
    // });
    // console.log("ADADSASDADAADADADADADAD", ObjItems);
    this.setState({
      employee: updatedData,
    });
  };
  handleRowClickedAll = () => {
    let updatedData;
    this.setState((prevState) => ({ empSelectAll: !prevState.empSelectAll }));
    updatedData = this.state.employee.map((item) => {
      return {
        ...item,
        toggleSelected: !item.toggleSelected,
      };
    });

    this.setState({
      employee: updatedData,
    });
  };
  existingCheck() {
    var attestation = this.state.attestation;
    let clear;
    if (attestation.existing) {
      clear = attestation.items?.map((item) => {
        item.expirationDate = "";
        item.certificateNumber = "";
      });
      return clear;
    }
  }
  handleChangeItems = (e, field, id, data) => {
    var items;
    if (!!e) {
      items = this.state.attestation.items.filter((item) => {
        if (item.employeeId === id) {
          field === "orderTypeId"
            ? (item[field] = e.value)
            : (item[field] = !!e.target ? e.target.value : data.value);
        }
        return item;
      });
    } else {
      items = this.state.attestation.items.filter((item) => {
        if (item.employeeId === id) {
          field === "orderTypeId"
            ? (item[field] = e.value)
            : (item[field] = "");
        }
        return item;
      });
    }
    this.setState((prevState) => ({
      attestation: { ...prevState.attestation, items },
    }));
  };
  deleteItems = (id) => {
    var items = this.state.attestation.items.filter(
      (item) => item.employeeId !== id
    );

    this.setState((prevState) => ({
      attestation: { ...prevState.attestation, items },
    }));
    let updatedData;
    if (this.state.value.length) {
      updatedData = this.state.filteredData.map((item) => {
        if (id == item.value) {
          return { ...item, toggleSelected: false };
        }
        return item;
      });
      this.setState({ filteredData: updatedData });
    } else {
      updatedData = this.state.employee.map((item) => {
        if (id == item.value) {
          return { ...item, toggleSelected: false };
        }
        return item;
      });
      this.setState({ employee: updatedData });
    }
  };

  AddEmployeeInitial = (id) => {
    // var attestation = this.state.attestation;
    let { attestation, employee } = this.state;

    let attestationTest,
      testInitialItemArr = [];
    let ted = JSON.parse(localStorage.getItem("itemsPerson"));
    let ObjItems = JSON.parse(localStorage.getItem("ObjItems"));
    attestationTest =
      ted?.length > 0
        ? ObjItems
        : employee.filter((item) => !!item.toggleSelected === true);
    for (let j = 0; j < attestation.items.length; j++) {
      testInitialItemArr.push(attestation.items[j].employeeId);
    }
    for (let n = 0; n < attestationTest.length; n++) {
      if (!testInitialItemArr.includes(attestationTest[n].value)) {
        this.state.attestation.items.push({
          id: 0,
          ownerId: 0,
          employeeId: attestationTest[n].value,
          certificateNumber: "",
          expirationDate: "",
          orderTypeId: 2,
          stateId: 1,
          employeeName: attestationTest[n].text,
          // passportInfo: item.passportInfo,
          // position: employee[n].position,
        });
      }
    }
    this.setState((prevState) => ({
      initialItemArr: testInitialItemArr,
      // attestation: {
      //   ...prevState.attestation,
      //   items: { ...prevState.attestation.items, attestationTest2.map((item) => item) },
      // },
    }));
  };
  onSortChange = (item) => {
    if (!!item.sort) {
      var orderType = this.state.page.orderType;
      if (orderType == "asc") {
        this.SortChange(item.key, "desc");
      } else {
        this.SortChange(item.key, "asc");
      }
    }
  };
  SortChange = (columnName, orderType) => {
    var page = this.state.page;
    page.orderType = orderType;
    page.sortBy = columnName;
    this.setState({ page: page });
    this.Refresh();
  };
  render() {
    const {
      loading,
      SaveLoading,
      attestation,
      InnLoading,
      value,
      tempSize,
      columns,
      filteredData,
      employee,
      employeeInitial,
      StateList,
      OrderTypeSelect,
      ParentList,
      OrganizationList,
      page,
      total,
      errors,
      pageSelectList,
    } = this.state;
    const { history, intl } = this.props;
    //template

    return (
      <Overlay show={loading}>
        <Modal
          isOpen={this.state.modalEmp}
          toggle={this.toggleModalEmp}
          className="modal-xl"
        >
          <ModalHeader toggle={this.toggleModalEmp}></ModalHeader>
          <ModalBody>
            <EditEmployee
              ID={true}
              CloseModal={this.toggleModalEmp}
              Refresh={this.GetDataEmployee}
              organization={{
                organization: attestation.organization,
                organizationId: attestation.organizationId,
              }}
            />
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggleModal}
          className="modal-xl"
        >
          <ModalHeader toggle={this.toggleModal}>{t1("Employee")}</ModalHeader>
          <ModalBody>
            <Row className="mb-2 mt-1">
              <Col sm={12} md={6} lg={4}>
                <InputGroup>
                  <Input
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        // this.child.Refresh();
                      }
                    }}
                    placeholder={t2("Search", intl)}
                    onChange={(e) => this.setState({ search: e.target.value })}
                  />
                  <InputGroupAddon addonType="append">
                    <Button
                      color="primary"
                      onClick={() => {
                        this.state.page.page = 1;
                        // this.child.Refresh();
                        this.GetDataEmployee();
                      }}
                    >
                      {" "}
                      <Icon.Search size={14} /> {t1("Search")}{" "}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
              <Col sm={12} md={6} lg={8} className="text-right">
                {can("EmployeeCreate") || can("BranchesEmployeeCreate") ? (
                  <Button
                    color="success"
                    onClick={this.toggleModalEmp}
                    // onClick={() => {
                    //   this.props.history.push({
                    //     pathname: "/info/editemployee/0",
                    //     state: { attestation: true },
                    //   });
                    // }}
                  >
                    {t1("AddEmployee")}
                  </Button>
                ) : (
                  ""
                )}
              </Col>
              <Col sm={12} md={4} lg={4}></Col>
            </Row>
            <Table bordered borderless>
              <thead className="bg-primary text-white">
                <tr>
                  {columns?.map((item, idx) => (
                    <th key={idx}>{item.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employee?.map((item, idx) => (
                  <tr
                    key={idx}
                    className={item.toggleSelected ? "activeROW" : ""}
                  >
                    {columns?.map((column, idxc) =>
                      column.selector === "checkbox" ? (
                        <th>
                          <FormGroup check inline>
                            <input
                              type="checkbox"
                              checked={item.toggleSelected ? true : false}
                              onClick={() => this.handleRowClicked(item)}
                            />
                          </FormGroup>
                        </th>
                      ) : column.selector === "number" ? (
                        <th>{tempSize[idx]}</th>
                      ) : (
                        <th key={idxc}>{item[column.selector]}</th>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
            <Row>
              <Col className="ml-1 d-flex align-items-center">
                <div className="mr-2">
                  {" "}
                  {(page.page - 1) * page.pageSize + 1}-
                  {total < page.pageSize
                    ? total
                    : page.page * page.pageSize > total
                    ? total
                    : page.page * page.pageSize}{" "}
                  ({total}){" "}
                </div>

                <div style={{ width: 100 }}>
                  <CustomInput
                    id="exampleSelect"
                    name="select"
                    type="select"
                    value={page.pageSize}
                    onChange={(e) => {
                      page.pageSize = e.target.value;
                      this.setState({ page: page });
                      this.GetDataEmployee();
                    }}
                  >
                    {pageSelectList.map((item, index) => (
                      <option key={index}> {item} </option>
                    ))}
                  </CustomInput>
                </div>
              </Col>
              <Col>
                <ReactPaginate
                  previousLabel={<Icon.ChevronLeft size={15} />}
                  nextLabel={<Icon.ChevronRight size={15} />}
                  breakLabel="..."
                  forcePage={page.page - 1}
                  breakClassName="break-me"
                  pageCount={Math.ceil(total / page.pageSize)}
                  containerClassName="vx-pagination separated-pagination pagination-end pagination-sm mb-0 mt-2"
                  activeClassName="active"
                  onPageChange={(num) => {
                    page.page = num.selected + 1;
                    this.setState({ page: page });
                    this.GetDataEmployee();
                  }}
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                this.toggleModal();
                this.AddEmployeeInitial(this.state.checkEmployId);
                this.setState({ search: "" });
              }}
            >
              {t1("Add")}
            </Button>{" "}
          </ModalFooter>
        </Modal>

        <Card className="p-2">
          <Row>
            <Col className="text-center mb-1">
              <h1 className="pageTextView"> {t1("Attestation")} </h1>
            </Col>
          </Row>
          <Row>
            {/* <Col sm={12} md={6} lg={3}>
              <FormGroup>
                <h5 className="text-bold-600">
                  {" "}
                  {t1("docNumberAttestation")}{" "}
                </h5>
                <Input
                  disabled
                  type="text"
                  value={attestation.docNumber || ""}
                  onChange={(e) => this.handleChange(e, "docNumber")}
                  id="docNumber"
                  placeholder={t2("docNumberAttestation", intl)}
                />
              </FormGroup>
            </Col> */}
            <Col sm={12} md={6} lg={3}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("attestationDocDate")} </h5>
                <InputGroup size="md" className="datePicker">
                  <DatePicker
                    dateFormat="dd.MM.yyyy"
                    selected={
                      this.state.attestation.docDate
                        ? moment(
                            this.state.attestation.docDate,
                            "DD.MM.YYYY"
                          ).toDate()
                        : ""
                    }
                    onChange={(date, dateString) => {
                      this.handleChange(date, "docDate", {
                        value: moment(new Date(date)).format("DD.MM.YYYY"),
                      });
                    }}
                    isClearable={
                      !!this.state.attestation.docDate ? true : false
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
                          borderColor: errors.docDate ? "red" : "hsl(0,0%,70%)",
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
                        {t2("attestationDocDateValidation", this.props.intl)}
                      </span>
                    </div>
                  ) : null}
                </InputGroup>
                {/* <DatePicker
                  defaultValue={
                    this.state.attestation.docDate
                      ? moment(this.state.attestation.docDate, "DD.MM.YYYY")
                      : ""
                  }
                  style={{ height: "38px", borderRadius: "5px", width: "100%" }}
                  format={"DD.MM.YYYY"}
                  placeholder={t2("attestationDocDate", intl)}
                  locale={locale}
                  onChange={(date) => {
                    this.handleChange(date, "docDate", {
                      value: moment(new Date(date)).format("DD.MM.YYYY"),
                    });
                  }}
                /> */}
              </FormGroup>
            </Col>
            <Col sm={12} md={9} lg={9}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("parentOrganization")}</h5>
                <Select
                  className="React"
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 200 }),
                  }}
                  classNamePrefix="select"
                  defaultValue={{
                    text: attestation.parentOrganization || t2("Choose", intl),
                  }}
                  value={{
                    text: attestation.parentOrganization || t2("Choose", intl),
                  }}
                  name="color"
                  options={ParentList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  isClearable
                  isDisabled={
                    // () =>
                    // this.props.match.params.id === 0 &&
                    can("AllAttestationCreate")
                      ? // ||
                        //   can("BranchesAttestationCreate"))
                        false
                      : // : can("AllAttestationCreate")
                        // ? false
                        true

                    // can("BranchesAttestationCreate") ||
                    // can("AllAttestationCreate")
                    //   ? true
                    //   : false
                  }
                  onChange={(e) => {
                    this.handleChange(e, "parentOrganizationId", e);
                    // this.change();
                  }}
                />
              </FormGroup>
            </Col>

            <Col sm={12} md={3} lg={3}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("addFile")}</h5>
                <Row>
                  <Col sm={12} md={12} lg={12}>
                    <CustomInput
                      accept="application/pdf"
                      id="exampleFile"
                      name="file"
                      type="file"
                      label={t1("addFile")}
                      dataBrowse={t2("addFile", this.props.intl)}
                      onChange={(e) => {
                        this.handleChangeOrderFile(
                          e.target.files,
                          "attestation"
                        );
                      }}
                    />
                  </Col>
                </Row>
              </FormGroup>
            </Col>
            <Col sm={12} md={9} lg={9}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("organization")}</h5>
                <Select
                  className="React"
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 200 }),
                  }}
                  classNamePrefix="select"
                  defaultValue={{
                    text: attestation.organization || t2("Choose", intl),
                  }}
                  value={{
                    text: attestation.organization || t2("Choose", intl),
                  }}
                  name="color"
                  options={OrganizationList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  isClearable
                  isDisabled={
                    // () =>
                    // this.props.match.params.id === 0 &&
                    can("AllAttestationCreate") ||
                    can("BranchesAttestationCreate")
                      ? // ||
                        //   can("BranchesAttestationCreate"))
                        false
                      : // : can("AllAttestationCreate")
                        // ? false
                        true

                    // can("BranchesAttestationCreate") ||
                    // can("AllAttestationCreate")
                    //   ? true
                    //   : false
                  }
                  onChange={(e) => this.handleChange(e, "organizationId", e)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={6} className="mb-1 mt-1">
              {/* <h4 class="d-flex align-items-center">
                      <span style={{ color: "red" }}> * </span>
                      <span> {t1("checkFilePdf20mb")} </span>
                    </h4> */}
              {/* <TooltipItem
                      id={0}
                      item={{
                        placement: "top",
                        text: "Top",
                      }}
                    /> */}

              {attestation.files?.map((item, index) => (
                <Badge
                  id="positionTop"
                  color="primary"
                  className="mr-1"
                  key={index}
                >
                  {item.fileName || item.name}{" "}
                  <Icon.Trash
                    onClick={() => this.DeleteFile(item, index, "attestation")}
                    style={{ cursor: "pointer" }}
                    size={15}
                  />
                  {/* <Tooltip
                          placement="top"
                          isOpen={tooltipOpen}
                          target="ControlledExample"
                          toggle={() => setTooltipOpen(!tooltipOpen)}
                        >
                          Hello World !
                        </Tooltip> */}
                  <UncontrolledTooltip placement="top" target="positionTop">
                    {t1("dateOfCreatedFile")} - {item.dateOfCreated}
                  </UncontrolledTooltip>
                </Badge>
              ))}
            </Col>
            <Col sm={12} md={12} lg={12}>
              {attestation.files?.map((item, index) => (
                <iframe
                  width="100%"
                  height="500px"
                  // dangerouslySetInnerHTML={{ __html: HtmlData }}
                  src={
                    axios.defaults.baseURL +
                    `/Attestation/DownloadFile/${item.id}`
                  }
                ></iframe>
              ))}
            </Col>

            <Col sm={12} md={12} lg={12}>
              <FormGroup check>
                <Label check style={{ fontSize: "18px" }}>
                  <Input
                    type="checkbox"
                    id="checkbox2"
                    onChange={() => {
                      this.setState((prevState) => ({
                        attestation: {
                          ...prevState.attestation,
                          existing: !prevState.attestation.existing,
                        },
                      }));
                      this.existingCheck();
                    }}
                    defaultChecked={attestation.existing}
                  />{" "}
                  {t1("allCertificatePeople")}
                </Label>
              </FormGroup>
            </Col>
          </Row>
        </Card>
        <Card className="p-2">
          <Row style={{ marginBottom: "20px" }}>
            <Col>
              <h2> {t1("Employee")}</h2>
            </Col>
            <Col className="text-right">
              <Button
                color="success"
                onClick={() => {
                  this.toggleModal();
                  this.GetDataEmployee();
                }}
              >
                {t1("AddEmployee")}
              </Button>
            </Col>
          </Row>

          <Table bordered borderless striped>
            <thead className="bg-primary text-white">
              <tr>
                <th>{"№"}</th>
                <th>{t1("fio")}</th>
                {/* <th> {t1("passportNumber")}</th> */}
                <th>{t1("Position")}</th>
                <th>{t1("OrderType")}</th>
                <th>{t1("CertificateNumber")}</th>
                <th>{t1("passportExpiration")}</th>
                <th>{t1("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {attestation.items?.map((item, idx) => (
                <tr key={idx}>
                  <th>{idx + 1}</th>
                  <th>{item.employeeName}</th>
                  {/* <th>{item.passportInfo}</th> */}
                  <th>{item.position}</th>
                  <th style={{ width: "250px" }}>
                    <Select
                      styles={{
                        menu: (provided) => ({ ...provided, zIndex: 200 }),
                      }}
                      className="React"
                      classNamePrefix="select"
                      defaultValue={{
                        text:
                          OrderTypeSelect.filter(
                            (el) => el.value == item.orderTypeId
                          )[0]?.text || t2("Choose", intl),
                      }}
                      name="color"
                      options={OrderTypeSelect}
                      label="text"
                      getOptionLabel={(iteM) => iteM.text}
                      onChange={(e) =>
                        this.handleChangeItems(
                          e,
                          "orderTypeId",
                          item.employeeId
                        )
                      }
                    />
                  </th>
                  <th>
                    <Input
                      type="text"
                      value={item.certificateNumber || ""}
                      disabled={!attestation.existing}
                      onChange={(e) =>
                        this.handleChangeItems(
                          e,
                          "certificateNumber",
                          item.employeeId
                        )
                      }
                      id="certificateNumber"
                      placeholder={t2("CertificateNumber", intl)}
                    />
                  </th>
                  <th>
                    {/* <Flatpickr
                      className="form-control DATE"
                      value={item.expirationDate}
                      placeholder={t2("docDate", intl)}
                      readOnly={false}
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
                        this.handleChangeItems(
                          date,
                          "expirationDate",
                          item.employeeId,
                          {
                            value: moment(new Date(date)).format("DD.MM.YYYY"),
                          }
                        );
                      }}
                    /> */}
                    <InputGroup size="md" className="datePicker">
                      <DatePicker
                        disabled={!attestation.existing}
                        dateFormat="dd.MM.yyyy"
                        selected={
                          item.expirationDate
                            ? moment(item.expirationDate, "DD.MM.YYYY").toDate()
                            : ""
                        }
                        onChange={(date, dateString) => {
                          this.handleChangeItems(
                            date,
                            "expirationDate",
                            item.employeeId,
                            {
                              value: moment(new Date(date)).format(
                                "DD.MM.YYYY"
                              ),
                            }
                          );
                        }}
                        isClearable={!!item.expirationDate ? true : false}
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
                      />
                      <InputGroupAddon addonType="append">
                        <Button color="primary" size="sm">
                          <Icon.Calendar id={"translate"} size={15} />
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </th>
                  <th>
                    {" "}
                    <Button
                      color="danger"
                      onClick={() => this.deleteItems(item.employeeId)}
                    >
                      <Icon.X size={10} />
                    </Button>
                  </th>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
        <Card>
          <Row className="m-2">
            <Col className="text-right">
              <Button
                className="mr-1"
                color="danger"
                onClick={() => history.push("/document/attestation")}
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
export default injectIntl(EditRequest);
