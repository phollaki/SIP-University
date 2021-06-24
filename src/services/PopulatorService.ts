import _ from 'lodash';
import ApiError from 'src/dataLayer/models/error';

import { Injectable } from '@tsed/di';
import { Exception } from '@tsed/exceptions';

import { CourseService } from './CourseService';
import { DepartmentService } from './DepartmentService';
import { FacultyService } from './FacultyService';
import { InstructorService } from './InstructorService';
import { LocationService } from './LocationService';

@Injectable()
export default class PopulatorService {
  private isError(obj: any | ApiError): obj is ApiError {
    return (obj as ApiError).errorCode != undefined;
  }

  constructor(
    private courseService: CourseService,
    private instructorService: InstructorService,
    private facultyService: FacultyService,
    private locationService: LocationService,
    private departmentService: DepartmentService
  ) {}

  public async populate(model: any[], properties: string[]) {
    const courses = properties.includes("CRS_ID")
      ? await this.courseService.getAll()
      : [];
    const instructors = properties.includes("INS_ID")
      ? await this.instructorService.getAll()
      : [];
    const locations = properties.includes("LOC_CODE")
      ? await this.locationService.getAll()
      : [];
    const departments = properties.includes("DEP_CODE")
      ? await this.departmentService.getAll()
      : [];
    const faculties = properties.includes("FAC_CODE")
      ? await this.facultyService.getAll()
      : [];

    if (this.isError(courses)) {
      throw new Exception(courses.errorCode ?? 500, courses.error);
    }
    if (this.isError(instructors)) {
      throw new Exception(instructors.errorCode ?? 500, instructors.error);
    }
    if (this.isError(locations)) {
      throw new Exception(locations.errorCode ?? 500, locations.error);
    }
    if (this.isError(departments)) {
      throw new Exception(departments.errorCode ?? 500, departments.error);
    }
    if (this.isError(faculties)) {
      throw new Exception(faculties.errorCode ?? 500, faculties.error);
    }

    let mapped = _.mapValues(model, (val, key) => {
      if (properties.includes("FAC_CODE")) {
        if (val.FAC_CODE) {
          val.FACULTY = faculties.filter((f) => f.FAC_CODE === val.FAC_CODE)[0];
        } else {
          val.FACULTY = null;
        }
      }
      if (properties.includes("LOC_CODE")) {
        if (val.LOC_CODE) {
          val.LOCATION = locations.filter(
            (l) => l.LOC_CODE === val.LOC_CODE
          )[0];
        } else {
          val.LOCATION = null;
        }
      }

      if (properties.includes("INS_ID")) {
        if (val.INS_ID) {
          val.INSTRUCTOR = instructors.filter(
            (i) => i.INS_ID === val.INS_ID
          )[0];
        } else {
          val.INSTRUCTOR = null;
        }
      }
      if (properties.includes("DEP_CODE")) {
        if (val.DEP_CODE) {
          val.DEPARTMENT = departments.filter(
            (d) => d.DEP_CODE === val.DEP_CODE
          )[0];
        } else {
          val.DEPARTMENT = null;
        }
      }

      delete val.FAC_CODE;
      delete val.DEP_CODE;
      delete val.INS_ID;
      delete val.LOC_CODE;

      return val;
    });

    const populated = Object.keys(mapped).reduce(function (r, k) {
      return r.concat(mapped[k as any]);
    }, []);
    return populated;
  }
}
