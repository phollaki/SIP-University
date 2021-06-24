import { Injectable } from '@tsed/di';
import ISipDataService from 'src/dataLayer/dataservice';
import IEnrollment from 'src/dataLayer/models/enrollment';
import { DbEnrollmentProvider } from 'src/secondLayer/providers/dbEnrollmentProvider';


@Injectable()
export class EnrollmentProviderService {
  private currentProvider: ISipDataService<IEnrollment>;

  constructor(private dbRepo: DbEnrollmentProvider) {
    this.currentProvider = this.dbRepo;
  }

  public changeProvider(provider: ISipDataService<IEnrollment>) {
    this.currentProvider = provider;
  }

  public getProvider() {
    return this.currentProvider;
  }
}
