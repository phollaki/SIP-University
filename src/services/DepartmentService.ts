import ISipDataService from 'src/dataLayer/dataservice';
import IDepartment from 'src/dataLayer/models/department';
import { DepartmentProviderService } from 'src/providers/departmentProviderService';

import { Injectable } from '@tsed/di';

@Injectable()
export class DepartmentService {
  provider: DepartmentProviderService;
  service: ISipDataService<IDepartment>;

  constructor(provider: DepartmentProviderService) {
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
  updateOne(id: string, entity: IDepartment) {
    this.service = this.provider.getProvider();
    return this.service.updateModel(id, entity);
  }
  createOne(entity: IDepartment) {
    this.service = this.provider.getProvider();
    return this.service.createModel(entity);
  }
}
