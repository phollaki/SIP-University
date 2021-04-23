import { NextFunction, request, Request, Response } from "express";
import helmet from "helmet";
import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";

@Service()
@Middleware({ type: "before" })
export class HelmetMiddleware implements ExpressMiddlewareInterface {
  public use(req: Request, res: Response, next?: NextFunction): any {
    return helmet()(req, res, next);
  }
}
