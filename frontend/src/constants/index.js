import i18n from "@/i18n";

export const COLLEGE_LOCATION_OPTIONS = (types = []) => {
  const allOptions = [
    { value: "true", label: i18n.t("fields:college_is_off_campus.options.true") },
    { value: "false", label: i18n.t("fields:college_is_off_campus.options.false") },
  ]

  // If no types passed → return all
  if (!types.length) return allOptions;

  // Filter based on provided array
  return allOptions.filter(option => types.includes(option.value));
};

export const STUDENT_RESULT_OPTIONS = (types = []) => {
  const allOptions = [
    { value: "pending", label: i18n.t("fields:result_options.pending") },
    { value: "accepted", label: i18n.t("fields:result_options.accepted") },
    { value: "rejected", label: i18n.t("fields:result_options.rejected") },
  ]

  // If no types passed → return all
  if (!types.length) return allOptions;

  // Filter based on provided array
  return allOptions.filter(option => types.includes(option.value));
};

export const GENDER_OPTIONS = (withAllOption = false) => [
  { value: "male", label: i18n.t("gender.male") },
  { value: "female", label: i18n.t("gender.female") },
  ...(withAllOption
    ? [{ value: "all", label: i18n.t("gender.all") }]
    : []),
];

export const RELIGION_OPTIONS = (withAllOption = false) => [
  { value: "muslim", label: i18n.t("religion.muslim") },
  { value: "christian", label: i18n.t("religion.christian") },
  ...(withAllOption
    ? [{ value: "all", label: i18n.t("religion.all") }]
    : []),
];

export const HOUSING_OPTIONS = (types = []) => {
  const allOptions = [
  { value: "premium", label: i18n.t("fields:housing_type.options.premium") },
  { value: "regular", label: i18n.t("fields:housing_type.options.regular") },
  ];

  // If no types passed → return all
  if (!types.length) return allOptions;

  // Filter based on provided array
  return allOptions.filter(option => types.includes(option.value));
};

export const UNIVERSITIES_OPTIONS = (types = []) => {
  const allOptions = [
    { value: "hu", label: i18n.t("universities.hu") },
    { value: "hnu", label: i18n.t("universities.hnu") },
    { value: "hitu", label: i18n.t("universities.hitu") },
    { value: "all", label: i18n.t("universities.all") }
  ];

  // If no types passed → return all
  if (!types.length) return allOptions;

  // Filter based on provided array
  return allOptions.filter(option => types.includes(option.value));
};

export const STUDENT_NATIONALITY_OPTIONS = (withAllOption = false) => [
  { value: "egyptian", label: i18n.t("fields:student_nationality.options.egyptian") },
  { value: "expatriate", label: i18n.t("fields:student_nationality.options.expatriate") },
  ...(withAllOption
    ? [{ value: "all", label: i18n.t("fields:student_nationality.options.all") }]
    : []),
];

export const RESIDENCE_TYPE_OPTIONS = (withAllOption = false) => [
  { value: "inside", label: i18n.t("fields:residence_type.options.inside") },
  { value: "outside", label: i18n.t("fields:residence_type.options.outside") },
  ...(withAllOption
    ? [{ value: "all", label: i18n.t("fields:residence_type.options.all") }]
    : []),
];

export const STUDENT_TYPE_OPTIONS = (types = []) => {
  const allOptions = [
    { value: "new", label: i18n.t("fields:student_type.options.new") },
    { value: "old", label: i18n.t("fields:student_type.options.old") },
    { value: "all", label: i18n.t("fields:student_type.options.all") }
  ];

  // If no types passed → return all
  if (!types.length) return allOptions;

  // Filter based on provided array
  return allOptions.filter(option => types.includes(option.value));
};

export const PRE_UNIVERSITY_EDUCATION_OPTIONS = (withAllOption = false) => [
  { value: "inside", label: i18n.t("fields:pre_university_education.options.inside") },
  { value: "outside", label: i18n.t("fields:pre_university_education.options.outside") },
  ...(withAllOption
    ? [{ value: "all", label: i18n.t("fields:pre_university_education.options.all") }]
    : []),
];

export const GUARDIAN_NATIONALITY_OPTIONS = (withAllOption = false) => [
  { value: "egyptian", label: i18n.t("fields:guardian_nationality.options.egyptian") },
  { value: "expatriate", label: i18n.t("fields:guardian_nationality.options.expatriate") },
  ...(withAllOption
    ? [{ value: "all", label: i18n.t("fields:guardian_nationality.options.all") }]
    : []),
];

export const ENROLLMENT_STATUS_OPTIONS = () => [
  { value: "enrolled", label: i18n.t("fields:enrollment_status.options.enrolled") },
  { value: "new", label: i18n.t("fields:enrollment_status.options.new") },
  { value: "continuing", label: i18n.t("fields:enrollment_status.options.continuing") },
  { value: "deferred", label: i18n.t("fields:enrollment_status.options.deferred") },
  { value: "withdrawn", label: i18n.t("fields:enrollment_status.options.withdrawn") },
  { value: "re_enrolled", label: i18n.t("fields:enrollment_status.options.re_enrolled") },
  { value: "repeat_year", label: i18n.t("fields:enrollment_status.options.repeat_year") },
  { value: "transferred", label: i18n.t("fields:enrollment_status.options.transferred") },
  { value: "canceled", label: i18n.t("fields:enrollment_status.options.canceled") },
  { value: "dismissed", label: i18n.t("fields:enrollment_status.options.dismissed") },
  { value: "graduated", label: i18n.t("fields:enrollment_status.options.graduated") },
];

export const STUDY_SYSTEM_TYPE_OPTIONS = () => [
  { value: "regular", label: i18n.t("fields:study_system_type.options.regular") },
  { value: "credit_hours", label: i18n.t("fields:study_system_type.options.credit_hours") },
];

export const BUILDING_TYPE_OPTIONS = () => [
  { value: "male", label: i18n.t("fields:building_type.options.male") },
  { value: "female", label: i18n.t("fields:building_type.options.female") },
];

export const ROOM_TYPE_OPTIONS = (types = []) => {
  const allOptions = [
    { value: "regular", label: i18n.t("fields:room_type.options.regular") },
    { value: "premium", label: i18n.t("fields:room_type.options.premium") },
    { value: "medical", label: i18n.t("fields:room_type.options.medical") },
    { value: "studying", label: i18n.t("fields:room_type.options.studying") },
    { value: "all", label: i18n.t("fields:room_type.options.all") },
  ];

  // If no types passed → return all
  if (!types.length) return allOptions;

  // Filter based on provided array
  return allOptions.filter(option => types.includes(option.value));
};

export const MEALS_OPTIONS = (types = []) => {
  const allOptions = [
    { value: "yes", label: i18n.t("fields:meals.options.yes") },
    { value: "no",  label: i18n.t("fields:meals.options.no") },
    { value: "all", label: i18n.t("fields:meals.options.all") },
  ];

  // If no types passed → return all
  if (!types.length) return allOptions;

  // Filter based on provided array
  return allOptions.filter(option => types.includes(option.value));
};

export const ROLES_OPTIONS = (types = []) => {
  const allOptions = [
    { value: "admin", label: i18n.t("fields:role.options.admin") },
    { value: "student", label: i18n.t("fields:role.options.student") },
    { value: "maintenance", label: i18n.t("fields:role.options.maintenance") },
    { value: "cafeteria", label: i18n.t("fields:role.options.cafeteria") },
    { value: "medical", label: i18n.t("fields:role.options.medical") },
    { value: "supervisor", label: i18n.t("fields:role.options.supervisor") }
  ];

  // If no types passed → return all
  if (!types.length) return allOptions;

  // Filter based on provided array
  return allOptions.filter(option => types.includes(option.value));
};

export const STUDY_LEVEL_OPTIONS = () => [
  { value: "preparatory", label: i18n.t("fields:study_level.options.preparatory") },
  { value: "first_year", label: i18n.t("fields:study_level.options.first_year") },
  { value: "second_year", label: i18n.t("fields:study_level.options.second_year") },
  { value: "third_year", label: i18n.t("fields:study_level.options.third_year") },
  { value: "fourth_year", label: i18n.t("fields:study_level.options.fourth_year") },
  { value: "fifth_year", label: i18n.t("fields:study_level.options.fifth_year") },
  { value: "sixth_year", label: i18n.t("fields:study_level.options.sixth_year") },
];

export const PARENTS_STATUS_OPTIONS = () => [
  { value: "both_alive", label: i18n.t("fields:parents_status.options.both_alive") },
  { value: "father_deceased", label: i18n.t("fields:parents_status.options.father_deceased") },
  { value: "mother_deceased", label: i18n.t("fields:parents_status.options.mother_deceased") },
  { value: "both_deceased", label: i18n.t("fields:parents_status.options.both_deceased") },
  { value: "divorced", label: i18n.t("fields:parents_status.options.divorced") },
  { value: "separated", label: i18n.t("fields:parents_status.options.separated") },
  { value: "father_unknown", label: i18n.t("fields:parents_status.options.father_unknown") },
  { value: "mother_unknown", label: i18n.t("fields:parents_status.options.mother_unknown") },
  { value: "guardian_only", label: i18n.t("fields:parents_status.options.guardian_only") },
];

export const GRADE_OPTIONS = (grades = []) => {
  const allOptions = [
    { value: 0, label: i18n.t("fields:grade.options.0") },
    { value: 1, label: i18n.t("fields:grade.options.1") },
    { value: 2, label: i18n.t("fields:grade.options.2") },
    { value: 3, label: i18n.t("fields:grade.options.3") },
    { value: 4, label: i18n.t("fields:grade.options.4") },
  ];

  if (!grades.length) return allOptions;

  return allOptions.filter(option => grades.includes(option.value));
};

export const MEAL_CATEGORY_OPTIONS = (types = []) => {
  const allOptions = [
    { value: "breakfast", label: i18n.t("fields:meal_category.options.breakfast") },
    { value: "lunch", label: i18n.t("fields:meal_category.options.lunch") },
    { value: "dinner", label: i18n.t("fields:meal_category.options.dinner") },
    { value: "suhoor", label: i18n.t("fields:meal_category.options.suhoor") }
  ];

  // If no types passed → return all
  if (!types.length) return allOptions;

  // Filter based on provided array
  return allOptions.filter(option => types.includes(option.value));
};

export const DAY_TYPE_OPTIONS = (types = []) => {
  const allOptions = [
    { value: "normal", label: i18n.t("fields:day_type.options.normal") },
    { value: "exam", label: i18n.t("fields:day_type.options.exam") },
    { value: "ramadan", label: i18n.t("fields:day_type.options.ramadan") }
  ];

  // If no types passed → return all
  if (!types.length) return allOptions;

  // Filter based on provided array
  return allOptions.filter(option => types.includes(option.value));
};

export const DAYS_OF_WEEK = () => [
  i18n.t('calendar:days.sun'),
  i18n.t('calendar:days.mon'),
  i18n.t('calendar:days.tue'),
  i18n.t('calendar:days.wed'),
  i18n.t('calendar:days.thu'),
  i18n.t('calendar:days.fri'),
  i18n.t('calendar:days.sat')
];

export const MONTH_NAMES = () => [
  i18n.t('calendar:months.january'),
  i18n.t('calendar:months.february'),
  i18n.t('calendar:months.march'),
  i18n.t('calendar:months.april'),
  i18n.t('calendar:months.may'),
  i18n.t('calendar:months.june'),
  i18n.t('calendar:months.july'),
  i18n.t('calendar:months.august'),
  i18n.t('calendar:months.september'),
  i18n.t('calendar:months.october'),
  i18n.t('calendar:months.november'),
  i18n.t('calendar:months.december')
];

export const ALL_PERMISSIONS = [
  // Governorate
  "add-governorate",
  "view-governorates",
  "view-governorate",
  "update-governorate",
  "delete-governorate",

  // Edu Department
  "add-Edu-department",
  "view-Edu-departments",
  "view-Edu-department",
  "update-Edu-department",
  "delete-Edu-department",

  // Police Station
  "add-police-station",
  "view-police-stations",
  "view-police-station",
  "update-police-station",
  "delete-police-station",

  // City
  "add-city",
  "view-cities",
  "view-city",
  "update-city",
  "delete-city",

  // College
  "add-college",
  "view-colleges",
  "view-college",
  "update-college",
  "delete-college",

  // Department
  "add-department",
  "view-departments",
  "view-department",
  "update-department",
  "delete-department",

  // Application Date
  "add-application-date",
  "view-application-dates",
  "view-application-date",
  "update-application-date",
  "delete-application-date",

  // Building
  "add-building",
  "view-buildings",
  "view-building",
  "update-building",
  "delete-building",

  // Room
  "add-room",
  "view-rooms",
  "view-room",
  "update-room",
  "delete-room",

  // Pre Uni Certificate
  "add-pre-uni-certificate",
  "view-pre-uni-certificates",
  "view-pre-uni-certificate",
  "update-pre-uni-certificate",
  "delete-pre-uni-certificate",

  // Period Status
  "toggle-period-status"
];