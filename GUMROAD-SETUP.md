# Gumroad Webhook Setup Guide

This document explains how to configure Gumroad to work with the jimmytools.net webhook integration for branded download pages.

## How It Works

1. Customer purchases a product on Gumroad
2. Gumroad sends a webhook to `jimmytools.net/api/gumroad-webhook`
3. The webhook creates a unique, time-limited download token
4. Customer is redirected to `jimmytools.net/download/{token}`
5. They see a branded download page with the product

## Gumroad Configuration Steps

### 1. Set Up Webhook URL

For **each product** you want to use the branded download page:

1. Go to Gumroad Dashboard
2. Select your product
3. Click **"Edit product"**
4. Navigate to **"Advanced"** settings
5. Find **"Ping URL"** (webhook URL)
6. Enter: `https://jimmytools.net/api/gumroad-webhook`
7. Save the product

### 2. Configure Redirect URL

After purchase, customers should be redirected to the download page:

**Option A: Automatic Redirect (Recommended)**
1. In the same product settings
2. Find **"Redirect URL"** or **"Thank you page"**
3. Enable custom redirect
4. The webhook returns a `download_url` in the response
5. Gumroad should automatically handle this

**Option B: Manual Link in Email**
If Gumroad doesn't auto-redirect:
1. The webhook logs the download URL
2. You can send it to the customer via email
3. Or customize the Gumroad receipt email to include: "Download at: {download_url}"

### 3. Product Mapping

The webhook currently supports these product IDs (update `/app/api/gumroad-webhook/route.ts` to add more):

- `investigation-methodology` → Investigation Methodology Guide
- `foia-guide` → FOIA Request Guide

**To add a new product:**

1. Open `/app/api/gumroad-webhook/route.ts`
2. Add to the `PRODUCT_MAPPING` object:
   ```typescript
   'your-product-id': {
     name: 'Your Product Name',
     downloadUrl: '/files/your-file.pdf',
   },
   ```

3. Open `/app/api/validate-token/route.ts`
4. Add to the `PRODUCT_INFO` object:
   ```typescript
   'your-product-id': {
     description: 'Your product description',
     downloadUrl: '/files/your-file.pdf',
     fileType: 'PDF',
     fileSize: '2.4 MB',
   },
   ```

5. Upload your PDF to `/public/files/your-file.pdf`
6. Commit and push to GitHub (Vercel auto-deploys)

## Testing the Webhook

### Local Testing

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Use a tool like [ngrok](https://ngrok.com) to expose localhost:
   ```bash
   ngrok http 3000
   ```

3. Use the ngrok URL as your Gumroad webhook temporarily:
   ```
   https://abc123.ngrok.io/api/gumroad-webhook
   ```

4. Make a test purchase (Gumroad has a test mode)

### Production Testing

1. After deploying to Vercel, test the webhook endpoint:
   ```bash
   curl https://jimmytools.net/api/gumroad-webhook
   ```
   
   You should see:
   ```json
   {
     "status": "ok",
     "message": "Gumroad webhook endpoint is active"
   }
   ```

2. Make a real or test purchase on Gumroad
3. Check Vercel logs for webhook activity
4. Verify the download link works

## Webhook Data

Gumroad sends these fields in the webhook (form data):

- `sale_id` - Unique sale identifier
- `product_id` - Your product's permalink/ID
- `product_name` - Product name
- `email` - Customer's email
- `permalink` - Gumroad product URL

## Token System

**Token Features:**
- Unique UUID for each purchase
- Expires after **7 days**
- Maximum **5 downloads** per token
- Stored in `/data/tokens.json` (gitignored)

**Token Data Structure:**
```json
{
  "abc-123-uuid": {
    "token": "abc-123-uuid",
    "productId": "investigation-methodology",
    "productName": "Investigation Methodology Guide",
    "email": "customer@example.com",
    "saleId": "gumroad-sale-id",
    "createdAt": 1708646400000,
    "downloadCount": 0,
    "expiresAt": 1709251200000
  }
}
```

## Production Considerations

**For scaling beyond file storage, migrate to a database:**

1. Replace `/data/tokens.json` with a database (Vercel Postgres, Supabase, etc.)
2. Update these files:
   - `/app/api/gumroad-webhook/route.ts`
   - `/app/api/validate-token/route.ts`
   - `/app/api/track-download/route.ts`

3. Add database connection in `lib/db.ts`

**Security Enhancements:**
- Add Gumroad webhook signature validation (if available)
- Rate limit the webhook endpoint
- Add admin dashboard to view/manage tokens

## Troubleshooting

**Webhook not firing:**
- Check Gumroad product settings
- Verify the ping URL is saved correctly
- Check Vercel deployment logs

**Token not found:**
- Webhook may have failed
- Check `/data/tokens.json` exists (create manually if needed)
- Verify the webhook is writing to the file

**Downloads not tracking:**
- Check browser console for errors
- Verify `/api/track-download` is accessible
- Check Vercel function logs

## Support

Questions? Email: jimmytools.open@gmail.com
