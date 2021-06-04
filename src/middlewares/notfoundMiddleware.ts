import { Request, Response } from 'express';

import { Err, IMiddleware, Middleware, Next, Req, Res } from '@tsed/common';

@Middleware()
export class NotFoundHandlerMiddleware implements IMiddleware {
  use(@Req() req: Request, @Res() res: Response) {
    return res
      .status(404)
      .json({ error: "The requested resource cannot be found." });
  }
}
