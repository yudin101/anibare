import app from "./app";
import env from "./config/env.config";

const startServer = async (): Promise<void> => {
  try {
    const PORT = env.SERVER_PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Listening on port: ${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

startServer();
