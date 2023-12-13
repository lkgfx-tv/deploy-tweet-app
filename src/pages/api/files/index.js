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
    fileId: objectIdValidator,
    categoryId: objectIdValidator,
  });

  if (req.query.fileId || req.query.categoryId || req.query.keyword) {
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
          const files = await prisma.file.findMany();
          prisma.$disconnect;
          if (files === null) {
            res.status(404).json(`Not found files.`);
            break;
          }
          res.status(200).json(files);
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
          const file = await prisma.file.create({
            data: req.body,
          });
          prisma.$disconnect;
          res.status(201).json(file);
        } catch (err) {
          console.log(err);
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

  if (validatedParams?.fileId) {
    switch (method) {
      case "PATCH":
        try {
          const fileId = validatedParams.fileId;
          const file = await prisma.file.update({
            where: {
              id: fileId,
            },
            data: req.body,
          });
          prisma.$disconnect;
          res.status(200).json(file);
        } catch (err) {
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2025") {
              res.status(404).json(`File not found.`);
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
          const fileId = validatedParams.fileId;
          const file = await prisma.file.delete({
            where: {
              id: fileId,
            },
          });
          prisma.$disconnect;
          res.status(200).json(`File ${file.id} deleted successfully.`);
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
          const files = await prisma.file.findMany({
            where: {
              name: {
                contains: keyword,
              },
            },
          });
          prisma.$disconnect;
          if (files === null) {
            res.status(404).json(`Not found files.`);
            break;
          }
          res.status(200).json(files);
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
          const files = await prisma.file.findMany({
            where: {
              categoryId: categoryId,
            },
          });
          prisma.$disconnect;
          if (files === null) {
            res.status(404).json(`Not found files.`);
            break;
          }
          res.status(200).json(files);
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
