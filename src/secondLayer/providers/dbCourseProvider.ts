import ISipDataService from 'src/dataLayer/dataservice';
import ICourse from 'src/dataLayer/models/course';
import ApiError from 'src/dataLayer/models/error';
import { Connection } from 'typeorm';

import { Injectable } from '@tsed/di';
import { TypeORMService } from '@tsed/typeorm';

import { DbCourseRepository } from '../repositories/courseRepository';

@Injectable()
export class DbCourseProvider implements ISipDataService<ICourse> {
  private connection: Connection;
  private repo: DbCourseRepository;

  constructor(private typeORMService: TypeORMService) {
    this.connection = this.typeORMService.get("sip")!;
    this.repo = this.connection.getCustomRepository(DbCourseRepository);
  }
  getModel(id: string): Promise<ICourse | ApiError> {
    return this.repo.getModel(id);
  }
  getAllModel(): Promise<ApiError | ICourse[]> {
    return this.repo.getAllModel();
  }
  updateModel(id: string, entity: ICourse): Promise<ICourse | ApiError> {
    return this.repo.updateModel(id, entity);
  }
  createModel(entity: ICourse): Promise<ICourse | ApiError> {
    return this.repo.createModel(entity);
  }
  deleteModel(id: string): Promise<ICourse | ApiError> {
    return this.repo.deleteModel(id);
  }
}
