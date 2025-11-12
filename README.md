# Pokémon Cards Store - E-commerce Platform

A modern, full-stack e-commerce platform for buying and selling collectible Pokémon trading cards. Built with Next.js, Strapi CMS, and React Native for a seamless cross-platform experience.

## 🌟 Features

- **Modern E-commerce** - Complete shopping experience with cart, checkout, and order management
- **Multi-platform** - Web app (Next.js), Mobile app (React Native/Expo), and Admin panel (Strapi)
- **SEO Optimized** - Comprehensive SEO strategy with schema.org structured data, dynamic sitemaps, and meta tags
- **Analytics Ready** - Google Analytics 4 integration with full e-commerce event tracking
- **CRO Focused** - Conversion-optimized user flows, trust signals, and accessibility compliance
- **Type Safety** - 100% TypeScript across the entire monorepo
- **Monorepo Architecture** - Powered by Turborepo for efficient builds and development

## 📚 Documentation

- **[CRO/SEO/Analytics Strategy](./CRO_SEO_ANALYTICS_STRATEGY.md)** - Complete strategy documentation
- **[Google Analytics Implementation](./GOOGLE_ANALYTICS.md)** - Event tracking guide

## 🏗️ Project Structure

This Turborepo includes the following packages/apps:

### Apps and Packages

#### Applications

- **`web`** - Next.js 14+ e-commerce web application
  - Product browsing and search
  - Shopping cart and checkout
  - User authentication and account management
  - Wishlist functionality
  - SEO-optimized with dynamic metadata
  - Google Analytics 4 integration
- **`mobile`** - React Native mobile app (Expo)
  - Native iOS/Android experience
  - Product browsing and purchasing
  - Bottom tab navigation
  - NativeWind styling
- **`backend`** - Strapi CMS headless backend
  - Product management
  - Order processing
  - User management
  - Content API
  - Admin panel
- **`docs`** - Documentation Next.js app

#### Shared Packages

- **`@repo/ui`** - Shared React component library
- **`@repo/eslint-config`** - ESLint configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- **`@repo/typescript-config`** - TypeScript configurations used throughout the monorepo
- **`apps/shared/types`** - Shared TypeScript types (pokemon, type definitions)

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Jest](https://jestjs.io/) for unit testing

**Note:** Cypress for e2e testing is planned but not yet configured.

## 📊 SEO, CRO & Analytics

This project implements a comprehensive strategy for:

- **Search Engine Optimization (SEO)** - Dynamic metadata, schema.org structured data, sitemaps, and robots.txt
- **Conversion Rate Optimization (CRO)** - Trust signals, optimized funnels, accessibility, and mobile-first design
- **Analytics** - Google Analytics 4 with complete e-commerce event tracking

### Key Features

✅ **SEO Implementation:**

- Dynamic metadata and Open Graph tags on all pages
- Schema.org structured data (Product, Organization, Website, Breadcrumb)
- Auto-generated sitemaps with product and category pages
- Optimized URL structure and internal linking
- Image alt text and accessibility compliance

✅ **CRO Implementation:**

- Trust signals (stock availability, authenticity guarantees, team transparency)
- Optimized conversion funnels
- Clear call-to-action buttons
- Mobile-responsive design
- Streamlined checkout process
- Wishlist and cart persistence

✅ **Analytics Implementation:**

- Google Analytics 4 integration
- 6 core e-commerce events tracked:
  - `view_item` - Product page views
  - `add_to_cart` - Items added to cart
  - `begin_checkout` - Checkout initiated
  - `add_payment_info` - Payment method selected
  - `purchase` - Transaction completed

For complete details, see **[CRO_SEO_ANALYTICS_STRATEGY.md](./CRO_SEO_ANALYTICS_STRATEGY.md)**

## 🎯 Key Technologies

- **Frontend:** Next.js 15+, React 19, TypeScript, Tailwind CSS
- **Mobile:** React Native, Expo, NativeWind
- **Backend:** Strapi CMS, Node.js
- **Database:** SQLite (development), PostgreSQL (production ready)
- **Analytics:** Google Analytics 4
- **Testing:** Jest
- **Monorepo:** Turborepo
- **Deployment:** Vercel (frontend), Railway/Heroku (backend)

## 📱 Mobile App

The mobile app is built with React Native and Expo for native iOS and Android experiences.

### Features

- Product browsing with native performance
- Shopping cart and checkout
- User authentication
- Bottom tab navigation
- NativeWind styling (Tailwind for React Native)
- Offline support (planned)

## 🔒 Authentication

User authentication is handled through Strapi's built-in auth system:

- Email/password registration and login
- JWT token-based authentication
- Protected routes and API endpoints
- User profile management
- Order history tracking

## 🛒 E-commerce Features

### Product Management

- Product listing with search and filtering
- Product details with images and specifications
- Type-based categorization (Fire, Water, Grass, etc.)
- Rarity levels (Common, Rare, Ultra Rare)
- Condition tracking (Mint, Near Mint, Played)
- Stock availability

### Shopping Experience

- Advanced search with autocomplete
- Filter by type, rarity, price
- Sort by various criteria
- Shopping cart with persistence
- Wishlist functionality
- Guest browsing, login required for checkout

### Checkout & Orders

- Streamlined checkout flow
- Multiple payment methods (Card, PayPal)
- Shipping address management
- Order confirmation and tracking
- Order history for logged-in users

## 📈 Performance

- **Lighthouse Score:** 90+ on all metrics
- **Core Web Vitals:**
  - LCP (Largest Contentful Paint): <2.5s
  - FID (First Input Delay): <100ms
  - CLS (Cumulative Layout Shift): <0.1
- **Next.js Image Optimization:** Automatic image optimization and lazy loading
- **Code Splitting:** Route-based code splitting for faster load times

## ♿ Accessibility

- WCAG 2.1 AA compliance
- Semantic HTML throughout
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatible
- Color contrast ratios meeting standards
- Focus indicators on interactive elements

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Jan** - [t-kupp](https://github.com/t-kupp)
- **Zarha** - [zarhaselene](https://github.com/zarhaselene)
- **Embla** - [emblaah](https://github.com/emblaah)
- **Daniel** - [dantilldev](https://github.com/dantilldev)
- **Joel** - [joel050505](https://github.com/Joel050505)


