# -*- coding: utf-8 -*-
import nltk
import json 
import sumerizer
# tokens = nltk.word_tokenize(sentence)
# tagged = nltk.pos_tag(tokens)
# entities = nltk.chunk.ne_chunk(tagged)
# print tokens

USELESSTAG = ['DT']

def simplifySentences(paragraphes):
    sentences = []
    for s in splitSententences(paragraphes):
        tagged = setTags(s)
        sentences.append({ 'raw': s, 'simplified': removeUselessTag(tagged)})

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

def removeUselessTag(sentence):
    return ' '.join([ x[0] for x in sentence if x[1] not in USELESSTAG ])

def resume(paragraphes):
    naivesum = sumerizer.NaiveSummarizer()
    sentences = []
    sentences.append({ 'raw': paragraphes, 'simplified': naivesum.summarize(paragraphes,1)})
    return json.dumps(
        {
            "sentences": sentences
        })