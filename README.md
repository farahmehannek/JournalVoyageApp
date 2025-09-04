files:
  README.md: |
    # 📔 JournalVoyageApp

    Application mobile **React Native** permettant de conserver un **journal de voyage** sous forme de photos géolocalisées.  
    Chaque photo est enregistrée avec sa date et sa position GPS, puis affichée dans plusieurs vues : **Galerie, Carte, Calendrier et Profil**.

    ---

    ## 🎯 Objectifs du projet
    - Développer une application mobile Android avec **React Native**.
    - Sauvegarder des **photos** avec leur **localisation GPS**.
    - Permettre plusieurs visualisations :
      - 📷 **Caméra** : prise de photo + GPS
      - 🖼 **Photos** : galerie locale
      - 🗺 **Carte** : affichage sur une carte (OpenStreetMap via MapLibre)
      - 📅 **Calendrier** : marquer les jours où des photos ont été prises
      - 👤 **Profil** : avatar + statistiques (nombre de photos, première et dernière date)

    ---

    ## ⚙️ Technologies utilisées
    - **React Native 0.81.1**
    - **React Navigation** (`@react-navigation/native`, `@react-navigation/bottom-tabs`)
    - **AsyncStorage** pour le stockage local
    - **react-native-image-picker** pour la caméra
    - **@react-native-community/geolocation** pour le GPS
    - **react-native-calendars** pour l’affichage du calendrier
    - **MapLibre (OpenStreetMap)** pour la carte (pas besoin de clé API)

    ---

    ## 🪜 Installation & configuration

    ### 1. Prérequis
    - **Windows 10/11**
    - **Node.js ≥ 20**
    - **JDK 17** (OpenJDK)
    - **Android SDK** installé dans `C:\Android\sdk`
      - `platform-tools`
      - `build-tools;34.0.0`
      - `platforms;android-34`
    - **Téléphone Android** avec :
      - Options développeur activées
      - **Débogage USB** activé

    ---

    ### 2. Cloner le projet
    ```bash
    git clone https://github.com/farahmehannek/JournalVoyageApp.git
    cd JournalVoyageApp
    ```

    ### 3. Installer les dépendances
    ```bash
    npm install
    ```

    ### 4. Vérifier que le téléphone est détecté
    ```bash
    adb devices
    ```

    ### 5. Lancer Metro (serveur JS)
    ```bash
    npx react-native start --reset-cache
    ```

    ### 6. Compiler et installer sur le téléphone
    ```bash
    npx react-native run-android --device <ID_DEVICE>
    ```
    ⚠️ Remplace `<ID_DEVICE>` par l’ID retourné par `adb devices` (ex. `R58N42FX5QD`).

    ---

    ## 📱 Fonctionnalités

    ### 📷 Caméra
    - Prendre une photo avec l’appareil photo du téléphone
    - Demande des permissions **Caméra** et **GPS**
    - Enregistre `{ id, uri, date, latitude, longitude }` dans AsyncStorage

    ### 🖼 Galerie (Photos)
    - Liste toutes les photos sauvegardées
    - Affichage avec miniature et date
    - Suppression d’une photo ou de toutes
    - Rafraîchissement automatique à chaque retour sur l’onglet

    ### 🗺 Carte
    - Fond de carte OpenStreetMap via **MapLibre**
    - Marqueurs aux coordonnées GPS de chaque photo
    - Aperçu miniature + date sur chaque marqueur
    - Pas besoin de clé API Google (pas de CB)

    ### 📅 Calendrier
    - Librairie `react-native-calendars`
    - Marque les jours où des photos ont été prises (dot bleu)
    - Navigation mois par mois

    ### 👤 Profil
    - Avatar + nom du voyageur
    - Compteur total de photos
    - Date de la **première photo**
    - Date de la **dernière photo**
    - Bouton **Actualiser**
    - Rafraîchissement auto à chaque fois que l’onglet est ouvert

    ---

    ## 🛠 Commandes principales

    ### Lancer Metro
    ```bash
    npx react-native start --reset-cache
    ```

    ### Compiler & installer l’application
    ```bash
    npx react-native run-android --device <ID_DEVICE>
    ```

    ### Vérifier connexion appareil
    ```bash
    adb devices
    ```

    ### Dépannage
    - Port 8081 bloqué :
      ```bash
      taskkill /F /IM node.exe
      npx react-native start --reset-cache
      ```
    - Nettoyer Gradle :
      ```bash
      cd android && .\gradlew clean && cd ..
      ```

    ---

    ## 🚧 Problèmes rencontrés & solutions

    - **Port 8081 occupé** → tuer le processus Node et relancer Metro  
    - **SDK location not found** → créer `android/local.properties` avec :  
      ```
      sdk.dir=C:\\Android\\sdk
      ```
    - **Chemins trop longs (>260 caractères)** → déplacer le projet dans `C:\JournalVoyageApp`
    - **ADB non reconnu** → ajouter `C:\Android\sdk\platform-tools` au `PATH`
    - **GPS lent ou timeout** → fallback : haute précision → normal → dernière position connue
    - **Carte orange (MapLibre)** → utiliser un fond raster OpenStreetMap

    ---

    ## 👥 Équipe

    - **Farah** – Caméra & Profil  
    - **Amine** – Carte (MapLibre / OpenStreetMap)  
    - **[Nom collègue 3]** – Calendrier  
    - **[Nom collègue 4]** – Galerie Photos  

    ---

    ## 🎬 Démo prévue
    1. Prendre une photo → autorisations + GPS  
    2. Vérifier la photo en Galerie  
    3. Voir l’emplacement exact sur la Carte  
    4. Vérifier que la date est marquée dans le Calendrier  
    5. Voir le compteur mis à jour dans le Profil  

    ---

  .gitignore: |
    # Node modules
    node_modules/

    # Logs
    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*

    # React Native
    /android/.gradle/
    /android/app/build/
    /android/build/
    /ios/Pods/
    *.iml
    .gradle/
    .idea/

    # Metro / cache
    .metro/
    .expo/
    dist/
    tmp/

    # Build
    build/
    *.apk
    *.aar
    *.keystore

    # macOS / Windows
    .DS_Store
    Thumbs.db
