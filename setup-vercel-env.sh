#!/bin/bash

# Script to help copy environment variables to Vercel
# This script generates the commands you need to run in Vercel CLI

echo "🔐 Vercel Environment Variables Setup Script"
echo "=============================================="
echo ""
echo "📋 Copy and paste these commands in your terminal:"
echo ""

# Read from .env.local
if [ -f .env.local ]; then
  echo "# Setting up environment variables from .env.local"
  echo ""
  
  # AUTH_SECRET
  AUTH_SECRET=$(grep '^AUTH_SECRET=' .env.local | cut -d '=' -f2-)
  if [ -n "$AUTH_SECRET" ]; then
    echo "vercel env add AUTH_SECRET production preview development <<< '$AUTH_SECRET'"
  fi
  
  # REDIS_URL
  REDIS_URL=$(grep '^REDIS_URL=' .env.local | cut -d '=' -f2-)
  if [ -n "$REDIS_URL" ]; then
    echo "vercel env add REDIS_URL production preview <<< '$REDIS_URL'"
  fi
  
  # BLOB_READ_WRITE_TOKEN
  BLOB_TOKEN=$(grep '^BLOB_READ_WRITE_TOKEN=' .env.local | cut -d '=' -f2-)
  if [ -n "$BLOB_TOKEN" ]; then
    echo "vercel env add BLOB_READ_WRITE_TOKEN production preview <<< '$BLOB_TOKEN'"
  fi
  
  echo ""
  echo "# ⚠️ You still need to add these manually:"
  echo "# 1. POSTGRES_URL - Get from Vercel Postgres dashboard"
  echo "# 2. GROQ_API_KEY - Get from https://console.groq.com/"
  echo ""
  echo "vercel env add POSTGRES_URL production preview development"
  echo "# Paste your Postgres URL when prompted"
  echo ""
  echo "vercel env add GROQ_API_KEY production preview development"
  echo "# Paste your Groq API key when prompted"
  
else
  echo "❌ .env.local not found!"
  exit 1
fi

echo ""
echo "=============================================="
echo "📝 Alternative: Use Vercel Dashboard"
echo "https://vercel.com/vandoanh1999s-projects/vina-ai/settings/environment-variables"
echo ""
