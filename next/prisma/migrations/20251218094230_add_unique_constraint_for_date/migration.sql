/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `CurrencyExchangeRate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CurrencyExchangeRate_date_key" ON "CurrencyExchangeRate"("date");
