-- Insert categories
INSERT INTO "Category" (id, name, slug, "createdAt", "updatedAt") VALUES
  ('cat_3d_models', '3D Models', '3d-models', NOW(), NOW()),
  ('cat_code_snippets', 'Code Snippets', 'code-snippets', NOW(), NOW()),
  ('cat_notion_templates', 'Notion Templates', 'notion-templates', NOW(), NOW()),
  ('cat_ui_kits', 'UI Kits', 'ui-kits', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Insert test seller
INSERT INTO "User" (id, "auth0Id", email, name, role, "avatarUrl", "createdAt", "updatedAt") VALUES
  ('seller_123', 'auth0|seller123', 'seller@example.com', 'John Creator', 'SELLER', 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert test buyer
INSERT INTO "User" (id, "auth0Id", email, name, role, "avatarUrl", "createdAt", "updatedAt") VALUES
  ('buyer_123', 'auth0|buyer123', 'buyer@example.com', 'Jane Buyer', 'BUYER', 'https://api.dicebear.com/7.x/avataaars/svg?seed=buyer', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert sample assets
INSERT INTO "Asset" (id, name, description, price, status, "fileKey", "previewUrls", "sellerId", "categoryId", "createdAt", "updatedAt") VALUES
  ('asset_1', 'Modern 3D Character Model', 'High-quality 3D character model suitable for games and animations. Includes rigged skeleton and multiple textures.', 49.99, 'ACTIVE', 's3://prosets-private/assets/character-model.fbx', ARRAY['s3://prosets-public/previews/character-1.jpg', 's3://prosets-public/previews/character-2.jpg'], 'seller_123', 'cat_3d_models', NOW(), NOW()),
  ('asset_2', 'React Authentication Hook', 'Production-ready React hook for handling authentication with JWT tokens. Includes error handling and refresh logic.', 19.99, 'ACTIVE', 's3://prosets-private/assets/auth-hook.ts', ARRAY['s3://prosets-public/previews/auth-hook-preview.jpg'], 'seller_123', 'cat_code_snippets', NOW(), NOW()),
  ('asset_3', 'Project Management Dashboard', 'Complete Notion template for project management with databases, relations, and automation.', 29.99, 'ACTIVE', 's3://prosets-private/assets/pm-dashboard.zip', ARRAY['s3://prosets-public/previews/pm-dashboard-1.jpg', 's3://prosets-public/previews/pm-dashboard-2.jpg'], 'seller_123', 'cat_notion_templates', NOW(), NOW()),
  ('asset_4', 'Minimalist UI Kit', 'Complete UI kit with 200+ components in Figma. Includes light and dark themes.', 39.99, 'ACTIVE', 's3://prosets-private/assets/ui-kit.fig', ARRAY['s3://prosets-public/previews/ui-kit-1.jpg', 's3://prosets-public/previews/ui-kit-2.jpg', 's3://prosets-public/previews/ui-kit-3.jpg'], 'seller_123', 'cat_ui_kits', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample order
INSERT INTO "Order" (id, status, "stripeSessionId", total, "userId", "assetId", "createdAt", "updatedAt") VALUES
  ('order_1', 'PAID', 'cs_test_sample123', 49.99, 'buyer_123', 'asset_1', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
