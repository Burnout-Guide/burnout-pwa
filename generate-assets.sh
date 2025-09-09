#!/bin/bash

# Generate PWA assets using ImageMagick
# Requires: brew install imagemagick (macOS) or apt-get install imagemagick (Linux)

echo "Generating PWA assets..."

# Create base icon from SVG if it doesn't exist
if [ ! -f "icon.svg" ]; then
    echo "Error: icon.svg not found"
    exit 1
fi

# Convert SVG to PNG for base icon
convert -background none -density 512 icon.svg -resize 512x512 icon-512.png

# Generate Apple Touch Icon
convert icon-512.png -resize 180x180 apple-touch-icon.png

# Generate Android icons with proper sizing
convert icon-512.png -resize 192x192 icon-192.png
convert icon-512.png -resize 384x384 icon-384.png
convert icon-512.png -resize 512x512 icon-maskable-512.png

# Add padding for maskable icon (safe area)
convert icon-512.png -resize 384x384 -gravity center -background "#2c3e50" -extent 512x512 icon-maskable-512.png

# Generate favicon sizes
convert icon-512.png -resize 32x32 favicon-32.png
convert icon-512.png -resize 16x16 favicon-16.png

# Generate iOS splash screens with gradient background
# Create gradient background
convert -size 2048x2732 gradient:'#2c3e50-#3498db' gradient.png

# iPhone 16 Pro Max, 15 Pro Max, 14 Pro Max (1290x2796)
convert gradient.png -resize 1290x2796! -gravity center icon-512.png -resize 256x256 -composite splash-1290x2796.png

# iPhone 16 Pro, 15 Pro, 14 Pro (1179x2556) 
convert gradient.png -resize 1179x2556! -gravity center icon-512.png -resize 256x256 -composite splash-1179x2556.png

# iPhone 16, 15, 14 (1170x2532)
convert gradient.png -resize 1170x2532! -gravity center icon-512.png -resize 256x256 -composite splash-1170x2532.png

# iPhone 13 mini, 12 mini (1125x2436)
convert gradient.png -resize 1125x2436! -gravity center icon-512.png -resize 256x256 -composite splash-1125x2436.png

# iPhone 11 Pro Max, XS Max (1242x2688)
convert gradient.png -resize 1242x2688! -gravity center icon-512.png -resize 256x256 -composite splash-1242x2688.png

# iPhone 11, XR (828x1792)
convert gradient.png -resize 828x1792! -gravity center icon-512.png -resize 200x200 -composite splash-828x1792.png

# iPhone 8 Plus, 7 Plus (1242x2208)
convert gradient.png -resize 1242x2208! -gravity center icon-512.png -resize 200x200 -composite splash-1242x2208.png

# iPhone 8, 7, SE2 (750x1334)
convert gradient.png -resize 750x1334! -gravity center icon-512.png -resize 180x180 -composite splash-750x1334.png

# iPhone SE1 (640x1136)
convert gradient.png -resize 640x1136! -gravity center icon-512.png -resize 160x160 -composite splash-640x1136.png

# iPad Pro 12.9" (2048x2732)
convert gradient.png -resize 2048x2732! -gravity center icon-512.png -resize 384x384 -composite splash-2048x2732.png

# iPad Pro 11" (1668x2388)
convert gradient.png -resize 1668x2388! -gravity center icon-512.png -resize 320x320 -composite splash-1668x2388.png

# iPad 10.2", Air (1536x2048)
convert gradient.png -resize 1536x2048! -gravity center icon-512.png -resize 300x300 -composite splash-1536x2048.png

# Clean up temp file
rm gradient.png

echo "Asset generation complete!"
echo "Generated:"
echo "  - Apple touch icon (180x180)"
echo "  - Android icons (192x192, 384x384, 512x512 + maskable)"
echo "  - Favicons (16x16, 32x32)"
echo "  - iOS splash screens for all devices"
echo ""
echo "Remember to update manifest.json with new icon paths!"