// API Post handler
import Prisma from "@prisma/client";
import * as yup from "yup";
const prisma = require("@utils/prismaClient");
const objectIdValidator = require("@utils/objectIdSchema");

export default async function handler(req, res) {
  const method = req.method;
  let validatedParams;

  // Validate params data.
  const schema = yup.object().shape({
    postId: objectIdValidator,
    keyword: yup.string().max(255),
    categoryId: objectIdValidator,
  });

  if (req.query.postId || req.query.keyword || req.query.categoryId) {
    try {
      validatedParams = await schema.validate(req.query);
    } catch (error) {
      return res
        .status(405)
        .end(`Error with the props provided. ` + error.errors[0]);
    }
  }

  if (!validatedParams) {
    switch (method) {
      case "GET":
        try {
          const posts = await prisma.post.findMany();
          prisma.$disconnect;
          if (posts === null) {
            res.status(404).json(`Not found posts.`);
            break;
          }
          res.status(200).json(posts);
        } catch (err) {
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(400).json(`${err}`);
            break;
          }
          res.status(400).json(`${err}`);
          break;
        }
        break;
      case "POST":
        try {
          const posts = await prisma.post.create({
            data: req.body,
          });
          prisma.$disconnect;
          res.status(201).json(posts);
        } catch (err) {
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
              res
                .status(400)
                .json(
                  `Field '${err.meta.target}' already exists and must be unique.`
                );
              break;
            }
            if (err instanceof Prisma.PrismaClientValidationError) {
              res.status(400).json(`Validation error, invalid data inserted.`);
              break;
            }
          }
          res.status(400).json(`${err}`);
          break;
        }
        break;
      default:
        res.status(405).end(`Method ${method} Not Allowed.`);
        break;
    }
  }

  if (validatedParams?.postId) {
    switch (method) {
      case "PATCH":
        try {
          const postId = validatedParams.postId;
          const post = await prisma.post.update({
            where: {
              id: postId,
            },
            data: req.body,
          });
          prisma.$disconnect;
          res.status(200).json(post);
        } catch (err) {
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2025") {
              res.status(404).json(`Post not found.`);
              break;
            }
            if (err instanceof Prisma.PrismaClientValidationError) {
              res.status(400).json(`Validation error, invalid data inserted.`);
              break;
            }
          }
          res.status(400).json(`${err}`);
          break;
        }
        break;
      case "DELETE":
        try {
          const postId = validatedParams.postId;
          const post = await prisma.post.delete({
            where: {
              id: postId,
            },
          });
          prisma.$disconnect;
          res.status(200).json(`Post ${post.id} deleted successfully.`);
        } catch (err) {
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(404).json(`${err.meta.cause}`);
            break;
          }
          res.status(400).json(`${err}`);
          break;
        }
        break;
      default:
        res.status(405).end(`Method ${method} Not Allowed.`);
        break;
    }
  }

  if (validatedParams?.keyword) {
    switch (method) {
      case "GET":
        try {
          const keyword = validatedParams.keyword;
          const posts = await prisma.post.findMany({
            where: {
              OR: [
                {
                  content: {
                    contains: keyword,
                    mode: "insensitive",
                  },
                },
                {
                  title: {
                    contains: keyword,
                    mode: "insensitive",
                  },
                },
              ],
            },
          });
          prisma.$disconnect;
          if (posts === null) {
            res.status(404).json(`Not found posts.`);
            break;
          }
          res.status(200).json(posts);
        } catch (err) {
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(400).json(`${err}`);
            break;
          }
          res.status(400).json(`${err}`);
          break;
        }
        break;
      default:
        res.status(405).end(`Method ${method} Not Allowed.`);
        break;
    }
  }

  if (validatedParams?.categoryId) {
    switch (method) {
      case "GET":
        try {
          const categoryId = validatedParams.categoryId;
          const posts = await prisma.post.findMany({
            where: {
              categoryId: categoryId,
            },
          });
          prisma.$disconnect;
          if (posts === null) {
            res.status(404).json(`Not found posts.`);
            break;
          }
          res.status(200).json(posts);
        } catch (err) {
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(400).json(`${err}`);
            break;
          }
          res.status(400).json(`${err}`);
          break;
        }
        break;
      default:
        res.status(405).end(`Method ${method} Not Allowed.`);
        break;
    }
  }
}
