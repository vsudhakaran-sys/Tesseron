import fitz
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

pdf_path = "c:\\Users\\Hari\\Desktop\\Tango Telematics\\FleetPulse-Tango.pdf"
doc = fitz.open(pdf_path)

print(f"Total pages: {len(doc)}")
print()
for i, page in enumerate(doc):
    text = page.get_text().strip()
    preview = text[:150].replace('\n', ' ')
    # Replace non-encodable chars
    preview = preview.encode('ascii', errors='replace').decode('ascii')
    print(f"Page {i+1}: {preview}")

doc.close()
