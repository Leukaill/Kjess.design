import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").default(""),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsletters = pgTable("newsletters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin authentication table
export const admin = pgTable("admin", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique().default("admin"),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Gallery images table for admin management
export const galleryImages = pgTable("gallery_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(), // 'residential', 'commercial', 'furniture'
  subcategory: text("subcategory").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(), // Supabase Storage URL
  thumbnailUrl: text("thumbnail_url"), // Optimized thumbnail URL
  projectDate: text("project_date"),
  location: text("location"),
  featured: boolean("featured").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content management table for editable website content
export const siteContent = pgTable("site_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  section: text("section").notNull().unique(), // 'about', 'services', etc.
  content: text("content").notNull(), // JSON string or HTML content
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  phone: true,
  message: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  phone: z.string().optional().default(""),
});

export const insertNewsletterSchema = createInsertSchema(newsletters).pick({
  email: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
});

// Admin schemas
export const insertAdminSchema = createInsertSchema(admin).pick({
  username: true,
  password: true,
});

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

// Gallery image schemas
export const insertGalleryImageSchema = createInsertSchema(galleryImages).pick({
  title: true,
  category: true,
  subcategory: true,
  description: true,
  imageUrl: true,
  thumbnailUrl: true,
  projectDate: true,
  location: true,
  featured: true,
  sortOrder: true,
}).extend({
  title: z.string().min(1, "Title is required"),
  category: z.enum(["residential", "commercial", "furniture"]),
  subcategory: z.string().min(1, "Subcategory is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().url("Must be a valid URL"),
  thumbnailUrl: z.string().url("Must be a valid URL").optional(),
  projectDate: z.string().optional(),
  location: z.string().optional(),
  featured: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
});

// AI Chatbot tables
export const chatConversations = pgTable("chat_conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(), // For anonymous users
  userEmail: text("user_email"), // Optional for registered users
  userName: text("user_name"), // Optional for registered users
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => chatConversations.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  isFromUser: boolean("is_from_user").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const chatSettings = pgTable("chat_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  isEnabled: boolean("is_enabled").default(true),
  welcomeMessage: text("welcome_message").default("Hello! I'm Jasper, your friendly assistant. How can I help you with your interior design needs today?"),
  tone: text("tone").default("professional"), // professional, friendly, casual
  restrictToRelevantTopics: boolean("restrict_to_relevant_topics").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chatKnowledgeBase = pgTable("chat_knowledge_base", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // services, portfolio, pricing, faq, etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Site content schemas
export const insertSiteContentSchema = createInsertSchema(siteContent).pick({
  section: true,
  content: true,
}).extend({
  section: z.enum(["about", "services"]),
  content: z.string().min(1, "Content is required"),
});

// Chat schemas
export const insertChatConversationSchema = createInsertSchema(chatConversations).pick({
  sessionId: true,
  userEmail: true,
  userName: true,
}).extend({
  sessionId: z.string().min(1, "Session ID is required"),
  userEmail: z.string().email().optional(),
  userName: z.string().optional(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  conversationId: true,
  message: true,
  isFromUser: true,
}).extend({
  conversationId: z.string().min(1, "Conversation ID is required"),
  message: z.string().min(1, "Message cannot be empty"),
  isFromUser: z.boolean(),
});

export const updateChatSettingsSchema = createInsertSchema(chatSettings).pick({
  isEnabled: true,
  welcomeMessage: true,
  tone: true,
  restrictToRelevantTopics: true,
}).extend({
  isEnabled: z.boolean(),
  welcomeMessage: z.string().min(1, "Welcome message is required"),
  tone: z.enum(["professional", "friendly", "casual"]),
  restrictToRelevantTopics: z.boolean(),
});

export const insertKnowledgeBaseSchema = createInsertSchema(chatKnowledgeBase).pick({
  title: true,
  content: true,
  category: true,
  isActive: true,
}).extend({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  isActive: z.boolean().optional().default(true),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type Newsletter = typeof newsletters.$inferSelect;

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admin.$inferSelect;
export type AdminLogin = z.infer<typeof adminLoginSchema>;

export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type GalleryImage = typeof galleryImages.$inferSelect;

export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type SiteContent = typeof siteContent.$inferSelect;

// Chat types
export type InsertChatConversation = z.infer<typeof insertChatConversationSchema>;
export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type UpdateChatSettings = z.infer<typeof updateChatSettingsSchema>;
export type ChatSettings = typeof chatSettings.$inferSelect;
export type InsertKnowledgeBase = z.infer<typeof insertKnowledgeBaseSchema>;
export type KnowledgeBase = typeof chatKnowledgeBase.$inferSelect;
