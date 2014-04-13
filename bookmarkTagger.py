# -*- coding: utf-8 -*-
import nltk
import json 
import csv
import re

dictBookmark = {}
def loadCSV(path):
    with open(path, 'rU') as f:
        reader = csv.reader(f, dialect=csv.excel_tab, delimiter=',')
        for row in reader:
            dictBookmark[row[0]] = row[5]

def tagBookmarks(paragraphes):
    sentences = []
    for s in splitSententences(paragraphes):
        tagged = setTags(s)
        sentences.append(generateBookmarks(tagged))

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

def generateBookmarks(sentence):
    sentence = ' '.join([x[0] for x in sentence])
    for x in dictBookmark:
        #sentence = sentence.replace(" " + x +" "," <b data-bookmark=\"" + dictBookmark[x] + "\">" + x + "</b> ")
        sentence_NC = re.compile(re.escape(" " + x +" "), re.IGNORECASE)
        sentence = sentence_NC.sub(" <b data-bookmark=\"" + dictBookmark[x] + "\">" + x.lower() + "</b> ", sentence)
    return sentence
