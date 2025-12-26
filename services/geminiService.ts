import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    this.initClient();
  }

  private initClient() {
    // Check multiple locations for the API key injected by the environment or shim
    const apiKey = (window as any).process?.env?.API_KEY || process.env.API_KEY;
    if (apiKey && !this.ai) {
      this.ai = new GoogleGenAI({ apiKey });
    }
  }

  private getClient() {
    this.initClient();
    if (!this.ai) {
      throw new Error("Gemini API Key is not configured. Please ensure API_KEY is set in your environment.");
    }
    return this.ai;
  }

  async generateStructuredContent(prompt: string, schema: any, modelName: string = 'gemini-3-flash-preview') {
    try {
      const client = this.getClient();
      const response = await client.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  }

  async analyzeImages(imageBuffers: string[], prompt: string, schema: any) {
    try {
      const client = this.getClient();
      const imageParts = imageBuffers.map(buffer => ({
        inlineData: { 
          data: buffer.split(',')[1], 
          mimeType: 'image/jpeg' 
        }
      }));
      
      const contents = {
        parts: [
          ...imageParts,
          { text: prompt }
        ]
      };

      const response = await client.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Gemini Vision Error:", error);
      throw error;
    }
  }

  async streamText(prompt: string, systemInstruction: string) {
    try {
      const client = this.getClient();
      return await client.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { systemInstruction }
      });
    } catch (error) {
      console.error("Gemini Stream Error:", error);
      throw error;
    }
  }
}

export const gemini = new GeminiService();

export const Schemas = {
  LISTING_ANALYSIS: {
    type: Type.OBJECT,
    properties: {
      title: { 
        type: Type.STRING, 
        description: "Optimized Title. MUST be 150-200 characters. Start with Brand Name. If a size range is provided, the title MUST include the age coverage in format 'Ages X to Y Years'. NO symbols or emojis. NO word repeated more than twice." 
      },
      bullets: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Exactly 5 detailed bullet points. Each MUST be between 160 and 199 characters long. Must include detected color, fabric, and size details."
      },
      keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
      description: { type: Type.STRING, description: "A long-form SEO optimized product description. Strict limit of 1500 characters." },
      backendKeywords: { 
        type: Type.STRING, 
        description: "Amazon backend search terms. STRICT LIMIT: MUST BE LESS THAN 200 CHARACTERS. Combine detected Color, Size, Length, and Fabric with unique words from the target SEO list. NO REPEATED WORDS. NO COMMAS. ONLY SPACES." 
      },
      fabricGuess: { type: Type.STRING },
      styleType: { type: Type.STRING },
      recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["title", "bullets", "keywords", "description", "backendKeywords"]
  },
  ADS_WASTE: {
    type: Type.OBJECT,
    properties: {
      negatives: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            keyword: { type: Type.STRING },
            reason: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          }
        }
      }
    }
  },
  KEYWORD_CLUSTERS: {
    type: Type.OBJECT,
    properties: {
      clusters: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            intent: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            strategy: { type: Type.STRING }
          }
        }
      }
    }
  },
  REVIEW_INSIGHTS: {
    type: Type.OBJECT,
    properties: {
      pros: { type: Type.ARRAY, items: { type: Type.STRING } },
      cons: { type: Type.ARRAY, items: { type: Type.STRING } },
      sizeIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
      newAdAngles: { type: Type.ARRAY, items: { type: Type.STRING } },
      productIdeas: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  },
  BUSINESS_INSIGHTS: {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING },
      actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
      metricsInterpretation: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  },
  REEL_PLANNER: {
    type: Type.OBJECT,
    properties: {
      hooks: { type: Type.ARRAY, items: { type: Type.STRING } },
      scripts: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            duration: { type: Type.STRING },
            script: { type: Type.STRING },
            cta: { type: Type.STRING }
          }
        }
      }
    }
  },
  PROMPT_GEN: {
    type: Type.OBJECT,
    properties: {
      image: { type: Type.ARRAY, items: { type: Type.STRING } },
      video: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  }
};