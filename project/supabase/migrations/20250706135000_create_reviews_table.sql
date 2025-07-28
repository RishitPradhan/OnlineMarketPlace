-- Drop the existing reviews table if it exists (to start fresh)
DROP TABLE IF EXISTS reviews CASCADE;

-- Create the reviews table with the correct structure
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
  
  -- Ensure one review per order per reviewer
  UNIQUE(order_id, reviewer_id)
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_id ON reviews(reviewed_id);
CREATE INDEX IF NOT EXISTS idx_reviews_service_id ON reviews(service_id);

-- Enable RLS if not already enabled
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
DROP POLICY IF EXISTS "Clients can create reviews for their orders" ON reviews;
DROP POLICY IF EXISTS "Users can view reviews for orders they're involved in" ON reviews;
DROP POLICY IF EXISTS "Clients can create reviews for completed orders" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;

-- Create new policies
CREATE POLICY "Users can view reviews for orders they're involved in" ON reviews
    FOR SELECT USING (
        reviewer_id = auth.uid() OR 
        reviewed_id = auth.uid() OR
        order_id IN (
            SELECT id FROM orders 
            WHERE client_id = auth.uid() OR freelancer_id = auth.uid()
        )
    );

CREATE POLICY "Clients can create reviews for completed orders" ON reviews
    FOR INSERT WITH CHECK (
        reviewer_id = auth.uid() AND
        order_id IN (
            SELECT id FROM orders 
            WHERE client_id = auth.uid() AND status = 'completed'
        )
    );

CREATE POLICY "Users can update their own reviews" ON reviews
    FOR UPDATE USING (reviewer_id = auth.uid());

CREATE POLICY "Users can delete their own reviews" ON reviews
    FOR DELETE USING (reviewer_id = auth.uid()); 