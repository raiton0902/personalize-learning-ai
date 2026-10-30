from pathlib import Path
import re
import base64
from urllib.parse import quote
from html import escape

ROOT = Path(__file__).with_name("frontend")


def preview_markup(language, level, interest, tone, context):
    indonesian = language == "Bahasa Indonesia"
    lesson = "Kurangi kedua sisi dengan 5. Apa yang tersisa?" if indonesian else "Subtract 5 from both sides. What is left?"
    heading = "Satu langkah, lalu giliranmu." if indonesian else "One step. Then your turn."
    rows = [("Language", language), ("Starting point", level), ("Tone", tone)]
    if interest.strip():
        rows.append(("Examples inspired by", interest.strip()))
    if context.strip():
        rows.append(("Course context", context.strip()))
    choices = "".join(f'<div><dt>{escape(label)}</dt><dd>{escape(value)}</dd></div>' for label, value in rows)
    return (f'<section class="lesson-preview" aria-label="Example lesson">'
            f'<p class="preview-label">EXAMPLE LESSON</p><h3>{heading}</h3>'
            f'<p class="preview-equation">3x + 5 = 20</p><p class="preview-prompt">{lesson}</p>'
            '<p class="preview-note">An example of the teaching format. Your plan starts from your goal.</p></section>'
            f'<section class="setup-preview" aria-label="Your selected setup"><h3>Your learning setup</h3><dl>{choices}</dl></section>')


def scene_markup():
    source = (ROOT / "scene.html").read_text(encoding="utf-8")
    def image(match):
        svg = match.group(0).replace('<svg ', '<svg fill="none" xmlns="http://www.w3.org/2000/svg" ', 1)
        svg = svg.replace('preserveAspectRatio="xMidYMid slice"', 'preserveAspectRatio="none"')
        css_class = re.search(r'class="([^"]+)"', svg).group(1)
        return f'<div class="{css_class}" style="background-image:url(\'data:image/svg+xml,{quote(svg)}\')"></div>'
    return re.sub(r'<svg\b.*?</svg>', image, source, flags=re.S)


def motion_markup():
    # Only our source and bundled dependencies enter this executable HTML, never learner input.
    parts = [
        "if (!window.gsap) {\n" + (ROOT / "vendor/gsap.min.js").read_text(encoding="utf-8") + "\n}",
        "if (!window.Lenis) {\n" + (ROOT / "vendor/lenis.min.js").read_text(encoding="utf-8") + "\n}",
        (ROOT / "home-motion.js").read_text(encoding="utf-8"),
    ]
    # DOMPurify treats minified comparisons like `<r` as markup. Encode our trusted
    # local bundle so the HTML parser only sees the small bootstrap, never JS text.
    encoded = base64.b64encode("\n".join(parts).encode()).decode()
    return ('<script>(() => { const script = document.createElement("script"); '
            'script.textContent = new TextDecoder().decode(Uint8Array.from(atob("'
            + encoded + '"), c => c.charCodeAt(0))); '
            'document.currentScript.after(script); })();</script>')
