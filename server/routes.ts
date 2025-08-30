import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertNewsletterSchema, adminLoginSchema, insertGalleryImageSchema, insertSiteContentSchema, insertChatConversationSchema, insertChatMessageSchema, updateChatSettingsSchema, insertKnowledgeBaseSchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import { upload, processAndUploadImage, deleteImageFromStorage, initializeStorageBucket } from "./imageUpload";
import postgres from "postgres";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Supabase Storage bucket
  await initializeStorageBucket();
  
  console.log('🛠️ Registering API routes...');

  // Session middleware for admin authentication
  app.use(session({
    secret: process.env.SESSION_SECRET || 'kjess-admin-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Check if admin exists
  app.get('/api/admin/exists', async (req, res) => {
    console.log('🔍 API route hit: /api/admin/exists');
    try {
      const adminExists = await storage.checkAdminExists();
      res.json({ exists: adminExists });
    } catch (error) {
      console.error('Admin exists check error:', error);
      res.status(500).json({ message: 'Failed to check admin status' });
    }
  });

  // Admin setup (initial password creation)
  app.post('/api/admin/setup', async (req, res) => {
    try {
      const { password, username } = req.body;
      
      if (!password || !username) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      // Check if admin already exists
      const adminExists = await storage.checkAdminExists();
      if (adminExists) {
        return res.status(409).json({ message: 'Admin account already exists' });
      }

      // Create admin account
      const admin = await storage.createAdmin({ username, password });
      
      // Set session
      (req.session as any).adminId = admin.id;
      
      res.json({ 
        message: 'Admin account created successfully',
        admin: { 
          id: admin.id,
          username: admin.username 
        } 
      });
    } catch (error) {
      console.error('Admin setup error:', error);
      res.status(500).json({ message: 'Setup failed' });
    }
  });

  // Admin authentication endpoints
  app.post("/api/admin/login", async (req, res) => {
    try {
      const validatedData = adminLoginSchema.parse(req.body);
      
      // Check if admin exists
      const adminExists = await storage.checkAdminExists();
      if (!adminExists) {
        return res.status(404).json({ message: 'No admin account found. Please set up an admin account first.' });
      }

      // Verify password
      const isValidPassword = await storage.verifyAdminPassword(validatedData.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      // Get admin details
      const admin = await storage.getAdmin();
      if (!admin) {
        return res.status(500).json({ message: 'Admin account error' });
      }

      // Set session
      (req.session as any).adminId = admin.id;
      res.json({ 
        message: "Login successful",
        admin: { id: admin.id, username: admin.username }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid login data",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Login failed" });
      }
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/admin/check", async (req, res) => {
    const adminId = (req.session as any)?.adminId;
    if (!adminId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const admin = await storage.getAdmin();
      if (!admin || admin.id !== adminId) {
        return res.status(401).json({ message: "Invalid session" });
      }

      res.json({ 
        authenticated: true, 
        admin: { id: admin.id, username: admin.username }
      });
    } catch (error) {
      res.status(500).json({ message: "Authentication check failed" });
    }
  });

  // Middleware to check admin authentication
  const requireAdmin = async (req: any, res: any, next: any) => {
    const adminId = req.session?.adminId;
    if (!adminId) {
      return res.status(401).json({ message: "Admin authentication required" });
    }

    try {
      const admin = await storage.getAdmin();
      if (!admin || admin.id !== adminId) {
        return res.status(401).json({ message: "Invalid admin session" });
      }
      req.admin = admin;
      next();
    } catch (error) {
      res.status(500).json({ message: "Authentication failed" });
    }
  };

  // Gallery management endpoints
  app.get("/api/admin/gallery", requireAdmin, async (req, res) => {
    try {
      const images = await storage.getGalleryImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gallery images" });
    }
  });

  app.post("/api/admin/gallery", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertGalleryImageSchema.parse(req.body);
      const image = await storage.createGalleryImage(validatedData);
      res.status(201).json(image);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid image data",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Failed to create gallery image" });
      }
    }
  });

  app.put("/api/admin/gallery/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertGalleryImageSchema.partial().parse(req.body);
      const image = await storage.updateGalleryImage(id, updateData);
      res.json(image);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid image data",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Failed to update gallery image" });
      }
    }
  });

  app.delete("/api/admin/gallery/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get image details before deletion to clean up storage
      const image = await storage.getGalleryImage(id);
      if (image) {
        // Delete from storage
        await deleteImageFromStorage(image.imageUrl);
        if (image.thumbnailUrl) {
          await deleteImageFromStorage(image.thumbnailUrl);
        }
      }
      
      const success = await storage.deleteGalleryImage(id);
      if (success) {
        res.json({ message: "Gallery image deleted successfully" });
      } else {
        res.status(404).json({ message: "Gallery image not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete gallery image" });
    }
  });

  // Image upload endpoint - Now automatically creates gallery entries
  app.post("/api/admin/upload", requireAdmin, upload.single('image'), async (req, res) => {
    try {
      console.log('📤 Upload request received');
      console.log('📁 File info:', req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'No file');
      console.log('📋 Form data:', req.body);

      if (!req.file) {
        console.log('❌ No file provided');
        return res.status(400).json({ message: "No image file provided" });
      }

      const { 
        category = 'residential',
        title,
        subcategory,
        description,
        projectDate,
        location,
        featured = false
      } = req.body;
      
      console.log('🔄 Processing image upload...');
      
      // Upload the image first
      const uploadResult = await processAndUploadImage(req.file.buffer, 'gallery');
      
      console.log('✅ Image processing completed:', uploadResult);
      
      // Create gallery entry automatically if required fields are provided
      if (title && subcategory && description) {
        console.log('📊 Creating gallery entry...');
        
        const galleryImageData = {
          title,
          category,
          subcategory,
          description,
          imageUrl: uploadResult.originalUrl,
          thumbnailUrl: uploadResult.thumbnailUrl,
          projectDate: projectDate || null,
          location: location || null,
          featured: featured === 'true' || featured === true,
          sortOrder: 0
        };

        const galleryImage = await storage.createGalleryImage(galleryImageData);
        
        console.log('✅ Gallery entry created successfully:', galleryImage.id);
        
        res.json({
          message: "Image uploaded and gallery entry created successfully",
          upload: uploadResult,
          galleryImage
        });
      } else {
        console.log('ℹ️  Image uploaded without gallery entry (missing required fields)');
        
        res.json({
          message: "Image uploaded successfully",
          ...uploadResult
        });
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ 
        message: "Failed to upload image", 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  });

  // Bulk image reorder endpoint
  app.put("/api/admin/gallery/reorder", requireAdmin, async (req, res) => {
    try {
      const { imageOrders } = req.body;
      if (!Array.isArray(imageOrders)) {
        return res.status(400).json({ message: "Invalid image order data" });
      }

      const success = await storage.reorderGalleryImages(imageOrders);
      if (success) {
        res.json({ message: "Gallery images reordered successfully" });
      } else {
        res.status(500).json({ message: "Failed to reorder gallery images" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to reorder gallery images" });
    }
  });

  // Site content management endpoints
  app.get("/api/admin/content", requireAdmin, async (req, res) => {
    try {
      const content = await storage.getAllSiteContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch site content" });
    }
  });

  app.put("/api/admin/content/:section", requireAdmin, async (req, res) => {
    try {
      const { section } = req.params;
      const { content } = insertSiteContentSchema.parse({ section, content: req.body.content });
      const updated = await storage.updateSiteContent(section, content);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid content data",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Failed to update site content" });
      }
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json({ 
        message: "Thank you for your message! We'll get back to you soon.",
        contact 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Please check your form inputs",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Failed to submit contact form" });
      }
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter", async (req, res) => {
    try {
      const validatedData = insertNewsletterSchema.parse(req.body);
      
      // Check if email already exists
      const existing = await storage.getNewsletterByEmail(validatedData.email);
      if (existing) {
        return res.status(409).json({ 
          message: "Email already subscribed to our newsletter" 
        });
      }

      const newsletter = await storage.createNewsletter(validatedData);
      res.status(201).json({ 
        message: "Successfully subscribed to our newsletter!",
        newsletter 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Please enter a valid email address",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Failed to subscribe to newsletter" });
      }
    }
  });

  // Get all contacts (admin endpoint)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  // Get all newsletters (admin endpoint)
  app.get("/api/newsletters", async (req, res) => {
    try {
      const newsletters = await storage.getNewsletters();
      res.json(newsletters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch newsletter subscriptions" });
    }
  });

  // Public gallery endpoint for frontend
  app.get("/api/gallery/public", async (req, res) => {
    try {
      const images = await storage.getGalleryImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gallery images" });
    }
  });

  // ===== CHAT API ROUTES =====
  
  // Debug route to check table existence and create missing tables
  app.get("/api/debug/setup-chat", async (req, res) => {
    try {
      // Use raw SQL to check what tables exist and create missing ones
      const sql = postgres(process.env.DATABASE_URL!);
      
      // Check existing tables
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `;
      
      console.log('📋 Existing tables:', tables.map(t => t.table_name));
      
      // Create all chat tables if they don't exist
      await sql`
        CREATE TABLE IF NOT EXISTS chat_settings (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          is_enabled BOOLEAN DEFAULT true,
          welcome_message TEXT DEFAULT 'Hello! How can I help you with your interior design needs today?',
          tone TEXT DEFAULT 'professional',
          restrict_to_relevant_topics BOOLEAN DEFAULT true,
          updated_at TIMESTAMP DEFAULT now()
        )
      `;
      
      await sql`
        CREATE TABLE IF NOT EXISTS chat_conversations (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id TEXT NOT NULL,
          user_email TEXT,
          user_name TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT now(),
          updated_at TIMESTAMP DEFAULT now()
        )
      `;
      
      await sql`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          conversation_id VARCHAR NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
          message TEXT NOT NULL,
          is_from_user BOOLEAN NOT NULL,
          timestamp TIMESTAMP DEFAULT now()
        )
      `;
      
      await sql`
        CREATE TABLE IF NOT EXISTS chat_knowledge_base (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          category TEXT NOT NULL,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT now(),
          updated_at TIMESTAMP DEFAULT now()
        )
      `;
      
      // Insert default settings if none exist
      await sql`
        INSERT INTO chat_settings (is_enabled, welcome_message, tone, restrict_to_relevant_topics)
        SELECT true, 'Hello! I''m KJESS AI Assistant. How can I help you with your interior design needs today?', 'professional', true
        WHERE NOT EXISTS (SELECT 1 FROM chat_settings)
      `;
      
      const afterTables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `;
      
      res.json({ 
        before: tables.map(t => t.table_name),
        after: afterTables.map(t => t.table_name),
        message: "Chat tables setup completed"
      });
      
    } catch (error) {
      console.error('❌ Debug setup error:', error);
      res.status(500).json({ message: "Failed to setup tables", error: String(error) });
    }
  });
  
  // Get chat settings (public)
  app.get("/api/chat/settings", async (req, res) => {
    try {
      console.log('🔍 Attempting to get chat settings...');
      const settings = await storage.getChatSettings();
      console.log('✅ Chat settings retrieved:', settings ? 'found' : 'not found');
      
      if (!settings) {
        // Return default settings if none exist
        console.log('📝 Returning default settings');
        res.json({
          isEnabled: true,
          welcomeMessage: "Hello! I'm Jasper, your friendly assistant. How can I help you with your interior design needs today?",
          tone: "professional"
        });
      } else {
        console.log('📝 Returning database settings');
        res.json({
          isEnabled: settings.isEnabled,
          welcomeMessage: settings.welcomeMessage,
          tone: settings.tone
        });
      }
    } catch (error) {
      console.error('❌ Chat settings error:', error);
      res.status(500).json({ message: "Failed to fetch chat settings" });
    }
  });

  // Start a new chat conversation
  app.post("/api/chat/start", async (req, res) => {
    try {
      console.log('🔍 Creating chat conversation with:', req.body);
      const { sessionId, userEmail, userName } = insertChatConversationSchema.parse(req.body);
      const conversation = await storage.createChatConversation({ sessionId, userEmail, userName });
      console.log('✅ Chat conversation created:', conversation.id);
      res.status(201).json(conversation);
    } catch (error) {
      console.error('❌ Chat conversation creation error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid conversation data",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Failed to start conversation" });
      }
    }
  });

  // Send a chat message and get AI response
  app.post("/api/chat/message", async (req, res) => {
    try {
      const { conversationId, message, isFromUser } = insertChatMessageSchema.parse(req.body);
      
      // Save user message
      await storage.createChatMessage({ conversationId, message, isFromUser });
      
      if (isFromUser) {
        // Get conversation history
        const messages = await storage.getChatMessages(conversationId);
        
        // Get AI context
        const settings = await storage.getChatSettings();
        const knowledgeBase = await storage.getKnowledgeBase();
        const siteContent = await storage.getAllSiteContent();
        
        // Build context
        const companyContext = siteContent.map(content => `${content.section}: ${content.content}`).join('\n\n');
        const knowledgeContext = knowledgeBase.map(kb => `${kb.title}: ${kb.content}`).join('\n\n');
        
        // Generate AI response
        const { generateChatResponse } = await import("./gemini");
        const aiResponse = await generateChatResponse(
          message,
          messages.map(m => ({ message: m.message, isFromUser: m.isFromUser })),
          companyContext,
          knowledgeContext,
          settings?.tone || "professional"
        );
        
        // Parse action buttons from AI response
        let cleanMessage = aiResponse.message;
        let actionButton = null;
        
        // Check for WhatsApp button command
        const whatsappMatch = aiResponse.message.match(/WHATSAPP_BUTTON:([^:]+):(.+)/);
        if (whatsappMatch) {
          const [fullMatch, label, url] = whatsappMatch;
          actionButton = {
            type: 'whatsapp' as const,
            label: label.trim(),
            action: url.trim()
          };
          cleanMessage = aiResponse.message.replace(fullMatch, '').trim();
        }
        
        // Save AI response
        const aiMessage = await storage.createChatMessage({
          conversationId,
          message: cleanMessage,
          isFromUser: false
        });
        
        res.json({
          userMessage: { conversationId, message, isFromUser },
          aiMessage: {
            ...aiMessage,
            actionButton
          },
          suggestedAction: aiResponse.suggestedAction
        });
      } else {
        // If it's not from user, just save the message
        const savedMessage = await storage.createChatMessage({ conversationId, message, isFromUser });
        res.json(savedMessage);
      }
    } catch (error) {
      console.error("Chat message error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid message data",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Failed to process message" });
      }
    }
  });

  // Get conversation messages
  app.get("/api/chat/conversation/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getChatMessages(id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversation messages" });
    }
  });

  // ===== ADMIN CHAT MANAGEMENT =====
  
  // Get all conversations (admin)
  app.get("/api/admin/chat/conversations", requireAdmin, async (req, res) => {
    try {
      const conversations = await storage.getChatConversations();
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Get conversation messages (admin)
  app.get("/api/admin/chat/conversations/:id/messages", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getChatMessages(id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversation messages" });
    }
  });

  // Get chat settings (admin)
  app.get("/api/admin/chat/settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getChatSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat settings" });
    }
  });

  // Update chat settings (admin)
  app.put("/api/admin/chat/settings", requireAdmin, async (req, res) => {
    try {
      const validatedData = updateChatSettingsSchema.parse(req.body);
      const settings = await storage.updateChatSettings(validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid settings data",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Failed to update chat settings" });
      }
    }
  });

  // Knowledge base endpoints (admin)
  app.get("/api/admin/chat/knowledge", requireAdmin, async (req, res) => {
    try {
      const knowledge = await storage.getKnowledgeBase();
      res.json(knowledge);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch knowledge base" });
    }
  });

  app.post("/api/admin/chat/knowledge", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertKnowledgeBaseSchema.parse(req.body);
      const knowledge = await storage.createKnowledgeBase(validatedData);
      res.status(201).json(knowledge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid knowledge base data",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Failed to create knowledge base item" });
      }
    }
  });

  app.put("/api/admin/chat/knowledge/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertKnowledgeBaseSchema.partial().parse(req.body);
      const knowledge = await storage.updateKnowledgeBase(id, updateData);
      res.json(knowledge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid knowledge base data",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Failed to update knowledge base item" });
      }
    }
  });

  app.delete("/api/admin/chat/knowledge/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteKnowledgeBase(id);
      if (success) {
        res.json({ message: "Knowledge base item deleted successfully" });
      } else {
        res.status(404).json({ message: "Knowledge base item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete knowledge base item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
