import ISipDataService from 'src/dataLayer/dataservice';
import ICourse from 'src/dataLayer/models/course';
import IDepartment from 'src/dataLayer/models/department';
import ApiError from 'src/dataLayer/models/error';
import { EntityRepository, Repository } from 'typeorm';

import { Injectable } from '@tsed/di';

import Department from '../entity/department';

@Injectable()
@EntityRepository(Department)
export class DbDepartmentRepository
  extends Repository<Department>
  implements ISipDataService<IDepartment>
{
  async getModel(id: string): Promise<IDepartment | ApiError> {
    const department = await this.findOne(id);

    if (!department)
      return <ApiError>{
        error: "The department with the given id cannot be found.",
        errorCode: 404,
      };

    return department;
  }
  async getAllModel(): Promise<ApiError | IDepartment[]> {
    const departments = await this.find();

    return departments;
  }
  async updateModel(
    id: string,
    entity: IDepartment
  ): Promise<IDepartment | ApiError> {
    const department = await this.findOne(id);
    if (!department)
      return <ApiError>{
        error: "The department with the given id cannot be found.",
        errorCode: 404,
      };

    const dpId = department.DEP_CODE;
    Object.assign(department, entity);
    department.DEP_CODE = dpId;
    await this.save(department);

    return department;
  }
  async createModel(entity: IDepartment): Promise<IDepartment | ApiError> {
    if (entity.DEP_CODE) {
      return <ApiError>{
        error: "You cannot specify the ID field during department creation!",
        errorCode: 400,
      };
    }

    const departments = await this.find();

    const ids = departments
      .map((dep) => Number.parseInt(dep.DEP_CODE.substring(1), 10))
      .filter((numb) => typeof numb == "number" && numb);

    let maxId = -1;
    if (ids.length == 0) {
      maxId = 0;
    } else {
      maxId = Math.max(...ids);
    }

    const nextdepartmentId = maxId + 1;

    let departmentIdString = "d" + nextdepartmentId;

    const department = new Department();
    Object.assign(department, entity);

    department.DEP_CODE = departmentIdString;

    await this.save(department);
    const returnItem = (await this.findOne(departmentIdString)) as IDepartment;

    return returnItem;
  }
  async deleteModel(id: string): Promise<IDepartment | ApiError> {
    const department = await this.findOne(id);
    if (!department)
      return <ApiError>{
        error: "The department with the given id cannot be found.",
        errorCode: 404,
      };

    await this.delete(id);

    return department;
  }
}
