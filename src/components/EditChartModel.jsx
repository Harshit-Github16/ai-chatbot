"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

export default function EditCharacterModal({ isOpen, onClose, character, onSubmit }) {
  const [name, setName] = useState(character?.name || "");
  const [image, setImage] = useState(character?.image || "");
  const [description, setDescription] = useState(character?.description || "");

  useEffect(() => {
    if (character) {
      setName(character.name || "");
      setImage(character.image || "");
      setDescription(character.description || "");
    }
  }, [character]);

  const handleSubmit = () => {
    onSubmit({ ...character, name, image, description });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">Edit Character</Dialog.Title>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Image</label>
              <div className="mt-2 flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image || '/profile.jpg'} alt="preview" className="w-full h-full object-cover" />
                </div>
                <label className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm cursor-pointer hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const formData = new FormData();
                        formData.append('file', file);
                        const res = await fetch('/api/upload', { method: 'POST', body: formData });
                        const data = await res.json();
                        if (res.ok && data?.url) {
                          setImage(data.url);
                        }
                      } catch (err) {
                        // ignore for now
                      }
                    }}
                  />
                  <span>Upload</span>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 2MB.</p>
            </div>

            <div>
              <label className="block text-sm text-gray-600">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring focus:ring-pink-300"
                rows="3"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-gray-600 mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600"
            >
              Save
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
