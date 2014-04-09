# -*- coding: utf-8 -*-
import nltk
import json 
import sumerizer
import csv

USELESSTAG = ['DT']

dictBookmark = {}
def loadCSV(path):
    with open(path, 'rU') as f:
        reader = csv.reader(f, dialect=csv.excel_tab, delimiter=',')
        for row in reader:
            dictBookmark[row[0]] = row[5].upper()

def simplifySentences(paragraphes):
    sentences = []
    for s in splitSententences(paragraphes):
        for mot in s.split():
            if mot.upper() in dictBookmark :
                print mot
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
    return ' '.join([ "<b data-bookmark=\"" + dictBookmark[x[0]] + "\">" + x[0] +"</b>" if x[0] in dictBookmark else x[0] for x in sentence])

def resume(paragraphes):
    naivesum = sumerizer.NaiveSummarizer()
    sentences = []
    sentences.append({ 'raw': paragraphes, 'simplified': naivesum.summarize(paragraphes,1)})
    return json.dumps(
        {
            "sentences": sentences
        })