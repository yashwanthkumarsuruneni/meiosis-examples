import _ from "lodash";

import { setToken } from "../services";

export const createActions = update => ({
  logout: evt => {
    evt.preventDefault();
    setToken("");
    update(model => _.set(model, "user", {}));
    // m.route.set("/");
  }
});
