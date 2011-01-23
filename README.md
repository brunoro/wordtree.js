wordtree.js
===========

An implementation of [wordtree](http://www-958.ibm.com/software/data/cognos/manyeyes/page/Word_Tree.html) in Raphaël SVG + jQuery + python

How-to
------
1. Make an input file with a phrase on each line
2. Generate the input JSON tree with inputmaker.py
    $ python jsontree.py <input file> <word on the root>
3. Open main.html

TODO
----
- translate the code to English
- write a cool (django | web2py) webapp for testing
- fix the SVG canvas size
