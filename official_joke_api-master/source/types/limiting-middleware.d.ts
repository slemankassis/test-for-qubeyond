declare module "limiting-middleware" {
  import { RequestHandler } from "express";

  export default class LimitingMiddleware {
    constructor();
    limitByIp(): RequestHandler;
  }
}
