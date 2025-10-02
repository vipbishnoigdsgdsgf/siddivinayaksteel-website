import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { uploadImage, safeInsert, GalleryItemInsertData } from "@/utils/supabaseUtils";
import { X, Upload, Loader } from "lucide-react";
import { toast } from "sonner";

interface PortfolioUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const CATEGORIES = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "custom", label: "Custom Designs" },
  { value: "industrial", label: "Industrial" },
];

export default function PortfolioUploadModal({ isOpen, onClose, onSuccess }: PortfolioUploadModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("residential"); // Default to residential
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (!file) return;
    
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPG, PNG, or WebP images.");
      return;
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const clearSelection = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("residential"); // Reset to default
    clearSelection();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to upload images.");
      return;
    }
    
    if (!selectedFile) {
      toast.error("Please select an image to upload.");
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
      // Create a unique path for the image
      const timestamp = new Date().getTime();
      const filePath = `gallery/${user.id}/${timestamp}_${selectedFile.name.replace(/\s+/g, '_')}`;
      
      // Upload image to storage
      const { data: imageUrl, error: uploadError } = await uploadImage(selectedFile, filePath);
      
      if (uploadError) throw uploadError;
      
      if (!imageUrl) {
        throw new Error("Failed to get image URL after upload.");
      }
      
      // Create gallery item
      const galleryData: GalleryItemInsertData = {
        title,
        description,
        category,
        image_url: imageUrl,
        user_id: user.id
      };
      
      const { error: insertError } = await safeInsert("gallery", galleryData);
      
      if (insertError) throw insertError;
      
      toast.success("Gallery item uploaded successfully!");
      resetForm();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error uploading gallery item:", error);
      
      // Handle specific database constraint errors
      if (error.message && error.message.includes('gallery_category_check')) {
        toast.error('Invalid category selected. Please choose a valid category and try again.');
      } else if (error.message && error.message.includes('violates check constraint')) {
        toast.error('Invalid data provided. Please check your inputs and try again.');
      } else {
        toast.error(`Upload failed: ${error.message || "Unknown error"}`);
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-dark-300 border-gray-800 text-white max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Upload Portfolio Item</DialogTitle>
          <DialogDescription className="text-gray-400">
            Share your work in the gallery. Max file size: 5MB.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-dark-200 border-gray-700 text-white"
              placeholder="Title of your work"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-white">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-dark-200 border-gray-700 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-dark-200 border-gray-700 text-white">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-dark-200 border-gray-700 text-white min-h-[80px]"
              placeholder="Brief description of your work"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-white">Upload Image</Label>
            
            {imagePreview ? (
              <div className="relative rounded-md overflow-hidden bg-dark-200 h-52">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-contain"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full bg-dark-300/80 hover:bg-dark-300"
                  onClick={clearSelection}
                >
                  <X size={18} />
                </Button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()} 
                className="border-2 border-dashed border-gray-600 rounded-md p-8 text-center cursor-pointer hover:border-steel transition-colors"
              >
                <Upload className="mx-auto h-12 w-12 text-gray-500" />
                <div className="mt-2 text-sm text-gray-400">
                  Click to upload or drag and drop<br />
                  JPG, PNG, WebP (max 5MB)
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-gray-600 text-white"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-steel hover:bg-steel-700 text-white"
              disabled={isUploading || !selectedFile || !title.trim()}
            >
              {isUploading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
