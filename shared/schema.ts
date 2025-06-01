import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("cashier"), // "owner" or "cashier"
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  barcode: text("barcode"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category_id: integer("category_id").references(() => categories.id),
  stock_quantity: integer("stock_quantity").notNull().default(0),
  min_stock: integer("min_stock").notNull().default(5),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at").defaultNow(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cpf: text("cpf"),
  phone: text("phone"),
  email: text("email"),
  created_at: timestamp("created_at").defaultNow(),
});

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  customer_id: integer("customer_id").references(() => customers.id),
  total_amount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  payment_method: text("payment_method").notNull(), // "cash", "card", "pix"
  status: text("status").notNull().default("completed"), // "pending", "completed", "cancelled"
  created_at: timestamp("created_at").defaultNow(),
});

export const sale_items = pgTable("sale_items", {
  id: serial("id").primaryKey(),
  sale_id: integer("sale_id").references(() => sales.id),
  product_id: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  unit_price: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  total_price: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category"),
  created_at: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, created_at: true });
export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true, created_at: true });
export const insertSaleSchema = createInsertSchema(sales).omit({ id: true, created_at: true });
export const insertSaleItemSchema = createInsertSchema(sale_items).omit({ id: true });
export const insertExpenseSchema = createInsertSchema(expenses).omit({ id: true, created_at: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertSale = z.infer<typeof insertSaleSchema>;
export type Sale = typeof sales.$inferSelect;
export type InsertSaleItem = z.infer<typeof insertSaleItemSchema>;
export type SaleItem = typeof sale_items.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expenses.$inferSelect;
