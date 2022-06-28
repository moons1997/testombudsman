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
  Badge,
  TabContent,
  TabPane,
  Nav,
  Form,
  NavItem,
  NavLink,
  Table,
  InputGroup,
  InputGroupAddon,
  UncontrolledTooltip,
} from "reactstrap";
import Overlay from "../../../components/Webase/components/Overlay";
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
import style from "../inspectionbook/style.css";
// import { DatePicker } from "antd";
import "moment/locale/ru";
import locale from "antd/es/date-picker/locale/ru_RU";
import CheckValidation from "../../../components/Webase/functions/checkvalidation";
import DatePicker, { registerLocale } from "react-datepicker";
import MaskedTextInput from "react-text-mask";
import uz from "date-fns/locale/uz";
import uzCyrl from "date-fns/locale/uz-Cyrl";
import ru from "date-fns/locale/ru";
import { changeAll } from "../../../redux/actions/pagination";
import { connect } from "react-redux";
import date from "./date.css";
registerLocale("uz", uz);
registerLocale("uzCyrl", uzCyrl);
registerLocale("ru", ru);
const { t1, t2 } = Translate;
const { can } = Permission;

const { errorToast, successToast, customErrorToast } = Notification;
const { check, checkFilePdf20mb } = CheckValidation;

class EditRequest extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      requestpostponement: { contractor: {} },
      loading: false,
      loadingPostponement: false,
      SaveLoading: false,
      activeTab: "1",
    };
  }
  //Created
  componentDidMount() {
    this.Refresh();
    this.GetDataList();
  }
  // method
  Refresh = () => {
    this.setState({ loadingPostponement: true });
    if (
      !!this.props.location.state &&
      this.props.location.state.postponementBtn
    ) {
      RequestPostponementService.GetByRequestId(this.props.match.params.id)
        .then((res) => {
          this.setState({ loadingPostponement: false });
          this.setState({
            requestpostponement: res.data,
            // loadingPostponement: false,
          });
        })
        .catch((error) => {
          this.setState({ loadingPostponement: false });
          errorToast(error.response.data);
        });
    } else {
      RequestPostponementService.Get(this.props.match.params.id)
        .then((res) => {
          this.setState({
            requestpostponement: res.data,
          });
          this.setState({ loadingPostponement: false });
        })
        .catch((error) => {
          this.setState({ loadingPostponement: false });
          errorToast(error.response.data);
        });
    }
  };

  GetDataList = () => {};
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

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }
  RadioClickProd = (id) => {
    this.setState((prevState) => ({
      requestpostponement: {
        ...prevState.requestpostponement,
        requestStatusId: 14,
      },
    }));
  };
  RadioClickPer = (id) => {
    this.setState((prevState) => ({
      requestpostponement: {
        ...prevState.requestpostponement,
        requestStatusId: 13,
      },
    }));
  };
  RadioClickOtm = (id) => {
    this.setState((prevState) => ({
      requestpostponement: {
        ...prevState.requestpostponement,
        requestStatusId: 15,
      },
    }));
  };
  handleChangePostponement(event, field, data) {
    var requestpostponement = this.state.requestpostponement;
    if (!!event) {
      requestpostponement[field] = !!event?.target
        ? event.target.value
        : data.value;
      this.setState({ requestpostponement: requestpostponement });
    } else {
      if (field === "docDate" || field === "startDate" || field === "endDate") {
        requestpostponement[field] = null;
      }
      this.setState({ requestpostponement: requestpostponement });
    }
  }
  handleChangeFile = (file, field) => {
    if (file.length > 0) {
      if (!checkFilePdf20mb(file[0], this.props.intl)) {
        return false;
      }
    }
    let formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      formData.append(`files`, file[i]);
    }
    const { requestpostponement } = this.state;
    RequestPostponementService.UploadFile(formData).then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        requestpostponement.files.push({
          id: res.data[i].fileId,
          name: res.data[i].fileName,
        });
      }
      this.setState({ requestpostponement: requestpostponement });
    });
  };
  DeleteFile = (data, index, field) => {
    let request = this.state.requestpostponement;

    if (field == "basic") {
      let test = request.files.filter((item) => item.id !== data.id);
      this.setState((prevState) => ({
        requestpostponement: {
          ...prevState.requestpostponement,
          files: test,
        },
      }));
    }
  };
  checkDate() {
    if (
      this.state.requestpostponement.requestStatusId == 13 &&
      this.state.requestpostponement.startDate == null
    ) {
      customErrorToast(t2("startDateToast", this.props.intl));
      return false;
    }
    if (
      this.state.requestpostponement.requestStatusId == 13 &&
      this.state.requestpostponement.endDate == null
    ) {
      customErrorToast(t2("endDateToast", this.props.intl));
      return false;
    }
    if (
      this.state.requestpostponement.requestStatusId == 14 &&
      this.state.requestpostponement.startDate == null
    ) {
      customErrorToast(t2("startDateToast", this.props.intl));
      return false;
    }
    if (
      this.state.requestpostponement.requestStatusId == 14 &&
      this.state.requestpostponement.endDate == null
    ) {
      customErrorToast(t2("endDateToast", this.props.intl));
      return false;
    }
    if (
      this.state.requestpostponement.requestStatusId == 14 &&
      this.state.requestpostponement.checkDaysNumber == null
    ) {
      customErrorToast(t2("checkDaysNumberToast", this.props.intl));
      return false;
    }
    return true;
  }
  SaveDataRePost = () => {
    if (!this.checkDate()) {
      return false;
    }
    this.setState({ SaveLoading: true });
    RequestPostponementService.Update(this.state.requestpostponement)
      .then((res) => {
        this.setState({ SaveLoading: false });
        successToast(t2("SuccessSave", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/view/" + res.data.id);
          this.props.changeAll({
            sortBy: "",
            orderType: "asc",
            page: 1,
            pageSize: 20,
          });
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ SaveLoading: false });
      });
  };

  render() {
    const { loading, SaveLoading, requestpostponement } = this.state;
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
                }}
              >
                <Row>
                  <Col>
                    <h2> {t1("RequestPostponement")} </h2>
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
                            {requestpostponement.contractor.innOrPinfl}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">{t1("contractor")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {requestpostponement.contractor.fullName}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">{t1("Region")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {requestpostponement.contractor.region}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">{t1("District")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {requestpostponement.contractor.district}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">
                          <h6 className="text-bold-600">{t1("Oked")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {requestpostponement.contractor.oked}
                          </h6>
                        </td>
                        <td scope="row">
                          <h6 className="text-bold-600">
                            {t1("orderedOrganizationId")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {requestpostponement.orderedOrganization}
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
                            {requestpostponement.inspectionOrganization}
                          </h6>
                        </td>
                        <td scope="row">
                          <h6 className="text-bold-600">
                            {t1("authorizedOrganizationId")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {requestpostponement.authorizedOrganization}
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
                    <h5 className="text-bold-600"> {t1("docDate")} </h5>
                    <InputGroup size="md" className="datePicker">
                      <DatePicker
                        dateFormat="dd.MM.yyyy"
                        selected={
                          requestpostponement.docDate
                            ? moment(
                                requestpostponement.docDate,
                                "DD.MM.YYYY"
                              ).toDate()
                            : ""
                        }
                        onChange={(date, dateString) => {
                          this.handleChangePostponement(date, "docDate", {
                            value: moment(new Date(date)).format("DD.MM.YYYY"),
                          });
                        }}
                        isClearable={
                          !!requestpostponement.docDate ? true : false
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
                {this.state.requestpostponement.requestStatusId != 15 ? (
                  <>
                    <Col sm={12} md={6} lg={3}>
                      <FormGroup>
                        <h5 className="text-bold-600"> {t1("startDate")} </h5>
                        <InputGroup size="md" className="datePicker">
                          <DatePicker
                            dateFormat="dd.MM.yyyy"
                            selected={
                              requestpostponement.startDate
                                ? moment(
                                    requestpostponement.startDate,
                                    "DD.MM.YYYY"
                                  ).toDate()
                                : ""
                            }
                            onChange={(date, dateString) => {
                              this.handleChangePostponement(date, "startDate", {
                                value: moment(new Date(date)).format(
                                  "DD.MM.YYYY"
                                ),
                              });
                            }}
                            isClearable={
                              !!requestpostponement.startDate ? true : false
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
                    </Col>
                    <Col sm={12} md={6} lg={3}>
                      <FormGroup>
                        <h5 className="text-bold-600"> {t1("endDate")} </h5>
                        <InputGroup size="md" className="datePicker">
                          <DatePicker
                            dateFormat="dd.MM.yyyy"
                            selected={
                              requestpostponement.endDate
                                ? moment(
                                    requestpostponement.endDate,
                                    "DD.MM.YYYY"
                                  ).toDate()
                                : ""
                            }
                            onChange={(date, dateString) => {
                              this.handleChangePostponement(date, "endDate", {
                                value: moment(new Date(date)).format(
                                  "DD.MM.YYYY"
                                ),
                              });
                            }}
                            isClearable={
                              !!requestpostponement.endDate ? true : false
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
                    </Col>
                    {this.state.requestpostponement.requestStatusId == 14 ? (
                      <Col sm={12} md={6} lg={3}>
                        <FormGroup>
                          <h5 className="text-bold-600">
                            {" "}
                            {t1("checkDaysNumber")}{" "}
                          </h5>
                          <Input
                            type="number"
                            value={requestpostponement.checkDaysNumber || ""}
                            onChange={(e) =>
                              this.handleChangePostponement(
                                e,
                                "checkDaysNumber"
                              )
                            }
                            id="checkDaysNumber"
                            placeholder={t2("checkDaysNumber", intl)}
                          />
                        </FormGroup>
                      </Col>
                    ) : (
                      <Col sm={12} md={6} lg={3}></Col>
                    )}
                  </>
                ) : (
                  ""
                )}
                <Col sm={12} md={6} lg={6}>
                  <Form>
                    <FormGroup check inline>
                      <Input
                        type="radio"
                        checked={
                          requestpostponement.requestStatusId == 13
                            ? true
                            : false
                        }
                        value={requestpostponement.requestStatusId || ""}
                        onChange={(e) => {
                          this.handleChangePostponement(e, "requestStatusId");
                          this.RadioClickPer(13);
                        }}
                        id="requestStatusId"
                        name="requestStatusId"
                      />
                      <h5 className="text-bold-600">{t1("Перенос")}</h5>
                    </FormGroup>
                    <FormGroup check inline>
                      <Input
                        type="radio"
                        checked={
                          requestpostponement.requestStatusId == 14
                            ? true
                            : false
                        }
                        value={requestpostponement.requestStatusId || ""}
                        onChange={(e) => {
                          this.handleChangePostponement(e, "requestStatusId");
                          this.RadioClickProd(14);
                        }}
                        id="requestStatusId"
                        name="requestStatusId"
                      />
                      <h5 className="text-bold-600">{t1("Продление")}</h5>
                    </FormGroup>
                    <FormGroup check inline>
                      <Input
                        type="radio"
                        checked={
                          requestpostponement.requestStatusId == 15
                            ? true
                            : false
                        }
                        value={requestpostponement.requestStatusId || ""}
                        onChange={(e) => {
                          this.handleChangePostponement(e, "requestStatusId");
                          this.RadioClickOtm(15);
                        }}
                        // onClick={() => {
                        //   this.RadioClickOtm(15);
                        // }}
                        id="requestStatusId"
                        name="requestStatusId"
                      />
                      <h5 className="text-bold-600">{t1("Отмена")}</h5>
                    </FormGroup>
                  </Form>
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <FormGroup>
                    <h5 className="text-bold-600"> {t1("reason")} </h5>
                    <Input
                      type="textarea"
                      value={requestpostponement.reason || ""}
                      onChange={(e) =>
                        this.handleChangePostponement(e, "reason")
                      }
                      id="reason"
                      placeholder={t2("reason", intl)}
                    />
                  </FormGroup>
                </Col>
                <Col sm={12} md={12} lg={12}>
                  <FormGroup>
                    <Row>
                      <Col>
                        <h5 className="text-bold-600">{t1("basicFiles")}</h5>
                        <CustomInput
                          accept="application/pdf"
                          id="exampleFile"
                          name="file"
                          type="file"
                          label="Прикрепить файл"
                          dataBrowse="Прикрепить файл"
                          onChange={(e) => {
                            this.handleChangeFile(e.target.files, "basic");
                          }}
                        />
                      </Col>
                      <Col>
                        <FormGroup>
                          <h5 className="text-bold-600">
                            {t1("orderNumber")}{" "}
                          </h5>
                          <Input
                            type="text"
                            value={requestpostponement.orderNumber || ""}
                            onChange={(e) =>
                              this.handleChangePostponement(e, "orderNumber")
                            }
                            id="orderNumber"
                            placeholder={t2("orderNumber", intl)}
                          />
                        </FormGroup>
                      </Col>
                      <Col>
                        {/* <h4 class="d-flex align-items-center">
                          <span style={{ color: "red", marginBottom: "15px" }}>
                            {" "}
                            *{" "}
                          </span>
                          <span> {t1("checkFilePdf20mb")} </span>
                        </h4> */}

                        {requestpostponement.files?.map((item, index) => (
                          <Badge
                            id="files"
                            color="primary"
                            className="mr-1 mt-2"
                            key={index}
                          >
                            {item.name || item.fileName}{" "}
                            <Icon.Trash
                              onClick={() =>
                                this.DeleteFile(item, index, "basic")
                              }
                              style={{ cursor: "pointer" }}
                              size={15}
                            />{" "}
                            <UncontrolledTooltip placement="top" target="files">
                              {t1("dateOfCreatedFile")} - {item.dateOfCreated}
                            </UncontrolledTooltip>
                          </Badge>
                        ))}
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className="text-right">
                  <Button
                    className="mr-1"
                    color="danger"
                    onClick={() => history.push("/document/postponement")}
                  >
                    {" "}
                    {t1("back")}{" "}
                  </Button>
                  {/* </Col>
                <Col className="text-right"> */}
                  <Button color="success" onClick={this.SaveDataRePost}>
                    {" "}
                    {SaveLoading ? <Spinner size="sm" /> : ""} {t1("Save")}{" "}
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
