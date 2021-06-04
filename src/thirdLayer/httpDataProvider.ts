import axios, { AxiosInstance } from 'axios';
import { Request } from 'express';

import { Injectable, Service } from '@tsed/di';

import ISipDataService from '../dataLayer/dataservice';
import ICourse from '../dataLayer/models/course';
import ApiError from '../dataLayer/models/error';

@Injectable()
export class HttpStudentProvider implements ISipDataService<IStudent> {
  getModel(id: string): Promise<IStudent | ApiError> {
    throw new Error("Method not implemented.");
  }
  getAllModel(): Promise<ApiError | IStudent[]> {
    throw new Error("Method not implemented.");
  }
  updateModel(id: string, entity: IStudent): Promise<IStudent | ApiError> {
    throw new Error("Method not implemented.");
  }
  createModel(entity: IStudent): Promise<IStudent | ApiError> {
    throw new Error("Method not implemented.");
  }
  deleteModel(id: string): Promise<IStudent | ApiError> {
    throw new Error("Method not implemented.");
  }
}

@Injectable()
export class HttpCourseProvider implements ISipDataService<ICourse> {
  async getModel(id: string): Promise<ICourse | ApiError> {
    try {
      const response = await axios.get(
        process.env.COURSE_SERVICE_URL + "/courses/" + id
      );
      const { result } = response.data;
      return result;
    } catch (err) {
      let errMessage = "";
      let errCode = 503;
      if (err.response) {
        errMessage = err.response.data.error;
        errCode = err.response.status;
      } else {
        errMessage = "Cannot access the backend service.";
      }
      return <ApiError>{ error: errMessage, errorCode: errCode };
    }
  }
  async getAllModel(): Promise<ApiError | ICourse[]> {
    try {
      const response = await axios.get(
        process.env.COURSE_SERVICE_URL + "/courses"
      );
      const { result } = response.data;
      return result;
    } catch (err) {
      let errMessage = "";
      let errCode = 503;
      if (err.response) {
        errMessage = err.response.data.error;
        errCode = err.response.status;
      } else {
        errMessage = "Cannot access the backend service.";
      }
      return <ApiError>{ error: errMessage, errorCode: errCode };
    }
  }
  async updateModel(id: string, entity: ICourse): Promise<ICourse | ApiError> {
    try {
      const response = await axios.put(
        process.env.COURSE_SERVICE_URL + "/courses/" + id,
        entity
      );
      const { result } = response.data;
      return result;
    } catch (err) {
      let errMessage = "";
      let errCode = 503;
      if (err.response) {
        errMessage = err.response.data.error;
        errCode = err.response.status;
      } else {
        errMessage = "Cannot access the backend service.";
      }
      return <ApiError>{ error: errMessage, errorCode: errCode };
    }
  }
  async createModel(entity: ICourse): Promise<ICourse | ApiError> {
    try {
      const response = await axios.post(
        process.env.COURSE_SERVICE_URL + "/courses",
        entity
      );
      const { result } = response.data;
      return result;
    } catch (err) {
      let errMessage = "";
      let errCode = 503;
      if (err.response) {
        errMessage = err.response.data.error;
        errCode = err.response.status;
      } else {
        errMessage = "Cannot access the backend service.";
      }
      return <ApiError>{ error: errMessage, errorCode: errCode };
    }
  }
  async deleteModel(id: string): Promise<ICourse | ApiError> {
    try {
      const response = await axios.delete(
        process.env.COURSE_SERVICE_URL + "/courses/" + id
      );
      const { result } = response.data;
      return result;
    } catch (err) {
      let errMessage = "";
      let errCode = 503;
      if (err.response) {
        errMessage = err.response.data.error;
        errCode = err.response.status;
      } else {
        errMessage = "Cannot access the backend service.";
      }
      return <ApiError>{ error: errMessage, errorCode: errCode };
    }
  }
}
