import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
try {
  const appPort = process.env.APPPORT || 9008;
  const app = express();

  app.use(cors());
  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.status(200).json({
      message: "Message History Service!",
      statusMessage: "Authorized ",
    });
  });

  app.listen(appPort, (err) => {
    if (err) {
      console.error(
        "Error occurred while starting the Message History Service!",
        err
      );
    } else {
      console.log(
        `✅ Message History Service is running at http://localhost:${appPort}`
      );
    }
  });
} catch (err) {
  console.error("❌ Caught error while initializing server:", err);
  process.exit(1); // Properly exit the app if needed
}
