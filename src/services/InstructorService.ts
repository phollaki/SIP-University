import ISipDataService from 'src/dataLayer/dataservice';
import IInstructor from 'src/dataLayer/models/instructor';
import { InstructorProviderService } from 'src/providers/instructorProviderService';

import { Injectable } from '@tsed/di';

@Injectable()
export class InstructorService {
  provider: InstructorProviderService;
  service: ISipDataService<IInstructor>;

  constructor(provider: InstructorProviderService) {
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
  updateOne(id: string, entity: IInstructor) {
    this.service = this.provider.getProvider();
    return this.service.updateModel(id, entity);
  }
  createOne(entity: IInstructor) {
    this.service = this.provider.getProvider();
    return this.service.createModel(entity);
  }
}
