import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Edit3, 
  Eye, 
  FileText, 
  Sparkles,
  Users,
  Target,
  Award,
  Heart,
  CheckCircle,
  AlertCircle,
  Undo
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ContentSection {
  id: string;
  title: string;
  content: string;
  lastModified?: string;
  modifiedBy?: string;
}

const AdminContent = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<{ [key: string]: any }>({});
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch content data
  const { data: contentData, isLoading } = useQuery({
    queryKey: ['/api/admin/content'],
    queryFn: () => apiRequest('GET', '/api/admin/content', {}),
  });

  // Update content mutation
  const updateMutation = useMutation({
    mutationFn: ({ section, data }: { section: string; data: any }) => 
      apiRequest('PUT', `/api/admin/content/${section}`, data),
    onSuccess: (_, { section }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/content'] });
      setEditingSection(null);
      setPendingChanges(prev => {
        const newChanges = { ...prev };
        delete newChanges[section];
        return newChanges;
      });
      toast({
        title: "Success",
        description: "Content updated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update content",
        variant: "destructive",
      });
    },
  });

  // Handle content change
  const handleContentChange = (section: string, field: string, value: string) => {
    setPendingChanges(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Save changes
  const saveChanges = (section: string) => {
    if (pendingChanges[section]) {
      updateMutation.mutate({
        section,
        data: pendingChanges[section]
      });
    }
  };

  // Cancel changes
  const cancelChanges = (section: string) => {
    setPendingChanges(prev => {
      const newChanges = { ...prev };
      delete newChanges[section];
      return newChanges;
    });
    setEditingSection(null);
  };

  // Get effective content (with pending changes)
  const getEffectiveContent = (section: string, field: string) => {
    const originalValue = (contentData as any)?.[section]?.[field] || '';
    return pendingChanges[section]?.[field] ?? originalValue;
  };

  const hasUnsavedChanges = (section: string) => {
    return Object.keys(pendingChanges[section] || {}).length > 0;
  };

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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600 mt-1">Edit website content and copy</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="text-green-600 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Auto-saved
            </Badge>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview Changes
            </Button>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="about" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>About</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Services</span>
            </TabsTrigger>
            <TabsTrigger value="mission" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Mission</span>
            </TabsTrigger>
            <TabsTrigger value="values" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Values</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Team</span>
            </TabsTrigger>
          </TabsList>

          {/* About Section */}
          <TabsContent value="about" className="space-y-6">
            <ContentEditor
              title="About Section"
              description="Main about page content and company introduction"
              sections={[
                {
                  id: 'hero_title',
                  label: 'Hero Title',
                  type: 'input',
                  placeholder: 'Your Interior Design Dreams, Crafted to Perfection'
                },
                {
                  id: 'hero_subtitle',
                  label: 'Hero Subtitle',
                  type: 'textarea',
                  rows: 3,
                  placeholder: 'Transform your space with our expert design services...'
                },
                {
                  id: 'story_title',
                  label: 'Our Story Title',
                  type: 'input',
                  placeholder: 'Our Story'
                },
                {
                  id: 'story_content',
                  label: 'Our Story Content',
                  type: 'textarea',
                  rows: 6,
                  placeholder: 'Founded with a passion for creating beautiful spaces...'
                },
                {
                  id: 'philosophy_title',
                  label: 'Philosophy Title',
                  type: 'input',
                  placeholder: 'Our Design Philosophy'
                },
                {
                  id: 'philosophy_content',
                  label: 'Philosophy Content',
                  type: 'textarea',
                  rows: 4,
                  placeholder: 'We believe that good design should be accessible...'
                }
              ]}
              sectionKey="about"
              editingSection={editingSection}
              setEditingSection={setEditingSection}
              onContentChange={handleContentChange}
              onSave={saveChanges}
              onCancel={cancelChanges}
              getEffectiveContent={getEffectiveContent}
              hasUnsavedChanges={hasUnsavedChanges}
              isLoading={updateMutation.isPending}
            />
          </TabsContent>

          {/* Services Section */}
          <TabsContent value="services" className="space-y-6">
            <ContentEditor
              title="Services Section"
              description="Service offerings and descriptions"
              sections={[
                {
                  id: 'services_title',
                  label: 'Services Section Title',
                  type: 'input',
                  placeholder: 'Our Services'
                },
                {
                  id: 'services_subtitle',
                  label: 'Services Subtitle',
                  type: 'textarea',
                  rows: 2,
                  placeholder: 'Comprehensive interior design solutions...'
                },
                {
                  id: 'residential_title',
                  label: 'Residential Design Title',
                  type: 'input',
                  placeholder: 'Residential Design'
                },
                {
                  id: 'residential_description',
                  label: 'Residential Design Description',
                  type: 'textarea',
                  rows: 4,
                  placeholder: 'Transform your home into a personal sanctuary...'
                },
                {
                  id: 'commercial_title',
                  label: 'Commercial Design Title',
                  type: 'input',
                  placeholder: 'Commercial Design'
                },
                {
                  id: 'commercial_description',
                  label: 'Commercial Design Description',
                  type: 'textarea',
                  rows: 4,
                  placeholder: 'Create inspiring workspaces that boost productivity...'
                },
                {
                  id: 'consultation_title',
                  label: 'Consultation Title',
                  type: 'input',
                  placeholder: 'Design Consultation'
                },
                {
                  id: 'consultation_description',
                  label: 'Consultation Description',
                  type: 'textarea',
                  rows: 4,
                  placeholder: 'Expert advice to guide your design journey...'
                }
              ]}
              sectionKey="services"
              editingSection={editingSection}
              setEditingSection={setEditingSection}
              onContentChange={handleContentChange}
              onSave={saveChanges}
              onCancel={cancelChanges}
              getEffectiveContent={getEffectiveContent}
              hasUnsavedChanges={hasUnsavedChanges}
              isLoading={updateMutation.isPending}
            />
          </TabsContent>

          {/* Mission Section */}
          <TabsContent value="mission" className="space-y-6">
            <ContentEditor
              title="Mission & Vision"
              description="Company mission and vision statements"
              sections={[
                {
                  id: 'mission_title',
                  label: 'Mission Title',
                  type: 'input',
                  placeholder: 'Our Mission'
                },
                {
                  id: 'mission_content',
                  label: 'Mission Statement',
                  type: 'textarea',
                  rows: 4,
                  placeholder: 'To transform spaces and lives through exceptional design...'
                },
                {
                  id: 'vision_title',
                  label: 'Vision Title',
                  type: 'input',
                  placeholder: 'Our Vision'
                },
                {
                  id: 'vision_content',
                  label: 'Vision Statement',
                  type: 'textarea',
                  rows: 4,
                  placeholder: 'To be the leading interior design company...'
                }
              ]}
              sectionKey="mission"
              editingSection={editingSection}
              setEditingSection={setEditingSection}
              onContentChange={handleContentChange}
              onSave={saveChanges}
              onCancel={cancelChanges}
              getEffectiveContent={getEffectiveContent}
              hasUnsavedChanges={hasUnsavedChanges}
              isLoading={updateMutation.isPending}
            />
          </TabsContent>

          {/* Values Section */}
          <TabsContent value="values" className="space-y-6">
            <ContentEditor
              title="Company Values"
              description="Core values and principles"
              sections={[
                {
                  id: 'values_title',
                  label: 'Values Section Title',
                  type: 'input',
                  placeholder: 'Our Core Values'
                },
                {
                  id: 'value1_title',
                  label: 'Value 1 Title',
                  type: 'input',
                  placeholder: 'Excellence'
                },
                {
                  id: 'value1_description',
                  label: 'Value 1 Description',
                  type: 'textarea',
                  rows: 3,
                  placeholder: 'We strive for excellence in every project...'
                },
                {
                  id: 'value2_title',
                  label: 'Value 2 Title',
                  type: 'input',
                  placeholder: 'Innovation'
                },
                {
                  id: 'value2_description',
                  label: 'Value 2 Description',
                  type: 'textarea',
                  rows: 3,
                  placeholder: 'We embrace innovative design solutions...'
                },
                {
                  id: 'value3_title',
                  label: 'Value 3 Title',
                  type: 'input',
                  placeholder: 'Sustainability'
                },
                {
                  id: 'value3_description',
                  label: 'Value 3 Description',
                  type: 'textarea',
                  rows: 3,
                  placeholder: 'We prioritize sustainable design practices...'
                }
              ]}
              sectionKey="values"
              editingSection={editingSection}
              setEditingSection={setEditingSection}
              onContentChange={handleContentChange}
              onSave={saveChanges}
              onCancel={cancelChanges}
              getEffectiveContent={getEffectiveContent}
              hasUnsavedChanges={hasUnsavedChanges}
              isLoading={updateMutation.isPending}
            />
          </TabsContent>

          {/* Team Section */}
          <TabsContent value="team" className="space-y-6">
            <ContentEditor
              title="Team Information"
              description="Team member descriptions and bios"
              sections={[
                {
                  id: 'team_title',
                  label: 'Team Section Title',
                  type: 'input',
                  placeholder: 'Meet Our Team'
                },
                {
                  id: 'team_subtitle',
                  label: 'Team Subtitle',
                  type: 'textarea',
                  rows: 2,
                  placeholder: 'Our passionate team of design professionals...'
                },
                {
                  id: 'ceo_bio',
                  label: 'CEO Biography',
                  type: 'textarea',
                  rows: 5,
                  placeholder: 'Passionate about creating beautiful spaces...'
                },
                {
                  id: 'manager_bio',
                  label: 'Operations Manager Biography',
                  type: 'textarea',
                  rows: 5,
                  placeholder: 'Ensuring every project runs smoothly...'
                }
              ]}
              sectionKey="team"
              editingSection={editingSection}
              setEditingSection={setEditingSection}
              onContentChange={handleContentChange}
              onSave={saveChanges}
              onCancel={cancelChanges}
              getEffectiveContent={getEffectiveContent}
              hasUnsavedChanges={hasUnsavedChanges}
              isLoading={updateMutation.isPending}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Content Editor Component
interface ContentEditorProps {
  title: string;
  description: string;
  sections: Array<{
    id: string;
    label: string;
    type: 'input' | 'textarea';
    rows?: number;
    placeholder?: string;
  }>;
  sectionKey: string;
  editingSection: string | null;
  setEditingSection: (section: string | null) => void;
  onContentChange: (section: string, field: string, value: string) => void;
  onSave: (section: string) => void;
  onCancel: (section: string) => void;
  getEffectiveContent: (section: string, field: string) => string;
  hasUnsavedChanges: (section: string) => boolean;
  isLoading: boolean;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  title,
  description,
  sections,
  sectionKey,
  editingSection,
  setEditingSection,
  onContentChange,
  onSave,
  onCancel,
  getEffectiveContent,
  hasUnsavedChanges,
  isLoading
}) => {
  const isEditing = editingSection === sectionKey;
  const hasChanges = hasUnsavedChanges(sectionKey);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>{title}</span>
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <div className="flex items-center space-x-2">
            {hasChanges && (
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                <AlertCircle className="w-3 h-3 mr-1" />
                Unsaved changes
              </Badge>
            )}
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingSection(sectionKey)}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancel(sectionKey)}
                  disabled={isLoading}
                >
                  <Undo className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => onSave(sectionKey)}
                  disabled={isLoading || !hasChanges}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {sections.map((section) => (
                <div key={section.id} className="border-l-4 border-gray-200 pl-4">
                  <h4 className="font-medium text-gray-900 mb-2">{section.label}</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {getEffectiveContent(sectionKey, section.id) || section.placeholder}
                  </p>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {sections.map((section) => (
                <div key={section.id} className="space-y-2">
                  <Label htmlFor={section.id}>{section.label}</Label>
                  {section.type === 'input' ? (
                    <Input
                      id={section.id}
                      value={getEffectiveContent(sectionKey, section.id)}
                      onChange={(e) => onContentChange(sectionKey, section.id, e.target.value)}
                      placeholder={section.placeholder}
                      className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <Textarea
                      id={section.id}
                      value={getEffectiveContent(sectionKey, section.id)}
                      onChange={(e) => onContentChange(sectionKey, section.id, e.target.value)}
                      placeholder={section.placeholder}
                      rows={section.rows || 4}
                      className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    />
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default AdminContent;