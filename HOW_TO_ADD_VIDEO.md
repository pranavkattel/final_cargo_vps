# 🎥 How to Add Video Background to Hero Section

## Quick Guide

Your hero section is now **85vh tall** (huge!) and ready for a professional video background.

## Step 1: Get a Professional Video

### Recommended Video Specifications:
- **Resolution:** 1920x1080 (Full HD) or 3840x2160 (4K)
- **Duration:** 15-30 seconds (it will loop automatically)
- **Format:** MP4 (H.264 codec)
- **File size:** Under 10MB for fast loading
- **Content:** Cargo/logistics related

### Free Stock Video Sources:
1. **Pexels Videos** - https://www.pexels.com/videos/
   - Search: "cargo plane", "shipping port", "warehouse logistics", "delivery truck"
   
2. **Pixabay Videos** - https://pixabay.com/videos/
   - Search: "freight", "cargo", "logistics", "airplane cargo"
   
3. **Videvo** - https://www.videvo.net/
   - Search: "international shipping", "cargo container"

### Recommended Video Themes:
- ✈️ Cargo plane loading or taking off
- 🚢 Container ships at port
- 📦 Warehouse with automated systems
- 🚛 Delivery trucks on highway
- 🌍 Global map with connection lines
- 📱 Modern logistics technology

## Step 2: Save Video File

1. Download your chosen video
2. Rename it to: `hero-background.mp4`
3. Place it in: `public/videos/hero-background.mp4`

Create the directory if it doesn't exist:
```bash
mkdir public/videos
```

## Step 3: Update Home.tsx Code

Open: `src/pages/Home.tsx`

Find this section (around line 90):

```tsx
{/* Video Background Placeholder - You can add video element here */}
<div className="absolute inset-0 opacity-20">
  <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900"></div>
  {/* Future: Add <video> element here */}
</div>
```

Replace it with:

```tsx
{/* Video Background */}
<div className="absolute inset-0 opacity-20">
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source src="/videos/hero-background.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900"></div>
</div>
```

## Step 4: Optimize Video (Optional but Recommended)

Use **HandBrake** (free tool) to compress video:

### HandBrake Settings:
1. **Preset:** Web > Gmail Large 3 Minutes 720p30
2. **Format:** MP4
3. **Video Codec:** H.264
4. **Quality:** Constant Quality 23
5. **Framerate:** 30fps
6. **Resolution:** 1920x1080 (or keep original)

Download HandBrake: https://handbrake.fr/

This reduces file size by 70% without visible quality loss!

## Step 5: Advanced Styling (Optional)

### Make Video More Subtle:
Change opacity from `opacity-20` to `opacity-15` or `opacity-10`

### Add Blur Effect:
```tsx
<video
  className="absolute inset-0 w-full h-full object-cover blur-sm"
  ...
>
```

### Add Color Overlay:
Change the gradient overlay color to match your brand:
```tsx
<div className="absolute inset-0 bg-blue-900/60"></div>
```

### Make Video Darker:
Add brightness filter:
```tsx
<video
  className="absolute inset-0 w-full h-full object-cover brightness-75"
  ...
>
```

## Step 6: Mobile Optimization

### Option 1: Different Video for Mobile
```tsx
<video className="absolute inset-0 w-full h-full object-cover hidden md:block">
  <source src="/videos/hero-background.mp4" type="video/mp4" />
</video>
<video className="absolute inset-0 w-full h-full object-cover md:hidden">
  <source src="/videos/hero-background-mobile.mp4" type="video/mp4" />
</video>
```

### Option 2: Static Image on Mobile
```tsx
{/* Desktop: Video */}
<video className="absolute inset-0 w-full h-full object-cover hidden md:block">
  <source src="/videos/hero-background.mp4" type="video/mp4" />
</video>

{/* Mobile: Image */}
<img 
  src="/images/hero-mobile.jpg" 
  alt="Cargo Background"
  className="absolute inset-0 w-full h-full object-cover md:hidden"
/>
```

## Complete Example Code

Here's the full hero section with video:

```tsx
{/* Hero Section - Bigger for Video Background */}
<section className="relative text-white min-h-[85vh] flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0096C7 0%, #007bb3 100%)' }}>
  {/* Video Background */}
  <div className="absolute inset-0 opacity-20">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source src="/videos/hero-background.mp4" type="video/mp4" />
    </video>
    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900"></div>
  </div>
  
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      {/* ... rest of hero content ... */}
    </div>
  </div>
</section>
```

## Troubleshooting

### Video Not Playing?
1. Check file path is correct: `/videos/hero-background.mp4`
2. Verify file is in `public/` folder (not `src/`)
3. Clear browser cache (Ctrl+Shift+R)
4. Check video format is MP4 with H.264 codec
5. Try a different browser

### Video Too Large/Slow?
1. Use HandBrake to compress (see Step 4)
2. Target file size: 5-10MB max
3. Consider using image on mobile devices
4. Host video on CDN for faster loading

### Video Quality Issues?
1. Use higher quality source video
2. Reduce opacity/blur if video looks bad
3. Consider static image instead
4. Use gradient overlay to hide imperfections

## Examples of Great Cargo Video Backgrounds

Search these on Pexels/Pixabay:
- "cargo plane sunset" - Dramatic loading scenes
- "container ship aerial" - Beautiful port views
- "logistics warehouse" - Modern tech feel
- "delivery network" - Global connection vibe
- "freight train" - Power and reliability

## Alternative: Use Vimeo/YouTube

If video file is too large, embed from Vimeo:

```tsx
<iframe
  src="https://player.vimeo.com/video/YOUR_VIDEO_ID?background=1&autoplay=1&loop=1&muted=1"
  className="absolute inset-0 w-full h-full"
  frameBorder="0"
  allow="autoplay; fullscreen"
></iframe>
```

## Performance Tips

1. **Lazy Load:** Only load video on desktop
2. **Poster Image:** Add poster="/images/hero-poster.jpg"
3. **Preload:** Add preload="auto" for faster start
4. **CDN:** Host on Cloudflare or AWS for global speed

## Final Checklist

- [ ] Video downloaded and optimized
- [ ] File saved in `public/videos/`
- [ ] Code updated in Home.tsx
- [ ] Tested on desktop browser
- [ ] Tested on mobile device
- [ ] Video file size under 10MB
- [ ] Video looks good with opacity overlay
- [ ] Text is still readable over video
- [ ] Video loops smoothly without gap

---

**🎬 Ready to make your hero section STUNNING! 🎬**

A professional video background will make Capital Cargo look like a Fortune 500 company!
