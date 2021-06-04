import ISipDataService from 'src/dataLayer/dataservice';
import ApiError from 'src/dataLayer/models/error';
import ILocation from 'src/dataLayer/models/location';
import { Connection } from 'typeorm';

import { Injectable } from '@tsed/di';
import { TypeORMService } from '@tsed/typeorm';

import { DbLocationRepository } from '../repositories/locationRepository';

@Injectable()
export class DbLocationProvider implements ISipDataService<ILocation> {
  private connection: Connection;
  private repo: DbLocationRepository;

  constructor(private typeORMService: TypeORMService) {
    this.connection = this.typeORMService.get("sip")!;
    this.repo = this.connection.getCustomRepository(DbLocationRepository);
  }
  getModel(id: string): Promise<ILocation | ApiError> {
    return this.repo.getModel(id);
  }
  getAllModel(): Promise<ApiError | ILocation[]> {
    return this.repo.getAllModel();
  }
  updateModel(id: string, entity: ILocation): Promise<ILocation | ApiError> {
    return this.repo.updateModel(id, entity);
  }
  createModel(entity: ILocation): Promise<ILocation | ApiError> {
    return this.repo.createModel(entity);
  }
  deleteModel(id: string): Promise<ILocation | ApiError> {
    return this.repo.deleteModel(id);
  }
}
