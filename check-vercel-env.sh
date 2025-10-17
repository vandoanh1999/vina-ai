#!/bin/bash

# Script to check Vercel environment variables
# Usage: ./check-vercel-env.sh

echo "🔍 Checking Vercel Environment Variables for vina-ai..."
echo "=================================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not installed"
    echo "📦 Install with: npm i -g vercel"
    echo ""
    echo "Or check manually at:"
    echo "https://vercel.com/vandoanh1999s-projects/vina-ai/settings/environment-variables"
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""

# Try to get env vars
echo "📋 Fetching environment variables..."
echo ""

# Check if project is linked
if [ ! -f ".vercel/project.json" ]; then
    echo "⚠️  Project not linked to Vercel"
    echo "Run: vercel link"
    echo ""
    exit 1
fi

# List all env vars
echo "🔐 Environment Variables Status:"
echo "================================"

# Check critical vars
CRITICAL_VARS=("AUTH_SECRET" "POSTGRES_URL" "GROQ_API_KEY")
MISSING_VARS=()

for var in "${CRITICAL_VARS[@]}"; do
    # Try to check if var exists (this requires vercel CLI to be authenticated)
    vercel env ls 2>/dev/null | grep -q "$var"
    
    if [ $? -eq 0 ]; then
        echo "✅ $var - Found"
    else
        echo "❌ $var - Missing"
        MISSING_VARS+=("$var")
    fi
done

echo ""
echo "📊 Summary:"
echo "==========="
echo "Total critical vars: ${#CRITICAL_VARS[@]}"
echo "Missing vars: ${#MISSING_VARS[@]}"
echo ""

if [ ${#MISSING_VARS[@]} -eq 0 ]; then
    echo "🎉 All critical environment variables are set!"
    echo ""
    echo "Next steps:"
    echo "1. Run: vercel --prod"
    echo "2. Check: https://vina-ai.com"
else
    echo "⚠️  Missing ${#MISSING_VARS[@]} critical variable(s):"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "To add missing vars:"
    echo "1. Run: vercel env add $var production"
    echo "2. Or visit: https://vercel.com/vandoanh1999s-projects/vina-ai/settings/environment-variables"
fi

echo ""
echo "📖 Full guide: See VERCEL_ENV_CHECKLIST.md"
