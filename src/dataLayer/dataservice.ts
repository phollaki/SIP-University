import ApiError from './models/error';

export default interface ISipDataService<T extends IModel> {
  getModel(id: string): Promise<T | ApiError>;
  getAllModel(): Promise<T[] | ApiError>;
  updateModel(id: string, entity: T): Promise<T | ApiError>;
  createModel(entity: T): Promise<T | ApiError>;
  deleteModel(id: string): Promise<T | ApiError>;
}
