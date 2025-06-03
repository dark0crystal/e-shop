-- Create PaymentType table if it doesn't exist
CREATE TABLE IF NOT EXISTS "PaymentType" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "PaymentType_pkey" PRIMARY KEY ("id")
);

-- Create default payment type
INSERT INTO "PaymentType" (id, value) VALUES ('card', 'Credit Card'); 