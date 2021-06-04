import ISipDataService from 'src/dataLayer/dataservice';
import IFaculty from 'src/dataLayer/models/faculty';
import { FacultyProviderService } from 'src/providers/facultyProviderService';

import { Injectable } from '@tsed/di';

@Injectable()
export class FacultyService {
  provider: FacultyProviderService;
  service: ISipDataService<IFaculty>;

  constructor(provider: FacultyProviderService) {
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
  updateOne(id: string, entity: IFaculty) {
    this.service = this.provider.getProvider();
    return this.service.updateModel(id, entity);
  }
  createOne(entity: IFaculty) {
    this.service = this.provider.getProvider();
    return this.service.createModel(entity);
  }
}
