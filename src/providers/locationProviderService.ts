import ISipDataService from 'src/dataLayer/dataservice';
import ILocation from 'src/dataLayer/models/location';
import { DbLocationProvider } from 'src/secondLayer/providers/dbLocationProvider';

import { Injectable } from '@tsed/di';

@Injectable()
export class LocationProviderService {
  private currentProvider: ISipDataService<ILocation>;

  constructor(private dbRepo: DbLocationProvider) {
    this.currentProvider = this.dbRepo;
  }

  public changeProvider(provider: ISipDataService<ILocation>) {
    this.currentProvider = provider;
  }

  public getProvider() {
    return this.currentProvider;
  }
}
