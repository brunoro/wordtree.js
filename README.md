wordtree.js
===========

An implementation of [wordtree](http://www-958.ibm.com/software/data/cognos/manyeyes/page/Word_Tree.html) in Raphaël SVG + jQuery + python. The testapp is written on python webapp framework and is already deployed on [wordtreejs.appspot.com](http://wordtreejs.appspot.com)

How-to
------
1. Make an input file with a phrase on each line.
2. Generate the input JSON tree with jsontree.py by command-line:
   
    $ python jsontree.py <input file> <word on the root>

   **or**

   Generate the input JSON tree with the jsonFromTree function on jsontree.py, passing a list of strings and a word as parameter 
3. Make a html div named "wordtree"
4. Run jsonFromTree with the json tree as the first arg and the root word as the second.

TODO
----
- make the options and parameters be read from CSS
- fix the SVG canvas size
- fix the textsize
- test it!
