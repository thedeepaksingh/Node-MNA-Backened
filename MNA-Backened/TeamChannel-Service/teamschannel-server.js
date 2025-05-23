import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
try {
  const appPort = process.env.APPPORT || 9012;
  const app = express();

  app.use(cors());
  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.status(200).json({
      message: "Teams Channel Service!",
      statusMessage: "Authorized ",
    });
  });

  app.listen(appPort, (err) => {
    if (err) {
      console.error(
        "Error occurred while starting the Teams Channel server!",
        err
      );
    } else {
      console.log(
        `✅ Teams Channel Server is running at http://localhost:${appPort}`
      );
    }
  });
} catch (err) {
  console.error("❌ Caught error while initializing server:", err);
  process.exit(1); // Properly exit the app if needed
}
