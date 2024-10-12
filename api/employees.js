const prisma = require("../prisma");
const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: +id },
    });
    if (employee) {
      res.json(employee);
    } else {
      next({
        status: 404,
        message: `Employee with id ${id} doesnt exist.`,
      });
    }
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  const { title } = req.body;
  if (!title) {
    return next({
      status: 400,
      message: "A title must be povided for employee.",
    });
  }
  try {
    const employee = await prisma.employee.create({ data: { title } });
    res.status(201).json(employee);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;
  if (!title) {
    return next({
      status: 400,
      message: "A new title must be provided.",
    });
  }

  try {
    const employee = await prisma.employee.findUnique({ where: { id: +id } });
    if (!employee) {
      next({
        status: 400,
        message: `Employee with id: ${id} doesnt exist.`,
      });
    }
    const updatedEmployee = await prisma.employee.update({
      where: { id: +id },
      data: { title },
    });
    res.json(updatedEmployee);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const employee = await prisma.employee.findUnique({ where: { id: +id } });
    if (!employee) {
      return next({
        status: 404,
        message: `There is no employee to delete with id ${id}`,
      });
    } else {
      await prisma.employee.delete({ where: { id: +id } });
      res.sendStatus(204);
      next({
        status: 200,
        message: "Employee was sucessfully deleted!"
      })
    }
  } catch (e) {
    next(e);
  }
});
