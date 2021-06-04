import ISipDataService from 'src/dataLayer/dataservice';
import ILocation from 'src/dataLayer/models/location';
import { LocationProviderService } from 'src/providers/locationProviderService';

import { Injectable } from '@tsed/di';

@Injectable()
export class LocationService {
  provider: LocationProviderService;
  service: ISipDataService<ILocation>;

  constructor(provider: LocationProviderService) {
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
  updateOne(id: string, entity: ILocation) {
    this.service = this.provider.getProvider();
    return this.service.updateModel(id, entity);
  }
  createOne(entity: ILocation) {
    this.service = this.provider.getProvider();
    return this.service.createModel(entity);
  }
}
