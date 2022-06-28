import React from "react";
import {
  Card,
  Row,
  Col,
  InputGroup,
  Input,
  Button,
  InputGroupAddon,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { injectIntl, useIntl } from "react-intl";
import WebaseTable2 from "../../../components/Webase/components/TableTest";
import RequestService from "../../../services/document/request.service";
import * as Icon from "react-feather";
import {
  Translate,
  Permission,
  Notification,
} from "../../../components/Webase/functions/index.js";
const { t1, t2 } = Translate;
const { can } = Permission;
const { errorToast, successToast } = Notification;
// const history = useHistory();

const ModalComponent = ({ state, setState, name, apiReq, item }) => (
  <Modal isOpen={state == name + item.id}>
    <ModalHeader toggle={() => setState()}>
      {/* {t2("Delete", intl)} */}
      {name}
    </ModalHeader>
    <ModalBody>
      {/* <h5> {t2("WantDelete", intl)} </h5> */}
      <h5>Are you sure you want to {name}?</h5>
    </ModalBody>
    <ModalFooter>
      <Button color="danger" onClick={() => setState()}>
        {/* {t2("no", intl)} */}
        no
      </Button>{" "}
      <Button color="success" onClick={() => apiReq(item, setState)}>
        {/* {t2("yes", intl)} */}
        yes
      </Button>{" "}
    </ModalFooter>
  </Modal>
);

const actions = {
  edit: {
    isView: can("RequestEdit"),
  },
  delete: {
    isView: can("RequestDelete"),
  },
  send: {
    isView: can("RequestSend"),
  },
  revoke: {
    isView: can("RequestSend"),
  },
  receive: {
    isView: can("RequestReceive"),
  },
  refuseByModerator: {
    isView: can("RequestReceive"),
  },
  toApprove: {
    isView: can("RequestReceive"),
  },
  returnToModerator: {
    isView: can("RequestAgree"),
  },
  reject: {
    isView: can("RequestAgree"),
  },
  agree: {
    isView: can("RequestAgree"),
  },
  cancelAgreement: {
    isView: can("RequestAgree"),
  },
  archive: {
    isView: can("RequestArchive"),
  },
};

const isEdit = () => actions.edit.isView;
const isDelete = () => actions.delete.isView;
const isArchive = (id) =>
  actions.archive.isView &&
  (id === 1 || id === 12 || id === 8 || id === 10 || id === 4);
const isAgree = (id) => actions.agree.isView && (id === 5 || id === 11);
const isCancelAgreement = (id) => actions.cancelAgreement.isView && id === 7;
const isSend = (id) =>
  actions.send.isView && (id === 1 || id === 10 || id === 12);
const isReceive = (id) => actions.receive.isView && id === 2;
const isRefuseByModerator = (id) =>
  actions.refuseByModerator.isView && (id === 2 || id === 3);
const isToApprove = (id) => actions.toApprove.isView && (id === 2 || id === 3);
const isReturnToModerator = (id) =>
  actions.returnToModerator.isView && (id === 5 || id === 11);
const isReject = (id) => actions.reject.isView && (id === 5 || id === 11);
const isRevoke = (id) => {
  return actions.revoke.isView && id === 2;
};

const isModify = (id) => id === 1 || id === 10 || id === 12;
const isPostpone = (id) => id === 7;
const isProlong = (id) => id === 7;
const isCancel = (id) => id === 7;
const isHeld = (id) => id === 1 || id === 12;

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    const { intl, history } = this.props;

    this.state = {
      deleteModal: "DeleteModal",
      send: "sendModal",
      revoke: "revoke",
      receive: "receive",
      refuseByModerator: "refuseByModerator",
      toApprove: "toApprove",
      returnToModerator: "returnToModerator",
      reject: "reject",
      agree: "agree",
      cancelAgreement: "cancelAgreement",
      archive: "archive",
      fields: [
        { key: "id", label: "ID", sort: true },
        { key: "docNumber", label: t2("docNumber", props.intl), sort: true },
        { key: "docDate", label: t2("docDate", props.intl), sort: true },
        { key: "contractor", label: t2("contractor", props.intl), sort: true },
        {
          key: "contractorInn",
          label: t2("contractorInn", props.intl),
          sort: true,
        },
        {
          key: "state",
          label: t2("state", props.intl),
          sort: true,
          badge: true,
        },
        {
          key: "actions",
          label: t2("actions", props.intl),
          actions: (item, refresh) => {
            const {
              send,
              deleteModal,
              revoke,
              receive,
              refuseByModerator,
              toApprove,
              returnToModerator,
              reject,
              agree,
              cancelAgreement,
              archive,
            } = this.state;
            return (
              <>
                {isEdit() && (
                  <div>
                    <Icon.Edit
                      onClick={() =>
                        this.props.history.push(
                          "/document/editrequest" + "/" + item.id
                        )
                      }
                      id={"Edit" + item.id}
                      style={{ marginRight: 5 }}
                      size={16}
                    />
                    <UncontrolledTooltip
                      placement="top"
                      target={"Edit" + item.id}
                    ></UncontrolledTooltip>
                  </div>
                )}
                {isDelete && (
                  <div>
                    <Icon.Trash
                      onClick={() =>
                        this.setState({
                          deleteModal: "DeleteModal" + item.id,
                        })
                      }
                      id={"Delete" + item.id}
                      style={{ marginRight: 5 }}
                      size={16}
                    />
                    <UncontrolledTooltip
                      placement="top"
                      target={"Delete" + item.id}
                    >
                      {t2("Delete", intl)}
                    </UncontrolledTooltip>

                    <Modal isOpen={deleteModal == "DeleteModal" + item.id}>
                      <ModalHeader
                        toggle={() =>
                          this.setState({ deleteModal: "DeleteModal" })
                        }
                      >
                        {t2("Delete", intl)}
                      </ModalHeader>
                      <ModalBody>
                        <h5> {t2("WantDelete", intl)} </h5>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          onClick={() =>
                            this.setState({ deleteModal: "DeleteModal" })
                          }
                        >
                          {t2("no", intl)}
                        </Button>{" "}
                        <Button
                          color="success"
                          onClick={() => this.Delete(item, refresh)}
                        >
                          {t2("yes", intl)}
                        </Button>{" "}
                      </ModalFooter>
                    </Modal>
                  </div>
                )}
                {isSend(item.statusId) && (
                  <div>
                    <Icon.Send
                      onClick={() =>
                        this.setState({ send: "sendModal" + item.id })
                      }
                      id={"sendModal" + item.id}
                      style={{ marginRight: 5 }}
                      size={16}
                    />
                    <UncontrolledTooltip
                      placement="top"
                      target={"Send" + item.id}
                    >
                      {/* {t2("Delete", intl)} */}
                      Send
                    </UncontrolledTooltip>

                    <Modal isOpen={send == "sendModal" + item.id}>
                      <ModalHeader
                        toggle={() => this.setState({ send: "sendModal" })}
                      >
                        sendModal
                      </ModalHeader>
                      <ModalBody>
                        <h5>sendModal</h5>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          onClick={() => this.setState({ send: "sendModal" })}
                        >
                          {t2("no", intl)}
                        </Button>{" "}
                        <Button
                          color="success"
                          onClick={() => this.Send(item, refresh)}
                        >
                          {t2("yes", intl)}
                        </Button>{" "}
                      </ModalFooter>
                    </Modal>
                  </div>
                )}
                {isRevoke(item.statusId) && (
                  <div>
                    <Icon.RotateCcw
                      onClick={() =>
                        this.setState({ revoke: "revoke" + item.id })
                      }
                      id={"revoke" + item.id}
                      style={{ marginRight: 5 }}
                      size={16}
                    />
                    <UncontrolledTooltip
                      placement="top"
                      target={"revoke" + item.id}
                    >
                      Revoke
                    </UncontrolledTooltip>
                    <Modal isOpen={revoke == "revoke" + item.id}>
                      <ModalHeader
                        toggle={() => this.setState({ revoke: "revoke" })}
                      >
                        Revoke
                      </ModalHeader>
                      <ModalBody>
                        <h5>Revoke</h5>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          onClick={() => this.setState({ revoke: "revoke" })}
                        >
                          {t2("no", intl)}
                        </Button>{" "}
                        <Button
                          color="success"
                          onClick={() => {
                            this.Revoke(item, refresh);
                          }}
                        >
                          {t2("yes", intl)}
                        </Button>{" "}
                      </ModalFooter>
                    </Modal>
                  </div>
                )}
                {isReceive(item.statusId) && (
                  <div>
                    <Icon.RotateCw
                      onClick={() =>
                        this.setState({ receive: "receive" + item.id })
                      }
                      id={"receive" + item.id}
                      style={{ marginRight: 5 }}
                      size={16}
                    />
                    <UncontrolledTooltip
                      placement="top"
                      target={"receive" + item.id}
                    >
                      Receive
                    </UncontrolledTooltip>
                    <Modal isOpen={receive == "receive" + item.id}>
                      <ModalHeader
                        toggle={() => this.setState({ receive: "receive" })}
                      >
                        Receive
                      </ModalHeader>
                      <ModalBody>
                        <h5>Receive</h5>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          onClick={() => this.setState({ receive: "receive" })}
                        >
                          {t2("no", intl)}
                        </Button>{" "}
                        <Button
                          color="success"
                          onClick={() => {
                            this.Receive(item, refresh);
                          }}
                        >
                          {t2("yes", intl)}
                        </Button>{" "}
                      </ModalFooter>
                    </Modal>
                  </div>
                )}
                {isRefuseByModerator(item.statusId) && (
                  <div>
                    <Icon.UserX
                      onClick={() =>
                        this.setState({
                          refuseByModerator: "refuseByModerator" + item.id,
                        })
                      }
                      id={"refuseByModerator" + item.id}
                      style={{ marginRight: 5 }}
                      size={16}
                    />
                    <UncontrolledTooltip
                      placement="top"
                      target={"refuseByModerator" + item.id}
                    >
                      refuseByModerator
                    </UncontrolledTooltip>
                    <Modal
                      isOpen={
                        refuseByModerator == "refuseByModerator" + item.id
                      }
                    >
                      <ModalHeader
                        toggle={() =>
                          this.setState({
                            refuseByModerator: "refuseByModerator",
                          })
                        }
                      >
                        refuseByModerator
                      </ModalHeader>
                      <ModalBody>
                        <h5>refuseByModerator</h5>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          onClick={() =>
                            this.setState({
                              refuseByModerator: "refuseByModerator",
                            })
                          }
                        >
                          {t2("no", intl)}
                        </Button>{" "}
                        <Button
                          color="success"
                          onClick={() => {
                            this.RefuseByModerator(item, refresh);
                          }}
                        >
                          {t2("yes", intl)}
                        </Button>{" "}
                      </ModalFooter>
                    </Modal>
                  </div>
                )}
                {isToApprove(item.statusId) && (
                  <div>
                    <Icon.CheckSquare
                      onClick={() =>
                        this.setState({ toApprove: "toApprove" + item.id })
                      }
                      id={"toApprove" + item.id}
                      style={{ marginRight: 5 }}
                      size={16}
                    />
                    <UncontrolledTooltip
                      placement="top"
                      target={"toApprove" + item.id}
                    >
                      {/* {t2("Delete", intl)} */}
                      toApprove
                    </UncontrolledTooltip>
                    <Modal isOpen={toApprove == "toApprove" + item.id}>
                      <ModalHeader
                        toggle={() =>
                          this.setState({
                            toApprove: "toApprove",
                          })
                        }
                      >
                        toApprove
                      </ModalHeader>
                      <ModalBody>
                        <h5>toApprove</h5>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          onClick={() =>
                            this.setState({
                              toApprove: "toApprove",
                            })
                          }
                        >
                          {t2("no", intl)}
                        </Button>{" "}
                        <Button
                          color="success"
                          onClick={() => {
                            this.ToApprove(item, refresh);
                          }}
                        >
                          {t2("yes", intl)}
                        </Button>{" "}
                      </ModalFooter>
                    </Modal>
                  </div>
                )}
                {isReturnToModerator(item.statusId) && (
                  <div>
                    <Icon.UserPlus
                      onClick={() =>
                        this.setState({
                          returnToModerator: "returnToModerator" + item.id,
                        })
                      }
                      id={"returnToModerator" + item.id}
                      style={{ marginRight: 5 }}
                      size={16}
                    />
                    <UncontrolledTooltip
                      placement="top"
                      target={"returnToModerator" + item.id}
                    >
                      returnToModerator
                    </UncontrolledTooltip>
                    <Modal
                      isOpen={
                        returnToModerator == "returnToModerator" + item.id
                      }
                    >
                      <ModalHeader
                        toggle={() =>
                          this.setState({
                            returnToModerator: "returnToModerator",
                          })
                        }
                      >
                        returnToModerator
                      </ModalHeader>
                      <ModalBody>
                        <h5>returnToModerator</h5>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          onClick={() =>
                            this.setState({
                              returnToModerator: "returnToModerator",
                            })
                          }
                        >
                          {t2("no", intl)}
                        </Button>{" "}
                        <Button
                          color="success"
                          onClick={() => {
                            this.ReturnToModerator(item, refresh);
                          }}
                        >
                          {t2("yes", intl)}
                        </Button>{" "}
                      </ModalFooter>
                    </Modal>
                  </div>
                )}
                {isReject(item.statusId) && (
                  <div>
                    <Icon.XCircle
                      onClick={() =>
                        this.setState({ reject: "reject" + item.id })
                      }
                      id={"reject" + item.id}
                      style={{ marginRight: 5 }}
                      size={16}
                    />
                    <UncontrolledTooltip
                      placement="top"
                      target={"reject" + item.id}
                    >
                      reject
                    </UncontrolledTooltip>
                    <Modal isOpen={reject == "reject" + item.id}>
                      <ModalHeader
                        toggle={() =>
                          this.setState({
                            reject: "reject",
                          })
                        }
                      >
                        reject
                      </ModalHeader>
                      <ModalBody>
                        <h5>reject</h5>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          onClick={() =>
                            this.setState({
                              reject: "reject",
                            })
                          }
                        >
                          {t2("no", intl)}
                        </Button>{" "}
                        <Button
                          color="success"
                          onClick={() => {
                            this.Reject(item, refresh);
                          }}
                        >
                          {t2("yes", intl)}
                        </Button>{" "}
                      </ModalFooter>
                    </Modal>
                  </div>
                )}
                {isAgree(item.statusId) && (
                  <div>
                    <Icon.Bookmark
                      onClick={() =>
                        this.setState({ agree: "agree" + item.id })
                      }
                      id={"agree" + item.id}
                      style={{ marginRight: 5 }}
                      size={16}
                    />
                    <UncontrolledTooltip
                      placement="top"
                      target={"agree" + item.id}
                    >
                      agree
                    </UncontrolledTooltip>
                    <Modal isOpen={agree == "agree" + item.id}>
                      <ModalHeader
                        toggle={() =>
                          this.setState({
                            agree: "agree",
                          })
                        }
                      >
                        agree
                      </ModalHeader>
                      <ModalBody>
                        <h5>agree</h5>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          onClick={() =>
                            this.setState({
                              agree: "agree",
                            })
                          }
                        >
                          {t2("no", intl)}
                        </Button>{" "}
                        <Button
                          color="success"
                          onClick={() => {
                            this.Agree(item, refresh);
                          }}
                        >
                          {t2("yes", intl)}
                        </Button>{" "}
                      </ModalFooter>
                    </Modal>
                  </div>
                )}
                {isCancelAgreement(item.statusId) && (
                  <div>
                    <Icon.Bookmark
                      onClick={() =>
                        this.setState({
                          cancelAgreement: "cancelAgreement" + item.id,
                        })
                      }
                      id={"cancelAgreement" + item.id}
                      style={{ marginRight: 5 }}
                      size={16}
                    />
                    <UncontrolledTooltip
                      placement="top"
                      target={"cancelAgreement" + item.id}
                    >
                      cancelAgreement
                    </UncontrolledTooltip>
                    <Modal
                      isOpen={cancelAgreement == "cancelAgreement" + item.id}
                    >
                      <ModalHeader
                        toggle={() =>
                          this.setState({
                            cancelAgreement: "cancelAgreement",
                          })
                        }
                      >
                        cancelAgreement
                      </ModalHeader>
                      <ModalBody>
                        <h5>cancelAgreement</h5>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          onClick={() =>
                            this.setState({
                              cancelAgreement: "cancelAgreement",
                            })
                          }
                        >
                          {t2("no", intl)}
                        </Button>{" "}
                        <Button
                          color="success"
                          onClick={() => {
                            this.CancelAgreement(item, refresh);
                          }}
                        >
                          {t2("yes", intl)}
                        </Button>{" "}
                      </ModalFooter>
                    </Modal>
                  </div>
                )}
                {isArchive(item.statusId) && (
                  <div>
                    <Icon.Archive
                      onClick={() =>
                        this.setState({ archive: "archive" + item.id })
                      }
                      id={"archive" + item.id}
                      style={{ marginRight: 5 }}
                      size={16}
                    />
                    <UncontrolledTooltip
                      placement="top"
                      target={"archive" + item.id}
                    >
                      archive
                    </UncontrolledTooltip>
                    <Modal isOpen={archive == "archive" + item.id}>
                      <ModalHeader
                        toggle={() =>
                          this.setState({
                            archive: "archive",
                          })
                        }
                      >
                        archive
                      </ModalHeader>
                      <ModalBody>
                        <h5>archive</h5>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          onClick={() =>
                            this.setState({
                              archive: "archive",
                            })
                          }
                        >
                          {t2("no", intl)}
                        </Button>{" "}
                        <Button
                          color="success"
                          onClick={() => {
                            this.Archive(item, refresh);
                          }}
                        >
                          {t2("yes", intl)}
                        </Button>{" "}
                      </ModalFooter>
                    </Modal>
                  </div>
                )}
              </>
            );
          },
        },
      ],
      filter: {
        search: "",
      },
    };
    this.child = React.createRef();
  }
  componentDidMount() {}

  Delete = (item, refresh) => {
    RequestService.Delete(item.id)
      .then((res) => {
        this.setState({ delete: "DeleteModal" });
        successToast("Delete Modal");
        refresh();
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
  };
  Send = (item, refresh) => {
    RequestService.Send(item.id)
      .then((res) => {
        this.setState({ deleteModal: "DeleteModal" });
        successToast("Send Modal");
        refresh();
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
  };
  Revoke = (item, refresh) => {
    RequestService.Revoke(item.id)
      .then((res) => {
        this.setState({ revoke: "revoke" });
        successToast("Revoke Modal");
        refresh();
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
  };
  Receive = (item, refresh) => {
    RequestService.Receive(item.id)
      .then((res) => {
        this.setState({ receive: "receive" });
        successToast("receive Modal");
        refresh();
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
  };
  RefuseByModerator = (item, refresh) => {
    RequestService.RefuseByModerator(item.id)
      .then((res) => {
        this.setState({ refuseByModerator: "refuseByModerator" });
        successToast("RefuseByModerator Modal");
        refresh();
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
  };
  ToApprove = (item, refresh) => {
    RequestService.ToApprove(item.id)
      .then((res) => {
        this.setState({ toApprove: "toApprove" });
        successToast("ToApprove Modal");
        refresh();
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
  };
  ReturnToModerator = (item, refresh) => {
    RequestService.ReturnToModerator(item.id)
      .then((res) => {
        this.setState({ returnToModerator: "returnToModerator" });
        successToast("ReturnToModerator Modal");
        refresh();
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
  };
  Reject = (item, refresh) => {
    RequestService.Reject(item.id)
      .then((res) => {
        this.setState({ reject: "reject" });
        successToast("Reject Modal");
        refresh();
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
  };
  Agree = (item, refresh) => {
    RequestService.Agree(item.id)
      .then((res) => {
        this.setState({ agree: "agree" });
        successToast("Agree Modal");
        refresh();
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
  };
  CancelAgreement = (item, refresh) => {
    RequestService.CancelAgreement(item.id)
      .then((res) => {
        this.setState({ cancelAgreement: "cancelAgreement" });
        successToast("CancelAgreement Modal");
        refresh();
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
  };
  Archive = (item, refresh) => {
    RequestService.Archive(item.id)
      .then((res) => {
        this.setState({ archive: "archive" });
        successToast("archive Modal");
        refresh();
      })
      .catch((error) => {
        errorToast(error.response.data);
      });
  };

  handleChange(event, field, data) {
    var filter = this.state.filter;
    filter[field] = !!event.target ? event.target.value : data.value;
    this.setState({ filter: filter });
  }

  render() {
    const { intl, history } = this.props;
    const { fields, filter } = this.state;

    return (
      <div>
        <Card className="p-2">
          <Row>
            <Col>
              <h2>Test Page </h2>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6} lg={4}>
              <InputGroup>
                <Input
                  placeholder={t2("Search", intl)}
                  onChange={(e) => this.handleChange(e, "search")}
                />
                <InputGroupAddon addonType="append">
                  <Button
                    color="primary"
                    onClick={() => {
                      this.child.state.page.page = 1;
                      this.child.Refresh();
                    }}
                  >
                    {" "}
                    <Icon.Search size={14} /> {t1("Search")}{" "}
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </Col>
            <Col sm={12} md={6} lg={8} className="text-right">
              {can("RequestCreate") ? (
                <Button
                  color="primary"
                  onClick={() => history.push(`/document/editrequest/0`)}
                >
                  {" "}
                  <Icon.Plus size={14} /> {t1("Create")}{" "}
                </Button>
              ) : (
                ""
              )}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <WebaseTable2
                fields={fields}
                filter={filter}
                api={RequestService}
                childRef={(ref) => (this.child = ref)}
                actions={{
                  edit: {
                    isView: can("RequestEdit"),
                    router: "/document/editrequest",
                  },
                  delete: {
                    isView: can("RequestDelete"),
                  },
                  send: {
                    isView: can("RequestSend"),
                  },
                  revoke: {
                    isView: can("RequestSend"),
                  },
                  receive: {
                    isView: can("RequestReceive"),
                  },
                  refuseByModerator: {
                    isView: can("RequestReceive"),
                  },
                  toApprove: {
                    isView: can("RequestReceive"),
                  },
                  returnToModerator: {
                    isView: can("RequestAgree"),
                  },
                  reject: {
                    isView: can("RequestAgree"),
                  },
                  agree: {
                    isView: can("RequestAgree"),
                  },
                  cancelAgreement: {
                    isView: can("RequestAgree"),
                  },
                  archive: {
                    isView: can("RequestArchive"),
                  },
                }}
              />
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
export default injectIntl(TestPage);
