/*
  # Check Service Schema

  This migration checks the current service table schema and ensures
  all required fields exist with correct names.
*/

-- Check if the services table exists and has the correct columns
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    -- Check if deliverytime column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' 
        AND column_name = 'deliverytime'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        RAISE EXCEPTION 'Column "deliverytime" does not exist in services table';
    END IF;
    
    -- Check if imageurl column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' 
        AND column_name = 'imageurl'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        RAISE EXCEPTION 'Column "imageurl" does not exist in services table';
    END IF;
    
    -- Check if freelancerid column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' 
        AND column_name = 'freelancerid'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        RAISE EXCEPTION 'Column "freelancerid" does not exist in services table';
    END IF;
    
    -- Check if isactive column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' 
        AND column_name = 'isactive'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        RAISE EXCEPTION 'Column "isactive" does not exist in services table';
    END IF;
    
    RAISE NOTICE 'All required columns exist in services table';
END $$;

-- Show the current schema of the services table
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'services' 
ORDER BY ordinal_position; 