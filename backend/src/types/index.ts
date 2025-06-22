import { Task } from "../generated/prisma";

export interface TaskResponse {
  success: boolean;
  message: string;
  data?: Task | Task[];
  error?: string;
}
