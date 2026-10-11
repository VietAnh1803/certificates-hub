"""Copy original credentials and render faithful previews for the certificate site."""
import hashlib
import json
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = Path(r'C:\Certificates')
DEST = ROOT / 'dist/certificates'
COURSES = [
    ('ibm-dba', 'Relational Database Administration (DBA)', 'IBM / Coursera', '2026-10-10', 'GW2W3LEGSOQE', 'Coursera/IBM Data Engineering/Coursera GW2W3LEGSOQE.pdf'),
    ('ibm-sql-python', 'Databases and SQL for Data Science with Python', 'IBM / Coursera', '2026-09-27', '1URYNTICH2R7', 'Coursera/IBM Data Engineering/Coursera 1URYNTICH2R7.pdf'),
    ('ibm-python', 'Python for Data Science, AI & Development', 'IBM / Coursera', '2026-09-27', 'F3ZLX53QOUHF', 'Coursera/IBM Data Engineering/Coursera F3ZLX53QOUHF.pdf'),
    ('ibm-linux', 'Hands-on Introduction to Linux Commands and Shell Scripting', 'IBM / Coursera', '2026-09-26', 'FE815E5XYGDY', 'Coursera/IBM Data Engineering/Coursera FE815E5XYGDY.pdf'),
    ('ibm-rdbms', 'Introduction to Relational Databases (RDBMS)', 'IBM / Coursera', '2026-09-01', 'MQC0S2FFHCM5', 'Coursera/IBM Data Engineering/Coursera MQC0S2FFHCM5.pdf'),
    ('ibm-python-project', 'Python Project for Data Engineering', 'IBM / Coursera', '2026-08-23', 'G0LTEVZM0KLX', 'Coursera/IBM Data Engineering/Coursera G0LTEVZM0KLX.pdf'),
    ('ibm-data-engineering', 'Introduction to Data Engineering', 'IBM / Coursera', '2026-08-09', 'M1BKYHR20V6U', 'Coursera/IBM Data Engineering/Coursera M1BKYHR20V6U.pdf'),
    ('sololearn-sql', 'Introduction to SQL', 'Sololearn', '2025-10-14', 'CC-VRJJJ42A', 'certificate_sql_sololearn.pdf'),
    ('canva-design', 'Graphic Design Essentials', 'Canva', '2025-10-08', 'b0e466', 'nguyễn-việt-anh-graphic-design-essentials-certificate.pdf'),
    ('datacamp-chatgpt', 'ChatGPT Fundamentals', 'DataCamp', '2025-09-28', '712390', 'certificate_chatgpt_fundamentals.pdf'),
    ('datacamp-sheets', 'Google Sheets Fundamentals', 'DataCamp', '2025-09-16', '704478', 'certificate_google_sheets.pdf'),
]

catalog = []
for slug, title, issuer, date, identifier, relative in COURSES:
    source = SOURCE / relative
    pdf = DEST / f'{slug}.pdf'
    shutil.copy2(source, pdf)
    subprocess.run(['pdftoppm', '-f', '1', '-singlefile', '-scale-to', '1100',
                    '-jpeg', '-jpegopt', 'quality=86', str(pdf), str(DEST / slug)], check=True)
    item = dict(id=slug, title=title, issuer=issuer, date=date, credentialId=identifier,
                pdf=f'certificates/{slug}.pdf', image=f'certificates/{slug}.jpg',
                verification=f'https://coursera.org/verify/{identifier}' if issuer == 'IBM / Coursera' else None,
                sha256=hashlib.sha256(pdf.read_bytes()).hexdigest())
    assert pdf.read_bytes() == source.read_bytes()
    catalog.append(item)

shutil.copy2(SOURCE / 'nguyễn-việt-anh-graphic-design-essentials-badge.png', DEST / 'canva-design-badge.png')
catalog[8]['badge'] = 'certificates/canva-design-badge.png'
(ROOT / 'dist/catalog.json').write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
(ROOT / 'dist/catalog.js').write_text('window.CERTIFICATES = ' + json.dumps(catalog, ensure_ascii=False) + ';\n', encoding='utf-8')
print(f'Copied {len(catalog)} original PDFs; generated previews; document hashes match the source.')
