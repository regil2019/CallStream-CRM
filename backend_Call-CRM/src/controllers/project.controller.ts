import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";
import { successResponse } from "../utils/response";
import { z } from "zod";

const projectSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  limitCalls: z.number().int().positive().optional(),
});

const updateProjectSchema = projectSchema.partial();

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = projectSchema.parse(req.body);
    const userId = req.user?.userId;

    const project = await prisma.project.create({
      data: {
        ...data,
        managerId: userId!,
      },
    });

    successResponse(res, project, 201);
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    let projects;
    if (role === "ADMIN") {
      projects = await prisma.project.findMany({
        include: { _count: { select: { clients: true } } },
      });
    } else {
      projects = await prisma.project.findMany({
        where: { managerId: userId },
        include: { _count: { select: { clients: true } } },
      });
    }

    const mappedProjects = projects.map((p: any) => ({
      ...p,
      clientsCount: p._count?.clients || 0,
      status: "active",
    }));

    successResponse(res, mappedProjects);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: { _count: { select: { clients: true } } },
    });

    if (!project) {
      const error = new Error("Проект не найден");
      (error as any).statusCode = 404;
      throw error;
    }

    const mappedProject = {
      ...project,
      clientsCount: (project as any)._count?.clients || 0,
      status: "active",
    };

    successResponse(res, mappedProject);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data = updateProjectSchema.parse(req.body);

    const project = await prisma.project.update({
      where: { id },
      data,
    });

    successResponse(res, project);
  } catch (error) {
    if ((error as any).code === "P2025") {
      const error = new Error("Проект не найден");
      (error as any).statusCode = 404;
      return next(error);
    }
    next(error);
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({
      where: { id },
    });

    successResponse(res, { message: "Проект успешно удален" });
  } catch (error) {
    if ((error as any).code === "P2025") {
      const error = new Error("Проект не найден");
      (error as any).statusCode = 404;
      return next(error);
    }
    next(error);
  }
};
