export interface CreateProductPayload {
  title: string;
  price: number;
  commissionRate: number;
  commission: number;
  isHomeProduct: boolean;
  isActive: boolean;
  image: File;
}

export interface UpdateProductPayload {
  id: string;
  title: string;
  price: number;
  commissionRate: number;
  commission: number;
  isHomeProduct: boolean;
  isActive: boolean;
  image?: File | null;
}

export interface ProductItem {
  id: string;
  title: string;
  price: number | string;
  commissionRate?: number | string;
  commission?: number | string;
  isHomeProduct?: boolean;
  isActive?: boolean;
  image: string;
  category?: string;
  stock?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsPaginatedData {
  data: ProductItem[];
  meta: ProductMeta;
}


