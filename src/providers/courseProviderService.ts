import ISipDataService from 'src/dataLayer/dataservice';
import ICourse from 'src/dataLayer/models/course';
import { DbCourseProvider } from 'src/secondLayer/providers/dbCourseProvider';

import { Injectable } from '@tsed/di';

@Injectable()
export class CourseProviderService {
  private currentProvider: ISipDataService<ICourse>;

  constructor(private dbRepo: DbCourseProvider) {
    this.currentProvider = this.dbRepo;
  }

  public changeProvider(provider: ISipDataService<ICourse>) {
    this.currentProvider = provider;
  }

  public getProvider() {
    return this.currentProvider;
  }
}
