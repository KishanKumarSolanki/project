# Ananya Atelier — Premium Saree Storefront

This project is a luxury Indian saree e-commerce storefront built with React + Vite. It includes a premium editorial homepage, category browsing, product detail pages, cart, checkout flow, wishlist support, and responsive shopping flows.

## Run locally

```bash
npm install
npm run dev -- --host 0.0.0.0
```

Then open the local Vite preview URL in the browser.

## Production notes

- This frontend is intentionally designed to keep payment and shipping credentials off the client.
- Actual Razorpay and Shiprocket integrations should live in a secure backend service with environment variables such as:
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
  - `SHIPROCKET_EMAIL`
  - `SHIPROCKET_PASSWORD`
  - `SHIPROCKET_API_BASE`
- The app is structured so that these integrations can be added as a separate backend layer without exposing secrets in the browser.

## Included experience

- Luxury editorial landing page
- Product collection and filters
- Product detail page with gallery and delivery check
- Cart and checkout flows
- Dynamic quantity updates and local persistence
- Responsive mobile-first layout

## Admin catalog

- Open `/admin` and sign in with Firebase email/password. Access is granted only when `users/{uid}.role` is `admin`.
- Products are read from and written to the Firestore `products` collection; categories are stored in `categories`.
- Only records with `showOnStorefront: true` appear on the public website. New admin entries are published by default; older records without this field stay hidden until explicitly published in the admin panel.
- Product galleries accept one or more public HTTPS image URLs, including Cloudinary URLs; category covers accept one HTTPS image URL. Images are displayed directly from the URLs saved in the admin panel.
- Configure Firestore Security Rules so catalog reads are public and product/category writes are limited to signed-in users whose `users/{uid}.role` is `admin`. Allow users to read their own `users/{uid}` document for the role check, and do not allow users to change their own role. The `/admin` screen check is not a replacement for Firebase Security Rules.
