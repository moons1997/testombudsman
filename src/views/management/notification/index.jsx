import React from "react";
import {
  Card,
  Row,
  Col,
  InputGroup,
  Input,
  Button,
  InputGroupAddon,
} from "reactstrap";
import { injectIntl } from "react-intl";
import WebaseTable from "../../../components/Webase/components/Table";
import NotificationService from "../../../services/other/notification.service";
import * as Icon from "react-feather";
import {
  Translate,
  Permission,
} from "../../../components/Webase/functions/index.js";
import RequestPostponementService from "../../../services/document/requestpostponement.service";
import RequestService from "../../../services/document/request.service";
import AttestationService from "../../../services/document/attestation.service";
import InspectionResultService from "../../../services/document/inspectionresult.service";
import ComplaintService from "../../../services/document/complaint.service";
import InspectionBookService from "../../../services/document/inspectionbook.service";
import InspectionBookOfContractorService from "../../../services/document/inspectionbookofcontractor.service";
import { ContextLayout } from "../../../utility/context/Layout";
const { t1, t2 } = Translate;
const { can } = Permission;
class Request extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [
        {
          key: "id",
          label: t2("ID", props.intl),
          sort: true,
        },
        {
          key: "dateOfCreated",
          label: t2("dateOfCreated", props.intl),
          sort: true,
        },
        { key: "table", label: t2("Table", props.intl), sort: true, see: true },
        { key: "title", label: t2("Title", props.intl), sort: true },
        { key: "type", label: t2("type", props.intl), sort: true },
        {
          key: "content",
          label: t2("content", props.intl),
          sort: true,
        },
        {
          key: "docStatus",
          label: t2("state", props.intl),
          badge: true,
          sort: true,
        },
        {
          key: "actions",
          label: t2("actions", props.intl),
        },
      ],
      filter: {
        notificationStatusId: 1,
        search: "",
      },
      GetInfo: {},
      NotificationList: [],
    };
    this.child = React.createRef();
  }
  componentDidMount() {}
  MarkAllRead() {
    NotificationService.MarkAllAsRead().then((res) => {
      window.location.reload();
    });
  }

  handleChange(event, field, data) {
    var filter = this.state.filter;
    filter[field] = !!event.target ? event.target.value : data.value;
    this.setState({ filter: filter });
  }
  //   ShowFunction = () => {
  //     if (item.typeId === 3) {
  //       RequestPostponementService.GetByRequestId(item.link).then((res) => {
  //         this.history.push("/document/view/" + item.link);
  //       });
  //     } else if (item.typeId === 1) {
  //       RequestService.Get(item.link).then((res) => {
  //         this.history.push("/document/viewrequest/" + item.link);
  //       });
  //     }
  //   };
  render() {
    const { intl, history } = this.props;
    const { fields, filter, GetInfo } = this.state;

    return (
      <div>
        <Card className="p-2">
          <Row>
            <Col>
              <h1 className="pageTextView"> {t1("Notification")} </h1>
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
                      this.child.props.values.page = 1;
                      this.child.Refresh();
                    }}
                  >
                    {" "}
                    <Icon.Search size={14} /> {t1("Search")}{" "}
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </Col>
            <Col className="text-right" sm={12} md={6} lg={3}>
              <Button color="primary" onClick={() => history.go(0)}>
                <Icon.RefreshCw size={18} /> {t1("Refresh")}
              </Button>
            </Col>
            <Col className="text-right" sm={12} md={6} lg={3}>
              <Button
                style={{ width: "100%", marginBottom: "5px" }}
                className="mr-2"
                color="primary"
                onClick={() => this.MarkAllRead()}
              >
                <Icon.Eye size={18} /> {t1("MarkAllRead")}{" "}
              </Button>
            </Col>
            <Col className="text-right" sm={12} md={6} lg={2}>
              <Button
                style={{ width: "100%", marginBottom: "5px" }}
                className="mr-2"
                color="danger"
                onClick={() => history.goBack()}
              >
                <Icon.ArrowLeft size={18} /> {t1("back")}{" "}
              </Button>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <ContextLayout.Consumer>
                {(context) => {
                  return (
                    <WebaseTable
                      // notificationTotal={context.state.NotificationList}
                      notificationRefresh={context.notificationRefresh}
                      fields={fields}
                      filter={filter}
                      api={NotificationService}
                      childRef={(ref) => (this.child = ref)}
                      actions={() => {
                        return {
                          view: {
                            isView: true,
                            moveFunction: (item) => {
                              if (item.tableId === 62) {
                                RequestPostponementService.GetByRequestId(
                                  item.docId
                                ).then((res) => {
                                  history.push("/document/view/" + item.docId);
                                  NotificationService.MarkAsRead(item.id).then(
                                    (res) => {
                                      context.notificationRefresh();
                                    }
                                  );
                                });
                              } else if (item.tableId === 59) {
                                RequestService.Get(item.docId).then((res) => {
                                  history.push(
                                    "/document/viewrequest/" + item.docId
                                  );
                                  NotificationService.MarkAsRead(item.id).then(
                                    (res) => {
                                      context.notificationRefresh();
                                    }
                                  );
                                });
                              } else if (item.tableId === 69) {
                                AttestationService.Get(item.docId).then(
                                  (res) => {
                                    history.push(
                                      "/document/viewattestation/" + item.docId
                                    );
                                    NotificationService.MarkAsRead(
                                      item.id
                                    ).then((res) => {
                                      context.notificationRefresh();
                                    });
                                  }
                                );
                              } else if (item.tableId === 72) {
                                InspectionResultService.Get(item.docId).then(
                                  (res) => {
                                    history.push(
                                      "/document/viewInspection/" + item.docId
                                    );
                                    NotificationService.MarkAsRead(
                                      item.id
                                    ).then((res) => {
                                      context.notificationRefresh();
                                    });
                                  }
                                );
                              } else if (item.tableId === 81) {
                                ComplaintService.Get(item.docId).then((res) => {
                                  history.push(
                                    "/document/viewcomplaint/" + item.docId
                                  );
                                  NotificationService.MarkAsRead(item.id).then(
                                    (res) => {
                                      //asdasd
                                    }
                                  );
                                });
                              } else if (item.tableId === 85) {
                                InspectionBookService.Get(item.docId).then(
                                  (res) => {
                                    history.push(
                                      "/document/viewinspectionbook/" +
                                        item.docId
                                    );
                                    NotificationService.MarkAsRead(
                                      item.id
                                    ).then((res) => {
                                      //asdasd
                                    });
                                  }
                                );
                              } else if (item.tableId === 90) {
                                InspectionBookOfContractorService.Get(
                                  item.docId
                                ).then((res) => {
                                  history.push(
                                    "/document/viewinspectionbookofcontractor/" +
                                      item.docId
                                  );
                                  NotificationService.MarkAsRead(item.id).then(
                                    (res) => {
                                      //asdasd
                                    }
                                  );
                                });
                              }
                            },
                          },
                          // edit: {
                          //   isView: can("RequestEdit"),
                          //   router: "/document/editrequest",
                          // },
                        };
                      }}
                    />
                  );
                }}
              </ContextLayout.Consumer>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
export default injectIntl(Request);
