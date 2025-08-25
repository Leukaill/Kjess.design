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

// Site content schemas
export const insertSiteContentSchema = createInsertSchema(siteContent).pick({
  section: true,
  content: true,
}).extend({
  section: z.enum(["about", "services"]),
  content: z.string().min(1, "Content is required"),
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
