-- Manual Fix for Reviews Table
-- Copy and paste this into your Supabase SQL Editor and run it

-- Step 1: Drop the problematic table
DROP TABLE IF EXISTS reviews CASCADE;

-- Step 2: Create the table correctly
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES users(id) ON DELETE SET NULL,
  reviewed_id uuid REFERENCES users(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(order_id, reviewer_id)
);

-- Step 3: Create indexes
CREATE INDEX idx_reviews_order_id ON reviews(order_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewed_id ON reviews(reviewed_id);
CREATE INDEX idx_reviews_service_id ON reviews(service_id);

-- Step 4: Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies
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

CREATE POLICY "Users can update their own reviews" ON reviews
    FOR UPDATE USING (reviewer_id = auth.uid());

CREATE POLICY "Users can delete their own reviews" ON reviews
    FOR DELETE USING (reviewer_id = auth.uid());

-- Success!
SELECT 'Reviews table fixed successfully!' as result; 