export interface FabricOption {
  id: string;
  name: string;
  hex: string;
  previewUrl: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Living Room' | 'Bedroom' | 'Dining' | 'Office';
  subCategory: string;
  price: number;
  description: string;
  imageUrl: string;
  additionalImages: string[];
  fabrics?: FabricOption[];
  dimensions: string;
  materials: string;
  weightCapacity: string;
  origin: string;
  shippingInfo: string;
  careInstructions: string;
}

export interface CartItem {
  id: string; // Unique combination of product id + chosen fabric
  product: Product;
  selectedFabric?: FabricOption;
  quantity: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendations?: string[]; // IDs of products recommended in this message
}
