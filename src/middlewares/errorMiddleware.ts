import { Request, Response } from 'express';

import { Err, IMiddleware, Middleware, Next, Req, Res } from '@tsed/common';

@Middleware()
export class GlobalErrorHandlerMiddleware implements IMiddleware {
  use(
    @Err() err: any,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: Next
  ) {
    return res
      .status(err.status ? parseInt(err.status) : 500)
      .json({ error: err.message });
  }
}
