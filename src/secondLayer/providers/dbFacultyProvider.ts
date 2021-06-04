import ISipDataService from 'src/dataLayer/dataservice';
import ApiError from 'src/dataLayer/models/error';
import IFaculty from 'src/dataLayer/models/faculty';
import { Connection } from 'typeorm';

import { Injectable } from '@tsed/di';
import { TypeORMService } from '@tsed/typeorm';

import { DbFacultyRepository } from '../repositories/facultyRepository';

@Injectable()
export class DbFacultyProvider implements ISipDataService<IFaculty> {
  private connection: Connection;
  private repo: DbFacultyRepository;

  constructor(private typeORMService: TypeORMService) {
    this.connection = this.typeORMService.get("sip")!;
    this.repo = this.connection.getCustomRepository(DbFacultyRepository);
  }
  getModel(id: string): Promise<IFaculty | ApiError> {
    return this.repo.getModel(id);
  }
  getAllModel(): Promise<ApiError | IFaculty[]> {
    return this.repo.getAllModel();
  }
  updateModel(id: string, entity: IFaculty): Promise<IFaculty | ApiError> {
    return this.repo.updateModel(id, entity);
  }
  createModel(entity: IFaculty): Promise<IFaculty | ApiError> {
    return this.repo.createModel(entity);
  }
  deleteModel(id: string): Promise<IFaculty | ApiError> {
    return this.repo.deleteModel(id);
  }
}
