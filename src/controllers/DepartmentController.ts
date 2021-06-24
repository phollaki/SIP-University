import axios from 'axios';
import { Response } from 'express';
import IDepartment from 'src/dataLayer/models/department';
import ApiError from 'src/dataLayer/models/error';
import { created, ok } from 'src/helpers/responses';
import UserDetails from 'src/helpers/userType';
import { LoggedInMiddleware } from 'src/middlewares/userMiddlewares';
import { DepartmentService } from 'src/services/DepartmentService';
import PopulatorService from 'src/services/PopulatorService';
import { SipSocketService } from 'src/socket/socketService';

import {
    BodyParams, Context, Controller, Delete, Get, PathParams, Post, Put, QueryParams, Res,
    UseBeforeEach
} from '@tsed/common';

@UseBeforeEach(LoggedInMiddleware)
@Controller("/departments")
export class DepartmentController {
  constructor(
    private departmentService: DepartmentService,
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
    @QueryParams("dep_code") dep_code: string,
    @QueryParams("dep_name") dep_name: string,
    @QueryParams("loc_code") loc_code: string,
    @QueryParams("fac_code") fac_code: string
  ) {
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.departmentService.getAll();

    if (this.isError(res)) {
      return response.status(res.errorCode ?? 500).json({ error: res.error });
    }

    let filtered = res.map((r) => r);

    if (dep_code) {
      filtered = filtered.filter((r) => r.DEP_CODE === dep_code);
    }
    if (dep_name) {
      filtered = filtered.filter((r) => r.DEP_NAME === dep_name);
    }
    if (fac_code) {
      filtered = filtered.filter((r) => r.FAC_CODE === fac_code);
    }
    if (loc_code) {
      filtered = filtered.filter((r) => r.LOC_CODE === loc_code);
    }

    const populated = await this.populatorService.populate(
      [...filtered],
      ["FAC_CODE", "DEP_CODE", "LOC_CODE"]
    );

    return ok(
      "The query of all departments went succesful.",
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
    const res = await this.departmentService.getOne(id);

    if (this.isError(res)) {
      return response.status(res.errorCode ?? 500).json({ error: res.error });
    }

    const populated = await this.populatorService.populate(
      [res],
      ["FAC_CODE", "DEP_CODE", "LOC_CODE"]
    );

    return ok(
      "The query of a single department went succesful.",
      response,
      populated
    );
  }

  @Put("/:id")
  async updateOne(
    @Res() response: Response,
    @PathParams("id") id: string,
    @BodyParams() department: IDepartment,
    @Context("user") user: UserDetails,
    @Context("jwt") jwt: string
  ) {
    if (!user.isAdmin) {
      return response
        .status(401)
        .json({ error: "You are not authorized to modify this department." });
    }
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.departmentService.updateOne(id, department);

    if (this.isError(res))
      return response.status(res.errorCode).json({ error: res.error });

    const populated = await this.populatorService.populate(
      [res],
      ["FAC_CODE", "DEP_CODE", "LOC_CODE"]
    );

    this.socket.getRefreshSignal();

    return ok(
      "The update of a single department went succesful.",
      response,
      populated
    );
  }

  @Post("/")
  async createOne(
    @Res() response: Response,
    @BodyParams() department: IDepartment,
    @Context("user") user: UserDetails,
    @Context("jwt") jwt: string
  ) {
    if (!user.isAdmin) {
      return response
        .status(401)
        .json({ error: "You are not authorized to create a new department." });
    }
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.departmentService.createOne(department);

    if (this.isError(res))
      return response.status(res.errorCode).json({ error: res.error });

    const populated = await this.populatorService.populate(
      [res],
      ["FAC_CODE", "DEP_CODE", "LOC_CODE"]
    );

    this.socket.getRefreshSignal();

    return created(
      "You have succesfully created a department.",
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
        .json({ error: "You are not authorized to delete a department." });
    }
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.departmentService.deleteOne(id);

    if (this.isError(res))
      return response.status(res.errorCode).json({ error: res.error });

    const populated = await this.populatorService.populate(
      [res],
      ["FAC_CODE", "DEP_CODE", "LOC_CODE"]
    );

    this.socket.getRefreshSignal();

    return ok(
      "You have succesfully deleted the department.",
      response,
      populated
    );
  }
}
