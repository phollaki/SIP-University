import ISipDataService from 'src/dataLayer/dataservice';
import ICourse from 'src/dataLayer/models/course';
import { CourseProviderService } from 'src/providers/courseProviderService';
import { Inject, Service } from 'typedi';

import { Injectable } from '@tsed/di';

@Injectable()
export class CourseService {
  provider: CourseProviderService;
  service: ISipDataService<ICourse>;

  constructor(provider: CourseProviderService) {
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
  updateOne(id: string, entity: ICourse) {
    this.service = this.provider.getProvider();
    return this.service.updateModel(id, entity);
  }
  createOne(entity: ICourse) {
    this.service = this.provider.getProvider();
    return this.service.createModel(entity);
  }
}
