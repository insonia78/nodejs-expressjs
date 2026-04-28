import { NextFunction, Request, Response } from "express";
import { buildTrackedEvent } from "../services/eventFactory";
import { enqueueEvent } from "../services/eventQueue";

export const ingestEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const event = buildTrackedEvent(req);
    await enqueueEvent(event);
    res.status(202).json({ accepted: true, eventId: event.id });
  } catch (error) {
    next(error);
  }
};