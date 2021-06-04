import ISipDataService from 'src/dataLayer/dataservice';
import IFaculty from 'src/dataLayer/models/faculty';
import { DbFacultyProvider } from 'src/secondLayer/providers/dbFacultyProvider';

import { Injectable } from '@tsed/di';

@Injectable()
export class FacultyProviderService {
  private currentProvider: ISipDataService<IFaculty>;

  constructor(private dbRepo: DbFacultyProvider) {
    this.currentProvider = this.dbRepo;
  }

  public changeProvider(provider: ISipDataService<IFaculty>) {
    this.currentProvider = provider;
  }

  public getProvider() {
    return this.currentProvider;
  }
}
