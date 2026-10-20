# Pure Flora — Wholesale Flower Marketplace

A premium, responsive frontend semester project made with **HTML5, CSS3 and vanilla JavaScript**. No frameworks, build tools, backend or paid APIs.

## Pages
- `index.html` — editorial homepage and brand story
- `products.html` — flower catalog, search, category/price/stock filters, sorting, wishlist
- `cart.html` — quantity controls, subtotal, delivery estimate, bulk savings and demo checkout
- `auth.html` — sign-in and registration UI with browser-local demo profile
- `dashboard.html` — grower dashboard and add-listing demo
- `tracking.html` — order tracking timeline (sample order `PF-2048`)
- `wishlist.html` — saved flowers
- `analytics.html` — sample sales chart and category insights

## Run in VS Code
1. Extract `pure_flora.zip` to a folder.
2. Open VS Code → **File → Open Folder** → select `pure_flora`.
3. Install the **Live Server** extension (Ritwick Dey) if it is not already installed.
4. Right-click `index.html` → **Open with Live Server**.
5. Browse the pages using the navigation links.

You can also open `index.html` directly in a browser, but Live Server is recommended.

## Project structure
```text
pure_flora/
├── index.html
├── products.html
├── cart.html
├── auth.html
├── dashboard.html
├── tracking.html
├── wishlist.html
├── analytics.html
├── css/
│   └── style.css
├── js/
│   ├── data.js
│   ├── app.js
│   ├── home.js
│   ├── products.js
│   ├── cart.js
│   ├── auth.js
│   ├── dashboard.js
│   ├── tracking.js
│   └── wishlist.js
└── assets/
```

## Frontend demo features
- Cart, wishlist, demo profile, custom grower listings and demo order state use `localStorage`.
- Catalog search, filters and sorting run in JavaScript.
- Product imagery uses remote Unsplash image URLs and Google Fonts need an internet connection. Replace them with local images in `js/data.js` for offline use.
- Demo checkout creates a local order and shows a tracking ID. No payment is processed.
- Authentication is a UI demonstration, not secure authentication. Never use real passwords or personal data.
- Dashboard and analytics numbers are illustrative.

## Main colors
- Blush: `#FCC7D5`
- Rose: `#EB59A1`
- Cream: `#FFF9F6`
- Deep botanical green: `#315B45`
- Ink: `#282326`

## Presentation tip
Explain the product goal, buyer/grower roles, responsive design, data model in `js/data.js`, browser storage, and the limitation that real user accounts, payments, inventory synchronization and delivery updates require a backend.


## Updated redesign notes
- Typography enlarged across pages, with responsive sizes for desktop and mobile.
- Header actions show labels for Search, Favorites, Account and Cart (labels compact on mobile).
- Flower cards open a product-details popup with description, grower, stock, price, quantity, cart and favourites actions.
- Grower listings are stored in this browser's localStorage and appear in Shop Flowers on this device.
- Registration/sign-in uses Buyer or Grower roles and routes growers to the grower dashboard.
- Visible “Semester project demo” footer wording removed.

This remains a front-end-only demo. Accounts and listings are stored locally in the browser and are not secure or shared across devices. Product images require an internet connection.
