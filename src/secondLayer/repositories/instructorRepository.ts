import ISipDataService from 'src/dataLayer/dataservice';
import ApiError from 'src/dataLayer/models/error';
import { EntityRepository, Repository } from 'typeorm';

import { Injectable } from '@tsed/di';

import IInstructor from '../../dataLayer/models/instructor';
import Instructor from '../entity/instructor';

@Injectable()
@EntityRepository(Instructor)
export class DbInstructorRepository
  extends Repository<Instructor>
  implements ISipDataService<IInstructor>
{
  async getModel(id: string): Promise<IInstructor | ApiError> {
    const instructor = await this.findOne(id);

    if (!instructor)
      return <ApiError>{
        error: "The instructor with the given id cannot be found.",
        errorCode: 404,
      };

    return instructor;
  }
  async getAllModel(): Promise<ApiError | IInstructor[]> {
    const instructors = await this.find();

    return instructors;
  }
  async updateModel(
    id: string,
    entity: IInstructor
  ): Promise<IInstructor | ApiError> {
    const instructor = await this.findOne(id);
    if (!instructor)
      return <ApiError>{
        error: "The instructor with the given id cannot be found.",
        errorCode: 404,
      };

    const insId = instructor.INS_ID;
    Object.assign(instructor, entity);
    instructor.INS_ID = insId;
    await this.save(instructor);

    return instructor;
  }
  async createModel(entity: IInstructor): Promise<IInstructor | ApiError> {
    if (entity.INS_ID) {
      return <ApiError>{
        error: "You cannot specify the ID field during instructor creation!",
        errorCode: 400,
      };
    }

    const instructors = await this.find();

    const ids = instructors
      .map((ins) => Number.parseInt(ins.INS_ID.substring(1), 10))
      .filter((numb) => typeof numb == "number" && numb);

    let maxId = -1;
    if (ids.length == 0) {
      maxId = 0;
    } else {
      maxId = Math.max(...ids);
    }

    const nextinstructorId = maxId + 1;

    let instructorIdString = "i" + nextinstructorId;

    const instructor = new Instructor();
    Object.assign(instructor, entity);

    instructor.INS_ID = instructorIdString;

    await this.save(instructor);
    const returnItem = (await this.findOne(instructorIdString)) as IInstructor;

    return returnItem;
  }
  async deleteModel(id: string): Promise<IInstructor | ApiError> {
    const instructor = await this.findOne(id);
    if (!instructor)
      return <ApiError>{
        error: "The instructor with the given id cannot be found.",
        errorCode: 404,
      };

    await this.delete(id);

    return instructor;
  }
}
