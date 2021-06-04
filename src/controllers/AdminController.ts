import axios from 'axios';
import { Request, Response } from 'express';
import ICourse from 'src/dataLayer/models/course';
import ApiError from 'src/dataLayer/models/error';
import { ok } from 'src/helpers/responses';
import UserDetails from 'src/helpers/userType';
import { LoggedInMiddleware } from 'src/middlewares/userMiddlewares';
import { CourseProviderService } from 'src/providers/courseProviderService';
import { StudentProviderService } from 'src/providers/studentProviderService';
import { DbCourseProvider } from 'src/secondLayer/providers/dbCourseProvider';
import { DbStudentProvider } from 'src/secondLayer/providers/dbStudentProvider';

import {
    Context, Controller, Get, Inject, PathParams, PlatformResponse, Post, QueryParams, Req, Res,
    UseBefore, UseBeforeEach
} from '@tsed/common';

import { HttpCourseProvider, HttpStudentProvider } from '../thirdLayer/httpDataProvider';

@Controller("/admin")
export class AdminController {
  constructor(
    private courseProvider: CourseProviderService,
    private studentProvider: StudentProviderService,
    private dbCourse: DbCourseProvider,
    private httpCourse: HttpCourseProvider,
    private dbStudent: DbStudentProvider,
    private httpStudent: HttpStudentProvider
  ) {}

  @UseBeforeEach(LoggedInMiddleware)
  @Post("/switch/course/:providerName")
  async changeCourseProvider(
    @Res() response: Response,
    @PathParams("providerName") providerName: string,
    @Context("user") user: UserDetails
  ) {
    if (!user.isAdmin) {
      return response
        .status(401)
        .json({ error: "You are not authorized to perform admin functions." });
    }
    const oldProvider = this.courseProvider.getProvider();
    const oldName = oldProvider.constructor.name;

    console.log(providerName);
    if (providerName === "db") {
      this.courseProvider.changeProvider(this.dbCourse);
    } else if (providerName === "http") {
      this.courseProvider.changeProvider(this.httpCourse);
    }

    const newProvider = this.courseProvider.getProvider();
    const newName = newProvider.constructor.name;

    return response.json({
      message: "Succesfully modified the course provider.",
      oldProvider: oldName,
      newProvider: newName,
    });
  }

  @UseBefore(LoggedInMiddleware)
  @Post("/switch/student/:providerName")
  async changeStudentProvider(
    @Res() response: Response,
    @PathParams("providerName") providerName: string,
    @Context("user") user: UserDetails
  ) {
    if (!user.isAdmin) {
      return response
        .status(401)
        .json({ error: "You are not authorized to perform admin functions." });
    }
    const oldProvider = this.studentProvider.getProvider();
    const oldName = oldProvider.constructor.name;

    console.log(providerName);
    if (providerName === "db") {
      this.studentProvider.changeProvider(this.dbStudent);
    } else if (providerName === "http") {
      this.studentProvider.changeProvider(this.httpStudent);
    }

    const newProvider = this.studentProvider.getProvider();
    const newName = newProvider.constructor.name;

    return response.json({
      message: "Succesfully modified the student provider.",
      oldProvider: oldName,
      newProvider: newName,
    });
  }
}
