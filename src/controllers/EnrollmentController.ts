import axios from 'axios';
import { Response } from 'express';
import IEnrollment from 'src/dataLayer/models/enrollment';
import ApiError from 'src/dataLayer/models/error';
import { ok } from 'src/helpers/responses';
import { LoggedInMiddleware } from 'src/middlewares/userMiddlewares';
import { EnrollmentService } from 'src/services/EnrollmentService';
import PopulatorService from 'src/services/PopulatorService';
import { SipSocketService } from 'src/socket/socketService';

import {
    BodyParams, Context, Controller, Delete, Get, Inject, PathParams, PlatformResponse, Post, Put,
    QueryParams, Res, UseBeforeEach
} from '@tsed/common';

import { created } from '../helpers/responses';
import UserDetails from '../helpers/userType';

@UseBeforeEach(LoggedInMiddleware)
@Controller("/enrollments")
export class EnrollmentController {
  constructor(
    private enrollmentService: EnrollmentService,
    private socket: SipSocketService,
    private populatorService: PopulatorService
  ) {}

  private isError(obj: any | ApiError): obj is ApiError {
    return (obj as ApiError).errorCode != undefined;
  }

  @Get("/")
  async getAll(
    @Res() response: Response,
    @Context("jwt") jwt: string,
    @QueryParams("stu_id") stu_id: string,
    @QueryParams("crs_code") crs_code: string
  ) {
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.enrollmentService.getAll();

    if (this.isError(res)) {
      return response.status(res.errorCode ?? 500).json({ error: res.error });
    }

    let filtered = res.map((r) => r);

    if (stu_id) {
      filtered = filtered.filter((r) => r.STU_ID === stu_id);
    }
    if (crs_code) {
      filtered = filtered.filter((r) => r.CRS_CODE === crs_code);
    }

    return ok(
      "The query of all enrollments went succesful.",
      response,
      filtered
    );
  }

  @Post("/enroll/:CRS_CODE")
  async enroll(
    @Res() response: Response,
    @PathParams() CRS_CODE: string,
    @Context("user") user: UserDetails,
    @Context("jwt") jwt: string
  ) {
    if (user.isAdmin) {
      return response
        .status(401)
        .json({ error: "Administrators cannot abandon or enroll in courses." });
    }

    if (!CRS_CODE) {
      return response
        .status(400)
        .json({ error: "You must specify the course code." });
    }

    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.enrollmentService.createOne({
      CRS_CODE,
      STU_ID: user.userId,
    });

    if (this.isError(res))
      return response.status(res.errorCode).json({ error: res.error });

    const populated = await this.populatorService.populate(
      [res],
      ["CRS_CODE", "STU_ID"]
    );

    this.socket.getRefreshSignal();

    return created(
      "You have succesfully enrolled in this course.",
      response,
      populated
    );
  }

  @Post("/abandon/:id")
  async abandonment(
    @Res() response: Response,
    @PathParams("id") CRS_CODE: string,
    @Context("user") user: UserDetails,
    @Context("jwt") jwt: string
  ) {
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    if (user.isAdmin) {
      return response
        .status(401)
        .json({ error: "Administrators cannot abandon or enroll in courses." });
    }

    const enrollments = await this.enrollmentService.getAll();

    if (this.isError(enrollments))
      return response
        .status(enrollments.errorCode)
        .json({ error: enrollments.error });

    const enrollment = enrollments.filter(
      (e) => e.CRS_CODE === CRS_CODE && e.STU_ID === user.userId
    )[0];

    if (!enrollment) {
      return response
        .status(404)
        .json({ error: "You are not subscribed to this course." });
    }

    const res = await this.enrollmentService.deleteOne(
      enrollment.STU_ID + "$" + CRS_CODE
    );

    if (this.isError(res))
      return response.status(res.errorCode).json({ error: res.error });

    const populated = await this.populatorService.populate(
      [res],
      ["CRS_CODE", "STU_ID"]
    );

    this.socket.getRefreshSignal();

    return ok(
      "You have succesfully abandoned this course.",
      response,
      populated
    );
  }
}
