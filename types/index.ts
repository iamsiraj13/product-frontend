export interface Product {
  id: string;
  title: string;
  price: string;
  numericPrice: number;
  image: string;
  category?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  rating: number;
}

export interface Interview {
  id: string;
  name: string;
  role: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoUrl?: string;
}

export interface ProcessStep {
  stepNumber: number;
  title: string;
  description: string;
  iconName: 'Register' | 'OptimizeData' | 'EarnCommissions';
}
