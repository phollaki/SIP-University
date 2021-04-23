import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import extractTokenFromHeader from "../util/getToken";
import ApiError from "../responses/error-response";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  let token;
  try {
    token = extractTokenFromHeader(req);
  } catch (err) {
    res.status(401).send(<ApiError>{
      error: "Unathorized access!",
    });
    return;
  }

  let jwtPayload;

  try {
    jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    res.status(401).send(<ApiError>{
      error: "Unathorized access!",
    });
    return;
  }

  const { id, role } = jwtPayload;

  const newToken = jwt.sign({ data: { id, role } }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.setHeader("Authorization", "Bearer " + newToken);

  next();
};
