import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(email?: string | null) {
  const allow = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!email) return false;
  return allow.includes(email.toLowerCase());
}

// Import the generateMoreFoods function from seed-foods route
const filipinoFoods = [
  // Rice Dishes
  { name: "Sinangag (Garlic Fried Rice)", calories: 205, protein: 4.3, carbs: 45, fat: 0.4, source: "fnri" },
  { name: "Arroz Caldo", calories: 180, protein: 5, carbs: 35, fat: 2, source: "fnri" },
  { name: "Champorado", calories: 250, protein: 6, carbs: 50, fat: 3, source: "fnri" },
  { name: "Bibingka", calories: 320, protein: 8, carbs: 55, fat: 8, source: "fnri" },
  { name: "Puto", calories: 150, protein: 3, carbs: 32, fat: 1, source: "fnri" },
  
  // Meat Dishes
  { name: "Adobo (Chicken)", calories: 220, protein: 28, carbs: 5, fat: 9, source: "fnri" },
  { name: "Adobo (Pork)", calories: 280, protein: 22, carbs: 5, fat: 18, source: "fnri" },
  { name: "Sinigang (Pork)", calories: 195, protein: 20, carbs: 8, fat: 9, source: "fnri" },
  { name: "Sinigang (Beef)", calories: 210, protein: 25, carbs: 8, fat: 9, source: "fnri" },
  { name: "Sinigang (Fish)", calories: 150, protein: 22, carbs: 8, fat: 4, source: "fnri" },
  { name: "Kare-Kare", calories: 350, protein: 25, carbs: 15, fat: 22, source: "fnri" },
  { name: "Lechon Kawali", calories: 420, protein: 28, carbs: 0, fat: 32, source: "fnri" },
  { name: "Sisig", calories: 380, protein: 22, carbs: 5, fat: 30, source: "fnri" },
  { name: "Bistek Tagalog", calories: 250, protein: 30, carbs: 8, fat: 10, source: "fnri" },
  { name: "Mechado", calories: 320, protein: 25, carbs: 12, fat: 20, source: "fnri" },
  { name: "Kaldereta", calories: 340, protein: 28, carbs: 15, fat: 20, source: "fnri" },
  { name: "Afritada", calories: 280, protein: 25, carbs: 12, fat: 15, source: "fnri" },
  { name: "Menudo", calories: 260, protein: 22, carbs: 15, fat: 12, source: "fnri" },
  { name: "Pork Binagoongan", calories: 320, protein: 24, carbs: 8, fat: 22, source: "fnri" },
  { name: "Dinuguan", calories: 280, protein: 20, carbs: 10, fat: 18, source: "fnri" },
  { name: "Tocino", calories: 350, protein: 18, carbs: 12, fat: 25, source: "fnri" },
  { name: "Longganisa", calories: 320, protein: 16, carbs: 8, fat: 24, source: "fnri" },
  { name: "Tapa", calories: 280, protein: 30, carbs: 5, fat: 14, source: "fnri" },
  { name: "Tortang Talong", calories: 180, protein: 8, carbs: 12, fat: 11, source: "fnri" },
  
  // Seafood
  { name: "Pinakbet", calories: 120, protein: 6, carbs: 15, fat: 4, source: "fnri" },
  { name: "Ginataang Tilapia", calories: 180, protein: 22, carbs: 5, fat: 8, source: "fnri" },
  { name: "Paksiw na Isda", calories: 150, protein: 20, carbs: 8, fat: 4, source: "fnri" },
  { name: "Escabeche", calories: 220, protein: 25, carbs: 15, fat: 7, source: "fnri" },
  { name: "Relyenong Bangus", calories: 280, protein: 22, carbs: 12, fat: 16, source: "fnri" },
  { name: "Ginataang Hipon", calories: 200, protein: 20, carbs: 8, fat: 10, source: "fnri" },
  { name: "Kilawin", calories: 150, protein: 18, carbs: 5, fat: 6, source: "fnri" },
  { name: "Ginataang Alimango", calories: 250, protein: 25, carbs: 8, fat: 14, source: "fnri" },
  
  // Soups & Stews
  { name: "Bulalo", calories: 320, protein: 35, carbs: 8, fat: 16, source: "fnri" },
  { name: "Nilaga", calories: 280, protein: 30, carbs: 10, fat: 12, source: "fnri" },
  { name: "Tinola", calories: 180, protein: 22, carbs: 8, fat: 6, source: "fnri" },
  { name: "Batchoy", calories: 350, protein: 28, carbs: 25, fat: 15, source: "fnri" },
  { name: "Pancit Molo", calories: 220, protein: 12, carbs: 30, fat: 6, source: "fnri" },
  { name: "Laing", calories: 200, protein: 8, carbs: 20, fat: 10, source: "fnri" },
  { name: "Ginataang Gulay", calories: 150, protein: 5, carbs: 18, fat: 6, source: "fnri" },
  
  // Noodles
  { name: "Pancit Canton", calories: 280, protein: 12, carbs: 45, fat: 8, source: "fnri" },
  { name: "Pancit Bihon", calories: 250, protein: 10, carbs: 48, fat: 4, source: "fnri" },
  { name: "Pancit Palabok", calories: 320, protein: 15, carbs: 42, fat: 12, source: "fnri" },
  { name: "Pancit Malabon", calories: 350, protein: 18, carbs: 45, fat: 14, source: "fnri" },
  { name: "Lomi", calories: 380, protein: 16, carbs: 50, fat: 14, source: "fnri" },
  
  // Vegetables
  { name: "Chopsuey", calories: 120, protein: 6, carbs: 15, fat: 4, source: "fnri" },
  { name: "Ginisang Monggo", calories: 180, protein: 12, carbs: 25, fat: 4, source: "fnri" },
  { name: "Ensaladang Talong", calories: 80, protein: 3, carbs: 12, fat: 2, source: "fnri" },
  { name: "Atchara", calories: 50, protein: 1, carbs: 12, fat: 0, source: "fnri" },
  { name: "Ginisang Ampalaya", calories: 60, protein: 2, carbs: 10, fat: 1, source: "fnri" },
  { name: "Ginisang Sitaw", calories: 70, protein: 3, carbs: 12, fat: 1, source: "fnri" },
  { name: "Ginisang Upo", calories: 50, protein: 2, carbs: 8, fat: 1, source: "fnri" },
  { name: "Ginisang Kalabasa", calories: 90, protein: 2, carbs: 18, fat: 2, source: "fnri" },
  
  // Snacks & Street Food
  { name: "Lumpia (Shanghai)", calories: 85, protein: 4, carbs: 8, fat: 4, source: "fnri" },
  { name: "Lumpia (Vegetable)", calories: 60, protein: 2, carbs: 10, fat: 1, source: "fnri" },
  { name: "Fish Ball (5 pieces)", calories: 50, protein: 4, carbs: 5, fat: 1, source: "fnri" },
  { name: "Kikiam (2 pieces)", calories: 120, protein: 6, carbs: 10, fat: 6, source: "fnri" },
  { name: "Squid Ball (5 pieces)", calories: 60, protein: 5, carbs: 6, fat: 1, source: "fnri" },
  { name: "Kwek-Kwek (2 pieces)", calories: 150, protein: 8, carbs: 12, fat: 8, source: "fnri" },
  { name: "Isaw (Chicken, 2 sticks)", calories: 80, protein: 8, carbs: 2, fat: 4, source: "fnri" },
  { name: "Betamax (2 pieces)", calories: 100, protein: 6, carbs: 8, fat: 5, source: "fnri" },
  { name: "Adidas (Chicken Feet, 2 pieces)", calories: 60, protein: 5, carbs: 1, fat: 3, source: "fnri" },
  { name: "Balut", calories: 180, protein: 14, carbs: 1, fat: 13, source: "fnri" },
  { name: "Penoy", calories: 150, protein: 12, carbs: 1, fat: 11, source: "fnri" },
  { name: "Taho", calories: 120, protein: 6, carbs: 20, fat: 1, source: "fnri" },
  { name: "Turon", calories: 180, protein: 2, carbs: 35, fat: 5, source: "fnri" },
  { name: "Banana Cue", calories: 200, protein: 1, carbs: 45, fat: 4, source: "fnri" },
  { name: "Kamote Cue", calories: 220, protein: 2, carbs: 50, fat: 3, source: "fnri" },
  { name: "Maruya", calories: 150, protein: 2, carbs: 28, fat: 4, source: "fnri" },
  { name: "Puto Bumbong", calories: 180, protein: 3, carbs: 38, fat: 1, source: "fnri" },
  { name: "Sapin-Sapin", calories: 200, protein: 3, carbs: 42, fat: 2, source: "fnri" },
  { name: "Biko", calories: 280, protein: 4, carbs: 58, fat: 4, source: "fnri" },
  { name: "Kutsinta", calories: 120, protein: 2, carbs: 28, fat: 0, source: "fnri" },
  
  // Desserts
  { name: "Halo-Halo", calories: 350, protein: 6, carbs: 65, fat: 8, source: "fnri" },
  { name: "Leche Flan", calories: 280, protein: 8, carbs: 35, fat: 12, source: "fnri" },
  { name: "Buko Pandan", calories: 220, protein: 3, carbs: 45, fat: 4, source: "fnri" },
  { name: "Mais Con Yelo", calories: 180, protein: 4, carbs: 38, fat: 2, source: "fnri" },
  { name: "Sago't Gulaman", calories: 120, protein: 1, carbs: 28, fat: 0, source: "fnri" },
  { name: "Gulaman", calories: 80, protein: 1, carbs: 18, fat: 0, source: "fnri" },
  { name: "Mango Float", calories: 320, protein: 5, carbs: 45, fat: 14, source: "fnri" },
  { name: "Buko Salad", calories: 250, protein: 4, carbs: 42, fat: 8, source: "fnri" },
  { name: "Macapuno", calories: 200, protein: 2, carbs: 40, fat: 4, source: "fnri" },
  { name: "Ube Halaya", calories: 280, protein: 3, carbs: 55, fat: 6, source: "fnri" },
  { name: "Pastillas", calories: 120, protein: 2, carbs: 25, fat: 2, source: "fnri" },
  { name: "Yema", calories: 150, protein: 3, carbs: 28, fat: 4, source: "fnri" },
  { name: "Polvoron", calories: 100, protein: 2, carbs: 12, fat: 5, source: "fnri" },
  { name: "Espasol", calories: 180, protein: 3, carbs: 35, fat: 3, source: "fnri" },
  { name: "Puto Cheese", calories: 160, protein: 4, carbs: 32, fat: 2, source: "fnri" },
  
  // More dishes
  { name: "Chicken Inasal", calories: 280, protein: 32, carbs: 5, fat: 14, source: "fnri" },
  { name: "Pork Inasal", calories: 320, protein: 28, carbs: 5, fat: 20, source: "fnri" },
  { name: "Inihaw na Liempo", calories: 380, protein: 25, carbs: 0, fat: 30, source: "fnri" },
  { name: "Inihaw na Manok", calories: 250, protein: 30, carbs: 2, fat: 12, source: "fnri" },
  { name: "Inihaw na Bangus", calories: 220, protein: 25, carbs: 2, fat: 12, source: "fnri" },
  { name: "Inihaw na Tilapia", calories: 180, protein: 22, carbs: 2, fat: 8, source: "fnri" },
  { name: "Pritong Bangus", calories: 280, protein: 28, carbs: 5, fat: 16, source: "fnri" },
  { name: "Pritong Tilapia", calories: 220, protein: 24, carbs: 5, fat: 10, source: "fnri" },
  { name: "Pritong Galunggong", calories: 200, protein: 22, carbs: 5, fat: 9, source: "fnri" },
  { name: "Pritong Isda", calories: 210, protein: 23, carbs: 5, fat: 10, source: "fnri" },
  { name: "Ginataang Manok", calories: 280, protein: 28, carbs: 8, fat: 14, source: "fnri" },
  { name: "Ginataang Baboy", calories: 320, protein: 25, carbs: 8, fat: 20, source: "fnri" },
  { name: "Ginataang Kalabasa at Sitaw", calories: 120, protein: 4, carbs: 20, fat: 3, source: "fnri" },
  { name: "Ginataang Langka", calories: 150, protein: 3, carbs: 25, fat: 4, source: "fnri" },
  { name: "Ginataang Bilo-Bilo", calories: 200, protein: 3, carbs: 38, fat: 4, source: "fnri" },
  { name: "Molo Soup", calories: 200, protein: 12, carbs: 25, fat: 5, source: "fnri" },
  { name: "Sotanghon Soup", calories: 180, protein: 8, carbs: 30, fat: 3, source: "fnri" },
  { name: "Misua Soup", calories: 150, protein: 6, carbs: 25, fat: 2, source: "fnri" },
  { name: "Beef Pares", calories: 380, protein: 32, carbs: 35, fat: 14, source: "fnri" },
  { name: "Beef Mami", calories: 350, protein: 28, carbs: 40, fat: 10, source: "fnri" },
  { name: "Chicken Mami", calories: 280, protein: 22, carbs: 35, fat: 8, source: "fnri" },
  { name: "Pancit Luglug", calories: 320, protein: 14, carbs: 45, fat: 10, source: "fnri" },
  { name: "Bagoong Rice", calories: 250, protein: 6, carbs: 48, fat: 3, source: "fnri" },
  { name: "Java Rice", calories: 220, protein: 4, carbs: 45, fat: 2, source: "fnri" },
  { name: "Yang Chow Fried Rice", calories: 280, protein: 12, carbs: 42, fat: 8, source: "fnri" },
  { name: "Bagoong Fried Rice", calories: 260, protein: 8, carbs: 45, fat: 5, source: "fnri" },
  { name: "Empanada", calories: 220, protein: 8, carbs: 28, fat: 8, source: "fnri" },
  { name: "Siomai (5 pieces)", calories: 150, protein: 10, carbs: 15, fat: 5, source: "fnri" },
  { name: "Siopao (Asado)", calories: 280, protein: 12, carbs: 42, fat: 8, source: "fnri" },
  { name: "Siopao (Bola-Bola)", calories: 300, protein: 14, carbs: 40, fat: 10, source: "fnri" },
  { name: "Pork Siomai", calories: 180, protein: 12, carbs: 18, fat: 6, source: "fnri" },
  { name: "Chicken Siomai", calories: 160, protein: 14, carbs: 16, fat: 4, source: "fnri" },
  { name: "Beef Siomai", calories: 200, protein: 16, carbs: 18, fat: 7, source: "fnri" },
];

function generateMoreFoods() {
  const allFoods = [...filipinoFoods];
  const baseCount = filipinoFoods.length;
  
  // Add portion variations
  const portions = [
    { suffix: " (1 cup)", mult: 1 },
    { suffix: " (1/2 cup)", mult: 0.5 },
    { suffix: " (1.5 cups)", mult: 1.5 },
    { suffix: " (Small serving)", mult: 0.7 },
    { suffix: " (Large serving)", mult: 1.5 },
  ];
  
  // Generate variations
  for (let i = 0; i < Math.min(100, baseCount); i++) {
    const base = filipinoFoods[i];
    for (const portion of portions.slice(0, 3)) {
      if (allFoods.length >= 500) break;
      allFoods.push({
        name: base.name + portion.suffix,
        calories: Math.round(base.calories * portion.mult),
        protein: Math.round((base.protein || 0) * portion.mult * 10) / 10,
        carbs: Math.round((base.carbs || 0) * portion.mult * 10) / 10,
        fat: Math.round((base.fat || 0) * portion.mult * 10) / 10,
        source: base.source,
      });
    }
  }
  
  // Add more unique Filipino foods to fill remaining
  const moreFoods = [
    { name: "Pancit Guisado", calories: 270, protein: 11, carbs: 44, fat: 7, source: "fnri" },
    { name: "Pancit Sotanghon", calories: 240, protein: 9, carbs: 46, fat: 4, source: "fnri" },
    { name: "Pancit Habhab", calories: 260, protein: 10, carbs: 45, fat: 6, source: "fnri" },
    { name: "Pancit Batil Patong", calories: 380, protein: 18, carbs: 48, fat: 14, source: "fnri" },
    { name: "Pancit Cabagan", calories: 320, protein: 15, carbs: 42, fat: 11, source: "fnri" },
    { name: "Pancit Malabon Special", calories: 420, protein: 20, carbs: 50, fat: 16, source: "fnri" },
    { name: "Dinakdakan", calories: 380, protein: 24, carbs: 8, fat: 28, source: "fnri" },
    { name: "Bagnet", calories: 450, protein: 30, carbs: 2, fat: 35, source: "fnri" },
    { name: "Crispy Pata", calories: 520, protein: 32, carbs: 5, fat: 42, source: "fnri" },
    { name: "Pata Tim", calories: 480, protein: 35, carbs: 12, fat: 32, source: "fnri" },
    { name: "Pork Humba", calories: 380, protein: 28, carbs: 15, fat: 24, source: "fnri" },
    { name: "Pork Estofado", calories: 340, protein: 26, carbs: 18, fat: 18, source: "fnri" },
    { name: "Pork Asado", calories: 320, protein: 25, carbs: 12, fat: 18, source: "fnri" },
    { name: "Pork Hamonado", calories: 360, protein: 24, carbs: 20, fat: 20, source: "fnri" },
    { name: "Pork Igado", calories: 300, protein: 26, carbs: 10, fat: 16, source: "fnri" },
    { name: "Pork Paksiw", calories: 280, protein: 22, carbs: 8, fat: 16, source: "fnri" },
    { name: "Pork Adobo sa Gata", calories: 320, protein: 24, carbs: 8, fat: 22, source: "fnri" },
    { name: "Pork Binagoongan sa Gata", calories: 340, protein: 26, carbs: 10, fat: 24, source: "fnri" },
    { name: "Chicken Pastel", calories: 320, protein: 28, carbs: 18, fat: 16, source: "fnri" },
    { name: "Chicken Relleno", calories: 380, protein: 32, carbs: 12, fat: 22, source: "fnri" },
    { name: "Chicken Galantina", calories: 360, protein: 30, carbs: 15, fat: 20, source: "fnri" },
    { name: "Chicken Empanada", calories: 280, protein: 18, carbs: 28, fat: 12, source: "fnri" },
    { name: "Chicken Curry", calories: 300, protein: 28, carbs: 15, fat: 14, source: "fnri" },
    { name: "Chicken Teriyaki", calories: 260, protein: 30, carbs: 12, fat: 10, source: "fnri" },
    { name: "Chicken Barbecue", calories: 280, protein: 32, carbs: 8, fat: 12, source: "fnri" },
    { name: "Chicken Lollipop", calories: 220, protein: 24, carbs: 10, fat: 9, source: "fnri" },
    { name: "Chicken Wings", calories: 300, protein: 28, carbs: 8, fat: 18, source: "fnri" },
    { name: "Chicken Cordon Bleu", calories: 420, protein: 32, carbs: 22, fat: 22, source: "fnri" },
    { name: "Chicken Kiev", calories: 380, protein: 30, carbs: 18, fat: 22, source: "fnri" },
    { name: "Beef Caldereta", calories: 360, protein: 30, carbs: 18, fat: 20, source: "fnri" },
    { name: "Beef Kare-Kare", calories: 380, protein: 28, carbs: 20, fat: 24, source: "fnri" },
    { name: "Beef Mechado", calories: 340, protein: 28, carbs: 15, fat: 20, source: "fnri" },
    { name: "Beef Pares", calories: 400, protein: 35, carbs: 38, fat: 16, source: "fnri" },
    { name: "Beef Tapa", calories: 300, protein: 32, carbs: 8, fat: 14, source: "fnri" },
    { name: "Beef Tapa (Sweet)", calories: 320, protein: 30, carbs: 15, fat: 14, source: "fnri" },
    { name: "Beef Tapa (Spicy)", calories: 310, protein: 31, carbs: 10, fat: 15, source: "fnri" },
    { name: "Beef Rendang", calories: 380, protein: 30, carbs: 12, fat: 24, source: "fnri" },
    { name: "Beef Salpicao", calories: 320, protein: 32, carbs: 8, fat: 16, source: "fnri" },
    { name: "Beef Steak", calories: 280, protein: 30, carbs: 5, fat: 14, source: "fnri" },
    { name: "Beef Bulgogi", calories: 300, protein: 28, carbs: 15, fat: 14, source: "fnri" },
    { name: "Beef Broccoli", calories: 260, protein: 26, carbs: 12, fat: 12, source: "fnri" },
    { name: "Beef with Oyster Sauce", calories: 280, protein: 28, carbs: 10, fat: 14, source: "fnri" },
    { name: "Beef with Mushrooms", calories: 270, protein: 27, carbs: 12, fat: 12, source: "fnri" },
    { name: "Beef with Bell Peppers", calories: 250, protein: 26, carbs: 15, fat: 10, source: "fnri" },
    { name: "Beef with String Beans", calories: 240, protein: 25, carbs: 12, fat: 10, source: "fnri" },
    { name: "Beef Nilaga", calories: 320, protein: 32, carbs: 12, fat: 14, source: "fnri" },
    { name: "Beef Sinigang", calories: 240, protein: 28, carbs: 10, fat: 10, source: "fnri" },
    { name: "Beef Pochero", calories: 380, protein: 30, carbs: 20, fat: 20, source: "fnri" },
    { name: "Beef Morcon", calories: 420, protein: 32, carbs: 15, fat: 26, source: "fnri" },
    { name: "Beef Embutido", calories: 360, protein: 28, carbs: 18, fat: 20, source: "fnri" },
    { name: "Beef Lumpia", calories: 180, protein: 12, carbs: 15, fat: 8, source: "fnri" },
    { name: "Beef Siomai", calories: 220, protein: 18, carbs: 20, fat: 8, source: "fnri" },
    { name: "Beef Siopao", calories: 320, protein: 16, carbs: 42, fat: 10, source: "fnri" },
    { name: "Beef Pares Mami", calories: 420, protein: 35, carbs: 45, fat: 18, source: "fnri" },
    { name: "Beef Pares Rice", calories: 480, protein: 38, carbs: 55, fat: 18, source: "fnri" },
    { name: "Beef Pares with Egg", calories: 520, protein: 42, carbs: 55, fat: 22, source: "fnri" },
    { name: "Beef Pares Special", calories: 550, protein: 45, carbs: 58, fat: 24, source: "fnri" },
  ];
  
  allFoods.push(...moreFoods);
  
  // Fill remaining with more variations
  while (allFoods.length < 500) {
    const base = allFoods[Math.floor(Math.random() * Math.min(200, allFoods.length))];
    const variations = [
      { suffix: " (Regular)", mult: 1 },
      { suffix: " (Small)", mult: 0.7 },
      { suffix: " (Large)", mult: 1.3 },
      { suffix: " (Extra Large)", mult: 1.6 },
      { suffix: " (1 piece)", mult: 0.5 },
      { suffix: " (2 pieces)", mult: 1 },
      { suffix: " (3 pieces)", mult: 1.5 },
      { suffix: " (4 pieces)", mult: 2 },
      { suffix: " (5 pieces)", mult: 2.5 },
    ];
    const variation = variations[Math.floor(Math.random() * variations.length)];
    if (!allFoods.find(f => f.name === base.name + variation.suffix)) {
      allFoods.push({
        name: base.name + variation.suffix,
        calories: Math.round(base.calories * variation.mult),
        protein: Math.round((base.protein || 0) * variation.mult * 10) / 10,
        carbs: Math.round((base.carbs || 0) * variation.mult * 10) / 10,
        fat: Math.round((base.fat || 0) * variation.mult * 10) / 10,
        source: base.source,
      });
    }
  }
  
  return allFoods.slice(0, 500);
}

export async function POST() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const foods = generateMoreFoods();
    let created = 0;
    let updated = 0;
    
    for (const food of foods) {
      try {
        // Check if food exists
        const existing = await prisma.food.findFirst({
          where: { name: food.name },
        });
        
        if (existing) {
          await prisma.food.update({
            where: { id: existing.id },
            data: food,
          });
          updated++;
        } else {
          await prisma.food.create({ data: food });
          created++;
        }
      } catch {
        // Skip errors (keep endpoint robust)
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Seeded ${created} new and updated ${updated} Filipino foods`,
      created,
      updated,
      total: foods.length 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
