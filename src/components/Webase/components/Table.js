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
import RequestService from "../../../services/document/request.service";
import { useHistory } from "react-router";
import { injectIntl, useIntl } from "react-intl";
import ReactPaginate from "react-paginate";
import { Translate, Color, Notification, Permission } from "../functions";
import "../../../assets/scss/plugins/extensions/react-paginate.scss";
import HeightStyle from "./heightstyle.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  changeSortBy,
  changeOrderType,
  changePage,
  changePageSize,
  changeAll,
} from "../../../redux/actions/pagination";

const { t1, t2 } = Translate;
const { can } = Permission;
const { status } = Color;
const { errorToast, successToast } = Notification;
const Actions = (props) => {
  const history = useHistory();
  const intl = useIntl();
  const [deleteModal, setDeleteModal] = useState("DeleteModal");

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
  const Print = (item) => {
    if (props.print.isView) {
      props.api
        .Print(item.id)
        .then((res) => {
          forceFileDownload(res);
          props.refresh();
        })
        .catch((error) => {
          errorToast(error.response.data);
        });
    }
  };
  const forceFileDownload = (response, name, attachfilename) => {
    var blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    // let format = attachfilename.split(".");
    const link = document.createElement("a");
    link.href = url;
    // if (format.length > 0) {
    link.setAttribute("download", "Аттестация" + "." + "xlsx");
    // }
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

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
      {props.view.isView ? (
        <div>
          <Icon.Eye
            onClick={() => {
              if (props.view.router != undefined) {
                history.push({
                  pathname: props.view.router + "/" + props.item.id,
                  state: {
                    inspectionBookOfContractorId:
                      props.item.inspectionBookOfContractorId,
                    inspectionBookId: props.item.inspectionBookId,
                  },
                });
              } else {
                props.actions().view.moveFunction(props.item);
              }
            }}
            id={"View" + props.item.id}
            style={{ marginRight: 5 }}
            size={16}
          />
          <UncontrolledTooltip placement="top" target={"View" + props.item.id}>
            {t2("View", intl)}
          </UncontrolledTooltip>
        </div>
      ) : (
        ""
      )}
      {props.print.isView ? (
        <div>
          <Icon.Printer
            onClick={() => {
              Print(props.item);
            }}
            id={"Print" + props.item.id}
            style={{ marginRight: 5 }}
            size={16}
          />
          <UncontrolledTooltip placement="top" target={"Print" + props.item.id}>
            {t2("Print", intl)}
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
    </div>
  );
};

const BadgeItem = ({ item, sort }) => {
  if ("status" == sort) {
    return (
      item.status?.length > 0 && (
        <div>
          <Badge
            style={{
              color: "black !important",
              padding: "5px 10px",
              fontSize: "10px",
              textTransform: "uppercase",
            }}
            color={status(item)}
          >
            <span> {item[sort]}</span>
          </Badge>
        </div>
      )
    );
  }
  if ("ceoStatus" == sort) {
    return (
      item.ceoStatus?.length > 0 && (
        <div>
          <Badge
            style={{
              color: "black !important",
              padding: "5px 10px",
              fontSize: "10px",
              textTransform: "uppercase",
            }}
            color={status(item)}
          >
            <span style={{ color: "black" }}> {item[sort]}</span>
          </Badge>
        </div>
      )
    );
  } else if ("moderatorStatus" == sort) {
    return (
      item.moderatorStatus?.length > 0 && (
        <div>
          <Badge
            style={{
              color: "black !important",
              padding: "5px 10px",
              fontSize: "10px",
              textTransform: "uppercase",
            }}
            color={status(item)}
          >
            <span> {item[sort]}</span>
          </Badge>
        </div>
      )
    );
  } else if ("inspectorStatus" == sort) {
    return (
      item.inspectorStatus?.length > 0 && (
        <div>
          <Badge
            style={{
              color: "black !important",
              padding: "5px 10px",
              fontSize: "10px",
              textTransform: "uppercase",
            }}
            color={status(item)}
          >
            <span> {item[sort]}</span>
          </Badge>
        </div>
      )
    );
  } else if ("docStatusId" in item) {
    return (
      item.docStatusId?.length > 0 && (
        <div>
          <Badge
            style={{
              color: "black !important",
              padding: "5px 10px",
              fontSize: "10px",
              textTransform: "uppercase",
            }}
            color={status(item)}
          >
            <span> {item.docStatus}</span>
          </Badge>
        </div>
      )
    );
  } else if ("executedStatus" in item) {
    return (
      item.executedStatus?.length > 0 && (
        <div>
          <Badge
            style={{
              color: "black !important",
              padding: "5px 10px",
              fontSize: "10px",
              textTransform: "uppercase",
            }}
            color={status(item)}
          >
            <span> {item.executedStatus}</span>
          </Badge>
        </div>
      )
    );
  } else {
    return (
      item.state?.length > 0 && (
        <div>
          <Badge
            style={{
              color: "black !important",
              padding: "5px 10px",
              fontSize: "10px",
              textTransform: "uppercase",
            }}
            color={status(item)}
          >
            <span> {item.state}</span>
          </Badge>
        </div>
      )
    );
  }
};
let tempArray = [];

class WebaseTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      items: [],
      tempSize: [],
      total: 0,
      filters: {},
      page: {
        sortBy: "",
        orderType: "asc",
        // page: 1,
        // pageSize: 20,
      },
      pageSelectList: [20, 50, 100, 200],
    };
  }
  componentDidMount() {
    const { childRef } = this.props;
    childRef(this);
    this.Refresh();
    // this.props.changePagination(this.props.filter);
    // this.props.changeAll({
    //   sortBy: "",
    //   orderType: "asc",
    //   page: 1,
    //   pageSize: 20,
    // });
    // this.setState({ page: this.props.values });
  }
  componentWillUnmount() {
    const { childRef } = this.props;
    childRef(undefined);
    // this.setState({ page: this.props.values });
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
    // const { page } = this.state;
    const page = this.props.values;
    const { filters } = this.props;
    this.setState({ loading: true });
    if (this.props.EmployeeAttestation) {
      this.props.api
        .GetListAttestation(Object.assign(this.props.filter, page, filters))
        .then((res) => {
          this.setState({
            loading: false,
            items: res.data.rows,
            total: res.data.total,
          });
          for (let i = 0; i < res.data.total; i++) {
            tempArray.push(i + 1);
          }
          let start = page.pageSize * (page.page - 1);
          let end = start + page.pageSize;
          let tempSize = tempArray.slice(start, end);
          this.setState({ tempSize });
        })
        .catch((error) => {
          errorToast(error.response.data);
          this.setState({ loading: false });
        });
    } else {
      if (!!this.props.options && Object.keys(this.props.options).length != 0) {
        this.props.api
          .GetList(this.props.options)
          .then((res) => {
            this.setState({
              loading: false,
              items: res.data.rows,
              total: res.data.total,
            });
            for (let i = 0; i < res.data.total; i++) {
              tempArray.push(i + 1);
            }
            let start = page.pageSize * (page.page - 1);
            let end = start + page.pageSize;
            let tempSize = tempArray.slice(start, end);
            this.setState({ tempSize });
          })
          .catch((error) => {
            errorToast(error.response.data);
            this.setState({ loading: false });
          });
      } else {
        this.props.api
          .GetList(
            Object.assign(this.props.filter, page, filters, {
              sortBy: this.state.page.sortBy,
              orderType: this.state.page.orderType,
            })
          )
          .then((res) => {
            this.setState({
              loading: false,
              items: res.data.rows,
              total: res.data.total,
            });
            for (let i = 0; i < res.data.total; i++) {
              tempArray.push(i + 1);
            }
            let start = page.pageSize * (page.page - 1);
            let end = start + page.pageSize;
            let tempSize = tempArray.slice(start, end);
            this.setState({ tempSize });
          })
          .catch((error) => {
            errorToast(error.response.data);
            this.setState({ loading: false });
          });
      }
    }
  };

  SortChange = (columnName, orderType) => {
    var page = this.state.page;
    // var page = this.props.values;
    page.orderType = orderType;
    page.sortBy = columnName;

    this.props.changeOrderType(orderType);
    this.props.changeSortBy(columnName);

    this.setState({ page: page });
    this.Refresh();
  };

  render() {
    const { fields, actions, api, searches, width } = this.props;
    // const { items, page, total, loading, pageSelectList, tempSize } =
    //   this.state;
    const { items, total, loading, pageSelectList, tempSize } = this.state;
    const page = this.props.values;
    return (
      <div>
        <Table
          size="sm"
          responsive
          striped
          style={width ? { width: "max-content" } : {}}
        >
          <thead className="bg-primary text-white">
            <tr>
              {fields.length > 0
                ? fields.map((item, index) => (
                    <th key={index} style={item.style}>
                      <div
                        onClick={() => this.onSortChange(item)}
                        style={{ cursor: "pointer" }}
                      >
                        {item.label}{" "}
                        {item.sort && this.state.page.sortBy == item.key ? (
                          this.state.page.orderType == "asc" ? (
                            <Icon.ArrowUp size={15} />
                          ) : (
                            <Icon.ArrowDown size={15} />
                          )
                        ) : (
                          ""
                        )}
                      </div>
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
              {!!searches && searches.length > 0 ? (
                <tr style={{ margin: "0", padding: "0" }}>
                  {searches.map((item, idx) => (
                    <td
                      style={{ margin: "2px", padding: "1px" }}
                      key={idx + "search"}
                    >
                      {item.filter ? item.search() : null}
                    </td>
                  ))}
                </tr>
              ) : null}
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={index + "items"}>
                    {fields.map((el, i) =>
                      el.key === "idNomer" ? (
                        <td key={i + "td"}>{tempSize[index]}</td>
                      ) : (
                        <td
                          key={i + "td"}
                          style={{
                            textAlign:
                              el.key === "isPassedAttestation" ||
                              el.roleCenter ||
                              el.key === "status" ||
                              el.key === "state" ||
                              el.key === "executedStatus"
                                ? "center"
                                : "left",
                          }}
                        >
                          {el.key == "actions" ? (
                            <Actions
                              item={item}
                              api={api}
                              refresh={this.Refresh}
                              // notificationRefresh={
                              //   this.props.notificationRefresh
                              // }
                              actions={actions}
                              edit={{
                                isView:
                                  !!actions && !!actions(item.statusId).edit
                                    ? actions(item.statusId).edit.isView
                                    : false,
                                router:
                                  !!actions && !!actions(item.statusId).edit
                                    ? actions(item.statusId).edit.router
                                    : "",
                              }}
                              view={{
                                isView:
                                  !!actions && !!actions(item.statusId).view
                                    ? actions(item.statusId, item).view.isView
                                    : false,
                                router:
                                  !!actions && !!actions(item.statusId).view
                                    ? actions(item.statusId).view.router
                                    : "",
                              }}
                              print={{
                                isView:
                                  !!actions && !!actions(item.statusId).print
                                    ? actions(item.statusId).print.isView
                                    : false,
                              }}
                              delete={{
                                isView:
                                  !!actions && !!actions(item.statusId).delete
                                    ? actions(item.statusId).delete.isView
                                    : false,
                              }}
                            />
                          ) : el.badge ? (
                            <BadgeItem item={item} sort={el.statusSort} />
                          ) : el.see ? (
                            <div
                              style={{
                                color: "blue",
                                fontWeight: "500",
                              }}
                            >
                              {item[el.key]}
                            </div>
                          ) : el.show ? (
                            <div
                              style={{
                                cursor: "pointer",
                                color: "blue",
                                fontWeight: "500",
                              }}
                              onClick={() => {
                                if (
                                  can("RequestAgree") ||
                                  can("RequestView") ||
                                  can("RequestReceive")
                                ) {
                                  this.props.history.push({
                                    pathname: "/management/showuser",
                                    state: {
                                      id:
                                        "employeeId" in item
                                          ? item.employeeId
                                          : item.id,
                                    },
                                  });
                                }
                              }}
                            >
                              {item[el.key]}
                            </div>
                          ) : el.attestationIdShow ? (
                            <div
                              style={{
                                cursor: "pointer",
                                color: "blue",
                                fontWeight: "500",
                              }}
                            >
                              {item[el.key] !== 0 ? (
                                <Link
                                  style={{
                                    cursor: "pointer",
                                    color: "blue",
                                    fontWeight: "500",
                                  }}
                                  to={`/document/viewattestation/${item.attestationId}`}
                                >
                                  {" "}
                                  {item[el.key]}
                                </Link>
                              ) : (
                                <span
                                  style={{
                                    cursor: "pointer",
                                    color: "blue",
                                    fontWeight: "500",
                                  }}
                                >
                                  {item[el.key]}
                                </span>
                              )}
                            </div>
                          ) : el.attestationIdShowID ? (
                            <div
                              style={{
                                cursor: "pointer",
                                color: "blue",
                                fontWeight: "500",
                              }}
                              // onClick={() => {
                              //   this.props.history.push({
                              //     pathname: "/document/viewattestation",
                              //     state: {
                              //       id:
                              //         "attestationId" in item
                              //           ? item.attestationId
                              //           : item.id,
                              //     },
                              //   });
                              // }}
                            >
                              <Link
                                style={{
                                  cursor: "pointer",
                                  color: "blue",
                                  fontWeight: "500",
                                }}
                                to={`/document/viewattestation/${item.attestationId}`}
                              >
                                {" "}
                                {item[el.key]}
                              </Link>
                            </div>
                          ) : el.showPnfl ? (
                            <div
                              style={{
                                cursor: "pointer",
                                color: "blue",
                                fontWeight: "500",
                              }}
                              onClick={() => {
                                this.props.history.push({
                                  pathname: "/document/pnflview",
                                  state: {
                                    inn: item.contractorInn,
                                  },
                                });
                              }}
                            >
                              {item[el.key]}
                            </div>
                          ) : el.employeeShowId ? (
                            <div
                              style={{
                                cursor: "pointer",
                                color: "blue",
                                fontWeight: "500",
                              }}
                              // onClick={() => {
                              //   this.props.history.push({
                              //     pathname: "/document/viewattestation",
                              //     state: {
                              //       id:
                              //         "attestationId" in item
                              //           ? item.attestationId
                              //           : item.id,
                              //     },
                              //   });
                              // }}
                            >
                              <Link
                                style={{
                                  cursor: "pointer",
                                  color: "blue",
                                  fontWeight: "500",
                                }}
                                to={`/info/viewemployee/${item.id}`}
                              >
                                {" "}
                                {item[el.key]}
                              </Link>
                            </div>
                          ) : el.expired ? (
                            <div>
                              {item.expired ? (
                                <div>
                                  {" "}
                                  <Badge color="danger">
                                    <span style={{ color: "black" }}>
                                      {t1("DateIsTake")}
                                    </span>
                                  </Badge>
                                </div>
                              ) : item.orderType === null ? (
                                <div>
                                  {" "}
                                  <Badge color="info">
                                    <span style={{ color: "black" }}>
                                      {t1("newsCount")}
                                    </span>
                                  </Badge>
                                </div>
                              ) : (
                                <div>
                                  {" "}
                                  <Badge
                                    color={
                                      item.orderType == "Сдал" ||
                                      item.orderType == "O`tgan" ||
                                      item.orderType == "Ўтган"
                                        ? "success"
                                        : "danger"
                                    }
                                  >
                                    <span style={{ color: "black" }}>
                                      {item.orderType}
                                    </span>
                                  </Badge>
                                </div>
                              )}
                            </div>
                          ) : el.notPassedEmp ? (
                            <div style={{ fontSize: "13px" }}>
                              {item.employeesCount}/{item.passedEmployeesCount}/
                              {item.employeesCount - item.passedEmployeesCount}
                            </div>
                          ) : el.key == "isPassedAttestation" ? (
                            <div>
                              {item[el.key] == true
                                ? t1("Passed")
                                : t1("NotPassed")}
                            </div>
                          ) : (
                            item[el.key]
                          )}
                        </td>
                      )
                    )}
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
                  this.props.changePageSize(e.target.value);
                  this.setState(
                    { page: page }
                    //   , () => {
                    //   this.props.changePagination(page);
                    // }
                  );
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
                this.props.changePage(num.selected + 1);
                this.setState(
                  { page: page }
                  //   , () => {
                  //   this.props.changePagination(page);
                  // }
                );

                this.Refresh();
              }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
// export default injectIntl(WebaseTable);

const mapStateToProps = (state) => {
  return {
    values: state.pagination,
  };
};

export default connect(mapStateToProps, {
  changeOrderType,
  changePage,
  changePageSize,
  changeSortBy,
  changeAll,
})(injectIntl(WebaseTable));
