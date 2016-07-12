

the plain.bst style sorts the entries according to the name of their authors (using the alphabetical
    order14, of course), and, for papers by the same author(s), the year they have been published
    (the older first). The last criterion in case of equality is the title, being a little bit modified. If
    two references can’t be distinguished with the above, the first one being cited in the document
    appears first. Labels are numbers, starting with 1
    14 The standard alphabetical order with 26 letters. Unfortunately, some language have a different alphabet, for instance
    Swedish, in which “å” and “ö” are considered as letters and placed after “z”

the alpha.bst style file is named alpha because it uses alphanumerical labels: Those labels are
computed by BibTEX using the first three letters of the author name (or initials of the author
names if multiple authors), followed by the last two digits of the publication year. Sorting the
entries is done according to the label first, and then to the same criteria as for plain.bst, in case
several publication have the same label15;
15You certainly don’t want that several publications have the same labels. Thus computing the labels is done in two
phases: First computing the label with the standard method, and then adding a supplementary letter (“a”, “b”, ...) for
multiple labels. And sorting is done just between those two phases...

you probably understood what unsrt.bst does: It does not sort its references, which appears in
the order they are cited in the document. Everything else is done as in plain.bst;

abbrv.bst abbreviates first names of the authors and the names of predefined journal and month
names. I forgot to mention that bibliography styles historically predefine some shorthands for
computer science journal names (Oren Patashnik is a computer scientist...). Those shorthands
are abbreviated journal names in this style file. These are the only difference between abbrv.bst
and plain.bst

That’s all for classical styles. Those styles suffer from several problems, for instance not having
a url field, or not being multilingual, or sorting in a weird way... Moreover, publishers often impose
precise typographic rules for bibliographies. This entails that many other styles have been proposed.
Let’s have a look at some of them.

apalike.bst was (also) written by Oren Patashnik. It uses a special construction for labels, generally
called author-year. I think the best way to understand is with some examples:

Don’t forget to include the apalike.sty package when using the apalike.bst style: Indeed, if you
remember how \@biblabel and \cite are defined, you should have seen why... Moreover, labels
created by apalike.bst might be long, and you probably will accept that LATEX hyphenates them if
necessary, which the default \cite won’t do (cf. section 3).
Also: There are some other author-year style files, named authordate1.bst, authordate2.bst, authordate3.bst,
authordate4.bst, and that slightly differ from apalike.bst. They must be used together with
the authordate1-4.sty package.
Very last important thing: apalike.sty redefined \bibitem so that the optional argument becomes
mandatory (but must still be within square brackets). But you probably don’t care since, of course,
the bibliography style file tells BibTEX to always output it.

6.2.2 The natbib.sty package
The natbib.sty package, written by Patrick W. Daly, goes a bit further: It mainly redefines \cite so
that you can get author-year or numerical labels, in a very elegant way.
Classical bibliography styles have been ported to natbib.sty, except alpha.bst since it already was
an author-year style. The names of the ports are plainnat.bst, abbrvnat.bst et unsrtnat.bst. Moreover,
those styles have a url field for adding reference to articles on the web. Also note that natbib.sty can
be used with apalike.bst or authordate1.bst to authordate4.bst.
Last interesting remark: There is a very clean documentation [Dal99c] for natbib.sty, it’s really
worth reading.
16
6.2.3 The jurabib.sty package
The package jurabib.sty, by Jens Berger, is another package for adapting the output to the typographic
rules used in legal studies. It is associated to a bibliography style jurabib.bst, and rests on a very special
format for the optional argument of \bibitem. It also redefines \cite, and defines many flavors of
that command. See [Ber02] for detailed comments on jurabib.sty.
6.2.4 custom-bib
Since there are many possible criteria for defining a bibliographic style, Patrick W. Daly decided to
write a little piece of software for automatically generating customized bibliography styles. It asks you
about 20 questions and produces a pretty ready-to-use bibliography style file.
As usual with Patrick Daly, the documentation [Dal99b] is excellent, and I won’t go any further in
the details. I just mention how to create your .bst-file: Simply type latex makebst.tex, and answer
the questions. All along the execution, the style file is being created. It’s really easy and intuitive.
