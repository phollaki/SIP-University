import { NextFunction, request, Request, Response } from "express";
import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import ApiError from "../../responses/error-response";

@Service()
@Middleware({ type: "after" })
export class NotFoundMiddleware implements ExpressMiddlewareInterface {
  public use(req: Request, res: Response, next?: NextFunction): any {
    if (!res.headersSent) {
      res.status(404).json(<ApiError>{
        error: "There is no such route!",
      });
    }
    res.end();
  }
}
