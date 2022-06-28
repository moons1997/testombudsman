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
  UncontrolledTooltip,
} from "reactstrap";
import Select from "react-select";
import AsynSelect from "react-select/async";

import { Plus, AlertCircle, Check } from "react-feather";
import RequestService from "../../../services/document/request.service";
import Overlay from "../../../components/Webase/components/Overlay";
import AppSettings from "../../../components/Webase/components/settings.json";
import EIMZOClient, {
  dates,
} from "../../../components/Webase/components/e-imzo-client";
// import { dates } from "../../../components/Webase/components/e-imzo-client";
import ManualService from "../../../services/other/manual.service";
import Iframe from "@nicholasadamou/react-iframe";
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
import InspectionResultService from "../../../services/document/inspectionresult.service";
import InspectionConclusionService from "../../../services/document/inspectionconclusion.service";
import request from ".";
import { map } from "jquery";
import RejectionReasonService from "../../../services/info/rejectionreason.service";
import HtmlReportService from "../../../services/reports/HtmlReport.service";
import axios from "axios";
import InspectionBookService from "../../../services/document/inspectionbook.service";
import EmployeeService from "../../../services/info/employee.service";
import style from "../inspectionbook/style.css";
// import { DatePicker } from "antd";
import "moment/locale/ru";
import locale from "antd/es/date-picker/locale/ru_RU";
import {
  isSend,
  isMakeNotified,
  isMakeNotAgreed,
  isToAgree,
  isToReject,
  isReturnToModerator,
  isAgree,
  isArchive,
  isExecuteStatus,
  isDownloadStatus,
  isPostponeStatus,
  isReject,
} from "../../../components/Webase/functions/RequestStatus";
import DatePicker, { registerLocale } from "react-datepicker";
import MaskedTextInput from "react-text-mask";
import uz from "date-fns/locale/uz";
import uzCyrl from "date-fns/locale/uz-Cyrl";
import ru from "date-fns/locale/ru";
import OrganizationService from "../../../services/management/organization.service";
import SERTIFICATEIMG from "../../../assets/img/sertificate.webp";
import ReactQuill, { Quill } from "react-quill";
import { Editor } from "@tinymce/tinymce-react";
import "./date.css";
import "react-quill/dist/quill.snow.css";
Quill.register(Quill.import("attributors/style/direction"), true);
//Alignment
Quill.register(Quill.import("attributors/style/align"), true);

// Don't forget corresponding css
const Size = Quill.import("attributors/style/size");
Size.whitelist = ["0.75em", "1em", "1.5em", "2.5em"];
Quill.register(Size, true);
//Text indent
const Parchment = Quill.import("parchment");
class IndentAttributor extends Parchment.Attributor.Style {
  add(node, value) {
    if (value === 0) {
      this.remove(node);
      return true;
    } else {
      return super.add(node, `${value}em`);
    }
  }
}

let IndentStyle = new IndentAttributor("indent", "text-indent", {
  scope: Parchment.Scope.BLOCK,
  // whitelist: ["1em", "2em", "3em", "4em", "5em", "6em", "7em", "8em", "9em"],
});

Quill.register(IndentStyle, true);

const modules = {
  // https://github.com/quilljs/quill/issues/2905#issuecomment-683128521
  clipboard: {
    matchVisual: false,
  },
  toolbar: [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    ["link", "image", "video"],
    [{ align: [] }],

    ["clean"],
  ],
};

registerLocale("uz", uz);
registerLocale("uzCyrl", uzCyrl);
registerLocale("ru", ru);
const { t1, t2 } = Translate;
const { can } = Permission;
const { errorToast, successToast, customErrorToast } = Notification;
const token = localStorage.getItem("token");
const orgId = JSON.parse(localStorage.getItem("user_info"));
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
    this.testOnChange = this.testOnChange.bind(this);
    this.agreeOnChange = this.agreeOnChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      requestHistory: {},
      request: {
        contractor: {},
      },
      postponement: {},
      inspectionresult: {},
      inspectionbook: {},
      loading: false,
      loadingPostponement: false,
      SaveLoading: false,
      StateList: [],
      CheckTypeList: [],
      CheckBasisList: [],
      InspectionOrganizationList: [],
      OrderedOrganizationList: [],
      OrganizationBranchList: [],
      AuthorizedOrganizationList: [],
      CheckingQuizzesList: [],
      RegionList: [],
      DistrictList: [],
      BankList: [],
      OkedList: [],
      RejectList: [],
      InnLoading: false,
      ReceiveLoading: false,
      ToRejectLoading: false,
      ToAgreeLoading: false,
      ArchiveLoading: false,
      DeleteLoading: false,
      MakeNotifiedLoading: false,
      MakeNotAgreedLoading: false,
      activeTab: can("RequestAgree") ? "6" : "1",
      activeTabFile: "1",
      activeTabFilePost: "1",
      activeTabFileResult: "1",
      modal: false,
      receive: {},
      DownloadReportPdfLoading: false,
      send: {},
      makeNotAgreed: {},
      makeNotified: {},
      toReject: {},
      toAgree: {},
      returnToModerator: {},
      reject: {},
      agree: {},
      archive: {},
      delete: {},
      modalAttach: false,
      fileLoading: false,
      revoke: {},
      redirect: {},
      toapprove: {},
      cancelagreement: {},
      returntomoderator: {},
      inspectionconclusion: {},
      refusebymoderator: {},
      receiveModal: false,
      activeModal: "",
      activeModalInner: "",
      SendLoading: false,
      RevokeLoading: false,
      RefuseByModeratorLoading: false,
      ToApproveLoading: false,
      ReturnToModeratorLoading: false,
      RejectLoading: false,
      RedirectLoading: false,
      AgreeLoading: false,
      PrewToRejectLetterLoading: false,
      ResetLetterContentLoading: false,
      EditToRejectLetteLoading: false,
      CancelAgreementLoading: false,
      PrewToAgreeLetterLoading: false,
      EditToAgreeLetterLoading: false,
      loadingInspection: false,
      downloadLoad: { check: false, id: null },
      EmployeeList: [],
      HtmlData: "",
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
      LetterEditableContent: {},
      PrewToRejectLetter: {},
      ResetLetterContent: {},
      GetToRejectLetterContent: {},
      GetToAgreeLetterContent: {},
      PrewToAgreeLetter: {},
      TempEmploys: [],
      dataToSign: {
        default: null,
      },
      modalLetter: false,
      page: {
        sortBy: "",
        orderType: "asc",
        page: 1,
        pageSize: 50,
      },
      lang: "uz-cyrl",
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
    // HtmlReportService.GetRequestAsHtml(this.props.match.params.id).then(
    //   (res) => {
    //     this.setState({ HtmlData: res.data });
    //   }
    // );
  }
  // methods
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
    this.setState({ loadingButton: true });
    let vm = this;
    var data = JSON.stringify(
      this.state.dataToSign ? this.state.dataToSign : this.sate.dataToSignIfNot
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
          customErrorToast("server_error");
        }
      )
      .finally(() => {
        // vm.signModal = false;
        vm.setState({ loadingButton: false });
      });
  }
  signByEimzo(data2) {
    this.setState({ loadingButton: true });
    let vm = this;
    var data = JSON.stringify(
      this.state.dataToSign ? this.state.dataToSign : this.sate.dataToSignIfNot
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
  onSetSidebarOpen(open) {
    this.setState({ sideBarOpen: open });
  }
  toggleModal = (name) => {
    this.setState({ activeModal: name });
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
    this.state.receive.id = this.state.request.id;
  };
  toggleModalAttach = () => {
    // this.employeeChange();
    this.setState((prevState) => ({
      modalAttach: !prevState.modalAttach,
    }));
  };
  toggleModalLetter = () => {
    this.setState((prevState) => ({
      modalLetter: !prevState.modalLetter,
    }));
  };
  changeAuthorizedOrganization = (id) => {
    OrganizationService.GetAsSelectList(id, true, false).then((res) => {
      this.setState({ AuthorizedOrganizationList: res.data });
    });
  };
  Refresh = () => {
    this.setState({ loading: true });
    RequestService.Get(this.props.match.params.id)
      .then((res) => {
        this.setState({ request: res.data, loading: false }, () => {
          this.employeechange();
        });
        this.setState((prevState) => ({
          toAgree: {
            ...prevState.toReject,
            agreedCheckDaysNumber: res.data.checkDaysNumber,
          },
        }));

        if (this.state.request.requestPostponementId != null) {
          RequestPostponementService.Get(
            this.state.request.requestPostponementId
          )
            .then((res) => {
              this.setState({ postponement: res.data });
            })
            .catch((error) => {
              errorToast(error.response.data);
            });
        }
        if (this.state.request.inspectionBookId != null) {
          InspectionBookService.Get(this.state.request.inspectionBookId)
            .then((res) => {
              this.setState({ inspectionbook: res.data });
            })
            .catch((error) => {
              errorToast(error.response.data);
            });
        }
        if (this.state.request.inspectionResultId !== null) {
          InspectionResultService.Get(
            this.state.request.inspectionResultId
          ).then((res) => {
            this.setState({ inspectionresult: res.data });
          });
        }
        this.changeAuthorizedOrganization(
          this.state.request.orderedOrganizationId,
          true,
          false
        );
        // this.changeOrderedOrg(
        //   this.state.request.orderedOrganizationId,
        //   false,
        //   true
        // );
        // this.changeCheckingQuiz(this.state.request.orderedOrganizationId);
        // this.changeAuthorizedOrganization(
        //   this.state.request.orderedOrganizationId,
        //   true,
        //   false
        // );
      })
      .catch((error) => {
        this.setState({ loading: false });
        errorToast(error.response.data);
      });
  };
  GetPostPonement = (id) => {
    this.setState({ loadingPostponement: true });
    RequestPostponementService.GetByRequestId(this.props.match.params.id)
      .then((res) => {
        this.setState({
          requestpostponement: res.data,
          loadingPostponement: false,
        });
        this.props.history.push({
          pathname:
            this.state.request.requestPostponementId === null
              ? "/document/postEdit/" + this.props.match.params.id
              : "/document/view/" + this.state.request.requestPostponementId,
          state: { postponementBtn: true, id },
        });
      })
      .catch((error) => {
        this.setState({ loadingPostponement: false });
        errorToast(error.response.data);
      });
  };
  InspectionBook = (id) => {
    this.setState({ loadingInspection: true });
    InspectionBookService.GetByRequestId(this.props.match.params.id)
      .then((res) => {
        this.setState({ inspectionbook: res.data, loadingInspection: false });
        this.props.history.push({
          pathname:
            this.state.request.inspectionBookId === null
              ? "/document/editinspectionbook/" + this.props.match.params.id
              : "/document/viewinspectionbook/" +
                this.state.request.inspectionBookId,
          state: { inspectionBtn: true, id },
        });
      })
      .catch((error) => {
        this.state({ loadingInspection: false });
        errorToast(error.response.data);
      });
  };

  InspectionResult = (id) => {
    this.setState({ loadingInspection: true });
    InspectionResultService.GetByRequestId(this.props.match.params.id)
      .then((res) => {
        this.setState({ inspectionresult: res.data, loadingInspection: false });
        this.props.history.push({
          pathname:
            this.state.request.inspectionResultId === null
              ? "/document/resultEdit/" + this.props.match.params.id
              : "/document/viewInspection/" +
                this.state.request.inspectionResultId,
          state: { inspctionresultBtn: true, id },
        });
      })
      .catch((error) => {
        this.setState({ loadingInspection: false });
        errorToast(error.response.data);
      });
  };
  InspectionConclusion = (id) => {
    this.setState({ loadingInspection: true });
    InspectionConclusionService.GetByRequestId(this.props.match.params.id)
      .then((res) => {
        this.setState({
          inspectionconclusion: res.data,
          loadingInspection: false,
        });
        this.props.history.push({
          pathname:
            this.state.request.inspectionConclusionId === null
              ? "/document/editinspectionconclusion/" +
                this.props.match.params.id
              : "/document/viewinspectionconclusion/" +
                this.state.request.inspectionConclusionId,
          state: { inspctionconclusiontBtn: true, id },
        });
      })
      .catch((error) => {
        this.setState({ loadingInspection: false });
        errorToast(error.response.data);
      });
  };
  GetHistory = () => {
    this.setState({ loading: true });
    RequestService.GetHistoryList({}, this.props.match.params.id)
      .then((res) => {
        this.setState({ requestHistory: res.data, loading: false });
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
    RejectionReasonService.GetAsSelectList().then((res) => {
      this.setState({ RejectList: res.data });
    });
    this.employeechange();

    // CheckTypeService.GetAsSelectList().then((res) => {
    //   this.setState({ CheckTypeList: res.data });
    // });

    // OrganizationService.GetAsSelectList(null).then((res) => {
    //   this.setState({ OrderedOrganizationList: res.data });
    // });
    // RegionService.GetAsSelectList(211).then((res) => {
    //   this.setState({ RegionList: res.data });
    // });
    // OkedService.GetAsSelectList(5).then((res) => {
    //   this.setState({ OkedList: res.data });
    // });
    // BankService.GetAsSelectList().then((res) => {
    //   this.setState({ BankList: res.data });
    // });
  };

  employeechange = (param) => {
    const { page, search, request } = this.state;
    EmployeeService.GetAsSelectList({
      parentOrganizationId: request.orderedOrganizationId,
      organizationId: request.inspectionOrganizationId,
      inspectionOrganizationId: true,
      isHr: false,
      isPassedAttestation: true,
      sortBy: page.sortBy,
      orderType: page.orderType,
      page: page.page,
      pageSize: page.pageSize,
      search: param,
    }).then((res) => {
      let arrayTemp = [];
      this.setState({ EmployeeList: res.data });

      res.data.rows.map((item) => {
        arrayTemp.push(item.value);
      });
      if (!!this.state.request.inspectors) {
        this.state.request.inspectors.map((item, index) => {
          if (arrayTemp.includes(item)) {
          } else {
            this.setState((prevState) => ({
              EmployeeList: {
                ...prevState.EmployeeList,
                rows: [
                  ...prevState.EmployeeList.rows,
                  {
                    value: item,
                    text: this.state.request.inspectorNames[index],
                  },
                ],
              },
            }));
          }
        });
      }
    });
  };
  handleChangeAttach(event, field, data) {
    let arrayTemp = [];
    const { EmployeeList, TempEmploys } = this.state;

    var request = this.state.request;

    if (!!event) {
      if (field === "inspectors") {
        EmployeeList.rows.map((item) => arrayTemp.push(item.value));
        event.map((item) => {
          if (arrayTemp.includes(item.value)) {
          } else {
            this.setState((prevState) => ({
              EmployeeList: {
                ...prevState.EmployeeList,
                rows: [...prevState.EmployeeList.rows, item],
              },
            }));
          }
        });
      }

      request[field] = !!event.target ? event.target.value : data.value;
      this.setState({ request: request });
    } else {
      if (field === "orderDate") {
        request[field] = null;
      }
      if (field === "inspectors") {
        request[field] = [];
      }
      this.setState({ request: request });
    }
  }
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
  sendChange(event, field, data) {
    var send = this.state.send;
    send[field] = !!event.target ? event.target.value : data.value;
    this.setState({ send: send });
    this.state.send.id = this.state.request.id;
  }
  handleChangeTextArr(event, field, state, data) {
    if (state === "send") {
      var send = this.state.send;
      send[field] = !!event.target ? event.target.value : data.value;
      // this.state.send.id = this.state.request.id;
      this.setState({ send });
    }
    if (state === "makeNotified") {
      var makeNotified = this.state.makeNotified;
      makeNotified[field] = !!event.target ? event.target.value : data.value;
      // this.state.send.id = this.state.request.id;
      this.setState({ makeNotified });
    }
    if (state === "makeNotAgreed") {
      var makeNotAgreed = this.state.makeNotAgreed;
      makeNotAgreed[field] = !!event.target ? event.target.value : data.value;
      // this.state.send.id = this.state.request.id;
      this.setState({ makeNotAgreed });
    }
    if (state === "ToReject") {
      var toReject = this.state.toReject;
      if (!!event) {
        toReject[field] = !!event.target ? event.target.value : data.value;
        // this.state.toReject.id = this.state.request.id;
        this.setState({ toReject });
      } else {
        if (field === "letterDate") {
          toReject[field] = "";
        }
        this.setState({ toReject });
      }
    }
    if (state === "Redirect") {
      var redirect = this.state.redirect;
      if (!!event) {
        redirect[field] = !!event.target ? event.target.value : data.value;
        // this.state.toReject.id = this.state.request.id;
        if (field === "authorizedOrganizationId") {
          redirect.authorizedOrganization =
            this.state.AuthorizedOrganizationList.filter(
              (item) => item.value === redirect.authorizedOrganizationId
            )[0].text;
        }
        this.setState({ redirect });
      } else {
        if (field === "authorizedOrganizationId") {
          redirect.authorizedOrganization = "";
          redirect.authorizedOrganizationId = null;
        }
        this.setState({ redirect });
      }
    }
    if (state === "ToAgree") {
      var toAgree = this.state.toAgree;
      if (!!event) {
        toAgree[field] = !!event.target ? event.target.value : data.value;
        // this.state.toAgree.id = this.state.request.id;
        this.setState({ toAgree });
      } else {
        if (field === "letterDate") {
          toAgree[field] = "";
        }
        this.setState({ toAgree });
      }
    }
    if (state === "ReturnToModerator") {
      var returnToModerator = this.state.returnToModerator;
      returnToModerator[field] = !!event.target
        ? event.target.value
        : data.value;
      // this.state.returnToModerator.id = this.state.request.id;
      this.setState({ returnToModerator });
    }
    if (state === "Reject") {
      var reject = this.state.reject;
      reject[field] = !!event.target ? event.target.value : data.value;
      // this.state.reject.id = this.state.request.id;
      this.setState({ reject });
    }
    if (state === "Agree") {
      var agree = this.state.agree;
      agree[field] = !!event.target ? event.target.value : data.value;
      // this.state.agree.id = this.state.request.id;
      this.setState({ agree });
    }
    if (state === "Archive") {
      var archive = this.state.archive;
      archive[field] = !!event.target ? event.target.value : data.value;
      // this.state.archive.id = this.state.request.id;
      this.setState({ archive });
    }
  }

  toggle(tab) {
    // if(can("RequestAgree"))
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }
  toggleFileTabOne(tab) {
    if (this.state.activeTabFile !== tab) {
      this.setState({
        activeTabFile: tab,
      });
    }
  }
  toggleFileTabPostponement(tab) {
    if (this.state.activeTabFilePost !== tab) {
      this.setState({
        activeTabFilePost: tab,
      });
    }
  }
  toggleFileTabResult(tab) {
    if (this.state.activeTabFileResult !== tab) {
      this.setState({
        activeTabFileResult: tab,
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

  handleChangeOrderFile = (file, field) => {
    if (field == "basic") {
      let formData = new FormData();
      for (let i = 0; i < file.length; i++) {
        formData.append(`files`, file[i]);
      }
      const { request } = this.state;
      RequestService.UploadBasicFile(formData).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          request.basicFiles.push({
            id: res.data[i].fileId,
            name: res.data[i].fileName,
          });
        }
        this.setState({ request: request });
      });
    }
    if (field == "order") {
      let formData = new FormData();
      for (let i = 0; i < file.length; i++) {
        formData.append(`files`, file[i]);
      }
      const { request } = this.state;
      this.setState({ fileLoading: true });
      RequestService.UploadOrderFile(formData).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          request.orderFiles.push({
            id: res.data[i].fileId,
            name: res.data[i].fileName,
          });
        }
        this.setState({ request: request });
        this.setState({ fileLoading: false });
      });
    }
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
  GetRequestLetterEditableContent = (id) => {
    HtmlReportService.GetRequestLetterEditableContent(id)
      .then((res) => {
        this.setState({ LetterEditableContent: res.data });
        // successToast(t2("SuccessLetterEditableContent", this.props.intl));
      })
      .catch((error) => {
        errorToast(error.response.data);
        // this.setState({ ReceiveLoading: false });
      });
  };
  ReceiveFunction = () => {
    this.setState({ ReceiveLoading: true });
    RequestService.Receive(this.state.receive)
      .then((res) => {
        this.setState({ ReceiveLoading: false });
        successToast(t2("SuccessReceive", this.props.intl));
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ ReceiveLoading: false });
      });
    this.toggleModal();
  };

  SendFunction = () => {
    this.setState({ SendLoading: true });
    RequestService.Send(this.state.send)
      .then((res) => {
        this.setState({ SendLoading: false });
        successToast(t2("SuccessSend", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/request");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ SendLoading: false });
      });
    this.setState({ modal: false });
  };
  MakeNotified = () => {
    this.setState({ MakeNotifiedLoading: true });
    RequestService.MakeNotified(this.state.makeNotified)
      .then((res) => {
        this.setState({ MakeNotifiedLoading: false });
        successToast(t2("MakeNotified", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/request");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ MakeNotifiedLoading: false });
      });
    this.setState({ modal: false });
  };
  MakeNotAgreed = () => {
    this.setState({ MakeNotAgreedLoading: true });
    RequestService.MakeNotAgreed(this.state.makeNotAgreed)
      .then((res) => {
        this.setState({ MakeNotAgreedLoading: false });
        successToast(t2("MakeNotAgreed", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/request");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ MakeNotAgreedLoading: false });
      });
    this.setState({ modal: false });
  };
  RedirectFunction = () => {
    this.setState({ RedirectLoading: true });
    RequestService.Redirect(this.state.redirect)
      .then((res) => {
        this.setState({ RedirectLoading: false });
        successToast(t2("SuccessRedirect", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/request");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ RedirectLoading: false });
      });
    this.setState({ modal: false });
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
    if (
      this.state.toAgree.agreedCheckDaysNumber === 0 ||
      this.state.toAgree.agreedCheckDaysNumber === null ||
      this.state.toAgree.agreedCheckDaysNumber === "" ||
      this.state.toAgree.agreedCheckDaysNumber === undefined
    ) {
      customErrorToast(t2("enteragreedCheckDaysNumber", this.props.intl));
      return false;
    }
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
  PrewToAgreeLetter = () => {
    if (!this.CheckToAgree()) {
      return false;
    }
    this.setState({ PrewToAgreeLetterLoading: true });
    RequestService.PrewToAgreeLetter(this.state.toAgree)
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
    RequestService.GetToAgreeLetterContent(this.state.toAgree)
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
    RequestService.GetToRejectLetterContent(this.state.toReject)
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
    RequestService.PrewToRejectLetter(this.state.toReject)
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
  ResetLetterContent = () => {
    this.setState({ ResetLetterContentLoading: true });
    RequestService.ResetLetterContent(this.state.toReject)
      .then((res) => {
        this.setState({
          ResetLetterContent: res.data,
          ResetLetterContentLoading: false,
        });
        setTimeout(() => {}, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ ResetLetterContentLoading: false });
      });
  };
  ToRejectFunctionLetter = () => {
    if (!this.CheckToReject()) {
      return false;
    }
    this.setState({ ToRejectLoading: true });
    RequestService.PrewToRejectLetter(this.state.toReject)
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
  ToRejectFunction = () => {
    if (!this.CheckToReject()) {
      return false;
    }
    this.setState({ ToRejectLoading: true });
    RequestService.ToReject(this.state.toReject)
      .then((res) => {
        this.setState({ ToRejectLoading: false });
        successToast(t2("SuccessToReject", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/request");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ ToRejectLoading: false });
      });
    this.setState({ modal: false });
  };
  ToAgreeFunctionLetter = () => {
    this.setState({ ToAgreeLoading: true });
    RequestService.PrewToAgreeLetter(this.state.toAgree)
      .then((res) => {
        this.setState({ ToAgreeLoading: false });
        this.PrewToAgreeLetter();
        // successToast(t2("SuccessToAgree", this.props.intl));
        setTimeout(() => {
          // this.props.history.push("/document/request");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ ToAgreeLoading: false });
      });
    this.setState({ modalLetter: false });
  };
  ToAgreeFunction = () => {
    this.setState({ ToAgreeLoading: true });
    RequestService.ToAgree(this.state.toAgree)
      .then((res) => {
        this.setState({ ToAgreeLoading: false });
        successToast(t2("SuccessToAgree", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/request");
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
    RequestService.Revoke(this.state.revoke)
      .then((res) => {
        this.setState({ RevokeLoading: false });
        successToast(t2("SuccessRevoke", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/request");
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
    RequestService.RefuseByModerator(this.state.refusebymoderator)
      .then((res) => {
        this.setState({ RefuseByModeratorLoading: false });
        successToast(t2("SuccessRefuseByModerator", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/request");
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
    RequestService.ToApprove(this.state.toapprove)
      .then((res) => {
        this.setState({ ToApproveLoading: false });
        successToast(t2("SuccessToApprove", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/request");
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
    RequestService.ReturnToModerator(this.state.returnToModerator)
      .then((res) => {
        this.setState({ ReturnToModeratorLoading: false });
        successToast(t2("SuccessReturnToModerator", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/request");
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
    RequestService.Reject(this.state.reject)
      .then((res) => {
        this.setState({ RejectLoading: false });
        successToast(t2("SuccessReject", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/request");
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
    RequestService.Agree(this.state.agree)
      .then((res) => {
        this.setState({ AgreeLoading: false });
        successToast(t2("SuccessAgree", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/request");
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
    RequestService.Archive(this.state.archive)
      .then((res) => {
        this.setState({ ArchiveLoading: false });
        successToast(t2("SuccessArchive", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/request");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ ArchiveLoading: false });
      });
    this.setState({ modal: false });
  };
  DeleteFunction = () => {
    this.setState({ DeleteLoading: true });
    RequestService.Delete(this.props.match.params.id)
      .then((res) => {
        this.setState({ DeleteLoading: false });
        successToast(t2("SuccessDelete", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/request");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ DeleteLoading: false });
      });
    this.setState({ modal: false });
  };
  CancelAgreementFunction = () => {
    this.setState({ CancelAgreementLoading: true });
    RequestService.Agree(this.state.cancelagreement)
      .then((res) => {
        this.setState({ CancelAgreementLoading: false });
        successToast(t2("SuccessCancelAgreement", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/request");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ CancelAgreementLoading: false });
      });
    this.setState({ modal: false });
  };
  DownloadReportPdf = (id) => {
    this.setState({ DownloadReportPdfLoading: true });
    HtmlReportService.DownloadRequestPdf(
      this.state.request.answerLetterId,
      this.state.lang
    )
      .then((res) => {
        this.setState({ DownloadReportPdfLoading: false });
        successToast(t2("DownloadSuccess", this.props.intl));
        // this.forceFileDownload(res, this.props.match.params.id, "");
        window.open(
          `${axios.defaults.baseURL}/report/DownloadRequestPdf/${id}?__lang=${this.state.lang}`
        );
        // this.props.history.push();
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ DownloadReportPdfLoading: false });
      });
  };

  DownloadFile = (item, index, field) => {
    this.setState({ downloadLoad: { check: true, id: item.id } });
    RequestService.DownloadFile(item.id, field)
      .then((res) => {
        this.setState({ downloadLoad: { check: false, id: item.id } });
        successToast(t2("DownloadSuccess", this.props.intl));
        this.forceFileDownload(res, item.id, item.fileName);
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
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
  DownloadFileInspectionAct = (item, index, field) => {
    this.setState({ downloadLoad: { check: true, id: item.id } });
    InspectionResultService.DownloadActFile(item.id)
      .then((res) => {
        this.setState({ downloadLoad: { check: false, id: item.id } });
        successToast(t2("DownloadSuccess", this.props.intl));
        this.forceFileDownload(res, item.id, item.fileName);
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
  };
  DeleteFileMeasuresOfInfluence = (item, index, field) => {
    this.setState({ downloadLoad: { check: true, id: item.id } });
    InspectionResultService.DownloadMeasuresOfInfluenceFile(item.id)
      .then((res) => {
        this.setState({ downloadLoad: { check: false, id: item.id } });
        successToast(t2("DownloadSuccess", this.props.intl));
        this.forceFileDownload(res, item.id, item.fileName);
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
  };
  DeleteFileCancelledMeasures = (item, index, field) => {
    this.setState({ downloadLoad: { check: true, id: item.id } });
    InspectionResultService.DownloadCancelledMeasuresFile(item.id)
      .then((res) => {
        this.setState({ downloadLoad: { check: false, id: item.id } });
        successToast(t2("DownloadSuccess", this.props.intl));
        this.forceFileDownload(res, item.id, item.fileName);
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
  };
  DeleteFileMeasuresResult = (item, index, field) => {
    this.setState({ downloadLoad: { check: true, id: item.id } });
    InspectionResultService.DownloadMeasuresResultFile(item.id)
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

  SaveDataRePost = () => {
    this.setState({ SaveLoading: true });
    RequestPostponementService.Update(this.state.requestpostponement)
      .then((res) => {
        this.setState({ SaveLoading: false });
        successToast(t2("SuccessSave", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/request");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ SaveLoading: false });
      });
  };
  checkInspectors() {
    if (
      this.state.request.orderFiles.length != 0 &&
      this.state.request.inspectors.length == 0
    ) {
      customErrorToast(t2("inspectorsNotSelected", this.props.intl));
      return false;
    }
    return true;
  }
  SaveAttachOrder = () => {
    if (!this.checkInspectors()) {
      return false;
    }
    this.setState({ SaveLoading: true });
    RequestService.AttachOrder(this.state.request)
      .then((res) => {
        this.setState({ SaveLoading: false });
        successToast(t2("SuccessSave", this.props.intl));
        setTimeout(() => {
          this.props.history.push("/document/request");
        }, 500);
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ SaveLoading: false });
      });
  };
  DeleteFile = (data, index, field) => {
    let request = this.state.request;
    let test;
    if (field == "basic") {
      test = request.basicFiles?.filter((item) => item.id !== data.id);
      this.setState((prevState) => ({
        request: {
          ...prevState.request,
          basicFiles: test,
        },
      }));
    }
    if (field == "order") {
      test = request.orderFiles?.filter((item) => item.id !== data.id);
      this.setState((prevState) => ({
        request: {
          ...prevState.request,
          orderFiles: test,
        },
      }));
    }
  };
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

  loadOptions = async (inputText, callback) => {
    const { page, search, request, EmployeeList } = this.state;

    const res = await EmployeeService.GetAsSelectList({
      parentOrganizationId: request.orderedOrganizationId,
      organizationId: request.inspectionOrganizationId,
      inspectionOrganizationId: true,
      isHr: false,
      isPassedAttestation: true,
      sortBy: page.sortBy,
      orderType: page.orderType,
      page: page.page,
      pageSize: page.pageSize,
      search: inputText,
    });
    callback(
      res.data.rows.map((item) => ({ text: item.text, value: item.value }))
    );
  };

  render() {
    const {
      DownloadReportPdfLoading,
      loading,
      ReceiveLoading,
      SendLoading,
      RevokeLoading,
      postponement,
      inspectionresult,
      RefuseByModeratorLoading,
      ToApproveLoading,
      ReturnToModeratorLoading,
      CancelAgreementLoading,
      RejectLoading,
      AgreeLoading,
      PrewToRejectLetter,
      request,
      requestHistory,
      inspectionbook,
      revoke,
      refusebymoderator,
      toapprove,
      cancelagreement,
      returntomoderator,
      SaveLoading,
      downloadLoad,
      send,
      makeNotified,
      makeNotAgreed,
      toReject,
      toAgree,
      returnToModerator,
      reject,
      agree,
      archive,
      DeleteLoading,
      RejectList,
      ToRejectLoading,
      ToAgreeLoading,
      ArchiveLoading,
      EmployeeList,
      HtmlData,
      redirect,
      LetterEditableContent,
      RedirectLoading,
      GetToRejectLetterContent,
      EditToRejectLetteLoading,
      PrewToRejectLetterLoading,
      ResetLetterContentLoading,
      ResetLetterContent,
      PrewToAgreeLetterLoading,
      EditToAgreeLetterLoading,
      PrewToAgreeLetter,
      MakeNotAgreedLoading,
      GetToAgreeLetterContent,
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
          {/* <div
            className="mydiv"
            dangerouslySetInnerHTML={{
              __html: this.state.GetToRejectLetterContent.letterEditableContent,
            }}
          ></div> */}
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
                  {/* <ReactQuill
                    className="shortContent"
                    // theme="snow"
                    value={
                      this.state.GetToRejectLetterContent.letterEditableContent
                    }
                    onChange={(e) => this.onEditorStateChangeShort(e)}
                    bounds={`[data-text-editor="form-editor"]`}
                    modules={modules}
                    // modules={{
                    //   toolbar: [
                    //     ["bold", "italic", "underline", "strike"], // toggled buttons
                    //     ["blockquote", "code-block"],

                    //     [{ header: 1 }, { header: 2 }], // custom button values
                    //     [{ list: "ordered" }, { list: "bullet" }],
                    //     [{ script: "sub" }, { script: "super" }], // superscript/subscript
                    //     [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
                    //     [{ direction: "rtl" }], // text direction

                    //     [{ size: ["0.75em", "1em", "1.5em", "2.5em"] }], // custom dropdown
                    //     [{ header: [1, 2, 3, 4, 5, 6, false] }],

                    //     [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                    //     [{ font: [] }],
                    //     ["link", "image", "video"],
                    //     [{ align: [] }],

                    //     ["clean"],
                    //   ],
                    //   clipboard: {
                    //     // toggle to add extra line breaks when pasting HTML:
                    //     matchVisual: false,
                    //   },
                    // }}
                    // formats={[
                    //   "header",
                    //   "font",
                    //   "size",
                    //   "bold",
                    //   "italic",
                    //   "underline",
                    //   "strike",
                    //   "blockquote",
                    //   "list",
                    //   "bullet",
                    //   "indent",
                    //   "link",
                    //   "image",
                    //   "video",
                    // ]}
                    // bounds={".app"}
                  /> */}
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
                {/* <ReactQuill
                  className="shortContent"
                  // theme="snow"
                  value={
                    this.state.GetToAgreeLetterContent.letterEditableContent
                  }
                  onChange={(e) => this.onEditorStateChangeShortAgree(e)}
                  bounds={`[data-text-editor="form-editor"]`}
                  modules={modules}
                /> */}
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
        {request.statusId == 1 || request.statusId == 12 ? (
          <Card>
            <Alert className="m-1" color={this.getAlertColor(request.statusId)}>
              <p style={{ color: "black" }}>
                {t1("DocumentStatus")} -{" "}
                {
                  // can("RequestAgree") || can("AllRequestAgree")
                  //   ? request.ceoStatus
                  //   : can("RequestReceive") || can("AllRequestReceive")
                  //   ? request.moderatorStatus
                  //   : can("RequestView") ||
                  //     can("BranchesRequestView") ||
                  //     can("AllRequestView")
                  //   ? request.inspectorStatus
                  //   :
                  request.status
                }
              </p>
            </Alert>
          </Card>
        ) : (
          ""
        )}
        <Card>
          <h2 className="text-success m-1">
            <Icon.CheckCircle /> {request.contractor.shortName}
          </h2>
        </Card>
        <Card className="p-2">
          <Nav pills>
            {(can("RequestAgree") ||
              can("RequestReceive") ||
              can("AllRequestReceive")) &&
            request.statusId != 2 &&
            request.checkTypeId != 2 ? (
              <NavItem>
                <NavLink
                  className={{ active: this.state.activeTab === "6" }}
                  onClick={() => {
                    this.toggle("6");
                  }}
                >
                  <span style={{ fontSize: "24px" }}>
                    {" "}
                    {t1("Request")} PDF{" "}
                  </span>
                </NavLink>
              </NavItem>
            ) : (
              ""
            )}
            <>
              <NavItem>
                <NavLink
                  className={{ active: this.state.activeTab === "1" }}
                  onClick={() => {
                    this.toggle("1");
                  }}
                >
                  <span style={{ fontSize: "24px" }}> {t1("Request")} </span>
                </NavLink>
              </NavItem>
              {request.requestPostponementId != null ? (
                <NavItem>
                  <NavLink
                    className={{ active: this.state.activeTab === "2" }}
                    onClick={() => {
                      this.toggle("2");
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>
                      {" "}
                      {t1("RequestPostponement")}{" "}
                    </span>
                  </NavLink>
                </NavItem>
              ) : (
                ""
              )}
              {request.inspectionBookId != null ? (
                <NavItem>
                  <NavLink
                    className={{ active: this.state.activeTab === "3" }}
                    onClick={() => {
                      this.toggle("3");
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>
                      {" "}
                      {t1("InspectionBook")}{" "}
                    </span>
                  </NavLink>
                </NavItem>
              ) : (
                ""
              )}
              {request.inspectionResultId != null ? (
                <NavItem>
                  <NavLink
                    className={{ active: this.state.activeTab === "4" }}
                    onClick={() => {
                      this.toggle("4");
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>
                      {" "}
                      {t1("InspectionResult")}{" "}
                    </span>
                  </NavLink>
                </NavItem>
              ) : (
                ""
              )}
            </>
            <NavItem>
              <NavLink
                className={{ active: this.state.activeTab === "5" }}
                onClick={() => {
                  this.toggle("5");
                  this.GetHistory();
                }}
              >
                <span style={{ fontSize: "24px" }}> {t1("History")} </span>
              </NavLink>
            </NavItem>
          </Nav>

          <Row>
            <Col>
              <TabContent activeTab={this.state.activeTab}>
                {(can("RequestAgree") ||
                  can("RequestReceive") ||
                  can("AllRequestReceive")) &&
                request.checkTypeId != 2 &&
                request.statusId != 2 &&
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
                              `/report/GetRequestAsHtml/${this.state.request.id}?__lang=${this.state.lang}`
                            }
                          ></iframe>
                        </Col>
                      </Row>
                    </div>
                  </TabPane>
                ) : (
                  ""
                )}
                <>
                  <TabPane tabId="1">
                    <Row>
                      <Col sm={12} md={12} lg={12}>
                        <Table striped>
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
                                  {t1("DocumentInfo")} -{" "}
                                  <span
                                    style={{
                                      color: "#004242",
                                      fontSize: "22px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {request.status}
                                  </span>
                                </h6>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("docNumber")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900 text-left">
                                  {request.docNumber}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("docDate")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900">
                                  {request.docDate}
                                </h6>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("checkStartDate")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900 text-left">
                                  {request.checkStartDate}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("checkEndDate")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900">
                                  {request.checkEndDate}
                                </h6>
                              </td>
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
                                  {request.contractor.innOrPinfl}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("contractor")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900">
                                  {request.contractor.fullName}
                                </h6>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("Region")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900">
                                  {request.contractor.region}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("District")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900">
                                  {request.contractor.district}
                                </h6>
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">
                                <h6 className="text-bold-600">{t1("Oked")}</h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900">
                                  {request.contractor.oked}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("checkTypeId")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900">
                                  {request.checkType}
                                </h6>
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">
                                <h6 className="text-bold-600">
                                  {t1("checkBasisId")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900">
                                  {request.checkBasis}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("basicFiles")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {" "}
                                  {request.basicFiles?.map((item, index) => (
                                    <Badge
                                      id="position"
                                      color="primary"
                                      style={{
                                        marginBottom: "2px",
                                        whiteSpace: "normal",
                                      }}
                                      className="mr-1"
                                      key={index}
                                    >
                                      {downloadLoad.check &&
                                      downloadLoad.id == item.id ? (
                                        <Spinner color="dark" size="sm" />
                                      ) : (
                                        <Icon.Download
                                          onClick={() =>
                                            this.DownloadFile(
                                              item,
                                              index,
                                              "basic"
                                            )
                                          }
                                          style={{ cursor: "pointer" }}
                                          size={15}
                                        />
                                      )}

                                      {item.fileName}
                                      <UncontrolledTooltip
                                        placement="top"
                                        target="position"
                                      >
                                        {t1("dateOfCreatedFile")} -{" "}
                                        {item.dateOfCreated}
                                      </UncontrolledTooltip>
                                    </Badge>
                                  ))}
                                </h6>
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">
                                <h6 className="text-bold-600">
                                  {t1("checkCoverageStartDate")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900">
                                  {request.checkCoverageStartDate}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("checkCoverageEndDate")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900">
                                  {request.checkCoverageEndDate}
                                </h6>
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">
                                <h6 className="text-bold-600">
                                  {t1("checkDaysNumber")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900">
                                  {request.checkDaysNumber}
                                </h6>
                              </td>
                              <td scope="row">
                                <h6 className="text-bold-600">
                                  {t1("agreedCheckDaysNumber")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900">
                                  {request.agreedCheckDaysNumber}
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
                                  {request.orderedOrganization}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("inspectionOrganizationId")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900">
                                  {request.inspectionOrganization}
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
                                  {request.authorizedOrganization}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600 mb-1">
                                  {t1("checkSubjectsQuiz")}
                                </h6>
                                <h6 className="text-bold-600">
                                  {t1("canViolatedLegalDocumentsQuiz")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900">
                                  {request.checkSubjects?.map((item, index) => (
                                    <Badge
                                      color="primary"
                                      style={{
                                        marginBottom: "2px",
                                        whiteSpace: "normal",
                                      }}
                                      className="mr-1"
                                      key={index}
                                    >
                                      {item}
                                    </Badge>
                                  ))}
                                  {/* {request.canViolatedLegalDocuments?.map(
                                    (item, index) => (
                                      <Badge
                                        style={{
                                          marginBottom: "2px",
                                          whiteSpace: "normal",
                                        }}
                                        color="success"
                                        className="mr-1"
                                        key={index}
                                      >
                                        {item}{" "}
                                      </Badge>
                                    )
                                  )} */}
                                </h6>
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">
                                <h6 className="text-bold-600">
                                  {t1("organizationInspectionTypeId")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900">
                                  {request.organizationInspectionType}
                                </h6>
                              </td>
                              <td scope="row">
                                <h6 className="text-bold-600">
                                  {t1("orderNumber")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900">
                                  {request.orderNumber}
                                </h6>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("orderFiles")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {" "}
                                  {request.orderFiles?.map((item, index) => (
                                    <Badge
                                      id="orderFiles"
                                      color="primary"
                                      style={{
                                        margin: "2px",
                                        whiteSpace: "normal",
                                      }}
                                      key={index}
                                    >
                                      {downloadLoad.check &&
                                      downloadLoad.id == item.id ? (
                                        <Spinner color="dark" size="sm" />
                                      ) : (
                                        <Icon.Download
                                          onClick={() =>
                                            this.DownloadFile(
                                              item,
                                              index,
                                              "order"
                                            )
                                          }
                                          style={{ cursor: "pointer" }}
                                          size={15}
                                        />
                                      )}
                                      {item.fileName}
                                      <UncontrolledTooltip
                                        placement="top"
                                        target="orderFiles"
                                      >
                                        {t1("dateOfCreatedFile")} -{" "}
                                        {item.dateOfCreated}
                                      </UncontrolledTooltip>
                                    </Badge>
                                  ))}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600 mb-1">
                                  {t1("inspectors")}
                                </h6>
                              </td>
                              <td colSpan={3}>
                                <h6 className="text-bold-900">
                                  {request.inspectorNames?.map(
                                    (item, index) => (
                                      <Badge
                                        style={{
                                          marginBottom: "2px",
                                          whiteSpace: "normal",
                                        }}
                                        color="success"
                                        className="mr-1"
                                        key={index}
                                      >
                                        {item}{" "}
                                      </Badge>
                                    )
                                  )}
                                </h6>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                        {request.rejectionReasons?.length != 0 ? (
                          <div>
                            <Table>
                              <tbody>
                                <tr>
                                  <td
                                    className="text-center"
                                    style={{ color: "red", fontSize: "18px" }}
                                  >
                                    {t1("rejectionReason")}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    {request.rejectionReasonNames?.map(
                                      (item, index) => (
                                        <Badge
                                          style={{
                                            marginBottom: "2px",
                                            fontSize: "16px",
                                            whiteSpace: "normal",
                                          }}
                                          color="danger"
                                          className="mr-1"
                                          key={index}
                                        >
                                          {item}{" "}
                                        </Badge>
                                      )
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        ) : (
                          ""
                        )}
                      </Col>
                    </Row>
                    <Nav pills>
                      {request?.basicFiles?.length != 0 ? (
                        <NavItem>
                          <NavLink
                            className={{
                              active: this.state.activeTabFile === "1",
                            }}
                            onClick={() => {
                              this.toggleFileTabOne("1");
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

                      {request?.orderFiles?.length != 0 ? (
                        <NavItem>
                          <NavLink
                            className={{
                              active: this.state.activeTabFile === "2",
                            }}
                            onClick={() => {
                              this.toggleFileTabOne("2");
                            }}
                          >
                            <span style={{ fontSize: "24px" }}>
                              {" "}
                              {t1("orderFiles")}
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
                            {request.basicFiles?.map((item, index) => (
                              <Row key={index}>
                                <Col sm={12} md={12} lg={12}>
                                  {/* <Iframe
                              headers={{
                                Authorization: `Bearer ${token}`,
                                type: "application/pdf",
                              }}
                              src={
                                axios.defaults.baseURL +
                                `/Request/DownloadBasicFile/${item.id}`
                              }
                            ></Iframe> */}
                                  <iframe
                                    width={"100%"}
                                    height={"1000px"}
                                    src={
                                      axios.defaults.baseURL +
                                      `/Request/DownloadBasicFile/${item.id}`
                                    }
                                  ></iframe>
                                </Col>
                              </Row>
                            ))}
                          </Col>
                        </Row>
                      </TabPane>
                      <TabPane tabId="2">
                        <Row>
                          <Col sm={12} md={12} lg={12}>
                            {request.orderFiles?.map((item, index) => (
                              <Row key={index}>
                                <Col sm={12} md={12} lg={12}>
                                  <iframe
                                    width={"100%"}
                                    height={"1000px"}
                                    src={
                                      axios.defaults.baseURL +
                                      `/Request/DownloadOrderFile/${item.id}`
                                    }
                                  ></iframe>
                                </Col>
                              </Row>
                            ))}
                          </Col>
                        </Row>
                      </TabPane>
                    </TabContent>
                  </TabPane>
                  <TabPane tabId="2">
                    {request.requestPostponementId != null ? (
                      <div>
                        <Table striped>
                          <tbody>
                            <tr>
                              <td colSpan={4}>
                                <h6
                                  style={{ color: "#9457EB" }}
                                  className="text-bold-600 text-center"
                                >
                                  {t1("RequestPostponement")}
                                </h6>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("docDate")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900 text-right">
                                  {postponement.docDate}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("requestStatus")}
                                </h6>
                              </td>
                              <td>
                                {postponement.requestStatusId == 13 ? (
                                  <h6 className="text-bold-900">
                                    {t1("Перенос")}
                                  </h6>
                                ) : (
                                  ""
                                )}
                                {postponement.requestStatusId == 14 ? (
                                  <h6 className="text-bold-900">
                                    {t1("Продление")}
                                  </h6>
                                ) : (
                                  ""
                                )}
                                {postponement.requestStatusId == 15 ? (
                                  <h6 className="text-bold-900">
                                    {t1("Отмена")}
                                  </h6>
                                ) : (
                                  ""
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("startDate")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900 text-right">
                                  {postponement.startDate}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("endDate")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900">
                                  {postponement.endDate}
                                </h6>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("reason")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900 text-right">
                                  {postponement.reason}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("basicFiles")}
                                </h6>
                              </td>
                              <td>
                                {postponement.files?.map((item, index) => (
                                  <Badge
                                    id="basicFiles"
                                    style={{
                                      marginBottom: "2px",
                                      whiteSpace: "normal",
                                    }}
                                    color="primary"
                                    className="mr-1"
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
                                      target="basicFiles"
                                    >
                                      {t1("dateOfCreatedFile")} -{" "}
                                      {item.dateOfCreated}
                                    </UncontrolledTooltip>
                                  </Badge>
                                ))}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    ) : (
                      ""
                    )}
                    <Nav tabs>
                      {postponement?.files?.length != 0 ? (
                        <NavItem>
                          <NavLink
                            className={{
                              active: this.state.activeTabFilePost === "1",
                            }}
                            onClick={() => {
                              this.toggleFileTabPostponement("1");
                            }}
                          >
                            <h5> {t1("basicFiles")}</h5>
                          </NavLink>
                        </NavItem>
                      ) : (
                        ""
                      )}
                    </Nav>
                    <TabContent activeTab={this.state.activeTabFilePost}>
                      <TabPane tabId="1">
                        <Row>
                          <Col sm={12} md={12} lg={12}>
                            {postponement.files?.map((item, index) => (
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
                  </TabPane>
                  <TabPane tabId="3">
                    {request.inspectionBookId != null ? (
                      <div>
                        <Table striped>
                          <tbody>
                            <tr>
                              <td colSpan={4}>
                                <h6
                                  style={{ color: "#3197EB" }}
                                  className="text-bold-600 text-center"
                                >
                                  {t1("InspectionBook")}
                                </h6>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("docDate")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900 text-right">
                                  {inspectionbook.docDate}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("orderNumber")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900 text-right">
                                  {inspectionbook.orderNumber}
                                </h6>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("startDate")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900 text-right">
                                  {inspectionbook.startDate}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("endDate")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900">
                                  {inspectionbook.endDate}
                                </h6>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("checkDaysNumber")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900 text-right">
                                  {inspectionbook.checkDaysNumber}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("inspectors")}
                                </h6>
                              </td>
                              <td>
                                {inspectionbook.inspectorNames?.map(
                                  (item, index) => (
                                    <Badge
                                      style={{
                                        marginBottom: "2px",
                                        whiteSpace: "normal",
                                      }}
                                      color="success"
                                      className="mr-1"
                                      key={index}
                                    >
                                      {item}{" "}
                                    </Badge>
                                  )
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                {/* <h6 className="text-bold-600">{t1("reason")}</h6> */}
                              </td>
                              <td>
                                {/* <h6 className="text-bold-900 text-right">
                                {inspectionbook.reason}
                              </h6> */}
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("controlFunctionNames")}
                                </h6>
                              </td>
                              <td>
                                {inspectionbook.controlFunctionNames?.map(
                                  (item, index) => (
                                    <Badge
                                      style={{
                                        marginBottom: "2px",
                                        whiteSpace: "normal",
                                      }}
                                      color="primary"
                                      className="mr-1"
                                      key={index}
                                    >
                                      {item}{" "}
                                    </Badge>
                                  )
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td
                                className="text-center text-bold-600"
                                colSpan={4}
                              >
                                {t1("specialists")}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-center text-bold-600">
                                {t1("fullname")}
                              </td>
                              <td className="text-center text-bold-600">
                                {t1("workplace")}
                              </td>
                              <td className="text-center text-bold-600">
                                {t1("directionOfActivity")}
                              </td>
                              <td className="text-center text-bold-600">
                                {t1("contractNumber")}
                              </td>
                            </tr>
                            <>
                              {inspectionbook.specialists?.map(
                                (item2, index2) => (
                                  <tr key={index2}>
                                    <td className="text-bold-900 text-left">
                                      {item2.fullName}
                                    </td>
                                    <td className="text-bold-900 text-left">
                                      {item2.workplace}
                                    </td>
                                    <td className="text-bold-900 text-left">
                                      {item2.directionOfActivity}
                                    </td>
                                    <td className="text-bold-900 text-left">
                                      {item2.contractNumber}
                                    </td>
                                  </tr>
                                )
                              )}
                            </>
                          </tbody>
                        </Table>
                      </div>
                    ) : (
                      ""
                    )}
                  </TabPane>
                  <TabPane tabId="4">
                    {request.inspectionResultId != null ? (
                      <div>
                        <Table striped>
                          {/* <thead>
                      <tr>
                        <tr>{t1("DocumentInfo")}</tr>
                      </tr>
                    </thead> */}
                          <tbody>
                            <tr>
                              <td colSpan={4}>
                                <p
                                  style={{ color: "blue" }}
                                  className="text-bold-600 text-center"
                                >
                                  {t1("InspectionResult")}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("docDate")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900 text-right">
                                  {inspectionresult.docDate}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {/* {t1("startDateTab4")} */}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900 text-right">
                                  {/* {inspectionresult.startDate} */}
                                </h6>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("startDateTab4")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900 text-right">
                                  {inspectionresult.startDate}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("endDateTab4")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900 text-right">
                                  {inspectionresult.endDate}
                                </h6>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h6 className="text-bold-600 mb-1">
                                  {t1("inspectors")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900">
                                  {inspectionresult.inspectorNames?.map(
                                    (item, index) => (
                                      <Badge
                                        style={{
                                          marginBottom: "2px",
                                          whiteSpace: "normal",
                                        }}
                                        color="success"
                                        className="mr-1"
                                        key={index}
                                      >
                                        {item}{" "}
                                      </Badge>
                                    )
                                  )}
                                </h6>
                              </td>
                              <td>
                                {/* <h6 className="text-bold-600 mb-1">
                            {t1("checkSubjectsQuiz")}
                          </h6> */}
                                <h6 className="text-bold-600">
                                  {t1("canViolatedLegalDocumentsQuiz")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900">
                                  {/* {inspectionresult.checkSubjects?.map(
                              (item, index) => (
                                <Badge
                                  color="primary"
                                  className="mr-1 mb-1"
                                  key={index}
                                >
                                  {item}{" "}
                                </Badge>
                              )
                            )} */}
                                  {inspectionresult.canViolatedLegalDocuments?.map(
                                    (item, index) => (
                                      <Badge
                                        style={{
                                          marginBottom: "2px",
                                          whiteSpace: "normal",
                                        }}
                                        color="success"
                                        className="mr-1"
                                        key={index}
                                      >
                                        {item}{" "}
                                      </Badge>
                                    )
                                  )}
                                </h6>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("comment")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900 text-right">
                                  {inspectionresult.comment}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("actFiles")}
                                </h6>
                              </td>
                              <td>
                                {inspectionresult.actFiles?.map(
                                  (item, index) => (
                                    <Badge
                                      id="actFiles"
                                      color="primary"
                                      style={{
                                        marginBottom: "2px",
                                        whiteSpace: "normal",
                                      }}
                                      className="mr-1"
                                      key={index}
                                    >
                                      <Icon.Download
                                        onClick={() =>
                                          this.DownloadFileInspectionAct(
                                            item,
                                            index
                                          )
                                        }
                                        style={{ cursor: "pointer" }}
                                        size={15}
                                      />{" "}
                                      {item.name || item.fileName}{" "}
                                      <UncontrolledTooltip
                                        placement="top"
                                        target="actFiles"
                                      >
                                        {t1("dateOfCreatedFile")} -{" "}
                                        {item.dateOfCreated}
                                      </UncontrolledTooltip>
                                    </Badge>
                                  )
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("measuresOfInfluence")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900 text-right">
                                  {inspectionresult.measuresOfInfluence}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("measuresOfInfluenceFiles")}
                                </h6>
                              </td>
                              <td>
                                {inspectionresult.measuresOfInfluenceFiles?.map(
                                  (item, index) => (
                                    <Badge
                                      id="measuresOfinf"
                                      color="primary"
                                      style={{
                                        marginBottom: "2px",
                                        whiteSpace: "normal",
                                      }}
                                      className="mr-1"
                                      key={index}
                                    >
                                      <Icon.Download
                                        onClick={() =>
                                          this.DeleteFileMeasuresOfInfluence(
                                            item,
                                            index
                                          )
                                        }
                                        style={{ cursor: "pointer" }}
                                        size={15}
                                      />{" "}
                                      {item.name || item.fileName}{" "}
                                      <UncontrolledTooltip
                                        placement="top"
                                        target="measuresOfinf"
                                      >
                                        {t1("dateOfCreatedFile")} -{" "}
                                        {item.dateOfCreated}
                                      </UncontrolledTooltip>
                                    </Badge>
                                  )
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("measuresResult")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900 text-right">
                                  {inspectionresult.measuresResult}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("measuresResultFiles")}
                                </h6>
                              </td>
                              <td>
                                {inspectionresult.measuresResultFiles?.map(
                                  (item, index) => (
                                    <Badge
                                      id="measuresResultFiles"
                                      color="primary"
                                      style={{
                                        marginBottom: "2px",
                                        whiteSpace: "normal",
                                      }}
                                      className="mr-1"
                                      key={index}
                                    >
                                      <Icon.Download
                                        onClick={() =>
                                          this.DeleteFileMeasuresResult(
                                            item,
                                            index
                                          )
                                        }
                                        style={{ cursor: "pointer" }}
                                        size={15}
                                      />{" "}
                                      {item.name || item.fileName}{" "}
                                      <UncontrolledTooltip
                                        placement="top"
                                        target="measuresResultFiles"
                                      >
                                        {t1("dateOfCreatedFile")} -{" "}
                                        {item.dateOfCreated}
                                      </UncontrolledTooltip>
                                    </Badge>
                                  )
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("cancelledMeasures")}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-900 text-right">
                                  {inspectionresult.cancelledMeasures}
                                </h6>
                              </td>
                              <td>
                                <h6 className="text-bold-600">
                                  {t1("cancelledMeasuresFiles")}
                                </h6>
                              </td>
                              <td>
                                {inspectionresult.cancelledMeasuresFiles?.map(
                                  (item, index) => (
                                    <Badge
                                      id="cancelledMeasuresFiles"
                                      color="primary"
                                      className="mr-1"
                                      key={index}
                                      style={{ whiteSpace: "normal" }}
                                    >
                                      <Icon.Download
                                        onClick={() =>
                                          this.DeleteFileCancelledMeasures(
                                            item,
                                            index
                                          )
                                        }
                                        style={{ cursor: "pointer" }}
                                        size={15}
                                      />{" "}
                                      {item.name || item.fileName}{" "}
                                      <UncontrolledTooltip
                                        placement="top"
                                        target="cancelledMeasuresFiles"
                                      >
                                        {t1("dateOfCreatedFile")} -{" "}
                                        {item.dateOfCreated}
                                      </UncontrolledTooltip>
                                    </Badge>
                                  )
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                        <Nav tabs>
                          {inspectionresult?.actFiles?.length != 0 ? (
                            <NavItem>
                              <NavLink
                                className={{
                                  active:
                                    this.state.activeTabFileResult === "1",
                                }}
                                onClick={() => {
                                  this.toggleFileTabResult("1");
                                }}
                              >
                                <h5> {t1("actFiles")}</h5>
                              </NavLink>
                            </NavItem>
                          ) : (
                            ""
                          )}
                          {inspectionresult?.measuresOfInfluenceFiles?.length !=
                          0 ? (
                            <NavItem>
                              <NavLink
                                className={{
                                  active:
                                    this.state.activeTabFileResult === "2",
                                }}
                                onClick={() => {
                                  this.toggleFileTabResult("2");
                                }}
                              >
                                <h5> {t1("measuresOfInfluenceFiles")}</h5>
                              </NavLink>
                            </NavItem>
                          ) : (
                            ""
                          )}
                          {inspectionresult?.measuresResultFiles?.length !=
                          0 ? (
                            <NavItem>
                              <NavLink
                                className={{
                                  active:
                                    this.state.activeTabFileResult === "3",
                                }}
                                onClick={() => {
                                  this.toggleFileTabResult("3");
                                }}
                              >
                                <h5> {t1("measuresResultFiles")}</h5>
                              </NavLink>
                            </NavItem>
                          ) : (
                            ""
                          )}
                          {inspectionresult?.cancelledMeasuresFiles?.length !=
                          0 ? (
                            <NavItem>
                              <NavLink
                                className={{
                                  active:
                                    this.state.activeTabFileResult === "4",
                                }}
                                onClick={() => {
                                  this.toggleFileTabResult("4");
                                }}
                              >
                                <h5> {t1("cancelledMeasuresFiles")}</h5>
                              </NavLink>
                            </NavItem>
                          ) : (
                            ""
                          )}
                        </Nav>
                        <TabContent activeTab={this.state.activeTabFileResult}>
                          <TabPane tabId="1">
                            <Row>
                              <Col sm={12} md={12} lg={12}>
                                {inspectionresult.actFiles?.map(
                                  (item, index) => (
                                    <Row key={index}>
                                      <Col sm={12} md={12} lg={12}>
                                        <iframe
                                          width={"100%"}
                                          height={"1000px"}
                                          src={
                                            axios.defaults.baseURL +
                                            `/InspectionResult/DownloadActFile/${item.id}`
                                          }
                                        ></iframe>
                                      </Col>
                                    </Row>
                                  )
                                )}
                              </Col>
                            </Row>
                          </TabPane>
                          <TabPane tabId="2">
                            <Row>
                              <Col sm={12} md={12} lg={12}>
                                {inspectionresult.measuresOfInfluenceFiles?.map(
                                  (item, index) => (
                                    <Row key={index}>
                                      <Col sm={12} md={12} lg={12}>
                                        <iframe
                                          width={"100%"}
                                          height={"1000px"}
                                          src={
                                            axios.defaults.baseURL +
                                            `/InspectionResult/DownloadMeasuresOfInfluenceFile/${item.id}`
                                          }
                                        ></iframe>
                                      </Col>
                                    </Row>
                                  )
                                )}
                              </Col>
                            </Row>
                          </TabPane>
                          <TabPane tabId="3">
                            <Row>
                              <Col sm={12} md={12} lg={12}>
                                {inspectionresult.measuresResultFiles?.map(
                                  (item, index) => (
                                    <Row key={index}>
                                      <Col sm={12} md={12} lg={12}>
                                        <iframe
                                          width={"100%"}
                                          height={"1000px"}
                                          src={
                                            axios.defaults.baseURL +
                                            `/InspectionResult/DownloadMeasuresResultFile/${item.id}`
                                          }
                                        ></iframe>
                                      </Col>
                                    </Row>
                                  )
                                )}
                              </Col>
                            </Row>
                          </TabPane>
                          <TabPane tabId="4">
                            <Row>
                              <Col sm={12} md={12} lg={12}>
                                {inspectionresult.cancelledMeasuresFiles?.map(
                                  (item, index) => (
                                    <Row key={index}>
                                      <Col sm={12} md={12} lg={12}>
                                        <iframe
                                          width={"100%"}
                                          height={"1000px"}
                                          src={
                                            axios.defaults.baseURL +
                                            `/InspectionResult/DownloadCancelledMeasuresFile/${item.id}`
                                          }
                                        ></iframe>
                                      </Col>
                                    </Row>
                                  )
                                )}
                              </Col>
                            </Row>
                          </TabPane>
                        </TabContent>
                      </div>
                    ) : (
                      ""
                    )}
                  </TabPane>
                  <TabPane tabId="5">
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
                            {requestHistory.rows?.map((item, idx) => (
                              <li>
                                <div
                                  className={`timeline-icon bg-${this.getColor(
                                    item.statusId
                                  )}`}
                                >
                                  <Plus size={16} />
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
                                      style={{ whiteSpace: "normal" }}
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
                </>
              </TabContent>
            </Col>
            <Col className="text-right" sm={12} md={2} lg={2}>
              <Button
                style={{ width: "100%", marginBottom: "5px" }}
                className="ml-1"
                color="danger"
                onClick={() => {
                  request.statusId == 1
                    ? this.props.history.push(
                        "/document/editrequest/" + request.id
                      )
                    : this.props.history.push("/document/request");
                  // history.goBack();
                }}
              >
                {" "}
                {t1("back")}{" "}
              </Button>
              {/* <Button
                style={{ width: "100%", marginBottom: "5px" }}
                className="ml-1"
                color="success"
                onClick={() => {
                  this.toggleModalLetter();
                  this.GetRequestLetterEditableContent(request.id);
                }}
              >
                {t1("LetterEditableContent")}
              </Button> */}
              {can("RequestSend") && isSend(request.statusId) ? (
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
                        id: request.id,
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
              {can("RequestMakeNotified") &&
              isMakeNotified(request.statusId) ? (
                <Button
                  style={{ width: "100%", marginBottom: "5px" }}
                  className="ml-1"
                  color="success"
                  onClick={() => {
                    this.toggleModal();
                    this.setState({ activeModal: "MakeNotified" });
                    this.setState((prevState) => ({
                      makeNotified: {
                        ...prevState.makeNotified,
                        id: request.id,
                      },
                    }));
                  }}
                >
                  {" "}
                  {t1("MakeNotified")}{" "}
                </Button>
              ) : (
                ""
              )}

              {can("RequestRedirect") && isToAgree(request.statusId) ? (
                <Button
                  style={{ width: "100%", marginBottom: "5px" }}
                  className="ml-1"
                  color="success"
                  onClick={() => {
                    this.toggleModal();
                    this.setState({ activeModal: "Redirect" });
                    this.setState((prevState) => ({
                      redirect: {
                        ...prevState.redirect,
                        id: request.id,
                      },
                    }));
                  }}
                >
                  {t1("Redirect")}
                </Button>
              ) : (
                ""
              )}
              {((can("RequestReceive") &&
                orgId.parentOrganizationId ===
                  request.authorizedOrganizationId) ||
                can("AllRequestReceive")) &&
              isToReject(request.statusId) ? (
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
                        id: request.id,
                      },
                    }));
                  }}
                >
                  {t1("ToReject")}
                </Button>
              ) : (
                ""
              )}
              {((can("RequestReceive") &&
                orgId.parentOrganizationId ===
                  request.authorizedOrganizationId) ||
                can("AllRequestReceive")) &&
              isToAgree(request.statusId) ? (
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
                        id: request.id,
                      },
                    }));
                  }}
                >
                  {t1("ToAgree")}{" "}
                </Button>
              ) : (
                ""
              )}
              {((can("RequestAgree") &&
                orgId.parentOrganizationId ===
                  request.authorizedOrganizationId) ||
                can("AllRequestAgree")) &&
              isReturnToModerator(request.statusId) ? (
                <Button
                  style={{ width: "100%", marginBottom: "5px" }}
                  className="ml-1"
                  color="warning"
                  onClick={() => {
                    this.toggleModal();
                    this.setState({ activeModal: "ReturnToModerator" });
                    this.setState((prevState) => ({
                      returnToModerator: {
                        ...prevState.returnToModerator,
                        id: request.id,
                      },
                    }));
                  }}
                >
                  {" "}
                  {t1("ReturnToModeratorButton")}{" "}
                </Button>
              ) : (
                ""
              )}
              {((can("RequestAgree") &&
                orgId.parentOrganizationId ===
                  request.authorizedOrganizationId) ||
                can("AllRequestAgree")) &&
              isReject(request.statusId) ? (
                <Button
                  style={{ width: "100%", marginBottom: "5px" }}
                  className="ml-1"
                  color="success"
                  onClick={() => {
                    this.toggleModal();
                    this.setState({ activeModal: "Reject" });
                    this.setState((prevState) => ({
                      reject: {
                        ...prevState.reject,
                        id: request.id,
                      },
                    }));
                  }}
                >
                  {t1("RejectButton")}{" "}
                </Button>
              ) : (
                ""
              )}
              {((can("RequestAgree") &&
                orgId.parentOrganizationId ===
                  request.authorizedOrganizationId) ||
                can("AllRequestAgree")) &&
              isAgree(request.statusId) ? (
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
                        id: request.id,
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
              {can("RequestDelete") && isArchive(request.statusId) ? (
                <Button
                  style={{ width: "100%", marginBottom: "5px" }}
                  className="ml-1"
                  color="danger"
                  onClick={() => {
                    this.toggleModal();
                    this.setState({ activeModal: "Delete" });
                    this.setState((prevState) => ({
                      delete: {
                        ...prevState.dalete,
                        id: request.id,
                      },
                    }));
                  }}
                >
                  {t1("Delete")}{" "}
                </Button>
              ) : (
                ""
              )}
              {/* {can("RequestArchive") && isArchive(request.statusId) ? (
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
                        id: request.id,
                      },
                    }));
                  }}
                >
                  {t1("Archive")}{" "}
                </Button>
              ) : (
                ""
              )} */}
              {request?.orderFiles?.length > 0 ? (
                ""
              ) : (can("RequestEdit") ||
                  can("BranchesRequestEdit") ||
                  can("AllRequestEdit")) &&
                isExecuteStatus(request.statusId) ? (
                <Button
                  style={{ width: "100%", marginBottom: "5px" }}
                  color="success"
                  className="ml-1"
                  onClick={() => {
                    this.toggleModalAttach();
                    // this.employeechange();
                  }}
                >
                  {" "}
                  {t1("AttachOrder")}{" "}
                </Button>
              ) : (
                ""
              )}
              {(can("RequestCreate") ||
                can("BranchesRequestCreate") ||
                can("AllRequestCreate")) &&
              isPostponeStatus(request.statusId) &&
              postponement.statusId != 2 ? (
                <Button
                  style={{ width: "100%", marginBottom: "5px" }}
                  color="primary"
                  className="ml-1"
                  onClick={() => {
                    this.GetPostPonement(request.id);
                  }}
                >
                  {" "}
                  {t1("MovePostponement")}{" "}
                </Button>
              ) : (
                ""
              )}
              {(can("RequestCreate") ||
                can("BranchesRequestCreate") ||
                can("AllRequestCreate")) &&
              isExecuteStatus(request.statusId) ? (
                //  &&
                // request.inspectionBookId !== null
                <Button
                  style={{ width: "100%", marginBottom: "5px" }}
                  color="primary"
                  className="ml-1"
                  onClick={() => {
                    this.InspectionResult(request.id);
                  }}
                >
                  {" "}
                  {t1("MoveInspectionResult")}{" "}
                </Button>
              ) : (
                ""
              )}
              {((can("RequestReceive") &&
                orgId.parentOrganizationId ===
                  request.authorizedOrganizationId) ||
                can("AllRequestReceive")) &&
              can("InspectionConclusionCreate") ? (
                //  &&
                // isExecuteStatus(request.statusId)
                //  &&
                // request.inspectionBookId !== null
                <Button
                  style={{ width: "100%", marginBottom: "5px" }}
                  color="primary"
                  className="ml-1"
                  onClick={() => {
                    this.InspectionConclusion(request.id);
                  }}
                >
                  {" "}
                  {t1("InspectionConclusion")}{" "}
                </Button>
              ) : (
                ""
              )}
              {/* {(can("RequestCreate") ||
                can("BranchesRequestCreate") ||
                can("AllRequestCreate")) &&
              isExecuteStatus(request.statusId) ? (
                <Button
                  style={{ width: "100%", marginBottom: "5px" }}
                  color="primary"
                  className="ml-1"
                  onClick={() => {
                    this.InspectionBook(request.id);
                  }}
                >
                  {" "}
                  {t1("InspectionBook")}{" "}
                </Button>
              ) : (
                ""
              )} */}
              {isDownloadStatus(request.statusId) ? (
                // <a
                //   href={`${axios.defaults.baseURL}/report/DownloadRequestPdf/${this.props.match.params.id}`}
                //   target="_blank"
                //   rel="noopener noreferrer"
                // >
                //   <Button
                //     style={{ width: "100%", marginBottom: "5px" }}
                //     className="ml-1"
                //     color="primary"
                //     // onClick={() => {
                //     //   this.DownloadReportPdf();
                //     // }}
                //   >
                //     {/* {t1("DownloadReportPdf")}{" "} */}
                //     {DownloadReportPdfLoading ? <Spinner size="sm" /> : ""}
                //     <Icon.Download
                //       style={{ cursor: "pointer" }}
                //       size={15}
                //     />
                //     {t1("DownloadReportPdf")}{" "}
                //   </Button>
                // </a>

                <Button
                  style={{ width: "100%", marginBottom: "5px" }}
                  className="ml-1"
                  color="primary"
                  onClick={() => {
                    this.DownloadReportPdf(this.state.request.answerLetterId);
                  }}
                >
                  {DownloadReportPdfLoading ? <Spinner size="sm" /> : ""}
                  <Icon.Download style={{ cursor: "pointer" }} size={15} />
                  {t1("DownloadReportPdf")}{" "}
                </Button>
              ) : (
                ""
              )}
              {can("RequestMakeNotAgreed") && request.statusId == 17 ? (
                <Button
                  style={{ width: "100%", marginBottom: "5px" }}
                  className="ml-1"
                  color="warning"
                  onClick={() => {
                    this.toggleModal();
                    this.setState({ activeModal: "MakeNotAgreed" });
                    this.setState((prevState) => ({
                      makeNotAgreed: {
                        ...prevState.makeNotAgreed,
                        id: request.id,
                      },
                    }));
                  }}
                >
                  {" "}
                  {t1("MakeNotAgreed")}{" "}
                </Button>
              ) : (
                ""
              )}
            </Col>
            <Row>
              <Modal
                isOpen={this.state.modalAttach}
                toggle={this.toggleModalAttach}
              >
                <ModalHeader>{t1("AttachOrder")}</ModalHeader>
                <ModalBody>
                  {this.state.fileLoading ? (
                    <div className="loadDiv">
                      <div class="lds-spinner">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <Row>
                    <Col sm={12} md={12} lg={12}>
                      <FormGroup>
                        <h5 className="text-bold-600"> {t1("orderNumber")} </h5>
                        <Input
                          type="textarea"
                          value={request.orderNumber || ""}
                          onChange={(e) =>
                            this.handleChangeAttach(e, "orderNumber")
                          }
                          id="orderNumber"
                          placeholder={t2("orderNumber", intl)}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm={12} md={12} lg={12}>
                      <FormGroup>
                        <h5 className="text-bold-600"> {t1("orderDate")} </h5>
                        <InputGroup size="md" className="datePicker">
                          <DatePicker
                            dateFormat="dd.MM.yyyy"
                            selected={
                              request.orderDate
                                ? moment(
                                    request.orderDate,
                                    "DD.MM.YYYY"
                                  ).toDate()
                                : ""
                            }
                            onChange={(date, dateString) => {
                              this.handleChangeAttach(date, "orderDate", {
                                value: moment(new Date(date)).format(
                                  "DD.MM.YYYY"
                                ),
                              });
                            }}
                            isClearable={!!request.orderDate ? true : false}
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
                    <Col sm={12} md={12} lg={12}>
                      <FormGroup>
                        <h5 className="text-bold-600">{t1("inspectors")}</h5>
                        <AsynSelect
                          styles={{
                            menu: (provided) => ({
                              ...provided,
                              zIndex: 200,
                            }),
                          }}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          isMulti
                          placeholder={t2("inspectors", intl)}
                          value={
                            !!request.inspectors
                              ? request.inspectors.length > 0
                                ? EmployeeList.rows?.filter((item) =>
                                    request.inspectors.includes(item.value)
                                  )
                                : []
                              : []
                          }
                          defaultValue={
                            !!request.inspectors
                              ? request.inspectors.length > 0
                                ? EmployeeList.rows?.filter((item) =>
                                    request.inspectors.includes(item.value)
                                  )
                                : []
                              : []
                          }
                          // value={this.state.value}
                          name="color"
                          defaultOptions={EmployeeList.rows}
                          label="text"
                          getOptionLabel={(item) => item.text}
                          loadOptions={this.loadOptions}
                          onChange={(e) => {
                            this.handleChangeAttach(e, "inspectors", {
                              text:
                                e?.length > 0 ? e.map((item) => item.text) : [],
                              value:
                                e?.length > 0
                                  ? e.map((item) => item.value)
                                  : [],
                            });
                          }}
                        />
                        {/* <Select
                          styles={{
                            menu: (provided) => ({
                              ...provided,
                              zIndex: 200,
                            }),
                          }}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          isMulti
                          placeholder={t2("inspectors", intl)}
                          // loadOptions={this.loadOptions}
                          value={
                            !!request.inspectors
                              ? request.inspectors.length > 0
                                ? EmployeeList.rows?.filter((item) =>
                                    request.inspectors.includes(item.value)
                                  )
                                : []
                              : []
                          }
                          defaultValue={
                            !!request.inspectors
                              ? request.inspectors.length > 0
                                ? EmployeeList.rows?.filter((item) =>
                                    request.inspectors.includes(item.value)
                                  )
                                : []
                              : []
                          }
                          // value={this.state.value}
                          name="color"
                          options={EmployeeList.rows}
                          label="text"
                          getOptionLabel={(item) => item.text}
                          onChange={(e) => {
                            this.handleChangeAttach(e, "inspectors", {
                              value:
                                e?.length > 0
                                  ? e.map((item) => item.value)
                                  : [],
                            });
                          }}
                        /> */}
                      </FormGroup>
                    </Col>

                    <Col sm={12} md={12} lg={12}>
                      <FormGroup>
                        <h5 className="text-bold-600">{t1("orderFiles")}</h5>
                        <Row>
                          <Col sm={12} md={12} lg={12}>
                            <CustomInput
                              accept="application/pdf"
                              id="exampleFile"
                              name="file"
                              type="file"
                              label="Прикрепить файл"
                              dataBrowse="Прикрепить файл"
                              onChange={(e) => {
                                this.handleChangeOrderFile(
                                  e.target.files,
                                  "order"
                                );
                              }}
                            />
                          </Col>
                          <Col sm={12} md={12} lg={12} className="mt-1">
                            {request.orderFiles?.map((item, index) => (
                              <Badge
                                id="positionTop"
                                color="primary"
                                className="mr-1"
                                style={{ margin: "2px", whiteSpace: "normal" }}
                                key={index}
                              >
                                {item.fileName || item.name}{" "}
                                <Icon.Trash
                                  onClick={() =>
                                    this.DeleteFile(item, index, "order")
                                  }
                                  style={{ cursor: "pointer" }}
                                  size={15}
                                />{" "}
                                <UncontrolledTooltip
                                  placement="top"
                                  target="positionTop"
                                >
                                  {t1("dateOfCreatedFile")} -{" "}
                                  {item.dateOfCreated}
                                </UncontrolledTooltip>
                              </Badge>
                            ))}
                          </Col>
                          <Col sm={12} md={12} lg={12} className="mt-1">
                            {request.orderFiles?.map((item, index) => (
                              <iframe
                                width="100%"
                                height="500px"
                                // dangerouslySetInnerHTML={{ __html: HtmlData }}
                                src={
                                  axios.defaults.baseURL +
                                  `/Request/DownloadOrderFile/${item.id}`
                                }
                              ></iframe>
                            ))}
                          </Col>
                        </Row>
                      </FormGroup>
                    </Col>
                  </Row>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onClick={this.toggleModalAttach}>
                    {t1("back", intl)}
                  </Button>{" "}
                  <Button color="success" onClick={this.SaveAttachOrder}>
                    {SaveLoading ? <Spinner size="sm" /> : ""}
                    {t1("Send", intl)}
                  </Button>
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
                  {this.state.activeModal === "Redirect" &&
                    t1("Redirect", intl)}
                  {this.state.activeModal === "ToReject" &&
                    t1("ToReject", intl)}
                  {this.state.activeModal === "Delete" && t1("Delete", intl)}
                  {this.state.activeModal === "ToAgree" && t1("ToAgree", intl)}
                  {this.state.activeModal === "MakeNotified" &&
                    t1("MakeNotified", intl)}
                  {this.state.activeModal === "MakeNotAgreed" &&
                    t1("MakeNotAgreed", intl)}
                  {this.state.activeModal === "Revoke" && t1("Revoke", intl)}
                  {this.state.activeModal === "RefuseByModerator" &&
                    t1("RefuseByModerator", intl)}
                  {this.state.activeModal === "ToApprove" &&
                    t1("ToApprove", intl)}
                  {this.state.activeModal === "ReturnToModerator" &&
                    t1("ReturnToModerator", intl)}
                  {this.state.activeModal === "Reject" && t1("Reject", intl)}
                  {this.state.activeModal === "Agree" && t1("Agree", intl)}
                  {this.state.activeModal === "CancelAgreement" &&
                    t1("CancelAgreement", intl)}
                </ModalHeader>
                <ModalBody>
                  {/* <h5>{t1("message", intl)}</h5> */}
                  {this.state.activeModal === "Send" && (
                    <Input
                      type="textarea"
                      value={send.message || ""}
                      onChange={(e) =>
                        this.handleChangeTextArr(e, "message", "send")
                      }
                      id="message"
                      placeholder={t2("message", intl)}
                    />
                  )}
                  {this.state.activeModal === "MakeNotified" && (
                    <Input
                      type="textarea"
                      value={makeNotified.message || ""}
                      onChange={(e) =>
                        this.handleChangeTextArr(e, "message", "makeNotified")
                      }
                      id="message"
                      placeholder={t2("message", intl)}
                    />
                  )}
                  {this.state.activeModal === "MakeNotAgreed" && (
                    <Input
                      type="textarea"
                      value={makeNotAgreed.message || ""}
                      onChange={(e) =>
                        this.handleChangeTextArr(e, "message", "makeNotAgreed")
                      }
                      id="message"
                      placeholder={t2("message", intl)}
                    />
                  )}
                  {this.state.activeModal === "Redirect" && (
                    // <Input
                    //   type="textarea"
                    //   value={redirect.message || ""}
                    //   onChange={(e) =>
                    //     this.handleChangeTextArr(e, "message", "redirect")
                    //   }
                    //   id="message"
                    //   placeholder={t2("message", intl)}
                    // />
                    <Select
                      className="basic-multi-select"
                      classNamePrefix="select"
                      // isMulti
                      placeholder={t2("Redirect", intl)}
                      styles={{
                        menu: (provided) => ({ ...provided, zIndex: 200 }),
                      }}
                      defaultValue={{
                        text:
                          redirect.authorizedOrganization || t2("Choose", intl),
                      }}
                      isClearable
                      value={{
                        text:
                          redirect.authorizedOrganization || t2("Choose", intl),
                      }}
                      name="color"
                      options={this.state.AuthorizedOrganizationList}
                      label="text"
                      getOptionLabel={(item) => item.text}
                      onChange={(e) => {
                        this.handleChangeTextArr(
                          e,
                          "authorizedOrganizationId",
                          "Redirect",
                          e
                          // {
                          //   value: !!e.value,
                          // }
                        );
                      }}
                    />
                  )}
                  {this.state.activeModal === "ToReject" && (
                    <>
                      <div className="mb-2">
                        <Select
                          className="basic-multi-select"
                          classNamePrefix="select"
                          isMulti
                          placeholder={t2("RejectionReason", intl)}
                          styles={{
                            menu: (provided) => ({ ...provided, zIndex: 200 }),
                          }}
                          defaultValue={
                            !!toReject.rejectionReasons &&
                            toReject.rejectionReasons.length > 0
                              ? RejectList.filter((item) =>
                                  toReject.rejectionReasons.includes(item.value)
                                )
                              : []
                          }
                          name="color"
                          options={RejectList}
                          label="text"
                          getOptionLabel={(item) => item.text}
                          onChange={(e) => {
                            this.handleChangeTextArr(
                              e,
                              "rejectionReasons",
                              "ToReject",
                              {
                                value:
                                  e?.length > 0
                                    ? e.map((item) => item.value)
                                    : [],
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
                                ? moment(
                                    toReject.letterDate,
                                    "DD.MM.YYYY"
                                  ).toDate()
                                : ""
                            }
                            onChange={(date) => {
                              this.handleChangeTextArr(
                                date,
                                "letterDate",
                                "ToReject",
                                {
                                  value: moment(new Date(date)).format(
                                    "DD.MM.YYYY"
                                  ),
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
                        <h5>{t1("message", intl)}</h5>
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
                                ? moment(
                                    toAgree.letterDate,
                                    "DD.MM.YYYY"
                                  ).toDate()
                                : ""
                            }
                            onChange={(date) => {
                              this.handleChangeTextArr(
                                date,
                                "letterDate",
                                "ToAgree",
                                {
                                  value: moment(new Date(date)).format(
                                    "DD.MM.YYYY"
                                  ),
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
                      <div className="mb-2">
                        <h5>{t1("agreedCheckDaysNumber")}</h5>
                        <Input
                          type="number"
                          // defaultValue={toAgree.agreedCheckDaysNumber || ""}
                          value={toAgree.agreedCheckDaysNumber || ""}
                          onChange={(e) =>
                            this.handleChangeTextArr(
                              e,
                              "agreedCheckDaysNumber",
                              "ToAgree"
                            )
                          }
                          id="agreedCheckDaysNumber"
                          placeholder={t2("agreedCheckDaysNumber", intl)}
                        />
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
                        this.handleChangeTextArr(
                          e,
                          "message",
                          "ReturnToModerator"
                        )
                      }
                      id="message"
                      placeholder={t2("message", intl)}
                    />
                  )}

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
                                              <b>№ Сертификата</b>:
                                              {item.serialNumber}
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
                                            {this.getDateFormat(item.validFrom)}{" "}
                                            - {this.getDateFormat(item.validTo)}
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
                                              <b>№ Сертификата</b>:
                                              {item.serialNumber}
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
                                            {this.getDateFormat(item.validFrom)}{" "}
                                            - {this.getDateFormat(item.validTo)}
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
                  {this.state.activeModal === "Delete" && (
                    <h5>{t1("WantDelete")}</h5>
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

                  {this.state.activeModal === "Revoke" && (
                    <Input
                      type="textarea"
                      value={revoke.message || ""}
                      onChange={(e) => this.handleChangeRecieve(e, "message")}
                      id="message"
                      placeholder={t2("message", intl)}
                    />
                  )}
                  {this.state.activeModal === "RefuseByModerator" && (
                    <Input
                      type="textarea"
                      value={refusebymoderator.message || ""}
                      onChange={(e) => this.handleChangeRecieve(e, "message")}
                      id="message"
                      placeholder={t2("message", intl)}
                    />
                  )}
                  {this.state.activeModal === "ToApprove" && (
                    <Input
                      type="textarea"
                      value={toapprove.message || ""}
                      onChange={(e) => this.handleChangeRecieve(e, "message")}
                      id="message"
                      placeholder={t2("message", intl)}
                    />
                  )}

                  {this.state.activeModal === "CancelAgreement" && (
                    <Input
                      type="textarea"
                      value={cancelagreement.message || ""}
                      onChange={(e) => this.handleChangeRecieve(e, "message")}
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
                  {this.state.activeModal === "MakeNotified" && (
                    <Button color="success" onClick={this.MakeNotified}>
                      {this.state.MakeNotifiedLoading ? (
                        <Spinner size="sm" />
                      ) : (
                        ""
                      )}
                      {t1("yes", intl)}
                    </Button>
                  )}
                  {this.state.activeModal === "MakeNotAgreed" && (
                    <Button color="success" onClick={this.MakeNotAgreed}>
                      {this.state.MakeNotAgreedLoading ? (
                        <Spinner size="sm" />
                      ) : (
                        ""
                      )}
                      {t1("yes", intl)}
                    </Button>
                  )}
                  {(this.state.activeModal === "ToReject" ||
                    this.state.activeModal === "ToAgree") && (
                    <Button color="primary" onClick={this.ResetLetterContent}>
                      {ResetLetterContentLoading ? <Spinner size="sm" /> : ""}
                      {t1("ResetLetterContent", intl)}
                    </Button>
                  )}
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
                    <Button
                      color="success"
                      onClick={this.ReturnToModeratorFunction}
                    >
                      {ReturnToModeratorLoading ? <Spinner size="sm" /> : ""}
                      {t1("yes", intl)}
                    </Button>
                  )}
                  {this.state.activeModal === "Reject" && (
                    <Button
                      color="success"
                      onClick={() => {
                        // !!this.state.reject.signData
                        //   ?
                        this.RejectFunction();
                        // : customErrorToast(t1("eimzoYouDontHave"));
                      }}
                    >
                      {RejectLoading ? <Spinner size="sm" /> : ""}
                      {t1("yes", intl)}
                    </Button>
                  )}
                  {this.state.activeModal === "Agree" && (
                    <Button
                      color="success"
                      onClick={() => {
                        // !!this.state.agree.signData
                        //   ?
                        this.AgreeFunction();
                        // : customErrorToast(t1("eimzoYouDontHave"));
                      }}
                    >
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
                  {this.state.activeModal === "Delete" && (
                    <Button color="success" onClick={this.DeleteFunction}>
                      {DeleteLoading ? <Spinner size="sm" /> : ""}
                      {t1("yes", intl)}
                    </Button>
                  )}
                  {this.state.activeModal === "Receive" && (
                    <Button color="success" onClick={this.ReceiveFunction}>
                      {ReceiveLoading ? <Spinner size="sm" /> : ""}
                      {t1("yes", intl)}
                    </Button>
                  )}
                  {this.state.activeModal === "Revoke" && (
                    <Button color="success" onClick={this.RevokeFunction}>
                      {RevokeLoading ? <Spinner size="sm" /> : ""}
                      {t1("yes", intl)}
                    </Button>
                  )}
                  {this.state.activeModal === "RefuseByModerator" && (
                    <Button
                      color="success"
                      onClick={this.RefuseByModeratorFunction}
                    >
                      {RefuseByModeratorLoading ? <Spinner size="sm" /> : ""}
                      {t1("yes", intl)}
                    </Button>
                  )}
                  {this.state.activeModal === "ToApprove" && (
                    <Button color="success" onClick={this.ToApproveFunction}>
                      {ToApproveLoading ? <Spinner size="sm" /> : ""}
                      {t1("yes", intl)}
                    </Button>
                  )}
                  {this.state.activeModal === "Redirect" && (
                    <Button color="success" onClick={this.RedirectFunction}>
                      {RedirectLoading ? <Spinner size="sm" /> : ""}
                      {t1("yes", intl)}
                    </Button>
                  )}
                  {this.state.activeModal === "CancelAgreement" && (
                    <Button
                      color="success"
                      onClick={this.CancelAgreementFunction}
                    >
                      {CancelAgreementLoading ? <Spinner size="sm" /> : ""}
                      {t1("yes", intl)}
                    </Button>
                  )}
                </ModalFooter>
              </Modal>
              <Col sm={12} md={8} lg={6}></Col>
            </Row>
          </Row>
        </Card>
      </Overlay>
    );
  }
}
export default injectIntl(EditRequest);
