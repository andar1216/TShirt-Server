Setup:
Git Clone 
Cd Client 
npm install
npm run dev



To Do:

Get Database working on AWS and local server
Get Stripe working on local and AWS server


In Customizer:
1. Make the text show up on the shirt within the 2nd mesh
3. Put in the ability to duplicate stuff in cart
4. Fix UI so it does not scroll up and down when clicking on one tab to another
7. Outline pink mesh when selecting decal
8. Get rid of pink mesh outline
9. Make the image bigger or smaller, rotate it, delete it, and also work with layers for better control. Not in 2d panel, but actually on the shirt
10. Select design from layers option
11. Add ability to take pictures and put right onto a t shirt. In Gallery when hitting upload, make it so that the first option 
12. Pick from existing uploads
13. Add in camera angles image and text from last github push



Cart:
1. Show preview image of the shirt
2. Show Price
3. Show Dynamic Size from when adding to cart from customizer to cart
4. Add stripe functionality on website
5. Add profile option
6. Add printful as a dropshipper option, including price, fulfilmment time, etc.
7. Be able to pick size
8. Duplicate items
9. Scroll down page - fix index css
10. Put in address
11. Put in payment information



Backend: Use Postgres Database, Use Node Js and Express Js server
1. Make profile option
2. Make a profile page
3. Have ability to save shirt designs to profile page
4. Have ability to easily share shirt link with other people
5. Make profile a url slug after the website name




Completed: 
2. Add to cart in the export tab 9/17
6. Have product picker - only going to have tshirt in it - can even just be a png of a t shirt 9/17














## 🚀 Getting Started


### Installation & Setup


1. Install dependencies:
```bash
npm install
```


2. Start the development server with hot reload:
```bash
npm run dev
```


3. Open [http://localhost:5173](http://localhost:5173) in your browser


### Phase 2

#### Andrew to Do
- **Checkout Flow**
  - Address form (name, address, phone, email)
  - Payment info (Stripe Elements)
  - Scroll layout fixes
  - Checkout arrow button / save / download export

  ## 💳 Stripe Integration
- Uses Payment Intents + Elements
- Client: PaymentElement in checkout
- Server: `/checkout/create-payment-intent` → returns `client_secret`
- After client confirmation: `/checkout/confirm` → create order, forward to Printful
- Webhook: `/webhooks/stripe` → update order status

## 📦 Printful Integration
- Flatten design layers → one file per shirt side
- Map variants (size/color) to Printful IDs
- Store `printful_order_id` in DB
- Webhook: `/webhooks/printful` updates order status


- **UX**
  - Show Amazon-style profile summary (name, default address)

- **Views**
  - Multiple views: Front / Back / Left / Right / Back Upper

    - Static “upload decal” on shirt opens picker/camera



### Enis to Do
  - Add/select/order layers (images, text)
   - Transform: move, scale, rotate, delete all on the actual design itself
  - Lock aspect ratio on upload
  - Crop tool (rectangular)
  - Outline design when selected


#### Customizer (Editor)
- **Canvas & Layers**
  - Add/select/order layers (images, text)
  - Transform: move, scale, rotate, delete
  - Lock aspect ratio on upload
  - Crop tool (rectangular)
  - Outline when selected


- **Assets & Uploads**
  - Pick from previous uploads (asset library)




- **Text**
  - Add text layers; inline editing right on canvas
  - Font, weight, size, color, alignment


- **UI/UX**
  - Decal highlight when selected


- **Cart Hooks**
  - “Add to Cart” from Export panel (saves design + options)
  - Preview shipping options inside customizer
  - Comment out “send to orders” for now


#### Cart & Checkout
- **Line Items**
  - Pick size (S–5XL)
  - Duplicate items
  - Edit quantity / remove
- Have size picked from customizer show up in cart





#### Global / Profile
- Profile page with saved designs (virtual closet) and liked designs
- Dynamic product catalog (instead of hardcoded)


### Database Schema (Core Tables)
- `users`: id, email, password_hash, name
- `profiles`: user_id, default_address_id, avatar_url
- `addresses`: id, user_id, line1, city, state, zip, country
- `assets`: id, user_id, url, width, height, mime
- `designs`: id, user_id, product_id, name, canvas info
- `design_layers`: id, design_id, type (image/text), src/text/font/size/color/x/y/scale/rotation/z_index
- `products`: id, name, sku, base_price, mockups, colors
- `carts`: id, user_id, created_at, updated_at
- `cart_items`: id, cart_id, product_id, design_id, size, color, qty, unit_price, preview_url
- `orders`: id, user_id, cart_id, status, total, shipping_method, stripe_payment_intent, printful_order_id
- `order_items`: id, order_id, product_id, design_snapshot, size, color, qty, unit_price
- `likes`: id, user_id, design_id (optional social feature)


### REST API Routes
- **Auth**
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- **Profile**
  - `GET /api/profile`
  - `PUT /api/profile`
  - `GET/POST/DELETE /api/addresses`
- **Assets**
  - `POST /api/assets`
  - `GET /api/assets`
- **Designs**
  - `POST /api/designs`
  - `GET /api/designs`
  - `PUT /api/designs/:id`
  - `POST /api/designs/:id/export`
- **Products**
  - `GET /api/products`
- **Cart**
  - `GET /api/cart`
  - `POST /api/cart/items`
  - `PUT /api/cart/items/:id`
  - `DELETE /api/cart/items/:id`
  - `POST /api/cart/items/:id/duplicate`
- **Checkout / Stripe**
  - `POST /api/checkout/create-payment-intent`
  - `POST /api/checkout/confirm`
  - `POST /webhooks/stripe`
- **Fulfillment / Printful**
  - `POST /api/fulfillment/quote`
  - `POST /api/fulfillment/create-order`
  - `GET /api/fulfillment/order/:id`
  - `POST /webhooks/printful`


________________________________________________________



















### Hot Reload Features ✨


This project includes enhanced hot reload capabilities optimized for React Three Fiber applications:


#### Hot Reload Indicator
- **Visual Feedback**: Green indicator shows when hot reload is active
- **Reload Status**: Yellow pulsing indicator during reloads
- **Timestamp**: Hover to see last reload time
- **Only in Development**: Automatically hidden in production


#### Enhanced HMR Configuration
- **Fast Refresh**: Optimized React Fast Refresh for better performance
- **Three.js Pre-bundling**: Pre-bundles Three.js dependencies for faster reloads
- **Smart File Watching**: Ignores unnecessary files for better performance
- **Resource Cleanup**: Automatic cleanup of Three.js resources during hot reload


#### Development Scripts
```bash
# Start development server with hot reload
npm run dev


# Start with ngrok tunnel for external access
npm run dev:with-tunnel


# Build for production
npm run build
```




Features we need to add
1. Export designs in multiple dimensions with dimension and quality options
2. Upload images while keep their exact ratio
3. Make the image bigger or smaller, rotate it, delete it, and also work with layers for better control
    a. Select design from layers option
4. Have a dynamic footer menu that changes based on whether a design is clicked or not
5. Pick from existing uploads
6. Pick image right from t shirt at beginning of scene. There should be a static image on the t shirt for uploading a picture that, when clicked, opens camera roll or designs that were previusly saved
7. Multiple Level Views of the object [Front, Back, Left Side, Right Side, Back Upper]
8. Add Text to shirt
9. Be able to Crop Design
10. Dynamic Tools bar that changes to bottom on mobile screens, stays on side for desktop and ipad screens.
Features when not clicked on an image:


- Text
- Picture Uploads
- Camera


Features when clicked on image for dynamic toolbar
- Replace image
- Crop


---


## 🎨 **Feature Implementation Status**


### ✅ **Fully Implemented Features**


#### **Export System**
- **Multiple Formats**: PNG, JPG, WebP, SVG, MP4, WebM, OBJ, STL, GLB
- **Dimension Options**: 512x512, 1024x1024, 1920x1920, 2048x2048, 4096x4096
- **Quality Settings**: 50%, 70%, 80%, 90%, 100%
- **Video Export**: Animation support with 3s, 5s, 10s, 15s, 30s durations
- **Batch Export**: Multiple formats and sizes in one operation


#### **Image Management**
- **Aspect Ratio Preservation**: High-quality image processing maintains exact ratios
- **Layer System**: Full layer management with drag & drop reordering
- **Image Manipulation**: Scale, rotate, position, opacity control
- **Upload History**: Browse and reuse previously uploaded images
- **Crop Tool**: Multiple aspect ratios (1:1, 4:3, 16:9, etc.) with free-form cropping


#### **Text System**
- **Text Creation**: Add custom text elements to shirt
- **Font Options**: 10+ font families (Arial, Helvetica, Times New Roman, etc.)
- **Size Control**: 12px to 72px range
- **Color Customization**: Full color picker integration
- **Text Styling**: Bold, italic, underline options
- **Live Preview**: Real-time text preview


#### **Camera & Views**
- **Multiple Views**: Front, Back, Left Side, Right Side, Back Upper
- **Smooth Transitions**: Camera position changes with animations
- **Animation System**: 360° spin, zoom, rotate, float animations
- **Camera Controls**: Reset, fit to screen, center view


#### **Responsive Design**
- **Mobile**: Bottom toolbar with compact layout (≤600px)
- **Tablet**: Bottom toolbar with medium spacing (601px-1260px)
- **Desktop**: Side panel with vertical tabs (≥1261px)
- **Touch Optimization**: Mobile-friendly interactions


### ⚠️ **Partially Implemented**


#### **Static Upload Area**
- **Status**: State structure exists but UI implementation needed
- **Missing**: Clickable upload area directly on shirt surface


#### **Context-Aware Toolbar** ✅
- **Status**: Fully implemented with dynamic behavior
- **Features**: Changes based on design selection with Replace, Crop, Transform, Layers, Delete options


### ❌ **Missing Features**


#### **Static Upload Area on Shirt**
- **Status**: Mentioned in requirements but not fully implemented
- **Current**: Upload through design panel
- **Needed**: Clickable area on shirt for direct uploads


#### **All Other Core Features Complete!**
- **Status**: All major features have been implemented
- **Remaining**: Only minor enhancements and polish items


---










### **Architecture Highlights:**
- **Modular Design**: Clean separation of concerns
- **Reactive State**: Valtio for efficient state management
- **Component Composition**: Reusable UI components
- **Responsive Patterns**: Mobile-first responsive design
- **Performance**: Optimized 3D rendering and memory management

















