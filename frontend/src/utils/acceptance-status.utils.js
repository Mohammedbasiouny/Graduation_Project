import i18n from "@/i18n";

export const getAcceptanceStatus = (status) => {
  const acceptable = String(status) === "true";

  let variant;
  switch (acceptable) {
    case true:
      variant = "success";
      break;
    case false:
      variant = "error";
      break;
    default:
      variant = "default";
  }

  const label = i18n.t(`acceptance_status.${acceptable}`);

  return { label, acceptable, variant };
};
