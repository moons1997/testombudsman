import React from "react";
import { Card, Row, Col, FormGroup, Input, Button, Spinner } from "reactstrap";
import OrganFunctionService from "../../../services/info/organfunction.service";
import Overlay from "../../../components/Webase/components/Overlay";
import ManualService from "../../../services/other/manual.service";
import Select from "react-select";
import { Notification, Translate } from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
const { t1, t2 } = Translate;
const { errorToast, successToast } = Notification;
class EditOrganFunction extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.state = {
      organfunction: {},
      loading: false,
      SaveLoading: false,
      StateList: [],
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
    OrganFunctionService.Get(this.props.match.params.id)
      .then((res) => {
        this.setState({ organfunction: res.data, loading: false });
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
    var organfunction = this.state.organfunction;
    organfunction[field] = !!event.target ? event.target.value : data.value;
    this.setState({ organfunction: organfunction });
  }
  SaveData = () => {
    this.setState({ SaveLoading: true });
    OrganFunctionService.Update(this.state.organfunction)
      .then((res) => {
        this.setState({ SaveLoading: false });
        successToast(t2("SuccessSave", this.props.intl));

        setTimeout(() => {
          this.props.history.push("/info/organfunction");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ SaveLoading: false });
      });
  };

  render() {
    const { loading, SaveLoading, StateList, organfunction } = this.state;
    const { history, intl } = this.props;
    //template
    return (
      <Overlay show={loading}>
        <Card className="p-2">
          <Row>
            <Col>
              <h1 style={{ fontWeight: "bold" }}> {t1("OrganFunction")} </h1>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("code")} </h5>
                <Input
                  type="text"
                  value={organfunction.code || ""}
                  onChange={(e) => this.handleChange(e, "code")}
                  id="code"
                  placeholder={t2("code", intl)}
                />
              </FormGroup>
            </Col>
            {/* <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("orderCode")} </h5>
                <Input
                  type="text"
                  value={organfunction.orderCode || ""}
                  onChange={(e) => this.handleChange(e, "orderCode")}
                  id="orderCode"
                  placeholder={t2("orderCode", intl)}
                />
              </FormGroup>
            </Col> */}
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("shortname")} </h5>
                <Input
                  type="text"
                  value={organfunction.shortName || ""}
                  onChange={(e) => this.handleChange(e, "shortName")}
                  id="shortName"
                  placeholder={t2("shortname", intl)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("fullname")} </h5>
                <Input
                  type="text"
                  value={organfunction.fullName || ""}
                  onChange={(e) => this.handleChange(e, "fullName")}
                  id="fullName"
                  placeholder={t2("fullname", intl)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("normative")}</h5>
                <Input
                  type="text"
                  value={organfunction.normative || ""}
                  onChange={(e) => this.handleChange(e, "normative")}
                  id="normative"
                  placeholder={t2("normative", intl)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("state")}</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{
                    text: organfunction.state || t2("Choose", intl),
                  }}
                  name="color"
                  options={StateList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => this.handleChange(e, "stateId", e)}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                color="danger"
                onClick={() => history.push("/info/organfunction")}
              >
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
          </Row>
        </Card>
      </Overlay>
    );
  }
}
export default injectIntl(EditOrganFunction);
