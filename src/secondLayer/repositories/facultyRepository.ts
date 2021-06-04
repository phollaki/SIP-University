import ISipDataService from 'src/dataLayer/dataservice';
import ApiError from 'src/dataLayer/models/error';
import { EntityRepository, Repository } from 'typeorm';

import { Injectable } from '@tsed/di';

import IFaculty from '../../dataLayer/models/faculty';
import Faculty from '../entity/faculty';

@Injectable()
@EntityRepository(Faculty)
export class DbFacultyRepository
  extends Repository<Faculty>
  implements ISipDataService<IFaculty>
{
  async getModel(id: string): Promise<IFaculty | ApiError> {
    const faculty = await this.findOne(id);

    if (!faculty)
      return <ApiError>{
        error: "The faculty with the given id cannot be found.",
        errorCode: 404,
      };

    return faculty;
  }
  async getAllModel(): Promise<ApiError | IFaculty[]> {
    const facultys = await this.find();

    return facultys;
  }
  async updateModel(
    id: string,
    entity: IFaculty
  ): Promise<IFaculty | ApiError> {
    const faculty = await this.findOne(id);
    if (!faculty)
      return <ApiError>{
        error: "The faculty with the given id cannot be found.",
        errorCode: 404,
      };

    const facId = faculty.FAC_CODE;
    Object.assign(faculty, entity);
    faculty.FAC_CODE = facId;
    await this.save(faculty);

    return faculty;
  }
  async createModel(entity: IFaculty): Promise<IFaculty | ApiError> {
    if (entity.FAC_CODE) {
      return <ApiError>{
        error: "You cannot specify the ID field during faculty creation!",
        errorCode: 400,
      };
    }

    const facultys = await this.find();

    const ids = facultys
      .map((fac) => Number.parseInt(fac.FAC_CODE.substring(4), 10))
      .filter((numb) => typeof numb == "number" && numb);

    let maxId = -1;
    if (ids.length == 0) {
      maxId = 0;
    } else {
      maxId = Math.max(...ids);
    }

    const nextfacultyId = maxId + 1;

    let facultyIdString = "Fac_" + nextfacultyId;

    const faculty = new Faculty();
    Object.assign(faculty, entity);

    faculty.FAC_CODE = facultyIdString;

    await this.save(faculty);
    const returnItem = (await this.findOne(facultyIdString)) as IFaculty;

    return returnItem;
  }
  async deleteModel(id: string): Promise<IFaculty | ApiError> {
    const faculty = await this.findOne(id);
    if (!faculty)
      return <ApiError>{
        error: "The faculty with the given id cannot be found.",
        errorCode: 404,
      };

    await this.delete(id);

    return faculty;
  }
}
