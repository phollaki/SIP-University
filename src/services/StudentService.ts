import ISipDataService from 'src/dataLayer/dataservice';
import { StudentProviderService } from 'src/providers/studentProviderService';

import { Injectable } from '@tsed/di';

@Injectable()
export class StudentService {
  provider: StudentProviderService;
  service: ISipDataService<IStudent>;

  constructor(provider: StudentProviderService) {
    this.provider = provider;
  }

  getAll() {
    this.service = this.provider.getProvider();
    return this.service.getAllModel();
  }
  getOne(id: string) {
    this.service = this.provider.getProvider();
    return this.service.getModel(id);
  }
  deleteOne(id: string) {
    this.service = this.provider.getProvider();
    return this.service.deleteModel(id);
  }
  updateOne(id: string, entity: IStudent) {
    this.service = this.provider.getProvider();
    return this.service.updateModel(id, entity);
  }
  createOne(entity: IStudent) {
    this.service = this.provider.getProvider();
    return this.service.createModel(entity);
  }
}
