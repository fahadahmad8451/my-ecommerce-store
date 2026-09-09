# Shopify primary backend setup

DESKAVYN uses the Shopify Storefront API for customer-facing catalog and cart work, and the Shopify Admin GraphQL API only on the server for administrative work.

## Required environment values

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`
- `SHOPIFY_ADMIN_ACCESS_TOKEN` (private; never expose it in the browser)
- `ADMIN_DASHBOARD_PASSWORD` (private; required for production admin access)

## Recommended custom-app scopes

Start with the least privilege needed for the next implementation phase:

- `read_products`, `write_products`
- `read_inventory`, `write_inventory`
- `read_orders`, `write_orders`
- `read_customers`, `write_customers`
- `read_discounts`, `write_discounts`
- `read_fulfillments`, `write_fulfillments`
- `read_content`, `write_content`
- `read_files`, `write_files`

Install the custom app in Shopify Admin, then store its Admin API access token only in `.env.local` or your deployment provider's secret manager. Do not put it in `NEXT_PUBLIC_*`.

The custom admin is protected with HTTP Basic authentication when `ADMIN_DASHBOARD_PASSWORD` is configured. In production, the app returns a configuration error instead of exposing admin pages if this variable is missing. Replace this temporary single-admin guard with Shopify app OAuth/session-based roles before allowing multiple staff accounts.

## Architecture decisions

- Shopify remains the source of truth for products, variants, inventory, collections, discounts, orders, fulfilment, customers and files.
- The Storefront Cart API creates and updates carts, applies discount codes and returns Shopify's hosted checkout URL.
- Payments are completed through Shopify Checkout and its configured payment providers; this app must not collect card data.
- Customer wishlists, support inbox state, audit records and admin-only preferences need an app-owned persistence layer later because Shopify does not provide a complete custom-admin substitute for all of those workflows.
