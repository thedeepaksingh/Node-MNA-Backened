import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
try {
  const appPort = process.env.APPPORT || 9003;
  const app = express();

  app.use(cors());
  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.status(200).json({
      message: "Auth Service!",
      statusMessage: "Authorized ",
    });
  });

  app.listen(appPort, (err) => {
    if (err) {
      console.error("Error occurred while starting the Auth Service!", err);
    } else {
      console.log(`✅ Auth Service is running at http://localhost:${appPort}`);
    }
  });
} catch (err) {
  console.error("❌ Caught error while initializing server:", err);
  process.exit(1); // Properly exit the app if needed
}
