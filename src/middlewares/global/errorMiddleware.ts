import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from "routing-controllers";
import { Service } from "typedi";
import { Response } from "express";
import ApiError from "../../responses/error-response";
@Service()
@Middleware({ type: "after" })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: Response, next: (err: any) => any) {
    return response.status(500).json(<ApiError>{ error: error.message });
  }
}
