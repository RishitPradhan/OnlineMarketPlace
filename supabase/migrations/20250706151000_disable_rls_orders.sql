-- Temporarily disable RLS on orders table for testing
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on services table to ensure orders can reference services
ALTER TABLE services DISABLE ROW LEVEL SECURITY; 