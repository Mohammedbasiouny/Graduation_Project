import { BaseService } from "./Base.service";

class SettingsService extends BaseService {
  constructor() {
    super("/admin/settings");
  }

  find() {
    return this.get("");
  }

  update(data) {
    return this.put("", data);
  }
}

export const settingsService = new SettingsService();
