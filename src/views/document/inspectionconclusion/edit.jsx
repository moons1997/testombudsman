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
  NavItem,
  NavLink,
  Nav,
  Badge,
  Form,
  Table,
  InputGroup,
  InputGroupAddon,
  UncontrolledTooltip,
} from "reactstrap";
import Overlay from "../../../components/Webase/components/Overlay";
import Select from "react-select";
import {
  Notification,
  Translate,
  Permission,
} from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
import moment from "moment";
import * as Icon from "react-feather";
import CheckingQuizService from "../../../services/info/checkingquiz.service";
import EmployeeService from "../../../services/info/employee.service";
import InspectionConclusionService from "../../../services/document/inspectionconclusion.service";
import style from "../inspectionbook/style.css";
import "moment/locale/ru";
import CheckValidation from "../../../components/Webase/functions/checkvalidation";
import DatePicker, { registerLocale } from "react-datepicker";
import MaskedTextInput from "react-text-mask";
import uz from "date-fns/locale/uz";
import uzCyrl from "date-fns/locale/uz-Cyrl";
import ru from "date-fns/locale/ru";
import date from "../request/date.css";
import ManualService from "../../../services/other/manual.service";
import { changeAll } from "../../../redux/actions/pagination";
import { connect } from "react-redux";
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
      inspectionconclusion: {
        contractor: {},
      },
      loading: false,
      SaveLoading: false,
      CheckingQuizzesList: [],
      activeTab: "1",
      modal: false,
      EmployeeList: [],
      ConclusionList: [],
      SaveInspectionResultLoading: false,
      errors: {
        comment: null,
      },
    };
  }
  //Created
  componentDidMount() {
    this.Refresh();
    this.GetDataList();
  }
  validation = (callback) => {
    var contractor = this.state.inspectionconclusion;
    var errors = {
      comment: !!contractor.comment ? false : true,
    };
    this.setState({ errors: errors }, () => callback());
  };
  // methods
  Refresh = () => {
    this.setState({ loading: true });
    if (
      !!this.props.location.state &&
      this.props.location.state.inspctionconclusiontBtn
    ) {
      InspectionConclusionService.GetByRequestId(this.props.match.params.id)
        .then((res) => {
          this.setState({ inspectionconclusion: res.data, loading: false });
          //   this.changeCheckingQuiz(
          //     this.state.inspectionconclusion.orderedOrganizationId
          //   );
        })
        .catch((error) => {
          this.setState({ loading: false });
          errorToast(error.response.data);
        });
    } else {
      InspectionConclusionService.Get(this.props.match.params.id)
        .then((res) => {
          this.setState({ inspectionconclusion: res.data, loading: false });
          //   this.changeCheckingQuiz(
          //     this.state.inspectionconclusion.orderedOrganizationId
          //   );
        })
        .catch((error) => {
          this.setState({ loading: false });
          errorToast(error.response.data);
        });
    }
  };
  GetDataList = () => {
    ManualService.ConclusionSelectList().then((res) => {
      this.setState({ ConclusionList: res.data });
    });
  };
  employeechange = ({}) => {
    EmployeeService.GetAsSelectList({}).then((res) => {
      this.setState({ EmployeeList: res.data });
    });
  };
  handleChangeInspectionResult = (event, field, data) => {
    var inspectionconclusion = this.state.inspectionconclusion;
    if (!!event) {
      inspectionconclusion[field] = !!event?.target
        ? event.target.value
        : data.value;
      // if (field == "conclusionId") {
      //   inspectionconclusion.conclusion = this.state.ConclusionList.filter(
      //     (item) => item.value === inspectionconclusion.conclusionId
      //   )[0].text;
      // }
      this.setState({ inspectionconclusion: inspectionconclusion });
      this.validation(() => {});
    } else {
      if (field === "dateOfCreated" || field === "dateOfModified") {
        inspectionconclusion[field] = "";
      }
      if (field == "conclusionId") {
        inspectionconclusion.conclusion = "";
        inspectionconclusion.conclusionId = null;
      }
      this.setState({ inspectionconclusion: inspectionconclusion });
    }
    this.validation(() => {});
  };
  changeCheckingQuiz = () => {
    CheckingQuizService.GetAsSelectList(
      this.state.inspectionconclusion.orderedOrganizationId
    ).then((res) => {
      this.setState({ CheckingQuizzesList: res.data });
    });
  };
  sendChange(event, field, data) {
    var send = this.state.send;
    send[field] = !!event.target ? event.target.value : data.value;
    this.setState({ send: send });
    this.state.send.id = this.state.request.id;
  }
  RadioClickProd = (id) => {
    this.setState((prevState) => ({
      inspectionconclusion: {
        ...prevState.inspectionconclusion,
        conclusionId: 2,
      },
    }));
  };
  RadioClickPer = (id) => {
    this.setState((prevState) => ({
      inspectionconclusion: {
        ...prevState.inspectionconclusion,
        conclusionId: 1,
      },
    }));
  };
  RadioClickOtm = (id) => {
    this.setState((prevState) => ({
      inspectionconclusion: {
        ...prevState.inspectionconclusion,
        conclusionId: 3,
      },
    }));
  };
  SaveDataInspectionResult = () => {
    this.validation(() => {
      if (
        Object.values(this.state.errors).filter((item) => item == true)
          .length == 0
      ) {
        this.setState({ SaveInspectionResultLoading: false });
        InspectionConclusionService.Update(this.state.inspectionconclusion)
          .then((res) => {
            this.setState({ SaveInspectionResultLoading: false });
            successToast(t2("SuccessSave", this.props.intl));
            this.props.history.push(
              "/document/inspectionconclusion/" + res.data.id
            );
            this.props.changeAll({
              sortBy: "",
              orderType: "asc",
              page: 1,
              pageSize: 20,
            });
            setTimeout(() => {}, 500);
          })
          .catch((error) => {
            errorToast(error.response.data);
            this.setState({ SaveInspectionResultLoading: false });
          });
      }
    });
  };
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }
  toggleModal = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  render() {
    const {
      loading,
      SaveInspectionResultLoading,
      inspectionconclusion,
      CheckingQuizzesList,
      EmployeeList,
      ConclusionList,
    } = this.state;
    const { history, intl } = this.props;
    //template
    return (
      <Overlay show={loading}>
        <Card className="p-2">
          <Nav tabs>
            <NavItem>
              <NavLink
                className={{ active: this.state.activeTab === "1" }}
                onClick={() => {
                  this.toggle("1");
                  //   this.InspectionResult();
                }}
              >
                <Row>
                  <Col>
                    <h2> {t1("InspectionConclusion")} </h2>
                  </Col>
                </Row>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col>
                  <Table>
                    <tbody>
                      <tr>
                        <td className="text-center" colSpan={4}>
                          <h6
                            style={{
                              color: "#4177C9",
                              fontSize: "20px",
                            }}
                            className="text-bold-600"
                          >
                            {t1("DocumentInfo")}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">{t1("docNumber")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900 text-left">
                            {inspectionconclusion.requestDocNumber}
                          </h6>
                        </td>
                        <td></td>
                        <td></td>
                      </tr>
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
                            {inspectionconclusion.contractor.innOrPinfl}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">{t1("contractor")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionconclusion.contractor.fullName}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">{t1("Region")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionconclusion.contractor.region}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">{t1("District")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionconclusion.contractor.district}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">
                          <h6 className="text-bold-600">{t1("Oked")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionconclusion.contractor.oked}
                          </h6>
                        </td>
                        <td scope="row">
                          <h6 className="text-bold-600">
                            {t1("orderedOrganizationId")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionconclusion.orderedOrganization}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">
                            {t1("inspectionOrganizationId")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionconclusion.inspectionOrganization}
                          </h6>
                        </td>
                        <td scope="row">
                          <h6 className="text-bold-600">
                            {t1("authorizedOrganizationId")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {inspectionconclusion.authorizedOrganization}
                          </h6>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
              <Row>
                {/* <Col sm={12} md={6} lg={3}>
                  <FormGroup>
                    <h5 className="text-bold-600"> {t1("dateOfCreated")} </h5>
                    <InputGroup size="md" className="datePicker">
                      <DatePicker
                        dateFormat="dd.MM.yyyy"
                        selected={
                          inspectionconclusion.dateOfCreated
                            ? moment(
                                inspectionconclusion.dateOfCreated,
                                "DD.MM.YYYY"
                              ).toDate()
                            : ""
                        }
                        onChange={(date, dateString) => {
                          this.handleChangeInspectionResult(
                            date,
                            "dateOfCreated",
                            {
                              value: moment(new Date(date)).format(
                                "DD.MM.YYYY"
                              ),
                            }
                          );
                        }}
                        isClearable={
                          !!inspectionconclusion.dateOfCreated ? true : false
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
                      />
                      <InputGroupAddon addonType="append">
                        <Button color="primary" size="sm">
                          <Icon.Calendar id={"translate"} size={15} />
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                </Col> */}
                <Col sm={12} md={6} lg={6}>
                  <Form>
                    <FormGroup check inline>
                      <Input
                        type="radio"
                        checked={
                          inspectionconclusion.conclusionId == 1 ? true : false
                        }
                        value={inspectionconclusion.conclusionId || ""}
                        onChange={(e) => {
                          this.handleChangeInspectionResult(e, "conclusionId");
                          this.RadioClickPer(1);
                        }}
                        id="conclusionId"
                        name="conclusionId"
                      />
                      <h5 className="text-bold-600">{t1("conclusion_1")}</h5>
                    </FormGroup>
                    <FormGroup check inline>
                      <Input
                        type="radio"
                        checked={
                          inspectionconclusion.conclusionId == 2 ? true : false
                        }
                        value={inspectionconclusion.conclusionId || ""}
                        onChange={(e) => {
                          this.handleChangeInspectionResult(e, "conclusionId");
                          this.RadioClickProd(2);
                        }}
                        id="conclusionId"
                        name="conclusionId"
                      />
                      <h5 className="text-bold-600">{t1("conclusion_2")}</h5>
                    </FormGroup>
                    <FormGroup check inline>
                      <Input
                        type="radio"
                        checked={
                          inspectionconclusion.conclusionId == 3 ? true : false
                        }
                        value={inspectionconclusion.conclusionId || ""}
                        onChange={(e) => {
                          this.handleChangeInspectionResult(e, "conclusionId");
                          this.RadioClickOtm(3);
                        }}
                        id="conclusionId"
                        name="conclusionId"
                      />
                      <h5 className="text-bold-600">{t1("conclusion_3")}</h5>
                    </FormGroup>
                  </Form>
                </Col>
                {/* <Col sm={12} md={6} lg={3}>
                  <FormGroup>
                    <h5 className="text-bold-600">{t1("conclusion")}</h5>
                    <Select
                      styles={{
                        menu: (provided) => ({ ...provided, zIndex: 200 }),
                      }}
                      classNamePrefix="select"
                      defaultValue={{
                        text:
                          inspectionconclusion.conclusion || t2("Choose", intl),
                      }}
                      isClearable
                      value={{
                        text:
                          inspectionconclusion.conclusion || t2("Choose", intl),
                      }}
                      name="color"
                      options={ConclusionList}
                      label="text"
                      getOptionLabel={(item) => item.text}
                      onChange={(e) =>
                        this.handleChangeInspectionResult(e, "conclusionId", e)
                      }
                    />
                  </FormGroup>
                </Col> */}
                <Col sm={12} md={6} lg={6}>
                  <FormGroup>
                    <h5 className="text-bold-600"> {t1("comment")} </h5>
                    <Input
                      invalid={this.state.errors.comment}
                      type="textarea"
                      value={inspectionconclusion.comment || ""}
                      onChange={(e) =>
                        this.handleChangeInspectionResult(e, "comment")
                      }
                      id="comment"
                      placeholder={t2("comment", intl)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className="text-right">
                  <Button
                    className="mr-1"
                    color="danger"
                    onClick={() =>
                      history.push("/document/inspectionconclusion")
                    }
                  >
                    {" "}
                    {t1("back")}{" "}
                  </Button>
                  {/* </Col>
                <Col className="text-right"> */}
                  <Button
                    color="success"
                    onClick={this.SaveDataInspectionResult}
                  >
                    {" "}
                    {SaveInspectionResultLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      ""
                    )}{" "}
                    {t1("Save")}{" "}
                  </Button>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </Card>
      </Overlay>
    );
  }
}

// export default injectIntl(EditRequest);
const mapStateToProps = (state) => {
  return {
    values: state.pagination,
  };
};

export default connect(mapStateToProps, {
  changeAll,
})(injectIntl(EditRequest));
