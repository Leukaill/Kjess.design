// ⚠️⚠️⚠️ CRITICAL WARNING - DO NOT MODIFY THIS SECTION ⚠️⚠️⚠️
// 
// The next 15 lines contain database configuration protection that MUST NOT be changed.
// Modifying this will break Supabase connection and cause data loss.
// If you need to make changes, consult replit.md first!
// 
// ⚠️⚠️⚠️ CRITICAL WARNING - DO NOT MODIFY THIS SECTION ⚠️⚠️⚠️

import dotenv from "dotenv";
import path from "path";

// Load environment variables first with explicit path
const envPath = path.resolve(process.cwd(), '.env');
console.log('🔍 Loading .env from:', envPath);
dotenv.config({ path: envPath });

// Use Replit's provided DATABASE_URL (comment out Supabase override for Replit migration)
// delete process.env.DATABASE_URL;
// dotenv.config({ path: envPath });
// ⚠️ END CRITICAL SECTION - DO NOT MODIFY ABOVE ⚠️

// Debug environment loading
console.log('🔍 Environment variables loaded:');
console.log('DATABASE_URL length:', (process.env.DATABASE_URL || '').length);
console.log('SUPABASE_URL length:', (process.env.SUPABASE_URL || '').length);
console.log('SESSION_SECRET length:', (process.env.SESSION_SECRET || '').length);

// Clear storage cache to force reinitialization with new environment variables
clearStorageCache();

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { clearStorageCache, storage } from "./storage";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Serve uploaded images from attached_assets/uploads
app.use('/assets/uploads', express.static(path.resolve('attached_assets/uploads')));

(async () => {
  const server = await registerRoutes(app);

  // Initialize default chat settings if they don't exist
  try {
    const chatSettings = await storage.getChatSettings();
    if (!chatSettings) {
      console.log('🤖 Initializing default chat settings...');
      await storage.updateChatSettings({
        isEnabled: true,
        welcomeMessage: "Hello! I'm KJESS AI Assistant. How can I help you with your interior design needs today?",
        tone: "professional",
        restrictToRelevantTopics: true
      });
      console.log('✅ Default chat settings initialized');
    }
  } catch (error) {
    console.log('⚠️  Could not initialize chat settings:', error);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`serving on port ${port}`);
  });
})();
