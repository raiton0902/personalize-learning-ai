import re
from langdetect import DetectorFactory, detect_langs, LangDetectException

DetectorFactory.seed=0
NAMES={'en':'English','id':'Indonesian','fr':'French','de':'German','es':'Spanish','pt':'Portuguese','it':'Italian','zh-cn':'Mandarin Chinese','zh-tw':'Mandarin Chinese','ja':'Japanese','ko':'Korean','ar':'Arabic','ru':'Russian','hi':'Hindi','nl':'Dutch','tr':'Turkish','vi':'Vietnamese','th':'Thai'}


def detect_language(text):
    text=re.sub(r'```[\s\S]*?```|`[^`]*`',' ',text)
    if re.search(r'[\u3040-\u30ff]',text):return 'ja'
    if re.search(r'[\uac00-\ud7af]',text):return 'ko'
    if len(re.findall(r'[\u4e00-\u9fff]',text))>=2:return 'zh-cn'
    words=set(re.findall(r'[a-z]+',text.casefold()))
    if words & {'saya','aku','belajar','jelaskan','mengapa','bagaimana'}:return 'id'
    if re.search(r'\b(?:i want to|i would like to|teach me|explain .+ to me|why is|how do|how can|introduce .+ programming)\b',text,re.I):return 'en'
    foreign_words={'le','la','les','des','une','pour','avec','je','nous','quiero','aprender','historia','el','los','las','der','die','das','ich','und','ik','wil','leren','quero','uma','gli','della'}
    if text.isascii() and not words & foreign_words:
        if words & {'the','a','an','and','to','in','with','from','for','of','can','apply','learn','understand','write','practice','exam'}:return 'en'
        if re.search(r'\b(?:japanese|chinese|korean|french|german|russian)\s+(?:history|culture|philosophy|war|language)\b',text,re.I):return 'en'
        if words and len(re.findall(r'[^\W\d_]',text))<18:return 'en'
    if len(re.findall(r'[^\W\d_]',text))<18:return None
    try:
        result=detect_langs(text)[0]
        return result.lang if result.prob>=.9 else None
    except LangDetectException:return None


def resolve(profile, latest=''):
    explicit=profile.get('language','automatic').strip()
    if explicit.casefold() not in {'','automatic','auto'}:
        return NAMES.get(explicit.casefold(),{'mandarin':'Mandarin Chinese','bahasa indonesia':'Indonesian'}.get(explicit.casefold(),explicit))
    code=detect_language(latest) or detect_language(profile.get('goal','')) or 'en'
    return NAMES.get(code,code)


def plan_mismatch(profile,plan):
    expected=resolve(profile)
    codes={code for code,name in NAMES.items() if name.casefold()==expected.casefold()}
    if not codes:return False
    plan=plan or {}
    texts=[plan.get('title',''),plan.get('scope_note','')]
    texts += [item.get(key,'') for item in plan.get('modules',[]) for key in ('title','summary')]
    texts += [item.get(key,'') for item in plan.get('objectives',[]) for key in ('title','outcome')]
    latin={'en','id','fr','de','es','pt','it','nl','tr','vi'}
    for text in texts:
        if codes & latin and re.search(r'[\u3040-\u30ff\uac00-\ud7af\u4e00-\u9fff\u0600-\u06ff\u0400-\u04ff]',text):return True
        if len(text)>=18 and (code:=detect_language(text)) and code not in codes:return True
    return False


def instruction(language):
    return (f' CRITICAL LANGUAGE RULE: Write every learner-facing JSON string, including every title, module title, summary, scope note, objective, outcome, explanation and question strictly in {language}. '
            f'NEVER switch language or script because the subject concerns another country, history, culture or language. If {language} is English, Japanese History, Chinese Philosophy and French History must all be taught in English. '
            'Preserve code syntax, identifiers, schema enum values and quoted source-section identifiers.')
