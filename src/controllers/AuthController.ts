import axios from 'axios';
import { Request, Response } from 'express';
import { LoggedInMiddleware } from 'src/middlewares/userMiddlewares';

import { Controller, Get, Post, Req, Res, UseBefore } from '@tsed/common';

@Controller("/auth")
export class AuthController {
  @Post("/login")
  async loginUser(@Req() req: Request, @Res() res: Response) {
    const { username, password, captcha } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "You must specify the username and password!" });
    }

    try {
      const response = await axios.post(
        process.env.AUTH_SERVICE_URL + "/auth/login",
        { username, password }
      );
      if (response.status === 200) return res.json(response.data);
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

  @UseBefore(LoggedInMiddleware)
  @Get("/current")
  async currentUser(@Req() req: Request, @Res() res: Response) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Invalid auth headers!" });
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
      return res.status(response.status).json(response.data);
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
