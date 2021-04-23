import axios from "axios";
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "RecaptchaValidator", async: true })
export class RecapthchaValidator implements ValidatorConstraintInterface {
  async validate(token: string, args: ValidationArguments) {
    try {
      if (process.env.NODE_ENV === "development") return true;

      var res = await axios.post<{ success: true | false }>(
        "https://www.google.com/recaptcha/api/siteverify",
        { response: token, secret: process.env.RECAPTCHA_V3_SECRET_KEY }
      );
      const { data } = res;
      return data.success;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return "A Recaptcha eredménye érvénytelen. Próbálja újra!~status~401";
  }
}
