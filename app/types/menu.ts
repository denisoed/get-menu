export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  tags: string[] | [];
  img: string;
  description?: string;
  options?: {
    sizes?: Array<{ label: string; add?: number }>;
    extras?: Array<{ label: string; add?: number }>;
  };
}
