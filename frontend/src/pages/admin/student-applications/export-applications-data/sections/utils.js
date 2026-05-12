export const getPersonalFieldsByType = (section, type) => {
  const { common, eg, ex } = section;

  switch (type) {
    case "egyptian":
      return { ...common, ...eg };
    case "expatriate":
      return { ...common, ...ex };
    case "all":
    default:
      return { ...common, ...eg, ...ex };
  }
};

export const getResidenceFieldsByType = (section, type) => {
  const { common, in: inside, out } = section;

  switch (type) {
    case "inside":
      return { ...common, ...inside };
    case "outside":
      return { ...common, ...out };
    case "all":
    default:
      return { ...common, ...inside, ...out };
  }
};

export const getAcadmicFieldsByType = (section, type) => {
  const { common, new: n, old } = section;

  switch (type) {
    case "old":
      return { ...common, ...old };
    case "new":
      return { ...common, ...n };
    case "all":
    default:
      return { ...common, ...n, ...old };
  }
};

export const getPreUniEduFieldsByType = (section, type) => {
  const { common, inside, outside } = section;

  switch (type) {
    case "inside":
      return { ...common, ...inside };
    case "outside":
      return { ...common, ...outside };
    case "all":
    default:
      return { ...common, ...inside, ...outside };
  }
};

export const getGuardianFieldsByType = (section, type) => {
  const { common, eg, ex } = section;

  switch (type) {
    case "egyptian":
      return { ...common, ...eg };
    case "expatriate":
      return { ...common, ...ex };
    case "all":
    default:
      return { ...common, ...eg, ...ex };
  }
};

export const getHousingFieldsByType = (section) => {
  const { common } = section;
  return common
};

export const getDocumentsFields = ({
  section,
  nationality,
  studentStatus,
  guardianType,
  residenceOutside,
}) => {
  if (!section) return {};

  const {
    commom = {},
    eg = {},
    ex = {},
    residence_outside = {},
    new_student = {},
    old_student = {},
    guardian_eg = {},
    guardian_ex = {},
  } = section;

  let result = { ...commom };

  /* =========================
    Nationality
  ========================== */
  if (!nationality || nationality === "all") {
    result = { ...result, ...eg, ...ex };
  } else if (nationality === "egyptian") {
    result = { ...result, ...eg };
  } else if (nationality === "expatriate") {
    result = { ...result, ...ex };
  }

  /* =========================
    Residence Outside
  ========================== */
  if (residenceOutside === undefined || residenceOutside === null || residenceOutside === "all") {
    result = { ...result, ...residence_outside };
  } else if (residenceOutside === "outside") {
    result = { ...result, ...residence_outside };
  }

  /* =========================
    Student Status
  ========================== */
  if (!studentStatus || studentStatus === "all") {
    result = { ...result, ...new_student, ...old_student };
  } else if (studentStatus === "new") {
    result = { ...result, ...new_student };
  } else if (studentStatus === "old") {
    result = { ...result, ...old_student };
  }

  /* =========================
    Guardian Type
  ========================== */
  if (!guardianType || guardianType === "all") {
    result = { ...result, ...guardian_eg, ...guardian_ex };
  } else if (guardianType === "egyptian") {
    result = { ...result, ...guardian_eg };
  } else if (guardianType === "expatriate") {
    result = { ...result, ...guardian_ex };
  }

  return result;
};