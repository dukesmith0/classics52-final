# Monument Images to Source

Instructions:
1. Find each image on Wikimedia Commons
2. Add the Wikimedia URL to the "Source URL" column
3. Add the author/license to the "Attribution" column
4. Download the image and save it in this `images/` folder with the filename listed below
5. Images should be ~400-600px wide (JPG or PNG)

## Case Studies (REQUIRED)

| # | Monument | Filename | Source URL | Attribution |
|---|---|---|---|---|
| 1 | Via Appia | `via-appia.jpg` | https://commons.wikimedia.org/wiki/File:Franz_Ludwig_Catel_-_Via_Appia_(1833).jpg | |
| 2 | Caesarea Maritima Harbor | `caesarea-maritima.jpg` | https://commons.wikimedia.org/wiki/File:125799_caesarea_national_park_PikiWiki_Israel.jpg | |

## Top 25 Monuments (Priority)

| # | Monument | Filename | Source URL | Attribution |
|---|---|---|---|---|
| 3 | Parthenon | `parthenon.jpg` | https://commons.wikimedia.org/wiki/File:The_Parthenon_in_Athens.jpg| |
| 4 | Pantheon | `pantheon.jpg` |https://commons.wikimedia.org/wiki/File:Pantheon_Rom_1_cropped.jpg | |
| 5 | Colosseum | `colosseum.jpg` | https://commons.wikimedia.org/wiki/File:Colosseum_of_Rome_and_Roman_forum.jpg| |
| 6 | Pont-du-Gard | `pont-du-gard.jpg` | https://commons.wikimedia.org/wiki/File:Pont_du_Gard_BLS.jpg| |
| 7 | Aqueduct of Segovia | `segovia-aqueduct.jpg` |https://commons.wikimedia.org/wiki/File:Aqueduct_of_Segovia_01.jpg | |
| 8 | Baths of Caracalla | `baths-of-caracalla.jpg` | https://commons.wikimedia.org/wiki/File:Baths_of_Caracalla,_facing_Caldarium.jpg| |
| 9 | Trajan's Bridge (Danube) | `trajans-bridge.jpg` |https://commons.wikimedia.org/wiki/File:Trajan%27s_Bridge_Across_the_Danube,_Modern_Reconstruction.jpg | |
| 10 | Column of Trajan | `column-of-trajan.jpg` |https://commons.wikimedia.org/wiki/File:Trajan_column_(Rome)_September_2015-1.jpg | |
| 11 | Hagia Sophia | `hagia-sophia.jpg` | https://commons.wikimedia.org/wiki/File:Hagia_Sophia_Mars_2013.jpg| |
| 12 | Cloaca Maxima | `cloaca-maxima.jpg` |https://commons.wikimedia.org/wiki/File:040227_tevere16CloacaMaxima.jpg | |
| 13 | Temple of Hera (Paestum) | `temple-hera-paestum.jpg` |https://commons.wikimedia.org/wiki/File:Temple_of_Hera,_Paestum_01.jpg | |
| 14 | Temple of Concordia (Agrigento) | `temple-concordia-agrigento.jpg` |https://commons.wikimedia.org/wiki/File:Temple_of_Concordia,_Agrigento_BW_2012-10-07_13-09-13.jpg | |
| 15 | Eupalinus Tunnel | `eupalinus-tunnel.jpg` | https://commons.wikimedia.org/wiki/File:%CE%95%CF%85%CF%80%CE%B1%CE%BB%CE%AF%CE%BD%CE%B5%CE%B9%CE%BF_%CF%8C%CF%81%CF%85%CE%B3%CE%BC%CE%B1_-_Tunnel_of_Eupalinus.jpg| |
| 16 | Ponte Milvio | `ponte-milvio.jpg` | https://commons.wikimedia.org/wiki/File:Ponte_Milvio_HD.jpg| |
| 17 | Arch of Constantine | `arch-of-constantine.jpg` | https://commons.wikimedia.org/wiki/File:Arch_of_Constantine_(Rome)_-_South_side,_from_Via_triumphalis.jpg| |
| 18 | Temple of Jupiter (Baalbek) | `temple-jupiter-baalbek.jpg` | https://commons.wikimedia.org/wiki/File:Lebanon,_Baalbek,_Temple_of_Jupiter.jpg| |
| 19 | Mycenae Citadel Walls | `mycenae-walls.jpg` |https://commons.wikimedia.org/wiki/File:Cyclopean_walls_of_Mycenae_-_5.jpg | |
| 20 | Basilica Cistern (Istanbul) | `yerebatan-cistern.jpg` |https://commons.wikimedia.org/wiki/File:Basilica_Cistern_Istanbul.JPG | |
| 21 | Ponte de Alcantara | `ponte-alcantara.jpg` |https://commons.wikimedia.org/wiki/File:Bridge_Alcantara.JPG | |
| 22 | Domus Aurea | `domus-aurea.jpg` |https://commons.wikimedia.org/wiki/File:Domus_Aurea_07.jpg | |
| 23 | Trajan's Markets | `trajans-markets.jpg` | https://commons.wikimedia.org/wiki/File:Mercati_di_Traiano_-_Roma.jpg| |
| 24 | Ferreres Aqueduct (Tarragona) | `ferreres-aqueduct.jpg` |https://commons.wikimedia.org/wiki/File:Acueducto_de_les_ferreres-2012_(3).JPG | |
| 25 | Tower of Hercules (Lighthouse) | `lighthouse-corunna.jpg` |https://commons.wikimedia.org/wiki/File:Estatua_de_Breog%C3%A1n_y_Torre_de_H%C3%A9rcules.003_-_A_Coru%C3%B1a.jpg | |
| 26 | Masada | `siege-masada.jpg` |https://commons.wikimedia.org/wiki/File:ISR-2016-Masada_04.jpg | |
| 27 | Mausoleum at Halicarnassus | `mausoleum-halicarnassus.jpg` |https://commons.wikimedia.org/wiki/File:Mausoleum_van_Halicarnassus_Mavsolevm_(titel_op_object)_De_acht_wereldwonderen_(serietitel),_RP-P-1891-A-16454.jpg | |

## After Adding Images

Once images are in the folder, update `monuments.json` to add an `"image"` field to each monument:
```json
"image": "images/parthenon.jpg"
```

Then the sidebar will need to be updated in `app.js` to display the image. This can be done in a future session.
