import React, { useState } from "react";
import {
  Table,
  Spinner,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Badge,
  Row,
  Col,
  CustomInput,
} from "reactstrap";
import * as Icon from "react-feather";
import { useHistory } from "react-router";
import { injectIntl, useIntl } from "react-intl";
import ReactPaginate from "react-paginate";
import { Translate, Color, Notification } from "../functions";
import "../../../assets/scss/plugins/extensions/react-paginate.scss";
const { t1, t2 } = Translate;
const { status } = Color;
const { errorToast, successToast } = Notification;
const Actions = (props) => {
  const history = useHistory();
  const intl = useIntl();
  const [deleteModal, setDeleteModal] = useState("DeleteModal");
  const [sendModal, setSendModal] = useState("sendModal");
  const [revokeModal, setRevokeModal] = useState("revokeModal");
  const [receiveModal, setReceiveModal] = useState("receiveModal");
  const [refuseByModerator, setRefuseByModerator] =
    useState("refuseByModerator");
  const [toApprove, setToApprove] = useState("toApprove");
  const [returnToModerator, setReturnToModerator] =
    useState("returnToModerator");
  const [reject, setReject] = useState("reject");
  const [agree, setAgree] = useState("agree");
  const [cancelAgreement, setCancelAgreement] = useState("cancelAgreement");
  const [archive, setArchive] = useState("archive");
  const Delete = (item) => {
    if (props.delete.isView) {
      props.api
        .Delete(item.id)
        .then((res) => {
          setDeleteModal("DeleteModal");
          successToast(t2("DeleteSuccess", intl));
          props.refresh();
        })
        .catch((error) => {
          errorToast(error.response.data);
        });
    }
  };
  const Send = (item) => {
    if (props.send.isView) {
      props.api
        .Send({
          id: item.id,
        })
        .then((res) => {
          setSendModal("sendModal");
          successToast("Send Success");
          props.refresh();
        })
        .catch((error) => {
          errorToast(error.response.data);
        });
    }
  };

  const Revoke = (item) => {
    if (props.send.isView) {
      props.api
        .Revoke({
          id: item.id,
        })
        .then((res) => {
          setRevokeModal("revokeModal");
          successToast("Revoke Success");
          props.refresh();
        })
        .catch((error) => {
          errorToast(error.response.data);
        });
    }
  };
  const Receive = (item) => {
    if (props.send.isView) {
      props.api
        .Receive({
          id: item.id,
        })
        .then((res) => {
          setReceiveModal("receiveModal");
          successToast("receive Success");
          props.refresh();
        })
        .catch((error) => {
          errorToast(error.response.data);
        });
    }
  };
  const RefuseByModerator = (item) => {
    if (props.refuseByModerator.isView) {
      props.api
        .RefuseByModerator({
          id: item.id,
        })
        .then((res) => {
          setRefuseByModerator("refuseByModerator");
          successToast("refuseByModerator Success");
          props.refresh();
        })
        .catch((error) => {
          errorToast(error.response.data);
        });
    }
  };
  const ToApprove = (item) => {
    if (props.toApprove.isView) {
      props.api
        .ToApprove({
          id: item.id,
        })
        .then((res) => {
          setToApprove("toApprove");
          successToast("toApprove Success");
          props.refresh();
        })
        .catch((error) => {
          errorToast(error.response.data);
        });
    }
  };
  const ReturnToModerator = (item) => {
    if (props.returnToModerator.isView) {
      props.api
        .ReturnToModerator({
          id: item.id,
        })
        .then((res) => {
          setReturnToModerator("returnToModerator");
          successToast("returnToModerator Success");
          props.refresh();
        })
        .catch((error) => {
          errorToast(error.response.data);
        });
    }
  };
  const Reject = (item) => {
    if (props.reject.isView) {
      props.api
        .Reject({
          id: item.id,
        })
        .then((res) => {
          setReject("reject");
          successToast("reject Success");
          props.refresh();
        })
        .catch((error) => {
          errorToast(error.response.data);
        });
    }
  };
  const Agree = (item) => {
    if (props.reject.isView) {
      props.api
        .Agree({
          id: item.id,
        })
        .then((res) => {
          setAgree("agree");
          successToast("agree Success");
          props.refresh();
        })
        .catch((error) => {
          errorToast(error.response.data);
        });
    }
  };
  const CancelAgreement = (item) => {
    if (props.cancelAgreement.isView) {
      props.api
        .CancelAgreement({
          id: item.id,
        })
        .then((res) => {
          setCancelAgreement("cancelAgreement");
          successToast("cancelAgreement Success");
          props.refresh();
        })
        .catch((error) => {
          errorToast(error.response.data);
        });
    }
  };
  const Archive = (item) => {
    if (props.archive.isView) {
      props.api
        .Archive({
          id: item.id,
        })
        .then((res) => {
          setArchive("archive");
          successToast("archive Success");
          props.refresh();
        })
        .catch((error) => {
          errorToast(error.response.data);
        });
    }
  };

  const ModalComponent = ({ state, setState, name, props, apiReq }) => (
    <Modal isOpen={state == name + props.item.id}>
      <ModalHeader toggle={() => setState(name)}>
        {/* {t2("Delete", intl)} */}
        {name}
      </ModalHeader>
      <ModalBody>
        {/* <h5> {t2("WantDelete", intl)} </h5> */}
        <h5>Are you sure you want to {name}?</h5>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={() => setState(name)}>
          {t2("no", intl)}
        </Button>{" "}
        <Button color="success" onClick={() => apiReq(props.item)}>
          {t2("yes", intl)}
        </Button>{" "}
      </ModalFooter>
    </Modal>
  );
  return (
    <div style={{ cursor: "pointer", whiteSpace: "nowrap", display: "flex" }}>
      {props.edit.isView ? (
        <div>
          <Icon.Edit
            onClick={() =>
              history.push(props.edit.router + "/" + props.item.id)
            }
            id={"Edit" + props.item.id}
            style={{ marginRight: 5 }}
            size={16}
          />
          <UncontrolledTooltip placement="top" target={"Edit" + props.item.id}>
            {t2("Edit", intl)}
          </UncontrolledTooltip>
        </div>
      ) : (
        ""
      )}

      {props.delete.isView ? (
        <div>
          <Icon.Trash
            onClick={() => setDeleteModal("DeleteModal" + props.item.id)}
            id={"Delete" + props.item.id}
            style={{ marginRight: 5 }}
            size={16}
          />
          <UncontrolledTooltip
            placement="top"
            target={"Delete" + props.item.id}
          >
            {t2("Delete", intl)}
          </UncontrolledTooltip>
          <Modal isOpen={deleteModal == "DeleteModal" + props.item.id}>
            <ModalHeader toggle={() => setDeleteModal("DeleteModal")}>
              {t2("Delete", intl)}
            </ModalHeader>
            <ModalBody>
              <h5> {t2("WantDelete", intl)} </h5>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                onClick={() => setDeleteModal("DeleteModal")}
              >
                {t2("no", intl)}
              </Button>{" "}
              <Button color="success" onClick={() => Delete(props.item)}>
                {t2("yes", intl)}
              </Button>{" "}
            </ModalFooter>
          </Modal>
        </div>
      ) : (
        ""
      )}
      {props.send.isView ? (
        <div>
          <Icon.Send
            onClick={() => setSendModal("sendModal" + props.item.id)}
            id={"Send" + props.item.id}
            style={{ marginRight: 5 }}
            size={16}
          />
          <UncontrolledTooltip placement="top" target={"Send" + props.item.id}>
            {/* {t2("Delete", intl)} */}
            Send
          </UncontrolledTooltip>
          <ModalComponent
            state={sendModal}
            setState={setSendModal}
            props={props}
            name={"sendModal"}
            apiReq={Send}
          />
        </div>
      ) : (
        ""
      )}
      {props.revoke.isView ? (
        <div>
          <Icon.RotateCcw
            onClick={() => setRevokeModal("revokeModal" + props.item.id)}
            id={"Revoke" + props.item.id}
            style={{ marginRight: 5 }}
            size={16}
          />
          <UncontrolledTooltip
            placement="top"
            target={"Revoke" + props.item.id}
          >
            {/* {t2("Delete", intl)} */}
            Revoke
          </UncontrolledTooltip>
          <ModalComponent
            state={revokeModal}
            setState={setRevokeModal}
            props={props}
            name={"revokeModal"}
            apiReq={Revoke}
          />
        </div>
      ) : (
        ""
      )}
      {props.receive.isView ? (
        <div>
          <Icon.RotateCw
            onClick={() => setReceiveModal("receiveModal" + props.item.id)}
            id={"Receive" + props.item.id}
            style={{ marginRight: 5 }}
            size={16}
          />
          <UncontrolledTooltip
            placement="top"
            target={"Receive" + props.item.id}
          >
            {/* {t2("Delete", intl)} */}
            Receive
          </UncontrolledTooltip>
          <ModalComponent
            state={receiveModal}
            setState={setReceiveModal}
            props={props}
            name={"receiveModal"}
            apiReq={Receive}
          />
        </div>
      ) : (
        ""
      )}
      {props.refuseByModerator.isView ? (
        <div>
          <Icon.UserX
            onClick={() =>
              setRefuseByModerator("refuseByModerator" + props.item.id)
            }
            id={"refuseByModerator" + props.item.id}
            style={{ marginRight: 5 }}
            size={16}
          />
          <UncontrolledTooltip
            placement="top"
            target={"refuseByModerator" + props.item.id}
          >
            {/* {t2("Delete", intl)} */}
            refuseByModerator
          </UncontrolledTooltip>
          <ModalComponent
            state={refuseByModerator}
            setState={setRefuseByModerator}
            props={props}
            name={"refuseByModerator"}
            apiReq={RefuseByModerator}
          />
        </div>
      ) : (
        ""
      )}
      {props.toApprove.isView ? (
        <div>
          <Icon.CheckSquare
            onClick={() => setToApprove("toApprove" + props.item.id)}
            id={"toApprove" + props.item.id}
            style={{ marginRight: 5 }}
            size={16}
          />
          <UncontrolledTooltip
            placement="top"
            target={"toApprove" + props.item.id}
          >
            {/* {t2("Delete", intl)} */}
            toApprove
          </UncontrolledTooltip>
          <ModalComponent
            state={toApprove}
            setState={setToApprove}
            props={props}
            name={"toApprove"}
            apiReq={ToApprove}
          />
        </div>
      ) : (
        ""
      )}
      {props.returnToModerator.isView ? (
        <div>
          <Icon.UserPlus
            onClick={() =>
              setReturnToModerator("returnToModerator" + props.item.id)
            }
            id={"returnToModerator" + props.item.id}
            style={{ marginRight: 5 }}
            size={16}
          />
          <UncontrolledTooltip
            placement="top"
            target={"returnToModerator" + props.item.id}
          >
            {/* {t2("Delete", intl)} */}
            returnToModerator
          </UncontrolledTooltip>
          <ModalComponent
            state={returnToModerator}
            setState={setReturnToModerator}
            props={props}
            name={"returnToModerator"}
            apiReq={ReturnToModerator}
          />
        </div>
      ) : (
        ""
      )}
      {props.reject.isView ? (
        <div>
          <Icon.XCircle
            onClick={() => setReject("reject" + props.item.id)}
            id={"reject" + props.item.id}
            style={{ marginRight: 5 }}
            size={16}
          />
          <UncontrolledTooltip
            placement="top"
            target={"reject" + props.item.id}
          >
            {/* {t2("Delete", intl)} */}
            reject
          </UncontrolledTooltip>
          <ModalComponent
            state={reject}
            setState={setReject}
            props={props}
            name={"reject"}
            apiReq={Reject}
          />
        </div>
      ) : (
        ""
      )}
      {props.agree.isView ? (
        <div>
          <Icon.Bookmark
            onClick={() => setAgree("agree" + props.item.id)}
            id={"agree" + props.item.id}
            style={{ marginRight: 5 }}
            size={16}
          />
          <UncontrolledTooltip placement="top" target={"agree" + props.item.id}>
            {/* {t2("Delete", intl)} */}
            agree
          </UncontrolledTooltip>
          <ModalComponent
            state={agree}
            setState={setAgree}
            props={props}
            name={"agree"}
            apiReq={Agree}
          />
        </div>
      ) : (
        ""
      )}
      {props.cancelAgreement.isView ? (
        <div>
          <Icon.Bookmark
            onClick={() =>
              setCancelAgreement("cancelAgreement" + props.item.id)
            }
            id={"cancelAgreement" + props.item.id}
            style={{ marginRight: 5 }}
            size={16}
          />
          <UncontrolledTooltip
            placement="top"
            target={"cancelAgreement" + props.item.id}
          >
            {/* {t2("Delete", intl)} */}
            cancelAgreement
          </UncontrolledTooltip>
          <ModalComponent
            state={cancelAgreement}
            setState={setCancelAgreement}
            props={props}
            name={"cancelAgreement"}
            apiReq={CancelAgreement}
          />
        </div>
      ) : (
        ""
      )}
      {props.archive.isView ? (
        <div>
          <Icon.Archive
            onClick={() => setArchive("archive" + props.item.id)}
            id={"archive" + props.item.id}
            style={{ marginRight: 5 }}
            size={16}
          />
          <UncontrolledTooltip
            placement="top"
            target={"archive" + props.item.id}
          >
            {/* {t2("Delete", intl)} */}
            archive
          </UncontrolledTooltip>
          <ModalComponent
            state={archive}
            setState={setArchive}
            props={props}
            name={"archive"}
            apiReq={Archive}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

const BadgeItem = ({ item }) => {
  return (
    <div>
      <Badge color={"light-" + status(item)}>{item.state}</Badge>
    </div>
  );
};
class WebaseTable2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      items: [],
      total: 0,
      page: {
        sortBy: "",
        orderType: "asc",
        page: 1,
        pageSize: 20,
      },
      pageSelectList: [20, 50, 100, 200],
    };
  }
  componentDidMount() {
    const { childRef } = this.props;
    childRef(this);
    this.Refresh();
  }
  componentWillUnmount() {
    const { childRef } = this.props;
    childRef(undefined);
  }
  onSortChange = (item) => {
    if (!!item.sort) {
      var orderType = this.state.page.orderType;
      if (orderType == "asc") {
        this.SortChange(item.key, "desc");
      } else {
        this.SortChange(item.key, "asc");
      }
    }
  };
  Refresh = () => {
    const { page } = this.state;
    this.setState({ loading: true });

    this.props.api
      .GetList(Object.assign(this.props.filter, page))
      .then((res) => {
        this.setState({
          loading: false,
          items: res.data.rows,
          total: res.data.total,
        });
      })
      .catch((error) => {
        errorToast(error.response.data);
        this.setState({ loading: false });
      });
  };
  SortChange = (columnName, orderType) => {
    var page = this.state.page;
    page.orderType = orderType;
    page.sortBy = columnName;
    this.setState({ page: page });
    this.Refresh();
  };

  isArchive = (id) =>
    id === 1 || id === 12 || id === 8 || id === 10 || id === 4;
  isAgree = (id) => id === 5 || id === 11;
  isCancelAgreement = (id) => id === 7;
  isSend = (id) => id === 1 || id === 10 || id === 12;
  isReceive = (id) => id === 2;
  isRefuseByModerator = (id) => id === 2 || id === 3;
  isToApprove = (id) => id === 2 || id === 3;
  isReturnToModerator = (id) => id === 5 || id === 11;
  isReject = (id) => id === 5 || id === 11;
  isRevoke = (id) => id === 2;
  isModify = (id) => id === 1 || id === 10 || id === 12;
  isPostpone = (id) => id === 7;
  isProlong = (id) => id === 7;
  isCancel = (id) => id === 7;
  isHeld = (id) => id === 1 || id === 12;

  // isAgree = (id) => ;

  render() {
    const { fields, actions, api } = this.props;
    const { items, page, total, loading, pageSelectList } = this.state;
    return (
      <div>
        <Table responsive bordered borderless striped>
          <thead className="bg-primary text-white">
            <tr>
              {fields.length > 0
                ? fields.map((item, index) => (
                    <th
                      key={index}
                      onClick={() => this.onSortChange(item)}
                      style={{ cursor: "pointer" }}
                    >
                      {item.label}{" "}
                      {item.sort && page.sortBy == item.key ? (
                        page.orderType == "asc" ? (
                          <Icon.ArrowUp size={15} />
                        ) : (
                          <Icon.ArrowDown size={15} />
                        )
                      ) : (
                        ""
                      )}
                    </th>
                  ))
                : ""}
            </tr>
          </thead>
          {loading ? (
            <tbody className="text-center">
              <tr>
                <td colSpan={fields.length}>
                  <Spinner color="primary"></Spinner>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={index + "items"}>
                    {fields.map((el, i) => (
                      <td key={i + "td"}>
                        {el.key == "actions" ? (
                          <div
                            style={{
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                              display: "flex",
                            }}
                          >
                            {el.actions && el.actions(item, this.Refresh)}
                          </div>
                        ) : el.badge ? (
                          <BadgeItem item={item} />
                        ) : (
                          item[el.key]
                        )}
                        {el.key == "actions" ? (
                          <>
                            <Actions
                              item={item}
                              api={api}
                              refresh={this.Refresh}
                              edit={{
                                isView:
                                  !!actions && !!actions.edit
                                    ? actions.edit.isView
                                    : false,
                                router:
                                  !!actions && !!actions.edit
                                    ? actions.edit.router
                                    : "",
                              }}
                              delete={{
                                isView:
                                  !!actions && !!actions.delete
                                    ? actions.delete.isView
                                    : false,
                              }}
                              send={{
                                isView:
                                  !!actions &&
                                  !!actions.send &&
                                  this.isSend(item.statusId)
                                    ? actions.send.isView
                                    : false,
                              }}
                              revoke={{
                                isView:
                                  !!actions &&
                                  !!actions.revoke &&
                                  this.isRevoke(item.statusId)
                                    ? actions.revoke.isView
                                    : false,
                              }}
                              receive={{
                                isView:
                                  !!actions &&
                                  !!actions.receive &&
                                  this.isReceive(item.statusId)
                                    ? actions.receive.isView
                                    : false,
                              }}
                              refuseByModerator={{
                                isView:
                                  !!actions &&
                                  !!actions.refuseByModerator &&
                                  this.isRefuseByModerator(item.statusId)
                                    ? actions.refuseByModerator.isView
                                    : false,
                              }}
                              toApprove={{
                                isView:
                                  !!actions &&
                                  !!actions.toApprove &&
                                  this.isToApprove(item.statusId)
                                    ? actions.toApprove.isView
                                    : false,
                              }}
                              returnToModerator={{
                                isView:
                                  !!actions &&
                                  !!actions.returnToModerator &&
                                  this.isReturnToModerator(item.statusId)
                                    ? actions.returnToModerator.isView
                                    : false,
                              }}
                              reject={{
                                isView:
                                  !!actions &&
                                  !!actions.reject &&
                                  this.isReject(item.statusId)
                                    ? actions.reject.isView
                                    : false,
                              }}
                              agree={{
                                isView:
                                  !!actions &&
                                  !!actions.agree &&
                                  this.isAgree(item.statusId)
                                    ? actions.agree.isView
                                    : false,
                              }}
                              cancelAgreement={{
                                isView:
                                  !!actions &&
                                  !!actions.cancelAgreement &&
                                  this.isCancelAgreement(item.statusId)
                                    ? actions.cancelAgreement.isView
                                    : false,
                              }}
                              archive={{
                                isView:
                                  !!actions &&
                                  !!actions.archive &&
                                  this.isArchive(item.statusId)
                                    ? actions.archive.isView
                                    : false,
                              }}
                            />
                          </>
                        ) : el.badge ? (
                          <BadgeItem item={item} />
                        ) : (
                          item[el.key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <th className="text-center" colSpan={fields.length}>
                    {" "}
                    {t1("NoItems")}{" "}
                  </th>
                </tr>
              )}
            </tbody>
          )}
        </Table>
        <Row>
          <Col className="ml-1 d-flex align-items-center">
            <div className="mr-2">
              {" "}
              {(page.page - 1) * page.pageSize + 1}-
              {total < page.pageSize
                ? total
                : page.page * page.pageSize > total
                ? total
                : page.page * page.pageSize}{" "}
              ({total}){" "}
            </div>

            <div style={{ width: 100 }}>
              <CustomInput
                id="exampleSelect"
                name="select"
                type="select"
                value={page.pageSize}
                onChange={(e) => {
                  page.pageSize = e.target.value;
                  this.setState({ page: page });
                  this.Refresh();
                }}
              >
                {pageSelectList.map((item, index) => (
                  <option key={index}> {item} </option>
                ))}
              </CustomInput>
            </div>
          </Col>
          <Col>
            <ReactPaginate
              previousLabel={<Icon.ChevronLeft size={15} />}
              nextLabel={<Icon.ChevronRight size={15} />}
              breakLabel="..."
              forcePage={page.page - 1}
              breakClassName="break-me"
              pageCount={Math.ceil(total / page.pageSize)}
              containerClassName="vx-pagination separated-pagination pagination-end pagination-sm mb-0 mt-2"
              activeClassName="active"
              onPageChange={(num) => {
                page.page = num.selected + 1;
                this.setState({ page: page });
                this.Refresh();
              }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
export default injectIntl(WebaseTable2);
