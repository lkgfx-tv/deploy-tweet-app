// API Categories handler
import Prisma from "@prisma/client";
import * as yup from "yup";
const prisma = require("@utils/prismaClient");
const objectIdValidator = require("@utils/objectIdSchema");

export default async function handler(req, res) {
  const method = req.method;
  let validatedParams;

  // Validate params data.
  const schema = yup.object().shape({
    categoryId: objectIdValidator,
  });

  if (req.query.categoryId) {
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
          const categories = await prisma.category.findMany();
          prisma.$disconnect;
          if (categories === null) {
            res.status(404).json(`Not found categories.`);
            break;
          }
          res.status(200).json(categories);
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
          const { name } = req.body;
          const category = await prisma.category.create({
            data: {
              name,
            },
          });
          prisma.$disconnect;
          res.status(201).json(category);
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

  if (validatedParams) {
    switch (method) {
      case "PATCH":
        try {
          const categoryId = validatedParams.categoryId;
          const { name } = req.body;
          const category = await prisma.category.update({
            where: {
              id: categoryId,
            },
            data: {
              name,
            },
          });
          prisma.$disconnect;
          res.status(200).json(category);
        } catch (err) {
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2025") {
              res.status(404).json(`Category not found.`);
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
          const categoryId = validatedParams.categoryId;
          const category = await prisma.category.delete({
            where: {
              id: categoryId,
            },
          });
          prisma.$disconnect;
          res.status(200).json(`Category ${category.id} deleted successfully.`);
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
}
