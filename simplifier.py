# -*- coding: utf-8 -*-
import nltk
import json 

# tokens = nltk.word_tokenize(sentence)
# tagged = nltk.pos_tag(tokens)
# entities = nltk.chunk.ne_chunk(tagged)
# print tokens

def simplifySentences(paragraphes):
    sentences = []
    for s in splitSententences(paragraphes):
        tagged = str(setTags(s))
        sentences.append({ 'raw': s, 'simplified': tagged})

    return json.dumps(
        {
            "sentences": sentences
        })



def splitSententences(paragraphes):
    sent_tokenizer=nltk.data.load('tokenizers/punkt/english.pickle')
    return sent_tokenizer.tokenize(paragraphes)

def setTags(sentences):
    tokens = nltk.word_tokenize(sentences)
    return nltk.pos_tag(tokens)

