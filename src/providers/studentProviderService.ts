import ISipDataService from 'src/dataLayer/dataservice';
import { DbStudentProvider } from 'src/secondLayer/providers/dbStudentProvider';

import { Injectable } from '@tsed/di';

@Injectable()
export class StudentProviderService {
  private currentProvider: ISipDataService<IStudent>;

  constructor(private dbStudent: DbStudentProvider) {
    this.currentProvider = this.dbStudent;
  }

  public changeProvider(provider: ISipDataService<IStudent>) {
    this.currentProvider = provider;
  }

  public getProvider() {
    return this.currentProvider;
  }
}
