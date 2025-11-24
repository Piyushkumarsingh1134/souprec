import RoomsDetails from "@/components/RoomDetails";


export default async function ChunksPage({
  params,
}: {
  params: Promise<{ roomid: string }>;
}) {
  const { roomid } = await params; // <-- FIX: Unwrap Promise

  return <RoomsDetails roomIdFromUrl={roomid} />;
}
