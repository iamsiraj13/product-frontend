import { apiClient } from "./api-client";
import { ApiResponse } from "@/types/auth";
import { UserTaskItem, SubmitTaskPayload } from "@/types/task";

export const userTasksApi = {
  getPendingTask: async (): Promise<ApiResponse<UserTaskItem | null>> => {
    const response =
      await apiClient.get<ApiResponse<UserTaskItem | null>>("/tasks/pending");
    return response.data;
  },

  generateTask: async (): Promise<ApiResponse<UserTaskItem>> => {
    const response =
      await apiClient.post<ApiResponse<UserTaskItem>>("/tasks/generate");
    console.log(response);
    return response.data;
  },

  startTask: async (taskId: string): Promise<ApiResponse<UserTaskItem>> => {
    const response = await apiClient.post<ApiResponse<UserTaskItem>>(
      `/tasks/${taskId}/start`,
    );
    return response.data;
  },

  submitTask: async (
    taskId: string,
    payload: SubmitTaskPayload,
  ): Promise<ApiResponse<UserTaskItem>> => {
    const response = await apiClient.post<ApiResponse<UserTaskItem>>(
      `/tasks/${taskId}/submit`,
      payload,
    );
    return response.data;
  },
};
