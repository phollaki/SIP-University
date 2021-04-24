import { IsNotEmpty } from "class-validator";
import IValidable from "./base-request";

export default class LoginModel implements IValidable {
  @IsNotEmpty({
    message: "You must specify a username!~status~422",
  })
  username: string;
  @IsNotEmpty({ message: "You must specify a password!~status~422" })
  password: string;
}
