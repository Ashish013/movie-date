"""Bundle local assets into a single offline HTML file. No network access."""
from pathlib import Path
from base64 import b64encode
from urllib.parse import quote

root = Path(__file__).resolve().parent
d = root / 'src'
def data(name, mime):
    return f'data:{mime};base64,' + b64encode((d/name).read_bytes()).decode()
html = (d/'index.html').read_text()
css = (d/'style.css').read_text()
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>' + css + '</style>')
html = html.replace('<script src="script.js" defer></script>', '')
html = html.replace('</body>', '<script>' + (d/'script.js').read_text() + '</script></body>')
html = html.replace('face.png', data('face.png', 'image/png'))
html = html.replace('her-reaction.jpeg', data('her-reaction.jpeg', 'image/jpeg'))
calendar = (d/'movie-date.ics').read_text().replace('\n', '\r\n')
html = html.replace('href="movie-date.ics"', 'href="data:text/calendar;charset=utf-8,' + quote(calendar) + '"')
(root/'index.html').write_text(html)
print('Built index.html with all assets embedded.')
