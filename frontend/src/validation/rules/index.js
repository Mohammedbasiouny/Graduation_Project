import { isValidEmail } from "./email"
import { isValidOtp, validateOtp } from "./otp"
import { isBornInEgypt, getGovernorateCode, getGovernorateByNationalId } from "./ssn"
import { splitPhoneNumber } from "./phone-number"

export {
  isValidEmail,
  isValidOtp,
  validateOtp,
  isBornInEgypt,
  getGovernorateCode,
  getGovernorateByNationalId,
  splitPhoneNumber
}