import ISipDataService from 'src/dataLayer/dataservice';
import IEnrollment from 'src/dataLayer/models/enrollment';
import ApiError from 'src/dataLayer/models/error';
import { Connection } from 'typeorm';

import { Injectable } from '@tsed/di';
import { TypeORMService } from '@tsed/typeorm';

import { DbEnrollmentRepository } from '../repositories/entrollmentRepository';

@Injectable()
export class DbEnrollmentProvider implements ISipDataService<IEnrollment> {
  private connection: Connection;
  private repo: DbEnrollmentRepository;

  constructor(private typeORMService: TypeORMService) {
    this.connection = this.typeORMService.get("sip")!;
    this.repo = this.connection.getCustomRepository(DbEnrollmentRepository);
  }
  getModel(id: string): Promise<IEnrollment | ApiError> {
    return this.repo.getModel(id);
  }
  getAllModel(): Promise<ApiError | IEnrollment[]> {
    return this.repo.getAllModel();
  }
  updateModel(
    id: string,
    entity: IEnrollment
  ): Promise<IEnrollment | ApiError> {
    return this.repo.updateModel(id, entity);
  }
  createModel(entity: IEnrollment): Promise<IEnrollment | ApiError> {
    return this.repo.createModel(entity);
  }
  deleteModel(id: string): Promise<IEnrollment | ApiError> {
    return this.repo.deleteModel(id);
  }
}
