generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Game {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(100)
  slug      String   @unique @db.VarChar(100)
  imageUrl  String?  @map("image_url") @db.Text
  category  String   @db.VarChar(50)
  isActive  Boolean  @default(true) @map("is_active")
  createdAt DateTime @default(now()) @map("created_at")
  
  orders    Order[]
  products  Product[]

  @@map("games")
}

model Product {
  id          Int      @id @default(autoincrement())
  gameId      Int      @map("game_id")
  name        String   @db.VarChar(100)
  diamonds    Int
  priceUsd    Float    @map("price_usd") @db.Decimal(10, 2)
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  
  game        Game     @relation(fields: [gameId], references: [id])
  orders      Order[]

  @@map("products")
}

model Order {
  id              Int      @id @default(autoincrement())
  orderNumber     String   @unique @map("order_number") @db.VarChar(50)
  gameId          Int      @map("game_id")
  productId       Int      @map("product_id")
  playerId        String   @map("player_id") @db.VarChar(50)
  zoneId          String?  @map("zone_id") @db.VarChar(20)
  customerEmail   String?  @map("customer_email") @db.VarChar(100)
  customerPhone   String?  @map("customer_phone") @db.VarChar(20)
  amountUsd       Float    @map("amount_usd") @db.Decimal(10, 2)
  currency        String   @default("USD") @db.VarChar(3)
  md5Hash         String   @unique @map("md5_hash") @db.VarChar(64)
  status          String   @default("PENDING") @db.VarChar(20)
  paymentMethod   String   @default("BAKONG") @map("payment_method") @db.VarChar(20)
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  
  game            Game     @relation(fields: [gameId], references: [id])
  product         Product  @relation(fields: [productId], references: [id])

  @@index([orderNumber])
  @@index([customerEmail])
  @@index([customerPhone])
  @@index([status])
  @@map("orders")
}

model Admin {
  id        Int      @id @default(autoincrement())
  email     String   @unique @db.VarChar(100)
  password  String   @db.VarChar(255)
  role      String   @default("ADMIN") @db.VarChar(20)
  createdAt DateTime @default(now()) @map("created_at")

  @@map("admins")
}
