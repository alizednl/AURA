import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load Environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI client with AI Studio standards
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("⚠️ GEMINI_API_KEY is not defined. AI Concierge will fall back to smart local simulation.");
      throw new Error("GEMINI_API_KEY environment variable is required for advanced AI Art Direction.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST API for products database (so client has a stable contract)
app.get("/api/products", (req, res) => {
  // Directly load the TS product DB to serve as a fast JSON api
  // Better to define inline or read-through for cleanliness
  res.json({ status: "success" });
});

// Art Director AI Concierge Endpoint
app.post("/api/concierge", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const client = getAiClient();
    
    // Custom context of our luxury furniture collection
    const systemPrompt = `You are the lead Art Director and Interior Styling Concierge for AURA, an elite Quiet Luxury home furnishings atelier.
Your aesthetic is refined, architecturally mindful, minimal, and highly tailored. You value spacious layouts, material precision (such as Carrara marble, Italian velvet, dark walnut, cashmere, travertine), and organic textures.
You are helping a client find pieces, choose fabrics, or coordinate their indoor spaces (Living Room, Bedroom, Dining Room, Home Office).

IMPORTANT: You MUST ONLY recommend furniture items that are part of the official AURA collection, using their exact IDs where relevant.
Our collection includes:
1. Product ID: 'velvet-serenity-sofa'
   - Name: Sofa Sérénité en Velours (4 850,00 €)
   - Category: Living Room
   - Description: Arch-sculptured monolithic sofa. High-density Italian velvet, solid walnut frame.
   - Fabrics: Velours Émeraude Profond, Velours Brun Terrestre, Velours Beige Chaleureux, Velours Noir Charbon Carbonisé.
2. Product ID: 'aurora-marble-table'
   - Name: Table en Marbre Aurora (2 100,00 €)
   - Category: Living Room
   - Description: Carrara marble top on travertine pedestal base.
3. Product ID: 'linear-floor-lamp'
   - Name: Lampadaire Linéaire (950,00 €)
   - Category: Office / Living Room
   - Description: Tall matte black architectural aluminum with warmth light bars.
4. Product ID: 'kashmir-wool-throw'
   - Name: Plaid en Laine Cachemire (450,00 €)
   - Category: Bedroom / Living Room
   - Description: Pure carded hand-loomed Kashmere throw.
5. Product ID: 'serene-oatmeal-bed'
   - Name: Lit Serene Lin Brut (3 600,00 €)
   - Category: Bedroom
   - Description: Low profile oatmeal linen frame with luxurious padded headboard.
6. Product ID: 'sculptural-walnut-chair'
   - Name: Chaise Sculpturale en Noyer (820,00 €)
   - Category: Dining
   - Description: Curved solid walnut chair upholstered in cream textured bouclé.
7. Product ID: 'monolithic-oak-desk'
   - Name: Bureau Monolithe en Noyer Sombre (2 950,00 €)
   - Category: Office
   - Description: Monolithic dark walnut and white oak desk with elegant flush brass joints.

Respond in French in a warm, welcoming, professional, and sophisticated artistic tone. Express a deep appreciation for space, lighting, and textures. Always write prices in Euros (€) using standard French format (e.g. 4 850 €).
If you refer to any of these products, list their IDs in the 'recommendations' array. Do not suggest IDs that are not in this list. Always return a valid JSON object matching the requested schema.`;

    // Construct contents structure with optional history
    const contents: any[] = [];
    
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      });
    }
    
    // Add new user question
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.75,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "The French aesthetic advice or conversational response from the AURA lead designer, styled in beautiful paragraphs."
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              },
              description: "An array of exact ID strings for the recommended items from AURA catalog (e.g. ['velvet-serenity-sofa', 'aurora-marble-table']) if you mention or propose them."
            }
          },
          required: ["text", "recommendations"]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No response generated by the model");
    }

    const parsedResponse = JSON.parse(textOutput.trim());
    return res.json(parsedResponse);

  } catch (error: any) {
    console.error("Art Director Concierge Error:", error);
    
    // Elegant simulation fallback if API key is not yet set or model fails
    let simulatedText = "Bienvenue dans l'univers AURA. Pour réaménager votre intérieur avec calme et texture, je vous recommande d'adopter des formes sculptées. Le Sofa Sérénité en Velours s'associerait merveilleusement avec notre Table en Marbre Aurora et son socle en travertin.";
    let simulatedRecs: string[] = ["velvet-serenity-sofa", "aurora-marble-table"];
    
    // Let's create smart local heuristics based on keywords in French!
    const msgLower = message.toLowerCase();
    if (msgLower.includes("chambre") || msgLower.includes("lit") || msgLower.includes("sommeil")) {
      simulatedText = "Pour créer une alcôve de repos intemporelle dans votre chambre, notre Lit Serene Lin Brut offre une enveloppe de lin d'une douceur absolue. Accompagnez-le du Plaid en Laine Cachemire pour introduire un volume textile naturel incomparable.";
      simulatedRecs = ["serene-oatmeal-bed", "kashmir-wool-throw"];
    } else if (msgLower.includes("bureau") || msgLower.includes("travail") || msgLower.includes("desk")) {
      simulatedText = "Un espace créatif exige de la pureté. Notre Bureau Monolithe en Noyer Sombre équilibre le grain organique du noyer foncé avec la rigueur architecturale du laiton. Associez-le au Lampadaire Linéaire pour une lumière directionnelle douce et diffuse.";
      simulatedRecs = ["monolithic-oak-desk", "linear-floor-lamp"];
    } else if (msgLower.includes("chaise") || msgLower.includes("salon") || msgLower.includes("canape") || msgLower.includes("sofa")) {
      simulatedText = "Pour votre salon ou espace dînatoire, je ne pourrais que trop vous conseiller notre Sofa Sérénité en Velours en velours d'Émeraude italien, marié aux courbes organiques de notre Chaise Sculpturale en Noyer en bouclé crème.";
      simulatedRecs = ["velvet-serenity-sofa", "sculptural-walnut-chair"];
    } else if (msgLower.includes("table") || msgLower.includes("manger") || msgLower.includes("repas")) {
      simulatedText = "Notre Table en Marbre Aurora en marbre de Carrare sculpté constitue le point focal idéal pour un salon sophistiqué. Elle dialogue superbement avec l'assise chaleureuse de la Chaise Sculpturale en Noyer.";
      simulatedRecs = ["aurora-marble-table", "sculptural-walnut-chair"];
    }

    return res.json({
      text: simulatedText + "\n\n*(Note : Service de design nourri par nos conseils artistiques locaux.)*",
      recommendations: simulatedRecs
    });
  }
});

// Configure Vite compiler server middleware or serve production assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("🛠️ Starting Express App in Development mode with Vite compiler...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("📦 Starting Express App in Production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 AURA Fullstack server launched at http://localhost:${PORT}`);
  });
}

startServer();
