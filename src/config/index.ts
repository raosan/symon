import dotenv from "dotenv";

dotenv.config();

interface Config {
  env: string;
  port: string;
}

export const cfg: Config = {
  env: process.env.NODE_ENV || "production",
  port: process.env.PORT || "8080",
};
