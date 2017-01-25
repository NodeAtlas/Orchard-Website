# Site web de Orchard ID #

[Node.js]: https://nodejs.org/en/ "Node.js"
[NNodeAtlas]: https//node-atlas.js.org/ "NodeAtlas"
[NPM]: https://www.npmjs.com/ "Node Package Manager"
[Git]: https://git-scm.com/ "Git"





## Avant-propos ##

Ce dépôt contient l'intégralité du code source permettant de mettre en ligne le site web de Orchard ID. Celui-ci fonctionne avec [NodeAtlas] qui est un module [NPM] tournant sous [Node.js].

Il peut servir d'inspiration pour créer d'autres sites.



## Règle de développement ##

### Flot ###

Quand vous aurez récupérer le dépôt sur votre machine, [respectez ce flot pour le versionnement](https://blog.lesieur.name/comprendre-et-utiliser-git-avec-vos-projets/).

### Conventions ###

Quand vous devrez ajouter, modifier ou supprimer du code, [respectez ces conventions](https://blog.lesieur.name/conventions-html-css-js-et-architecture-front-end/).



## Environnement de développement ##

### Installation ###

Pour modifier le site avec un rendu en temps réel, il vous faudra installer [Node.js] sur votre poste de développement ainsi que [Git] :

- [Télécharger Node.js](https://nodejs.org/en/download/)
- [Télécharger Git](https://git-scm.com/downloads)

puis récupérer le dépôt en local sur votre machine :

```bash
$ cd </path/to/workspace/>
$ git clone https://github.com/Orchard-ID/Website.git
```

puis initialisez la branche de développement :

```bash
git checkout develop
```

puis installer [NodeAtlas] et les autres module [NPM] dont dépend le projet dans le dossier projet :

```bash
$ cd Website
$ npm install
```

puis lancez le site avec la commande :

```bash
$ npm start
```

ou lancez `server.na` en double cliquant dessus :
- en expliquant à votre OS que les fichiers `.na` sont lancé par défaut par `node`,
- en étant sur que votre variable d'environnement `NODE_PATH` pointe bien sur le dossier des `node_modules` globaux.

Les version française et internationale du site seront accessible aux adresses suivantes :

- *http://localhost:7777/*
- *http://localhost:7777/english/*

Vous pouvez également lancez le débogeur [Node.js] dans Chrome avec la commande :

```bash
$ npm test
```

il vous suffit ensuite d'atteindre l'url de debug proposé par la console.





## Environnement de pré-production ##

## Rejoindre ##

L'environnement de préproduction est visible à l'adresse : 

- https://website-haeresis.c9users.io/

L'ensemble des fichiers est listé ici :

- https://preview.c9users.io/haeresis/website

## Démarrer le serveur ##

Il est possible que le serveur ne tourne pas, dans ce cas il faut le lancer en vous rendant à l'adresse :

- https://ide.c9.io/haeresis/website

Et en lançant dans la console (onglet "bash") la commande

```bash
$ nodeatlas --webconfig webconfig.staging.json
```

## Mettre à jour l'environnement ##

Pour mettre à jour l'environnement avec la version que vous souhaitez, utilisez Git.





## Environnement de production ##

Prochainement...