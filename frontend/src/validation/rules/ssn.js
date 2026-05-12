import governorates from "@/assets/data/egypt_governorates.json";

export function isBornInEgypt(nationalId) {
  if (!nationalId) return false;

  const id = String(nationalId).trim();

  if (id.length < 9) return false;

  const birthCountryCode = id.slice(7, 9);
  
  return birthCountryCode !== "88";
}

export function getGovernorateCode(nationalId) {
  if (!nationalId) return null;

  const id = String(nationalId).trim();
  if (id.length < 11) return null;

  return id.slice(7, 9);
}

export function getGovernorateByNationalId(nationalId) {
  const code = getGovernorateCode(nationalId);
  if (!code) return null;

  return governorates.find(g => g.code === code) || null;
}

