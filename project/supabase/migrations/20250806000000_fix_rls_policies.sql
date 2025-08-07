-- Fix RLS policies to use correct column names
-- This migration fixes the RLS policies to use camelCase column names

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Clients can create orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;

-- Create new policies with correct column names
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (
    auth.uid() = clientid OR 
    auth.uid() = freelancerid
  );

CREATE POLICY "Clients can create orders" ON orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = clientid);

CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (
    auth.uid() = clientid OR 
    auth.uid() = freelancerid
  );

-- Also fix the reviews policies
DROP POLICY IF EXISTS "Users can view reviews for orders they're involved in" ON reviews;
DROP POLICY IF EXISTS "Clients can create reviews for completed orders" ON reviews;

CREATE POLICY "Users can view reviews for orders they're involved in" ON reviews
    FOR SELECT USING (
        reviewer_id = auth.uid() OR 
        reviewed_id = auth.uid() OR
        order_id IN (
            SELECT id FROM orders 
            WHERE clientid = auth.uid() OR freelancerid = auth.uid()
        )
    );

CREATE POLICY "Clients can create reviews for completed orders" ON reviews
    FOR INSERT WITH CHECK (
        reviewer_id = auth.uid() AND
        order_id IN (
            SELECT id FROM orders 
            WHERE clientid = auth.uid() AND status = 'completed'
        )
    );

-- Success message
SELECT 'RLS policies updated successfully!' as status; 