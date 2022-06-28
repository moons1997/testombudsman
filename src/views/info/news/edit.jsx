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
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  CustomInput,
  Badge,
  FormFeedback,
  UncontrolledTooltip,
} from "reactstrap";
import Overlay from "../../../components/Webase/components/Overlay";
import ManualService from "../../../services/other/manual.service";
import Select from "react-select";
import { Notification, Translate } from "../../../components/Webase/functions";
import { injectIntl } from "react-intl";
import NewsService from "../../../services/info/news.service";
import * as Icon from "react-feather";

import moment from "moment";
import classnames from "classnames";
import ReactQuill from "react-quill";
import ReactTags from "react-tag-autocomplete";
import "react-quill/dist/quill.snow.css";

import "./style.css";
import DatePicker, { registerLocale } from "react-datepicker";
import MaskedTextInput from "react-text-mask";
import uz from "date-fns/locale/uz";
import uzCyrl from "date-fns/locale/uz-Cyrl";
import ru from "date-fns/locale/ru";
import Axios from "axios";
registerLocale("uz", uz);
registerLocale("uzCyrl", uzCyrl);
registerLocale("ru", ru);

const { t1, t2 } = Translate;
const { errorToast, successToast } = Notification;

class EditNews extends React.Component {
  // data (return)
  constructor(props) {
    super(props);
    this.state = {
      checktype: {},
      loading: false,
      SaveLoading: false,
      StateList: [],
      data: [],
      modal: false,
      languageList: [],
      activeModal: "",
      // editorState: EditorState.createEmpty(),
      activeTab: "5",
      activeTabShort: "9",
      suggestions: [
        { id: 3, name: "Bananas" },
        { id: 4, name: "Mangos" },
        { id: 5, name: "Lemons" },
        { id: 6, name: "Apricots" },
      ],
      errors: {
        title: null,
        content: null,
        shortContent: null,
        // date: null,
        // image: null,
      },
    };
    this.reactTags = React.createRef();
  }
  //Created
  componentDidMount() {
    this.GetDataLanguage();

    this.GetDataList();
  }
  GetDataLanguage = () => {
    ManualService.LanguageSelectList().then((res) => {
      this.setState({ languageList: res.data }, () => {
        this.Refresh();
      });
    });
  };

  translateObjects = (data) => {
    var objects = [];
    if (data.translates.length === 0) {
      if ("title" in data) {
        this.state.languageList.map((item) => {
          objects.push({
            language: item.fullName,
            columnName: "title",
            languageId: item.value,
            translateText: "",
          });
        });
      }
      if ("content" in data) {
        this.state.languageList.map((item) => {
          objects.push({
            language: item.fullName,
            columnName: "content",
            languageId: item.value,
            translateText: "",
          });
        });
      }
      // if ("shortContent" in data) {
      //   this.state.languageList.map((item) => {
      //     objects.push({
      //       language: item.fullName,
      //       columnName: "short_content",
      //       languageId: item.value,
      //       translateText: "",
      //     });
      //   });
      // }
      return objects;
    } else {
      return data.translates;
    }
  };
  // methods
  Refresh = () => {
    this.setState({ loading: true });
    NewsService.Get(this.props.match.params.id)
      .then((res) => {
        this.setState({
          data: {
            ...res.data,
            translates: this.translateObjects(res.data),
          },
          loading: false,
        });
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
    var state = this.state.data;
    if (!!event) {
      state[field] = !!event?.target ? event.target.value : data.value;
      if (field == "stateId") {
        state.state = this.state.StateList.filter(
          (item) => item.value == data.value
        )[0].text;
      }
      this.setState({ data: state });
    } else {
      if (field === "date") {
        state[field] = "";
      }
      if (field === "stateId") {
        state.state = "";
        state.stateId = null;
      }
      this.setState({ data: state });
    }
    this.validation(() => {});
  }

  SaveData = () => {
    this.validation(() => {
      if (
        Object.values(this.state.errors).filter((item) => item == true)
          .length == 0
      ) {
        this.setState({ SaveLoading: true });

        NewsService.Update(this.state.data)
          .then((res) => {
            this.setState({ SaveLoading: false });
            successToast(t2("SuccessSave", this.props.intl));

            setTimeout(() => {
              this.props.history.push("/info/news");
            }, 500);
          })
          .catch((error) => {
            errorToast(error.response.data);
            this.setState({ SaveLoading: false });
          });
      }
    });
  };
  validation = (callback) => {
    var data = this.state.data;
    var errors = {
      title: !!data.title ? false : true,
      // content: !!data.content ? false : true,
      // shortContent: !!data.shortContent ? false : true,
    };
    this.setState({ errors: errors }, () => callback());
  };
  toggleModal = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  changeTranslate(value, item) {
    const { data, activeModal } = this.state;
    if (item.languageId == 1 && activeModal == "title") {
      data.title = value.target.value;
    }

    data.translates.map(function (el) {
      if (el.languageId == item.languageId && el.columnName == activeModal) {
        el.translateText = value.target.value;
      }
    });
    this.setState({ data });
  }
  onEditorStateChange = (editorState, language) => {
    const { data } = this.state;

    data.translates.map(function (el) {
      if (el.languageId == language.languageId && el.columnName == "content") {
        if (language.languageId == 1) {
          data.content = editorState;
        }
        el.translateText = editorState;
      }
    });
    this.setState({ data });
  };
  onEditorStateChangeShort = (editorState, language) => {
    const { data } = this.state;

    data.translates.map(function (el) {
      if (
        el.languageId == language.languageId &&
        el.columnName == "short_content"
      ) {
        if (language.languageId == 1) {
          data.shortContent = editorState;
        }
        el.translateText = editorState;
      }
    });
    this.setState({ data });
  };
  toggleTab = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  };
  toggleTabShort = (tab) => {
    if (this.state.activeTabShort !== tab) {
      this.setState({ activeTabShort: tab });
    }
  };

  onDelete(i) {
    const tags = this.state.data.tags.slice(0);
    tags.splice(i, 1);
    this.setState((prevState) => ({
      data: {
        ...prevState.data,
        tags,
      },
    }));
  }

  onAddition(tag) {
    const tags = [].concat(this.state.data.tags, tag);
    this.setState((prevState) => ({
      data: {
        ...prevState.data,
        tags,
      },
    }));
  }

  DownloadFile = (data, field) => {
    this.setState({ downloadLoad: { check: true, id: data.image.id } });
    NewsService.GetNewsImage(data.image?.id, field)
      .then((res) => {
        this.setState({ downloadLoad: { check: false, id: data.image?.id } });
        successToast(t2("DownloadSuccess", this.props.intl));
        this.forceFileDownload(res, data.image?.id, data.image.fileName);
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
  };
  forceFileDownload(response, name, attachfilename) {
    // console.log("AAAAAAAAA", attachfilename);
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
  handleChangeOrderFile = (file, field) => {
    if (field == "image") {
      let formData = new FormData();
      for (let i = 0; i < file.length; i++) {
        formData.append("file", file[i]);
      }

      const { data } = this.state;
      NewsService.UploadNewsImage(formData).then((res) => {
        // for (let i = 0; i < res.data.length; i++) {
        //   data.image = {
        //     fileId: res.data[i].fileId,
        //     fileName: res.data[i].fileName,
        //   };
        // }
        data.image = { id: res.data.fileId };
        this.setState({ data });
      });
    }
  };
  render() {
    const {
      loading,
      SaveLoading,
      StateList,
      data,
      modal,
      activeModal,
      activeTab,
      activeTabShort,
      errors,
    } = this.state;
    const { history, intl } = this.props;
    //template
    return (
      <Overlay show={loading}>
        <Modal isOpen={modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            {activeModal == "title" && t1("Title")}
            {activeModal == "full_name" && t1("fullname")}
          </ModalHeader>
          <ModalBody>
            {data.translates?.map((item, index) =>
              item.columnName == this.state.activeModal ? (
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
              ) : (
                ""
              )
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="success"
              onClick={() => {
                this.toggleModal();
              }}
            >
              {t1("Add")}
            </Button>{" "}
          </ModalFooter>
        </Modal>
        <Card className="p-2">
          <Row>
            <Col className="text-center mb-1">
              <h1 className="pageTextView"> {t1("News")} </h1>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6} lg={4}>
              <h5 className="text-bold-600"> {t1("Title")} </h5>
              <FormGroup>
                <InputGroup>
                  <Input
                    type="text"
                    value={data.title || ""}
                    onChange={(e) => this.handleChange(e, "title")}
                    id="title"
                    placeholder={t2("Title", intl)}
                    disabled
                    invalid={errors.title}
                  />

                  <InputGroupAddon addonType="append">
                    <Button
                      color="primary"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ activeModal: "title" });
                      }}
                    >
                      <Icon.Globe id={"translate"} size={16} />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                <FormFeedback>
                  {t2("titleValidation", this.props.intl)}
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600"> {t1("Date")} </h5>
                <InputGroup size="md" className="datePicker">
                  <DatePicker
                    dateFormat="dd.MM.yyyy"
                    selected={
                      data.date ? moment(data.date, "DD.MM.YYYY").toDate() : ""
                    }
                    onChange={(date) => {
                      this.handleChange(date, "date", {
                        value: moment(new Date(date)).format("DD.MM.YYYY"),
                      });
                    }}
                    isClearable={!!data.date ? true : false}
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
            <Col sm={12} md={4} lg={4}>
              <FormGroup>
                <h5 className="text-bold-600">{t1("addFile")}</h5>
                <Row>
                  <Col>
                    <CustomInput
                      id="exampleFile"
                      name="file"
                      type="file"
                      label={t1("addFile")}
                      dataBrowse="Прикрепить файл"
                      onChange={(e) => {
                        this.handleChangeOrderFile(e.target.files, "image");
                      }}
                    />
                  </Col>
                </Row>
                <Badge
                  id="positionTop"
                  color="primary"
                  className="mr-1"
                  // key={index}
                >
                  {data.image?.id || " "}
                  <Icon.Download
                    onClick={() => this.DownloadFile(data, "news")}
                    style={{ cursor: "pointer" }}
                    size={15}
                  />
                  {/* <UncontrolledTooltip placement="top" target="positionTop">
                  {t1("dateOfCreatedFile")} - {item.dateOfCreated}
                </UncontrolledTooltip> */}
                </Badge>
              </FormGroup>
            </Col>
            {/* <iframe
              //   onClick={() => {
              //     this.OpenShow(item);
              //   }}
              //   style={{ cursor: "pointer" }}
              src={`${Axios.defaults.baseURL}/news/GetNewsImage/${data?.image?.id}`}
              className="text-center"
              key={1}
              allowfullscreen
            /> */}
            {/* <Col sm={12} md={4} lg={4} className="mb-1 mt-1">
              <Badge
                id="positionTop"
                color="primary"
                className="mr-1"
              >
                {data.image?.id || " "}
                <Icon.Download
                  onClick={() => this.DownloadFile(data, "news")}
                  style={{ cursor: "pointer" }}
                  size={15}
                />
              </Badge>
            </Col> */}
            {this.props.match.params.id == 0 ? (
              ""
            ) : (
              <Col sm={12} md={6} lg={4}>
                <FormGroup>
                  <h5 className="text-bold-600">{t1("state")}</h5>
                  <Select
                    className="React"
                    classNamePrefix="select"
                    defaultValue={{
                      text: data.state || t2("Choose", intl),
                    }}
                    value={{
                      text: data.state || t2("Choose", intl),
                    }}
                    isClearable
                    name="color"
                    options={StateList}
                    label="text"
                    getOptionLabel={(item) => item.text}
                    onChange={(e) => this.handleChange(e, "stateId", e)}
                  />
                </FormGroup>
              </Col>
            )}

            <Col sm={12} md={12} lg={12} className="mb-3">
              <h5 className="text-bold-600">{t1("AddNewTag")}</h5>
              <ReactTags
                ref={this.reactTags}
                placeholderText=""
                tags={data.tags}
                suggestions={this.state.suggestions}
                onDelete={this.onDelete.bind(this)}
                allowNew
                minQueryLength={1}
                onAddition={this.onAddition.bind(this)}
              />
            </Col>

            {/* <Col sm={12} md={6} lg={12}>
              <Nav tabs className="nav-justified">
                {data.translates?.map((item, index) =>
                  item.columnName == "short_content" ? (
                    <NavItem key={index + "tab"}>
                      <NavLink
                        className={classnames({
                          active: activeTabShort === `${index + 1}`,
                        })}
                        onClick={() => {
                          this.toggleTabShort(`${index + 1}`);
                        }}
                      >
                        {item.language}
                      </NavLink>
                    </NavItem>
                  ) : (
                    ""
                  )
                )}
              </Nav>
              <TabContent
                className="py-50"
                activeTab={this.state.activeTabShort}
              >
                {data.translates?.map((item, index) =>
                  item.columnName == "short_content" ? (
                    <TabPane tabId={`${index + 1}`} key={index + "tabPane"}>
                      <ReactQuill
                        className="shortContent"
                        theme="snow"
                        value={item.translateText}
                        onChange={(e) => this.onEditorStateChangeShort(e, item)}
                        modules={{
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
                          clipboard: {
                            // toggle to add extra line breaks when pasting HTML:
                            matchVisual: false,
                          },
                        }}
                        formats={[
                          "header",
                          "font",
                          "size",
                          "bold",
                          "italic",
                          "underline",
                          "strike",
                          "blockquote",
                          "list",
                          "bullet",
                          "indent",
                          "link",
                          "image",
                          "video",
                        ]}
                        bounds={".app"}
                      />
                    </TabPane>
                  ) : (
                    ""
                  )
                )}
              </TabContent>
            </Col> */}
            <Col sm={12} md={6} lg={12}>
              <Nav tabs className="nav-justified">
                {data.translates?.map((item, index) =>
                  item.columnName == "content" ? (
                    <NavItem key={index + "tab"}>
                      <NavLink
                        className={classnames({
                          active: activeTab === `${index + 1}`,
                        })}
                        onClick={() => {
                          this.toggleTab(`${index + 1}`);
                        }}
                      >
                        {item.language}
                      </NavLink>
                    </NavItem>
                  ) : (
                    ""
                  )
                )}
              </Nav>
              <TabContent className="py-50" activeTab={this.state.activeTab}>
                {data.translates?.map((item, index) =>
                  item.columnName == "content" ? (
                    <TabPane tabId={`${index + 1}`} key={index + "tabPane"}>
                      {/* tab {`${index + 1}`} */}
                      <ReactQuill
                        theme="snow"
                        value={item.translateText}
                        onChange={(e) => this.onEditorStateChange(e, item)}
                        modules={{
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
                          clipboard: {
                            // toggle to add extra line breaks when pasting HTML:
                            matchVisual: false,
                          },
                        }}
                        formats={[
                          "header",
                          "font",
                          "size",
                          "bold",
                          "italic",
                          "underline",
                          "strike",
                          "blockquote",
                          "list",
                          "bullet",
                          "indent",
                          "link",
                          "image",
                          "video",
                        ]}
                        bounds={".app"}
                      />
                    </TabPane>
                  ) : (
                    ""
                  )
                )}
              </TabContent>
            </Col>
          </Row>
          <Row>
            <Col className="text-right">
              <Button
                className="mr-1"
                color="danger"
                onClick={() => history.push("/info/news")}
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
export default injectIntl(EditNews);
