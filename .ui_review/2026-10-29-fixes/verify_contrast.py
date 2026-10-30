"""Recompute captured DOM pairs using the requested antislop contrast checker."""
import importlib.util
import json
from pathlib import Path

data = Path(__file__).parent / 'data'
spec = importlib.util.spec_from_file_location('contrast', Path('C:/Users/raito/.codex/skills/antislop-human/contrast-check.py'))
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)
captures = json.loads((data / 'after-dom.json').read_text(encoding='utf-8'))
rows = []
for capture in captures:
    for pair in capture['pairs']:
        ratio = checker.contrast_ratio(checker.parse_hex(pair['foreground']), checker.parse_hex(pair['background']))
        rows.append({**{k: capture[k] for k in ('theme', 'width', 'state')}, **pair,
                     'checker_ratio': ratio, 'pass': ratio >= pair['min']})
summary = {theme: {'pairs': sum(r['theme'] == theme for r in rows),
                   'failures': sum(r['theme'] == theme and not r['pass'] for r in rows)}
           for theme in ('dark', 'light')}
broader = []
for capture in json.loads((data / 'contrast.json').read_text(encoding='utf-8')):
    for pair in capture['pairs']:
        ratio = checker.contrast_ratio(checker.parse_hex(pair['foreground']), checker.parse_hex(pair['background']))
        # chat-live.js disables the empty/pending send button; preserve raw samples as exempt.
        disabled_send = capture['state'] in {'question-thread', 'topic-decision'} and pair['selector'] == 'button.' and pair['opacity'] == .45
        broader.append({**{k: capture[k] for k in ('theme', 'width', 'state')}, **pair,
                        'checker_ratio': ratio, 'exempt_disabled_send': disabled_send,
                        'pass': disabled_send or ratio >= pair['threshold']})
broad_summary = {theme: {'pairs': sum(r['theme'] == theme for r in broader),
                         'exempt_disabled': sum(r['theme'] == theme and r['exempt_disabled_send'] for r in broader),
                         'failures': sum(r['theme'] == theme and not r['pass'] for r in broader)}
                 for theme in ('dark', 'light')}
(data / 'verified-contrast.json').write_text(json.dumps({'checker': str(spec.origin), 'summary': summary, 'broad_summary': broad_summary, 'pairs': rows, 'broad_pairs': broader}, indent=2), encoding='utf-8')
print(json.dumps(summary))
print(json.dumps(broad_summary))
raise SystemExit(any(not r['pass'] for r in rows + broader))
