import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { User, Company } from "@prisma/client";
import client from "./client";
import {
  getTokens,
  setNewUserTokens,
  refreshCookieOptions,
  removeUserTokens,
  getTokenFromAuthorizationHeader,
  getUserByToken,
} from "./tokens";

const router: Router = express.Router();

router.post("/sign-up", async (req: Request, res: Response) => {
  const { username, password, companyName } = req.body;

  if (!username || !password || !companyName) {
    return res.status(400).send("Invalid request body");
  }

  if (await client.company.findUnique({ where: { name: companyName } })) {
    return res
      .status(400)
      .send(`Company already exists with name ${companyName}`);
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const company: Company = await client.company.create({
    data: { name: companyName },
  });

  const user: User = await client.user.create({
    data: {
      username,
      password: encryptedPassword,
      isAdmin: true,
      companyId: company.id,
    },
  });

  const [token, refreshToken] = getTokens();

  await setNewUserTokens(user, token, refreshToken);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  res.status(201).send({ token, isAdmin: user.isAdmin });
});

router.post("/sign-in", async (req: Request, res: Response) => {
  const { username, password, companyName } = req.body;

  if (!username || !password || !companyName) {
    return res.status(400).send("Invalid request body");
  }

  const user: User | null = await client.user.findFirst({
    where: {
      AND: [
        {
          company: {
            name: companyName,
          },
        },
        {
          username,
        },
      ],
    },
  });

  if (user == null)
    return res.status(401).send("Invalid company name, username or password");

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword)
    return res.status(401).send("Invalid company name, username or password");

  const [token, refreshToken] = getTokens();

  await setNewUserTokens(user, token, refreshToken);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  res.status(200).send({ token, isAdmin: user.isAdmin });
});

router.post("/logout", async (req: Request, res: Response) => {
  const token = getTokenFromAuthorizationHeader(req.headers.authorization);

  await removeUserTokens(token, req.cookies["refreshToken"]);

  res.clearCookie("refreshToken");

  res.status(200).send();
});

router.post("/add-user", async (req: Request, res: Response) => {
  const currentToken = getTokenFromAuthorizationHeader(req.headers.authorization);

  const user = await getUserByToken(currentToken, req.cookies["refreshToken"]);

  if (!user || !user.isAdmin) {
    res.clearCookie("refreshToken");
    return res.status(403).send();
  }

  const { username, password, isAdmin } = req.body;

  if (!username || !password) {
    return res.status(400).send("Invalid request body");
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  await client.user.create({
    data: {
      username,
      password: encryptedPassword,
      isAdmin,
      companyId: user.companyId,
    },
  });

  const [token, refreshToken] = getTokens();

  await setNewUserTokens(user, token, refreshToken);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  res.status(201).send({ token });
});

router.post("/add-message", async (req: Request, res: Response) => {
  const currentToken = getTokenFromAuthorizationHeader(req.headers.authorization);

  const user = await getUserByToken(currentToken, req.cookies["refreshToken"]);

  if (!user || user.isAdmin) {
    res.clearCookie("refreshToken");
    return res.status(403).send();
  }

  const { content } = req.body;

  if (!content) return res.status(400).send("Invalid request body");

  await client.message.create({
    data: {
      userId: user.id,
      content,
    },
  });

  const [token, refreshToken] = getTokens();

  await setNewUserTokens(user, token, refreshToken);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  res.status(201).send({ token });
});

router.get(
  "/get-users-and-messages",
  async (req: Request, res: Response) => {
    const currentToken = getTokenFromAuthorizationHeader(req.headers.authorization);

    const user = await getUserByToken(currentToken, req.cookies["refreshToken"]);

    if (!user || !user.isAdmin) {
      res.clearCookie("refreshToken");
      return res.status(403).send();
    }

    const usersWithMessages: {
      username: string;
      Message: { content: string }[];
    }[] = await client.user.findMany({
      where: {
        companyId: user.companyId,
        isAdmin: false,
      },
      select: {
        username: true,
        Message: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            content: true,
          },
          take: 3,
        },
      },
    });

    const [token, refreshToken] = getTokens();

    await setNewUserTokens(user, token, refreshToken);

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.status(200).send({ token, usersWithMessages });
  }
);

export default router;
