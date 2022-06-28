import React, { Suspense, lazy } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { history } from "./history";
// import { connect } from "react-redux"
import {} from "react-router-dom";
import Spinner from "./components/@vuexy/spinner/Loading-spinner";
import { ContextLayout } from "./utility/context/Layout";

const ecommerceDashboard = lazy(() =>
  import("./views/dashboard/ecommerce/EcommerceDashboard")
);

const error404 = lazy(() => import("./views/pages/misc/error/404"));

const productDetail = lazy(() =>
  import("./views/apps/ecommerce/detail/Detail")
);

// User
const Dashboard = lazy(() => import("./views/dashboard/index.js"));
const Kadr = lazy(() => import("./views/info/kadr/index.jsx"));
const EmployeeAttestation = lazy(() =>
  import("./views/info/employeeattestation/index.jsx")
);
const Employee = lazy(() => import("./views/info/employee/index.jsx"));
const EditEmployee = lazy(() => import("./views/info/employee/edit.jsx"));
const ViewEmployee = lazy(() => import("./views/info/employee/view.jsx"));
const ControlFunctionForm = lazy(() =>
  import("./views/info/controlfunctionform/index.jsx")
);
const EditControlFunctionForm = lazy(() =>
  import("././views/info/controlfunctionform/edit.jsx")
);

const ControlFunction = lazy(() =>
  import("./views/info/controlfunction/index.jsx")
);
const EditControlFunction = lazy(() =>
  import("././views/info/controlfunction/edit.jsx")
);
const VideoCategory = lazy(() =>
  import("./views/info/videocategory/index.jsx")
);
const EditVideoCategory = lazy(() =>
  import("./views/info/videocategory/edit.jsx")
);
const Bank = lazy(() => import("./views/info/bank/index.jsx"));
const EditBank = lazy(() => import("./views/info/bank/edit.jsx"));

const News = lazy(() => import("./views/info/news/index.jsx"));
const EditNews = lazy(() => import("./views/info/news/edit.jsx"));

const MandatoryRequirement = lazy(() =>
  import("./views/info/mandatoryrequirement/index.jsx")
);
const EditMandatoryRequirement = lazy(() =>
  import("./views/info/mandatoryrequirement/edit.jsx")
);

const RejectionReason = lazy(() =>
  import("./views/info/rejectionreason/index.jsx")
);
const EditRejectionReason = lazy(() =>
  import("./views/info/rejectionreason/edit.jsx")
);
const Citizenship = lazy(() => import("./views/info/citizenship/index.jsx"));
const EditCitizenship = lazy(() => import("./views/info/citizenship/edit.jsx"));
const Country = lazy(() => import("./views/info/country/index.jsx"));
const EditCountry = lazy(() => import("./views/info/country/edit.jsx"));
const District = lazy(() => import("./views/info/district/index.jsx"));
const EditDistrict = lazy(() => import("./views/info/district/edit.jsx"));
const Nationality = lazy(() => import("./views/info/nationality/index.jsx"));
const EditNationality = lazy(() => import("./views/info/nationality/edit.jsx"));
const Region = lazy(() => import("./views/info/region/index.jsx"));
const EditRegion = lazy(() => import("./views/info/region/edit.jsx"));
const OrderType = lazy(() => import("./views/info/ordertype/index.jsx"));
const EditOrderType = lazy(() => import("./views/info/ordertype/edit.jsx"));
const Oked = lazy(() => import("./views/info/oked/index.jsx"));
const EditOked = lazy(() => import("./views/info/oked/edit.jsx"));
const CheckType = lazy(() => import("./views/info/checktype/index.jsx"));
const EditCheckType = lazy(() => import("./views/info/checktype/edit.jsx"));

const ExcelReport = lazy(() => import("./views/info/excelreport/index.jsx"));
const ExcelReport2 = lazy(() =>
  import("./views/info/excelreport/excellreport2.jsx")
);
const ExcelReport3 = lazy(() =>
  import("./views/info/excelreport/excellreport3.jsx")
);
const ExcelReport4 = lazy(() =>
  import("./views/info/excelreport/excellreport4.jsx")
);
const ExcelReport5 = lazy(() =>
  import("./views/info/excelreport/excellreport5.jsx")
);

const OrganFunction = lazy(() =>
  import("./views/info/organfunction/index.jsx")
);
const EditOrganFunction = lazy(() =>
  import("./views/info/organfunction/edit.jsx")
);

const Role = lazy(() => import("./views/management/role/index.jsx"));
const EditRole = lazy(() => import("./views/management/role/edit.jsx"));
const Organization = lazy(() =>
  import("./views/management/organization/index.jsx")
);
const EditOrganization = lazy(() =>
  import("./views/management/organization/edit.jsx")
);
const OrganizationBranch = lazy(() =>
  import("./views/management/organizationbranch/index.jsx")
);
const EditOrganizationBranch = lazy(() =>
  import("./views/management/organizationbranch/edit.jsx")
);
const Position = lazy(() => import("./views/info/position/index.jsx"));
const EditPosition = lazy(() => import("./views/info/position/edit.jsx"));
const PositionClassifier = lazy(() =>
  import("./views/info/positionclassifier/index.jsx")
);
const EditPositionClassifier = lazy(() =>
  import("./views/info/positionclassifier/edit.jsx")
);
const CheckBasis = lazy(() => import("./views/info/checkbasis/index.jsx"));
const EditCheckBasis = lazy(() => import("./views/info/checkbasis/edit.jsx"));
const OrganizationInspectionType = lazy(() =>
  import("./views/info/organizationinspectiontype/index.jsx")
);
const EditOrganizationInspectionType = lazy(() =>
  import("./views/info/organizationinspectiontype/edit.jsx")
);
const VideLesson = lazy(() => import("./views/document/videolesson/index.jsx"));
const EditVideLesson = lazy(() =>
  import("./views/document/videolesson/edit.jsx")
);
const EditRequest = lazy(() => import("./views/document/request/edit.jsx"));
const PnflView = lazy(() => import("./views/document/request/pnflView.jsx"));

const CheckingQuiz = lazy(() => import("./views/info/checkingquiz/index.jsx"));
const UserShow = lazy(() => import("./views/management/user/show.jsx"));
//Document
const Contractor = lazy(() => import("./views/document/contractor/index.jsx"));
const EditContractor = lazy(() =>
  import("./views/document/contractor/edit.jsx")
);
const InspectionConclusion = lazy(() =>
  import("./views/document/inspectionconclusion/index.jsx")
);
const EditInspectionConclusion = lazy(() =>
  import("./views/document/inspectionconclusion/edit.jsx")
);
const ViewInspectionConclusion = lazy(() =>
  import("./views/document/inspectionconclusion/view.jsx")
);
const InspectionBook = lazy(() =>
  import("./views/document/inspectionbook/index.jsx")
);
const EditInspectionBook = lazy(() =>
  import("./views/document/inspectionbook/edit.jsx")
);
const ViewInspectionBook = lazy(() =>
  import("./views/document/inspectionbook/view.jsx")
);
const Request = lazy(() => import("./views/document/request/index.jsx"));
const Complaint = lazy(() => import("./views/document/complaint/index.jsx"));
const ViewComplaint = lazy(() => import("./views/document/complaint/view.jsx"));
const TestPage = lazy(() => import("./views/document/test/index.jsx"));
const ViewRequest = lazy(() => import("./views/document/request/view.jsx"));
const ViewPost = lazy(() => import("./views/document/postponement/view.jsx"));
const PostEdit = lazy(() => import("./views/document/request/postEdit.jsx"));
const Postponement = lazy(() =>
  import("./views/document/postponement/index.jsx")
);
const ResultEdit = lazy(() =>
  import("./views/document/request/resultEdit.jsx")
);
const VideoLessonView = lazy(() =>
  import("./views/document/videolessonview/index.jsx")
);
const EditCheckingQuiz = lazy(() =>
  import("./views/info/checkingquiz/edit.jsx")
);
const Attestation = lazy(() =>
  import("./views/document/attestation/index.jsx")
);
const EditAttestation = lazy(() =>
  import("./views/document/attestation/edit.jsx")
);
const ViewAttestation = lazy(() =>
  import("./views/document/attestation/view.jsx")
);
const InspectionResult = lazy(() =>
  import("./views/document/inspectionult/index.jsx")
);
const ViewInspectionResult = lazy(() =>
  import("./views/document/inspectionult/view.jsx")
);
const InspectionBookOfContractor = lazy(() =>
  import("./views/document/inspectionbookofcontractor/index.jsx")
);
const ViewInspectionBookOfContractor = lazy(() =>
  import("./views/document/inspectionbookofcontractor/view.jsx")
);
//Management
const User = lazy(() => import("./views/management/user/index.jsx"));
const ChangeUser = lazy(() => import("./views/management/user/change.jsx"));
const MyInformation = lazy(() =>
  import("./views/management/user/myinformation.jsx")
);
const EditUser = lazy(() => import("./views/management/user/edit.jsx"));
const Notification = lazy(() =>
  import("./views/management/notification/index.jsx")
);

const AppRoute = ({ component: Component, fullLayout, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      return (
        <ContextLayout.Consumer>
          {(context) => {
            let LayoutTag =
              fullLayout === true
                ? context.fullLayout
                : context.state.activeLayout === "horizontal"
                ? context.horizontalLayout
                : context.VerticalLayout;
            return (
              <LayoutTag {...props} permission={props.user}>
                <Suspense fallback={<Spinner />}>
                  <Component
                    {...props}
                    // notificationTotal={context.NotificationList}
                    // notificationRefresh={context.notificationRefresh}
                  />
                </Suspense>
              </LayoutTag>
            );
          }}
        </ContextLayout.Consumer>
      );
    }}
  />
);
// const mapStateToProps = state => {
//   return {
//     user: state.auth.login.userRole
//   }
// }

// const AppRoute =  RouteConfig()

class AppRouter extends React.Component {
  render() {
    return (
      // Set the directory path if you are deploying in sub-folder
      <Router history={history}>
        <Switch>
          {/* <PrivateRoute  path="/" component={analyticsDashboard} /> */}
          <AppRoute exact path="/">
            {" "}
            <Redirect to="/dashboard" />{" "}
          </AppRoute>
          <AppRoute exact path="/dashboard" component={Dashboard} />
          <AppRoute
            path="/ecommerce-dashboard"
            component={ecommerceDashboard}
          />
          {/* <AppRoute
            path="/email"
            exact
            component={() => <Redirect to="/email/inbox" />}
          />
          <AppRoute path="/email/:filter" component={email} />
          <AppRoute path="/chat" component={chat} />
          <AppRoute
            path="/todo"
            exact
            component={() => <Redirect to="/todo/all" />}
          />
          <AppRoute path="/todo/:filter" component={todo} />
          <AppRoute path="/calendar" component={calendar} />
          <AppRoute path="/ecommerce/shop" component={shop} />
          <AppRoute path="/ecommerce/wishlist" component={wishlist} /> */}
          <AppRoute path="/info/excelreport" component={ExcelReport} />
          <AppRoute path="/info/excelreport2" component={ExcelReport2} />
          <AppRoute path="/info/excelreport3" component={ExcelReport3} />
          <AppRoute path="/info/excelreport4" component={ExcelReport4} />
          <AppRoute path="/info/excelreport5" component={ExcelReport5} />
          <AppRoute path="/info/employee" component={Employee} />
          <AppRoute path="/info/kadr" component={Kadr} />

          <AppRoute path="/info/editemployee/:id" component={EditEmployee} />
          <AppRoute path="/info/viewemployee/:id" component={ViewEmployee} />
          <AppRoute
            path="/info/controlfunctionform"
            component={ControlFunctionForm}
          />
          <AppRoute
            path="/info/editcontrolfunctionform/:id"
            component={EditControlFunctionForm}
          />
          <AppRoute path="/info/controlfunction" component={ControlFunction} />
          <AppRoute
            path="/info/editcontrolfunction/:id"
            component={EditControlFunction}
          />
          <AppRoute path="/info/videocategory" component={VideoCategory} />
          <AppRoute
            path="/info/editvideocategory/:id"
            component={EditVideoCategory}
          />
          <AppRoute path="/info/bank" component={Bank} />
          <AppRoute path="/info/editbank/:id" component={EditBank} />
          <AppRoute path="/info/news" component={News} />
          <AppRoute path="/info/editnews/:id" component={EditNews} />
          <AppRoute
            path="/info/mandatoryrequirement"
            component={MandatoryRequirement}
          />
          <AppRoute
            path="/info/editmandatoryrequirement/:id"
            component={EditMandatoryRequirement}
          />
          <AppRoute path="/info/rejectionreason" component={RejectionReason} />
          <AppRoute
            path="/info/editrejectionreason/:id"
            component={EditRejectionReason}
          />
          <AppRoute path="/info/citizenship" component={Citizenship} />
          <AppRoute
            path="/info/editcitizenship/:id"
            component={EditCitizenship}
          />
          <AppRoute path="/info/country" component={Country} />
          <AppRoute path="/info/editcountry/:id" component={EditCountry} />
          <AppRoute path="/info/district" component={District} />
          <AppRoute path="/info/editdistrict/:id" component={EditDistrict} />
          <AppRoute path="/info/nationality" component={Nationality} />
          <AppRoute
            path="/info/editnationality/:id"
            component={EditNationality}
          />
          <AppRoute path="/info/region" component={Region} />
          <AppRoute path="/info/editregion/:id" component={EditRegion} />
          <AppRoute path="/info/ordertype" component={OrderType} />
          <AppRoute path="/info/editordertype/:id" component={EditOrderType} />
          <AppRoute path="/info/oked" component={Oked} />
          <AppRoute path="/info/editoked/:id" component={EditOked} />
          <AppRoute path="/info/checktype" component={CheckType} />
          <AppRoute path="/info/editchecktype/:id" component={EditCheckType} />
          <AppRoute path="/info/organfunction" component={OrganFunction} />
          <AppRoute
            path="/info/editorganfunction/:id"
            component={EditOrganFunction}
          />
          <AppRoute path="/management/user" component={User} />
          <AppRoute path="/management/showuser" component={UserShow} />
          <AppRoute path="/management/changeuser" component={ChangeUser} />
          <AppRoute
            path="/management/myinformation"
            component={MyInformation}
          />
          <AppRoute path="/management/edituser/:id" component={EditUser} />
          <AppRoute path="/management/role" component={Role} />
          <AppRoute path="/management/editrole/:id" component={EditRole} />
          <AppRoute path="/management/organization" component={Organization} />
          <AppRoute path="/management/notification" component={Notification} />
          <AppRoute
            path="/management/editorganization/:id"
            component={EditOrganization}
          />
          <AppRoute
            path="/info/positionclassifier"
            component={PositionClassifier}
          />
          <AppRoute
            path="/info/editpositionclassifier/:id"
            component={EditPositionClassifier}
          />
          <AppRoute
            path="/management/organizationbranch"
            component={OrganizationBranch}
          />
          <AppRoute
            path="/management/editorganizationbranch/:id"
            component={EditOrganizationBranch}
          />
          <AppRoute
            path="/document/viewinspectionbookofcontractor/:id"
            component={ViewInspectionBookOfContractor}
          />
          <AppRoute path="/info/position" component={Position} />
          <AppRoute path="/info/editposition/:id" component={EditPosition} />
          <AppRoute path="/info/checkbasis" component={CheckBasis} />
          <AppRoute
            path="/info/editcheckbasis/:id"
            component={EditCheckBasis}
          />
          <AppRoute
            path="/ecommerce/product-detail"
            component={productDetail}
          />
          <AppRoute
            path="/info/organizationinspectiontype"
            component={OrganizationInspectionType}
          />
          <AppRoute
            path="/info/editorganizationinspectiontype/:id"
            component={EditOrganizationInspectionType}
          />
          <AppRoute
            path="/document/inspectionbookofcontractor"
            component={InspectionBookOfContractor}
          />
          <AppRoute path="/document/contractor" component={Contractor} />
          <AppRoute
            path="/document/editcontractor/:id"
            component={EditContractor}
          />
          <AppRoute
            path="/info/editcheckingquiz/:id"
            component={EditCheckingQuiz}
          />
          <AppRoute path="/info/checkingquiz" component={CheckingQuiz} />
          <AppRoute path="/document/videolesson" component={VideLesson} />
          <AppRoute
            path="/document/inspectionbook"
            component={InspectionBook}
          />
          <AppRoute
            path="/document/editinspectionbook/:id"
            component={EditInspectionBook}
          />
          <AppRoute
            path="/document/viewinspectionbook/:id"
            component={ViewInspectionBook}
          />
          <AppRoute
            path="/document/videolessonview"
            component={VideoLessonView}
          />
          <AppRoute
            path="/document/editvideolesson/:id"
            component={EditVideLesson}
          />
          <AppRoute path="/document/request" component={Request} />
          <AppRoute path="/document/pnflview" component={PnflView} />
          <AppRoute path="/document/complaint" component={Complaint} />
          <AppRoute
            path="/document/viewcomplaint/:id"
            component={ViewComplaint}
          />
          <AppRoute
            path="/document/viewattestation/:id"
            component={ViewAttestation}
          />
          <AppRoute
            path="/document/employeeattestation"
            component={EmployeeAttestation}
          />
          <AppRoute path="/document/attestation" component={Attestation} />
          <AppRoute
            path="/document/editattestation/:id"
            component={EditAttestation}
          />
          <AppRoute
            path="/document/inspectionconclusion"
            component={InspectionConclusion}
          />
          <AppRoute
            path="/document/viewinspectionconclusion/:id"
            component={ViewInspectionConclusion}
          />
          <AppRoute
            path="/document/editinspectionconclusion/:id"
            component={EditInspectionConclusion}
          />
          <AppRoute path="/document/postponement" component={Postponement} />
          {/* -------test-page------- */}
          <AppRoute path="/document/test-page" component={TestPage} />
          {/* -------test-page------- */}
          <AppRoute path="/document/editrequest/:id" component={EditRequest} />
          <AppRoute path="/document/viewrequest/:id" component={ViewRequest} />
          <AppRoute path="/document/postEdit/:id" component={PostEdit} />
          <AppRoute path="/document/view/:id" component={ViewPost} />
          <AppRoute path="/document/resultEdit/:id" component={ResultEdit} />
          <AppRoute
            path="/document/viewInspection/:id"
            component={ViewInspectionResult}
          />
          <AppRoute
            path="/document/inspectionresult"
            component={InspectionResult}
          />
          {/* <AppRoute
            path="/ecommerce/checkout"
            component={checkout}
            permission="admin"
          />
          <AppRoute path="/data-list/list-view" component={listView} />
          <AppRoute path="/data-list/thumb-view" component={thumbView} />
          <AppRoute path="/ui-element/grid" component={grid} />
          <AppRoute path="/ui-element/typography" component={typography} />
          <AppRoute
            path="/ui-element/textutilities"
            component={textutilities}
          />
          <AppRoute
            path="/ui-element/syntaxhighlighter"
            component={syntaxhighlighter}
          />
          <AppRoute path="/colors/colors" component={colors} />
          <AppRoute path="/icons/reactfeather" component={reactfeather} />
          <AppRoute path="/cards/basic" component={basicCards} />
          <AppRoute path="/cards/statistics" component={statisticsCards} />
          <AppRoute path="/cards/analytics" component={analyticsCards} />
          <AppRoute path="/cards/action" component={actionCards} /> */}
          {/* <AppRoute
            path="/extra-components/auto-complete"
            component={AutoComplete}
          />
          <AppRoute path="/extra-components/avatar" component={avatar} />
          <AppRoute path="/extra-components/chips" component={chips} />
          <AppRoute path="/extra-components/divider" component={divider} />
          <AppRoute path="/forms/wizard" component={vuexyWizard} /> */}
          {/* <AppRoute path="/forms/elements/select" component={select} />
          <AppRoute path="/forms/elements/switch" component={switchComponent} />
          <AppRoute path="/forms/elements/checkbox" component={checkbox} />
          <AppRoute path="/forms/elements/radio" component={radio} />
          <AppRoute path="/forms/elements/input" component={input} />
          <AppRoute path="/forms/elements/input-group" component={group} />
          <AppRoute
            path="/forms/elements/number-input"
            component={numberInput}
          />
          <AppRoute path="/forms/elements/textarea" component={textarea} />
          <AppRoute path="/forms/elements/pickers" component={pickers} />
          <AppRoute path="/forms/elements/input-mask" component={inputMask} />
          <AppRoute path="/forms/layout/form-layout" component={layout} />
          <AppRoute path="/forms/formik" component={formik} />{" "}
          <AppRoute path="/tables/react-tables" component={ReactTables} />
          <AppRoute path="/tables/agGrid" component={Aggrid} />
          <AppRoute path="/tables/data-tables" component={DataTable} />
          <AppRoute path="/pages/profile" component={profile} />
          <AppRoute path="/pages/faq" component={faq} />
          <AppRoute
            path="/pages/knowledge-base"
            component={knowledgeBase}
            exact
          />
          <AppRoute
            path="/pages/knowledge-base/category"
            component={knowledgeBaseCategory}
            exact
          />
          <AppRoute
            path="/pages/knowledge-base/category/questions"
            component={knowledgeBaseQuestion}
          />
          <AppRoute path="/pages/search" component={search} />
          <AppRoute
            path="/pages/account-settings"
            component={accountSettings}
          />
          <AppRoute path="/pages/invoice" component={invoice} />
          <AppRoute
            path="/misc/coming-soon"
            component={comingSoon}
            fullLayout
          />
          <AppRoute path="/misc/error/404" component={error404} fullLayout />
          <AppRoute path="/pages/register" component={register} fullLayout />
          <AppRoute
            path="/pages/forgot-password"
            component={forgotPassword}
            fullLayout
          />
          <AppRoute
            path="/pages/lock-screen"
            component={lockScreen}
            fullLayout
          />
          <AppRoute
            path="/pages/reset-password"
            component={resetPassword}
            fullLayout
          /> */}
          {/* <AppRoute path="/misc/error/500" component={error500} fullLayout />
          <AppRoute
            path="/misc/not-authorized"
            component={authorized}
            fullLayout
          />
          <AppRoute
            path="/misc/maintenance"
            component={maintenance}
            fullLayout
          /> */}
          {/* <AppRoute path="/app/user/list" component={userList} />
          <AppRoute path="/app/user/edit" component={userEdit} />
          <AppRoute path="/app/user/view" component={userView} /> */}
          {/* <AppRoute path="/charts/apex" component={apex} />
          <AppRoute path="/charts/chartjs" component={chartjs} />
          <AppRoute path="/charts/recharts" component={extreme} />
          <AppRoute path="/maps/leaflet" component={leafletMaps} /> */}
          <AppRoute component={error404} fullLayout />
        </Switch>
      </Router>
    );
  }
}

export default AppRouter;
