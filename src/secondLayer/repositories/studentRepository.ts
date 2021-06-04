import ISipDataService from 'src/dataLayer/dataservice';
import ApiError from 'src/dataLayer/models/error';
import { EntityRepository, Repository } from 'typeorm';

import { Injectable } from '@tsed/di';

import Student from '../entity/student';

@Injectable()
@EntityRepository(Student)
export class DbStudentRepository
  extends Repository<Student>
  implements ISipDataService<IStudent>
{
  async getModel(id: string): Promise<IStudent | ApiError> {
    const student = await this.findOne(id);

    if (!student)
      return <ApiError>{
        error: "The student with the given id cannot be found.",
        errorCode: 404,
      };

    return student;
  }
  async getAllModel(): Promise<ApiError | IStudent[]> {
    const students = await this.find();

    return students;
  }
  async updateModel(
    id: string,
    entity: IStudent
  ): Promise<IStudent | ApiError> {
    const student = await this.findOne(id);
    if (!student)
      return <ApiError>{
        error: "The student with the given id cannot be found.",
        errorCode: 404,
      };

    Object.assign(student, entity);
    await this.save(student);

    return student;
  }
  async createModel(entity: IStudent): Promise<IStudent | ApiError> {
    if (entity.STU_ID) {
      return <ApiError>{
        error: "You cannot specify the ID field during Student creation!",
        errorCode: 400,
      };
    }
    if (!entity.STU_LNAME || !entity.STU_FNAME) {
      return <ApiError>{
        error: "You must provide the student's firstname and lastname!",
        errorCode: 400,
      };
    }

    const students = await this.find();

    const ids = students.map((stu) => Number.parseInt(stu.STU_ID.substring(4)));
    const maxId = Math.max(...ids);
    const nextStudId = maxId + 1;

    const student = new Student();
    Object.assign(student, entity);
    student.STU_ID = "stud" + nextStudId;

    await this.save(student);
    const created = (await this.findOne(student.STU_ID)) as Student;

    return created;
  }
  async deleteModel(id: string): Promise<IStudent | ApiError> {
    const student = await this.findOne(id);
    if (!student)
      return <ApiError>{
        error: "The student with the given id cannot be found.",
        errorCode: 404,
      };

    await this.delete(id);

    return student;
  }
}
