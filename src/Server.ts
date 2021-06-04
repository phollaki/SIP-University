import '@tsed/platform-express'; // /!\ keep this import
import '@tsed/ajv';
import '@tsed/typeorm';

import compress from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import methodOverride from 'method-override';

import { PlatformApplication } from '@tsed/common';
import { Configuration, Inject } from '@tsed/di';

import { config, rootDir } from './config';
import { AdminController } from './controllers/AdminController';
import { AuthController } from './controllers/AuthController';
import { CourseController } from './controllers/CourseController';
import { DepartmentController } from './controllers/DepartmentController';
import { FacultyController } from './controllers/FacultyController';
import { InstructorController } from './controllers/InstructorController';
import { LocationController } from './controllers/LocationController';
import { StudentController } from './controllers/StudentController';
import { GlobalErrorHandlerMiddleware } from './middlewares/errorMiddleware';
import { NotFoundHandlerMiddleware } from './middlewares/notfoundMiddleware';

const { DB_NAME, DB_USER, DB_PORT, DB_HOST, DB_USER_PASSWORD, DB_DATABASE } =
  process.env;

@Configuration({
  ...config,
  typeorm: [
    {
      name: DB_NAME,
      type: "postgres",
      host: DB_HOST,
      port: parseInt(DB_PORT as string),
      username: DB_USER,
      password: DB_USER_PASSWORD,
      database: DB_DATABASE,
      entities: [`${__dirname}/secondLayer/entity/*{.ts,.js}`],
    },
  ],
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false,
  mount: {
    "/courses": [CourseController],
    "/students": [StudentController],
    "/auth": [AuthController],
    "/admin": [AdminController],
    "/faculties": [FacultyController],
    "/departments": [DepartmentController],
    "/locations": [LocationController],
    "/instructors": [InstructorController],
  },
  exclude: ["**/*.spec.ts"],
  componentsScan: [
    `./secondLayer/**.ts`,
    `./thirdLayer/**.ts`,
    `./services/**.ts`,
    `./middlewares/**.ts`,
  ],
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $afterRoutesInit() {
    this.app.use(NotFoundHandlerMiddleware);
    this.app.use(GlobalErrorHandlerMiddleware);
  }

  $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(express.json())
      .use(
        express.urlencoded({
          extended: true,
        })
      );
  }
}
