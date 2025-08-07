-- Add Sample Reviews
-- This migration adds sample reviews to demonstrate the review functionality

-- First, let's get some existing services and users to create realistic reviews
DO $$
DECLARE
    service_record RECORD;
    user_record RECORD;
    review_count INTEGER := 0;
BEGIN
    -- Add reviews for each service
    FOR service_record IN SELECT id, freelancerid FROM services LIMIT 10 LOOP
        -- Get some users to act as reviewers (excluding the freelancer)
        FOR user_record IN SELECT id FROM users WHERE id != service_record.freelancerid LIMIT 3 LOOP
            -- Insert a review
            INSERT INTO reviews (
                order_id,
                reviewer_id,
                reviewed_id,
                service_id,
                rating,
                comment,
                created_at
            ) VALUES (
                gen_random_uuid(), -- We'll use a dummy order_id for now
                user_record.id,
                service_record.freelancerid,
                service_record.id,
                floor(random() * 3) + 3, -- Random rating between 3-5
                CASE 
                    WHEN random() > 0.7 THEN 'Excellent work! Very professional and delivered on time.'
                    WHEN random() > 0.5 THEN 'Great service, highly recommended!'
                    WHEN random() > 0.3 THEN 'Good quality work, would work with again.'
                    ELSE 'Satisfied with the work, met my expectations.'
                END,
                now() - interval '1 day' * floor(random() * 30) -- Random date within last 30 days
            );
            review_count := review_count + 1;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Added % sample reviews', review_count;
END $$;

-- Success message
SELECT 'Sample reviews added successfully!' as status; 