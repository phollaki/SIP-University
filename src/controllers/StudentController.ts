import axios from 'axios';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import ApiError from 'src/dataLayer/models/error';
import { created, ok } from 'src/helpers/responses';
import UserDetails from 'src/helpers/userType';
import { StudentService } from 'src/services/StudentService';

import {
    BodyParams, Context, Controller, Delete, Get, PathParams, Post, Put, QueryParams, Res,
    UseBefore, UseBeforeEach
} from '@tsed/common';

import { LoggedInMiddleware } from '../middlewares/userMiddlewares';

@UseBeforeEach(LoggedInMiddleware)
@Controller("/students")
export class StudentController {
  constructor(private studentService: StudentService) {}

  private isError(obj: any | ApiError): obj is ApiError {
    return (obj as ApiError).errorCode != undefined;
  }

  @Get("/current")
  async currentStudent(
    @Res() response: Response,
    @Context("jwt") jwt: string,
    @Context("user") user: UserDetails
  ) {
    if (user.isAdmin) {
      return response.status(400).json({
        error:
          "You cannot get the current student, since you are logged in as an admin.",
      });
    }

    return this.getOne(response, user.userId, jwt, user);
  }

  @Get("/")
  async getAll(
    @Res() response: Response,
    @Context("jwt") jwt: string,
    @Context("user") user: UserDetails,
    @QueryParams("stu_id") stu_id: string,
    @QueryParams("fname") fname: string,
    @QueryParams("lname") lname: string,
    @QueryParams("fac_code") fac_code: string,
    @QueryParams("loc_code") loc_code: string,
    @QueryParams("dep_code") dep_code: string
  ) {
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;

    const res = await this.studentService.getAll();

    if (this.isError(res)) {
      return response.status(res.errorCode ?? 500).json({ error: res.error });
    }

    let filtered = res.map((r) => r);

    if (stu_id) {
      filtered = filtered.filter((r) => r.STU_ID === stu_id);
    }
    if (fname) {
      filtered = filtered.filter((r) => r.STU_FNAME === fname);
    }
    if (lname) {
      filtered = filtered.filter((r) => r.STU_LNAME === lname);
    }
    if (fac_code) {
      filtered = filtered.filter((r) => r.FAC_CODE === fac_code);
    }
    if (dep_code) {
      filtered = filtered.filter((r) => r.DEP_CODE === dep_code);
    }
    if (loc_code) {
      filtered = filtered.filter((r) => r.LOC_CODE === loc_code);
    }

    return response.status(200).json({
      message: "The query of all students went succesful.",
      result: filtered,
    });
  }

  @Get("/:id")
  async getOne(
    @Res() response: Response,
    @PathParams("id") id: string,
    @Context("jwt") jwt: string,
    @Context("user") user: UserDetails
  ) {
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.studentService.getOne(id);

    if (this.isError(res)) {
      return response.status(res.errorCode ?? 500).json({ error: res.error });
    }

    return response.status(200).json({
      message: "The query of a single student went succesful.",
      result: res,
    });
  }

  @Put("/:id")
  async updateOne(
    @Res() response: Response,
    @PathParams("id") id: string,
    @BodyParams() student: IStudent,
    @Context("user") user: UserDetails,
    @Context("jwt") jwt: string
  ) {
    if (!user.isAdmin) {
      return response
        .status(401)
        .json({ error: "You are not authorized to modify this student." });
    }
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.studentService.updateOne(id, student);

    if (this.isError(res))
      return response.status(res.errorCode).json({ error: res.error });

    return response.status(200).json({
      message: "The update of a single student went succesful.",
      result: res,
    });
  }

  @Post("/")
  async createOne(
    @Res() response: Response,
    @BodyParams() student: IStudent,
    @Context("user") user: UserDetails,
    @Context("jwt") jwt: string
  ) {
    if (!user.isAdmin) {
      return response
        .status(401)
        .json({ error: "You are not authorized to create a new student." });
    }
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;

    if (student.HASHED_PASSWORD) {
      return response.status(400).json({
        error: "You cannot specify the password during student creation.",
      });
    }

    const res = await this.studentService.createOne(student);

    if (this.isError(res))
      return response.status(res.errorCode).json({ error: res.error });

    res.HASHED_PASSWORD = bcrypt.hashSync(res.STU_ID);

    const res2 = await this.studentService.updateOne(res.STU_ID, res);

    if (this.isError(res2))
      return response.status(res2.errorCode).json({ error: res2.error });

    return created("You have succesfully created a student.", response, res);
  }

  @Delete("/:id")
  async deleteOne(
    @Res() response: Response,
    @PathParams("id") id: string,
    @Context("user") user: UserDetails,
    @Context("jwt") jwt: string
  ) {
    if (!user.isAdmin) {
      return response
        .status(401)
        .json({ error: "You are not authorized to delete this student." });
    }
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.studentService.deleteOne(id);

    if (this.isError(res))
      return response.status(res.errorCode).json({ error: res.error });

    return ok("You have succesfully deleted the student.", response, res);
  }
}
