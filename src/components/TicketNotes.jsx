import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Textarea, TextInput } from "@mantine/core";
import { FiEdit, FiTrash2, FiSend } from "react-icons/fi";
import apiClient from "../api/axios";

const TicketNotes = ({ ticketId }) => {
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const queryClient = useQueryClient();

  // Fetch notes - with safe data handling
  const { data, isLoading } = useQuery({
    queryKey: ["ticketNotes", ticketId],
    queryFn: () =>
      apiClient
        .get(`/api/tickets/${ticketId}/note`)
        .then((res) => res.data.notes),
    enabled: !!ticketId,
  });

  // Always ensure notes is an array
  const notes = Array.isArray(data) ? data : [];

  // Add note
  const addNote = useMutation({
    mutationFn: (text) =>
      apiClient.patch(`/api/tickets/${ticketId}/note`, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticketNotes", ticketId] });
      setNewNote("");
    },
  });

  // Update note
  const updateNote = useMutation({
    mutationFn: ({ noteId, text }) =>
      apiClient.patch(`/api/tickets/${ticketId}/updateNote/${noteId}`, {
        text,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticketNotes", ticketId] });
      setEditingNoteId(null);
      setEditingText("");
    },
  });

  // Delete note
  const deleteNote = useMutation({
    mutationFn: (noteId) =>
      apiClient.delete(`/api/tickets/${ticketId}/note/${noteId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticketNotes", ticketId] });
    },
  });

  // Handle add new note
  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote.mutate(newNote.trim());
    }
  };

  // Handle edit note
  const handleEditNote = (note) => {
    setEditingNoteId(note.id);
    setEditingText(note.text);
  };

  // Handle save edited note
  const handleSaveEdit = () => {
    if (editingText.trim()) {
      updateNote.mutate({ noteId: editingNoteId, text: editingText.trim() });
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingText("");
  };

  // Handle delete note
  const handleDeleteNote = (noteId) => {
    if (window.confirm("Delete this note?")) {
      deleteNote.mutate(noteId);
    }
  };

  // Format date like WhatsApp
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" shadow  rounded-2xl">
      {/* Header */}
      <div className="border-b border-gray-200 rounded-t-2xl pb-3 mb-4 bg-green-100 p-2">
        <h3 className="text-lg font-semibold text-gray-800">Notes</h3>
        <p className="text-sm text-gray-500">Add and manage your notes</p>
      </div>

      {/* Notes Container - WhatsApp Style */}
      <div className="h-96 overflow-y-auto mb-4 space-y-3 p-2">
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-gray-500">No notes yet</p>
            <p className="text-sm text-gray-400">
              Start by adding a note below
            </p>
          </div>
        ) : (
          notes.map((note, index) => (
            <div key={index} className="flex flex-col space-y-1">
              {/* Note Bubble */}
              <div className="flex justify-between items-start">
                <div className="bg-blue-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[90%] mx-auto w-full">
                  {editingNoteId === note?.id ? (
                    // Edit Textarea
                    <div className="space-y-2">
                      <TextInput
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        autoFocus
                        radius={"md"}
                        size="md"
                      />
                      <div className="flex space-x-2">
                        <Button
                          size="xs"
                          onClick={handleSaveEdit}
                          loading={updateNote.isPending}
                          classNames={{
                            root: "!bg-green-600 hover:!bg-green-700",
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          color="red"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Note Content
                    <>
                      <p className="text-gray-800 whitespace-pre-wrap">
                        {note?.text}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(note?.timestamp)}
                        </span>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEditNote(note)}
                            className="text-green-500 cursor-pointer hover:text-green-600 hover:scale-110 duration-300 transition-all"
                            title="Edit note"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-red-400 cursor-pointer hover:text-red-600 hover:scale-110 duration-300 transition-all  "
                            title="Delete note"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="border-t border-gray-200 py-3">
        <div className="flex items-center max-w-[90%] mx-auto w-full space-x-2">
          <TextInput
            placeholder="Type your note here..."
            value={newNote}
            size="lg"
            radius={"md"}
            classNames={{ root: "flex-1" }}
            onChange={(e) => setNewNote(e.target.value)}
            disabled={addNote.isPending}
          />
          <Button
            onClick={handleAddNote}
            loading={addNote.isPending}
            loaderProps={{ type: "bars" }}
            color="green"
            disabled={!newNote.trim()}
            size="lg"
            radius={"md"}
          >
            <FiSend size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketNotes;
