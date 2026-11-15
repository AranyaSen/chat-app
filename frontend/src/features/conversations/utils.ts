import type { ChatUser } from "@/features/conversations/types";

export function getPeerName(peer: ChatUser | null): string {
  if (!peer) return "Direct conversation";

  return peer.name || peer.username || "Direct conversation";
}

export function getPeerHandle(peer: ChatUser | null): string | null {
  if (!peer?.username) return null;

  return `@${peer.username}`;
}
