import { validate, ValidationError } from "class-validator";
import { Service } from "typedi";
import ApiError from "../responses/error-response";
import IValidable from "../requestModels/base-request";

@Service()
class ValidatorService {
  public isInvalid(candidate: any | ApiError): candidate is ApiError {
    console.log(candidate);
    return (candidate as ApiError).error !== undefined;
  }

  async validate(candidate: IValidable): Promise<true | ApiError> {
    const res = await validate(candidate);
    if (res.length == 0) return true;
    const value = Object["values"](res[0].constraints)[0];

    const valueSplit = value.split("~status~");
    let message;
    let statusCode = 400;
    if (valueSplit && valueSplit.length == 2 && Number(valueSplit[1]) !== NaN) {
      message = valueSplit[0];
      statusCode = Number(valueSplit[1]);
    } else {
      message = value;
    }
    return <ApiError>{ error: message, statusCode };
  }
}

export default ValidatorService;
