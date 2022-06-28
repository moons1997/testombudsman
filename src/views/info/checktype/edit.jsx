import React from 'react'
import { Card,Row,Col,FormGroup,Input,Button,Spinner } from 'reactstrap'
import CheckTypeService from '../../../services/info/checktype.service'
import Overlay from '../../../components/Webase/components/Overlay'
import ManualService from '../../../services/other/manual.service'
import Select from "react-select"
import { Notification,Translate } from '../../../components/Webase/functions'
import { injectIntl } from "react-intl"
const { t1,t2 } = Translate
const { errorToast,successToast } = Notification
class EditCheckType extends React.Component{
    // data (return)
    constructor(props){
        super(props)
        this.state = {
            checktype : {},
            loading : false,
            SaveLoading : false,
            StateList : []
        }
    }
    //Created
    componentDidMount(){
        this.Refresh()
        this.GetDataList()
    }
    // methods
    Refresh = () => {
        this.setState({ loading : true })
        CheckTypeService.Get(this.props.match.params.id).then(res => {
            this.setState({ checktype : res.data,loading : false })
        }).catch(error => {
            this.setState({ loading : false })
            errorToast(error.response.data)
        })
    }
    GetDataList = () => {
        ManualService.StateSelectList().then(res => {
            this.setState({ StateList : res.data })
        })
    }
    handleChange(event,field,data) {
        var checktype = this.state.checktype;
        checktype[field]  = !!event.target ? event.target.value : data.value
        this.setState({ checktype: checktype });
    }
    SaveData = () => {
        this.setState({ SaveLoading : true })
        CheckTypeService.Update(this.state.checktype).then(res => {
            this.setState({ SaveLoading : false })
            successToast(t2('SuccessSave',this.props.intl))

            setTimeout(() => {
                this.props.history.push('/info/checktype')
            },500)
        }).catch(error => {
            errorToast(error.response.data)
            this.setState({ SaveLoading : false })
        })
    }
    
    render(){
        const { loading,SaveLoading,StateList,checktype } = this.state
        const { history,intl } = this.props
        //template
        return (
          <Overlay show={loading}>
            <Card className="p-2">
              <Row>
                <Col>
                  <h1 style={{ fontWeight: "bold" }}> {t1("CheckType")} </h1>
                </Col>
              </Row>
              <Row>
                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <h5 className="text-bold-600"> {t1("code")} </h5>
                    <Input
                      type="text"
                      value={checktype.code || ""}
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
                      value={checktype.shortName || ""}
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
                      value={checktype.fullName || ""}
                      onChange={(e) => this.handleChange(e, "fullName")}
                      id="fullName"
                      placeholder={t2("fullname", intl)}
                    />
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <h5 className="text-bold-600">{t1("state")}</h5>
                    <Select
                      className="React"
                      classNamePrefix="select"
                      defaultValue={{
                        text: checktype.state || t2("Choose", intl),
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
                    onClick={() => history.push("/info/checktype")}
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
export default injectIntl(EditCheckType)