import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  StarOff,
  Move,
  Image as ImageIcon,
  AlertCircle,
  Check,
  X,
  GripVertical
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Gallery Management Component
const AdminGallery = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch gallery images
  const { data: galleryImages, isLoading } = useQuery({
    queryKey: ['/api/admin/gallery'],
    queryFn: () => apiRequest('GET', '/api/admin/gallery', {}),
  });

  // Upload image mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/gallery'] });
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setPreviewUrl('');
      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    },
  });

  // Delete image mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/admin/gallery/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/gallery'] });
      toast({
        title: "Success",
        description: "Image deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete image",
        variant: "destructive",
      });
    },
  });

  // Update image mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest('PUT', `/api/admin/gallery/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/gallery'] });
      setIsEditModalOpen(false);
      setSelectedImage(null);
      toast({
        title: "Success",
        description: "Image updated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update image",
        variant: "destructive",
      });
    },
  });

  // Handle file selection
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setUploadFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        toast({
          title: "Invalid File",
          description: "Please select an image file",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  // Handle image upload
  const handleUpload = useCallback((formData: any) => {
    if (!uploadFile) return;

    const uploadFormData = new FormData();
    uploadFormData.append('image', uploadFile);
    uploadFormData.append('title', formData.title);
    uploadFormData.append('category', formData.category);
    uploadFormData.append('subcategory', formData.subcategory);
    uploadFormData.append('description', formData.description);
    uploadFormData.append('projectDate', formData.projectDate || '');
    uploadFormData.append('location', formData.location || '');
    uploadFormData.append('featured', formData.featured ? 'true' : 'false');

    uploadMutation.mutate(uploadFormData);
  }, [uploadFile, uploadMutation]);

  // Handle image update
  const handleUpdate = useCallback((formData: any) => {
    if (!selectedImage) return;

    updateMutation.mutate({
      id: selectedImage.id,
      data: {
        title: formData.title,
        category: formData.category,
        subcategory: formData.subcategory,
        description: formData.description,
        projectDate: formData.projectDate || '',
        location: formData.location || '',
        featured: formData.featured,
      }
    });
  }, [selectedImage, updateMutation]);

  // Handle image deletion
  const handleDelete = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation]);

  // Filter images - ensure galleryImages is always an array
  const filteredImages = Array.isArray(galleryImages) ? galleryImages.filter((img: any) => {
    if (filter === 'all') return true;
    return img.category === filter;
  }) : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-600/30 border-t-purple-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
            <p className="text-gray-600 mt-1">Manage your portfolio images</p>
          </div>
          
          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload New Image</DialogTitle>
                <DialogDescription>
                  Add a new image to your gallery
                </DialogDescription>
              </DialogHeader>
              <UploadForm 
                onSubmit={handleUpload} 
                onFileSelect={handleFileSelect}
                previewUrl={previewUrl}
                isLoading={uploadMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ImageIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Images</p>
                  <p className="text-2xl font-bold text-gray-900">{Array.isArray(galleryImages) ? galleryImages.length : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Array.isArray(galleryImages) ? galleryImages.filter((img: any) => img.featured).length : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600">R</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Residential</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Array.isArray(galleryImages) ? galleryImages.filter((img: any) => img.category === 'residential').length : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600">C</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Commercial</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Array.isArray(galleryImages) ? galleryImages.filter((img: any) => img.category === 'commercial').length : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg border">
          {['all', 'residential', 'commercial', 'furniture'].map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(category)}
              className={filter === category ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredImages.map((image: any, index: number) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
              >
                <ImageCard
                  image={image}
                  onEdit={() => {
                    setSelectedImage(image);
                    setIsEditModalOpen(true);
                  }}
                  onDelete={() => handleDelete(image.id)}
                  isLoading={deleteMutation.isPending}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No images found in this category</p>
          </div>
        )}

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Image</DialogTitle>
              <DialogDescription>
                Update image information
              </DialogDescription>
            </DialogHeader>
            {selectedImage && (
              <EditForm 
                image={selectedImage}
                onSubmit={handleUpdate}
                isLoading={updateMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Upload Form Component
const UploadForm: React.FC<{
  onSubmit: (data: any) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string;
  isLoading: boolean;
}> = ({ onSubmit, onFileSelect, previewUrl, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    description: '',
    projectDate: '',
    location: '',
    featured: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="image">Image File</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 relative cursor-pointer hover:border-gray-400 transition-colors" onClick={() => document.getElementById('image')?.click()}>
          {previewUrl ? (
            <div className="text-center">
              <img src={previewUrl} alt="Preview" className="max-w-full h-32 object-cover rounded mx-auto" />
              <p className="text-sm text-gray-600 mt-2">Image selected</p>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to select an image</p>
            </div>
          )}
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={onFileSelect}
            className="hidden"
            required
          />
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subcategory">Subcategory</Label>
        <Input
          id="subcategory"
          value={formData.subcategory}
          onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
          placeholder="e.g., Living Rooms, Kitchens"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="projectDate">Project Date</Label>
          <Input
            id="projectDate"
            value={formData.projectDate}
            onChange={(e) => setFormData({ ...formData, projectDate: e.target.value })}
            placeholder="2024"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Kigali, Rwanda"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="featured">Featured Image</Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Uploading...' : 'Upload Image'}
      </Button>
    </form>
  );
};

// Edit Form Component
const EditForm: React.FC<{
  image: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}> = ({ image, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: image.title || '',
    category: image.category || '',
    subcategory: image.subcategory || '',
    description: image.description || '',
    projectDate: image.projectDate || '',
    location: image.location || '',
    featured: image.featured || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-title">Title</Label>
          <Input
            id="edit-title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="edit-category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-subcategory">Subcategory</Label>
        <Input
          id="edit-subcategory"
          value={formData.subcategory}
          onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-projectDate">Project Date</Label>
          <Input
            id="edit-projectDate"
            value={formData.projectDate}
            onChange={(e) => setFormData({ ...formData, projectDate: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="edit-location">Location</Label>
          <Input
            id="edit-location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="edit-featured"
          checked={formData.featured}
          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="edit-featured">Featured Image</Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Image'}
      </Button>
    </form>
  );
};

// Image Card Component
const ImageCard: React.FC<{
  image: any;
  onEdit: () => void;
  onDelete: () => void;
  isLoading: boolean;
}> = ({ image, onEdit, onDelete, isLoading }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-square relative group">
        <img
          src={image.thumbnailUrl || image.imageUrl}
          alt={image.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
          <Button size="sm" variant="secondary" onClick={onEdit}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary">
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={onDelete}
            disabled={isLoading}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        {image.featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-yellow-500 hover:bg-yellow-600">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-1 truncate">{image.title}</h3>
        <p className="text-xs text-gray-600 mb-2 capitalize">{image.category}</p>
        <p className="text-xs text-gray-500 line-clamp-2">{image.description}</p>
        {image.location && (
          <p className="text-xs text-gray-400 mt-1">{image.location}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminGallery;