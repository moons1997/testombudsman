import React, { useState } from "react";
import { injectIntl } from "react-intl";
import {
  Card,
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  Button,
  NavLink,
} from "reactstrap";
import {
  Permission,
  Translate,
  Notification,
} from "../../../components/Webase/functions/index.js";
import VideoLessonService from "../../../services/document/videolesson.service";
import Overlay from "../../../components/Webase/components/Overlay.js";
import ReactPlayer from "react-player";
import VideoCategoryService from "../../../services/info/videocategory.service.js";
// import screenfull from "screenfull";
const { t1, t2 } = Translate;
const { can } = Permission;
const { errorToast } = Notification;
// const [active, setActive] = useState("1");

// const onStart = () => {
//   if (fullscreenMode)
//     findDOMNode(player)
//       .requestFullscreen()
//       .catch((err) => {
//         alert("asd");
//       });
// };
// let player = null;
// const [fullscreenMode, setFullscreenMode] = useState(false);
class VideoLessonView extends React.Component {
  //data
  constructor(props) {
    super(props);
    this.state = {
      data: {
        filters: {
          categoryId: { value: "1", matchMode: "equals" },
        },
        search: "",
        sortBy: "desc",
        orderType: "desc",
        page: 1,
        pageSize: 100,
      },
      active: 0,
      loading: false,
      VideoLessonList: [],
      CategoryList: [],
    };
  }
  //Created
  componentDidMount() {
    this.CategoryFunction({ categoryId: null });
    VideoCategoryService.GetAsSelectList().then((res) => {
      this.setState({ CategoryList: res.data });
      // this.CategoryFunction(res.data[0]);
    });
  }
  //Methods
  CategoryFunction(item2) {
    this.setState({ loading: true });
    VideoLessonService.GetList({
      filters: !item2.value
        ? {}
        : {
            categoryId: {
              value: !!item2.value ? item2.value : "",
              matchMode: "equals",
            },
          },
      search: "",
      sortBy: "number",
      orderType: "asc",
      page: 1,
      pageSize: 100,
    })
      .then((res) => {
        this.setState({ loading: false });
        this.setState({ VideoLessonList: res.data });
      })
      .catch((error) => {
        this.setState({ loading: false });
        errorToast(error.response.data);
      });
  }
  toggle = (tab) => {
    if (this.state.active !== tab) {
      this.setState({ active: tab });
    }
  };
  OpenShow = (item) => {};
  //   onClickFullscreen = () => {
  //     screenfull.request(findDOMNode(this.refs.player));
  //   };
  render() {
    const { int1, history } = this.props;
    const { active, CategoryList, VideoLessonList, loading } = this.state;
    return (
      <Overlay show={loading}>
        <div>
          <Card>
            <Row>
              <Col className="text-center">
                <h1 className="m-2 pageTextView">{t1("VideolessonView")}</h1>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="nav-vertical m-2">
                  <Nav tabs className="nav-left">
                    {CategoryList?.map((item2, index2) => (
                      <NavItem key={`cat${index2}`}>
                        <NavLink
                          style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            margin: "5px",
                          }}
                          active={active === index2}
                          onClick={() => {
                            this.toggle(index2);
                            this.CategoryFunction(item2);
                          }}
                        >
                          {item2.text}
                        </NavLink>
                      </NavItem>
                    ))}
                  </Nav>
                  <TabContent activeTab={active}>
                    {CategoryList?.map((item3, index) => (
                      <TabPane tabId={index} key={`dat${index}`}>
                        <Row>
                          {VideoLessonList.rows?.map((item, index4) => (
                            <Col sm={12} lg={4} key={`vid${index4}`}>
                              <ReactPlayer
                                key={index4}
                                width={"100%"}
                                url={item.uri}
                                onFullscreenMode={true}
                              ></ReactPlayer>
                              {/* <Button onClick={this.onClickFullscreen}>
                              Fullscreen
                            </Button> */}
                              <p
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "900",
                                  marginTop: "5px",
                                }}
                              >
                                {item.theme}
                              </p>
                              {/* <iframe
                              //   onClick={() => {
                              //     this.OpenShow(item);
                              //   }}
                              //   style={{ cursor: "pointer" }}
                              src={item.uri}
                              className="text-center"
                              key={index}
                              allowfullscreen
                            > */}
                              {/* <Row>
                                <Col>
                                  <img
                                    src={image}
                                    style={{ width: "100px" }}
                                    alt=""
                                    srcset=""
                                  />
                                </Col>
                              </Row> */}
                              {/* <p> {item.theme}</p>
                            </iframe> */}
                            </Col>
                          ))}
                        </Row>
                      </TabPane>
                    ))}
                  </TabContent>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </Overlay>
    );
  }
}
export default injectIntl(VideoLessonView);
