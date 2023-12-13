// API Tweet handler
import Prisma from "@prisma/client";
import * as yup from "yup";
const prisma = require("@utils/prismaClient");
const objectIdValidator = require("@utils/objectIdSchema");
import { capitalize } from "@utils/capitalizeStr";

export default async function handler(req, res) {
  const method = req.method;
  let validatedParams;

  // Validate params data.
  const schema = yup.object().shape({
    tweetId: objectIdValidator,
    keyword: yup.string().max(255),
    categoryId: objectIdValidator,
    // categories: yup.string().max(255),
  });

  if (
    req.query.tweetId ||
    req.query.keyword ||
    req.query.categoryId // ||
    // req.query.categories
  ) {
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
          const tweets = await prisma.tweet.findMany();
          prisma.$disconnect;
          if (tweets === null) {
            res.status(404).json(`Not found tweets.`);
            break;
          }
          res.status(200).json(tweets);
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
          const tweet = await prisma.tweet.create({
            data: req.body,
          });
          prisma.$disconnect;
          res.status(201).json(tweet);
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

  if (validatedParams?.tweetId) {
    switch (method) {
      case "PATCH":
        try {
          const tweetId = validatedParams.tweetId;
          const tweet = await prisma.tweet.update({
            where: {
              id: tweetId,
            },
            data: req.body,
          });
          prisma.$disconnect;
          res.status(200).json(tweet);
        } catch (err) {
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2025") {
              res.status(404).json(`Tweet not found.`);
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
          const tweetId = validatedParams.tweetId;
          const tweet = await prisma.tweet.delete({
            where: {
              id: tweetId,
            },
          });
          prisma.$disconnect;
          res.status(200).json(`Tweet ${tweet.id} deleted successfully.`);
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
          const tweets = await prisma.tweet.findMany({
            where: {
              OR: [
                {
                  title: {
                    contains: keyword,
                    mode: "insensitive",
                  },
                },
                {
                  url: {
                    contains: keyword,
                    mode: "insensitive",
                  },
                },
              ],
            },
          });
          prisma.$disconnect;
          if (tweets === null) {
            res.status(404).json(`Not found tweet.`);
            break;
          }
          res.status(200).json(tweets);
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
          const tweets = await prisma.tweet.findMany({
            where: {
              categoryId: categoryId,
            },
          });
          prisma.$disconnect;
          if (tweets === null) {
            res.status(404).json(`Not found tweets.`);
            break;
          }
          res.status(200).json(tweets);
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

  // if (validatedParams?.categories) {
  //   switch (method) {
  //     case "GET":
  //       try {
  //         const categories = validatedParams.categories;
  //         const tweets = [];
  //         const categoriesList = categories.split(",");
  //         console.log(categoriesList);

  //         await Promise.all(
  //           categoriesList.map(async (category) => {
  //             const tweetsByCategory = await prisma.tweet.findMany({
  //               where: {
  //                 category: {
  //                   name: {
  //                     contains: category.trim(),
  //                     mode: "insensitive",
  //                   },
  //                 },
  //               },
  //             });
  //             tweets.push(...tweetsByCategory);
  //           })
  //         );

  //         console.log({ tweets });

  //         prisma.$disconnect;
  //         if (tweets === null) {
  //           res.status(404).json(`Not found tweets.`);
  //           break;
  //         }
  //         res.status(200).json(tweets);
  //       } catch (err) {
  //         if (err instanceof Prisma.PrismaClientKnownRequestError) {
  //           res.status(400).json(`${err}`);
  //           break;
  //         }
  //         res.status(400).json(`${err}`);
  //         break;
  //       }
  //       break;
  //     default:
  //       res.status(405).end(`Method ${method} Not Allowed.`);
  //       break;
  //   }
  // }
}
