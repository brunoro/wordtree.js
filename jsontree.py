#!/usr/bin/python
# -*- coding: utf-8 -*-

import StringIO
import logging
import sys
import re

logging.getLogger().setLevel(logging.DEBUG)

def printTree(tree, rec):
    for son in tree[1]:
        print "  "*rec, son, '(', str(tree[1][son][0]), ')'
        printTree(tree[1][son], rec + 1)
                            
# first call                            
def makeJsonTree(tree, output):
    for son in tree[1]:
        output.write('{ "key": "' + son + '", "num": ' + str(tree[1][son][0]) + ', "son": [')
        makeJsonTreeRec(tree[1][son], 1, output)
        output.write(']},')

    if len(tree[1]) == 0:
		output.write(']')

    return output

# recursive call
def makeJsonTreeRec(tree, rec, output):
    for son in tree[1]:
        output.write('  '*rec + '{ "key": "' + son + '", "num": ' + str(tree[1][son][0]) + ', "son": [')
        makeJsonTreeRec(tree[1][son], rec + 1, output)
        output.write('  '*rec + ']},')

    if len(tree[1]) == 0:
		output.write(']') # dirty fix
    # remove trailing comma
    output.seek(-1, 1)

    return output

def makeRawTree(phrases):
    tree = [0, dict()]
    # insert each phrase on the tree 
    for sentence in phrases:
        temp = tree[1]
        # try to insert each word 
        for word in sentence.split(' '):
            if word not in temp:
                temp[word] = [1, dict()]
            else:
                temp[word][0] += 1
            temp = temp[word][1]
    return tree

def cutLeaves(tree):
    # if node is root
    if tree[0] == 0:
        for son in tree[1]:
            vez = cutLeaves(tree[1][son])
            tree[1][son] = vez[1]
            return tree

    # in case that the node is a leaf 
    elif len(tree[1]) == 0:
        return ["", tree]

    # if each node has only one son
    elif len(tree[1]) == 1:
        # recursive call for son
        for son in tree[1]:
            vez = cutLeaves(tree[1][son])
        # erase son and replace it with whole key
        del tree[1][son]
        tree[1][" " + son + " " + vez[0]] = vez[1]
        return [" " + son + " " + vez[0], vez[1]]
        
    else:
        # recursive call for each son 
        for son in tree[1]:
            vez = cutLeaves(tree[1][son])
            # join if only one son 
            if len(tree[1][son][1]) == 1:
                del tree[1][son]
                tree[1][" " + son + " " + vez[0]] = vez[1]
        # return subtree
        return ["", tree]

# return part of phrases starting with the desired word
def cutStartingPhrases(raw, word):
    # TODO: make input word ignore case 
    regexp = "\.[\s]*" + word + "[^\.]*"
    raw = "." + raw.strip("\n") # dirty fix 
    raw.replace('"', ' ')
    return re.findall(regexp, raw)

def jsonFromList(inputlist, starting):
    # uses file-like string writing for recursion
    output = StringIO.StringIO()
    
    phrases = [cutStartingPhrases(i, starting) for i in inputlist]
    text = []
    for sentence in phrases:
        if len(sentence) > 0:
            text.append(sentence[0][1:].replace('"', "`"))


    tree = makeRawTree(text)
    tree = cutLeaves(tree)

    treeString = makeJsonTree(tree, output).getvalue()

    logging.debug(treeString[:-1])

    return treeString[:-1] # removing trailing comma

# command line call
def main():
    inputfile = open(sys.argv[1])
    inputlist = inputfile.readlines()
    inputfile.close()

    starting = sys.argv[2]

    print jsonFromList(inputlist, starting)

if __name__ == "__main__":
    exit(main())
