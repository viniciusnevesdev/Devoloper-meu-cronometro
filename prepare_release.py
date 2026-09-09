from pathlib import Path
import json
import shutil
import sys
import urllib.request

ROOT = Path(__file__).resolve().parent
SOURCE = Path(sys.argv[1] if len(sys.argv) > 1 else ROOT).resolve()
OUTPUT = Path(sys.argv[2] if len(sys.argv) > 2 else ROOT / 'site').resolve()
RELEASE = (sys.argv[3] if len(sys.argv) > 3 else '0.8.10').strip()

if not (SOURCE / 'index.html').exists():
    raise SystemExit(f'Fonte inválida: {SOURCE}')

if OUTPUT.exists():
    shutil.rmtree(OUTPUT)
OUTPUT.mkdir(parents=True)

patterns = ('*.html','*.css','*.js','*.json','*.webmanifest','*.svg','*.png','*.txt')
exclude = {'prepare_release.py','prepare_environments.py','beta-tools.js','beta-patches.js'}

for pattern in patterns:
    for src in SOURCE.glob(pattern):
        if src.name in exclude or not src.is_file():
            continue
        shutil.copy2(src, OUTPUT / src.name)

# As páginas de segurança podem evoluir no desenvolvimento sem alterar o motor
# congelado da branch stable. Se não existirem no snapshot estável, usamos as
# páginas de suporte da branch que executa o build.
for name in ('launch.html','recover.html','safe.html','boot-resilient.js'):
    dst = OUTPUT / name
    if not dst.exists() and (ROOT / name).exists():
        shutil.copy2(ROOT / name, dst)

# Refinamentos aprovados na demonstração pública. Eles são camadas de UI e
# estatísticas e não substituem o motor particular; assim Oficial e Beta mantêm
# áreas, bancos e regras próprias, mas recebem a interface refinada da demo.
DEMO_BASE = 'https://raw.githubusercontent.com/viniciusnevesdev/cronometro-app/main'
DEMO_LAYERS = ('presentation-ui.js','presentation.css','analytics-ui.js','analytics.css')
for name in DEMO_LAYERS:
    try:
        with urllib.request.urlopen(f'{DEMO_BASE}/{name}', timeout=20) as response:
            (OUTPUT / name).write_bytes(response.read())
    except Exception as exc:
        raise SystemExit(f'Falha ao obter refinamento da demonstração ({name}): {exc}')

index_path = OUTPUT / 'index.html'
index_text = index_path.read_text(encoding='utf-8')
css_links = '  <link rel="stylesheet" href="./presentation.css" />\n  <link rel="stylesheet" href="./analytics.css" />\n'
js_links = '  <script src="./presentation-ui.js"></script>\n  <script src="./analytics-ui.js"></script>\n'
if 'presentation.css' not in index_text:
    index_text = index_text.replace('</head>', css_links + '</head>')
if 'presentation-ui.js' not in index_text:
    index_text = index_text.replace('</body>', js_links + '</body>')
index_path.write_text(index_text, encoding='utf-8')

# Uma única release é injetada nos pontos que usam o placeholder. Isso evita
# depender de query string para corrigir versão antiga.
for path in OUTPUT.iterdir():
    if not path.is_file() or path.suffix.lower() not in {'.html','.js','.json','.webmanifest','.txt'}:
        continue
    try:
        text = path.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        continue
    if '__RELEASE__' in text:
        path.write_text(text.replace('__RELEASE__', RELEASE), encoding='utf-8')

(OUTPUT / 'version.json').write_text(json.dumps({'version': RELEASE}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
(OUTPUT / '.nojekyll').write_text('', encoding='utf-8')

required = [
    'index.html','manifest.webmanifest','sw.js','version.json','cronometro-v080-01.js',
    'launch.html','recover.html','safe.html','boot-resilient.js',
    'presentation-ui.js','presentation.css','analytics-ui.js','analytics.css'
]
missing = [name for name in required if not (OUTPUT / name).exists()]
if missing:
    raise SystemExit('Build incompleto: ' + ', '.join(missing))

if '__RELEASE__' in (OUTPUT / 'index.html').read_text(encoding='utf-8'):
    raise SystemExit('Placeholder de release permaneceu no index.html')

print(f'Build preparado: {SOURCE.name} -> {OUTPUT} / {RELEASE}')
