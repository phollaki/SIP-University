import "reflect-metadata";
import {
  createExpressServer,
  useContainer as useContainerForRouting,
} from "routing-controllers";
import { Container } from "typedi";
import { config } from "dotenv-flow";
import { createConnection, useContainer as useContainerForOrm } from "typeorm";
import bodyParser from "body-parser";

config();
useContainerForRouting(Container);
useContainerForOrm(Container);

createConnection()
  .then(async (connection) => {
    const expressApp = createExpressServer({
      cors: {
        origin: "*",
      },
      validation: false,
      defaultErrorHandler: false,
      controllers: [__dirname + "/controllers/*.js"],
      middlewares: [__dirname + "/middlewares/global/*.js"],
    });

    expressApp.use(bodyParser.json());
    expressApp.use(bodyParser.urlencoded({ extended: true }));

    /**
     * Start the express app.
     */
    expressApp.listen(3001);

    console.log("Server is up and running at port 3001");
  })
  .catch((error) => console.log(error));
