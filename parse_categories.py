import json
from docx import Document

doc = Document('/home/ubuntu/upload/تصنيفالمنتجاتوالخدماتوالمشاريعلمانوسdocx.docx')

# استخراج النص الكامل
full_text = []
for para in doc.paragraphs:
    text = para.text.strip()
    if text:
        full_text.append(text)

# حفظ النص للمراجعة
with open('categories_extracted.txt', 'w', encoding='utf-8') as f:
    for line in full_text:
        f.write(line + '\n')

print(f"✅ تم استخراج {len(full_text)} سطر من المستند")
print("📄 تم حفظ الملف في: categories_extracted.txt")
