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


def _same_goal_token(a, b):
    if (a.startswith('un') != b.startswith('un')) and min(len(a), len(b)) >= 6:
        return False
    return a == b or (min(len(a), len(b)) >= 6 and SequenceMatcher(None, a, b).ratio() >= .86)


def extract_goal_signature(text):
    """Separate a subject from scope; unmatched qualifiers remain significant."""
    text = unicodedata.normalize('NFKC', text).casefold().strip()
    text = re.sub(r'(\w)\1{2,}', r'\1\1', text)
    framing = r'^(?:please|i (?:want|would like) to (?:learn|understand)|(?:can|could) you|explain (?:to me|me)|explain|teach me|tell me|help me (?:understand|learn)|introduce me to|introduce|what (?:is|are)|learn|understand|about|the basics of|basics of|basic|how to use|(?:i )?(?:got|have) an? (?:exam|test|quiz) tomorrow (?:on|in|about))\b\s*'
    while True:
        stripped = re.sub(framing, '', text).strip()
        if stripped == text:
            break
        text = stripped
    text = re.sub(r'\s+(?:to me|please|programming language|programming|language)[.!?]*$', '', text)
    parts = re.split(r'\b(?:specific(?:ally)?(?: in| on| about)?|focus(?:ed|ing)? on|especially|only|in depth on|for)\b', text, maxsplit=1)
    tokens = lambda s: re.findall(r'c\+\+|c#|[\w]+', s)
    words = tokens(parts[0])
    # Multiword domains and symbolic language names are anchors, not substring matches.
    anchors = [('machine', 'learning'), ('deep', 'learning'), ('data', 'science'), ('neural', 'networks'),
               ('c++',), ('c#',), ('c',), ('python',), ('javascript',), ('calculus',), ('algebra',), ('r',), ('go',)]
    subject, rest = words, tokens(parts[1]) if len(parts) > 1 else []
    for anchor in anchors:
        start = next((i for i in range(len(words)-len(anchor)+1)
                      if all(_same_goal_token(a, b) for a, b in zip(words[i:i+len(anchor)], anchor))), None)
        if start is not None:
            subject = list(anchor)
            rest = words[:start] + words[start+len(anchor):] + rest
            break
    filler = {'in', 'on', 'of', 'the', 'a', 'an', 'and', 'with', 'about', 'to'}
    subject = tuple(w for w in subject if w not in filler)
    rest = tuple(sorted(set(w for w in rest if w not in filler and not any(_same_goal_token(w, s) for s in subject))))
    return {'subject': subject, 'subtopic': rest}


def is_similar_learning_goal(new_text, existing_text):
    a, b = extract_goal_signature(new_text), extract_goal_signature(existing_text)
    def same_tokens(left, right):
        remaining = list(right)
        if len(left) != len(remaining):
            return False
        for word in left:
            match = next((i for i, old in enumerate(remaining) if _same_goal_token(word, old)), None)
            if match is None:
                return False
            remaining.pop(match)
        return True
    return bool(a['subject'] and b['subject'] and same_tokens(a['subject'], b['subject']) and same_tokens(a['subtopic'], b['subtopic']))
