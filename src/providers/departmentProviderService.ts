import ISipDataService from 'src/dataLayer/dataservice';
import IDepartment from 'src/dataLayer/models/department';
import { DbDepartmentProvider } from 'src/secondLayer/providers/dbDepartmentProvider';

import { Injectable } from '@tsed/di';

@Injectable()
export class DepartmentProviderService {
  private currentProvider: ISipDataService<IDepartment>;

  constructor(private dbRepo: DbDepartmentProvider) {
    this.currentProvider = this.dbRepo;
  }

  public changeProvider(provider: ISipDataService<IDepartment>) {
    this.currentProvider = provider;
  }

  public getProvider() {
    return this.currentProvider;
  }
}
