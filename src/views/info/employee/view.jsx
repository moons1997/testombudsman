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
  InputGroupAddon,
  FormFeedback,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardHeader,
  CardBody,
  CardTitle,
  Badge,
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
      loadingHistory: false,
      SaveLoading: false,
      StateList: [],
      RoleList: [],
      modal: false,
      activeTab: "1",
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
      employeeHistory: [],
      isUser: false,
      timer: null,
      isAlreadyTakenUsername: false,
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
  }

  changeParentOrg = (id) => {
    OrganizationService.GetAsSelectList(id, false, false).then((res) => {
      this.setState({ OrganizationList: res.data });
    });
  };
  toggle(tab) {
    // if(can("RequestAgree"))
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }
  GetHistory = () => {
    this.setState({ loadingHistory: true });
    EmployeeService.GetAttestationList(this.state.employee.id)
      .then((res) => {
        this.setState({ employeeHistory: res.data, loadingHistory: false });
      })
      .catch((error) => {
        this.setState({ loadingHistory: false });
        errorToast(error.response.data);
      });
  };
  getColor = (id) => {
    switch (id) {
      case 1:
        return "info";
        break;
      case 12:
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
  render() {
    const {
      loading,
      SaveLoading,
      employee,
      filter,
      employeeHistory,
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
        </Card>
        <Nav pills>
          <NavItem>
            <NavLink
              className={{ active: this.state.activeTab === "1" }}
              onClick={() => {
                this.toggle("1");
              }}
            >
              <span style={{ fontSize: "24px" }}>
                {this.props.ID
                  ? t1("Employee")
                  : employee.isHr
                  ? t1("Kadr")
                  : t1("Employee")}
              </span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={{ active: this.state.activeTab === "2" }}
              onClick={() => {
                this.toggle("2");
                this.GetHistory();
              }}
            >
              <span style={{ fontSize: "24px" }}> {t1("History")} </span>
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            {filter.documenttypeId == 2 ? (
              <Card className="p-2">
                <Row>
                  <Col sm={12} md={6} lg={3} className="mb-0">
                    <FormGroup>
                      <h5> {t1("surnameLatin")}</h5>
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
                <Row>
                  <Col>
                    <h2 className="text-success">
                      {" "}
                      <Icon.CheckCircle />{" "}
                      {employee.person.surnameLatin +
                        " " +
                        employee.person.nameLatin +
                        " " +
                        employee.person.patronymLatin}{" "}
                    </h2>
                  </Col>
                  <Col>
                    <h6 className="text-warning">
                      <span style={{ color: "black" }}>
                        {" "}
                        {t1("createdUserName")}:{" "}
                      </span>
                      {employee.createdUser}({employee.createdUserName})
                    </h6>
                  </Col>
                </Row>

                <Row>
                  <Col sm={12} md={6}>
                    <ListGroup>
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
                <Col sm={12} md={6}>
                  <ListGroup>
                    <ListGroupItem className="d-flex justify-content-between">
                      {" "}
                      <span>
                        {" "}
                        <b className="mr-3">
                          {" "}
                          {t1("parentOrganization")}{" "}
                        </b>{" "}
                      </span>{" "}
                      <span className="text-right">
                        {" "}
                        {employee.parentOrganization}{" "}
                      </span>
                    </ListGroupItem>
                    <ListGroupItem className="d-flex justify-content-between">
                      {" "}
                      <span>
                        {" "}
                        <b className="mr-3"> {t1("organization")} </b>{" "}
                      </span>{" "}
                      <span className="text-right">
                        {" "}
                        {employee.organization}{" "}
                      </span>{" "}
                    </ListGroupItem>
                    <ListGroupItem className="d-flex justify-content-between">
                      {" "}
                      <span>
                        {" "}
                        <b className="mr-3"> {t1("position")} </b>{" "}
                      </span>{" "}
                      <span className="pl-2" style={{ textAlign: "right" }}>
                        {" "}
                        {employee.position}{" "}
                      </span>{" "}
                    </ListGroupItem>
                  </ListGroup>
                </Col>
                <Col sm={12} md={6}>
                  <ListGroup>
                    <ListGroupItem className="d-flex justify-content-between">
                      {" "}
                      <span>
                        {" "}
                        <b> {t1("phoneNumber")} </b>{" "}
                      </span>{" "}
                      <span> {employee.phoneNumber} </span>{" "}
                    </ListGroupItem>
                    <ListGroupItem className="d-flex justify-content-between">
                      {" "}
                      <span>
                        {" "}
                        <b> {t1("Username")} </b>{" "}
                      </span>{" "}
                      <span className="text-right">
                        {" "}
                        {employee?.user?.userName}{" "}
                      </span>
                    </ListGroupItem>
                    <ListGroupItem className="d-flex justify-content-between">
                      {" "}
                      <span>
                        {" "}
                        <b> {t1("state")} </b>{" "}
                      </span>{" "}
                      <span> {employee.state} </span>{" "}
                    </ListGroupItem>
                    {/* <ListGroupItem className="d-flex justify-content-between">
                  {" "}
                  <span>
                    {" "}
                    <b> {t1("roles")} </b>{" "}
                  </span>{" "}
                  <span className="text-right"> {} </span>{" "}
                </ListGroupItem> */}
                  </ListGroup>
                </Col>
              </Row>
            </Card>
          </TabPane>
          <TabPane tabId="2">
            <Card>
              <CardHeader>
                <CardTitle>{t1("HistoryDocument")}</CardTitle>
              </CardHeader>
              <CardBody>
                <div
                  className="test"
                  style={{
                    maxHeight: "400px",
                    overflow: "auto",
                    height: "100%",
                  }}
                >
                  <ul className="activity-timeline timeline-left list-unstyled">
                    {this.state.loadingHistory ? (
                      <Spinner size="sm" />
                    ) : (
                      employeeHistory.map((item, idx) => (
                        <li key={idx}>
                          <div
                            className={`timeline-icon bg-${this.getColor(
                              item.statusId
                            )}`}
                          >
                            <Icon.Plus size={16} />
                          </div>

                          <div className="timeline-info">
                            <p className="font-weight-bold mb-0">
                              {item.userInfo}
                            </p>
                            <span className="font-small-3">
                              -
                              <Badge
                                color={this.getColor(item.statusId)}
                                className="mr-1"
                              >
                                {item.status}
                              </Badge>
                              {t1("attestationId")} - {item.id}
                            </span>
                            <p>
                              {t1("docDate")} - {item.docDate}
                            </p>
                            <p>
                              {t1("message")} - {item.message}
                            </p>
                          </div>
                          <small className="text-muted"></small>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </CardBody>
            </Card>
          </TabPane>
        </TabContent>

        <Card className="p-2">
          <Row>
            <Col className="text-right">
              {this.props.ID ? null : (
                <Button
                  className="mr-1"
                  color="danger"
                  onClick={() => {
                    history.goBack();
                  }}
                >
                  {" "}
                  {t1("back")}{" "}
                </Button>
              )}
            </Col>
          </Row>
        </Card>
      </Overlay>
    );
  }
}
export default injectIntl(EditEmployee);
