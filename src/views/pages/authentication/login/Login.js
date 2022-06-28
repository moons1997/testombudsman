import React from "react";
import { Card, CardHeader, CardTitle, Row, Col } from "reactstrap";
import loginImg from "../../../../assets/img/pages/login.png";
import "../../../../assets/scss/pages/authentication.scss";
import LoginJWT from "./LoginJWT";
import { Translate } from "../../../../components/Webase/functions/index";
import { injectIntl } from "react-intl";
const { t1, t2 } = Translate;
class Login extends React.Component {
  render() {
    return (
      <div
        className="egk-login m-0 justify-content-center d-flex align-items-center"
        style={{ height: !!window.chrome ? "100vh" : "100vh" }}
      >
        <LoginJWT />
      </div>
      // <Row className="m-0 justify-content-center d-flex align-items-center" style={{ height : '100vh' }} >
      //   <Col
      //     sm="8"
      //     xl="7"
      //     lg="10"
      //     md="8"
      //     className="d-flex justify-content-center"
      //   >
      //     <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
      //       <Row className="m-0">
      //         <Col
      //           lg="6"
      //           className="d-lg-block d-none text-center align-self-center px-1 py-0"
      //         >
      //           <img src={loginImg} alt="loginImg" />
      //         </Col>
      //         <Col lg="6" md="12" className="p-0">
      //           <Card className="rounded-0 mb-0 px-2 login-tabs-container">
      //             <CardHeader className="pb-1">
      //               <CardTitle>
      //                 <h4 className="mb-0"> { t1('Auth') } </h4>
      //               </CardTitle>
      //             </CardHeader>
      //             <p className="px-2 auth-title">
      //               { t1('SignInYourAccount') }
      //             </p>
      //             <Row className="mt-2">
      //               <Col>
      //                 <LoginJWT />
      //               </Col>
      //             </Row>
      //           </Card>
      //         </Col>
      //       </Row>
      //     </Card>
      //   </Col>
      // </Row>
    );
  }
}
export default injectIntl(Login);
