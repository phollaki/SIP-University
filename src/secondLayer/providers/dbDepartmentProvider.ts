import ISipDataService from 'src/dataLayer/dataservice';
import IDepartment from 'src/dataLayer/models/department';
import ApiError from 'src/dataLayer/models/error';
import { Connection } from 'typeorm';

import { Injectable } from '@tsed/di';
import { TypeORMService } from '@tsed/typeorm';

import { DbDepartmentRepository } from '../repositories/departmentRepository';

@Injectable()
export class DbDepartmentProvider implements ISipDataService<IDepartment> {
  private connection: Connection;
  private repo: DbDepartmentRepository;

  constructor(private typeORMService: TypeORMService) {
    this.connection = this.typeORMService.get("sip")!;
    this.repo = this.connection.getCustomRepository(DbDepartmentRepository);
  }
  getModel(id: string): Promise<IDepartment | ApiError> {
    return this.repo.getModel(id);
  }
  getAllModel(): Promise<ApiError | IDepartment[]> {
    return this.repo.getAllModel();
  }
  updateModel(
    id: string,
    entity: IDepartment
  ): Promise<IDepartment | ApiError> {
    return this.repo.updateModel(id, entity);
  }
  createModel(entity: IDepartment): Promise<IDepartment | ApiError> {
    return this.repo.createModel(entity);
  }
  deleteModel(id: string): Promise<IDepartment | ApiError> {
    return this.repo.deleteModel(id);
  }
}
