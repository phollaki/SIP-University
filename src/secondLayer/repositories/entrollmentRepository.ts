import ISipDataService from 'src/dataLayer/dataservice';
import IEnrollment from 'src/dataLayer/models/enrollment';
import ApiError from 'src/dataLayer/models/error';
import { EntityRepository, Repository } from 'typeorm';

import { Injectable } from '@tsed/di';

import Enrollment from '../entity/enrollment';

@Injectable()
@EntityRepository(Enrollment)
export class DbEnrollmentRepository
  extends Repository<Enrollment>
  implements ISipDataService<IEnrollment>
{
  async getModel(id: string): Promise<IEnrollment | ApiError> {
    const split = id.split("$");

    const enrollment = await this.findOne({
      where: { STU_ID: split[0], CRS_CODE: split[1] },
    });

    if (!enrollment)
      return <ApiError>{
        error: "The enrollment with the given id cannot be found.",
        errorCode: 404,
      };

    return enrollment;
  }
  async getAllModel(): Promise<ApiError | IEnrollment[]> {
    const enrollments = await this.find();

    return enrollments;
  }
  async updateModel(
    id: string,
    entity: IEnrollment
  ): Promise<IEnrollment | ApiError> {
    const split = id.split("$");

    const enrollment = await this.findOne({
      where: { STU_ID: split[0], CRS_CODE: split[1] },
    });

    if (!enrollment)
      return <ApiError>{
        error: "The enrollment with the given id cannot be found.",
        errorCode: 404,
      };

    const matches = await this.find({
      where: { CRS_CODE: entity.CRS_CODE, STU_ID: entity.STU_ID },
    });

    if (matches.length > 0) {
      return <ApiError>{
        error: "There is already an enrollment describing this relation!",
        errorCode: 400,
      };
    }

    Object.assign(enrollment, entity);

    await this.save(enrollment);

    return enrollment;
  }
  async createModel(entity: IEnrollment): Promise<IEnrollment | ApiError> {
    if (!entity.CRS_CODE || !entity.STU_ID) {
      return <ApiError>{
        error:
          "You must specify the crs_code and stu_id for enrollment creation!",
        errorCode: 400,
      };
    }

    const matches = await this.find({
      where: { CRS_CODE: entity.CRS_CODE, STU_ID: entity.STU_ID },
    });

    if (matches.length > 0) {
      return <ApiError>{
        error: "There is already an enrollment describing this relation!",
        errorCode: 400,
      };
    }

    const enrollment = new Enrollment();
    enrollment.CRS_CODE = entity.CRS_CODE;
    enrollment.STU_ID = entity.STU_ID;

    await this.save(enrollment);

    return enrollment;
  }
  async deleteModel(id: string): Promise<IEnrollment | ApiError> {
    const split = id.split("$");

    const enrollment = await this.findOne({
      where: { STU_ID: split[0], CRS_CODE: split[1] },
    });
    if (!enrollment)
      return <ApiError>{
        error: "The enrollment relation cannot be found.",
        errorCode: 404,
      };

    await this.delete(id);

    return enrollment;
  }
}
