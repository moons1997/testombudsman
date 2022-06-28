const Color = {
  status(item) {
    if (item.statusId == 2) {
      return "secondary";
    }
    if (item.statusId == 1) {
      return "info";
    } else if (item.statusId == 2) {
      return "primary";
    } else if (item.statusId == 12) {
      return "info";
    } else if (item.statusId == 3) {
      return "secondary";
    } else if (item.statusId == 4) {
      return "warning";
    } else if (item.statusId == 5) {
      return "warning";
    } else if (item.statusId == 9) {
      return "danger";
    } else if (item.statusId == 7) {
      return "success";
    } else if (item.statusId == 6) {
      return "danger";
    } else if (item.statusId == 15) {
      return "danger";
    } else if (item.statusId == 8) {
      return "danger";
    }
    if (item.ceoStatusId == 2) {
      return "secondary";
    }
    if (item.ceoStatusId == 1) {
      return "info";
    } else if (item.ceoStatusId == 2) {
      return "primary";
    } else if (item.ceoStatusId == 12) {
      return "info";
    } else if (item.ceoStatusId == 3) {
      return "secondary";
    } else if (item.statusId == 4) {
      return "warning";
    } else if (item.ceoStatusId == 5) {
      return "warning";
    } else if (item.ceoStatusId == 9) {
      return "danger";
    } else if (item.ceoStatusId == 7) {
      return "success";
    } else if (item.ceoStatusId == 6) {
      return "danger";
    } else if (item.ceoStatusId == 15) {
      return "danger";
    } else if (item.ceoStatusId == 8) {
      return "danger";
    }
    if (item.inspectorStatusId == 2) {
      return "secondary";
    }
    if (item.inspectorStatusId == 1) {
      return "info";
    } else if (item.inspectorStatusId == 2) {
      return "primary";
    } else if (item.inspectorStatusId == 12) {
      return "info";
    } else if (item.inspectorStatusId == 3) {
      return "secondary";
    } else if (item.inspectorStatusId == 4) {
      return "warning";
    } else if (item.inspectorStatusId == 5) {
      return "warning";
    } else if (item.inspectorStatusId == 9) {
      return "danger";
    } else if (item.inspectorStatusId == 7) {
      return "success";
    } else if (item.inspectorStatusId == 6) {
      return "danger";
    } else if (item.inspectorStatusId == 15) {
      return "danger";
    } else if (item.inspectorStatusId == 8) {
      return "danger";
    }
    if (item.moderatorStatusId == 2) {
      return "secondary";
    }
    if (item.moderatorStatusId == 1) {
      return "info";
    } else if (item.moderatorStatusId == 2) {
      return "primary";
    } else if (item.moderatorStatusId == 12) {
      return "info";
    } else if (item.moderatorStatusId == 3) {
      return "secondary";
    } else if (item.moderatorStatusId == 4) {
      return "warning";
    } else if (item.moderatorStatusId == 5) {
      return "warning";
    } else if (item.moderatorStatusId == 9) {
      return "danger";
    } else if (item.moderatorStatusId == 7) {
      return "success";
    } else if (item.moderatorStatusId == 6) {
      return "danger";
    } else if (item.moderatorStatusId == 15) {
      return "danger";
    } else if (item.moderatorStatusId == 8) {
      return "danger";
    }
    if (item.status == "Отправлен") {
      return "success";
    }
    if (item.docStatusId == 1) {
      return "success";
    } else if (item.docStatusId == 2) {
      return "primary";
    } else if (item.docStatusId == 3) {
      return "secondary";
    } else if (item.docStatusId == 4) {
      return "info";
    } else if (item.docStatusId == 5) {
      return "warning";
    } else if (item.docStatusId == 6) {
      return "danger";
    } else if (item.docStatusId == 7) {
      return "warning";
    }
    if (item.stateId == 1) {
      return "success";
    }
    if (item.stateId == 2) {
      return "danger";
    } else {
      return "info";
    }
  },
};
export default Color;
