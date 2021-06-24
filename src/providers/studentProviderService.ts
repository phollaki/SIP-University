import ISipDataService from 'src/dataLayer/dataservice';
import { DbStudentProvider } from 'src/secondLayer/providers/dbStudentProvider';
import { HttpStudentProvider } from 'src/thirdLayer/httpDataProvider';

import { Injectable } from '@tsed/di';

@Injectable()
export class StudentProviderService {
  private currentProvider: ISipDataService<IStudent>;

  constructor(private httpStudent: HttpStudentProvider) {
    this.currentProvider = this.httpStudent;
  }

  public changeProvider(provider: ISipDataService<IStudent>) {
    this.currentProvider = provider;
  }

  public getProvider() {
    return this.currentProvider;
  }
}
