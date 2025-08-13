import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertNewsletterSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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
