import axios from 'axios';
import { Response } from 'express';
import ICourse from 'src/dataLayer/models/course';
import ApiError from 'src/dataLayer/models/error';
import { ok } from 'src/helpers/responses';
import { LoggedInMiddleware } from 'src/middlewares/userMiddlewares';
import { CourseService } from 'src/services/CourseService';
import PopulatorService from 'src/services/PopulatorService';
import { SipSocketService } from 'src/socket/socketService';

import {
    BodyParams, Context, Controller, Delete, Get, Inject, PathParams, PlatformResponse, Post, Put,
    QueryParams, Res, UseBeforeEach
} from '@tsed/common';

import { created } from '../helpers/responses';
import UserDetails from '../helpers/userType';

@UseBeforeEach(LoggedInMiddleware)
@Controller("/courses")
export class CourseController {
  constructor(
    private courseService: CourseService,
    private populatorService: PopulatorService,
    private socket: SipSocketService
  ) {}

  private isError(obj: any | ApiError): obj is ApiError {
    return (obj as ApiError).errorCode != undefined;
  }

  @Get("/")
  async getAll(
    @Res() response: Response,
    @Context("jwt") jwt: string,
    @QueryParams("crs_code") crs_code: string,
    @QueryParams("crs_title") crs_title: string,
    @QueryParams("fac_code") fac_code: string,
    @QueryParams("ins_id") ins_id: string,
    @QueryParams("dep_code") dep_code: string
  ) {
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;

    const courses = await this.courseService.getAll();

    if (this.isError(courses)) {
      return response
        .status(courses.errorCode ?? 500)
        .json({ error: courses.error });
    }

    let filtered = courses.map((r) => r);

    if (crs_code) {
      filtered = filtered.filter((r) => r.CRS_CODE === crs_code);
    }
    if (crs_title) {
      filtered = filtered.filter((r) => r.CRS_TITLE === crs_title);
    }
    if (fac_code) {
      filtered = filtered.filter((r) => r.FAC_CODE === fac_code);
    }
    if (ins_id) {
      filtered = filtered.filter((r) => r.INS_ID === ins_id);
    }
    if (dep_code) {
      filtered = filtered.filter((r) => r.DEP_CODE === dep_code);
    }

    filtered = filtered.map((f) => f);

    const populatedFiltered = await this.populatorService.populate(
      [...filtered],
      ["FAC_CODE", "DEP_CODE", "INS_ID"]
    );

    return ok(
      "The query of all courses went succesful.",
      response,
      populatedFiltered
    );
  }

  @Get("/:id")
  async getOne(
    @Res() response: Response,
    @PathParams("id") id: string,
    @Context("jwt") jwt: string
  ) {
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.courseService.getOne(id);

    if (this.isError(res)) {
      return response.status(res.errorCode ?? 500).json({ error: res.error });
    }

    const populated = await this.populatorService.populate(
      [res],
      ["FAC_CODE", "DEP_CODE", "INS_ID"]
    );

    this.socket.getRefreshSignal();

    return ok(
      "The query of a single course went succesful.",
      response,
      populated
    );
  }

  @Put("/:id")
  async updateOne(
    @Res() response: Response,
    @PathParams("id") id: string,
    @BodyParams() course: ICourse,
    @Context("user") user: UserDetails,
    @Context("jwt") jwt: string
  ) {
    if (!user.isAdmin) {
      return response
        .status(401)
        .json({ error: "You are not authorized to modify this course." });
    }
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.courseService.updateOne(id, course);

    if (this.isError(res))
      return response.status(res.errorCode).json({ error: res.error });

    const populated = await this.populatorService.populate(
      [res],
      ["FAC_CODE", "DEP_CODE", "INS_ID"]
    );

    this.socket.getRefreshSignal();

    return ok(
      "The update of a single course went succesful.",
      response,
      populated
    );
  }

  @Post("/")
  async createOne(
    @Res() response: Response,
    @BodyParams() course: ICourse,
    @Context("user") user: UserDetails,
    @Context("jwt") jwt: string
  ) {
    if (!user.isAdmin) {
      return response
        .status(401)
        .json({ error: "You are not authorized to create a new course." });
    }
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.courseService.createOne(course);

    if (this.isError(res))
      return response.status(res.errorCode).json({ error: res.error });

    const populated = await this.populatorService.populate(
      [res],
      ["FAC_CODE", "DEP_CODE", "INS_ID"]
    );

    this.socket.getRefreshSignal();

    return created(
      "You have succesfully created a course.",
      response,
      populated
    );
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
        .json({ error: "You are not authorized to delete a course." });
    }
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.courseService.deleteOne(id);

    if (this.isError(res))
      return response.status(res.errorCode).json({ error: res.error });

    this.socket.getRefreshSignal();

    return ok("You have succesfully deleted the course.", response, res);
  }
}
