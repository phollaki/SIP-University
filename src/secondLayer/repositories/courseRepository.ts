import ISipDataService from 'src/dataLayer/dataservice';
import ICourse from 'src/dataLayer/models/course';
import ApiError from 'src/dataLayer/models/error';
import { EntityRepository, Repository } from 'typeorm';

import { Injectable } from '@tsed/di';

import Course from '../entity/course';

@Injectable()
@EntityRepository(Course)
export class DbCourseRepository
  extends Repository<Course>
  implements ISipDataService<ICourse>
{
  async getModel(id: string): Promise<ICourse | ApiError> {
    const course = await this.findOne(id);

    if (!course)
      return <ApiError>{
        error: "The course with the given id cannot be found",
        errorCode: 404,
      };

    return course;
  }
  async getAllModel(): Promise<ApiError | ICourse[]> {
    const courses = await this.find();

    return courses;
  }
  async updateModel(id: string, entity: ICourse): Promise<Course | ApiError> {
    const course = await this.findOne(id);
    if (!course)
      return <ApiError>{
        error: "The course with the given id cannot be found",
        errorCode: 404,
      };

    delete entity.CRS_CODE;
    const courseId = course.CRS_CODE;
    Object.assign(course, entity);
    course.CRS_CODE = courseId;
    await this.save(course);

    return course;
  }
  async createModel(entity: ICourse): Promise<ICourse | ApiError> {
    if (entity.CRS_CODE) {
      return <ApiError>{
        error: "You cannot specify the ID field during course creation!",
        errorCode: 400,
      };
    }

    if (!entity.CRS_TITLE) {
      return <ApiError>{
        error: "You must specify the course title!",
        errorCode: 400,
      };
    }

    const courses = await this.find();

    const ids = courses
      .map((crs) => Number.parseInt(crs.CRS_CODE, 10))
      .filter((numb) => typeof numb == "number" && numb);

    let maxId = -1;
    if (ids.length == 0) {
      maxId = 0;
    } else {
      maxId = Math.max(...ids);
    }

    const nextCourseId = maxId + 1;

    let courseIdString = "";

    if (nextCourseId >= 1 && nextCourseId < 10) {
      courseIdString = "000" + nextCourseId;
    } else if (nextCourseId >= 10 && nextCourseId < 100) {
      courseIdString = "00" + nextCourseId;
    } else if (nextCourseId >= 100 && nextCourseId < 1000) {
      courseIdString = "0" + nextCourseId;
    } else if (nextCourseId >= 1000) {
      courseIdString = "" + nextCourseId;
    }

    const course = new Course();
    Object.assign(course, entity);

    course.CRS_CODE = courseIdString;

    await this.save(course);
    const returnItem = (await this.findOne(courseIdString)) as ICourse;

    return returnItem;
  }
  async deleteModel(id: string): Promise<ICourse | ApiError> {
    const course = await this.findOne(id);
    if (!course)
      return <ApiError>{
        error: "The course with the given id cannot be found",
        errorCode: 404,
      };

    await this.delete(id);

    return course;
  }
}
