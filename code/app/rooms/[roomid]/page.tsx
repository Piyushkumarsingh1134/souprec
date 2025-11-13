"use client";

import { use } from "react";
import Rooms from "@/components/Rooms";

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomid: string }>;
}) {
  const { roomid } = use(params); // Unwrap Next.js params promise

  return <Rooms roomIdFromUrl={roomid} />;
}
