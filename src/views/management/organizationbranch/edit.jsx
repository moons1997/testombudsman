import React from "react";
import { Card, Row, Col, FormGroup, Input, Button, Spinner } from "reactstrap";
import OrganizationService from "../../../services/management/organization.service";
import OrganizationBranchService from "../../../services/management/organizationbranch.service";
import CountryService from "../../../services/info/country.service";
import RegionService from "../../../services/info/region.service";
import DistrictService from "../../../services/info/district.service";
import Overlay from "../../../components/Webase/components/Overlay";
import ManualService from "../../../services/other/manual.service";
import Select from "react-select";
import BankService from "../../../services/info/bank.service";
import { Notification, Translate } from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
const { t1, t2 } = Translate;
const { errorToast, successToast } = Notification;
class EditOrganizationBranch extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.state = {
      organizationbranch: {},
      loading: false,
      SaveLoading: false,
      StateList: [],
      RegionList: [],
      CountryList: [],
      DistrictList: [],
      //   ParentList: [],
      OrganizationList: [],
      BankList: [],
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
    OrganizationBranchService.Get(this.props.match.params.id)
      .then((res) => {
        this.setState({ organizationbranch: res.data, loading: false });
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
    CountryService.GetAsSelectList().then((res) => {
      this.setState({ CountryList: res.data });
    });
    RegionService.GetAsSelectList(211).then((res) => {
      this.setState({ RegionList: res.data });
    });
    OrganizationService.GetAsSelectList().then((res) => {
      this.setState({ OrganizationList: res.data });
    });
    BankService.GetAsSelectList().then((res) => {
      this.setState({ BankList: res.data });
    });
  };
  handleChange(event, field, data) {
    var organizationbranch = this.state.organizationbranch;
    organizationbranch[field] = !!event.target
      ? event.target.value
      : data.value;
    this.setState({ organizationbranch: organizationbranch });
  }
  regionChange() {
    DistrictService.GetAsSelectList(
      this.state.organizationbranch.regionId
    ).then((res) => {
      this.setState({ DistrictList: res.data });
    });
  }
  //   organizationChange() {
  //     OrganizationBranchService.GetAsSelectList(
  //       this.state.organizationbranch.organizationId
  //     ).then((res) => {
  //       this.setState({ ParentList: res.data });
  //     });
  //   }
  SaveData = () => {
    this.setState({ SaveLoading: true });
    OrganizationBranchService.Update(this.state.organizationbranch)
      .then((res) => {
        this.setState({ SaveLoading: false });
        successToast(t2("SuccessSave", this.props.intl));

        setTimeout(() => {
          this.props.history.push("/management/organizationbranch");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ SaveLoading: false });
      });
  };

  render() {
    const {
      loading,
      SaveLoading,
      StateList,
      organizationbranch,
      CountryList,
      RegionList,
      DistrictList,
      //   ParentList,
      OrganizationList,
      BankList,
    } = this.state;
    const { history, intl } = this.props;
    //template
    return (
      <Overlay show={loading}>
        <Card className="p-2">
          <Row>
            <Col>
              <h1 style={{ fontWeight: "bold" }}>
                {" "}
                {t1("OrganizationBranch")}{" "}
              </h1>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("code")} </h5>
                <Input
                  type="text"
                  value={organizationbranch.code || ""}
                  onChange={(e) => this.handleChange(e, "code")}
                  id="code"
                  placeholder={t2("code", intl)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("shortname")} </h5>
                <Input
                  type="text"
                  value={organizationbranch.shortName || ""}
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
                  value={organizationbranch.fullName || ""}
                  onChange={(e) => this.handleChange(e, "fullName")}
                  id="fullName"
                  placeholder={t2("fullname", intl)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("Country")}</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{
                    text: organizationbranch.country || t2("Choose", intl),
                  }}
                  name="color"
                  options={CountryList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => this.handleChange(e, "countryId", e)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("Region")}</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{
                    text: organizationbranch.region || t2("Choose", intl),
                  }}
                  name="color"
                  options={RegionList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => {
                    this.handleChange(e, "regionId", e);
                    this.regionChange();
                  }}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("District")}</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{
                    text: organizationbranch.district || t2("Choose", intl),
                  }}
                  name="color"
                  options={DistrictList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => this.handleChange(e, "districtId", e)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("Organization")}</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{
                    text: organizationbranch.organization || t2("Choose", intl),
                  }}
                  name="color"
                  options={OrganizationList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => {
                    this.handleChange(e, "organizationId", e);
                    // this.organizationChange();
                  }}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("Bank")}</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{
                    text: organizationbranch.bank || t2("Choose", intl),
                  }}
                  name="color"
                  options={BankList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => this.handleChange(e, "bankId", e)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("BankCode")} </h5>
                <Input
                  type="text"
                  value={organizationbranch.bankCode || ""}
                  onChange={(e) => this.handleChange(e, "bankCode")}
                  id="bankCode"
                  placeholder={t2("bankCode", intl)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("Address")} </h5>
                <Input
                  type="text"
                  value={organizationbranch.address || ""}
                  onChange={(e) => this.handleChange(e, "address")}
                  id="address"
                  placeholder={t2("Address", intl)}
                />
              </FormGroup>
            </Col>
            {/* <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("Parent")}</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{
                    text: organizationbranch.parent || t2("Choose", intl),
                  }}
                  name="color"
                  options={ParentList}
                  label="text"
                  getOptionLabel={(item) => item.text}
                  onChange={(e) => this.handleChange(e, "parentId", e)}
                />
              </FormGroup>
            </Col> */}
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("state")}</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={{
                    text: organizationbranch.state || t2("Choose", intl),
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
                onClick={() => history.push("/management/organizationbranch")}
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
export default injectIntl(EditOrganizationBranch);
