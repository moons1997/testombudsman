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
  Alert,
} from "reactstrap";
import Overlay from "../../../components/Webase/components/Overlay";
import {
  Notification,
  Translate,
  Permission,
} from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
import * as Icon from "react-feather";
import InspectionBookService from "../../../services/document/inspectionbook.service";
import { isSend } from "../../../components/Webase/functions/RequestStatus";
import style from "../inspectionbook/style.css";
import "./style.css";
import InspectionBookOfContractorService from "../../../services/document/inspectionbookofcontractor.service";
const { t1, t2 } = Translate;
const { can } = Permission;
const { errorToast, successToast } = Notification;

class EditInspectionResult extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.state = {
      insectionbookofcontractor: {
        contractor: {},
      },
      loading: false,
      loading2: false,
      loadingPostponement: false,
      SaveLoading: false,
      activeTab: "1",
      histories: [],
      send: {},
      SendLoading: false,
      modal: false,
    };
  }
  //Created
  componentDidMount() {
    // this.Refresh();
    this.RefreshBook();
  }
  // methods

  // Refresh = () => {
  //   this.setState({ loading: true });
  //   InspectionBookOfContractorService.Get(this.props.match.params.id)
  //     .then((res) => {
  //       this.setState({
  //         loading: false,
  //         insectionbookofcontractor: res.data,
  //       });
  //     })
  //     .catch((error) => {
  //       this.setState({ loading: false });
  //       errorToast(error.response.data);
  //     });
  // };
  RefreshBook = () => {
    this.setState({ loading2: true });
    InspectionBookService.Get(this.props.match.params.id)
      .then((res) => {
        this.setState({
          loading2: false,
          insectionbook: res.data,
        });
      })
      .catch((error) => {
        this.setState({ loading2: false });
        errorToast(error.response.data);
      });
  };

  render() {
    const {
      loading,
      loading2,
      insectionbookofcontractor,
      insectionbook,
      histories,
    } = this.state;
    const { history, intl } = this.props;
    //template
    return (
      <Overlay show={loading2}>
        <Row>
          <Col sm={12} md={12} lg={12}>
            <Card className="p-2">
              <Row>
                <Col>
                  <h1 className="text-center">{t1("inpestionbookinfo")}</h1>
                  <h3 className="text-center">
                    {insectionbook?.contractor.shortName}
                  </h3>
                  <h5 className="text-center">
                    {insectionbook?.contractor?.address}
                  </h5>
                  <h5 className="text-center">
                    {insectionbook?.contractor?.innOrPinfl}
                  </h5>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        {
          // this.props.location.state.inspectionBookId != null

          true ? (
            <>
              <Row>
                <Col>
                  <Card>
                    <Row>
                      <Col className="mt-2 ml-2">
                        <h3 className="styleText">1 - {t1("punkt")}</h3>
                        <p style={{ fontSize: "14px" }}>
                          {t1("orderCode")} -{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {insectionbook?.orderCode}
                          </span>
                        </p>
                      </Col>
                    </Row>
                  </Card>
                  <Card className="p-2">
                    <Row>
                      <Col>
                        <h3 className="styleText">2 - {t1("punkt")}</h3>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Row>
                          <Col>
                            <p style={{ fontSize: "14px" }}>
                              {t1("orderedOrganization")} -{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {insectionbook?.orderedOrganization}
                              </span>
                            </p>
                            <p style={{ fontSize: "14px" }}>
                              {t1("inspectionOrganizationCeo")} -{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {insectionbook?.inspectionOrganizationCeo}
                              </span>
                            </p>
                            <p style={{ fontSize: "14px" }}>
                              {t1("inspectionOrganizationName")} -{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {insectionbook?.inspectionOrganizationName}
                              </span>
                            </p>
                            {/* <p style={{ fontSize: "14px" }}>
                              {t1("region")} -{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {insectionbook?.contractor?.oblast}
                              </span>
                            </p>
                            <p style={{ fontSize: "14px" }}>
                              {t1("District")} -{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {insectionbook?.contractor?.region}
                              </span>
                            </p>
                            <p style={{ fontSize: "14px" }}>
                              {t1("address")} -{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {insectionbook?.contractor?.address}
                              </span>
                            </p> */}
                          </Col>
                          <Col>
                            <p style={{ fontSize: "14px" }}>
                              {t1("inspectionOrganizationPostalAddres")} -{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {
                                  insectionbook?.inspectionOrganizationPostalAddres
                                }
                              </span>
                            </p>
                            <p style={{ fontSize: "14px" }}>
                              {t1("inspectionOrganizationAddres")} -{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {insectionbook?.inspectionOrganizationAddres}
                              </span>
                            </p>
                            {/* <p style={{ fontSize: "14px" }}>
                              {t1("inspectionOrganizationPostalAddres")} -{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {
                                  insectionbook?.contractor
                                    ?.inspectionOrganizationPostalAddres
                                }
                              </span>
                            </p> */}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card className="p-2">
                    <Row>
                      <Col>
                        <h3 class="styleText">3 - {t1("punkt")}</h3>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Table>
                          <tbody>
                            <tr>
                              <td className="text-center" colSpan={6}>
                                <span
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {t1("inspectors")}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>{t1("employeeName")}</td>
                              <td>{t1("certificateNumber")}</td>
                              <td>{t1("certificateExpiration")}</td>
                              <td>{t1("dutyNumber")}</td>
                              <td>{t1("dutyExpiration")}</td>
                            </tr>
                            {insectionbook?.inspectors?.map((item, index) => (
                              <tr key={index}>
                                <td>{item.fullName}</td>
                                <td>{item.certificateNumber}</td>
                                <td>{item.certificateExpiration}</td>
                                <td>{item.dutyNumber}</td>
                                <td>{item.dutyExpiration}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card className="p-2">
                    <Row>
                      <Col>
                        <h3 class="styleText">4 - {t1("punkt")}</h3>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Table>
                          <tbody>
                            <tr>
                              <td className="text-center" colSpan={9}>
                                <span
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {t1("involvedInspectors")}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>{t1("organizationName")}</td>
                              <td>{t1("address")}</td>
                              <td>{t1("inspectorFullName")}</td>
                              <td>{t1("dutyNumber")}</td>
                              <td>{t1("dutyExpiration")}</td>
                              <td>{t1("dutyIssuingOrganization")}</td>
                              <td>{t1("certificateNumber")}</td>
                              <td>{t1("certificateIssuingOrganization")}</td>
                              <td>{t1("certificateExpiration")}</td>
                            </tr>
                            {insectionbook?.involvedInspectors?.map(
                              (item2, index2) => (
                                <tr key={index2}>
                                  <td>{item2.organizationName}</td>
                                  <td>{item2.address}</td>
                                  <td>{item2.inspectorFullName}</td>
                                  <td>{item2.dutyNumber}</td>
                                  <td>{item2.dutyExpiration}</td>
                                  <td>{item2.dutyIssuingOrganization}</td>
                                  <td>{item2.certificateNumber}</td>
                                  <td>
                                    {item2.certificateIssuingOrganization}
                                  </td>
                                  <td>{item2.certificateExpiration}</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </Table>
                        <Table className="mt-2">
                          <tbody>
                            <tr>
                              <td className="text-center" colSpan={7}>
                                <span
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {t1("InvolvedAuditors")}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>{t1("organizationName")}</td>
                              <td>{t1("licenseDate")}</td>
                              <td>{t1("licenseNumber")}</td>
                              <td>{t1("licenseExpiration")}</td>
                              <td>{t1("auditorFullName")}</td>
                              <td>{t1("contractNumber")}</td>
                              <td>{t1("contractExpiration")}</td>
                            </tr>
                            {insectionbook?.involvedAuditors?.map(
                              (item3, index3) => (
                                <tr key={index3}>
                                  <td>{item3.organizationName}</td>
                                  <td>{item3.licenseDate}</td>
                                  <td>{item3.licenseNumber}</td>
                                  <td>{item3.licenseExpiration}</td>
                                  <td>{item3.auditorFullName}</td>
                                  <td>{item3.contractNumber}</td>
                                  <td>{item3.contractExpiration}</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </Table>
                        <Table className="mt-2">
                          <tbody>
                            <tr>
                              <td className="text-center" colSpan={6}>
                                <span
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {t1("specialists")}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>{t1("inspectorsName")}</td>
                              <td>{t1("workplace")}</td>
                              <td>{t1("directionOfActivity")}</td>
                              <td>{t1("contractNumber")}</td>
                            </tr>
                            {insectionbook?.specialists?.map(
                              (item4, index4) => (
                                <tr key={index4}>
                                  <td>{item4.fullName}</td>
                                  <td>{item4.workplace}</td>
                                  <td>{item4.directionOfActivity}</td>
                                  <td>{item4.contractNumber}</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12}>
                  <Card className="p-2">
                    <Row>
                      <Col>
                        <h3 class="styleText">5 - {t1("punkt")}</h3>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={4} md={4}>
                        <p style={{ fontSize: "14px" }}>
                          {t1("requestDocNumber")} -{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {insectionbook?.docNumber}
                          </span>
                        </p>
                      </Col>
                      <Col lg={4} md={4}>
                        <p style={{ fontSize: "14px" }}>
                          {t1("orderNumber")} -{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {insectionbook?.orderNumber}
                          </span>
                        </p>
                      </Col>
                      <Col lg={4} md={4}>
                        <p style={{ fontSize: "14px" }}>
                          {t1("orderDate")} -{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {insectionbook?.orderDate}
                          </span>
                        </p>
                      </Col>
                      <Col lg={12} md={12}>
                        <p style={{ fontSize: "14px" }}>
                          {t1("criminalCaseInfo")} -{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {insectionbook?.criminalCaseInfo}
                          </span>
                        </p>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col>
                  <Card className="p-2">
                    <Row>
                      <Col>
                        <h3 class="styleText">6 - {t1("punkt")}</h3>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        {insectionbook?.controlFunctionNames?.map(
                          (item, index) => (
                            <p key={index} style={{ fontSize: "14px" }}>
                              {t1("controlFunctions")} -{" "}
                              <span style={{ fontWeight: "bold" }}>{item}</span>
                            </p>
                          )
                        )}
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            ""
          )
        }
        <Row>
          {
            // this.props.location.state.inspectionBookId != null
            true ? (
              <>
                {" "}
                <Col lg={12} md={12}>
                  <Card className="p-2">
                    <Row>
                      <Col>
                        <h3 class="styleText">7 - {t1("punkt")}</h3>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={4} md={4}>
                        <p style={{ fontSize: "14px" }}>
                          {t1("startDate")} -{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {insectionbook?.startDate}
                          </span>
                        </p>
                      </Col>
                      <Col lg={4} md={4}>
                        <p style={{ fontSize: "14px" }}>
                          {t1("endDate")} -{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {insectionbook?.endDate}
                          </span>
                        </p>
                      </Col>
                      <Col lg={4} md={4}>
                        <p style={{ fontSize: "14px" }}>
                          {t1("checkDaysNumber")} -{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {insectionbook?.checkDaysNumber}
                          </span>
                        </p>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </>
            ) : (
              ""
            )
          }
          {
            // this.props.location.state.inspectionBookOfContractorId != null
            true ? (
              <>
                {" "}
                <Col>
                  <Card className="p-2">
                    <Row>
                      <Col>
                        <h3 class="styleText">8 - {t1("punkt")}</h3>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={4} md={4}>
                        <p style={{ fontSize: "14px" }}>
                          {t1("startDate")} -{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {insectionbook?.contractorStartDate}
                          </span>
                        </p>
                      </Col>
                      <Col lg={4} md={4}>
                        <p style={{ fontSize: "14px" }}>
                          {t1("endDate")} -{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {insectionbook?.contractorEndDate}
                          </span>
                        </p>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </>
            ) : (
              ""
            )
          }
        </Row>
        {
          // this.props.location.state.inspectionBookOfContractorId != null
          true ? (
            <>
              <Row>
                <Col>
                  <Card className="p-2">
                    <Row>
                      <Col>
                        <h3 class="styleText">9 - {t1("punkt")}</h3>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p style={{ fontSize: "14px" }}>
                          {t1("checkDaysNumber")} -{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {insectionbook?.contractorCheckDaysNumber}
                          </span>
                        </p>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col>
                  <Card className="p-2">
                    <Row>
                      <Col>
                        <h3 class="styleText">10 - {t1("punkt")}</h3>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p style={{ fontSize: "14px" }}>
                          {t1("requestedDocuments")} -{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {insectionbook?.requestedDocuments}
                          </span>
                        </p>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card className="p-2">
                    <Row>
                      <Col>
                        <h3 class="styleText">11 - {t1("punkt")}</h3>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p style={{ fontSize: "14px" }}>
                          {t1("takenMeasures")} -{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {insectionbook?.takenMeasures}
                          </span>
                        </p>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col>
                  <Card className="p-2">
                    <Row>
                      <Col>
                        <h3 class="styleText">12 - {t1("punkt")}</h3>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p style={{ fontSize: "14px" }}>
                          {t1("thirdPartyInfo")} -{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {insectionbook?.thirdPartyInfo}
                          </span>
                        </p>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col lg={12} md={12}>
                  <Card className="p-2">
                    <Row>
                      <Col>
                        <h3 class="styleText">{t1("Comment")}</h3>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p style={{ fontSize: "14px" }}>
                          {/* {t1("comment")} -{" "} */}
                          <span style={{ fontWeight: "bold" }}>
                            {insectionbook?.comment}
                          </span>
                        </p>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col lg={12} md={12}>
                  <Card className="p-2">
                    <Row>
                      <Col className="text-right">
                        <Button
                          style={{ marginBottom: "5px" }}
                          className="ml-1"
                          color="danger"
                          onClick={() => history.goBack()}
                        >
                          {" "}
                          {t1("back")}{" "}
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            ""
          )
        }
      </Overlay>
    );
  }
}
export default injectIntl(EditInspectionResult);
