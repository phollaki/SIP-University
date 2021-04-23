import { Request, Response } from "express";
import {
  JsonController,
  Post,
  Res,
  UseBefore,
  Authorized,
  CurrentUser,
  QueryParam,
  Body,
  Get,
  Req,
} from "routing-controllers";
import Container, { Inject, Service } from "typedi";
import IUser from "../entity/user";
import { checkJwt } from "../middlewares/check-jwt";
import ValidatorService from "../services/validator-service";
import LoginModel from "../requestModels/login-model";
import ApiError from "../responses/error-response";
import { InjectConnection } from "typeorm-typedi-extensions";
import { Connection, Repository } from "typeorm";
import StudentRepository from "../repositories/studentRepository";
import Student from "../entity/user";
import brypt from "bcryptjs";
import jwt from "jsonwebtoken";
import IAdmin from "../entity/admin";

@Service()
@JsonController("/auth")
export class UserController {
  private _validator = Container.get<ValidatorService>(ValidatorService);

  private _studentRepo: Repository<Student>;

  isStudent(obj: IAdmin | IUser): obj is IUser {
    return (obj as IUser).STU_ID !== undefined;
  }

  constructor(@InjectConnection() private connection: Connection) {
    this._studentRepo = connection.getCustomRepository(StudentRepository);
  }

  @Post("/login")
  async auth(
    @Body() model: LoginModel,
    @Res() response: Response
  ): Promise<Response> {
    const res = await this._validator.validate(model);
    if (this._validator.isInvalid(res))
      return response.status(res.statusCode ?? 500).json(<ApiError>{
        error: res.error,
      });

    const hashedPw = brypt.hashSync(model.password);
    let user: IAdmin | IUser;
    if (
      model.username === process.env.ADMIN_ID &&
      brypt.compareSync(process.env.ADMIN_PASSWORD, hashedPw)
    ) {
      user = { USERNAME: process.env.ADMIN_ID } as IAdmin;
    } else {
      user = await this._studentRepo.findOne({ STU_ID: model.username });

      if (!user) {
        return response.status(404).json(<ApiError>{
          error: "There is no student with the given username!",
        });
      }
      if (!brypt.compareSync(model.password, user.HASHED_PASSWORD)) {
        return response
          .status(401)
          .json(<ApiError>{ error: "Invalid password!" });
      }
    }

    let userData = {
      id: this.isStudent(user) ? user.STU_ID : user.USERNAME,
      role: this.isStudent(user) ? "student" : "admin",
    };
    const jwtPayload = userData;
    const jwtData = {
      expiresIn: "1h",
    };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(jwtPayload, secret, jwtData);

    return response
      .status(200)
      .json({ message: "Login success.", token: token });
  }
  @UseBefore(checkJwt)
  @Get("/current")
  async current(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const auth = req.headers.authorization;
    const token = auth.split(" ")[1];
    let payload = jwt.verify(token, process.env.JWT_SECRET) as any;
    const { id, role } = payload;
    console.log(id, role);

    if (role && role === "admin") {
      return res
        .status(200)
        .json({ message: "Success.", isAdmin: true, userId: id });
    } else if (role && role === "student") {
      return res
        .status(200)
        .json({ message: "Success.", isAdmin: false, userId: id });
    }

    return res.status(401).json(<ApiError>{ error: "Unathorized Access." });
  }
}
