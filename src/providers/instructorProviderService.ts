import ISipDataService from 'src/dataLayer/dataservice';
import IInstructor from 'src/dataLayer/models/instructor';
import { DbInstructorProvider } from 'src/secondLayer/providers/dbInstructorProvider';

import { Injectable } from '@tsed/di';

@Injectable()
export class InstructorProviderService {
  private currentProvider: ISipDataService<IInstructor>;

  constructor(private dbRepo: DbInstructorProvider) {
    this.currentProvider = this.dbRepo;
  }

  public changeProvider(provider: ISipDataService<IInstructor>) {
    this.currentProvider = provider;
  }

  public getProvider() {
    return this.currentProvider;
  }
}
