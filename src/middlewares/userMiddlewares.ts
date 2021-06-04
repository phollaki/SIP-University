import axios from 'axios';

import { Context, IMiddleware, Middleware, Next, Req, Res } from '@tsed/common';

@Middleware()
export class LoggedInMiddleware implements IMiddleware {
  async use(
    @Req() req: Req,
    @Res() res: Res,
    @Context() ctx: Context,
    @Next() next: Next
  ) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Invalid auth header!" });
    }
    try {
      const response = await axios.get(
        process.env.AUTH_SERVICE_URL + "/auth/current",
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );
      ctx.set("user", response.data);
      ctx.set("jwt", authHeader.split(" ")[1]);
      next();
    } catch (err) {
      console.log(err.message);
      if (err.response) {
        return res.status(err.response.status).json(err.response.data);
      } else {
        return res
          .status(503)
          .json({ error: "Couldnt reach the authentication server." });
      }
    }
  }
}
