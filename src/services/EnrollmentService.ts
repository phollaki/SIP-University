import ISipDataService from 'src/dataLayer/dataservice';
import IEnrollment from 'src/dataLayer/models/enrollment';
import { EnrollmentProviderService } from 'src/providers/enrollmentProviderService';

import { Injectable } from '@tsed/di';

@Injectable()
export class EnrollmentService {
  provider: EnrollmentProviderService;
  service: ISipDataService<IEnrollment>;

  constructor(provider: EnrollmentProviderService) {
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
  updateOne(id: string, entity: IEnrollment) {
    this.service = this.provider.getProvider();
    return this.service.updateModel(id, entity);
  }
  createOne(entity: IEnrollment) {
    this.service = this.provider.getProvider();
    return this.service.createModel(entity);
  }
}
