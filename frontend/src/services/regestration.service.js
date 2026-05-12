import { BaseService } from "./Base.service";

class RegestrationService extends BaseService {
  constructor() {
    super("/register");
  }

  getRegestration(params = {}) {
    return this.get("profile", { params });
  }

  deleteRegestration(params = {}) {
    return this.delete("delete-profile", { params });
  }

  personalInfo(isEgyption, data) {
    const endPoint = isEgyption ? "egyptian" : "non-egyptian"
    return this.post(`${endPoint}/personal-info`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  residenceInfo(isInsideEgypt, data) {
    const endPoint = isInsideEgypt ? "egyptian" : "non-egyptian"
  const config =
    isInsideEgypt
      ? undefined
      : {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
    return this.post(`${endPoint}/residence-info`, data, config);
  }

  preUniEduInfo(isCertificateFromEgypt, data) {
    const endPoint = isCertificateFromEgypt ? "inside-egypt" : "outside-egypt"
    return this.post(`pre-university-info/${endPoint}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  academicInfo(isNew, data) {
    const endPoint = isNew ? "new-student" : "old-student"
    return this.post(`${endPoint}/academic-info`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  guardianInfo(isEgyption, data) {
    const nationality = isEgyption ? "egyptian" : "non-egyptian"
    return this.post(`${nationality}/relatives/guardian`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  parentsInfo(data) {
    return this.post(`parents-info`, data);
  }

  medicalInfo(data) {
    return this.post(`medical-report`, data);
  }

  housingInfo(data) {
    return this.post(`student/house-info`, data);
  }
}

export const regestrationService = new RegestrationService();
