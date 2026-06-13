import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { INITIAL_PRODUCTS } from "./src/data/products.js"; // note: .js extension because type is module
import dotenv from "dotenv";

dotenv.config();

// Initialize server data
let products = [...INITIAL_PRODUCTS];
let orders: any[] = [];
let userProfile = {
  email: "novadevmaster@gmail.com",
  name: "Alex Devmaster",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  membershipLevel: "VIP Platinum" as const,
  points: 1250,
  addresses: [
    {
      fullName: "Alex Devmaster",
      street: "128 Innovation Way, Suite B",
      city: "San Francisco",
      state: "CA",
      zipCode: "94107",
      phone: "+1 (555) 902-1234"
    }
  ],
  shoeSize: 10.5,
  favoriteBrand: "Jordan",
  bio: "Sneakerhead since '08. Live for retro Jordan restocks and premium materials."
};

let notifications: any[] = [
  {
    id: "notif-1",
    title: "🚨 Off-White Air Jordan Drop Alert!",
    description: "The retro 'Obsidian Dust' Jordan 4 restock is dropping tomorrow at 10 AM EST. Highly limited stock, set your reminders!",
    timestamp: "2 hours ago",
    read: false,
    type: "drop"
  },
  {
    id: "notif-2",
    title: "⚡ Double Points Flash Active",
    description: "Get 2X SneakerHub rewards points on all Asics and New Balance running range products today only.",
    timestamp: "1 day ago",
    read: true,
    type: "promo"
  }
];

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("⚠️ GEMINI_API_KEY is not defined in the environment. AI Assistant will operate in safe fallback mode.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser limit expanded for raw base64 or rich data
  app.use(express.json({ limit: "10mb" }));

  // ================= API ENDPOINTS =================

  // Product List
  app.get("/api/products", (req, res) => {
    res.json(products);
  });

  // Submit Product Review
  app.post("/api/products/review", (req, res) => {
    const { productId, username, rating, date, comment, title } = req.body;
    if (!productId || !username || rating === undefined || !comment || !title) {
      return res.status(400).json({ error: "Missing required review fields" });
    }

    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    const newReview = {
      id: "rev-" + Math.random().toString(36).substr(2, 9),
      username,
      rating: Number(rating),
      date: date || new Date().toISOString().split('T')[0],
      comment,
      title,
      verified: true
    };

    const targetProduct = { ...products[productIndex] };
    const updatedReviews = [newReview, ...targetProduct.reviews];
    const totalRating = updatedReviews.reduce((sum, rev) => sum + rev.rating, 0);
    
    targetProduct.reviews = updatedReviews;
    targetProduct.reviewsCount = updatedReviews.length;
    targetProduct.rating = parseFloat((totalRating / updatedReviews.length).toFixed(1));

    products[productIndex] = targetProduct;
    res.json({ success: true, updatedProduct: targetProduct });
  });

  // Get Orders History
  app.get("/api/orders", (req, res) => {
    res.json(orders);
  });

  // Create Order
  app.post("/api/orders", (req, res) => {
    const { items, shippingAddress, paymentMethod, priceBreakdown } = req.body;
    if (!items || !shippingAddress || !paymentMethod || !priceBreakdown) {
      return res.status(400).json({ error: "Missing required order fields" });
    }

    const newOrder = {
      id: "SH-" + Math.floor(100000 + Math.random() * 900000),
      userId: "user-devmaster-1",
      items,
      shippingAddress,
      paymentMethod,
      priceBreakdown,
      status: "Confirmed",
      trackingHistory: [
        { status: "Order Placed", description: "Your sneaker order has been successfully placed.", date: new Date().toLocaleTimeString() + " Today", completed: true },
        { status: "Confirmed", description: "Payment verified & shoe inventory locked successfully.", date: new Date().toLocaleTimeString() + " Today", completed: true },
        { status: "Shipped", description: "Carrier picked up package from Oregon Dispatch Warehouse.", date: "Tomorrow (Estimated)", completed: false },
        { status: "Out for Delivery", description: "Sneaker Hub courier assigned for local doorstep delivery.", date: "In 2 days", completed: false },
        { status: "Delivered", description: "Package signed & delivered secure porch drop-off.", date: "In 2 days", completed: false }
      ],
      createdAt: new Date().toISOString()
    };

    orders = [newOrder, ...orders];
    userProfile.points += Math.floor(priceBreakdown.total * 0.1); // 10% cash back in loyalty points

    // Add push notification for order creation
    notifications = [
      {
        id: "notif-" + Math.random().toString(36).substr(2, 9),
        title: "👟 Order Confirmed (" + newOrder.id + ")",
        description: `Your purchase of ${items.length} sneaker pair(s) is confirmed. Tracking is now live!`,
        timestamp: "Just now",
        read: false,
        type: "shipping" as const
      },
      ...notifications
    ];

    res.json({ success: true, order: newOrder, pointsGained: Math.floor(priceBreakdown.total * 0.1) });
  });

  // User Profile
  app.get("/api/profile", (req, res) => {
    res.json(userProfile);
  });

  app.put("/api/profile", (req, res) => {
    userProfile = { ...userProfile, ...req.body };
    res.json(userProfile);
  });

  // Notifications List
  app.get("/api/notifications", (req, res) => {
    res.json(notifications);
  });

  app.post("/api/notifications/read", (req, res) => {
    notifications = notifications.map(n => ({ ...n, read: true }));
    res.json({ success: true });
  });

  // AI Shopping Assistant chatbot endpoint using server-side Gemini
  app.post("/api/assistant", async (req, res) => {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages history array" });
    }

    try {
      if (!ai) {
        // Fallback simulation if no API key is specified
        const userPrompt = messages[messages.length - 1]?.text || "";
        let fallbackText = "I'd love to help you find the perfect sneakers! (Note: Gemini API Key is missing, operating in offline mode).";
        
        const lowerPrompt = userPrompt.toLowerCase();
        if (lowerPrompt.includes("running") || lowerPrompt.includes("run") || lowerPrompt.includes("marathon")) {
          fallbackText = "For running, I highly recommend the **Air Zoom Alphafly Next% V3** from Nike ($259.99) with full ZoomX foam and carbon-fiber spring, or the ultra-lightweight **Adidas UltraBoost Light 26** ($159.99) for daily recovery jogs.";
        } else if (lowerPrompt.includes("cheap") || lowerPrompt.includes("budget") || lowerPrompt.includes("under")) {
          fallbackText = "Our most budget-friendly options are the classic leather **Reebok Club C Vintage** ($90.00), or the chunky aesthetic retro **Puma RS-X Efekt** ($99.95). Both are highly comfortable for daily wear!";
        } else if (lowerPrompt.includes("jordan") || lowerPrompt.includes("basketball") || lowerPrompt.includes("court")) {
          fallbackText = "For basketball or streetwear style, the absolute legend is the **Air Jordan 4 Retro 'Obsidian Dust'** ($210.00). It has responsive heel Air pods and premium textured nubuck leather.";
        }

        return res.json({
          text: fallbackText,
          suggestedAction: {
            type: "view_product",
            payload: "prod-zoom-alpha"
          }
        });
      }

      // Structure system prompt matching Nike-tier sneaker intelligence
      const productsContext = products.map(p => 
        `- ID: "${p.id}", Name: "${p.name}", Brand: "${p.brand}", Category: "${p.category}", Price: $${p.price}, ${p.discountPrice ? `Sale Price: $${p.discountPrice},` : ""} Rating: ${p.rating}, Stock: ${p.stock} units, Sizes: [${p.sizes.join(", ")}], Colors: [${p.colors.map(c => c.name).join(", ")}], Description: "${p.description}"`
      ).join("\n");

      const systemInstruction = `You are SneakerHub's Premium AI Shoe Concierge. You are a world-class authority on sneaker culture, athletic footware performance, sizing fits, running styles (overpronation/underpronation), sneaker history, and casual styling.

Your role:
1. Help users discover the perfect sneakers from the SneakerHub catalog.
2. Provide precise, tailored sizing advice, sports advice (running, lifestyle, basketball, tennis), and design explanations.
3. Keep responses stylish, friendly, knowledgeable, and visually structural (using clean bolding, bullet points, and spacing).
4. Recommend products EXACTLY from the provided SneakerHub catalog when they match the user's sports style or price ranges.
5. If recommending a sneaker from our list, ALWAYS supply its exact SneakerHub Product ID in a clear and natural recommendation payload.

Available SneakerHub Shoes Catalog:
${productsContext}

Under no circumstances should you invent shoe models outside this exact list when offering live store buying choices. Keep recommendations matching actual inventory items!
Respond strictly with clean markdown. No HTML elements. If recommending a single shoe as an absolute top match, you can suggest loading its detail page by providing a logical product ID recommendation!`;

      // Translate history into Gemini Parts structure
      const contents = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      // Call Gemini API using modern @google/genai SDK
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const responseText = response.text || "I apologize, I missed that. How can I assist with your sneaker shopping today?";
      
      // Smart detection for suggestedAction
      let suggestedAction: any = undefined;
      const responseLower = responseText.toLowerCase();
      
      // Simple parsing to match active IDs
      for (const p of products) {
        if (responseLower.includes(p.name.toLowerCase()) || responseLower.includes(p.id.toLowerCase())) {
          suggestedAction = {
            type: "view_product",
            payload: p.id
          };
          break;
        }
      }

      res.json({
        text: responseText,
        suggestedAction
      });

    } catch (err: any) {
      console.error("Gemini API Error in /api/assistant: ", err);
      // Fallback response inside the API
      res.json({
        text: "I am having trouble accessing my database intelligence right now, but I still highly recommend checking out our elite **Nike Air Zoom Alphafly V3** for performance races, or **Reebok Club C Vintage** for timeless streetwear comfort!",
        error: err.message
      });
    }
  });


  // ================= VITE INTEGRATION / STATIC SERVING =================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SneakerHub Core Server is booted and listening on http://localhost:${PORT}`);
  });
}

startServer();
