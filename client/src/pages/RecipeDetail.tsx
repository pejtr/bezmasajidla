// ============================================================
// BEZMASAJIDLA.CZ — Recipe Detail Page
// "Zelená Metropole" — full recipe with gallery, ingredients, steps
// ============================================================

import { useState } from "react";
import { useParams, Link } from "wouter";
import { Clock, Users, ChefHat, ArrowLeft, Leaf, ChevronLeft, ChevronRight, ShoppingCart, ExternalLink, BookOpen, Flame } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { recipes, type Recipe } from "@/lib/data";
import SEOHead from "@/components/SEOHead";
import OptimizedImage from "@/components/OptimizedImage";
import { getRohlikLink, getKosikLink } from "@/lib/affiliates";

const sampleIngredients: Record<string, string[]> = {
  "veganska-svickova": [
    "500 g seitanu (nebo seitan z pšeničného lepku)",
    "2 mrkve",
    "1 petržel",
    "1/4 celeru",
    "2 cibule",
    "200 ml cashew smetany",
    "2 lžíce hořčice",
    "2 lžíce citronové šťávy",
    "Sůl, pepř, bobkový list, nové koření",
    "Houskové knedlíky k podávání",
    "Brusinkový džem k podávání",
  ],
  "cocková-polevka-uzena-paprika": [
    "250 g červené čočky",
    "1 velká cibule",
    "3 stroužky česneku",
    "2 mrkve",
    "2 lžičky uzené papriky",
    "400 ml pasírovaných rajčat",
    "1 l zeleninového vývaru",
    "2 lžíce olivového oleje",
    "Sůl, pepř, kmín",
    "Čerstvá petrželka na ozdobu",
    "Chléb k podávání",
  ],
  "buddha-bowl-pecena-zelenina": [
    "150 g quinoy",
    "1 batát",
    "200 g cizrny (z konzervy)",
    "1 avokádo",
    "100 g červeného zelí",
    "1 mrkev",
    "2 lžíce tahini",
    "1 lžíce citronové šťávy",
    "1 lžíce olivového oleje",
    "Sůl, pepř, kmín, česnek",
    "Sezamová semínka na posypání",
  ],
  "vegansky-gulas-knedliky": [
    "300 g směsi hub (žampiony, hlívy, portobello)",
    "200 g seitanu",
    "2 velké cibule",
    "3 stroužky česneku",
    "3 lžíce sladké papriky",
    "1 lžička kmínu",
    "2 lžíce rajčatového protlaku",
    "500 ml zeleninového vývaru",
    "2 lžíce olivového oleje",
    "Sůl, pepř",
    "Houskové knedlíky k podávání",
    "Čerstvá petrželka na ozdobu",
  ],
  "spenatove-palacinkys-tofu-ricottou": [
    "200 g čerstvého špenátu",
    "150 g hladké mouky",
    "250 ml rostlinného mléka",
    "200 g tvrdého tofu",
    "1 lžíce citronové šťávy",
    "2 stroužky česneku",
    "2 lžíce nutričního droždí",
    "Sůl, pepř, muškátový oříšek",
    "Olivový olej na smažení",
    "Čerstvé bylinky (bazalka, petrželka)",
  ],
  "houbove-rizoto-kešu-parmezan": [
    "300 g arborio rýže",
    "250 g směsi lesních hub",
    "1 cibule",
    "2 stroužky česneku",
    "100 ml bílého vína",
    "800 ml zeleninového vývaru (teplého)",
    "50 g kešu ořechů",
    "2 lžíce nutričního droždí",
    "2 lžíce olivového oleje",
    "Čerstvý tymián",
    "Sůl, pepř",
  ],
  "veganske-palacinky": [
    "200 g hladké mouky",
    "300 ml rostlinného mléka (ovesné nebo sójové)",
    "2 lžíce cukru",
    "1 lžička prášku do pečiva",
    "Špetka soli",
    "2 lžíce rostlinného oleje + na smažení",
    "1 lžička vanilkového extraktu",
    "Čerstvé ovoce (jahody, borůvky, banán)",
    "Javorový sirup na polití",
    "Kokosová šlehačka na ozdobu",
  ],
  "vegetariansky-bramborovy-salat": [
    "1 kg varného typu brambor",
    "3 vejce natvrdo",
    "200 g nakládaných okurek",
    "1 velká mrkev",
    "150 g hrášku (z konzervy)",
    "1 malá cibule",
    "200 g majonézy",
    "2 lžíce hořčice",
    "Sůl, pepř",
    "Čerstvá petrželka na ozdobu",
  ],
  "veganske-brownies": [
    "200 g hladké mouky",
    "200 g cukru",
    "60 g kvalitního kakaa",
    "1 lžička prášku do pečiva",
    "1/2 lžičky soli",
    "80 ml rostlinného oleje",
    "250 ml rostlinného mléka",
    "1 lžička vanilkového extraktu",
    "100 g hořké čokolády (na kousky)",
    "50 g vlašských ořechů (volitelné)",
  ],
  "houbove-rizoto": [
    "300 g arborio rýže",
    "300 g směsi hub (žampiony, hlívy, portobello)",
    "1 cibule",
    "3 stroužky česneku",
    "100 ml bílého vína",
    "800 ml teplého zeleninového vývaru",
    "50 g kešu ořechů",
    "2 lžíce nutričního droždí",
    "3 lžíce olivového oleje",
    "Čerstvý tymián",
    "Sůl, pepř",
  ],
  "veganska-babovka": [
    "300 g hladké mouky",
    "250 g cukru",
    "60 g kvalitního kakaa",
    "2 lžičky prášku do pečiva",
    "1 lžička jedlé sody",
    "1/2 lžičky soli",
    "300 ml rostlinného mléka",
    "80 ml rostlinného oleje",
    "2 lžíce jablečného octa",
    "1 lžička vanilkového extraktu",
    "Na polevu: 100 g hořké čokolády + 3 lžíce kokosové smetany",
  ],
  "vegansky-pad-thai": [
    "200 g rýžových nudlí",
    "200 g tvrdého tofu",
    "1 mrkev",
    "1 červená paprika",
    "100 g fazolových klíčků",
    "3 jarní cibulky",
    "3 lžíce tamarindové pasty",
    "2 lžíce sójové omáčky",
    "1 lžíce cukru",
    "1 lžíce limetové šťávy",
    "50 g drcených arašídů",
    "Čerstvý koriandr",
  ],
  "domaci-vegetarianska-pizza": [
    "Na těsto: 400 g hladké mouky",
    "7 g sušeného droždí",
    "1 lžička cukru",
    "1 lžička soli",
    "250 ml teplé vody",
    "2 lžíce olivového oleje",
    "Na omáčku: 200 ml pasírovaných rajčat",
    "200 g mozzarelly",
    "1 cuketa, 1 paprika, žampiony",
    "Čerstvá bazalka",
    "Olivy, sušená rajčata (volitelné)",
  ],
  "vegansky-cheesecake": [
    "Na základ: 200 g datlí",
    "150 g vlašských ořechů",
    "2 lžíce kakaa",
    "Na náplň: 300 g kešu ořechů (namočených 4 hodiny)",
    "100 ml kokosového mléka",
    "80 ml javorového sirupu",
    "60 ml kokosového oleje",
    "2 lžíce citronové šťávy",
    "1 lžička vanilkového extraktu",
    "Na polevu: 200 g borůvek",
    "2 lžíce javorového sirupu",
  ],
  "tortilla-grilovana-zelenina": [
    "4 velké tortilly (pšeničné)",
    "1 cuketa",
    "1 červená paprika",
    "1 žlutá paprika",
    "1 malý lilek",
    "1 červená cibule",
    "200 g hummusu",
    "Čerstvá rukola",
    "2 lžíce olivového oleje",
    "Sůl, pepř, oregano",
    "Avokádo na podávání",
  ],
  "vegansky-bananovy-chleb": [
    "3 zralé banány",
    "250 g hladké mouky",
    "100 g cukru",
    "80 ml rostlinného oleje",
    "1 lžička jedlé sody",
    "1 lžička prášku do pečiva",
    "1 lžička skořice",
    "1/2 lžičky soli",
    "1 lžička vanilkového extraktu",
    "60 g vlašských ořechů",
  ],
  "smoothie-bowl": [
    "2 zmrazené banány",
    "150 g zmrazených borůvek",
    "100 ml rostlinného mléka",
    "1 lžíce arašídového másla",
    "Na ozdobu: domácí granola",
    "Čerstvé ovoce (jahody, kiwi, banán)",
    "Kokosové chipsy",
    "Chia semínka",
    "Lžíce medu nebo javorového sirupu",
  ],
  "spenatova-polevka": [
    "400 g čerstvého špenátu",
    "3 střední brambory",
    "1 cibule",
    "3 stroužky česneku",
    "800 ml zeleninového vývaru",
    "100 ml smetany (nebo rostlinné alternativy)",
    "2 lžíce másla (nebo olivového oleje)",
    "Sůl, pepř, muškátový oříšek",
    "Krutony na podávání",
  ],
  "kvetakova-polevka": [
    "1 velký květák",
    "1 cibule",
    "3 stroužky česneku",
    "3 cm čerstvého zázvoru",
    "200 ml kokosového mléka",
    "600 ml zeleninového vývaru",
    "2 lžíce olivového oleje",
    "Sůl, pepř, kurkuma",
    "Dýňový olej na ozdobu",
    "Pečený květák na ozdobu",
  ],
  "cizrnove-curry": [
    "2 konzervy cizrny (400 g každá)",
    "1 konzerva kokosového mléka (400 ml)",
    "400 g pasírovaných rajčat",
    "1 cibule",
    "3 stroužky česneku",
    "2 cm čerstvého zázvoru",
    "2 lžíce curry pasty",
    "1 lžička kurkumy",
    "1 lžička kmínu",
    "Čerstvý koriandr",
    "Basmati rýže k podávání",
  ],
  "tofu-stir-fry": [
    "300 g tvrdého tofu",
    "1 brokolice",
    "1 červená paprika",
    "1 mrkev",
    "3 jarní cibulky",
    "3 lžíce sójové omáčky",
    "1 lžíce sezamového oleje",
    "1 lžíce kukuřičného škrobu",
    "2 cm čerstvého zázvoru",
    "2 stroužky česneku",
    "Sezamová semínka na posypání",
    "Rýže k podávání",
  ],
  "mexicke-fazole-ryze": [
    "2 konzervy černých fazolí (400 g každá)",
    "400 g pasírovaných rajčat",
    "1 konzerva kukuřice",
    "1 červená paprika",
    "1 cibule",
    "3 stroužky česneku",
    "2 lžičky kmínu",
    "1 lžička chilli prášku",
    "Čerstvý koriandr",
    "1 avokádo",
    "1 limetka",
    "300 g basmati rýže",
  ],
  "spenatove-testoviny": [
    "250 g těstovin (penne nebo fusilli)",
    "200 g čerstvého špenátu",
    "200 g ricotty",
    "50 g parmezánu",
    "2 stroužky česneku",
    "2 lžíce olivového oleje",
    "Sůl, pepř, muškátový oříšek",
    "Citronová kůra na ozdobu",
  ],
  "hraskova-polevka": [
    "500 g mraženého hrášku",
    "1 cibule",
    "2 stroužky česneku",
    "600 ml zeleninového vývaru",
    "Hrst čerstvé máty",
    "2 lžíce olivového oleje",
    "100 ml kokosového mléka (volitelné)",
    "Sůl, pepř",
    "Krutony nebo chléb k podávání",
  ],
  "slany-strudl-modry-syr": [
    "1 balení listového těsta (275 g)",
    "150 g gorgonzoly nebo nivy",
    "3 cibule",
    "30 g másla",
    "80 g vlašských ořechů",
    "4 větvičky čerstvého tymiánu",
    "1 vejce (na potření)",
    "1 lžíce cukru",
    "Sůl a pepř dle chuti",
  ],
  "strudl-se-zelim": [
    "1 balení listového těsta (275 g)",
    "600 g bílého zelí",
    "2 cibule",
    "1 lžíce celého kmínu",
    "3 lžíce oleje",
    "1 lžíce octa",
    "1 lžička cukru",
    "Sůl a pepř dle chuti",
    "2 lžíce rostlinného mléka (na potření)",
    "Kysanou smetanu nebo veganskou alternativu k podávání",
    "Čerstvý kopr na ozdobu",
  ],
  "strudl-spenat-ricotta": [
    "1 balení listového těsta (275 g)",
    "400 g čerstvého špenátu",
    "250 g ricotty",
    "3 stroužky česneku",
    "50 g strouhaného parmezánu",
    "1/4 lžičky muškátového oříšku",
    "1 vejce (na potření)",
    "2 lžíce olivového oleje",
    "Sůl a pepř dle chuti",
    "Cherry rajčátka a bazalka k podávání",
  ],
  "adzarsky-khachapuri": [
    "300 g hladké mouky",
    "7 g sušeného droždí",
    "180 ml vlažné vody",
    "1 lžička cukru",
    "1 lžička soli",
    "2 lžíce olivového oleje",
    "300 g sulguni nebo mozzarelly",
    "100 g fety nebo brynzy",
    "2 vejce",
    "20 g másla",
  ],
  "lobiani-gruzinsky-chleb": [
    "400 g hladké mouky",
    "7 g sušeného droždí",
    "220 ml vlažné vody",
    "1 lžička cukru",
    "1 lžička soli",
    "3 lžíce olivového oleje",
    "400 g červených fazolí (z konzervy)",
    "2 cibule",
    "3 stroužky česneku",
    "1 lžíce khmeli-suneli (nebo směs koriandru, pískavice a chilli)",
    "1 hrst čerstvého koriandru",
  ],
  "pchali-gruzinske-kulicky": [
    "500 g čerstvého špenátu",
    "150 g vlašských ořechů",
    "3 stroužky česneku",
    "1 cibule",
    "1 lžička khmeli-suneli",
    "1/2 lžičky mletého koriandru",
    "1 lžíce vinného octa",
    "1/2 granátového jablka (semínka na ozdobu)",
    "Sůl dle chuti",
  ],
  default: [
    "Ingredience budou brzy doplňeny.",
  ],
};

const sampleSteps: Record<string, string[]> = {
  "veganska-svickova": [
    "Seitan nakrájejte na plátky a orestujte na oleji do zlatova z obou stran.",
    "Kořenovou zeleninu a cibuli nakrájejte na kostičky a restujte do měkka.",
    "Přidejte koření (bobkový list, nové koření, pepř) a zalijte vodou nebo zeleninovým vývarem.",
    "Vařte na mírném ohni 45 minut, dokud zelenina nezměkne.",
    "Zeleninu rozmixujte dohladka, přidejte cashew smetanu, hořčici a citronovou šťávu.",
    "Omáčku dochutíte solí a pepřem, případně přidejte trochu cukru pro vyvážení chuti.",
    "Podávejte s houskovými knedlíky a brusinkovým džemem.",
  ],
  "cocková-polevka-uzena-paprika": [
    "Na olivovém oleji orestujte nakrájenou cibuli a česnek do zlatova.",
    "Přidejte nakrájenou mrkev a restujte 3 minuty.",
    "Vsypte uzenou papriku a kmín, míchejte 30 sekund.",
    "Přidejte promytou čočku, pasírovaná rajčata a zeleninový vývar.",
    "Přiveďte k varu, poté snižte teplotu a vařte 20–25 minut, dokud čočka nezměkne.",
    "Dochutíte solí a pepřem. Polévku můžete částečně rozmixovat pro krémovější konzistenci.",
    "Podávejte s kapkou olivového oleje, čerstvou petrželkou a chlebem.",
  ],
  "buddha-bowl-pecena-zelenina": [
    "Quinou propláchněte a uvařte podle návodu na obalu (cca 15 minut).",
    "Batát nakrájejte na kostky, obalte v oleji a koření, pečte 25 minut na 200 °C.",
    "Cizrnu obalte v oleji s kmínem a pečte spolu s batátem posledních 15 minut.",
    "Připravte tahini dresink — smíchejte tahini, citronovou šťávu, trochu vody a sůl.",
    "Červené zelí jemně nakrájejte, mrkev nastrouháte, avokádo nakrájejte na plátky.",
    "Do misky naskládejte quinou, pečenou zeleninu, cizrnu, zelí, mrkev a avokádo.",
    "Polijte tahini dresinkem a posypte sezamovými semínky.",
  ],
  "vegansky-gulas-knedliky": [
    "Cibuli nakrájejte na půlměsíce a na oleji restujte do zlatova (cca 10 minut).",
    "Přidejte nakrájený česnek a restujte minutu.",
    "Vsypte sladkou papriku a kmín, rychle promíchejte (nepřepalujte papriku).",
    "Přidejte nakrájené houby a seitan, restujte 5 minut.",
    "Vmíchejte rajčatový protlak a zalijte zeleninovým vývarem.",
    "Vařte pod pokličkou na mírném ohni 40–50 minut, dokud guláš nezhoustne.",
    "Dochutíte solí a pepřem. Podávejte s houskovými knedlíky a čerstvou petrželkou.",
  ],
  "spenatove-palacinkys-tofu-ricottou": [
    "Špenát blanšírujte, scedíte a rozmixujte s rostlinným mlékem.",
    "Smíchejte špenátovou směs s moukou a špetkou soli. Těsto by mělo být hladké.",
    "Tofu rozmačkejte vidličkou, přidejte citronovou šťávu, česnek, nutriční droždí a koření.",
    "Na lehce olejem potřené pánvi smažte tenké palačinky z obou stran.",
    "Na každou palačinku naneste vrstvu tofu ricotty a srolujte nebo přeložte.",
    "Podávejte teplé, ozdobené čerstvými bylinkami a citronovou kůrou.",
  ],
  "houbove-rizoto-kešu-parmezan": [
    "Kešu ořechy rozmixujte s nutričním droždím na jemný prášek — to je váš veganský parmezán.",
    "Na oleji orestujte nakrájenou cibuli a česnek do sklovata.",
    "Přidejte nakrájené houby a restujte 5 minut, dokud pustí šťávu.",
    "Vsypte arborio rýži a míchejte 2 minuty, aby se obalila olejem.",
    "Zalijte bílým vínem a míchejte, dokud se nevsákne.",
    "Postupně přilévejte teplý vývar po naběračkách a stále míchejte (cca 18–20 minut).",
    "Na závěr vmíchejte kešu parmezán, dochutíte solí a pepřem. Ozdobte čerstvým tymánem.",
  ],
  "veganske-palacinky": [
    "V míse smíchejte mouku, cukr, prášek do pečiva a sůl.",
    "Přidejte rostlinné mléko, olej a vanilkový extrakt. Míchejte do hladkého těsta.",
    "Pánev rozpalte na střední teplotu a lehce potřete olejem.",
    "Nalijte tenkou vrstvu těsta a smažte z obou stran do zlatova (cca 2 minuty na stranu).",
    "Hotové palačinky skládejte na talíř a udržujte teplé.",
    "Podávejte s čerstvým ovocem, javorovým sirupem a kokosovou šlehačkou.",
  ],
  "vegetariansky-bramborovy-salat": [
    "Brambory uvařte ve slané vodě do měkka (cca 20 minut). Nechte vychladnout a nakrájejte na kostky.",
    "Vejce uvařte natvrdo (10 minut), oloupejte a nakrájejte na malé kostky.",
    "Mrkev uvařte do měkka a nakrájejte na kostky. Okurky také nakrájejte na malé kostky.",
    "Vše smíchejte v velké míse — brambory, vejce, mrkev, okurky, hrášek a jemně nakrájenou cibuli.",
    "Přidejte majonézu a hořčici, jemně promíchejte.",
    "Dochuťte solí a pepřem. Nechte v lednici alespoň 2 hodiny odstát.",
    "Před podáváním ozdobte čerstvou petrželkou.",
  ],
  "veganske-brownies": [
    "Předehřejte troubu na 180 °C. Plech (20×20 cm) vyložte pečicím papírem.",
    "V míse smíchejte mouku, cukr, kakao, prášek do pečiva a sůl.",
    "Přidejte olej, rostlinné mléko a vanilkový extrakt. Míchejte do hladkého těsta.",
    "Vmíchejte kousky čokolády a případně ořechy.",
    "Těsto nalijte do připraveného plechu a rozrovnejte.",
    "Pečte 22–25 minut — brownies by měly být ještě mírně vlhké uprostřed.",
    "Nechte vychladnout v plechu, pak nakrájejte na čtverečky.",
  ],
  "houbove-rizoto": [
    "Kešu ořechy rozmixujte s nutričním droždím na jemný prášek — veganský parmezán.",
    "Na oleji orestujte nakrájenou cibuli a česnek do sklovata.",
    "Přidejte nakrájené houby a restujte 5 minut, dokud pustí šťávu.",
    "Vsypte arborio rýži a míchejte 2 minuty, aby se obalila olejem.",
    "Zalijte bílým vínem a míchejte, dokud se nevsákne.",
    "Postupně přilévejte teplý vývar po naběračkách a stále míchejte (cca 18–20 minut).",
    "Na závěr vmíchejte kešu parmezán, dochuťte solí a pepřem. Ozdobte tymiánem.",
  ],
  "veganska-babovka": [
    "Předehřejte troubu na 175 °C. Formu na bábovku vymažte a vysypte moukou.",
    "V míse smíchejte mouku, cukr, kakao, prášek do pečiva, jedlou sodu a sůl.",
    "V druhé misce smíchejte mléko, olej, jablečný ocet a vanilkový extrakt.",
    "Mokré ingredience vlijte do suchých a krátce promíchejte (nepřemíchejte!).",
    "Těsto nalijte do formy a pečte 45–50 minut (zkuste párátkem).",
    "Nechte 15 minut vychladnout ve formě, pak vyklopte na mřížku.",
    "Na polevu rozpušťte čokoládu s kokosovou smetanou a polijte vychladlou bábovku.",
  ],
  "vegansky-pad-thai": [
    "Rýžové nudle připravte podle návodu na obalu (obvykle namočte v teplé vodě 10 minut).",
    "Tofu nakrájejte na kostky a osmažte na oleji do zlatova a křupava (5 minut).",
    "Smíchejte tamarindovou pastu, sójovou omáčku, cukr a limetovou šťávu — to je vaše omáčka.",
    "Ve woku osmažte nakrájenou mrkev a papriku 2 minuty.",
    "Přidejte nudle, omáčku a tofu. Míchejte 2–3 minuty.",
    "Na závěr přidejte fazolové klíčky a jarní cibulky.",
    "Podávejte s drcenými arašídy, koriandrem a plátkem limetky.",
  ],
  "domaci-vegetarianska-pizza": [
    "Mouku, droždí, cukr a sůl smíchejte. Přidejte teplou vodu a olej, hneťte 10 minut.",
    "Těsto přikryjte a nechte kynout 1 hodinu na teplém místě.",
    "Předehřejte troubu na maximální teplotu (250 °C) s plechem uvnitř.",
    "Těsto rozválejte na tenký kruh, přeneste na pečicí papír.",
    "Potřete rajčatovou omáčkou, přidejte nakrájenou zeleninu a mozzarellu.",
    "Pečte 10–12 minut, dokud okraje nezezlatí a sýr se nerozpustí.",
    "Ozdobte čerstvou bazalkou a podávejte ihned.",
  ],
  "vegansky-cheesecake": [
    "Na základ: Datle a ořechy rozmixujte v mixéru na lepivou směs. Přidejte kakao.",
    "Směs vtlačte na dno formy (18 cm) vyložené pečicím papírem. Dejte do mrazáku.",
    "Na náplň: Namočené kešu sceďte a rozmixujte s kokosovým mlékem, sirupem, olejem, citronem a vanilkou dohladka.",
    "Krém nalijte na připravený základ a uhlaďte povrch.",
    "Na polevu: Borůvky rozmixujte se sirupem a nalijte na krém.",
    "Zmrazte alespoň 4 hodiny, nejlépe přes noc.",
    "Před podáváním nechte 20 minut při pokojové teplotě.",
  ],
  "tortilla-grilovana-zelenina": [
    "Zeleninu (cuketu, papriky, lilek, cibuli) nakrájejte na plátky.",
    "Pokapejte olivovým olejem, osolte a opepřete. Přidejte oregano.",
    "Grilujte na grilové pánvi nebo v troubě na 220 °C cca 8–10 minut z každé strany.",
    "Tortilly krátce zahřejte na suché pánvi.",
    "Na každou tortillu natřete vrstvu hummusu.",
    "Přidejte grilovanou zeleninu, rukolu a plátky avokáda.",
    "Srolujte a podávejte ihned.",
  ],
  "vegansky-bananovy-chleb": [
    "Předehřejte troubu na 175 °C. Formu na chléb vyložte pečicím papírem.",
    "Banány rozmačkejte vidličkou na kaši.",
    "Přidejte olej, cukr a vanilkový extrakt. Dobře promíchejte.",
    "V druhé misce smíchejte mouku, jedlou sodu, prášek do pečiva, skořici a sůl.",
    "Suché ingredience vsypte do banánové směsi a krátce promíchejte. Přidejte ořechy.",
    "Těsto nalijte do formy a pečte 50–55 minut (zkuste párátkem).",
    "Nechte 10 minut vychladnout ve formě, pak vyklopte na mřížku.",
  ],
  "smoothie-bowl": [
    "Zmrazené banány a borůvky vložte do výkonného mixéru.",
    "Přidejte rostlinné mléko a arašídové máslo.",
    "Mixujte do husté krémové konzistence (případně přidejte trochu mléka).",
    "Směs nalijte do misky.",
    "Ozdobte granolou, nakrájeným ovocem, kokosovými chipsy a chia semínky.",
    "Pokapejte medem nebo javorovým sirupem a ihned podávejte.",
  ],
  "spenatova-polevka": [
    "Brambory oloupejte a nakrájejte na kostky. Cibuli a česnek jemně nakrájejte.",
    "Na másle orestujte cibuli a česnek do sklovata (3 minuty).",
    "Přidejte brambory a zalijte zeleninovým vývarem. Vařte 15 minut do měkka.",
    "Přidejte špenát a vařte další 3 minuty, dokud spadne.",
    "Vše rozmixujte tyčovým mixérem dohladka.",
    "Vmíchejte smetanu, dochuťte solí, pepřem a muškátovým oříškem.",
    "Podávejte s krutony a kapkou smetany navrch.",
  ],
  "kvetakova-polevka": [
    "Květák rozdělte na růžičky. Cibuli a česnek jemně nakrájejte. Zázvor nastrouháte.",
    "Na oleji orestujte cibuli, česnek a zázvor 3 minuty.",
    "Přidejte květák, kurkumu a zalijte zeleninovým vývarem.",
    "Vařte 20 minut, dokud květák nezměkne.",
    "Rozmixujte dohladka, přidejte kokosové mléko.",
    "Dochuťte solí a pepřem.",
    "Podávejte s kapkou dýňového oleje a pečeným květákem navrch.",
  ],
  "cizrnove-curry": [
    "Na oleji orestujte nakrájenou cibuli do zlatova (5 minut).",
    "Přidejte česnek, zázvor a curry pastu. Restujte 2 minuty.",
    "Vsypte kurkumu a kmín, promíchejte.",
    "Přidejte pasírovaná rajčata a kokosové mléko. Přiveďte k varu.",
    "Přidejte scečenou cizrnu a vařte 15–20 minut na mírném ohni.",
    "Dochuťte solí a pepřem.",
    "Podávejte s basmati rýží a čerstvým koriandrem.",
  ],
  "tofu-stir-fry": [
    "Tofu nakrájejte na kostky a osušte papírovým ubrouskem.",
    "Obalte v kukuřičném škrobu a osmažte na sezamovém oleji do zlatova (5 minut).",
    "Tofu vyndejte a ve stejném woku osmažte česnek a zázvor 30 sekund.",
    "Přidejte brokolici, papriku a mrkev. Smažte 3–4 minuty.",
    "Zalijte sójovou omáčkou a přidejte zpět tofu.",
    "Promíchejte a smažte ještě 2 minuty.",
    "Podávejte s rýží, posypte sezamovými semínky a jarními cibulkami.",
  ],
  "mexicke-fazole-ryze": [
    "Rýži uvařte podle návodu na obalu.",
    "Na oleji orestujte nakrájenou cibuli a česnek 3 minuty.",
    "Přidejte nakrájenou papriku a restujte 3 minuty.",
    "Vsypte kmín a chilli prášek, promíchejte.",
    "Přidejte scečené fazole, rajčata a kukuřici. Vařte 15 minut.",
    "Dochuťte solí a pepřem.",
    "Podávejte s rýží, plátky avokáda, koriandrem a limetkou.",
  ],
  "spenatove-testoviny": [
    "Těstoviny uvařte al dente podle návodu na obalu.",
    "Na olivovém oleji orestujte nakrájený česnek 30 sekund.",
    "Přidejte špenát a míchejte, dokud nespadne (2 minuty).",
    "Přidejte ricottu a trochu vody z těstovin. Promíchejte do krémové omáčky.",
    "Vmíchejte uvařené těstoviny a dochuťte solí, pepřem a muškátovým oříškem.",
    "Podávejte s nastrouhaným parmezánem a citronovou kůrou.",
  ],
  "hraskova-polevka": [
    "Na oleji orestujte nakrájenou cibuli a česnek do sklovata.",
    "Přidejte mražený hrášek a zalijte zeleninovým vývarem.",
    "Přiveďte k varu a vařte 10 minut.",
    "Přidejte čerstvou mátu (nechte si pár lístků na ozdobu).",
    "Vše rozmixujte dohladka tyčovým mixérem.",
    "Případně přidejte kokosové mléko pro krémovější konzistenci.",
    "Dochuťte solí a pepřem. Podávejte s krutony a lístky máty.",
  ],
  "slany-strudl-modry-syr": [
    "Cibuli nakrájejte na tenká kolečka. Na másle ji restujte na středním plameni 20–25 minut, dokud nezezlátne a nezkaramelizuje. Přidejte cukr, osolte a opepřete.",
    "Vlašské ořechy hrubě nasekejte. Modrý sýr rozdrobte na menší kousky.",
    "Listové těsto rozložte na pomoučeném povrchu. Rovnoměrně rozetřete karamelizovanou cibuli, ponechejte 2 cm okraje.",
    "Posypte drobky modrého sýru, vlašskými ořechy a lístky tymiánu.",
    "Těsto pevně srolujte do štrůdlu, okraje přitlačte. Přemístěte na plech vyložený pečicím papírem.",
    "Povrch potřete rozšlehaným vejcem. Nařízněte šikmé zářezy pro unikání páry.",
    "Pečte v troubě předehřáté na 200 °C po dobu 30–35 minut, dokud štrůdl není zlatavý a křupavý.",
    "Nechte 5 minut odpočinout, nakrájejte na plátky a podávejte s čerstvým salátem.",
  ],
  "strudl-se-zelim": [
    "Zelí nakrájejte na tenké nudličky. Cibuli nakrájejte na půlkolečka.",
    "Na oleji osmažte cibuli dozlatova, přidejte kmín a minutu restujte.",
    "Přidejte zelí, ocet, cukr, sůl a pepř. Duste na středním plameni 15–20 minut, dokud zelí nezměkne. Nechte vychladnout.",
    "Listové těsto rozložte na pomoučeném povrchu. Rovnoměrně rozetřete vychladlé zelí, ponechejte 2 cm okraje.",
    "Těsto pevně srolujte, okraje přitlačte a přemístěte na plech s pečicím papírem.",
    "Povrch potřete rostlinným mlékem a nařízněte šikmé zářezy.",
    "Pečte v troubě předehřáté na 200 °C po dobu 30–35 minut dozlatova.",
    "Podávejte teplý s kysanou smetanou nebo veganskou alternativou a čerstvým koprem.",
  ],
  "strudl-spenat-ricotta": [
    "Špenát krátce povařte v osolené vodě (1–2 min), slijte a důkladně vymačkejte přebytečnou vodu. Hrubě nasekejte.",
    "Na olivovém oleji osmažte prolisovaný česnek 30 sekund. Přidejte špenát, osolte, opepřete a přidejte muškátový oříšek. Restujte 2 minuty. Nechte vychladnout.",
    "V míse smíchejte ricottu, parmezán a vychladlý špenát. Ochutnejte a dosolte.",
    "Listové těsto rozložte na pomoučeném povrchu. Rozetřete špenátovou náplň, ponechejte 2 cm okraje.",
    "Pevně srolujte do štrůdlu, okraje přitlačte. Přemístěte na plech s pečicím papírem.",
    "Povrch potřete rozšlehaným vejcem.",
    "Pečte v troubě předehřáté na 200 °C po dobu 25–30 minut dozlatova.",
    "Podávejte s cherry rajčátky pečenými v troubě a čerstvou bazalkou.",
  ],
  "adzarsky-khachapuri": [
    "Smíchejte droždí, cukr a vlažnou vodu. Nechte 10 minut aktivovat.",
    "Do mísy prosejte mouku se solí. Přidejte droždí a olivový olej. Propracujte hladké těsto (8–10 minut). Zakryjte a nechte kynout 1 hodinu.",
    "Sulguni nebo mozzarellu nastruhejte, smíchejte s rozdrobenou fetou. Ochutnejte — náplň by měla být slaná.",
    "Těsto rozdělte na 2 díly. Každý rozválejte na oválný tvar (cca 30×20 cm).",
    "Na každý plát rozetřete polovinu sýrové náplně. Okraje přeložte a stočte do tvaru lodičky — špičky pevně stiskněte.",
    "Přemístěte na plech s pečicím papírem. Pečte v troubě předehřáté na 230 °C po dobu 15 minut.",
    "Vyndejte z trouby. Do středu každé lodičky prolomte jedno vejce (jen žloutek zůstane celý). Přidejte kousek másla.",
    "Vraťte do trouby na 3–5 minut — bílek by měl být tuhý, žloutek tekutý.",
    "Podávejte ihned. Odlamujte okraje a mícháte je do sýrovo-žloutkové náplně.",
  ],
  "lobiani-gruzinsky-chleb": [
    "Smíchejte droždí, cukr a vlažnou vodu. Aktivujte 10 minut.",
    "Uhnětejte hladké těsto z mouky, soli, oleje a droždí. Nechte kynout 1 hodinu.",
    "Fazole slijte a rozmačkejte vidličkou na hrubou pastu.",
    "Na oleji osmažte nadrobno nakrájenou cibuli dozlatova (8–10 min). Přidejte prolisovaný česnek a koření khmeli-suneli, restujte 1 minutu.",
    "Smíchejte fazolovou pastu s cibulí a česnekem. Přidejte nasekané listy koriandru. Ochutnejte a dosolte.",
    "Těsto rozdělte na 4 díly. Každý rozválejte na kulatý plát (cca 20 cm).",
    "Na každý plát dejte čtvrtinu náplně. Okraje přeložte ke středu a přitlačte. Obraťte a jemně rozválejte na plochý kruh.",
    "Na suché pánvi nebo v troubě (220 °C) pečte každý lobiani 5–7 minut z každé strany dozlatova.",
    "Podávejte teplý, potřený olivovým olejem.",
  ],
  "pchali-gruzinske-kulicky": [
    "Špenát krátce povařte (2 minuty), slijte a důkladně vymačkejte veškerou vodu — čím sušší, tím lépe.",
    "Vlašské ořechy, česnek a cibuli rozmixujte na jemnou pastu.",
    "Špenát nasekejte najemno a smíchejte s ořechovou pastou.",
    "Přidejte khmeli-suneli, mletý koriandr, ocet a sůl. Dobře promíchejte.",
    "Z hmoty tvarujte malé kuličky (průměr cca 3 cm). Vložte do lednice na 30 minut.",
    "Před podáváním ozdobte každou kuličku 3–4 semínky granátového jablka.",
    "Podávejte jako předkrm nebo součást gruzínského mezze.",
  ],
  default: [
    "Postup přípravy bude brzy doplňen.",
  ],
};

// ── Similar Recipes Sidebar ────────────────────────────────
function SimilarRecipesSidebar({ currentRecipe }: { currentRecipe: Recipe }) {
  // Find similar recipes: same category first, then same vegan type, exclude current
  const similar = recipes
    .filter((r) => r.slug !== currentRecipe.slug)
    .map((r) => {
      let score = 0;
      if (r.category === currentRecipe.category) score += 3;
      if (r.isVegan === currentRecipe.isVegan) score += 1;
      // Shared tags bonus
      const sharedTags = r.tags.filter((t) => currentRecipe.tags.includes(t)).length;
      score += sharedTags;
      return { recipe: r, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((s) => s.recipe);

  if (similar.length === 0) return null;

  return (
    <aside className="lg:w-80 flex-shrink-0">
      <div className="lg:sticky lg:top-6">
        <h2
          className="text-lg font-bold text-gray-900 mb-4"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Podobné recepty
        </h2>
        <div className="space-y-3">
          {similar.map((r) => (
            <Link key={r.slug} href={`/recepty/${r.slug}`}>
              <div className="bg-white rounded-xl border border-emerald-100 overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex gap-3 p-3">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <OptimizedImage
                      src={r.images?.[0]?.url || r.image}
                      alt={r.images?.[0]?.alt || r.title}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                      placeholderColor="#d1fae5"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      {r.isVegan ? (
                        <span className="bg-emerald-700 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                          Vegan
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                          Vegetariánský
                        </span>
                      )}
                      <span className="text-[10px] text-emerald-600 font-medium">{r.category}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {r.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-500">
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        {r.prepTime + r.cookTime} min
                      </span>
                      <span className="flex items-center gap-0.5">
                        <ChefHat className="w-3 h-3" />
                        {r.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ── MacroPanel with Serving Calculator ───────────────────────────────────────────────────
function MacroPanel({ macros, defaultServings }: { macros: NonNullable<import('@/lib/data').Recipe['macros']>; defaultServings: number }) {
  const [servings, setServings] = useState(defaultServings);
  const ratio = servings / defaultServings;

  const scale = (v: number) => Math.round(v * ratio * 10) / 10;

  const m = {
    calories: Math.round(macros.calories * ratio),
    protein: scale(macros.protein),
    carbs: scale(macros.carbs),
    fat: scale(macros.fat),
    fiber: scale(macros.fiber),
  };

  const totalCals = m.protein * 4 + m.carbs * 4 + m.fat * 9;
  const proteinPct = totalCals > 0 ? (m.protein * 4 / totalCals) : 0.33;
  const carbsPct = totalCals > 0 ? (m.carbs * 4 / totalCals) : 0.34;
  const fatPct = totalCals > 0 ? (m.fat * 9 / totalCals) : 0.33;

  const r = 46; const cx = 60; const cy = 60;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const slices = [
    { pct: proteinPct, color: "#10b981" },
    { pct: carbsPct, color: "#f59e0b" },
    { pct: fatPct, color: "#6366f1" },
  ];

  return (
    <div className="bg-white rounded-xl border border-emerald-100 p-6 mb-6">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Nutriční hodnoty
          </h2>
        </div>
        {/* Serving size picker */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-600" />
          <span className="text-sm text-gray-500">Počet porcí:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setServings(s => Math.max(1, s - 1))}
              className="w-7 h-7 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold text-sm flex items-center justify-center transition-colors"
              aria-label="Méně porcí"
            >−</button>
            <span className="w-8 text-center font-bold text-gray-900 text-sm">{servings}</span>
            <button
              onClick={() => setServings(s => Math.min(20, s + 1))}
              className="w-7 h-7 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold text-sm flex items-center justify-center transition-colors"
              aria-label="Více porcí"
            >+</button>
          </div>
          {/* Quick select buttons */}
          <div className="hidden sm:flex gap-1 ml-1">
            {[1, 2, 3, 4, 6, 8].filter(o => o !== servings).slice(0, 4).map(o => (
              <button
                key={o}
                onClick={() => setServings(o)}
                className="text-xs px-2 py-0.5 rounded-full border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors"
              >{o}x</button>
            ))}
          </div>
        </div>
      </div>

      {servings !== defaultServings && (
        <div className="mb-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2">
          <span className="font-semibold">⚠️</span>
          Hodnoty jsou přepočteny pro {servings} {servings === 1 ? "porci" : servings < 5 ? "porce" : "porcí"}
          {" — "}
          <button onClick={() => setServings(defaultServings)} className="underline hover:no-underline">
            Obnovit na {defaultServings} {defaultServings === 1 ? "porci" : defaultServings < 5 ? "porce" : "porcí"}
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-6 items-center">
        {/* Donut chart SVG */}
        <div className="relative flex-shrink-0">
          <svg viewBox="0 0 120 120" className="w-32 h-32 -rotate-90">
            {slices.map((s, i) => {
              const dash = s.pct * circ;
              const gap = circ - dash;
              const el = (
                <circle
                  key={i}
                  cx={cx} cy={cy} r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="18"
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={-offset}
                  style={{ transition: "stroke-dasharray 0.4s ease" }}
                />
              );
              offset += dash;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{m.calories}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">kcal</span>
          </div>
        </div>

        {/* Macro bars */}
        <div className="flex-1 w-full space-y-3">
          {[
            { label: "Bílkoviny", value: m.protein, unit: "g", color: "bg-emerald-500", dotColor: "bg-emerald-500", max: Math.max(m.protein * 1.5, 10) },
            { label: "Sacharidy", value: m.carbs, unit: "g", color: "bg-amber-400", dotColor: "bg-amber-400", max: Math.max(m.carbs * 1.5, 10) },
            { label: "Tuky", value: m.fat, unit: "g", color: "bg-indigo-400", dotColor: "bg-indigo-400", max: Math.max(m.fat * 1.5, 10) },
            { label: "Vláknina", value: m.fiber, unit: "g", color: "bg-teal-400", dotColor: "bg-teal-400", max: Math.max(m.fiber * 1.5, 5) },
          ].map((macro) => (
            <div key={macro.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-gray-600 font-medium">
                  <span className={`w-2 h-2 rounded-full ${macro.dotColor}`} />
                  {macro.label}
                </span>
                <span className="font-bold text-gray-900">{macro.value} {macro.unit}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${macro.color} transition-all duration-300`}
                  style={{ width: `${Math.min(100, (macro.value / macro.max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ── Image Gallery Component ─────────────────────────────────
function ImageGallery({ images, title }: { images: { url: string; alt: string }[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const goNext = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="mb-6">
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 group">
        <img
          src={images[activeIndex].url}
          alt={images[activeIndex].alt}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Předchozí fotografie"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Další fotografie"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative rounded-lg overflow-hidden h-16 w-24 flex-shrink-0 transition-all duration-200 ${
                i === activeIndex
                  ? "ring-2 ring-emerald-600 ring-offset-2 opacity-100"
                  : "opacity-60 hover:opacity-90"
              }`}
              aria-label={img.alt}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RecipeDetail() {
  const params = useParams<{ slug: string }>();
  const recipe = recipes.find((r) => r.slug === params.slug);

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">🥦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Recept nenalezen
            </h2>
            <Link href="/recepty">
              <Button className="bg-emerald-700 hover:bg-emerald-600 text-white mt-4">
                Zpět na recepty
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const ingredients = sampleIngredients[recipe.slug] || sampleIngredients.default;
  const steps = sampleSteps[recipe.slug] || sampleSteps.default;

  const difficultyColor = {
    snadný: "bg-emerald-100 text-emerald-700",
    střední: "bg-amber-100 text-amber-700",
    náročný: "bg-red-100 text-red-700",
  }[recipe.difficulty];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <SEOHead
        title={`${recipe.title} — Bezmasý recept`}
        description={`${recipe.description.slice(0, 150)}. ${recipe.isVegan ? "Veganský" : "Vegetariánský"} recept, doba přípravy ${recipe.prepTime + recipe.cookTime} min, ${recipe.servings} porce.`}
        ogImage={recipe.images?.[0]?.url || recipe.image}
        ogType="article"
        ogUrl={`https://www.bezmasajidla.cz/recepty/${recipe.slug}`}
      />
      <Header />

      {/* Breadcrumb */}
      <div className="bg-emerald-800 py-4">
        <div className="container">
          <nav className="text-xs text-emerald-300 flex items-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Domů</Link>
            <span>/</span>
            <Link href="/recepty" className="hover:text-white transition-colors">Recepty</Link>
            <span>/</span>
            <span className="text-white">{recipe.title}</span>
          </nav>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Back */}
            <Link href="/recepty" className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Zpět na recepty
            </Link>

            {/* Image Gallery */}
            {recipe.images && recipe.images.length > 0 ? (
              <ImageGallery images={recipe.images} title={recipe.title} />
            ) : (
              <div className="relative rounded-2xl overflow-hidden mb-6 h-72">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            )}

            {/* Vegan badge */}
            {recipe.isVegan && (
              <div className="inline-flex items-center gap-1 bg-emerald-700 text-white text-sm font-semibold px-3 py-1 rounded-full mb-4 shadow-md">
                <Leaf className="w-3.5 h-3.5" />
                Veganský recept
              </div>
            )}

            {/* Header */}
            <div className="bg-white rounded-xl border border-emerald-100 p-6 mb-6">
              <p className="text-sm text-emerald-600 font-medium mb-1">{recipe.category}</p>
              <h1
                className="text-3xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {recipe.title}
              </h1>
              <p className="text-gray-600 leading-relaxed mb-4">{recipe.description}</p>

              {/* Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-emerald-100">
                <div className="text-center">
                  <Clock className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Příprava</p>
                  <p className="text-sm font-semibold text-gray-900">{recipe.prepTime} min</p>
                </div>
                <div className="text-center">
                  <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Vaření</p>
                  <p className="text-sm font-semibold text-gray-900">{recipe.cookTime} min</p>
                </div>
                <div className="text-center">
                  <Users className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Porce</p>
                  <p className="text-sm font-semibold text-gray-900">{recipe.servings}</p>
                </div>
                <div className="text-center">
                  <ChefHat className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Náročnost</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyColor}`}>
                    {recipe.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* ── MACRO NUTRIENTS PANEL WITH SERVING CALCULATOR ── */}
            {recipe.macros && (
              <MacroPanel macros={recipe.macros} defaultServings={recipe.servings} />
            )}

            {/* ── PŘÍBĚH RECEPTU ── */}
            {recipe.storyTitle && recipe.story && recipe.story.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Příběh receptu</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {recipe.storyTitle}
                </h3>
                <div className="space-y-3">
                  {recipe.story.map((paragraph, i) => (
                    <p key={i} className="text-sm text-gray-700 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients */}
            <div className="bg-white rounded-xl border border-emerald-100 p-6 mb-6">
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Ingredience
              </h2>
              <ul className="space-y-2">
                {ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700">{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Affiliate: Buy ingredients */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingCart className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-semibold text-emerald-800">Koupit ingredience online</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">Objednejte všechny suroviny pohodlně domů a začněte vařit ještě dnes.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={getRohlikLink(recipe.title)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex-1"
                >
                  <Button className="w-full font-semibold text-white text-sm" style={{ backgroundColor: '#E8002D' }}>
                    <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                    Koupit na Rohlík.cz
                    <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" />
                  </Button>
                </a>
                <a
                  href={getKosikLink(recipe.title)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex-1"
                >
                  <Button className="w-full font-semibold text-white text-sm" style={{ backgroundColor: '#F5A623' }}>
                    <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                    Koupit na Košík.cz
                    <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Steps */}
            <div className="bg-white rounded-xl border border-emerald-100 p-6 mb-6">
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Postup přípravy
              </h2>
              <ol className="space-y-4">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="w-7 h-7 bg-emerald-700 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-700 leading-relaxed pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <span key={tag} className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Similar Recipes Sidebar */}
          <SimilarRecipesSidebar currentRecipe={recipe} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
