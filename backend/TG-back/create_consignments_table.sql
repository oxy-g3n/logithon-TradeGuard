-- SQLite schema for Consignments table with data type validation

-- Drop existing triggers if any
DROP TRIGGER IF EXISTS validate_consignment_insert;

CREATE TABLE IF NOT EXISTS Consignments (
    uuid INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_name TEXT NOT NULL,
    sender_address TEXT NOT NULL,
    sender_country TEXT NOT NULL,
    sender_mail TEXT NOT NULL CHECK (sender_mail LIKE '%@%.%'),
    sender_phone TEXT NOT NULL,
    receiver_name TEXT NOT NULL,
    receiver_address TEXT NOT NULL,
    receiver_country TEXT NOT NULL,
    shipment_id TEXT NOT NULL,
    shipment_date TEXT NOT NULL CHECK (datetime(shipment_date) IS NOT NULL),
    PackageQuantity INTEGER NOT NULL CHECK (typeof(PackageQuantity) = 'integer'),
    HS_code TEXT NOT NULL,
    totalWeight REAL NOT NULL CHECK (typeof(totalWeight) = 'real' OR typeof(totalWeight) = 'integer'),
    Item_desc TEXT NOT NULL,
    handling_inst TEXT,
    commercial_invoice BLOB,  -- For storing PDF as binary data
    compliant TEXT CHECK(compliant IN ('pending', 'compliant', 'flagged')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a trigger for detailed validation
CREATE TRIGGER validate_consignment_insert 
BEFORE INSERT ON Consignments 
BEGIN
    -- Validate email format
    SELECT CASE 
        WHEN NEW.sender_mail NOT LIKE '%@%.%'
        THEN RAISE(ABORT, 'Invalid email format in sender_mail')
    END;
    
    -- Validate shipment_date format
    SELECT CASE
        WHEN datetime(NEW.shipment_date) IS NULL
        THEN RAISE(ABORT, 'Invalid date format in shipment_date')
    END;
    
    -- Validate PackageQuantity is integer
    SELECT CASE
        WHEN typeof(NEW.PackageQuantity) != 'integer'
        THEN RAISE(ABORT, 'PackageQuantity must be an integer')
    END;
    
    -- Validate totalWeight is numeric
    SELECT CASE
        WHEN typeof(NEW.totalWeight) NOT IN ('real', 'integer')
        THEN RAISE(ABORT, 'totalWeight must be a number')
    END;
    
    -- Validate compliant status
    SELECT CASE
        WHEN NEW.compliant NOT IN ('pending', 'compliant', 'flagged')
        THEN RAISE(ABORT, 'Invalid compliant status')
    END;
END;

-- Index for faster lookups by shipment_id
CREATE INDEX IF NOT EXISTS idx_consignments_shipment_id ON Consignments(shipment_id);

-- Index for filtering by compliance status
CREATE INDEX IF NOT EXISTS idx_consignments_compliant ON Consignments(compliant);

-- Create a view to check data types of inserted values
CREATE VIEW IF NOT EXISTS consignment_debug AS
SELECT 
    uuid,
    typeof(uuid) as uuid_type,
    typeof(sender_name) as sender_name_type,
    typeof(sender_mail) as sender_mail_type,
    typeof(shipment_date) as shipment_date_type,
    typeof(PackageQuantity) as package_quantity_type,
    typeof(totalWeight) as total_weight_type,
    typeof(commercial_invoice) as commercial_invoice_type,
    typeof(compliant) as compliant_type
FROM Consignments; 