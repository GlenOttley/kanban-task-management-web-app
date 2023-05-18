"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  app: () => app
});
module.exports = __toCommonJS(src_exports);

// src/utils/server.ts
var import_express = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
function createServer() {
  const app2 = (0, import_express.default)();
  app2.use((0, import_cors.default)({ origin: "http://localhost:3000" }));
  app2.get("/workspaces", (_, response) => {
    const workspaces = [
      { name: "api", version: "1.0.0" },
      { name: "types", version: "1.0.0" },
      { name: "web", version: "1.0.0" }
    ];
    response.json({ data: workspaces });
  });
  return app2;
}
var server_default = createServer;

// src/index.ts
var app = server_default();
var port = process.env.PORT || 5e3;
app.listen(port, () => console.log(`Server running on port ${port}`));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
