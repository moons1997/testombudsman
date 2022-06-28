import { combineReducers } from "redux";
import { request } from "./request";
import { postponoment } from "./postponoment";
import { InspectionConclusion } from "./inspectionconclusion";
import { inspectionresult } from "./inspectionresult";
import { inspectionbookofcontractor } from "./inspectionbookofcontractor";
import { complaint } from "./complaint";
import { attestation } from "./attestation";
import { videolesson } from "./videolesson";
import { employee } from "./employee";
import { kadr } from "./kadr";
import { user } from "./user";
import { employeeattestation } from "./employeeattestation";
import { organization } from "./organization";
import { contractor } from "./contractor";
import { controlfunction } from "./controlfunction";
import { news } from "./news";

const filtersReducer = combineReducers({
  request,
  postponoment,
  InspectionConclusion,
  inspectionresult,
  complaint,
  inspectionbookofcontractor,
  attestation,
  videolesson,
  employee,
  kadr,
  user,
  employeeattestation,
  organization,
  contractor,
  controlfunction,
  news,
});
export default filtersReducer;
