import ISipDataService from 'src/dataLayer/dataservice';
import ApiError from 'src/dataLayer/models/error';
import IInstructor from 'src/dataLayer/models/instructor';
import { Connection } from 'typeorm';

import { Injectable } from '@tsed/di';
import { TypeORMService } from '@tsed/typeorm';

import { DbInstructorRepository } from '../repositories/instructorRepository';

@Injectable()
export class DbInstructorProvider implements ISipDataService<IInstructor> {
  private connection: Connection;
  private repo: DbInstructorRepository;

  constructor(private typeORMService: TypeORMService) {
    this.connection = this.typeORMService.get("sip")!;
    this.repo = this.connection.getCustomRepository(DbInstructorRepository);
  }
  getModel(id: string): Promise<IInstructor | ApiError> {
    return this.repo.getModel(id);
  }
  getAllModel(): Promise<ApiError | IInstructor[]> {
    return this.repo.getAllModel();
  }
  updateModel(
    id: string,
    entity: IInstructor
  ): Promise<IInstructor | ApiError> {
    return this.repo.updateModel(id, entity);
  }
  createModel(entity: IInstructor): Promise<IInstructor | ApiError> {
    return this.repo.createModel(entity);
  }
  deleteModel(id: string): Promise<IInstructor | ApiError> {
    return this.repo.deleteModel(id);
  }
}
