
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

interface GalleryUploadModalProps {
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

export default function GalleryUploadModal({ isOpen, onClose, onSuccess }: GalleryUploadModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("residential"); // Default to residential
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    // Check if adding new files exceeds limit
    if (selectedFiles.length + files.length > 4) {
      toast.error("Maximum 4 images allowed per project.");
      return;
    }
    
    const validFiles: File[] = [];
    const newPreviews: string[] = [];
    
    files.forEach(file => {
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error(`${file.name}: Invalid file type. Please upload JPG, PNG, or WebP images.`);
        return;
      }
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: File size exceeds 5MB limit.`);
        return;
      }
      
      validFiles.push(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        newPreviews.push(preview);
        
        // Update previews when all files are processed
        if (newPreviews.length === validFiles.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };
  
  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  const clearAllImages = () => {
    setSelectedFiles([]);
    setImagePreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("residential");
    clearAllImages();
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
      // Upload all images
      const imageUrls: string[] = [];
      const timestamp = new Date().getTime();
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const filePath = `gallery/${user.id}/${timestamp}_${i}_${file.name.replace(/\s+/g, '_')}`;
        
        const { data: imageUrl, error: uploadError } = await uploadImage(file, filePath);
        
        if (uploadError) throw uploadError;
        
        if (!imageUrl) {
          throw new Error(`Failed to get URL for image ${i + 1}.`);
        }
        
        imageUrls.push(imageUrl);
      }
      
      // Create gallery item with multiple images
      const galleryData: GalleryItemInsertData = {
        title,
        description,
        category,
        image_url: imageUrls[0], // Primary image
        images: imageUrls, // All images array
        user_id: user.id
      };
      
      const { error: insertError } = await safeInsert("gallery", galleryData);
      
      if (insertError) throw insertError;
      
      toast.success("Gallery item uploaded successfully!");
       // ✅ FIRE GOOGLE ADS CONVERSION EVENT HERE
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "conversion", {
        send_to: "AW-17621947358/0YOoCPW62asbEN6n5tJB",
        value: 1.0,
        currency: "INR"
      });
      console.log("Google Ads conversion event triggered ✅");
    }

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
          <DialogTitle className="text-xl font-bold text-white">Upload Gallery Item</DialogTitle>
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
            <Label className="text-white">Upload Images (2-4 required)</Label>
            
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden bg-dark-200 h-32">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 rounded-full bg-dark-300/80 hover:bg-dark-300 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X size={14} />
                    </Button>
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 bg-steel text-white text-xs px-1 py-0.5 rounded">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {selectedFiles.length < 4 && (
              <div 
                onClick={() => fileInputRef.current?.click()} 
                className="border-2 border-dashed border-gray-600 rounded-md p-6 text-center cursor-pointer hover:border-steel transition-colors"
              >
                <Upload className="mx-auto h-8 w-8 text-gray-500" />
                <div className="mt-2 text-sm text-gray-400">
                  {selectedFiles.length === 0 ? "Click to upload 2-4 images" : `Add more images (${selectedFiles.length}/4)`}<br />
                  JPG, PNG, WebP (max 5MB each)
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.webp"
              multiple
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
              disabled={isUploading || selectedFiles.length < 2 || !title.trim()}
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
