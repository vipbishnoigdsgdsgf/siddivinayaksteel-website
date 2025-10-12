
import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { uploadImage } from "@/utils/storage";
import { safeInsert } from "@/utils/supabaseHelpers";
import { useUser } from "@supabase/auth-helpers-react";

type GalleryItemInsertData = {
  title: string;
  description?: string;
  category: string;
  image_url: string;
  images: string[];
  user_id: string;
};

type Props = {
  onSuccess: () => void;
  onClose: () => void;
};

export default function GalleryUploadModal({ onSuccess, onClose }: Props) {
  const user = useUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to upload images.");
      return;
    }

    if (selectedFiles.length < 2) {
      toast.error("Please select at least 2 images to upload.");
      return;
    }

    if (selectedFiles.length > 4) {
      toast.error("Maximum 4 images allowed per project.");
      return;
    }

    if (!title.trim()) {
      toast.error("Please provide a title.");
      return;
    }

    if (!category) {
      toast.error("Please select a category.");
      return;
    }

    setIsUploading(true);

    try {
      const imageUrls: string[] = [];
      const timestamp = new Date().getTime();

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const filePath = `gallery/${user.id}/${timestamp}_${i}_${file.name.replace(/\s+/g, "_")}`;

        const { data: imageUrl, error: uploadError } = await uploadImage(file, filePath);
        if (uploadError) throw uploadError;
        if (!imageUrl) throw new Error(`Failed to get URL for image ${i + 1}.`);
        imageUrls.push(imageUrl);
      }

      const galleryData: GalleryItemInsertData = {
        title,
        description,
        category,
        image_url: imageUrls[0],
        images: imageUrls,
        user_id: user.id,
      };

      const { error: insertError } = await safeInsert("gallery", galleryData);
      if (insertError) throw insertError;

      toast.success("Gallery item uploaded successfully!");

      // ✅ FIRE GOOGLE ADS CONVERSION EVENT
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "conversion", {
          send_to: "AW-17621947358/0YOoCPW62asbEN6n5tJB",
          value: 1.0,
          currency: "INR",
        });
        console.log("✅ Google Ads conversion event triggered successfully!");
      } else {
        console.warn("⚠️ gtag not found — conversion event not fired");
      }

      resetForm();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error uploading gallery item:", error);

      if (error.message && error.message.includes("gallery_category_check")) {
        toast.error("Invalid category selected. Please choose a valid category and try again.");
      } else if (error.message && error.message.includes("violates check constraint")) {
        toast.error("Invalid data provided. Please check your inputs and try again.");
      } else {
        toast.error(`Upload failed: ${error.message || "Unknown error"}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Upload Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded-md"
            required
          />
          <textarea
            placeholder="Project Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded-md"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded-md"
            required
          >
            <option value="">Select Category</option>
            <option value="steel">Steel</option>
            <option value="fabrication">Fabrication</option>
            <option value="construction">Construction</option>
          </select>
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="w-full"
          />
          <button
            type="submit"
            disabled={isUploading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700 w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
