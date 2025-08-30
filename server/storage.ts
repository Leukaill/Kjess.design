import { type User, type InsertUser, type Contact, type InsertContact, type Newsletter, type InsertNewsletter, type Admin, type InsertAdmin, type GalleryImage, type InsertGalleryImage, type SiteContent, type InsertSiteContent, type ChatConversation, type InsertChatConversation, type ChatMessage, type InsertChatMessage, type ChatSettings, type UpdateChatSettings, type KnowledgeBase, type InsertKnowledgeBase, users, contacts, newsletters, admin, galleryImages, siteContent, chatConversations, chatMessages, chatSettings, chatKnowledgeBase } from "@shared/schema";
import { randomUUID } from "crypto";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  
  createNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  getNewsletters(): Promise<Newsletter[]>;
  getNewsletterByEmail(email: string): Promise<Newsletter | undefined>;
  
  // Admin authentication
  getAdmin(): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  updateAdminPassword(password: string): Promise<Admin>;
  checkAdminExists(): Promise<boolean>;
  verifyAdminPassword(password: string): Promise<boolean>;
  
  // Gallery management
  getGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImage(id: string): Promise<GalleryImage | undefined>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: string, image: Partial<InsertGalleryImage>): Promise<GalleryImage>;
  deleteGalleryImage(id: string): Promise<boolean>;
  reorderGalleryImages(imageOrders: { id: string; sortOrder: number }[]): Promise<boolean>;
  
  // Site content management
  getSiteContent(section: string): Promise<SiteContent | undefined>;
  getAllSiteContent(): Promise<SiteContent[]>;
  updateSiteContent(section: string, content: string): Promise<SiteContent>;
  
  // Chat functionality
  createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation>;
  getChatConversation(id: string): Promise<ChatConversation | undefined>;
  getChatConversations(): Promise<ChatConversation[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(conversationId: string): Promise<ChatMessage[]>;
  
  // Chat settings
  getChatSettings(): Promise<ChatSettings | undefined>;
  updateChatSettings(settings: UpdateChatSettings): Promise<ChatSettings>;
  
  // Knowledge base
  getKnowledgeBase(): Promise<KnowledgeBase[]>;
  createKnowledgeBase(item: InsertKnowledgeBase): Promise<KnowledgeBase>;
  updateKnowledgeBase(id: string, item: Partial<InsertKnowledgeBase>): Promise<KnowledgeBase>;
  deleteKnowledgeBase(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contacts: Map<string, Contact>;
  private newsletters: Map<string, Newsletter>;
  private adminData: Admin | null = null;
  private galleryImagesData: Map<string, GalleryImage>;
  private siteContentData: Map<string, SiteContent>;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.newsletters = new Map();
    this.galleryImagesData = new Map();
    this.siteContentData = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      ...insertContact, 
      id,
      phone: insertContact.phone || null,
      createdAt: new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async createNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const id = randomUUID();
    const newsletter: Newsletter = { 
      ...insertNewsletter, 
      id,
      createdAt: new Date()
    };
    this.newsletters.set(id, newsletter);
    return newsletter;
  }

  async getNewsletters(): Promise<Newsletter[]> {
    return Array.from(this.newsletters.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getNewsletterByEmail(email: string): Promise<Newsletter | undefined> {
    return Array.from(this.newsletters.values()).find(
      (newsletter) => newsletter.email === email,
    );
  }

  // Admin authentication methods
  async getAdmin(): Promise<Admin | undefined> {
    return this.adminData || undefined;
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = randomUUID();
    const newAdmin: Admin = { 
      ...insertAdmin, 
      id, 
      username: "admin",
      createdAt: new Date() 
    };
    this.adminData = newAdmin;
    return newAdmin;
  }

  async updateAdminPassword(password: string): Promise<Admin> {
    if (!this.adminData) {
      throw new Error("Admin not found");
    }
    this.adminData.password = password;
    return this.adminData;
  }

  async checkAdminExists(): Promise<boolean> {
    return this.adminData !== null;
  }

  async verifyAdminPassword(password: string): Promise<boolean> {
    if (!this.adminData) {
      return false;
    }
    return this.adminData.password === password;
  }

  // Gallery management methods
  async getGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryImagesData.values()).sort(
      (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
    );
  }

  async getGalleryImage(id: string): Promise<GalleryImage | undefined> {
    return this.galleryImagesData.get(id);
  }

  async createGalleryImage(insertImage: InsertGalleryImage): Promise<GalleryImage> {
    const id = randomUUID();
    const image: GalleryImage = { 
      ...insertImage,
      thumbnailUrl: insertImage.thumbnailUrl || null,
      projectDate: insertImage.projectDate || null,
      location: insertImage.location || null,
      featured: insertImage.featured || false,
      sortOrder: insertImage.sortOrder || 0,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.galleryImagesData.set(id, image);
    return image;
  }

  async updateGalleryImage(id: string, updateData: Partial<InsertGalleryImage>): Promise<GalleryImage> {
    const existing = this.galleryImagesData.get(id);
    if (!existing) {
      throw new Error("Gallery image not found");
    }
    const updated: GalleryImage = { 
      ...existing, 
      ...updateData, 
      id, 
      updatedAt: new Date() 
    };
    this.galleryImagesData.set(id, updated);
    return updated;
  }

  async deleteGalleryImage(id: string): Promise<boolean> {
    return this.galleryImagesData.delete(id);
  }

  async reorderGalleryImages(imageOrders: { id: string; sortOrder: number }[]): Promise<boolean> {
    try {
      for (const order of imageOrders) {
        const existing = this.galleryImagesData.get(order.id);
        if (existing) {
          existing.sortOrder = order.sortOrder;
          existing.updatedAt = new Date();
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  // Site content management methods
  async getSiteContent(section: string): Promise<SiteContent | undefined> {
    return this.siteContentData.get(section);
  }

  async getAllSiteContent(): Promise<SiteContent[]> {
    return Array.from(this.siteContentData.values());
  }

  async updateSiteContent(section: string, content: string): Promise<SiteContent> {
    const existing = this.siteContentData.get(section);
    const id = existing?.id || randomUUID();
    const siteContentItem: SiteContent = {
      id,
      section,
      content,
      updatedAt: new Date()
    };
    this.siteContentData.set(section, siteContentItem);
    return siteContentItem;
  }

  // Chat functionality methods (MemStorage implementation)
  async createChatConversation(insertConversation: InsertChatConversation): Promise<ChatConversation> {
    throw new Error("Chat functionality requires database storage");
  }

  async getChatConversation(id: string): Promise<ChatConversation | undefined> {
    throw new Error("Chat functionality requires database storage");
  }

  async getChatConversations(): Promise<ChatConversation[]> {
    throw new Error("Chat functionality requires database storage");
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    throw new Error("Chat functionality requires database storage");
  }

  async getChatMessages(conversationId: string): Promise<ChatMessage[]> {
    throw new Error("Chat functionality requires database storage");
  }

  async getChatSettings(): Promise<ChatSettings | undefined> {
    throw new Error("Chat functionality requires database storage");
  }

  async updateChatSettings(settings: UpdateChatSettings): Promise<ChatSettings> {
    throw new Error("Chat functionality requires database storage");
  }

  async getKnowledgeBase(): Promise<KnowledgeBase[]> {
    throw new Error("Chat functionality requires database storage");
  }

  async createKnowledgeBase(insertItem: InsertKnowledgeBase): Promise<KnowledgeBase> {
    throw new Error("Chat functionality requires database storage");
  }

  async updateKnowledgeBase(id: string, updateData: Partial<InsertKnowledgeBase>): Promise<KnowledgeBase> {
    throw new Error("Chat functionality requires database storage");
  }

  async deleteKnowledgeBase(id: string): Promise<boolean> {
    throw new Error("Chat functionality requires database storage");
  }
}

// Database storage implementation using Drizzle ORM
export class DatabaseStorage implements IStorage {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is required for production storage");
    }
    
    // Log database connection (without password) for debugging
    const connectionInfo = process.env.DATABASE_URL.split('@')[1] || 'unknown';
    console.log("✅ Connecting to database:", connectionInfo);
    console.log("🔍 Full DATABASE_URL pattern:", process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@'));
    
    // Verify we're not connecting to Replit's default database
    if (connectionInfo.includes('helium')) {
      console.warn("⚠️  WARNING: Connecting to heliumdb - check your .env configuration!");
    }
    
    const sql = postgres(process.env.DATABASE_URL);
    this.db = drizzle(sql);
  }

  // User methods (existing)
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Contact methods (existing)
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const result = await this.db.insert(contacts).values(insertContact).returning();
    return result[0];
  }

  async getContacts(): Promise<Contact[]> {
    return await this.db.select().from(contacts).orderBy(contacts.createdAt);
  }

  // Newsletter methods (existing)
  async createNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const result = await this.db.insert(newsletters).values(insertNewsletter).returning();
    return result[0];
  }

  async getNewsletters(): Promise<Newsletter[]> {
    return await this.db.select().from(newsletters).orderBy(newsletters.createdAt);
  }

  async getNewsletterByEmail(email: string): Promise<Newsletter | undefined> {
    const result = await this.db.select().from(newsletters).where(eq(newsletters.email, email)).limit(1);
    return result[0];
  }

  // Admin authentication methods
  async getAdmin(): Promise<Admin | undefined> {
    const result = await this.db.select().from(admin).limit(1);
    return result[0];
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const result = await this.db.insert(admin).values(insertAdmin).returning();
    return result[0];
  }

  async updateAdminPassword(password: string): Promise<Admin> {
    const result = await this.db.update(admin).set({ password }).returning();
    if (!result[0]) {
      throw new Error("Admin not found");
    }
    return result[0];
  }

  async checkAdminExists(): Promise<boolean> {
    const result = await this.db.select().from(admin).limit(1);
    return result.length > 0;
  }

  async verifyAdminPassword(password: string): Promise<boolean> {
    const result = await this.db.select().from(admin).where(eq(admin.password, password)).limit(1);
    return result.length > 0;
  }

  // Gallery management methods
  async getGalleryImages(): Promise<GalleryImage[]> {
    return await this.db.select().from(galleryImages).orderBy(galleryImages.sortOrder);
  }

  async getGalleryImage(id: string): Promise<GalleryImage | undefined> {
    const result = await this.db.select().from(galleryImages).where(eq(galleryImages.id, id)).limit(1);
    return result[0];
  }

  async createGalleryImage(insertImage: InsertGalleryImage): Promise<GalleryImage> {
    const result = await this.db.insert(galleryImages).values(insertImage).returning();
    return result[0];
  }

  async updateGalleryImage(id: string, updateData: Partial<InsertGalleryImage>): Promise<GalleryImage> {
    const result = await this.db.update(galleryImages)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(galleryImages.id, id))
      .returning();
    if (!result[0]) {
      throw new Error("Gallery image not found");
    }
    return result[0];
  }

  async deleteGalleryImage(id: string): Promise<boolean> {
    const result = await this.db.delete(galleryImages).where(eq(galleryImages.id, id)).returning();
    return result.length > 0;
  }

  async reorderGalleryImages(imageOrders: { id: string; sortOrder: number }[]): Promise<boolean> {
    try {
      for (const order of imageOrders) {
        await this.db.update(galleryImages)
          .set({ sortOrder: order.sortOrder, updatedAt: new Date() })
          .where(eq(galleryImages.id, order.id));
      }
      return true;
    } catch {
      return false;
    }
  }

  // Site content management methods
  async getSiteContent(section: string): Promise<SiteContent | undefined> {
    const result = await this.db.select().from(siteContent).where(eq(siteContent.section, section)).limit(1);
    return result[0];
  }

  async getAllSiteContent(): Promise<SiteContent[]> {
    return await this.db.select().from(siteContent);
  }

  async updateSiteContent(section: string, content: string): Promise<SiteContent> {
    const existing = await this.getSiteContent(section);
    
    if (existing) {
      const result = await this.db.update(siteContent)
        .set({ content, updatedAt: new Date() })
        .where(eq(siteContent.section, section))
        .returning();
      return result[0];
    } else {
      const result = await this.db.insert(siteContent)
        .values({ section, content })
        .returning();
      return result[0];
    }
  }

  // Chat functionality methods
  async createChatConversation(insertConversation: InsertChatConversation): Promise<ChatConversation> {
    const result = await this.db.insert(chatConversations).values(insertConversation).returning();
    return result[0];
  }

  async getChatConversation(id: string): Promise<ChatConversation | undefined> {
    const result = await this.db.select().from(chatConversations).where(eq(chatConversations.id, id)).limit(1);
    return result[0];
  }

  async getChatConversations(): Promise<ChatConversation[]> {
    return await this.db.select().from(chatConversations).orderBy(chatConversations.createdAt);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const result = await this.db.insert(chatMessages).values(insertMessage).returning();
    return result[0];
  }

  async getChatMessages(conversationId: string): Promise<ChatMessage[]> {
    return await this.db.select().from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(chatMessages.timestamp);
  }

  // Chat settings methods
  async getChatSettings(): Promise<ChatSettings | undefined> {
    const result = await this.db.select().from(chatSettings).limit(1);
    return result[0];
  }

  async updateChatSettings(settings: UpdateChatSettings): Promise<ChatSettings> {
    const existing = await this.getChatSettings();
    
    if (existing) {
      const result = await this.db.update(chatSettings)
        .set({ ...settings, updatedAt: new Date() })
        .where(eq(chatSettings.id, existing.id))
        .returning();
      return result[0];
    } else {
      const result = await this.db.insert(chatSettings)
        .values({ ...settings })
        .returning();
      return result[0];
    }
  }

  // Knowledge base methods
  async getKnowledgeBase(): Promise<KnowledgeBase[]> {
    return await this.db.select().from(chatKnowledgeBase)
      .where(eq(chatKnowledgeBase.isActive, true))
      .orderBy(chatKnowledgeBase.category, chatKnowledgeBase.title);
  }

  async createKnowledgeBase(insertItem: InsertKnowledgeBase): Promise<KnowledgeBase> {
    const result = await this.db.insert(chatKnowledgeBase).values(insertItem).returning();
    return result[0];
  }

  async updateKnowledgeBase(id: string, updateData: Partial<InsertKnowledgeBase>): Promise<KnowledgeBase> {
    const result = await this.db.update(chatKnowledgeBase)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(chatKnowledgeBase.id, id))
      .returning();
    if (!result[0]) {
      throw new Error("Knowledge base item not found");
    }
    return result[0];
  }

  async deleteKnowledgeBase(id: string): Promise<boolean> {
    const result = await this.db.delete(chatKnowledgeBase).where(eq(chatKnowledgeBase.id, id)).returning();
    return result.length > 0;
  }
}

// CRITICAL: Lazy initialization to ensure environment variables are loaded first
// This prevents DatabaseStorage from being instantiated before environment variables are properly set
// DO NOT CHANGE this to direct instantiation - it will cause database connection issues
let _storage: IStorage | null = null;

// Force storage reinitialization by clearing cache
export function clearStorageCache() {
  _storage = null;
  console.log('🔄 Storage cache cleared - will reinitialize with latest environment variables');
}

export function getStorage(): IStorage {
  if (!_storage) {
    const databaseUrl = process.env.DATABASE_URL;
    console.log('🔧 Storage initialization - DATABASE_URL present:', !!databaseUrl);
    console.log('🔧 Using storage type:', databaseUrl ? 'DatabaseStorage' : 'MemStorage');
    
    _storage = databaseUrl 
      ? new DatabaseStorage() 
      : new MemStorage();
  }
  return _storage;
}

// Proxy-based storage export to maintain lazy initialization
// This ensures proper loading order: index.ts → env setup → storage initialization
export const storage = new Proxy({} as IStorage, {
  get(target, prop, receiver) {
    return Reflect.get(getStorage(), prop, receiver);
  }
});
