const CREATED = 1;
const SENT = 2;
const RECEIVED = 3;
const TO_REJECT = 4;
const TO_AGREE = 5;
const RETURNED_TO_MODERATOR = 6;
const AGREED = 7;
const REJECTED = 8;
const ARCHIVED = 9;
const REVOKED = 10;
const CANCELED_AGREEMENT = 11;
const MODIFIED = 12;
const POSTPONED = 13;
const PROLONGED = 14;
const CANCELLED = 15;
const HELD = 16;
const NOTIFIED = 17;
const EXECUTED = 18;
const CANCELLED_HELD = 19;
const NEW = 20;
export const isInspectionBookStatus = () => [
  AGREED,
  POSTPONED,
  PROLONGED,
  NOTIFIED,
  EXECUTED,
];
export const isMakeNotAgreed = () => [NOTIFIED];
export const newCeoStatus = () => [TO_REJECT, TO_AGREE];
export const newStatus = () => [SENT, RETURNED_TO_MODERATOR];
export const draftStatus = () => [CREATED, REVOKED, MODIFIED];
export const newAttestationStatus = () => [CANCELLED_HELD, SENT];
export const processModeratorStatus = (id) => [
  SENT,
  RECEIVED,
  RETURNED_TO_MODERATOR,
];
export const processCeoStatus = () => [TO_AGREE, TO_REJECT, CANCELED_AGREEMENT];
export const sendStatus = () => [SENT];
export const onTheProcessStatus = () => [
  TO_AGREE,
  TO_REJECT,
  RETURNED_TO_MODERATOR,
];
export const toAgreeStatus = () => [TO_AGREE];
export const toRejectStatus = () => [TO_REJECT];
export const agreeStatus = () => [AGREED, POSTPONED, PROLONGED, EXECUTED];
export const notAgreeSatus = () => [REJECTED];
export const archiveSatus = () => [ARCHIVED];
export const cancelledStatus = () => [CANCELLED];
export const completedStatus = () => [EXECUTED];
export const isCancelHeldStatus = (id) => [id === HELD || id === REJECTED];
export const isSend = (id) =>
  id === CREATED || id === REVOKED || id === MODIFIED;
export const isMakeNotified = (id) =>
  id === SENT || id === RETURNED_TO_MODERATOR;
export const isToAgree = (id) =>
  id === SENT || id === RECEIVED || id === RETURNED_TO_MODERATOR;
export const isToReject = (id) =>
  id === SENT || id === RECEIVED || id === RETURNED_TO_MODERATOR;
export const isReturnToModerator = (id) =>
  id === TO_AGREE || id === TO_REJECT || id === CANCELED_AGREEMENT;
export const isReject = (id) => id === TO_REJECT || id === CANCELED_AGREEMENT;
export const isAgree = (id) => id === TO_AGREE || id === CANCELED_AGREEMENT;
export const isArchive = (id) =>
  id === CREATED || id === REVOKED || id === MODIFIED;

export const isCancelAgreement = (id) => id === AGREED || id === REJECTED;
export const isReceive = (id) => id === SENT;

export const isRevokeStatus = (id) => id === SENT;
export const isModifyStatus = (id) =>
  id === CREATED || id === REVOKED || id === MODIFIED;
export const isPostponeStatus = (id) => id === AGREED || id === NOTIFIED;
export const isProlongStatus = (id) => id === AGREED || id === NOTIFIED;
export const isCancelStatus = (id) => id === AGREED || id === NOTIFIED;
export const isHeldStatus = (id) =>
  id === CREATED || id === SENT || id === MODIFIED || id === CANCELLED_HELD;
export const isExecuteStatus = (id) =>
  id === AGREED ||
  id === POSTPONED ||
  id === PROLONGED ||
  id === NOTIFIED ||
  id === EXECUTED;
export const isDownloadStatus = (id) =>
  id === AGREED ||
  id === POSTPONED ||
  id === PROLONGED ||
  id === CANCELLED ||
  id === REJECTED;

export const isViewReceiver = (id) =>
  id === SENT ||
  id === RECEIVED ||
  id === TO_AGREE ||
  id === TO_REJECT ||
  id === RETURNED_TO_MODERATOR ||
  id === REJECTED ||
  id === AGREED;
export const isViewAgreer = (id) =>
  id === TO_AGREE ||
  id === TO_REJECT ||
  id === RETURNED_TO_MODERATOR ||
  id === REJECTED ||
  id === AGREED ||
  id === AGREED ||
  id === REJECTED;
