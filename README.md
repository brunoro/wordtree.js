wordtree.js
===========

An implementation of [wordtree](http://www-958.ibm.com/software/data/cognos/manyeyes/page/Word_Tree.html) in Raphaël SVG + jQuery + python

How-to
------
1. make an input file with a phrase on each line
2. generate the input json tree with inputmaker.py
    $ python inputmaker.py <input file> <root word>
3. open main.html and paste the json tree on the textarea

TODO
----
- translate the code to English
- write a cool webapp to use it on realtime
- fix the canvas size