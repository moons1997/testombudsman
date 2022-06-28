import React from "react";
import {
  Card,
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  Spinner,
  ListGroup,
  ListGroupItem,
  InputGroup,
  CustomInput,
  InputGroupAddon,
  FormFeedback,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import EmployeeService from "../../../services/info/employee.service";
import Overlay from "../../../components/Webase/components/Overlay";
import ManualService from "../../../services/other/manual.service";
import Select from "react-select";
import {
  Notification,
  Translate,
  Permission,
} from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";

import * as Icon from "react-feather";
import moment from "moment";
import PositionService from "../../../services/info/position.service";
import OrganizationService from "../../../services/management/organization.service";

import DatePicker, { registerLocale } from "react-datepicker";
import MaskedTextInput from "react-text-mask";
import AddPosition from "../position/edit";
import uz from "date-fns/locale/uz";
import uzCyrl from "date-fns/locale/uz-Cyrl";
import ru from "date-fns/locale/ru";
import InputMask from "react-input-mask";
import RoleService from "../../../services/management/role.service";
import UserService from "../../../services/management/user.service";
import style from "./style.css";
registerLocale("uz", uz);
registerLocale("uzCyrl", uzCyrl);
registerLocale("ru", ru);
const { t1, t2 } = Translate;
const { errorToast, successToast, customErrorToast } = Notification;

const ExampleCustomInput = React.forwardRef(({ value, onFocus }, ref) => (
  <Input
    placeholder={"00.00.0000"}
    value={moment(value).format("DD.MM.YYYY")}
    onFocus={onFocus}
    ref={ref}
  />
));
const { can } = Permission;

class EditEmployee extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.state = {
      employee: {
        user: {
          userName: "",
          password: "",
          roles: [],
        },
      },
      loading: false,
      SaveLoading: false,
      StateList: [],
      RoleList: [],
      modal: false,
      ChangeLoading: false,
      filter: {
        docseries: "",
        docnumber: "",
        dateofbirth: "",
        documenttype: "Passport, ID-karta",
        documenttypeId: 1,
      },
      errors: {
        docseries: null,
        docnumber: null,
        dateofbirth: null,
        passportSeria: null,
        passportNumber: null,
        birthDate: null,
        positionId: null,
        parentOrganizationId: null,
        organizationId: null,
        stateId: null,
        phoneNumber: null,
      },
      filterloading: false,
      PositionList: [],
      ParentList: [],
      isUser: false,
      timer: null,
      isAlreadyTakenUsername: false,
    };
  }
  validation = (callback) => {
    var data = this.state.employee;
    var errors = {
      passportSeria: !!data.person.passportSeria ? false : true,
      passportNumber: !!data.person.passportNumber ? false : true,
      birthDate: !!data.person.birthDate ? false : true,
      positionId: !!data.positionId ? false : true,
      parentOrganizationId: !!data.parentOrganizationId ? false : true,
      // organizationId: !!data.organizationId ? false : true,
      // stateId: !!data.stateId ? false : true,
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
    EmployeeService.Get(this.props.ID ? 0 : this.props.match.params.id)
      .then((res) => {
        this.setState(
          {
            employee: {
              ...res.data,
              isHr: this.props.ID
                ? false
                : !!this.props.location.state && this.props.location.state.isHr
                ? this.props.location.state.isHr
                : res.data.isHr,
            },
            loading: false,
            isUser: res.data.user.id !== 0 ? true : false,
          },
          () => {
            this.setState((prevState) => ({
              employee: {
                ...prevState.employee,
                organizationId: this.props.ID
                  ? this.props.organization.organizationId
                  : res.data.organizationId,
                organization: this.props.ID
                  ? this.props.organization.organization
                  : res.data.organization,
              },
            }));
          }
        );
        if (this.props.ID ? 0 : this.props.match.params.id != 0) {
          this.changeParentOrg(this.state.employee.parentOrganizationId);
        }
        this.changeParentOrg(res.data.parentOrganizationId);
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
    this.GetPositionList();

    OrganizationService.GetAsSelectList().then((res) => {
      this.setState({ ParentList: res.data });
    });
    RoleService.GetAsSelectList().then((res) => {
      this.setState({ RoleList: res.data });
    });
  };

  GetPositionList() {
    PositionService.GetAsSelectList().then((res) => {
      this.setState({ PositionList: res.data });
    });
    // alert(this.state.isUser);
  }

  handleChange(event, field, data) {
    var employee = this.state.employee;
    if (!!event) {
      employee[field] = !!event.target ? event.target.value : data.value;

      if (field == "parentOrganizationId") {
        this.changeParentOrg(data.value);
        employee.parentOrganization = this.state.ParentList.filter(
          (item) => item.value == data.value
        )[0].text;
      }
      if (field == "organizationId") {
        employee.organization = this.state.OrganizationList.filter(
          (item) => item.value == data.value
        )[0].text;
      }
      if (field == "positionId") {
        employee.position = this.state.PositionList.filter(
          (item) => item.value == data.value
        )[0].text;
      }
      if (field == "stateId") {
        employee.state = this.state.StateList.filter(
          (item) => item.value == data.value
        )[0].text;
      }
      this.setState({ employee: employee });
    } else {
      if (field == "positionId") {
        employee.position = "";
        employee.positionId = 0;
      }
      if (field == "organizationId") {
        employee.organization = "";
        employee.organizationId = null;
      }
      if (field == "parentOrganizationId") {
        employee.parentOrganization = "";
        employee.parentOrganizationId = null;
        employee.organization = "";
        employee.organizationId = null;
      }
      if (field == "stateId") {
        employee.state = "";
        employee.stateId = 0;
      }
      this.setState({ employee: employee });
    }
    this.validation(() => {});
  }
  changeParentOrg = (id) => {
    // this.state.employee.organization = "";
    // this.state.employee.organizationId = 0;
    OrganizationService.GetAsSelectList(id, false, false).then((res) => {
      this.setState({ OrganizationList: res.data });
    });
  };
  toggleModalEmp = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  SaveData = () => {
    this.validation(() => {
      if (
        Object.values(this.state.errors).filter((item) => item == true)
          .length == 0
      ) {
        this.setState({ SaveLoading: true });
        if (this.state.isUser) {
          EmployeeService.Create(this.state.employee)
            .then((res) => {
              this.setState({ SaveLoading: false });
              successToast(t2("SuccessSave", this.props.intl));

              setTimeout(() => {
                if (this.props.ID) {
                  this.props.Refresh();
                  this.props.CloseModal();
                } else {
                  !!this.state.employee.isHr
                    ? this.props.history.push("/info/kadr")
                    : this.props.history.push("/info/employee");
                }
              }, 500);
            })
            .catch((error) => {
              errorToast(error.response.data);
              this.setState({ SaveLoading: false });
            });
        } else {
          EmployeeService.Update(this.state.employee)
            .then((res) => {
              this.setState({ SaveLoading: false });
              successToast(t2("SuccessSave", this.props.intl));

              setTimeout(() => {
                if (this.props.ID) {
                  // this.props.history.push("/document/editattestation/0");
                  this.props.Refresh();
                  this.props.CloseModal();
                } else {
                  !!this.state.employee.isHr
                    ? this.props.history.push("/info/kadr")
                    : this.props.history.push("/info/employee");
                }
              }, 500);
            })
            .catch((error) => {
              errorToast(error.response.data);
              this.setState({ SaveLoading: false });
            });
        }
      }
    });
  };
  filterChange = (event, field, data) => {
    var filter = this.state.filter;
    if (!!event) {
      // filter[field] = !!event?.target ? event.target.value : data.value;
      if (field === "docseries") {
        filter[field] = event.target.value.toString().slice(0, 2).toUpperCase();
      } else if (field === "docnumber") {
        filter[field] = event.target.value.toString().slice(0, 7);
      } else {
        filter[field] = !!event?.target ? event.target.value : data.value;
      }
      this.setState({ data: filter });
    } else {
      if (field === "dateofbirth") {
        filter[field] = "";
        this.setState({ data: filter });
      }
    }
  };
  personChange = (data, field) => {
    var person = this.state.employee.person;
    var employee = this.state.employee;
    person[field] = data;
    employee.person = person;
    this.setState({ employee: employee });
  };
  CheckUser() {
    UserService.CheckUserName({
      userName: this.state.employee.user.userName,
      id: this.state.employee.user.id,
    }).then((res) => {
      this.setState({ isAlreadyTakenUsername: res.data.isBusy });
    });
  }
  handleChangeUser(event, field, data) {
    var user = this.state.employee.user;
    var employee = this.state.employee;
    user[field] = !!event.target ? event.target.value : data.value;
    employee.user = user;

    if (field == "userName") {
      var timer = this.state.timer;
      clearInterval(this.state.timer);
      timer = setTimeout(() => {
        this.CheckUser();
      }, 2 * 1000);
      this.setState({ timer: timer });
    }
    this.setState({ employee: employee });
  }
  // PasswordGeneration = () => {
  //   var pass = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  //   var result = "";

  //   for (var i = 0, n = pass.length; i < length; ++i) {
  //       result += pass.charAt(Math.floor(Math.random() * n));
  //   }
  // }

  removSimbol(text) {
    let temp = "";
    for (let i = 0; i < text.length; i++) {
      if (text[i] != "‘") {
        temp += text[i];
      }
    }
    return temp;
  }
  handleChangeUserCheck(event) {
    var temp = "";
    var isUser = this.state.isUser;
    var employee = this.state.employee;
    this.setState({ isUser: !isUser }, () => {
      if (
        this.state.isUser === true &&
        employee.person.nameLatin != "" &&
        employee.user.id === 0
      ) {
        employee.user.userName = !!employee.person.nameLatin
          ? employee.person.nameLatin?.toLowerCase()[0] +
            "." +
            this.removSimbol(employee.person.surnameLatin).toLowerCase()
          : "";
      } else {
        if (employee.user.id === 0) {
          employee.user.userName = "";
          employee.user.password = "";
        } else {
        }
      }
      this.setState({ employee: employee });
    });
  }
  organizationChange() {
    this.state.employee.organization = "";
    this.state.employee.organizationId = null;
  }
  validationSearch = (callback) => {
    var data = this.state.filter;
    var errors = {
      docnumber: !!data.docnumber ? false : true,
      docseries: !!data.docseries ? false : true,
      dateofbirth: !!data.dateofbirth ? false : true,
    };
    this.setState({ errors: errors }, () => callback());
  };
  ChangePersonMakeHr = () => {
    this.setState({ ChangeLoading: true });
    EmployeeService.MakeHr(this.state.employee.id)
      .then((res) => {
        this.props.history.push("/info/kadr");
        successToast(t2("SuccessSave", this.props.intl));
        this.setState({ ChangeLoading: false });
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ ChangeLoading: false });
      });
  };
  ChangePersonMakeInspector = () => {
    this.setState({ ChangeLoading: true });
    EmployeeService.MakeInspector(this.state.employee.id)
      .then((res) => {
        this.props.history.push("/info/employee");
        successToast(t2("SuccessSave", this.props.intl));
        this.setState({ ChangeLoading: false });
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ ChangeLoading: false });
      });
  };
  GetPersonData = () => {
    const { docseries, docnumber, dateofbirth } = this.state.filter;
    this.validationSearch(() => {
      if (
        Object.values(this.state.errors).filter((item) => item == true)
          .length == 0
      ) {
        this.setState({ filterloading: true });
        EmployeeService.GetByPassportData(
          docseries,
          docnumber,
          dateofbirth
        ).then((res) => {
          if (!!res.data.person) {
            this.setState(
              {
                employee: {
                  ...res.data,
                  isHr: this.props.ID
                    ? false
                    : !!this.props.location.state &&
                      this.props.location.state.isHr,
                },
                isUser: res.data.user.id !== 0 ? true : false,
              },
              () => {
                this.setState((prevState) => ({
                  employee: {
                    ...prevState.employee,
                    organizationId: this.props.ID
                      ? this.props.organization.organizationId
                      : res.data.organizationId,
                    organization: this.props.ID
                      ? this.props.organization.organization
                      : res.data.organization,
                  },
                }));
              }
            );

            // this.handleChangeUserCheck();
          } else {
            customErrorToast(t2("NoItems", this.props.intl));
          }

          this.setState({ filterloading: false });
        });
      }
    });
  };

  render() {
    const {
      loading,
      SaveLoading,
      employee,
      filter,
      ChangeLoading,
      RoleList,
      filterloading,
      PositionList,
      StateList,
      ParentList,
      isUser,
      OrganizationList,
      errors,
      isAlreadyTakenUsername,
    } = this.state;
    const { history, intl } = this.props;
    //template

    return (
      <Overlay show={loading}>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggleModalEmp}
          className="modal-xl"
        >
          <ModalHeader toggle={this.toggleModalEmp}></ModalHeader>
          <ModalBody>
            <AddPosition
              ID={true}
              CloseModal={() => {
                this.setState({
                  modal: false,
                });
                this.GetPositionList();
              }}
              Refresh={this.GetPositionList}
            />
          </ModalBody>
        </Modal>
        <Card className="p-2">
          <Row>
            <Col className="text-center">
              {this.props.ID ? (
                <h1 className="pageTextView"> {t1("Employee")} </h1>
              ) : employee.isHr ? (
                <h1 className="pageTextView"> {t1("Kadr")} </h1>
              ) : (
                <h1 className="pageTextView"> {t1("Employee")} </h1>
              )}
            </Col>
          </Row>
          <Row className="mt-1">
            <Col sm={12} md={6} lg={1}>
              <InputGroup>
                <InputMask
                  className="form-control"
                  mask="aa"
                  placeholder={t2("docseries", intl)}
                  value={filter.docseries || ""}
                  style={{
                    borderColor: errors.docseries ? "red" : "inherit",
                  }}
                  onChange={(e) => {
                    this.filterChange(e, "docseries", {
                      value: e.target.value
                        .toString()
                        .slice(0, 2)
                        .toUpperCase(),
                    });
                  }}
                />
              </InputGroup>
              {errors.docseries ? (
                <div>
                  <span className="text-danger">
                    {t2("passportSeriaValidation", this.props.intl)}
                  </span>
                </div>
              ) : null}
            </Col>
            <Col sm={12} md={6} lg={2}>
              <InputMask
                className="form-control"
                mask="9999999"
                placeholder={t2("passportNumber", intl)}
                value={filter.docnumber || ""}
                onChange={(e) => {
                  this.filterChange(e, "docnumber", {
                    value: e.target.value.slice(0, 7),
                  });
                }}
                style={{
                  borderColor: errors.docnumber ? "red" : "inherit",
                }}
              />
              {errors.docnumber ? (
                <div>
                  <span className="text-danger">
                    {t2("passportNumberValidation", this.props.intl)}
                  </span>
                </div>
              ) : null}
            </Col>
            <Col sm={12} md={6} lg={2}>
              <InputGroup size="md" className="datePicker">
                <DatePicker
                  dateFormat="dd.MM.yyyy"
                  selected={
                    filter.dateofbirth
                      ? moment(filter.dateofbirth, "DD.MM.YYYY").toDate()
                      : ""
                  }
                  onChange={(date) => {
                    this.filterChange(date, "dateofbirth", {
                      value: moment(new Date(date)).format("DD.MM.YYYY"),
                    });
                  }}
                  isClearable={!!filter.dateofbirth ? true : false}
                  locale={
                    intl.locale == "ru"
                      ? "ru"
                      : intl.locale == "cl"
                      ? "uzCyrl"
                      : "uz"
                  }
                  placeholderText={t2("birthDate", intl)}
                  customInput={
                    <MaskedTextInput
                      type="text"
                      style={{
                        height: "38px",
                        borderRadius: "5px",
                        width: "100%",
                        padding: "2px 10px 2px 8px",
                        outlineColor: "#1890ff",
                        borderColor: errors.dateofbirth
                          ? "red"
                          : "hsl(0,0%,70%)",
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
              {errors.dateofbirth ? (
                <div>
                  <span className="text-danger">
                    {t2("dateofbirthValidation", this.props.intl)}
                  </span>
                </div>
              ) : null}
            </Col>
            <Col sm={12} md={6} lg={2}>
              <Button
                block
                color="primary"
                style={{ fontSize: "16px" }}
                onClick={() => this.GetPersonData()}
              >
                {" "}
                {filterloading ? <Spinner color="white" size="sm" /> : ""}{" "}
                {t1("Search")}{" "}
              </Button>
            </Col>
            <Col sm={12} md={6} lg={2} className="text-right">
              {this.props.ID ? (
                ""
              ) : (
                <>
                  {this.props.match.params.id != 0 &&
                  employee.isHr == false &&
                  can("EmployeeMakeHr") ? (
                    <Button
                      block
                      color="success"
                      style={{ fontSize: "16px" }}
                      onClick={() => this.ChangePersonMakeHr()}
                    >
                      {" "}
                      {ChangeLoading ? (
                        <Spinner color="white" size="sm" />
                      ) : (
                        ""
                      )}{" "}
                      {t1("MakeHr")} <Icon.ArrowRight size={18} />
                    </Button>
                  ) : (
                    ""
                  )}
                </>
              )}
              {this.props.ID ? (
                ""
              ) : (
                <>
                  {this.props.match.params.id != 0 &&
                  employee.isHr == true &&
                  can("EmployeeMakeInspector") ? (
                    <Button
                      block
                      color="success"
                      style={{ fontSize: "16px" }}
                      onClick={() => this.ChangePersonMakeInspector()}
                    >
                      {" "}
                      {ChangeLoading ? (
                        <Spinner color="white" size="sm" />
                      ) : (
                        ""
                      )}{" "}
                      {t1("MakeInspector")} <Icon.ArrowRight size={18} />
                    </Button>
                  ) : (
                    ""
                  )}
                </>
              )}
            </Col>
          </Row>
        </Card>
        {filter.documenttypeId == 2 ? (
          <Card className="p-2">
            <Row>
              <Col sm={12} md={6} lg={3} className="mb-0">
                <FormGroup>
                  <h5> {t1("surnameLatin")} </h5>
                  <Input
                    placeholder={t2("surnameLatin", intl)}
                    value={employee.person.surnameLatin}
                    onChange={(e) => {
                      this.personChange(e.target.value, "surnameLatin");
                    }}
                  />
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={3} className="mb-0">
                <FormGroup>
                  <h5> {t1("nameLatin")} </h5>
                  <Input
                    placeholder={t2("nameLatin", intl)}
                    value={employee.person.nameLatin}
                    onChange={(e) => {
                      this.personChange(e.target.value, "nameLatin");
                    }}
                  />
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={3} className="mb-0">
                <FormGroup>
                  <h5> {t1("patronymLatin")} </h5>
                  <Input
                    placeholder={t2("patronymLatin", intl)}
                    value={employee.person.patronymLatin}
                    onChange={(e) => {
                      this.personChange(e.target.value, "patronymLatin");
                    }}
                  />
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={3} className="mb-0">
                <FormGroup>
                  <h5> {t1("birthDate")} </h5>
                  <DatePicker
                    closeOnScroll={true}
                    selected={new Date()}
                    onChange={(date) => {
                      this.personChange(date, "birthDate");
                    }}
                    customInput={<ExampleCustomInput />}
                  />
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={3} className="mb-0">
                <FormGroup>
                  <h5> {t1("gender")} </h5>
                  <Input
                    placeholder={t2("gender", intl)}
                    value={filter.gender}
                    onChange={(e) => {
                      this.filterChange(e.target.value, "genderId");
                    }}
                  />
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={3} className="mb-0">
                <FormGroup>
                  <h5> {t1("nationality")} </h5>
                  <Input
                    placeholder={t2("nationality", intl)}
                    value={filter.nationality}
                    onChange={(e) => {
                      this.filterChange(e.target.value, "nationalityId");
                    }}
                  />
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={3} className="mb-0">
                <FormGroup>
                  <h5> {t1("citizenship")} </h5>
                  <Input
                    placeholder={t2("citizenship", intl)}
                    value={filter.citizenship}
                    onChange={(e) => {
                      this.filterChange(e.target.value, "citizenshipId");
                    }}
                  />
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={3} className="mb-0">
                <FormGroup>
                  <h5> {t1("inn")} </h5>
                  <Input
                    placeholder={t2("inn", intl)}
                    value={filter.inn}
                    onChange={(e) => {
                      this.filterChange(e.target.value, "inn");
                    }}
                  />
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={3} className="mb-0">
                <FormGroup>
                  <h5> {t1("pinfl")} </h5>
                  <Input
                    placeholder={t2("pinfl", intl)}
                    value={filter.pinfl}
                    onChange={(e) => {
                      this.filterChange(e.target.value, "pinfl");
                    }}
                  />
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={3} className="mb-0">
                <FormGroup>
                  <h5> {t1("birthCountry")} </h5>
                  <Input
                    placeholder={t2("birthCountry", intl)}
                    value={filter.birthCountry}
                    onChange={(e) => {
                      this.filterChange(e.target.value, "birthCountry");
                    }}
                  />
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={3} className="mb-0">
                <FormGroup>
                  <h5> {t1("livingRegion")} </h5>
                  <Input
                    placeholder={t2("livingRegion", intl)}
                    value={filter.livingRegion}
                    onChange={(e) => {
                      this.filterChange(e.target.value, "livingRegion");
                    }}
                  />
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={3} className="mb-0">
                <FormGroup>
                  <h5> {t1("livingDistrict")} </h5>
                  <Input
                    placeholder={t2("livingDistrict", intl)}
                    value={filter.livingDistrict}
                    onChange={(e) => {
                      this.filterChange(e.target.value, "livingDistrict");
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Card>
        ) : !!employee.person && !!employee.person.nameLatin ? (
          <Card className="p-2">
            <h2 className="text-success">
              {" "}
              <Icon.CheckCircle />{" "}
              {employee.person.surnameLatin +
                " " +
                employee.person.nameLatin +
                " " +
                employee.person.patronymLatin}{" "}
            </h2>
            <Row>
              {}
              <Col sm={12} md={6}>
                <ListGroup>
                  {/* <ListGroupItem className='d-flex justify-content-between'> <span> <b> {t1('birthCountry')} </b> </span> <span> { employee.person.birthCountry } </span> </ListGroupItem> */}
                  <ListGroupItem className="d-flex justify-content-between">
                    {" "}
                    <span>
                      {" "}
                      <b> {t1("birthDate")} </b>{" "}
                    </span>{" "}
                    <span> {employee.person.birthDate} </span>{" "}
                  </ListGroupItem>
                  <ListGroupItem className="d-flex justify-content-between">
                    {" "}
                    <span>
                      {" "}
                      <b> {t1("Citizenship")} </b>{" "}
                    </span>{" "}
                    <span> {employee.person.citizenship} </span>{" "}
                  </ListGroupItem>
                  <ListGroupItem className="d-flex justify-content-between">
                    {" "}
                    <span>
                      {" "}
                      <b> {t1("gender")} </b>{" "}
                    </span>{" "}
                    <span> {employee.person.gender} </span>{" "}
                  </ListGroupItem>
                  <ListGroupItem className="d-flex justify-content-between">
                    {" "}
                    <span>
                      {" "}
                      <b> {t1("Region")} </b>{" "}
                    </span>{" "}
                    <span> {employee.person.livingRegion} </span>{" "}
                  </ListGroupItem>
                  <ListGroupItem className="d-flex justify-content-between">
                    {" "}
                    <span>
                      {" "}
                      <b> {t1("District")} </b>{" "}
                    </span>{" "}
                    <span> {employee.person.livingDistrict} </span>{" "}
                  </ListGroupItem>
                </ListGroup>
              </Col>
              <Col sm={12} md={6}>
                <ListGroup>
                  <ListGroupItem className="d-flex justify-content-between">
                    {" "}
                    <span>
                      {" "}
                      <b> {t1("passportSeria")} </b>{" "}
                    </span>{" "}
                    <span> {employee.person.passportSeria} </span>{" "}
                  </ListGroupItem>
                  <ListGroupItem className="d-flex justify-content-between">
                    {" "}
                    <span>
                      {" "}
                      <b> {t1("passportNumber")} </b>{" "}
                    </span>{" "}
                    <span> {employee.person.passportNumber} </span>{" "}
                  </ListGroupItem>
                  <ListGroupItem className="d-flex justify-content-between">
                    {" "}
                    <span>
                      {" "}
                      <b> {t1("passportDate")} </b>{" "}
                    </span>{" "}
                    <span> {employee.person.passportDate} </span>{" "}
                  </ListGroupItem>
                  <ListGroupItem className="d-flex justify-content-between">
                    {" "}
                    <span>
                      {" "}
                      <b> {t1("passportExpiration")} </b>{" "}
                    </span>{" "}
                    <span> {employee.person.passportExpiration} </span>{" "}
                  </ListGroupItem>
                  <ListGroupItem className="d-flex justify-content-between">
                    {" "}
                    <span>
                      {" "}
                      <b> {t1("pinfl")} </b>{" "}
                    </span>{" "}
                    <span> {employee.person.pinfl} </span>{" "}
                  </ListGroupItem>
                </ListGroup>
              </Col>
            </Row>
          </Card>
        ) : (
          ""
        )}
        <Card className="p-2">
          <Row>
            <Col sm={12} md={12} lg={12}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("parent")}</h5>
                <Select
                  className={errors.parentOrganizationId ? "invalid" : ""}
                  classNamePrefix="select"
                  defaultValue={{
                    text: employee.parentOrganization || t2("Choose", intl),
                  }}
                  value={{
                    text: employee.parentOrganization || t2("Choose", intl),
                  }}
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 500 }),
                  }}
                  isClearable
                  name="color"
                  options={ParentList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => {
                    this.handleChange(e, "parentOrganizationId", e);
                    this.organizationChange();
                  }}
                  isDisabled={
                    can("AllEmployeeCreate")
                      ? false
                      : // : can("EmployeeCreate")
                        // ? true
                        true
                    // this.props.match.params.id === 0
                    //   ? can("BranchesEmployeeCreate")
                    //     ? true
                    //     : can("EmployeeCreate")
                    //     ? false
                    //     : false
                    //   : can("BranchesEmployeeEdit")
                    //   ? true
                    //   : can("EmployeeEdit")
                    //   ? false
                    //   : false
                  }
                />
                {errors.parentOrganizationId ? (
                  <div>
                    <span className="text-danger">
                      {t2("parentOrganizationIdValidation", this.props.intl)}
                    </span>
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col sm={12} md={12} lg={12}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("Organization")}</h5>
                <Select
                  className={errors.organizationId ? "invalid" : ""}
                  classNamePrefix="select"
                  // defaultValue={
                  //   this.props.ID
                  //     ? { text: this.props.organization.organization }
                  //     : { text: employee.organization || t2("Choose", intl) }
                  // }
                  defaultValue={{
                    text: employee.organization || t2("Choose", intl),
                  }}
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 500 }),
                  }}
                  value={{
                    text: employee.organization || t2("Choose", intl),
                  }}
                  isClearable
                  name="color"
                  options={OrganizationList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => this.handleChange(e, "organizationId", e)}
                  isDisabled={
                    this.props.ID
                      ? true
                      : can("BranchesEmployeeCreate")
                      ? false
                      : can("EmployeeCreate")
                      ? true
                      : false
                  }
                  // isDisabled={
                  //   this.props.match.params.id === 0
                  //     ? can("AllEmployeeCreate") ||
                  //       can("BranchesEmployeeCreate")
                  //       ? true
                  //       : can("EmployeeCreate")
                  //       ? false
                  //       : false
                  //     : can("AllEmployeeEdit") || can("BranchesEmployeeEdit")
                  //     ? true
                  //     : can("EmployeeEdit")
                  //     ? false
                  //     : false
                  // }
                />
                {errors.organizationId ? (
                  <div>
                    <span className="text-danger">
                      {t2("organizationIdValidation", this.props.intl)}
                    </span>
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <h5 className="text-bold-600">{t1("Position")}</h5>
              <InputGroup size="md" className="selectPicker">
                <Select
                  className={errors.positionId ? "invalid" : ""}
                  classNamePrefix="select"
                  defaultValue={{
                    text: employee.position || t2("Choose", intl),
                  }}
                  value={{
                    text: employee.position || t2("Choose", intl),
                  }}
                  style={{ width: "100%" }}
                  isClearable
                  name="color"
                  options={PositionList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => this.handleChange(e, "positionId", e)}
                />
                <InputGroupAddon addonType="append">
                  <Button
                    color="primary"
                    size="sm"
                    onClick={this.toggleModalEmp}
                  >
                    <Icon.PlusCircle size={15} />
                  </Button>
                </InputGroupAddon>
              </InputGroup>

              {errors.positionId ? (
                <div>
                  <span className="text-danger">
                    {t2("positionIdValidation", this.props.intl)}
                  </span>
                </div>
              ) : null}
            </Col>
            {this.props.ID ? (
              ""
            ) : (
              <>
                {this.props.match.params.id == 0 ? (
                  ""
                ) : (
                  <Col sm={12} md={6} lg={4}>
                    <FormGroup>
                      <h5 className="text-bold-600">{t1("state")}</h5>
                      <Select
                        // className={errors.stateId ? "invalid" : ""}
                        classNamePrefix="select"
                        defaultValue={{
                          text: employee.state || t2("Choose", intl),
                        }}
                        value={{
                          text: employee.state || t2("Choose", intl),
                        }}
                        isClearable
                        name="color"
                        options={StateList}
                        label="text"
                        getOptionLabel={(item) => item.text}
                        onChange={(e) => this.handleChange(e, "stateId", e)}
                      />
                      {/* {errors.stateId ? (
                        <div>
                          <span className="text-danger">
                            {t2("stateIdValidation", this.props.intl)}
                          </span>
                        </div>
                      ) : null} */}
                    </FormGroup>
                  </Col>
                )}
              </>
            )}

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("PhoneNumber")}</h5>
                {/* <Input
                  placeholder={t2("PhoneNumber", intl)}
                  type="number"
                  value={employee.phoneNumber}
                  onChange={(e) => {
                    this.handleChange(e, "phoneNumber", e)
                  }}
                /> */}
                <InputMask
                  // onKeyDown={(e) => {
                  //   if (e.key === "Enter") {
                  //     this.SearchbyInn();
                  //   }
                  // }}
                  mask="(\9\98)99-999-99-99"
                  maskChar={null}
                  className="form-control"
                  style={{
                    borderColor: errors.phoneNumber ? "red" : "inherit",
                  }}
                  placeholder={t2("phoneNumber", intl)}
                  value={employee.phoneNumber || ""}
                  onChange={(e) => this.handleChange(e, "phoneNumber", e)}
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
            {this.props.ID ? (
              <Col sm={12} md={6} lg={4}>
                <FormGroup>
                  <h5 className="text-bold-600">{t1("AddUser")}</h5>
                  {/* <Input
                    className="ml-1"
                    type="checkbox"
                    placeholder={t2("AddUser", intl)}
                    value={isUser}
                    onChange={(e) => {
                      this.handleChangeUserCheck(e);
                    }}
                  /> */}
                  <input
                    type="checkbox"
                    onClick={(e) => {
                      this.handleChangeUserCheck(e);
                    }}
                    checked={isUser}
                  />
                </FormGroup>
              </Col>
            ) : this.state.employee.user.id != 0 ||
              this.state.employee.user.id == 0 ? (
              <Col sm={12} md={6} lg={4}>
                <FormGroup>
                  <h5 className="text-bold-600">{t1("AddUser")}</h5>
                  {/* <Input
                    className="ml-1"
                    type="checkbox"
                    value={isUser}
                    onChange={(e) => {
                      this.handleChangeUserCheck(e);
                    }}
                  /> */}

                  <input
                    type="checkbox"
                    onClick={(e) => {
                      this.handleChangeUserCheck(e);
                    }}
                    value={isUser}
                    checked={isUser}
                  />
                </FormGroup>
              </Col>
            ) : (
              ""
            )}
          </Row>
          <Row className="mt-3">
            {/* {isUser ?  <>
                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <h5 className="text-bold-600">{t1("Username")}</h5>
                    <Input
                      placeholder={t2("Username", intl)}
                      value={employee?.user?.userName}
                      onChange={(e) => {
                        this.handleChangeUser(e, "userName", e);
                      }}
                      invalid={isAlreadyTakenUsername}
                    />
                    <FormFeedback>
                      {t2("takenUsername", this.props.intl)}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <h5 className="text-bold-600">{t1("Password")}</h5>
                    <Input
                      placeholder={t2("Password", intl)}
                      value={employee?.user?.password}
                      onChange={(e) => {
                        this.handleChangeUser(e, "password", e);
                      }}
                    />
                  </FormGroup>
                </Col>
                {can("UserCreate") ||
                can("BranchesUserCreate") ||
                can("AllUserCreate") ? (
                  <Col className="mb-4 pb-4" sm={12} md={6} lg={4}>
                    <FormGroup>
                      <h5 className="text-bold-600">{t1("Role")}</h5>
                      <Select
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 200 }),
                        }}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        isMulti
                        placeholder={t2("Role", intl)}
                        defaultValue={
                          !!employee.user.roles &&
                          employee.user.roles.length > 0
                            ? RoleList.filter((item) =>
                                employee.user.roles.includes(item.value)
                              )
                            : []
                        }
                        name="color"
                        options={RoleList}
                        label="text"
                        getOptionLabel={(item) => item.text}
                        onChange={(e) => {
                          this.handleChangeUser(false, "roles", {
                            value: e.map((item) => item.value),
                          });
                        }}
                      />
                    </FormGroup>
                  </Col>
                ) : (
                  ""
                )}
              </>:""} */}
            {this.props.ID ? (
              isUser && (
                <>
                  <Col sm={12} md={6} lg={4}>
                    <FormGroup>
                      <h5 className="text-bold-600">{t1("Username")}</h5>
                      <Input
                        placeholder={t2("Username", intl)}
                        value={employee?.user?.userName}
                        onChange={(e) => {
                          this.handleChangeUser(e, "userName", e);
                        }}
                        invalid={isAlreadyTakenUsername}
                      />
                      <FormFeedback>
                        {t2("takenUsername", this.props.intl)}
                      </FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col sm={12} md={6} lg={4}>
                    <FormGroup>
                      <h5 className="text-bold-600">{t1("Password")}</h5>
                      <Input
                        placeholder={t2("Password", intl)}
                        value={employee?.user?.password}
                        onChange={(e) => {
                          this.handleChangeUser(e, "password", e);
                        }}
                      />
                    </FormGroup>
                  </Col>
                  {can("UserCreate") ||
                  can("BranchesUserCreate") ||
                  can("AllUserCreate") ? (
                    <Col className="mb-4 pb-4" sm={12} md={6} lg={4}>
                      <FormGroup>
                        <h5 className="text-bold-600">{t1("Role")}</h5>
                        <Select
                          styles={{
                            menu: (provided) => ({ ...provided, zIndex: 200 }),
                          }}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          isMulti
                          placeholder={t2("Role", intl)}
                          defaultValue={
                            !!employee.user.roles &&
                            employee.user.roles.length > 0
                              ? RoleList.filter((item) =>
                                  employee.user.roles.includes(item.value)
                                )
                              : []
                          }
                          name="color"
                          options={RoleList}
                          label="text"
                          getOptionLabel={(item) => item.text}
                          onChange={(e) => {
                            this.handleChangeUser(false, "roles", {
                              value: e.map((item) => item.value),
                            });
                          }}
                        />
                      </FormGroup>
                    </Col>
                  ) : (
                    ""
                  )}
                </>
              )
            ) : // this.state.employee.user.id != 0 &&
            isUser ? (
              <>
                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <h5 className="text-bold-600">{t1("Username")}</h5>
                    <Input
                      placeholder={t2("Username", intl)}
                      value={employee?.user?.userName}
                      onChange={(e) => {
                        this.handleChangeUser(e, "userName", e);
                      }}
                      invalid={isAlreadyTakenUsername}
                    />
                    <FormFeedback>
                      {t2("takenUsername", this.props.intl)}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <h5 className="text-bold-600">{t1("Password")}</h5>
                    <Input
                      placeholder={t2("Password", intl)}
                      value={employee?.user?.password}
                      onChange={(e) => {
                        this.handleChangeUser(e, "password", e);
                      }}
                    />
                  </FormGroup>
                </Col>
                {/* {!employee.isHr &&
                  (can("BranchesEmployeeCreate") ||
                  can("BranchesEmployeeEdit") ? (
                    <Col sm={12} md={6} lg={4}>
                      <FormGroup>
                        <h5 className="text-bold-600">
                          {t1("isTopInspector")}
                        </h5>
                        <Input
                          className="ml-1"
                          type="checkbox"
                          checked={employee.isTopInspector}
                          value={isUser}
                          onChange={(e) => {
                            this.setState((prevState) => ({
                              employee: {
                                ...prevState.employee,
                                isTopInspector:
                                  !prevState.employee.isTopInspector,
                              },
                            }));
                          }}
                        />
                      </FormGroup>
                    </Col>
                  ) : (
                    ""
                  ))} */}

                {can("UserCreate") ||
                can("BranchesUserCreate") ||
                can("AllUserCreate") ? (
                  <Col className="mb-4 pb-4" sm={12} md={6} lg={4}>
                    <FormGroup>
                      <h5 className="text-bold-600">{t1("Role")}</h5>
                      <Select
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 200 }),
                        }}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        isMulti
                        placeholder={t2("Role", intl)}
                        defaultValue={
                          !!employee.user.roles &&
                          employee.user.roles.length > 0
                            ? RoleList.filter((item) =>
                                employee.user.roles.includes(item.value)
                              )
                            : []
                        }
                        name="color"
                        options={RoleList}
                        label="text"
                        getOptionLabel={(item) => item.text}
                        onChange={(e) => {
                          this.handleChangeUser(false, "roles", {
                            value: e.map((item) => item.value),
                          });
                        }}
                      />
                    </FormGroup>
                  </Col>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </Row>
        </Card>
        <Card className="p-2">
          <Row>
            <Col className="text-right">
              {this.props.ID ? null : (
                <Button
                  className="mr-1"
                  color="danger"
                  onClick={() => {
                    employee.isHr
                      ? history.push("/info/kadr")
                      : history.push("/info/employee");
                  }}
                >
                  {" "}
                  {t1("back")}{" "}
                </Button>
              )}

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
export default injectIntl(EditEmployee);
