#!/usr/bin/env python3
import os
import mysql.connector

# الاتصال بقاعدة البيانات
db_url = os.getenv('DATABASE_URL')
if not db_url:
    print("❌ DATABASE_URL not found!")
    exit(1)

# استخراج معلومات الاتصال من URL
# mysql://user:pass@host:port/dbname
parts = db_url.replace('mysql://', '').split('@')
user_pass = parts[0].split(':')
host_db = parts[1].split('/')
host_port = host_db[0].split(':')

config = {
    'user': user_pass[0],
    'password': user_pass[1],
    'host': host_port[0],
    'port': int(host_port[1]) if len(host_port) > 1 else 3306,
    'database': host_db[1].split('?')[0],
    'ssl_ca': None,
    'ssl_verify_cert': False,
    'ssl_verify_identity': False
}

print(f"🔌 Connecting to {config['host']}:{config['port']}...")

try:
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()
    
    # قراءة SQL
    sql_file = os.path.join(os.path.dirname(__file__), 'services-jobs.sql')
    with open(sql_file, 'r', encoding='utf-8') as f:
        sql_content = f.read()
    
    # تنفيذ SQL statements
    statements = [s.strip() for s in sql_content.split(';') if s.strip() and not s.strip().startswith('--')]
    
    total = len(statements)
    print(f"📊 Executing {total} SQL statements...")
    
    for i, stmt in enumerate(statements, 1):
        if stmt:
            try:
                cursor.execute(stmt)
                if i % 50 == 0:
                    print(f"  ✓ {i}/{total} statements executed...")
            except Exception as e:
                print(f"  ❌ Error at statement {i}: {e}")
                print(f"     Statement: {stmt[:100]}...")
    
    conn.commit()
    print(f"✅ All {total} statements executed successfully!")
    
    # التحقق من النتيجة
    cursor.execute("SELECT COUNT(*) FROM service_categories")
    services_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM job_categories")
    jobs_count = cursor.fetchone()[0]
    
    print(f"\n📊 النتيجة النهائية:")
    print(f"  - تصنيفات الخدمات: {services_count}")
    print(f"  - تصنيفات الوظائف: {jobs_count}")
    print(f"  - الإجمالي: {services_count + jobs_count}")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Database error: {e}")
    exit(1)

