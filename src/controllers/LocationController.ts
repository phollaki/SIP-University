import axios from 'axios';
import { Response } from 'express';
import ApiError from 'src/dataLayer/models/error';
import ILocation from 'src/dataLayer/models/location';
import { created, ok } from 'src/helpers/responses';
import UserDetails from 'src/helpers/userType';
import { LoggedInMiddleware } from 'src/middlewares/userMiddlewares';
import { LocationService } from 'src/services/LocationService';
import PopulatorService from 'src/services/PopulatorService';

import {
    BodyParams, Context, Controller, Delete, Get, PathParams, Post, Put, QueryParams, Res,
    UseBeforeEach
} from '@tsed/common';

@UseBeforeEach(LoggedInMiddleware)
@Controller("/locations")
export class LocationController {
  constructor(
    private locationService: LocationService,
    private populatorService: PopulatorService
  ) {}

  private isError(obj: any | ApiError): obj is ApiError {
    return (obj as ApiError).errorCode != undefined;
  }

  @Get("/")
  async getAll(
    @Res() response: Response,
    @Context("jwt") jwt: string,
    @QueryParams("loc_code") loc_code: string,
    @QueryParams("loc_name") loc_name: string,
    @QueryParams("loc_country") loc_country: string
  ) {
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.locationService.getAll();

    if (this.isError(res)) {
      return response.status(res.errorCode ?? 500).json({ error: res.error });
    }

    let filtered = res.map((r) => r);

    if (loc_code) {
      filtered = filtered.filter((r) => r.LOC_CODE === loc_code);
    }
    if (loc_name) {
      filtered = filtered.filter((r) => r.LOC_COUNTRY === loc_country);
    }
    if (loc_name) {
      filtered = filtered.filter((r) => r.LOC_NAME === loc_name);
    }

    return ok("The query of all locations went succesful.", response, filtered);
  }

  @Get("/:id")
  async getOne(
    @Res() response: Response,
    @PathParams("id") id: string,
    @Context("jwt") jwt: string
  ) {
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.locationService.getOne(id);

    if (this.isError(res)) {
      return response.status(res.errorCode ?? 500).json({ error: res.error });
    }

    return ok("The query of a single location went succesful.", response, res);
  }

  @Put("/:id")
  async updateOne(
    @Res() response: Response,
    @PathParams("id") id: string,
    @BodyParams() location: ILocation,
    @Context("user") user: UserDetails,
    @Context("jwt") jwt: string
  ) {
    if (!user.isAdmin) {
      return response
        .status(401)
        .json({ error: "You are not authorized to modify this location." });
    }
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.locationService.updateOne(id, location);

    if (this.isError(res))
      return response.status(res.errorCode).json({ error: res.error });

    return ok("The update of a single location went succesful.", response, res);
  }

  @Post("/")
  async createOne(
    @Res() response: Response,
    @BodyParams() location: ILocation,
    @Context("user") user: UserDetails,
    @Context("jwt") jwt: string
  ) {
    if (!user.isAdmin) {
      return response
        .status(401)
        .json({ error: "You are not authorized to create a new location." });
    }
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.locationService.createOne(location);

    if (this.isError(res))
      return response.status(res.errorCode).json({ error: res.error });

    return created("You have succesfully created a location.", response, res);
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
        .json({ error: "You are not authorized to delete a location." });
    }
    axios.defaults.headers["Authorization"] = "Bearer " + jwt;
    const res = await this.locationService.deleteOne(id);

    if (this.isError(res))
      return response.status(res.errorCode).json({ error: res.error });

    return ok("You have succesfully deleted the location.", response, res);
  }
}
