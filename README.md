# Interface web galeries photos

__Interface web réalisée en Vue.JS (Quasar) se connectant aux web services du projet ["ekergreis/laravel_gallery_ws"](https://github.com/ekergreis/laravel_gallery_ws) pour gérer et afficher des galeries photos sécurisées.__

*Cette interface est en cours de développements. Il reste à réaliser les likes, ajouts de commentaires et implémenter les possibilités de supprimer les galeries ou images (si admin ou créateur).*

### Récupération sources et installation :

	$ git clone https://github.com/ekergreis/vue_gallery_frontend.git
	$ npm install

__Configuration clés clients OAuth et URL dans fichier : config/auth.js__

__Lancer pour tests__

	$ quasar dev

__Lancer pour production__

	$ quasar build

![Connexion](https://raw.githubusercontent.com/ekergreis/vue_gallery_frontend/master/img/demo_connexion.png)
![Accueil Best-of](https://raw.githubusercontent.com/ekergreis/vue_gallery_frontend/master/img/demo_bestof.png)
![Galerie](https://raw.githubusercontent.com/ekergreis/vue_gallery_frontend/master/img/demo_galerie.png)
![Diaporama](https://raw.githubusercontent.com/ekergreis/vue_gallery_frontend/master/img/demo_diaporama.png)
![Commentaires](https://raw.githubusercontent.com/ekergreis/vue_gallery_frontend/master/img/demo_comment.png)
![Config Utilisateur](https://raw.githubusercontent.com/ekergreis/vue_gallery_frontend/master/img/demo_user.png)
![Config Nouveau Groupe](https://raw.githubusercontent.com/ekergreis/vue_gallery_frontend/master/img/demo_groupe_new.png)
![Config Groupe Existant](https://raw.githubusercontent.com/ekergreis/vue_gallery_frontend/master/img/demo_groupe_exist.png)
![Ajout_Galerie](https://raw.githubusercontent.com/ekergreis/vue_gallery_frontend/master/img/demo_add_galerie.png)
![Ajout_Images](https://raw.githubusercontent.com/ekergreis/vue_gallery_frontend/master/img/demo_add_images.png)

*Auteur : Emmanuel Kergreis*
