import React from "react";
import {
  Card,
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  Spinner,
  CustomInput,
  TabContent,
  TabPane,
  Collapse,
  CardHeader,
  NavItem,
  NavLink,
  Nav,
  CardTitle,
  CardBody,
} from "reactstrap";
import RoleService from "../../../services/management/role.service";
import Overlay from "../../../components/Webase/components/Overlay";
import ManualService from "../../../services/other/manual.service";
import Select from "react-select";
import { Notification, Translate } from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
import * as Icon from "react-feather";
const { t1, t2 } = Translate;
const { errorToast, successToast } = Notification;
class EditRole extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.state = {
      role: {},
      loading: false,
      SaveLoading: false,
      StateList: [],
      modulelist: [],
      collapseID: "",
      activeTab: "1",
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
    RoleService.Get(this.props.match.params.id)
      .then((res) => {
        ManualService.GetModuleSelectList().then((res) => {
          this.setState({ modulelist: res.data });
        });
        this.setState({ role: res.data, loading: false });
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
    var role = this.state.role;
    role[field] = !!event.target ? event.target.value : data.value;
    this.setState({ role: role });
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
    RoleService.Update(this.state.role)
      .then((res) => {
        this.setState({ SaveLoading: false });
        successToast(t2("SuccessSave", this.props.intl));

        setTimeout(() => {
          this.props.history.push("/management/role");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ SaveLoading: false });
      });
  };
  toggleCollapse = (collapseID) => {
    this.setState((prevState) => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : "",
    }));
  };
  roleChange = (id) => {
    var role = this.state.role;
    if (role.modules.includes(id)) {
      var index = role.modules.indexOf(id);
      role.modules.splice(index, 1);
    } else {
      role.modules.push(id);
    }
    this.setState({ role: role });
  };
  render() {
    const { loading, SaveLoading, StateList, role, modulelist } = this.state;
    const { history, intl } = this.props;
    //template
    return (
      <Overlay show={loading}>
        <Card className="p-2">
          <Row>
            <Col className="text-center mb-1">
              <h1 className="pageTextView"> {t1("Role")} </h1>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-end">
              <CustomInput
                type="switch"
                id="isHr"
                inline
                defaultChecked={role.isHr}
                checked={role.isTopInspector}
                onChange={
                  () =>
                    this.setState((prevState) => ({
                      role: {
                        ...prevState.role,
                        isTopInspector: !prevState.role.isTopInspector,
                      },
                    }))
                  // this.handleChange(false, "isHr", {
                  //   value: !role.isHr,
                  // })
                }
              >
                <span className="ml-1"> {t1("isTopInspector")} </span>
              </CustomInput>
              <CustomInput
                type="switch"
                id="isHr"
                inline
                defaultChecked={role.isHr}
                onChange={() =>
                  this.handleChange(false, "isHr", {
                    value: !role.isHr,
                  })
                }
              >
                <span className="ml-1"> {t1("Kadr")} </span>
              </CustomInput>
              {/* </Col>
            <Col className="d-flex justify-content-end"> */}
              <CustomInput
                type="switch"
                id="isDefault"
                inline
                defaultChecked={role.isDefault}
                onChange={() =>
                  this.handleChange(false, "isDefault", {
                    value: !role.isDefault,
                  })
                }
              >
                <span className="ml-1"> {t1("isdefault")} </span>
              </CustomInput>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("fullname")} </h5>
                <Input
                  type="text"
                  value={role.fullName || ""}
                  onChange={(e) => this.handleChange(e, "fullName")}
                  id="fullName"
                  placeholder={t2("fullname", intl)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("shortname")} </h5>
                <Input
                  type="text"
                  value={role.shortName || ""}
                  onChange={(e) => this.handleChange(e, "shortName")}
                  id="shortName"
                  placeholder={t2("shortname", intl)}
                />
              </FormGroup>
            </Col>
            {this.props.match.params.id == 0 ? (
              ""
            ) : (
              <Col sm={12} md={6} lg={4}>
                <FormGroup>
                  <h5 className="text-bold-600">{t1("state")}</h5>
                  <Select
                    className="React"
                    classNamePrefix="select"
                    defaultValue={{ text: role.state || t2("Choose", intl) }}
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
        </Card>
        <Card>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={{ active: this.state.activeTab === "1" }}
                onClick={() => {
                  this.toggle("1");
                }}
              >
                <Row>
                  <Col className="m-2">
                    <h2> {t1("Role")} </h2>
                  </Col>
                </Row>
              </NavLink>
            </NavItem>
            {/* <NavItem>
              <NavLink
                className={{ active: this.state.activeTab === "2" }}
                onClick={() => {
                  this.toggle("2");
                }}
              >
                <Row>
                  <Col>
                    <h2> {t1("Document")} </h2>
                  </Col>
                </Row>
              </NavLink>
            </NavItem> */}
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            {modulelist.map((collapseItem, index) => (
              <TabPane tabId="1">
                <Row>
                  <Col className="m-2">
                    <p
                      className="ml-3"
                      style={{ fontSize: "24px", fontWeight: "bold" }}
                    >
                      {collapseItem.fullName}
                    </p>
                    {collapseItem.subGroups.map((subItem, subIndex) => (
                      <fieldset
                        className="border p-1"
                        key={subIndex + "subKey" + index}
                      >
                        <legend className="float-none w-auto px-1 pt-1 pb-0">
                          {subIndex + 1}. {subItem.fullName}
                        </legend>
                        <Row>
                          {subItem.modules.map((el, i) => (
                            <Col
                              sm={12}
                              md={6}
                              lg={3}
                              key={
                                subIndex + "subIndex" + i + "dsdsdsd" + index
                              }
                            >
                              <CustomInput
                                type="switch"
                                id={
                                  subIndex + "subIndexid" + i + "dsdsd" + index
                                }
                                checked={role.modules.includes(el.id)}
                                inline
                                onChange={() => {
                                  this.roleChange(el.id);
                                }}
                              >
                                <span
                                  htmlFor={subIndex + "subIndexid" + i}
                                  className="ml-1"
                                >
                                  {" "}
                                  {el.fullName}{" "}
                                </span>
                              </CustomInput>
                            </Col>
                          ))}
                        </Row>
                      </fieldset>
                    ))}
                  </Col>
                </Row>
              </TabPane>
            ))}
            <TabPane tabId="2"> </TabPane>
          </TabContent>
        </Card>
        {/* <div className="vx-collapse  accordion-icon-rotate">
          {modulelist.map((collapseItem, index) => (
            <Card
              key={collapseItem.id}
              onClick={() => this.toggleCollapse(collapseItem.id)}
            >
              <CardHeader className="w-100">
                <CardTitle className="lead collapse-title collapsed mb-1 w-100">
                  <div className="d-flex justify-content-between w-100">
                    <h4> {collapseItem.fullName} </h4>
                    <span>
                      {" "}
                      <Icon.ChevronDown />{" "}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>

              <Collapse isOpen={collapseItem.id === this.state.collapseID}>
                <CardBody>
                  {collapseItem.subGroups.map((subItem, subIndex) => (
                    <fieldset
                      className="border p-1"
                      key={subIndex + "subKey" + index}
                    >
                      <legend className="float-none w-auto px-1 pt-1 pb-0">
                        {subIndex + 1}. {subItem.fullName}
                      </legend>
                      <Row>
                        {subItem.modules.map((el, i) => (
                          <Col
                            sm={12}
                            md={6}
                            lg={3}
                            key={subIndex + "subIndex" + i + "dsdsdsd" + index}
                          >
                            <CustomInput
                              type="switch"
                              id={subIndex + "subIndexid" + i + "dsdsd" + index}
                              checked={role.modules.includes(el.id)}
                              inline
                              onChange={() => {
                                this.roleChange(el.id);
                              }}
                            >
                              <span
                                htmlFor={subIndex + "subIndexid" + i}
                                className="ml-1"
                              >
                                {" "}
                                {el.fullName}{" "}
                              </span>
                            </CustomInput>
                          </Col>
                        ))}
                      </Row>
                    </fieldset>
                  ))}
                </CardBody>
              </Collapse>
            </Card>
          ))}
        </div> */}
        <Row>
          <Col className="text-right">
            <Button
              className="mr-1"
              color="danger"
              onClick={() => history.push("/management/role")}
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
      </Overlay>
    );
  }
}
export default injectIntl(EditRole);
