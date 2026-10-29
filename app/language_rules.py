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
    outcomes=[(plan or {}).get('title',''),(plan or {}).get('scope_note','')]+[item.get('outcome','') for item in (plan or {}).get('objectives',[])]
    return any(len(text)>35 and (code:=detect_language(text)) and code not in codes for text in outcomes)
