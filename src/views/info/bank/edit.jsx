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
  FormFeedback,
} from "reactstrap";
import BankService from "../../../services/info/bank.service";
import Overlay from "../../../components/Webase/components/Overlay";
import ManualService from "../../../services/other/manual.service";
import Select from "react-select";
import { Notification, Translate } from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
import * as Icon from "react-feather";
const { t1, t2 } = Translate;
const { errorToast, successToast } = Notification;

class EditBank extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.state = {
      bank: {},
      loading: false,
      SaveLoading: false,
      StateList: [],
      languageList: [],
      faceTranslate: [],
      translates: {
        language: "",
        columnName: "",
        languageId: 0,
        translateText: "",
      },
      errors: {
        bankCode: null,
        bankName: null,
        stateId: null,
      },
    };
  }
  //Created
  componentDidMount() {
    this.GetDataLanguage();
    this.Refresh();
    this.GetDataList();
  }
  // methods
  Refresh = () => {
    this.setState({ loading: true });
    BankService.Get(this.props.match.params.id)
      .then((res) => {
        this.setState({ bank: res.data, loading: false });
      })
      .then(() => {
        // if (this.state.bank.translates.length == 0) {
        //   this.setState((prevState) => ({
        //     faceTranslate: this.state.languageList.map((item) => {
        //       return {
        //         language: item.fullName,
        //         columnName: "bank_name",
        //         languageId: item.value,
        //         translateText: "",
        //       };
        //     }),
        //   }));
        // } else {
        //   this.setState({ faceTranslate: this.state.bank.translates });
        // }

        if (this.state.bank.translates.length == 0) {
          this.setState((prevState) => ({
            bank: {
              ...prevState.bank,
              translates: this.state.languageList.map((item) => {
                return {
                  language: item.fullName,
                  columnName: "bank_name",
                  languageId: item.value,
                  translateText: "",
                };
              }),
            },
          }));
        } else {
          this.setState((prevState) => ({
            bank: {
              ...prevState.bank,
              translates: this.state.bank.translates,
            },
          }));
        }
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
  GetDataLanguage = () => {
    ManualService.LanguageSelectList().then((res) => {
      this.setState({ languageList: res.data });
    });
  };
  handleChange(event, field, data) {
    var bank = this.state.bank;
    if (!!event) {
      bank[field] = !!event.target ? event.target.value : data.value;
      if (field == "stateId") {
        bank.state = this.state.StateList.filter(
          (item) => item.value == data.value
        )[0].text;
      }
      this.setState({ bank: bank });
      this.validation(() => {});
    } else {
      if (field === "stateId") {
        bank.state = "";
        bank.stateId = null;
      }
      this.setState({ bank: bank });
    }
  }
  SaveData = () => {
    this.validation(() => {
      if (
        Object.values(this.state.errors).filter((item) => item == true)
          .length == 0
      ) {
        this.setState({ SaveLoading: true });
        BankService.Update(this.state.bank)
          .then((res) => {
            this.setState({ SaveLoading: false });
            successToast(t2("SuccessSave", this.props.intl));

            setTimeout(() => {
              this.props.history.push("/info/bank");
            }, 500);
          })
          .catch((error) => {
            errorToast(error.response.data);
            this.setState({ SaveLoading: false });
          });
      }
    });
  };
  changeTranslate(value, item) {
    const { bank, faceTranslate } = this.state;

    if (item.languageId == 1) {
      bank.bankName = value.target.value;
    }

    // this.setState({ faceTranslate: faceTranslate });
    bank.translates.map(function (el) {
      if (el.languageId == item.languageId) {
        el.translateText = value.target.value;
      }
    });
    this.setState({ bank: bank });
  }
  // modal
  state = {
    modal: false,
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  validation = (callback) => {
    var bank = this.state.bank;
    var errors = {
      bankCode: !!bank.bankCode ? false : true,
      stateId: !!bank.stateId ? false : true,
      bankName: !!bank.bankName ? false : true,
    };
    this.setState({ errors: errors }, () => callback());
  };
  render() {
    const {
      loading,
      SaveLoading,
      StateList,
      bank,
      modal,
      faceTranslate,
      errors,
    } = this.state;
    const { history, intl } = this.props;
    //template
    return (
      <Overlay show={loading}>
        <Modal isOpen={modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}></ModalHeader>
          <ModalBody>
            {/* {faceTranslate?.map((item, index) => (
              <FormGroup key={index}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    {item.language}
                  </InputGroupAddon>
                  <Input
                    type="text"
                    value={item.translateText || ""}
                    onChange={(e) => this.changeTranslate(e, item)}
                    id={item.languageId}
                    // placeholder={t2("bankName", intl)}
                  />
                </InputGroup>
              </FormGroup>
            ))} */}
            {bank.translates?.map((item, index) => (
              <FormGroup key={index}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    {item.language}
                  </InputGroupAddon>
                  <Input
                    type="text"
                    value={item.translateText || ""}
                    onChange={(e) => this.changeTranslate(e, item)}
                    id={item.languageId}
                  />
                </InputGroup>
              </FormGroup>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                this.toggleModal();
              }}
            >
              {t1("back")}
            </Button>{" "}
          </ModalFooter>
          {/* <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                this.toggleModal();
                this.setState((prevState) => ({
                  bank: {
                    ...prevState.bank,
                    translates: this.state.faceTranslate,
                  },
                }));
              }}
            >
              Accept
            </Button>{" "}
          </ModalFooter> */}
        </Modal>
        <Card className="p-2">
          <Row>
            <Col className="text-center mb-1">
              <h1 className="pageTextView"> {t1("Bank")} </h1>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("bankCode")} </h5>
                <Input
                  type="text"
                  value={bank.bankCode || ""}
                  onChange={(e) => this.handleChange(e, "bankCode")}
                  id="bankCode"
                  placeholder={t2("bankCode", intl)}
                  invalid={errors.bankCode}
                />
                <FormFeedback>
                  {t2("bankCodeValidation", this.props.intl)}
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("bankName")} </h5>

                <InputGroup>
                  <Input
                    type="text"
                    value={bank.bankName || ""}
                    onChange={(e) => this.handleChange(e, "bankName")}
                    id="bankName"
                    placeholder={t2("bankName", intl)}
                    disabled
                    invalid={errors.bankName}
                  />

                  <InputGroupAddon addonType="append">
                    <Button color="primary" onClick={this.toggleModal}>
                      <Icon.Globe id={"translate"} size={16} />
                    </Button>
                  </InputGroupAddon>
                  <FormFeedback>
                    {t2("bankNameValidation", this.props.intl)}
                  </FormFeedback>
                </InputGroup>
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
                    defaultValue={{ text: bank.state || t2("Choose", intl) }}
                    value={{ text: bank.state || t2("Choose", intl) }}
                    name="color"
                    isClearable
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
                onClick={() => history.push("/info/bank")}
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
export default injectIntl(EditBank);
