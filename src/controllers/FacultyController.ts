import axios from 'axios';
import { Response } from 'express';
import ApiError from 'src/dataLayer/models/error';
import { ok } from 'src/helpers/responses';
import { LoggedInMiddleware } from 'src/middlewares/userMiddlewares';
import { FacultyService } from 'src/services/FacultyService';

import {
    BodyParams, Context, Controller, Delete, Get, Inject, PathParams, PlatformResponse, Post, Put,
    QueryParams, Res, UseBeforeEach
} from '@tsed/common';

import IFaculty from '../dataLayer/models/faculty';
import { created } from '../helpers/responses';
import UserDetails from '../helpers/userType';

@UseBeforeEach(LoggedInMiddleware)
@Controller("/faculties")
export class FacultyController {
  constructor(private facultyService: FacultyService) {}

  private isError(obj: any | ApiError): obj is ApiError {
    return (obj as ApiError).errorCode != undefined;
  }

  @Get("/")
  async getAll(
    @Res() response: Response,
    @Context("jwt") jwt: string,
    @QueryParams("fac_code") fac_code: string,
    @QueryParams("fac_name") fac_name: string
  ) {
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.facultyService.getAll();

    if (this.isError(res)) {
      return response.status(res.errorCode ?? 500).json({ error: res.error });
    }

    let filtered = res.map((r) => r);

    if (fac_code) {
      filtered = filtered.filter((r) => r.FAC_CODE === fac_code);
    }
    if (fac_name) {
      filtered = filtered.filter((r) => r.FAC_NAME === fac_name);
    }

    return ok("The query of all faculties went succesful.", response, filtered);
  }

  @Get("/:id")
  async getOne(
    @Res() response: Response,
    @PathParams("id") id: string,
    @Context("jwt") jwt: string
  ) {
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.facultyService.getOne(id);

    if (this.isError(res)) {
      return response.status(res.errorCode ?? 500).json({ error: res.error });
    }

    return ok("The query of a single faculty went succesful.", response, res);
  }

  @Put("/:id")
  async updateOne(
    @Res() response: Response,
    @PathParams("id") id: string,
    @BodyParams() faculty: IFaculty,
    @Context("user") user: UserDetails,
    @Context("jwt") jwt: string
  ) {
    if (!user.isAdmin) {
      return response
        .status(401)
        .json({ error: "You are not authorized to modify this faculty." });
    }
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.facultyService.updateOne(id, faculty);

    if (this.isError(res))
      return response.status(res.errorCode).json({ error: res.error });

    return ok("The update of a single faculty went succesful.", response, res);
  }

  @Post("/")
  async createOne(
    @Res() response: Response,
    @BodyParams() faculty: IFaculty,
    @Context("user") user: UserDetails,
    @Context("jwt") jwt: string
  ) {
    if (!user.isAdmin) {
      return response
        .status(401)
        .json({ error: "You are not authorized to create a new faculty." });
    }
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.facultyService.createOne(faculty);

    if (this.isError(res))
      return response.status(res.errorCode).json({ error: res.error });

    return created("You have succesfully created a faculty.", response, res);
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
        .json({ error: "You are not authorized to delete a faculty." });
    }
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.facultyService.deleteOne(id);

    if (this.isError(res))
      return response.status(res.errorCode).json({ error: res.error });

    return ok("You have succesfully deleted the faculty.", response, res);
  }
}
