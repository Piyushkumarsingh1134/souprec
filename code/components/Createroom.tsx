"use client";

import { useState } from "react";

export function CreateRoomModal({ open, onClose, onCreated }: any) {
  const [roomCode, setRoomCode] = useState(
    Math.random().toString(36).substring(2, 8).toUpperCase()
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";
  const API_URL = `${API_BASE_URL}/room/createromm`;

  async function submitRoom() {
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in.");

    setLoading(true);

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        roomCode,
        title,
        description,
        isLive: false,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || data.message);
      return;
    }

    onCreated(); // refresh list
    onClose();   // close modal
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Create a New Room</h2>

        <div className="space-y-4">
          <div>
            <label className="font-semibold">Room Code</label>
            <input
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full p-3 border rounded mt-1"
            />
          </div>

          <div>
            <label className="font-semibold">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded mt-1"
              placeholder="Podcast Room Title"
            />
          </div>

          <div>
            <label className="font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded mt-1 h-24"
              placeholder="Describe your room..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={submitRoom}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {loading ? "Creating..." : "Create Room"}
          </button>
        </div>
      </div>
    </div>
  );
}
