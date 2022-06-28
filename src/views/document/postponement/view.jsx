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
  Table,
  Nav,
  Form,
  NavItem,
  NavLink,
  CardHeader,
  CardTitle,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  UncontrolledTooltip,
  InputGroupAddon,
  InputGroup,
} from "reactstrap";
import Select from "react-select";
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
import HtmlReportService from "../../../services/reports/HtmlReport.service";
import RequestPostponementService from "../../../services/document/requestpostponement.service";
import RejectionReasonService from "../../../services/info/rejectionreason.service";
import axios from "axios";
import AppSettings from "../../../components/Webase/components/settings.json";
import DatePicker, { registerLocale } from "react-datepicker";
import MaskedTextInput from "react-text-mask";
import EIMZOClient, {
  dates,
} from "../../../components/Webase/components/e-imzo-client";
import {
  isAgree,
  isArchive,
  isReject,
  isReturnToModerator,
  isSend,
  isToAgree,
  isToReject,
  isDownloadStatus,
} from "../../../components/Webase/functions/RequestStatus";
import { Editor } from "@tinymce/tinymce-react";
import style from "../inspectionbook/style.css";
import SERTIFICATEIMG from "../../../assets/img/sertificate.webp";
const { t1, t2 } = Translate;
const { can } = Permission;
const { errorToast, successToast, customErrorToast } = Notification;
var EIMZO_MAJOR = 3;
var EIMZO_MINOR = 37;
const errorCAPIWS =
  "Ошибка соединения с E-IMZO. Возможно у вас не установлен модуль E-IMZO или Браузер E-IMZO.";
const errorBrowserWS =
  "Браузер не поддерживает технологию WebSocket. Установите последнюю версию браузера.";
const errorUpdateApp =
  'ВНИМАНИЕ !!! Установите новую версию приложения E-IMZO или Браузера E-IMZO.<br /><a href="https://e-imzo.uz/main/downloads/" role="button">Скачать ПО E-IMZO</a>';
const errorWrongPassword = "Пароль неверный.";
class EditRequest extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      request: {
        contractor: {},
      },
      requestpostponement: { contractor: {} },
      loading: false,
      loadingPostponement: false,
      SaveLoading: false,
      activeTab: "1",
      activeTabFile: "1",
      histories: [],
      activeModal: "",
      SendLoading: false,
      ToRejectLoading: false,
      ToAgreeLoading: false,
      ArchiveLoading: false,
      ReturnToModeratorLoading: false,
      RejectLoading: false,
      ArchiveLoading: false,
      AgreeLoading: false,
      send: {},
      toReject: {},
      toAgree: {},
      returnToModerator: {},
      reject: {},
      agree: {},
      archive: {},
      RejectList: [],
      keysList: [],
      dataToSignIfNot: null,
      publicPath: process.env.BASE_URL,
      Invoice: {},
      pkcs7: null,
      signByImzoText: null,
      vo: null,
      alertMessage: null,
      showMessage: false,
      currentAlertCounter: 5,
      loading: false,
      currentItem: null,
      modalTitle: null,
      loadingButton: false,
      AppSettings: AppSettings,
      agreeEimzoLoad: true,
      rejectEimzoLoad: true,
      lang: "uz-cyrl",
      DownloadReportPdfLoading: false,
      LetterEditableContent: {},
      PrewToRejectLetter: {},
      GetToRejectLetterContent: {},
      GetToAgreeLetterContent: {},
      PrewToAgreeLetter: {},
      PrewToRejectLetterLoading: false,
      EditToRejectLetteLoading: false,
      CancelAgreementLoading: false,
      PrewToAgreeLetterLoading: false,
      EditToAgreeLetterLoading: false,
      modalLetter: false,
      dataToSign: {
        default: null,
      },
      serialNumberLocalStorage: localStorage.getItem("key"),
    };
  }
  //Created
  componentDidMount() {
    this.Refresh();
    this.GetDataList();
    // this.setState({ loading: true });
    // if (can("RequestAgree")) {
    //   this.appLoad();
    // }
    // this.setState({ loading: false });
  }
  // method
  appLoad() {
    let vm = this;
    this.setState({ loading: true });
    EIMZOClient.API_KEYS = AppSettings.api_keys;
    EIMZOClient.checkVersion(
      function (major, minor) {
        var newVersion = EIMZO_MAJOR * 100 + EIMZO_MINOR;
        var installedVersion = parseInt(major) * 100 + parseInt(minor);
        if (installedVersion < newVersion) {
          this.setState({ loading: false });
          customErrorToast(errorUpdateApp);
          // vm.uiShowMessage(errorUpdateApp, vm.$t("actions.error"), "danger");
          alert("sad");
        } else {
          EIMZOClient.installApiKeys(
            function () {
              vm.setState({ loading: false });
              vm.uiLoadKeys();
            },
            function (e, r) {
              vm.setState({ loading: false });
              if (r) {
                customErrorToast(r);
                // vm.uiShowMessage(r, vm.$t("actions.error"), "danger");
              } else {
                customErrorToast(e);
                // vm.wsError(e, vm.$t("actions.error"), "danger");
              }
            }
          );
        }
      },
      function (e, r) {
        vm.setState({ loading: false });
        if (r) {
          customErrorToast(r);
          // vm.uiShowMessage(r, vm.$t("actions.error"), "danger");
          // alert("asdsd");
        } else {
          customErrorToast(e);
          // vm.uiShowMessage(e, vm.$t("actions.error"), "danger");
          // alert("asdsd");
        }
      }
    );
  }
  signByEimzoReject(data2) {
    if (
      this.state.currentItem.serialNumber == this.state.serialNumberLocalStorage
    ) {
      let signDataLocalStorage = localStorage.getItem("signData");
      this.setState(
        (prevState) => ({
          reject: {
            ...prevState.reject,
            signData: signDataLocalStorage,
            inn: this.state.currentItem.TIN,
          },
          rejectEimzoLoad: false,
        }),
        () => {
          this.RejectFunction();
        }
      );
    } else {
      this.setState({ loadingButton: true });
      let vm = this;
      var data = JSON.stringify(
        this.state.dataToSign
          ? this.state.dataToSign
          : this.sate.dataToSignIfNot
      );
      const promise = new Promise((resolve, reject) => {
        EIMZOClient.loadKey(
          vm.state.currentItem,
          function (id) {
            EIMZOClient.createPkcs7(
              id,
              data,
              "",
              function (pkcs7) {
                resolve(pkcs7);
              },
              function (e, r) {
                reject("error");
                vm.setState({ loadingButton: false });
                if (r) {
                  if (r.indexOf("BadPaddingException") != -1) {
                    // vm.uiShowMessage(
                    //   errorWrongPassword,
                    //   vm.$t("actions.error"),
                    //   "danger"
                    // );
                    customErrorToast(errorWrongPassword);
                  } else {
                    // vm.uiShowMessage(r, vm.$t("actions.error"), "danger");
                    customErrorToast(r);
                  }
                } else {
                  document.getElementById("keyId").innerHTML = "";
                  // vm.uiShowMessage(
                  //   errorBrowserWS,
                  //   vm.$t("actions.error"),
                  //   "danger"
                  // );
                  customErrorToast(errorBrowserWS);
                }
                if (e) vm.wsError(e);
              }
            );
          },
          function (e, r) {
            reject("error");
            vm.setState({ loadingButton: false });
            if (r) {
              if (r.indexOf("BadPaddingException") != -1) {
                // vm.uiShowMessage(
                //   errorWrongPassword,
                //   vm.$t("actions.error"),
                //   "danger"
                // );
                customErrorToast(errorWrongPassword);
              } else {
                // vm.uiShowMessage(r, vm.$t("actions.error"), "danger");
                customErrorToast(r);
              }
            } else {
              // vm.uiShowMessage(errorBrowserWS, vm.$t("actions.error"), "danger");
              customErrorToast(errorBrowserWS);
            }
            if (e) vm.wsError(e);
          }
        );
      });
      promise
        .then(
          (success) => {
            this.setState((prevState) => ({
              reject: {
                ...prevState.reject,
                signData: success,
                inn: this.state.currentItem.TIN,
              },
              rejectEimzoLoad: false,
            }));
            this.RejectFunction();
            // successToast(t2("SuccessSave", this.props.intl));
            // vm.$emit("sign", { key: success, data: this.currentItem });
          },
          (error) => {
            // vm.uiShowMessage(
            //   vm.$t("actions.messages.server_error"),
            //   vm.$t("actions.error"),
            //   "danger"
            // );
            console.log(error);
            customErrorToast("server_error");
          }
        )
        .finally(() => {
          // vm.signModal = false;
          vm.setState({ loadingButton: false });
        });
    }
  }
  signByEimzo(data2) {
    if (
      this.state.currentItem.serialNumber == this.state.serialNumberLocalStorage
    ) {
      let signDataLocalStorage = localStorage.getItem("signData");
      this.setState(
        (prevState) => ({
          agree: {
            ...prevState.agree,
            signData: signDataLocalStorage,
            inn: this.state.currentItem.TIN,
          },
          agreeEimzoLoad: false,
        }),
        () => {
          this.AgreeFunction();
        }
      );
    } else {
      this.setState({ loadingButton: true });
      let vm = this;
      var data = JSON.stringify(
        this.state.dataToSign
          ? this.state.dataToSign
          : this.sate.dataToSignIfNot
      );
      console.log(data);
      const promise = new Promise((resolve, reject) => {
        EIMZOClient.loadKey(
          vm.state.currentItem,
          function (id) {
            EIMZOClient.createPkcs7(
              id,
              data,
              "",
              function (pkcs7) {
                resolve(pkcs7);
              },
              function (e, r) {
                reject("error");
                vm.setState({ loadingButton: false });
                if (r) {
                  if (r.indexOf("BadPaddingException") != -1) {
                    // vm.uiShowMessage(
                    //   errorWrongPassword,
                    //   vm.$t("actions.error"),
                    //   "danger"
                    // );
                    customErrorToast(errorWrongPassword);
                  } else {
                    // vm.uiShowMessage(r, vm.$t("actions.error"), "danger");
                    customErrorToast(r);
                  }
                } else {
                  document.getElementById("keyId").innerHTML = "";
                  // vm.uiShowMessage(
                  //   errorBrowserWS,
                  //   vm.$t("actions.error"),
                  //   "danger"
                  // );
                  customErrorToast(errorBrowserWS);
                }
                if (e) vm.wsError(e);
              }
            );
          },
          function (e, r) {
            reject("error");
            vm.setState({ loadingButton: false });
            if (r) {
              if (r.indexOf("BadPaddingException") != -1) {
                // vm.uiShowMessage(
                //   errorWrongPassword,
                //   vm.$t("actions.error"),
                //   "danger"
                // );
                customErrorToast(errorWrongPassword);
              } else {
                // vm.uiShowMessage(r, vm.$t("actions.error"), "danger");
                customErrorToast(r);
              }
            } else {
              // vm.uiShowMessage(errorBrowserWS, vm.$t("actions.error"), "danger");
              customErrorToast(errorBrowserWS);
            }
            if (e) vm.wsError(e);
          }
        );
      });
      promise
        .then(
          (success) => {
            this.setState((prevState) => ({
              agree: {
                ...prevState.agree,
                signData: success,
                inn: this.state.currentItem.TIN,
              },
              agreeEimzoLoad: false,
            }));
            localStorage.setItem("key", this.state.currentItem.serialNumber);
            localStorage.setItem("signData", success);
            this.AgreeFunction();
            // successToast(t2("SuccessSave", this.props.intl));
            // vm.$emit("sign", { key: success, data: this.currentItem });
          },
          (error) => {
            // vm.uiShowMessage(
            //   vm.$t("actions.messages.server_error"),
            //   vm.$t("actions.error"),
            //   "danger"
            // );
            customErrorToast("server_error");
          }
        )
        .finally(() => {
          // vm.signModal = false;
          vm.setState({ loadingButton: false });
        });
    }
  }
  uiCreateItem(itmkey, vo) {
    var now = new Date();
    vo.expired = dates.compare(now, vo.validTo) > 0;
    var itm = document.createElement("option");
    itm.value = itmkey;
    itm.text = vo.CN;
    if (!vo.expired) {
    } else {
      itm.style.color = "gray";
      itm.text = itm.text + " (срок истек)";
    }
    this.state.keysList.push(vo);
    itm.setAttribute("vo", JSON.stringify(vo));
    itm.setAttribute("id", itmkey);
    return itm;
  }
  async uiLoadKeys() {
    let vm = this;
    EIMZOClient.listAllUserKeys(
      function (o, i) {
        var itemId = "itm-" + o.serialNumber + "-" + i;
        return itemId;
      },
      function (itemId, v) {
        return vm.uiCreateItem(itemId, v);
      },
      function (items, firstId) {
        //vm.uiFillCombo(items);
        //vm.uiComboSelect(firstId);
      },
      function (e, r) {
        // vm.uiShowMessage(errorCAPIWS, vm.$t("actions.error"), "danger");
        customErrorToast(errorCAPIWS);
      }
    );
  }
  async getImzo() {
    let vm = this.state;
    EIMZOClient.installApiKeys(
      function () {
        vm.uiLoadKeys();
      },
      function (e, r) {
        if (r) {
          // vm.uiShowMessage(r, vm.$t('actions.error'), 'danger');
          customErrorToast(r);
        } else {
          // vm.wsError(e);
          customErrorToast(e);
        }
      }
    );
  }
  getDateFormat(date) {
    let data = new Date(date);
    let month = data.getMonth() + 1;
    return (
      data.getDate().toString() +
      "." +
      (month <= 9 ? "0" + month : month).toString() +
      "." +
      data.getFullYear().toString()
    );
  }
  async wsError(e) {
    if (e) {
      // this.uiShowMessage('errorCAPIWS' + " : " + e, this.$t('actions.error'), 'danger');
      customErrorToast("errorCAPIWS" + " : " + e);
    } else {
      // this.uiShowMessage('errorBrowserWS', this.$t('actions.error'), 'danger');
      customErrorToast("errorBrowserWS");
    }
  }
  uiComboSelect(itm) {
    if (itm) {
      var id = document.getElementById(itm);
      id.setAttribute("selected", "true");
    }
  }

  cbChanged(c) {
    document.getElementById("keyId").innerHTML = "";
  }
  uiClearCombo() {
    var combo = document.getElementById("user_eimzo_keys");
    combo.length = 0;
  }

  uiFillCombo(items) {
    var combo = document.getElementById("user_eimzo_keys");
    this.itemList = items;
  }
  //e-imzo--------------------

  Refresh = () => {
    this.setState({ loadingPostponement: true });
    // if (this.props.match.params.id == 0) {
    //   RequestPostponementService.GetByRequestId(this.props.match.params.id)
    //     .then((res) => {
    //       this.setState({
    //         requestpostponement: res.data,
    //         loadingPostponement: false,
    //       });
    //     })
    //     .catch((error) => {
    //       this.setState({ loadingPostponement: false });
    //       errorToast(error.response.data);
    //     });
    // }
    // if (this.props.match.params.id != 0) {
    //   RequestPostponementService.Get(this.props.match.params.id)
    //     .then((res) => {
    //       this.setState({
    //         requestpostponement: res.data,
    //         loadingPostponement: false,
    //       });
    //     })
    //     .catch((error) => {
    //       this.setState({ loadingPostponement: false });
    //       errorToast(error.response.data);
    //     });
    // }
    if (
      !!this.props.location.state &&
      this.props.location.state.postponementBtn
    ) {
      RequestPostponementService.GetByRequestId(this.props.match.params.id)
        .then((res) => {
          this.setState({
            requestpostponement: res.data,
            loadingPostponement: false,
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
            loadingPostponement: false,
          });
        })
        .catch((error) => {
          this.setState({ loadingPostponement: false });
          errorToast(error.response.data);
        });
    }
  };

  GetDataList = () => {
    RequestPostponementService.GetHistoryList(
      {},
      this.props.match.params.id
    ).then((res) => {
      this.setState({ histories: res.data.rows });
    });
    RejectionReasonService.GetAsSelectList().then((res) => {
      this.setState({ RejectList: res.data });
    });
  };
  DownloadRequestPostponementPdf = (id) => {
    this.setState({ DownloadReportPdfLoading: true });
    HtmlReportService.DownloadRequestPostponementPdf(
      this.state.request.answerLetterId,
      this.state.lang
    )
      .then((res) => {
        this.setState({ DownloadReportPdfLoading: false });
        successToast(t2("DownloadSuccess", this.props.intl));
        // this.forceFileDownload(res, this.props.match.params.id, "");
        window.open(
          `${axios.defaults.baseURL}/report/DownloadRequestPostponementPdf/${id}?__lang=${this.state.lang}`
        );
        // this.props.history.push();
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ DownloadReportPdfLoading: false });
      });
  };

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
  toggleTabFile(tab) {
    if (this.state.activeTabFile !== tab) {
      this.setState({
        activeTabFile: tab,
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

  handleChangeFile = (file, field) => {
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
  //   DeleteFile = (item, index, field) => {
  //     RequestService.DeleteFile(item.id)
  //       .then((res) => {
  //         successToast(t2("DeleteSuccess", this.props.intl));
  //         const { request } = this.state;
  //         request.basicFiles.splice(index, 1);
  //         this.setState({ request: request });
  //       })
  //       .catch((error) => {
  //         errorToast(error.response.data);
  //       });
  //   };
  getColor = (id) => {
    switch (id) {
      case 1:
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
  getAlertColor = (id) => {
    switch (id) {
      case 1:
        return "info";
        break;
      case 12:
        return "info";
        break;
      default:
        return "info";
        break;
    }
  };
  SaveDataRePost = () => {
    this.setState({ SaveLoading: true });
    RequestPostponementService.Update(this.state.requestpostponement)
      .then((res) => {
        this.setState({ SaveLoading: false });
        successToast(t2("SuccessSave", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/postponement");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ SaveLoading: false });
      });
  };

  toggleModal = (name) => {
    this.setState({ activeModal: name });
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
    // this.state.receive.id = this.state.request.id;
  };
  handleChangeTextArr(event, field, state, data) {
    if (state === "send") {
      var send = this.state.send;
      send[field] = !!event.target ? event.target.value : data.value;
      // this.state.send.id = this.state.requestpostponement.requestId;
      this.setState({ send });
    }
    if (state === "ToReject") {
      var toReject = this.state.toReject;
      toReject[field] = !!event.target ? event.target.value : data.value;
      // this.state.toReject.id = this.state.requestpostponement.requestId;
      this.setState({ toReject });
    }
    if (state === "ToAgree") {
      var toAgree = this.state.toAgree;
      toAgree[field] = !!event.target ? event.target.value : data.value;
      // this.state.toAgree.id = this.state.requestpostponement.requestId;
      this.setState({ toAgree });
    }
    if (state === "ReturnToModerator") {
      var returnToModerator = this.state.returnToModerator;
      returnToModerator[field] = !!event.target
        ? event.target.value
        : data.value;
      // this.state.returnToModerator.id =
      //   this.state.requestpostponement.requestId;
      this.setState({ returnToModerator });
    }
    if (state === "Reject") {
      var reject = this.state.reject;
      reject[field] = !!event.target ? event.target.value : data.value;
      // this.state.reject.id = this.state.requestpostponement.requestId;
      this.setState({ reject });
    }
    if (state === "Agree") {
      var agree = this.state.agree;
      agree[field] = !!event.target ? event.target.value : data.value;
      // this.state.agree.id = this.state.requestpostponement.requestId;
      this.setState({ agree });
    }
    if (state === "Archive") {
      var archive = this.state.archive;
      archive[field] = !!event.target ? event.target.value : data.value;
      // this.state.archive.id = this.state.requestpostponement.requestId;
      this.setState({ archive });
    }
  }
  SendFunction = () => {
    this.setState({ SendLoading: true });
    RequestPostponementService.Send(this.state.send)
      .then((res) => {
        this.setState({ SendLoading: false });
        successToast(t2("SuccessSend", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/postponement");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ SendLoading: false });
      });
    this.setState({ modal: false });
  };
  ToRejectFunction = () => {
    this.setState({ ToRejectLoading: true });
    RequestPostponementService.ToReject(this.state.toReject)
      .then((res) => {
        this.setState({ ToRejectLoading: false });
        successToast(t2("SuccessToReject", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/postponement");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ ToRejectLoading: false });
      });
    this.setState({ modal: false });
  };
  ToAgreeFunction = () => {
    this.setState({ ToAgreeLoading: true });
    RequestPostponementService.ToAgree(this.state.toAgree)
      .then((res) => {
        this.setState({ ToAgreeLoading: false });
        successToast(t2("SuccessToAgree", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/postponement");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ ToAgreeLoading: false });
      });
    this.setState({ modal: false });
  };
  RevokeFunction = () => {
    this.setState({ RevokeLoading: true });
    RequestPostponementService.Revoke(this.state.revoke)
      .then((res) => {
        this.setState({ RevokeLoading: false });
        successToast(t2("SuccessRevoke", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/postponement");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ RevokeLoading: false });
      });
    this.setState({ modal: false });
  };
  RefuseByModeratorFunction = () => {
    this.setState({ RefuseByModeratorLoading: true });
    RequestPostponementService.RefuseByModerator(this.state.refusebymoderator)
      .then((res) => {
        this.setState({ RefuseByModeratorLoading: false });
        successToast(t2("SuccessRefuseByModerator", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/postponement");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ RefuseByModeratorLoading: false });
      });
    this.setState({ modal: false });
  };

  ToApproveFunction = () => {
    this.setState({ ToApproveLoading: true });
    RequestPostponementService.ToApprove(this.state.toapprove)
      .then((res) => {
        this.setState({ ToApproveLoading: false });
        successToast(t2("SuccessToApprove", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/postponement");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ ToApproveLoading: false });
      });
    this.setState({ modal: false });
  };
  ReturnToModeratorFunction = () => {
    this.setState({ ReturnToModeratorLoading: true });
    RequestPostponementService.ReturnToModerator(this.state.returnToModerator)
      .then((res) => {
        this.setState({ ReturnToModeratorLoading: false });
        successToast(t2("SuccessReturnToModerator", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/postponement");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ ReturnToModeratorLoading: false });
      });
    this.setState({ modal: false });
  };
  RejectFunction = () => {
    this.setState({ RejectLoading: true });
    RequestPostponementService.Reject(this.state.reject)
      .then((res) => {
        this.setState({ RejectLoading: false });
        successToast(t2("SuccessReject", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/postponement");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ RejectLoading: false });
      });
    this.setState({ modal: false });
  };
  AgreeFunction = () => {
    this.setState({ AgreeLoading: true });
    RequestPostponementService.Agree(this.state.agree)
      .then((res) => {
        this.setState({ AgreeLoading: false });
        successToast(t2("SuccessAgree", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/postponement");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ AgreeLoading: false });
      });
    this.setState({ modal: false });
  };
  ArchiveFunction = () => {
    this.setState({ ArchiveLoading: true });
    RequestPostponementService.Archive(this.state.archive)
      .then((res) => {
        this.setState({ ArchiveLoading: false });
        successToast(t2("SuccessArchive", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/postponement");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ ArchiveLoading: false });
      });
    this.setState({ modal: false });
  };
  DownloadFilePost = (item, index, field) => {
    this.setState({ downloadLoad: { check: true, id: item.id } });
    RequestPostponementService.DownloadFile(item.id)
      .then((res) => {
        this.setState({ downloadLoad: { check: false, id: item.id } });
        successToast(t2("DownloadSuccess", this.props.intl));
        this.forceFileDownload(res, item.id, item.fileName);
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
  };
  forceFileDownload(response, name, attachfilename) {
    var blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    let format = attachfilename.split(".");
    const link = document.createElement("a");
    link.href = url;
    if (format.length > 0) {
      link.setAttribute(
        "download",
        format[0] + "." + format[format.length - 1]
      );
    }
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }
  onEditorStateChangeShort = (editorState) => {
    const { GetToRejectLetterContent } = this.state;
    GetToRejectLetterContent.letterEditableContent = editorState;

    this.setState({ GetToRejectLetterContent });
  };
  onEditorStateChangeShortAgree = (editorState) => {
    const { GetToAgreeLetterContent } = this.state;
    GetToAgreeLetterContent.letterEditableContent = editorState;

    this.setState({ GetToAgreeLetterContent });
  };
  testOnChange(e) {
    const { GetToRejectLetterContent } = this.state;
    GetToRejectLetterContent.letterEditableContent = e.target.getContent();

    this.setState({ GetToRejectLetterContent });
  }
  agreeOnChange(e) {
    const { GetToAgreeLetterContent } = this.state;
    GetToAgreeLetterContent.letterEditableContent = e.target.getContent();

    this.setState({ GetToAgreeLetterContent });
  }
  PrewToAgreeLetter = () => {
    if (!this.CheckToAgree()) {
      return false;
    }
    this.setState({ PrewToAgreeLetterLoading: true });
    RequestPostponementService.PrewToAgreeLetter(this.state.toAgree)
      .then((res) => {
        this.setState({
          PrewToAgreeLetter: res.data,
          PrewToAgreeLetterLoading: false,
        });
        // successToast(t2("SuccessToReject", this.props.intl));
        setTimeout(() => {
          // this.props.history.push("/document/request");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ PrewToAgreeLetterLoading: false });
      });
    // this.setState({ modal: false });
  };
  EditToAgreeLetter = () => {
    if (!this.CheckToAgree()) {
      return false;
    }
    this.setState({ EditToAgreeLetterLoading: true });
    RequestPostponementService.GetToAgreeLetterContent(this.state.toAgree)
      .then((res) => {
        this.setState({
          GetToAgreeLetterContent: res.data,
          EditToAgreeLetterLoading: false,
        });
        // successToast(t2("SuccessToReject", this.props.intl));
        setTimeout(() => {
          // this.props.history.push("/document/request");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ EditToAgreeLetterLoading: false });
      });
    this.toggleModalLetter();
  };
  EditToRejectLette = () => {
    if (!this.CheckToReject()) {
      return false;
    }
    this.setState({ EditToRejectLetteLoading: true });
    RequestPostponementService.GetToRejectLetterContent(this.state.toReject)
      .then((res) => {
        this.setState({
          GetToRejectLetterContent: res.data,
          EditToRejectLetteLoading: false,
        });
        // successToast(t2("SuccessToReject", this.props.intl));
        setTimeout(() => {
          // this.props.history.push("/document/request");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ EditToRejectLetteLoading: false });
      });
    this.toggleModalLetter();
  };
  PrewToRejectLetter = () => {
    if (!this.CheckToReject()) {
      return false;
    }
    this.setState({ PrewToRejectLetterLoading: true });
    RequestPostponementService.PrewToRejectLetter(this.state.toReject)
      .then((res) => {
        this.setState({
          PrewToRejectLetter: res.data,
          PrewToRejectLetterLoading: false,
        });
        // successToast(t2("SuccessToReject", this.props.intl));
        setTimeout(() => {
          // this.props.history.push("/document/request");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ PrewToRejectLetterLoading: false });
      });
    // this.setState({ modal: false });
  };
  ToRejectFunctionLetter = () => {
    if (!this.CheckToReject()) {
      return false;
    }
    this.setState({ ToRejectLoading: true });
    RequestPostponementService.PrewToRejectLetter(this.state.toReject)
      .then((res) => {
        this.setState({ ToRejectLoading: false });
        this.PrewToRejectLetter();
        // successToast(t2("SuccessToReject", this.props.intl));
        setTimeout(() => {
          // this.props.history.push("/document/request");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ ToRejectLoading: false });
      });
    this.setState({ modalLetter: false });
  };
  toggleModalLetter = () => {
    this.setState((prevState) => ({
      modalLetter: !prevState.modalLetter,
    }));
  };
  CheckToReject() {
    if (
      this.state.toReject.rejectionReasons?.length === 0 ||
      !this.state.toReject.rejectionReasons
    ) {
      customErrorToast(t2("enterrejectionReasons", this.props.intl));
      return false;
    }
    if (
      this.state.toReject.letterDate === 0 ||
      this.state.toReject.letterDate === null ||
      this.state.toReject.letterDate === "" ||
      this.state.toReject.letterDate === undefined
    ) {
      customErrorToast(t2("enterLetterDate", this.props.intl));
      return false;
    }

    return true;
  }
  CheckToAgree() {
    // if (
    //   this.state.toAgree.agreedCheckDaysNumber === 0 ||
    //   this.state.toAgree.agreedCheckDaysNumber === null ||
    //   this.state.toAgree.agreedCheckDaysNumber === "" ||
    //   this.state.toAgree.agreedCheckDaysNumber === undefined
    // ) {
    //   customErrorToast(t2("enteragreedCheckDaysNumber", this.props.intl));
    //   return false;
    // }
    if (
      this.state.toAgree.letterDate === 0 ||
      this.state.toAgree.letterDate === null ||
      this.state.toAgree.letterDate === "" ||
      this.state.toAgree.letterDate === undefined
    ) {
      customErrorToast(t2("enterLetterDate", this.props.intl));
      return false;
    }

    return true;
  }
  render() {
    const {
      loading,
      SaveLoading,
      requestpostponement,
      histories,
      send,
      toReject,
      toAgree,
      returnToModerator,
      reject,
      agree,
      archive,
      RejectList,
      SendLoading,
      ToRejectLoading,
      ToAgreeLoading,
      ReturnToModeratorLoading,
      RejectLoading,
      AgreeLoading,
      ArchiveLoading,
      DownloadReportPdfLoading,
      PrewToRejectLetter,
      EditToRejectLetteLoading,
      PrewToRejectLetterLoading,
      PrewToAgreeLetterLoading,
      EditToAgreeLetterLoading,
      PrewToAgreeLetter,
    } = this.state;
    const { history, intl } = this.props;
    //template
    return (
      <Overlay show={loading}>
        <Modal
          centered={true}
          autoFocus={true}
          backdrop="static"
          isOpen={this.state.modalLetter}
          toggle={this.toggleModalLetter}
          className="modal-lg"
        >
          <ModalHeader toggle={this.toggleModalLetter}>
            {t1("LetterEditableContent")}
          </ModalHeader>
          <ModalBody>
            {this.state.activeModalInner === "EditRejectLetter" ? (
              <>
                <div data-text-editor="form-editor">
                  <Editor
                    // onInit={(e) => this.onEditorStateChangeShort(e)}
                    onChange={this.testOnChange}
                    // onChange={(e) => this.onEditorStateChangeShort(e)}
                    initialValue={
                      this.state.GetToRejectLetterContent.letterEditableContent
                    }
                    init={{
                      height: 800,
                      menubar: true,
                      plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste code help wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | " +
                        "bold italic backcolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                  />
                </div>
              </>
            ) : (
              ""
            )}
            {this.state.activeModalInner === "EditAgreeLetter" ? (
              <>
                <Editor
                  // onInit={(e) => this.onEditorStateChangeShort(e)}
                  onChange={this.agreeOnChange}
                  // onChange={(e) => this.onEditorStateChangeShort(e)}
                  initialValue={
                    this.state.GetToAgreeLetterContent.letterEditableContent
                  }
                  init={{
                    height: 800,
                    menubar: true,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | " +
                      "bold italic backcolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                />
              </>
            ) : (
              ""
            )}
          </ModalBody>
          <ModalFooter>
            {this.state.activeModalInner === "EditAgreeLetter" ? (
              <>
                {" "}
                <Button
                  color={"primary"}
                  onClick={() => {
                    this.toggleModalLetter();
                    this.setState(
                      (prevState) => ({
                        toAgree: {
                          ...prevState.toAgree,
                          letterEditableContent:
                            this.state.GetToAgreeLetterContent
                              .letterEditableContent,
                        },
                      }),
                      () => this.ToAgreeFunctionLetter()
                    );
                  }}
                >
                  {t1("Save")}
                </Button>
              </>
            ) : (
              ""
            )}
            {this.state.activeModalInner === "EditRejectLetter" ? (
              <>
                {" "}
                <Button
                  color={"primary"}
                  onClick={() => {
                    this.toggleModalLetter();
                    this.setState(
                      (prevState) => ({
                        toReject: {
                          ...prevState.toReject,
                          letterEditableContent:
                            this.state.GetToRejectLetterContent
                              .letterEditableContent,
                        },
                      }),
                      () => this.ToRejectFunctionLetter()
                    );
                  }}
                >
                  {t1("Save")}
                </Button>
              </>
            ) : (
              ""
            )}
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggleModal}
          className={this.props.className}
          size="lg"
        >
          <ModalHeader>
            {this.state.activeModal === "Receive" && t1("Receive", intl)}
            {this.state.activeModal === "Send" && t1("Send", intl)}
            {this.state.activeModal === "ToReject" && t1("ToReject", intl)}
            {this.state.activeModal === "ToAgree" && t1("ToAgree", intl)}
            {this.state.activeModal === "Revoke" && t1("Revoke", intl)}
            {this.state.activeModal === "RefuseByModerator" &&
              t1("RefuseByModerator", intl)}
            {this.state.activeModal === "ToApprove" && t1("ToApprove", intl)}
            {this.state.activeModal === "ReturnToModerator" &&
              t1("ReturnToModerator", intl)}
            {this.state.activeModal === "Reject" && t1("Reject", intl)}
            {this.state.activeModal === "Agree" && t1("Agree", intl)}
            {this.state.activeModal === "Archive" && t1("Archive", intl)}
            {this.state.activeModal === "CancelAgreement" &&
              t1("CancelAgreement", intl)}
          </ModalHeader>
          <ModalBody>
            <h5>{t1("message", intl)}</h5>
            {this.state.activeModal === "Send" && (
              <Input
                type="textarea"
                value={send.message || ""}
                onChange={(e) => this.handleChangeTextArr(e, "message", "send")}
                id="message"
                placeholder={t2("message", intl)}
              />
            )}
            {this.state.activeModal === "ToReject" && (
              <>
                <div className="mb-2">
                  <Select
                    className="basic-multi-select"
                    classNamePrefix="select"
                    isMulti
                    placeholder={t2("Role", intl)}
                    name="color"
                    options={RejectList}
                    label="text"
                    getOptionLabel={(item) => item.text}
                    onChange={(e) => {
                      this.handleChangeTextArr(
                        false,
                        "rejectionReasons",
                        "ToReject",
                        {
                          value: e.map((item) => item.value),
                        }
                      );
                    }}
                  />
                </div>
                <div className="mb-2">
                  <Input
                    type="textarea"
                    value={toReject.message || ""}
                    onChange={(e) =>
                      this.handleChangeTextArr(e, "message", "ToReject")
                    }
                    id="toReject"
                    placeholder={t2("message", intl)}
                  />
                </div>
                <div className="">
                  <InputGroup size="md" className="datePicker">
                    <DatePicker
                      dateFormat="dd.MM.yyyy"
                      selected={
                        toReject.letterDate
                          ? moment(toReject.letterDate, "DD.MM.YYYY").toDate()
                          : ""
                      }
                      onChange={(date) => {
                        this.handleChangeTextArr(
                          date,
                          "letterDate",
                          "ToReject",
                          {
                            value: moment(new Date(date)).format("DD.MM.YYYY"),
                          }
                        );
                      }}
                      isClearable={!!toReject.letterDate ? true : false}
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
                </div>
                {this.state.PrewToRejectLetter.length > 0 ? (
                  <>
                    <div style={{ margin: "50px" }}>
                      <div
                        className="mydiv"
                        dangerouslySetInnerHTML={{
                          __html: PrewToRejectLetter,
                        }}
                      />
                    </div>
                  </>
                ) : (
                  ""
                )}
              </>
            )}
            {this.state.activeModal === "ToAgree" && (
              <>
                <div className="mb-2">
                  <Input
                    type="textarea"
                    value={toAgree.message || ""}
                    onChange={(e) =>
                      this.handleChangeTextArr(e, "message", "ToAgree")
                    }
                    id="message"
                    placeholder={t2("message", intl)}
                  />
                </div>
                <div className="mb-2">
                  <h5>{t1("docDate")}</h5>
                  <InputGroup size="md" className="datePicker">
                    <DatePicker
                      dateFormat="dd.MM.yyyy"
                      selected={
                        toAgree.letterDate
                          ? moment(toAgree.letterDate, "DD.MM.YYYY").toDate()
                          : ""
                      }
                      onChange={(date) => {
                        this.handleChangeTextArr(
                          date,
                          "letterDate",
                          "ToAgree",
                          {
                            value: moment(new Date(date)).format("DD.MM.YYYY"),
                          }
                        );
                      }}
                      isClearable={!!toAgree.letterDate ? true : false}
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
                </div>
                {this.state.PrewToAgreeLetter.length > 0 ? (
                  <>
                    <div style={{ margin: "50px" }}>
                      <div
                        className="mydiv"
                        dangerouslySetInnerHTML={{
                          __html: PrewToAgreeLetter,
                        }}
                      />
                    </div>
                  </>
                ) : (
                  ""
                )}
              </>
            )}
            {this.state.activeModal === "ReturnToModerator" && (
              <Input
                type="textarea"
                value={returnToModerator.message || ""}
                onChange={(e) =>
                  this.handleChangeTextArr(e, "message", "ReturnToModerator")
                }
                id="message"
                placeholder={t2("message", intl)}
              />
            )}

            {/* {this.state.activeModal === "Reject" && (
              <Input
                type="textarea"
                value={reject.message || ""}
                onChange={(e) =>
                  this.handleChangeTextArr(e, "message", "Reject")
                }
                id="message"
                placeholder={t2("message", intl)}
              />
            )}
            {this.state.activeModal === "Agree" && (
              <Input
                type="textarea"
                value={agree.message || ""}
                onChange={(e) =>
                  this.handleChangeTextArr(e, "message", "Agree")
                }
                id="message"
                placeholder={t2("message", intl)}
              />
            )} */}
            {this.state.activeModal === "Reject" && (
              <div>
                <Input
                  type="textarea"
                  value={reject.message || ""}
                  onChange={(e) =>
                    this.handleChangeTextArr(e, "message", "Reject")
                  }
                  id="message"
                  placeholder={t2("message", intl)}
                />
                {/* {this.state.rejectEimzoLoad ? (
                  this.state.keysList.length > 0 ? (
                    <>
                      {this.state.keysList.map((item, idx) => (
                        <div className="m-1">
                          <Row>
                            <Col sm={6} md={6} lg={6}>
                              <div
                                class="mb-2 rounded p-2"
                                style={{
                                  border: "1px solid #003E6D",
                                  borderTop: "5px solid #003E6D",
                                }}
                              >
                                <div>
                                  <Row
                                    style={{
                                      borderBottom: "1px solid #003E6D",
                                    }}
                                  >
                                    <p class="ml-2">
                                      <b>Ф.И.О</b>:{item.CN}
                                    </p>
                                  </Row>
                                  <Row>
                                    <p
                                      class="ml-2 mt-2"
                                      style={{ display: "flex" }}
                                    >
                                      <div style={{ width: "55px" }}>
                                        <img
                                          src={SERTIFICATEIMG}
                                          alt="sertificate"
                                          style={{
                                            width: "100%",
                                            marginLeft: "-10px",
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <b>№ Сертификата</b>:{item.serialNumber}
                                      </div>
                                    </p>
                                  </Row>
                                  <Row>
                                    <p class="ml-2">
                                      <b>ИНН</b>:{item.TIN}
                                    </p>
                                  </Row>
                                  <Row>
                                    <p class="ml-2">
                                      <b>Организация</b>:{item.O}
                                    </p>
                                  </Row>
                                  <Row>
                                    <p class="ml-2 small">
                                      <b>Срок действия сертификата</b>:{" "}
                                      {this.getDateFormat(item.validFrom)} -{" "}
                                      {this.getDateFormat(item.validTo)}
                                    </p>
                                    <p></p>
                                  </Row>
                                </div>
                                <div>
                                  <Button
                                    onClick={() => {
                                      this.state.currentItem = item;
                                      this.signByEimzoReject();
                                    }}
                                    color="primary"
                                    outline
                                  >
                                    {t1("takeKey")}
                                  </Button>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <h2 className="text-danger m-1">
                        У вас нет ни одного ключа
                      </h2>
                    </>
                  )
                ) : (
                  ""
                )} */}
              </div>
            )}
            {this.state.activeModal === "Agree" && (
              <div>
                <Input
                  type="textarea"
                  value={agree.message || ""}
                  onChange={(e) =>
                    this.handleChangeTextArr(e, "message", "Agree")
                  }
                  id="message"
                  placeholder={t2("message", intl)}
                />
                {/* {this.state.agreeEimzoLoad ? (
                  this.state.keysList.length > 0 ? (
                    <>
                      {this.state.keysList.map((item, idx) => (
                        <div className="m-1">
                          <Row>
                            <Col sm={6} md={6} lg={6}>
                              <div
                                class="mb-2 rounded p-3"
                                style={{
                                  border: "1px solid #003E6D",
                                  borderTop: "5px solid #003E6D",
                                }}
                              >
                                <div>
                                  <Row
                                    style={{
                                      borderBottom: "1px solid #003E6D",
                                    }}
                                  >
                                    <p class="ml-2">
                                      <b>Ф.И.О</b>:{item.CN}
                                    </p>
                                  </Row>
                                  <Row>
                                    <p
                                      class="ml-2 mt-2"
                                      style={{ display: "flex" }}
                                    >
                                      <div style={{ width: "65px" }}>
                                        <img
                                          src={SERTIFICATEIMG}
                                          alt="sertificate"
                                          style={{
                                            width: "100%",
                                            marginLeft: "-10px",
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <b>№ Сертификата</b>:{item.serialNumber}
                                      </div>
                                    </p>
                                  </Row>
                                  <Row>
                                    <p class="ml-2">
                                      <b>ИНН</b>:{item.TIN}
                                    </p>
                                  </Row>
                                  <Row>
                                    <p class="ml-2">
                                      <b>Организация</b>:{item.O}
                                    </p>
                                  </Row>
                                  <Row>
                                    <p class="ml-2 small">
                                      <b>Срок действия сертификата</b>:{" "}
                                      {this.getDateFormat(item.validFrom)} -{" "}
                                      {this.getDateFormat(item.validTo)}
                                    </p>
                                    <p></p>
                                  </Row>
                                </div>
                                <div>
                                  <Button
                                    onClick={() => {
                                      this.state.currentItem = item;
                                      this.signByEimzo();
                                    }}
                                    color="primary"
                                    outline
                                  >
                                    {t1("takeKey")}
                                  </Button>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <h2 className="text-danger m-1">
                        У вас нет ни одного ключа
                      </h2>
                    </>
                  )
                ) : (
                  ""
                )} */}
              </div>
            )}
            {this.state.activeModal === "Archive" && (
              <Input
                type="textarea"
                value={archive.message || ""}
                onChange={(e) =>
                  this.handleChangeTextArr(e, "message", "Archive")
                }
                id="message"
                placeholder={t2("message", intl)}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.toggleModal}>
              {t1("back", intl)}
            </Button>

            {this.state.activeModal === "Send" && (
              <Button color="success" onClick={this.SendFunction}>
                {SendLoading ? <Spinner size="sm" /> : ""}
                {t1("yes", intl)}
              </Button>
            )}
            {/* {this.state.activeModal === "ToReject" && (
              <Button color="success" onClick={this.ToRejectFunction}>
                {ToRejectLoading ? <Spinner size="sm" /> : ""}
                {t1("yes", intl)}
              </Button>
            )}
            {this.state.activeModal === "ToAgree" && (
              <Button color="success" onClick={this.ToAgreeFunction}>
                {ToAgreeLoading ? <Spinner size="sm" /> : ""}
                {t1("yes", intl)}
              </Button>
            )} */}
            {this.state.activeModal === "ToReject" && (
              <Button color="primary" onClick={this.PrewToRejectLetter}>
                {PrewToRejectLetterLoading ? <Spinner size="sm" /> : ""}
                {t1("PrewLetter", intl)}
              </Button>
            )}
            {this.state.activeModal === "ToReject" && (
              <Button
                color="warning"
                onClick={() => {
                  this.EditToRejectLette();
                  this.setState({ activeModalInner: "EditRejectLetter" });
                }}
              >
                {EditToRejectLetteLoading ? <Spinner size="sm" /> : ""}
                {t1("editLetter", intl)}
              </Button>
            )}
            {this.state.activeModal === "ToReject" && (
              <Button color="success" onClick={this.ToRejectFunction}>
                {ToRejectLoading ? <Spinner size="sm" /> : ""}
                {t1("send", intl)}
              </Button>
            )}
            {this.state.activeModal === "ToAgree" && (
              <Button color="primary" onClick={this.PrewToAgreeLetter}>
                {PrewToAgreeLetterLoading ? <Spinner size="sm" /> : ""}
                {t1("PrewLetter", intl)}
              </Button>
            )}
            {this.state.activeModal === "ToAgree" && (
              <Button
                color="warning"
                onClick={() => {
                  this.EditToAgreeLetter();
                  this.setState({ activeModalInner: "EditAgreeLetter" });
                }}
              >
                {EditToAgreeLetterLoading ? <Spinner size="sm" /> : ""}
                {t1("editLetter", intl)}
              </Button>
            )}
            {this.state.activeModal === "ToAgree" && (
              <Button color="success" onClick={this.ToAgreeFunction}>
                {ToAgreeLoading ? <Spinner size="sm" /> : ""}
                {t1("yes", intl)}
              </Button>
            )}
            {this.state.activeModal === "ReturnToModerator" && (
              <Button color="success" onClick={this.ReturnToModeratorFunction}>
                {ReturnToModeratorLoading ? <Spinner size="sm" /> : ""}
                {t1("yes", intl)}
              </Button>
            )}
            {this.state.activeModal === "Reject" && (
              <Button color="success" onClick={this.RejectFunction}>
                {RejectLoading ? <Spinner size="sm" /> : ""}
                {t1("yes", intl)}
              </Button>
            )}
            {this.state.activeModal === "Agree" && (
              <Button color="success" onClick={this.AgreeFunction}>
                {AgreeLoading ? <Spinner size="sm" /> : ""}
                {t1("yes", intl)}
              </Button>
            )}
            {this.state.activeModal === "Archive" && (
              <Button color="success" onClick={this.ArchiveFunction}>
                {ArchiveLoading ? <Spinner size="sm" /> : ""}
                {t1("yes", intl)}
              </Button>
            )}
          </ModalFooter>
        </Modal>
        {requestpostponement.statusId == 1 ||
        requestpostponement.statusId == 12 ? (
          <Card>
            <Alert
              className="m-1"
              color={this.getAlertColor(requestpostponement.statusId)}
            >
              <p style={{ color: "black" }}>
                {" "}
                {t1("DocumentStatus")} - {requestpostponement.status}
              </p>
            </Alert>
          </Card>
        ) : (
          ""
        )}
        <Card className="p-2">
          <Nav pills>
            {(can("RequestAgree") ||
              can("RequestReceive") ||
              can("AllRequestReceive")) &&
            requestpostponement.statusId != 2 ? (
              <NavItem>
                <NavLink
                  className={{ active: this.state.activeTab === "6" }}
                  onClick={() => {
                    this.toggle("6");
                  }}
                >
                  <span style={{ fontSize: "24px" }}>
                    {" "}
                    {t1("RequestPostponement")} PDF{" "}
                  </span>
                </NavLink>
              </NavItem>
            ) : (
              ""
            )}
            <NavItem>
              <NavLink
                className={{ active: this.state.activeTab === "1" }}
                onClick={() => {
                  this.toggle("1");
                }}
              >
                <span style={{ fontSize: "24px" }}>
                  {" "}
                  {t1("RequestPostponement")}{" "}
                </span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={{ active: this.state.activeTab === "2" }}
                onClick={() => {
                  this.toggle("2");
                }}
              >
                <Row>
                  <Col>
                    <span style={{ fontSize: "24px" }}> {t1("History")} </span>
                  </Col>
                </Row>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            {(can("RequestAgree") ||
              can("RequestReceive") ||
              can("AllRequestReceive")) &&
            requestpostponement.statusId != 2 &&
            !can("RequestView") ? (
              <TabPane tabId="6">
                <div>
                  <Row>
                    <Col sm={12} md={12} lg={12}>
                      <iframe
                        width="100%"
                        height="1000px"
                        // dangerouslySetInnerHTML={{ __html: HtmlData }}
                        src={
                          axios.defaults.baseURL +
                          `/report/GetRequestPostponementAsHtml/${this.state.requestpostponement.id}?__lang=${this.state.lang}`
                        }
                      ></iframe>
                    </Col>
                  </Row>
                </div>
              </TabPane>
            ) : (
              ""
            )}
            <TabPane tabId="1">
              <Row>
                <Col sm={12} md={10} lg={10}>
                  <Table>
                    {/* <thead>
                      <tr>
                        <th colSpan={4}>sdfsdf</th>
                      </tr>
                    </thead> */}
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
                          <h6 className="text-bold-600">
                            {t1("requestDocNumber")}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {requestpostponement.requestDocNumber}
                          </h6>
                        </td>
                        <td scope="row">
                          <h6 className="text-bold-600">{t1("inn")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {requestpostponement.contractor.innOrPinfl}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">{t1("contractor")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {requestpostponement.contractor.fullName}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">{t1("Region")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {requestpostponement.contractor.region}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">{t1("District")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {requestpostponement.contractor.district}
                          </h6>
                        </td>
                        <td scope="row">
                          <h6 className="text-bold-600">{t1("Oked")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900">
                            {requestpostponement.contractor.oked}
                          </h6>
                        </td>
                      </tr>
                      <tr>
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
                      </tr>
                      <tr>
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
                        <td>
                          <h6 className="text-bold-600">{t1("docDate")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900 text-left">
                            {requestpostponement.docDate}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">
                            {t1("requestStatus")}
                          </h6>
                        </td>
                        <td>
                          {requestpostponement.requestStatusId == 13 ? (
                            <h6 className="text-bold-900">{t1("Перенос")}</h6>
                          ) : (
                            ""
                          )}
                          {requestpostponement.requestStatusId == 14 ? (
                            <h6 className="text-bold-900">{t1("Продление")}</h6>
                          ) : (
                            ""
                          )}
                          {requestpostponement.requestStatusId == 15 ? (
                            <h6 className="text-bold-900">{t1("Отмена")}</h6>
                          ) : (
                            ""
                          )}
                        </td>
                        <td>
                          <h6 className="text-bold-600">{t1("startDate")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900 text-left">
                            {requestpostponement.startDate}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">{t1("endDate")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900 text-left">
                            {requestpostponement.endDate}
                          </h6>
                        </td>
                        <td>
                          {requestpostponement.checkDaysNumber != null ? (
                            <h6 className="text-bold-600">
                              {t1("checkDaysNumber")}
                            </h6>
                          ) : (
                            ""
                          )}
                        </td>
                        <td>
                          {requestpostponement.checkDaysNumber != null ? (
                            <h6 className="text-bold-900 text-left">
                              {requestpostponement.checkDaysNumber}
                            </h6>
                          ) : (
                            ""
                          )}
                        </td>
                        {/* {requestpostponement.checkDaysNumber != null ? (
                          <>
                            {" "}
                            <td>
                              <h6 className="text-bold-600">
                                {t1("checkDaysNumber")}
                              </h6>
                            </td>
                            <td>
                              <h6 className="text-bold-900 text-left">
                                {requestpostponement.checkDaysNumber}
                              </h6>
                            </td>
                          </>
                        ) : (
                          ""
                        )} */}
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">{t1("reason")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900 text-left">
                            {requestpostponement.reason}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-bold-600">{t1("orderNumber")}</h6>
                        </td>
                        <td>
                          <h6 className="text-bold-900 text-left">
                            {requestpostponement.orderNumber}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6 className="text-bold-600">{t1("basicFiles")}</h6>
                        </td>
                        <td>
                          {requestpostponement.files?.map((item, index) => (
                            <Badge
                              id="files"
                              color="primary"
                              style={{ margin: "2px" }}
                              key={index}
                            >
                              <Icon.Download
                                onClick={() =>
                                  this.DownloadFilePost(item, index)
                                }
                                style={{ cursor: "pointer" }}
                                size={15}
                              />{" "}
                              {item.name || item.fileName}{" "}
                              <UncontrolledTooltip
                                placement="top"
                                target="files"
                              >
                                {t1("dateOfCreatedFile")} - {item.dateOfCreated}
                              </UncontrolledTooltip>
                            </Badge>
                          ))}
                        </td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </Table>
                  <Nav pills>
                    {requestpostponement?.files?.length != 0 ? (
                      <NavItem>
                        <NavLink
                          className={{
                            active: this.state.activeTabFile === "1",
                          }}
                          onClick={() => {
                            this.toggleTabFile("1");
                          }}
                        >
                          <span style={{ fontSize: "20px" }}>
                            {" "}
                            {t1("basicFiles")}
                          </span>
                        </NavLink>
                      </NavItem>
                    ) : (
                      ""
                    )}
                  </Nav>
                  <TabContent activeTab={this.state.activeTabFile}>
                    <TabPane tabId="1">
                      <Row>
                        <Col sm={12} md={12} lg={12}>
                          {requestpostponement.files?.map((item, index) => (
                            <Row key={index}>
                              <Col sm={12} md={12} lg={12}>
                                <iframe
                                  width={"100%"}
                                  height={"1000px"}
                                  src={
                                    axios.defaults.baseURL +
                                    `/RequestPostponement/DownloadFile/${item.id}`
                                  }
                                ></iframe>
                              </Col>
                            </Row>
                          ))}
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                </Col>
                <Col className="text-right" sm={12} md={2} lg={2}>
                  <Button
                    style={{ width: "100%", marginBottom: "5px" }}
                    className="ml-1"
                    color="danger"
                    onClick={() => history.push("/document/postponement")}
                  >
                    {t1("back")}{" "}
                  </Button>
                  {can("RequestSend") &&
                  isSend(requestpostponement.statusId) ? (
                    <Button
                      style={{ width: "100%", marginBottom: "5px" }}
                      className="ml-1"
                      color="success"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "Send" });
                        this.setState((prevState) => ({
                          send: {
                            ...prevState.send,
                            id: requestpostponement.id,
                          },
                        }));
                      }}
                    >
                      {" "}
                      {t1("Send")}{" "}
                    </Button>
                  ) : (
                    ""
                  )}
                  {(can("RequestReceive") || can("AllRequestReceive")) &&
                  isToReject(requestpostponement.statusId) ? (
                    <Button
                      style={{ width: "100%", marginBottom: "5px" }}
                      className="ml-1"
                      color="success"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "ToReject" });
                        this.setState((prevState) => ({
                          toReject: {
                            ...prevState.toReject,
                            id: requestpostponement.id,
                          },
                        }));
                      }}
                    >
                      {" "}
                      {t1("ToReject")}{" "}
                    </Button>
                  ) : (
                    ""
                  )}
                  {(can("RequestReceive") || can("AllRequestReceive")) &&
                  isToAgree(requestpostponement.statusId) ? (
                    <Button
                      style={{ width: "100%", marginBottom: "5px" }}
                      className="ml-1"
                      color="success"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "ToAgree" });
                        this.setState((prevState) => ({
                          toAgree: {
                            ...prevState.toAgree,
                            id: requestpostponement.id,
                          },
                        }));
                      }}
                    >
                      {t1("ToAgree")}{" "}
                    </Button>
                  ) : (
                    ""
                  )}
                  {(can("RequestAgree") || can("AllRequestAgree")) &&
                  isReturnToModerator(requestpostponement.statusId) ? (
                    <Button
                      style={{ width: "100%", marginBottom: "5px" }}
                      className="ml-1"
                      color="success"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "ReturnToModerator" });
                        this.setState((prevState) => ({
                          returnToModerator: {
                            ...prevState.returnToModerator,
                            id: requestpostponement.id,
                          },
                        }));
                      }}
                    >
                      {" "}
                      {t1("ReturnToModerator")}{" "}
                    </Button>
                  ) : (
                    ""
                  )}
                  {(can("RequestAgree") || can("AllRequestAgree")) &&
                  isReject(requestpostponement.statusId) ? (
                    <Button
                      style={{ width: "100%", marginBottom: "5px" }}
                      className="ml-1"
                      color="danger"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "Reject" });
                        this.setState((prevState) => ({
                          reject: {
                            ...prevState.reject,
                            id: requestpostponement.id,
                          },
                        }));
                      }}
                    >
                      {t1("Reject")}{" "}
                    </Button>
                  ) : (
                    ""
                  )}
                  {(can("RequestAgree") || can("AllRequestAgree")) &&
                  isAgree(requestpostponement.statusId) ? (
                    <Button
                      style={{ width: "100%", marginBottom: "5px" }}
                      className="ml-1"
                      color="success"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "Agree" });
                        this.setState((prevState) => ({
                          agree: {
                            ...prevState.agree,
                            id: requestpostponement.id,
                          },
                        }));
                      }}
                    >
                      {" "}
                      {t1("Agree")}{" "}
                    </Button>
                  ) : (
                    ""
                  )}
                  {can("RequestArchive") &&
                  isArchive(requestpostponement.statusId) ? (
                    <Button
                      style={{ width: "100%", marginBottom: "5px" }}
                      className="ml-1"
                      color="success"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "Archive" });
                        this.setState((prevState) => ({
                          archive: {
                            ...prevState.archive,
                            id: requestpostponement.id,
                          },
                        }));
                      }}
                    >
                      {" "}
                      {t1("Archive")}{" "}
                    </Button>
                  ) : (
                    ""
                  )}
                  {isDownloadStatus(requestpostponement.statusId) ? (
                    <Button
                      style={{ width: "100%", marginBottom: "5px" }}
                      className="ml-1"
                      color="primary"
                      onClick={() => {
                        this.DownloadRequestPostponementPdf(
                          this.state.requestpostponement.answerLetterId
                        );
                      }}
                    >
                      {DownloadReportPdfLoading ? <Spinner size="sm" /> : ""}
                      <Icon.Download style={{ cursor: "pointer" }} size={15} />
                      {t1("DownloadReportPdf")}{" "}
                    </Button>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>
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
                      {histories?.map((item, idx) => (
                        <li>
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
                              {item.parentOrganization}
                            </span>
                            <p>
                              {t1("dateOfCreated")} - {item.dateOfCreated}
                            </p>
                            <p>
                              {t1("message")} - {item.message}
                            </p>
                          </div>
                          <small className="text-muted"></small>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardBody>
              </Card>
            </TabPane>
          </TabContent>
        </Card>
      </Overlay>
    );
  }
}
export default injectIntl(EditRequest);
