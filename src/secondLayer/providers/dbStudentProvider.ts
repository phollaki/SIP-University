import ISipDataService from 'src/dataLayer/dataservice';
import ApiError from 'src/dataLayer/models/error';
import { Connection } from 'typeorm';

import { Injectable } from '@tsed/di';
import { TypeORMService } from '@tsed/typeorm';

import { DbStudentRepository } from '../repositories/studentRepository';

@Injectable()
export class DbStudentProvider implements ISipDataService<IStudent> {
  private connection: Connection;
  private repo: DbStudentRepository;

  constructor(private typeORMService: TypeORMService) {
    this.connection = this.typeORMService.get("sip")!;
    this.repo = this.connection.getCustomRepository(DbStudentRepository);
  }
  getModel(id: string): Promise<IStudent | ApiError> {
    return this.repo.getModel(id);
  }
  getAllModel(): Promise<ApiError | IStudent[]> {
    return this.repo.getAllModel();
  }
  updateModel(id: string, entity: IStudent): Promise<IStudent | ApiError> {
    return this.repo.updateModel(id, entity);
  }
  createModel(entity: IStudent): Promise<IStudent | ApiError> {
    return this.repo.createModel(entity);
  }
  deleteModel(id: string): Promise<IStudent | ApiError> {
    return this.repo.deleteModel(id);
  }
}
