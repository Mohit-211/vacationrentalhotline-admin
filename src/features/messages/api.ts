import { apiClient } from "@/api/client";
import type { ApiPage, Id, ListParams } from "@/api/types";
import type { Message } from "./types";

export const messageKeys = {
  all: ["messages"] as const,
  list: (params: ListParams) => ["messages", "list", params] as const,
};

/** Newest first. Searches name, email, phone and the message. */
export async function fetchMessages(params: ListParams): Promise<ApiPage<Message>> {
  const { data } = await apiClient.get<ApiPage<Message>>("/admin/messages", { params });
  return data;
}

export async function deleteMessage(messageId: Id): Promise<void> {
  await apiClient.delete(`/admin/messages/${messageId}`);
}
