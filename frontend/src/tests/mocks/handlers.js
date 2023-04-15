import { rest } from "msw";

export const handlers = [
    rest.get("http://localhost:4000/api/sign-in", (req, res, ctx) => {
      return res(
        ctx.json({
            isAdmin: true,
            token: "fake123token",
        })
      );
    }),
  
    rest.get("http://localhost:3030//api/sign-up", (req, res, ctx) => {
      return res(
        ctx.json({
            isAdmin: true,
            token: "fake123token",
        })
      );
    }),
  ];
