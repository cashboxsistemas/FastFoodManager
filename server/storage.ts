import { 
  users, categories, products, customers, sales, sale_items, expenses,
  type User, type InsertUser, type Category, type InsertCategory,
  type Product, type InsertProduct, type Customer, type InsertCustomer,
  type Sale, type InsertSale, type SaleItem, type InsertSaleItem,
  type Expense, type InsertExpense
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  updateStock(id: number, quantity: number): Promise<Product | undefined>;

  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;

  // Sales
  getSales(): Promise<Sale[]>;
  getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]>;
  createSale(sale: InsertSale): Promise<Sale>;
  getSaleItems(saleId: number): Promise<SaleItem[]>;
  createSaleItem(saleItem: InsertSaleItem): Promise<SaleItem>;

  // Expenses
  getExpenses(): Promise<Expense[]>;
  getExpensesByDateRange(startDate: Date, endDate: Date): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;

  // Analytics
  getDailySales(date: Date): Promise<{ total: number; count: number; payment_methods: Record<string, number> }>;
  getTopProducts(limit: number): Promise<Array<{ product: Product; total_sold: number; revenue: number }>>;
  getLowStockProducts(): Promise<Product[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private categories: Map<number, Category> = new Map();
  private products: Map<number, Product> = new Map();
  private customers: Map<number, Customer> = new Map();
  private sales: Map<number, Sale> = new Map();
  private saleItems: Map<number, SaleItem> = new Map();
  private expenses: Map<number, Expense> = new Map();
  private currentId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create default user
    this.createUser({ username: "demo@cashboxfood.com", password: "demo123", role: "owner" });

    // Create categories
    const lanchesCategory = this.createCategory({ name: "Lanches", description: "Hambúrgueres e sanduíches" });
    const bebidasCategory = this.createCategory({ name: "Bebidas", description: "Refrigerantes, sucos e águas" });
    const acompanhamentosCategory = this.createCategory({ name: "Acompanhamentos", description: "Batatas e porções" });

    // Create products
    this.createProduct({
      name: "X-Burger Completo",
      code: "001",
      barcode: "7891234567890",
      price: "15.90",
      category_id: 1,
      stock_quantity: 25,
      min_stock: 5,
      is_active: true
    });

    this.createProduct({
      name: "Refrigerante Lata",
      code: "002",
      barcode: "7891234567891",
      price: "5.50",
      category_id: 2,
      stock_quantity: 8,
      min_stock: 10,
      is_active: true
    });

    this.createProduct({
      name: "Batata Frita",
      code: "003",
      barcode: "7891234567892",
      price: "8.90",
      category_id: 3,
      stock_quantity: 15,
      min_stock: 5,
      is_active: true
    });

    this.createProduct({
      name: "Água 500ml",
      code: "004",
      barcode: "7891234567893",
      price: "3.00",
      category_id: 2,
      stock_quantity: 20,
      min_stock: 10,
      is_active: true
    });

    this.createProduct({
      name: "X-Salada",
      code: "005",
      barcode: "7891234567894",
      price: "12.90",
      category_id: 1,
      stock_quantity: 18,
      min_stock: 5,
      is_active: true
    });

    this.createProduct({
      name: "Suco Natural",
      code: "006",
      barcode: "7891234567895",
      price: "7.50",
      category_id: 2,
      stock_quantity: 12,
      min_stock: 5,
      is_active: true
    });

    // Create customers
    this.createCustomer({ name: "João Silva", cpf: "123.456.789-00", phone: "(11) 99999-9999" });
    this.createCustomer({ name: "Maria Santos", cpf: "987.654.321-00", phone: "(11) 88888-8888" });
    this.createCustomer({ name: "Pedro Costa", phone: "(11) 77777-7777" });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "cashier"
    };
    this.users.set(id, user);
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentId++;
    const category: Category = { 
      ...insertCategory, 
      id,
      description: insertCategory.description || null
    };
    this.categories.set(id, category);
    return category;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const products = Array.from(this.products.values());
    return products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.code.includes(query) ||
      (product.barcode && product.barcode.includes(query))
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      barcode: insertProduct.barcode || null,
      category_id: insertProduct.category_id || null,
      stock_quantity: insertProduct.stock_quantity || 0,
      min_stock: insertProduct.min_stock || 5,
      is_active: insertProduct.is_active !== undefined ? insertProduct.is_active : true,
      created_at: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct: Product = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  async updateStock(id: number, quantity: number): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    product.stock_quantity = quantity;
    this.products.set(id, product);
    return product;
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = this.currentId++;
    const customer: Customer = { 
      ...insertCustomer, 
      id,
      cpf: insertCustomer.cpf || null,
      phone: insertCustomer.phone || null,
      email: insertCustomer.email || null,
      created_at: new Date()
    };
    this.customers.set(id, customer);
    return customer;
  }

  // Sales
  async getSales(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }

  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    const sales = Array.from(this.sales.values());
    return sales.filter(sale => {
      const saleDate = sale.created_at;
      return saleDate && saleDate >= startDate && saleDate <= endDate;
    });
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    const id = this.currentId++;
    const sale: Sale = { 
      ...insertSale, 
      id,
      status: insertSale.status || "completed",
      customer_id: insertSale.customer_id || null,
      created_at: new Date()
    };
    this.sales.set(id, sale);
    return sale;
  }

  async getSaleItems(saleId: number): Promise<SaleItem[]> {
    return Array.from(this.saleItems.values()).filter(item => item.sale_id === saleId);
  }

  async createSaleItem(insertSaleItem: InsertSaleItem): Promise<SaleItem> {
    const id = this.currentId++;
    const saleItem: SaleItem = { 
      ...insertSaleItem, 
      id,
      sale_id: insertSaleItem.sale_id || null,
      product_id: insertSaleItem.product_id || null
    };
    this.saleItems.set(id, saleItem);
    return saleItem;
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values());
  }

  async getExpensesByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
    const expenses = Array.from(this.expenses.values());
    return expenses.filter(expense => {
      const expenseDate = expense.created_at;
      return expenseDate && expenseDate >= startDate && expenseDate <= endDate;
    });
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = this.currentId++;
    const expense: Expense = { 
      ...insertExpense, 
      id,
      category: insertExpense.category || null,
      created_at: new Date()
    };
    this.expenses.set(id, expense);
    return expense;
  }

  // Analytics
  async getDailySales(date: Date): Promise<{ total: number; count: number; payment_methods: Record<string, number> }> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const dailySales = await this.getSalesByDateRange(startOfDay, endOfDay);
    
    const total = dailySales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
    const count = dailySales.length;
    const payment_methods = dailySales.reduce((acc, sale) => {
      acc[sale.payment_method] = (acc[sale.payment_method] || 0) + parseFloat(sale.total_amount);
      return acc;
    }, {} as Record<string, number>);

    return { total, count, payment_methods };
  }

  async getTopProducts(limit: number): Promise<Array<{ product: Product; total_sold: number; revenue: number }>> {
    const allSaleItems = Array.from(this.saleItems.values());
    const productStats = new Map<number, { total_sold: number; revenue: number }>();

    allSaleItems.forEach(item => {
      if (item.product_id) {
        const existing = productStats.get(item.product_id) || { total_sold: 0, revenue: 0 };
        existing.total_sold += item.quantity;
        existing.revenue += parseFloat(item.total_price);
        productStats.set(item.product_id, existing);
      }
    });

    const results = [];
    for (const [productId, stats] of Array.from(productStats.entries())) {
      const product = await this.getProduct(productId);
      if (product) {
        results.push({ product, ...stats });
      }
    }

    return results
      .sort((a, b) => b.total_sold - a.total_sold)
      .slice(0, limit);
  }

  async getLowStockProducts(): Promise<Product[]> {
    const products = Array.from(this.products.values());
    return products.filter(product => product.stock_quantity <= product.min_stock);
  }
}

export const storage = new MemStorage();
