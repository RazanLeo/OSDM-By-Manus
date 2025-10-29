import mysql.connector
from docx import Document
import os

# Read the Word document
doc = Document('/home/ubuntu/upload/تصنيفالمنتجاتوالخدماتوالمشاريعلمانوسdocx.docx')

# Connect to database
db = mysql.connector.connect(
    host=os.getenv('DATABASE_HOST', 'localhost'),
    user=os.getenv('DATABASE_USER', 'root'),
    password=os.getenv('DATABASE_PASSWORD', ''),
    database=os.getenv('DATABASE_NAME', 'osdm')
)
cursor = db.cursor()

print("🌱 Starting automatic types extraction and seeding...")
print("📖 Reading Word document...")

# Extract all tables
tables = doc.tables
print(f"✅ Found {len(tables)} tables in document")

# Counter for inserted types
total_inserted = 0

# Process each table
for table_idx, table in enumerate(tables):
    print(f"\n📋 Processing table {table_idx + 1}/{len(tables)}...")
    
    # Skip if table has less than 2 rows
    if len(table.rows) < 2:
        continue
    
    # Get header row to determine structure
    header_cells = [cell.text.strip() for cell in table.rows[0].cells]
    
    # Process data rows
    for row_idx, row in enumerate(table.rows[1:], 1):
        cells = [cell.text.strip() for cell in row.cells]
        
        # Skip empty rows
        if not any(cells):
            continue
        
        # Assuming structure: [Arabic Name, English Name/Description]
        if len(cells) >= 2:
            name_ar = cells[0]
            name_en = cells[1] if len(cells) > 1 else name_ar
            
            # Skip if both are empty
            if not name_ar and not name_en:
                continue
            
            print(f"  ├─ {name_ar} | {name_en}")
            total_inserted += 1

print(f"\n🎉 ========================================")
print(f"🎉 EXTRACTION COMPLETED!")
print(f"🎉 ========================================")
print(f"📊 Total types extracted: {total_inserted}")
print(f"🌟 Ready to seed to database!\n")

cursor.close()
db.close()
