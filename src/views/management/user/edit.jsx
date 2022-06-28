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
  Table,
  CustomInput,
  FormFeedback,
} from "reactstrap";
import DataTable from "react-data-table-component";
import * as Icon from "react-feather";
import UserService from "../../../services/management/user.service";
import Overlay from "../../../components/Webase/components/Overlay";
import OrganizationService from "../../../services/management/organization.service";
import ManualService from "../../../services/other/manual.service";
import Select from "react-select";
import RoleService from "../../../services/management/role.service";
import { Notification, Translate } from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
import EmployeeService from "../../../services/info/employee.service";
import InputMask from "react-input-mask";
import ReactPaginate from "react-paginate";
import "../../../assets/scss/plugins/extensions/react-paginate.scss";
import CheckValidation from "../../../components/Webase/functions/checkvalidation";
import "./style.css";
const { t1, t2 } = Translate;
const { check, checkFilePdf20mb } = CheckValidation;
const { errorToast, successToast } = Notification;

const CustomHeader = (props) => {
  return (
    <div className="position-relative has-icon-left mb-1">
      <Input value={props.value} onChange={(e) => props.handleFilter(e)} />
      <div className="form-control-position">
        <Icon.Search size="15" />
      </div>
    </div>
  );
};

class EditUser extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      loading: false,
      SaveLoading: false,
      StateList: [],
      OrganizationList: [],
      RoleList: [],
      PersonList: [],
      ParentList: [],
      modal: false,
      value: "",
      filteredData: [],
      StateList: [],
      employee: [],
      columns: [
        {
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
      errors: {
        userName: null,
        password: null,
        phoneNumber: null,
        roles: null,
        stateId: null,
      },
      checkEmployId: null,
      employeeInitial: {},
      page: {
        sortBy: "",
        orderType: "asc",
        page: 1,
        pageSize: 20,
      },
      pageSelectList: [20, 50, 100, 200],
      total: 0,
      search: "",
    };
  }

  validation = (callback) => {
    var data = this.state.user;
    var errors = {
      userName: !!data.userName ? false : true,
      password:
        this.props.match.params.id === 0
          ? !!data.password
            ? false
            : true
          : false,
      stateId: !!data.stateId ? false : true,
      roles: !!data.roles && data?.roles?.length > 0 ? false : true,
      phoneNumber: !!data.phoneNumber ? false : true,
    };
    this.setState({ errors: errors }, () => callback());
  };
  //Created
  componentDidMount() {
    this.Refresh();
    this.GetDataList();
  }
  // methods
  Refresh = () => {
    this.setState({ loading: true });
    UserService.Get(this.props.match.params.id)
      .then((res) => {
        this.setState({ user: res.data, loading: false });
        if (this.props.match.params.id != 0) {
          this.changeParentOrg(this.state.user.parentOrganizationId);
        }
        this.changeParentOrg(res.data.parentOrganizationId);
      })
      .catch((error) => {
        this.setState({ loading: false });
        errorToast(error.response.data);
      });
  };
  GetDataList = () => {
    const { search, page } = this.state;
    ManualService.StateSelectList().then((res) => {
      this.setState({ StateList: res.data });
    });
    OrganizationService.GetAsSelectList().then((res) => {
      this.setState({ ParentList: res.data });
    });
    RoleService.GetAsSelectList().then((res) => {
      this.setState({ RoleList: res.data });
    });
  };
  GetDataEmployee() {
    const { page, employee, search } = this.state;
    EmployeeService.GetAsSelectList({
      isOnlyRegistered: true,
      sortBy: page.sortBy,
      orderType: page.orderType,
      page: page.page,
      pageSize: page.pageSize,
      search: search,
      // isHr: false,
    }).then((res) => {
      this.setState({ employee: res.data.rows });
      this.setState({ total: res.data.total });
    });
  }
  toggleModal = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  handleFilter = (e) => {
    let value = e.target.value;
    let data = this.state.employee;
    let filteredData = this.state.filteredData;
    this.setState({ value });

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
  };
  handleRowClicked = (row) => {
    const updatedData = this.state.employee.map((item) => {
      if (row.value == item.value) {
        this.setState({ checkEmployId: row.value });
        return { ...item, toggleSelected: true };
      }
      return { ...item, toggleSelected: false };
    });

    this.setState({ employee: updatedData });
  };
  conditionalRowStyles = [
    {
      when: (row) => row.toggleSelected,
      style: {
        backgroundColor: "green",
        userSelect: "none",
      },
    },
  ];
  AddEmployeeInitial = (id) => {
    var employeeInitial = this.state.employeeInitial;
    employeeInitial = this.state.employee.filter(
      (item) => item.value === id
    )[0];
    this.setState({ employeeInitial });

    this.setState((prevState) => ({
      user: {
        ...prevState.user,
        employeeId: id,
        organizationId: employeeInitial?.organizatonId,
        parentOrganizationId: employeeInitial?.parentOrganizatonId,
        person: {
          ...prevState.user.person,
          nameLatin: employeeInitial?.text,
        },
        parentOrganization: employeeInitial?.parentOrganizaton,
        organization: employeeInitial?.organization,
      },
    }));
  };
  handleChangeRole(event, field, data) {
    var user = this.state.user;

    user[field] = !!event.target ? event.target.value : data.value;
    if (field == "parentOrganizationId") {
      this.changeParentOrg(data.value);
      user.parentOrganization = this.state.ParentList.filter(
        (item) => item.value == data.value
      )[0].text;
    }
    if (field == "organizationId") {
      user.organization = this.state.OrganizationList.filter(
        (item) => item.value == data.value
      )[0].text;
    }
    if (field == "stateId") {
      user.state = this.state.StateList.filter(
        (item) => item.value == data.value
      )[0].text;
    }
    this.setState({ user: user });
    this.validation(() => {});
  }

  handleChange(event, field, data) {
    var user = this.state.user;
    if (!!event) {
      user[field] = !!event.target ? event.target.value : data.value;
      if (field == "parentOrganizationId") {
        this.changeParentOrg(data.value);
        user.parentOrganization = this.state.ParentList.filter(
          (item) => item.value == data.value
        )[0].text;
      }
      if (field == "organizationId") {
        user.organization = this.state.OrganizationList.filter(
          (item) => item.value == data.value
        )[0].text;
      }
      if (field == "stateId") {
        user.state = this.state.StateList.filter(
          (item) => item.value == data.value
        )[0].text;
      }
      this.setState({ user: user });
    } else {
      if (field == "stateId") {
        user.state = "";
        user.stateId = 0;
      }
      this.setState({ user: user });
    }
    this.validation(() => {});
  }

  changeParentOrg = (id) => {
    OrganizationService.GetAsSelectList(id, false, false).then((res) => {
      this.setState({ OrganizationList: res.data });
    });
  };
  SaveData = () => {
    this.validation(() => {
      if (
        Object.values(this.state.errors).filter((item) => item == true)
          .length == 0
      ) {
        this.setState({ SaveLoading: true });
        const arr = [
          {
            data: this.state.user.roles,
            type: "array",
            message: "RoleNotSelect",
          },
          // {
          //   data: this.state.user.email,
          //   type: "string",
          //   message: "EmailNotSelect",
          // },
        ];
        if (!check(arr, this.props.intl)) {
          return false;
        }
        UserService.Update(this.state.user)
          .then((res) => {
            this.setState({ SaveLoading: false });
            successToast(t2("SuccessSave", this.props.intl));

            setTimeout(() => {
              this.props.history.push("/management/user");
            }, 500);
          })
          .catch((error) => {
            errorToast(error.response.data);
            this.setState({ SaveLoading: false });
          });
      }
    });
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
      RoleList,
      user,
      value,
      columns,
      filteredData,
      employee,
      page,
      total,
      pageSelectList,
      StateList,
      errors,
    } = this.state;
    const { history, intl } = this.props;
    //template
    return (
      <Overlay show={loading}>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggleModal}
          className="modal-xl"
        >
          <ModalHeader toggle={this.toggleModal}> {t1("Employee")}</ModalHeader>
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
              <Col sm={12} md={4} lg={4}></Col>
            </Row>
            {/* <DataTable
              data={value.length ? filteredData : employee}
              columns={columns}
              noHeader
              pagination
              onRowClicked={this.handleRowClicked}
              conditionalRowStyles={this.conditionalRowStyles}
              subHeader
              subHeaderComponent={
                <CustomHeader value={value} handleFilter={this.handleFilter} />
              }
            /> */}

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
                            <Input
                              type="checkbox"
                              defaultChecked={item.toggleSelected}
                              onClick={() => {
                                this.handleRowClicked(item);
                              }}
                            />
                          </FormGroup>
                        </th>
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
              }}
            >
              {t1("Add")}
            </Button>{" "}
          </ModalFooter>
        </Modal>
        <Card className="p-2">
          <Row>
            <Col className="text-center mb-1">
              <h1 className="pageTextView"> {t1("User")} </h1>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("Username")} </h5>
                <Input
                  type="text"
                  value={user.userName || ""}
                  onChange={(e) => this.handleChange(e, "userName")}
                  id="userName"
                  placeholder={t2("Username", intl)}
                  disabled={user.id === 0 ? false : true}
                  invalid={errors.userName}
                />
                <FormFeedback>
                  {t2("userNameValidation", this.props.intl)}
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              {/* <FormGroup>
                <h5 className="text-bold-600">{t1("Employee")}</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{
                    text:
                      (user.person && user.person.nameLatin) ||
                      t2("Choose", intl),
                  }}
                  name="color"
                  options={PersonList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => this.handleChange(e, "personId", e)}
                />
              </FormGroup> */}
              <FormGroup>
                <h5 className="text-bold-600"> {t1("Employee")} </h5>
                <InputGroup>
                  <Input
                    type="text"
                    value={(user.person && user.person.nameLatin) || ""}
                    // onChange={(e) => this.handleChange(e, "userName")}
                    id="employeeName"
                    placeholder={t2("Employee", intl)}
                    disabled
                  />
                  <InputGroupAddon addonType="append">
                    <Button
                      color="primary"
                      // disabled={!request.contractor.inn}
                      onClick={() => {
                        this.toggleModal();
                        this.GetDataEmployee();
                      }}
                      size="sm"
                      disabled={user.id === 0 ? false : true}
                    >
                      <Icon.Search size={14} />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("Email")} </h5>
                <Input
                  type="text"
                  value={user.email || ""}
                  onChange={(e) => this.handleChange(e, "email")}
                  id="email"
                  placeholder={t2("Email", intl)}
                  autoComplete="new-password"
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={12} lg={12}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("parent")}</h5>
                {/* <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{
                    text: user.parentOrganization || t2("Choose", intl),
                  }}
                  value={{
                    text: user.parentOrganization || t2("Choose", intl),
                  }}
                  name="color"
                  options={ParentList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) =>
                    this.handleChange(e, "parentOrganizationId", e)
                  }
                /> */}
                <Input
                  type="text"
                  value={user.parentOrganization}
                  // onChange={(e) => this.handleChange(e, "password")}
                  id="parentOrganizaton"
                  placeholder={t2("Choose", intl)}
                  disabled
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={12} lg={12}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("Organization")}</h5>
                {/* <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{
                    text: user.organization || t2("Choose", intl),
                  }}
                  value={{
                    text: user.organization || t2("Choose", intl),
                  }}
                  name="color"
                  options={OrganizationList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => this.handleChange(e, "organizationId", e)}
                /> */}
                <Input
                  type="text"
                  value={user.organization}
                  // onChange={(e) => this.handleChange(e, "password")}
                  id="organization"
                  placeholder={t2("Choose", intl)}
                  disabled
                />
              </FormGroup>
            </Col>

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("Password")} </h5>
                <Input
                  type="password"
                  value={user.password || ""}
                  onChange={(e) => this.handleChange(e, "password")}
                  id="password"
                  placeholder={t2("Password", intl)}
                  invalid={errors.password}
                  autoComplete="new-password"
                />
                <FormFeedback>
                  {t2("passwordValidation", this.props.intl)}
                </FormFeedback>
              </FormGroup>
            </Col>
            {/* <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("PasswordConfirm")} </h5>
                <Input
                  type="password"
                  value={user.password || ""}
                  onChange={(e) => this.handleChange(e, "password")}
                  id="password"
                  placeholder={t2("Password", intl)}
                  invalid={errors.password}
                />
                <FormFeedback>
                  {t2("passwordValidation", this.props.intl)}
                </FormFeedback>
              </FormGroup>
            </Col> */}

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("PhoneNumber")} </h5>
                {/* <Input
                  type="text"
                  value={user.phoneNumber || ""}
                  onChange={(e) => this.handleChange(e, "phoneNumber")}
                  id="phoneNumber"
                  placeholder={t2("PhoneNumber", intl)}
                /> */}
                <InputMask
                  className="form-control"
                  mask="(\9\98)99-999-99-99"
                  placeholder={t2("PhoneNumber", intl)}
                  value={user.phoneNumber || ""}
                  onChange={(e) => this.handleChange(e, "phoneNumber")}
                  style={{
                    borderColor: errors.phoneNumber ? "red" : "inherit",
                  }}
                />
                {errors.phoneNumber ? (
                  <div>
                    <span className="text-danger">
                      {t2("phoneNumberValidation", this.props.intl)}
                    </span>
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("Role")}</h5>
                <Select
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 200 }),
                  }}
                  className={errors.roles ? "invalid" : ""}
                  classNamePrefix="select"
                  isMulti
                  placeholder={t2("Role", intl)}
                  defaultValue={
                    !!user.roles && user.roles.length > 0
                      ? RoleList.filter((item) =>
                          user.roles.includes(item.value)
                        )
                      : []
                  }
                  name="color"
                  options={RoleList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => {
                    this.handleChangeRole(false, "roles", {
                      value: e?.length > 0 ? e.map((item) => item.value) : [],
                    });
                  }}
                />
                {errors.roles ? (
                  <div>
                    <span className="text-danger">
                      {t2("rolesValidation", this.props.intl)}
                    </span>
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            {this.props.match.params.id == 0 ? (
              ""
            ) : (
              <Col sm={12} md={6} lg={4}>
                <FormGroup>
                  <h5 className="text-bold-600">{t1("state")}</h5>
                  <Select
                    className={errors.stateId ? "invalid" : ""}
                    classNamePrefix="select"
                    isClearable
                    defaultValue={{
                      text: user.state || t2("Choose", intl),
                    }}
                    value={{
                      text: user.state || t2("Choose", intl),
                    }}
                    name="color"
                    options={StateList}
                    label="text"
                    getOptionLabel={(item) => item.text}
                    onChange={(e) => this.handleChange(e, "stateId", e)}
                  />
                  {errors.stateId ? (
                    <div>
                      <span className="text-danger">
                        {t2("stateIdValidation", this.props.intl)}
                      </span>
                    </div>
                  ) : null}
                </FormGroup>
              </Col>
            )}
          </Row>
          <Row>
            <Col className="text-right">
              <Button
                className="mr-1"
                color="danger"
                onClick={() => history.push("/management/user")}
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
export default injectIntl(EditUser);
