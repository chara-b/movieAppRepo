ΒΗΜΑΤΑ ΓΙΑ ΤΟ AUTHENTICATION ΠΟΥ ΖΗΤΑΕΙ Η ΕΚΦΩΝΗΣΗ...


Εγκατέστησα από αυτό το site --> https://nodered.org/docs/user-guide/node-red-admin

με την εντολή --> npm install -g node-red-admin 

το admin command line ώστε να μπορώ μετά με την εντολή --> node-red-admin hash-pw

να αλλάξω κωδικό βάζοντας κάποιον δικό μου και να μου βγάλει το αντίστοιχο hash του για να το
 
βάλω στο αρχείο settings.js του nodeRED που βρίσκεται στο φάκελο εγκατάστασης του nodeRED.


Έβαλα password το hello και το hash που μου έβγαλε είναι το ακόλουθο
$2a$08$OqF8z1GNUkvwcAwgz8CpEeB4/dEEiZReN/JhH0mL9HTJ5pDEUgWRC

το αυθεντικό ήταν ...

$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN.

Μετά για να βάλω login screen και στο ui έκανα uncomment από το αρχείο settings.js το httpNodeAuth
και έβαλα username και password όπως και πριν.






