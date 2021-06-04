import ISipDataService from 'src/dataLayer/dataservice';
import ICourse from 'src/dataLayer/models/course';
import ApiError from 'src/dataLayer/models/error';
import { EntityRepository, Repository } from 'typeorm';

import { Injectable } from '@tsed/di';

import ILocation from '../../dataLayer/models/location';
import Location from '../entity/location';

@Injectable()
@EntityRepository(Location)
export class DbLocationRepository
  extends Repository<Location>
  implements ISipDataService<ILocation>
{
  async getModel(id: string): Promise<ILocation | ApiError> {
    const location = await this.findOne(id);

    if (!location)
      return <ApiError>{
        error: "The location with the given id cannot be found.",
        errorCode: 404,
      };

    return location;
  }
  async getAllModel(): Promise<ApiError | ILocation[]> {
    const locations = await this.find();

    return locations;
  }
  async updateModel(
    id: string,
    entity: ILocation
  ): Promise<ILocation | ApiError> {
    const location = await this.findOne(id);
    if (!location)
      return <ApiError>{
        error: "The location with the given id cannot be found.",
        errorCode: 404,
      };

    const locId = location.LOC_CODE;
    Object.assign(location, entity);
    location.LOC_CODE = locId;
    await this.save(location);

    return location;
  }
  async createModel(entity: ILocation): Promise<ILocation | ApiError> {
    if (entity.LOC_CODE) {
      return <ApiError>{
        error: "You cannot specify the ID field during location creation!",
        errorCode: 400,
      };
    }

    const locations = await this.find();

    const ids = locations
      .map((loc) => Number.parseInt(loc.LOC_CODE.substring(3), 10))
      .filter((numb) => typeof numb == "number" && numb);

    let maxId = -1;
    if (ids.length == 0) {
      maxId = 0;
    } else {
      maxId = Math.max(...ids);
    }

    const nextLocationId = maxId + 1;

    let locationIdString = "loc" + nextLocationId;

    const location = new Location();
    Object.assign(location, entity);

    location.LOC_CODE = locationIdString;

    await this.save(location);
    const returnItem = (await this.findOne(locationIdString)) as ILocation;

    return returnItem;
  }
  async deleteModel(id: string): Promise<ILocation | ApiError> {
    const location = await this.findOne(id);
    if (!location)
      return <ApiError>{
        error: "The location with the given id cannot be found.",
        errorCode: 404,
      };

    await this.delete(id);

    return location;
  }
}
