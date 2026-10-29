import re
import unicodedata
from difflib import SequenceMatcher


def normalized(text):
    return ' '.join(re.findall(r'\w+|[+*/=<>-]', unicodedata.normalize('NFKC',text).casefold()))


def difficulty_question(text):
    words=normalized(text)
    return bool(re.fullmatch(r'(?:why|why is|why does|why do) (?:it|this|this subject|the subject|this topic|the topic|this course|the course|learning this|this lesson) (?:feel |seem |so |feel so |seem so |is )?(?:hard|difficult|confusing)',words))


def unclear_input(text):
    if not any(c.isalnum() for c in text):
        return True
    # Only strong keyboard-smash signals; unfamiliar vocabulary and non-Latin scripts pass through.
    word=text.strip().casefold()
    if not re.fullmatch('[a-z]{8,}',word):
        return False
    return (len(re.findall(r'q(?!u)',word))>=2 or
            bool(re.search(r'([a-z]{2,4})\1\1',word)) or
            bool(re.search(r'[bcdfghjklmnpqrstvwxz]{7}',word)))


def clarification_answer(text):
    return bool(re.match(r"\s*(?:this (?:phrase|message|question) is unclear|i (?:couldn.t|can.t|do not|don.t) understand|i.m not sure what|could you (?:please )?(?:clarify|rephrase|specify))\b",text,re.I))


def similar_question(state, text, objective_id, exclude=None):
    value=normalized(text)
    for thread in reversed(state.get('followups',[])):
        if thread['id']==exclude or thread['objective_id']!=objective_id or not thread.get('answer') or thread.get('pending'):
            continue
        old=normalized(thread['question'])
        if value==old or (difficulty_question(text) and difficulty_question(thread['question'])):
            return thread
        # Do not blur numbers, negation, operators or code into a different question.
        stop={'is','the','a','an','please','can','you'}
        a=[w for w in value.split() if w not in stop]
        b=[w for w in old.split() if w not in stop]
        sensitive=lambda s: re.findall(r'\d+|\b(?:not|never|no)\b|[+*/=<>-]',s)
        if len(a)>=4 and len(b)>=4 and sensitive(value)==sensitive(old) and SequenceMatcher(None,a,b).ratio()>=.92:
            return thread
    return None


def goal_key(text):
    text=unicodedata.normalize('NFKC',text).casefold().strip(' \t\r\n.!?')
    # Preserve language names and operators: C, C++ and C# are different subjects.
    text=re.sub(r'^(?:i (?:want|would like) to (?:learn|understand)|teach me|explain|introduce|learn|help me (?:learn|understand))\s+','',text)
    text=re.sub(r'\s+(?:to me|please)$','',text)
    text=re.sub(r'^(?:about|the basics of|basic)\s+','',text)
    text=re.sub(r'\s+(?:programming language|programming|language)$','',text)
    return ' '.join(re.findall(r'[\w+#]+',text))
