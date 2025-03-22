import { Express } from "express";

//Database and express app running by one function
export const appConfigWithDb = async (app: Express) => {
  const port = process.env.PORT || 3000;
  const serverUrl: string = process.env.BASE_URL as string;
  try {
    app.listen(port, () => {
      console.log(`Server running on: ${serverUrl}:${port}`);
    });
  } catch (error) {
    throw new Error("Internel Server Eror");
  }
};
