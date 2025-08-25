import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertNewsletterSchema, adminLoginSchema, insertGalleryImageSchema, insertSiteContentSchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import { upload, processAndUploadImage, deleteImageFromStorage, initializeStorageBucket } from "./imageUpload";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Supabase Storage bucket
  await initializeStorageBucket();

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

  // Admin authentication endpoints
  app.post("/api/admin/login", async (req, res) => {
    try {
      const validatedData = adminLoginSchema.parse(req.body);
      const admin = await storage.getAdmin();
      
      if (!admin || admin.password !== validatedData.password) {
        return res.status(401).json({ 
          message: "Invalid password" 
        });
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

  // Image upload endpoint
  app.post("/api/admin/upload", requireAdmin, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const { category = 'gallery' } = req.body;
      const uploadResult = await processAndUploadImage(req.file.buffer, category);
      
      res.json({
        message: "Image uploaded successfully",
        ...uploadResult
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: "Failed to upload image" });
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

  const httpServer = createServer(app);
  return httpServer;
}
