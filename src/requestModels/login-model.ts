import { IsNotEmpty, Validate, Matches } from "class-validator";
import { RecapthchaValidator } from "../validator/recaptcha-validator";
import IValidable from "./base-request";

export default class LoginModel implements IValidable {
  @IsNotEmpty({
    message: "You must specify a username!~status~422",
  })
  username: string;
  @IsNotEmpty({ message: "You must specify a password!~status~422" })
  password: string;
}
