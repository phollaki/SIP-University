import axios from 'axios';
import { Response } from 'express';
import ApiError from 'src/dataLayer/models/error';
import IInstructor from 'src/dataLayer/models/instructor';
import { created, ok } from 'src/helpers/responses';
import UserDetails from 'src/helpers/userType';
import { LoggedInMiddleware } from 'src/middlewares/userMiddlewares';
import { InstructorService } from 'src/services/InstructorService';
import PopulatorService from 'src/services/PopulatorService';
import { SipSocketService } from 'src/socket/socketService';

import {
    BodyParams, Context, Controller, Delete, Get, PathParams, Post, Put, QueryParams, Res,
    UseBeforeEach
} from '@tsed/common';

@UseBeforeEach(LoggedInMiddleware)
@Controller("/instructors")
export class InstructorController {
  constructor(
    private instructorService: InstructorService,
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
    @QueryParams("ins_id") ins_id: string,
    @QueryParams("ins_fname") ins_fname: string,
    @QueryParams("ins_lname") ins_lname: string,
    @QueryParams("dep_code") dep_code: string,
    @QueryParams("fac_code") fac_code: string
  ) {
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.instructorService.getAll();

    if (this.isError(res)) {
      return response.status(res.errorCode ?? 500).json({ error: res.error });
    }

    let filtered = res.map((r) => r);

    if (ins_id) {
      filtered = filtered.filter((r) => r.INS_ID === ins_id);
    }
    if (ins_fname) {
      filtered = filtered.filter((r) => r.INS_FNAME === ins_fname);
    }
    if (ins_lname) {
      filtered = filtered.filter((r) => r.INS_LNAME === ins_lname);
    }

    if (dep_code) {
      filtered = filtered.filter((r) => r.DEP_CODE === dep_code);
    }
    if (fac_code) {
      filtered = filtered.filter((r) => r.FAC_CODE === fac_code);
    }

    const populated = await this.populatorService.populate(
      [...filtered],
      ["FAC_CODE", "DEP_CODE"]
    );

    return ok(
      "The query of all instructors went succesful.",
      response,
      populated
    );
  }

  @Get("/:id")
  async getOne(
    @Res() response: Response,
    @PathParams("id") id: string,
    @Context("jwt") jwt: string
  ) {
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.instructorService.getOne(id);

    if (this.isError(res)) {
      return response.status(res.errorCode ?? 500).json({ error: res.error });
    }

    const populated = await this.populatorService.populate(
      [res],
      ["FAC_CODE", "DEP_CODE"]
    );

    return ok(
      "The query of a single instructor went succesful.",
      response,
      populated
    );
  }

  @Put("/:id")
  async updateOne(
    @Res() response: Response,
    @PathParams("id") id: string,
    @BodyParams() instructor: IInstructor,
    @Context("user") user: UserDetails,
    @Context("jwt") jwt: string
  ) {
    if (!user.isAdmin) {
      return response
        .status(401)
        .json({ error: "You are not authorized to modify this instructor." });
    }
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.instructorService.updateOne(id, instructor);

    if (this.isError(res))
      return response.status(res.errorCode).json({ error: res.error });

    const populated = await this.populatorService.populate(
      [res],
      ["FAC_CODE", "DEP_CODE"]
    );

    this.socket.getRefreshSignal();

    return ok(
      "The update of a single instructor went succesful.",
      response,
      res
    );
  }

  @Post("/")
  async createOne(
    @Res() response: Response,
    @BodyParams() instructor: IInstructor,
    @Context("user") user: UserDetails,
    @Context("jwt") jwt: string
  ) {
    if (!user.isAdmin) {
      return response
        .status(401)
        .json({ error: "You are not authorized to create a new instructor." });
    }
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.instructorService.createOne(instructor);

    if (this.isError(res))
      return response.status(res.errorCode).json({ error: res.error });

    const populated = await this.populatorService.populate(
      [res],
      ["FAC_CODE", "DEP_CODE"]
    );

    this.socket.getRefreshSignal();

    return created(
      "You have succesfully created an instructor.",
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
        .json({ error: "You are not authorized to delete an instructor." });
    }
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.instructorService.deleteOne(id);

    if (this.isError(res))
      return response.status(res.errorCode).json({ error: res.error });

    this.socket.getRefreshSignal();

    return ok("You have succesfully deleted the instructor.", response, res);
  }
}
