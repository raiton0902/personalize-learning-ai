import io

import pytest
from pypdf import PdfWriter
from pypdf.generic import DictionaryObject, NameObject, DecodedStreamObject

from content import pdf_source


def pdf_bytes(text="", pages=1):
    writer = PdfWriter()
    for _ in range(pages):
        page = writer.add_blank_page(width=612, height=792)
        if text:
            font = DictionaryObject({NameObject('/Type'):NameObject('/Font'),NameObject('/Subtype'):NameObject('/Type1'),NameObject('/BaseFont'):NameObject('/Helvetica')})
            page[NameObject('/Resources')] = DictionaryObject({NameObject('/Font'):DictionaryObject({NameObject('/F1'):font})})
            stream = DecodedStreamObject()
            stream.set_data(('BT /F1 12 Tf 50 700 Td (' + text + ') Tj ET').encode())
            page[NameObject('/Contents')] = stream
    result = io.BytesIO(); writer.write(result)
    return result.getvalue()


def test_pdf_preview_preserves_page_labels():
    source = pdf_source(pdf_bytes("Linear equations: subtract the same number from both sides."), "reference.pdf")
    assert source["id"] == "pdf" and "Page 1:" in source["text"]
    assert "Linear equations" in source["text"]


@pytest.mark.parametrize("data,message", [(b'not a pdf',"could not be read"),(pdf_bytes(),"little readable text"),(pdf_bytes(pages=13),"12 pages"),(b'x'*(2*1024*1024+1),"2 MB")], ids=["invalid", "blank", "too-many-pages", "oversize"])
def test_unusable_pdfs_give_actionable_errors(data,message):
    with pytest.raises(ValueError,match=message):
        pdf_source(data,"bad.pdf")
