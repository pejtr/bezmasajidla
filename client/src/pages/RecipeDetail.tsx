// ============================================================
// BEZMASAJIDLA.CZ — Recipe Detail Page
// "Zelená Metropole" — full recipe with gallery, ingredients, steps
// ============================================================

import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Clock, Users, ChefHat, ArrowLeft, Leaf, ChevronLeft, ChevronRight, ShoppingCart, ExternalLink, BookOpen, Flame, Share2, Download, Instagram } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { recipes, type Recipe } from "@/lib/data";
import SEOHead from "@/components/SEOHead";
import OptimizedImage from "@/components/OptimizedImage";
import { getRohlikLink, getKosikLink, getScukLink, getTescoLink, trackAffiliateClick, trackAffiliateIntent } from "@/lib/affiliates";
import { RecipeJsonLd, BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/JsonLd";
import SmartInternalLinks from "@/components/SmartInternalLinks";
import { trpc } from "@/lib/trpc";
import RelatedProducts from "@/components/affiliate/RelatedProducts";
import RelatedExperiences from "@/components/affiliate/RelatedExperiences";
import { initSocialLandingAttribution } from "@/lib/attribution";

const sampleIngredients: Record<string, string[]> = {
  "svickova-bez-masa": [
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
  "gulas-bez-masa": [
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
  "prava-krkonosska-kulajda": [
    "2 středně velké brambory",
    "svazek čerstvého kopru",
    "3 celé tvrdé čerstvé houby nebo hrst mražených / sušených",
    "1 kelímek smetany na vaření",
    "1 litr kvalitního vývaru – zeleninového nebo kuřecího",
    "1 lžíce másla",
    "bobkový list",
    "celé nové koření",
    "Na jíšku: 1 lžíce másla, 1 lžíce hladké mouky",
    "K dochucení a servírování: ocet, cukr, citron",
    "4 čerstvá vejce a octová voda"
  ],

  "veganska-michana-vajicka-z-tofu": ["200 g přírodního nebo hedvábného tofu", "1 velká cibule (jemně nakrájená)", "3 lžíce lahůdkového droždí", "1/2 lžičky drceného kmínu", "1/2 lžičky kurkumy (pro žlutou barvu)", "1/2 lžičky černé soli Kala Namak (dodá vaječnou vůni)", "Čerstvě namletý černý pepř", "2 lžíce rostlinného oleje na smažení", "Čerstvá pažitka na ozdobu", "Křupavý chléb k podávání"],
  "kynute-livance-v-americkem-duchu": ["300 g hladké pšeničné mouky", "7 g sušeného droždí (1 balíček)", "350 ml vlažného rostlinného mléka", "2 lžíce třtinového cukru", "1 lžička vanilkového extraktu", "1/2 lžičky soli", "2 lžíce rozpuštěného kokosového oleje", "Javorový sirup a čerstvé borůvky k podávání"],
  "pres-noc-namocena-chia-ovesna-kase": ["50 g jemných ovesných vloček", "1 lžíce chia semínek", "180 ml mandlového nebo ovesného mléka", "1 lžíce javorového sirupu nebo medu", "1/2 lžičky skořice", "Čerstvé maliny, borůvky a plátky mandlí na zdobení"],
  "bramborovy-salat-s-domaci-sojanezou": ["800 g brambor (varný typ A/A-B)", "2 mrkve a 1/4 celeru (uvařené a nakrájené)", "150 g nakládaných okurek", "100 g mraženého hrášku", "1 malá cibule (spařená)", "100 ml neochuceného sójového mléka", "150 ml slunečnicového oleje", "1 lžíce plnotučné hořčice", "1 lžíce nálevu z okurek", "Sůl a pepř"],
  "celozrnny-testovinovy-salat-se-susenymi-rajcaty": ["250 g celozrnných těstovin (penne/fusilli)", "80 g sušených rajčat naložených v oleji", "50 g černých oliv bez pecky", "100 g čerstvé rukoly nebo špenátu", "2 lžíce piniových nebo slunečnicových semínek", "3 lžíce extra panenského olivového oleje", "1 lžíce balzamikového octa", "Sůl, pepř a špetka oregána"],
  "salat-tabbouleh-z-celozrnneho-bulguru": ["100 g celozrnného bulguru", "2 velké svazky čerstvé hladkolisté petrželky", "1 svazek čerstvé máty", "3 zralá pevná rajčata (nakrájená na drobné kostičky)", "1 malá červená cibule nebo jarní cibulka", "4 lžíce extra panenského olivového oleje", "Šťáva z 1-2 citronů", "Sůl a čerstvě mletý pepř"],
  "bramboracka-s-lesnimi-houbami": ["4 velké brambory (nakrájené na kostky)", "1 mrkev, 1 petržel, 1/4 celeru", "1 cibule a 3 stroužky česneku", "30 g sušených nebo 200 g čerstvých lesních hub", "1.2 l zeleninového vývaru", "2 lžíce hladké pšeničné nebo kukuřičné mouky na jíšku", "2 lžíce oleje nebo rostlinného másla", "1 lžíce drhnuté majoránky", "1/2 lžičky drceného kmínu, sůl a pepř"],
  "zelnacka-s-uzenym-tofu": ["400 g kysaného zelí (překrájeného)", "200 g uzeného tofu (nakrájeného na kostičky)", "3 brambory", "1 velká cibule", "2 lžičky sladké mleté papriky", "1/2 lžičky pálivé nebo uzené papriky", "1 l zeleninového vývaru", "2 bobkové listy, 4 kuličky nového koření", "2 lžíce rostlinného oleje", "Sůl a pepř"],
  "quinoa-s-kapustovym-pestem-a-chilli": ["150 g quinoy", "100 g čerstvého kadeřávku (bez stonků)", "40 g pražených mandlí", "1 stroužek česneku", "3 lžíce lahůdkového droždí", "50 ml extra panenského olivového oleje", "Šťáva z 1/2 citronu", "1/2 lžičky chilli vloček", "Sůl a pepř"],
  "kokosove-zeleninove-kari": ["1 batát (nakrájený na kostičky)", "1 malá cuketa", "1 červená paprika", "200 g vařené cizrny", "400 ml kokosového mléka v plechovce", "2 lžíce žluté nebo červené kari pasty", "1 cibule, 2 stroužky česneku, 2 cm zázvoru", "1 lžíce kokosového oleje", "Čerstvý koriandr a šťáva z limetky", "Rýže Basmati k podávání"],

  "pres-noc-namocena-chia-ovesna-kase-s-boruvkami": ["50 g ovesných vloček", "1 lžíce chia semínek", "180 ml mandlového mléka", "1 lžíce sirupu", "Skořice", "Čerstvé borůvky"],
  "detoxikacni-ovocne-smoothie": ["1 hrnek čerstvého ananasu", "1/2 manga", "1 hrst baby špenátu", "250 ml kokosové vody", "Limetková šťáva"],
  "celozrnny-testovinovy-salat-se-susenymi-rajcaty-a-tofu": ["250 g celozrnných těstovin", "80 g sušených rajčat", "50 g černých oliv", "150 g marinovaného tofu", "Rukola", "Olivový olej", "Balzamikový ocet"],
  "kuskusovy-salat-s-brusinkami-a-mandlemi": ["200 g celozrnného kuskusu", "50 g sušených brusinek", "40 g plátků mandlí", "1 svazek máty", "2 lžíce olivového oleje", "Citronová šťáva"],
  "pohankovy-salat-s-tempehem-a-grilovanou-zeleninou": ["150 g pohanky kroupy", "150 g uzeného tempehu", "1 cuketa", "1 červená paprika", "2 lžíce sojové omáčky", "Olivový olej", "Tymián"],
  "salat-tabbouleh-z-celozrnneho-bulguru-s-marinovanym-tofu": ["100 g bulguru", "2 svazky hladkolisté petrželky", "1 svazek máty", "3 rajčata", "150 g marinovaného tofu", "Citronová šťáva", "Olivový olej"],
  "zeleninovy-salat-s-kremovou-tahini-zalivkou": ["1/2 hlávky římského salátu", "1 okurka", "2 rajčata", "1/2 červené cibule", "3 lžíce tahini pasty", "2 lžíce citronové šťávy", "1 stroužek česneku", "Voda"],
  "bagetka-s-uzenym-tofu-a-karamelizovanou-cibulkou": ["2 celozrnné bagety", "200 g uzeného tofu", "2 velké cibule", "1 lžíce třtinového cukru", "1 lžíce balzamika", "Rukola", "Veganská majonéza"],
  "psenicno-zitny-chleb-s-pecenou-dyni-a-dresinkem": ["4 krajíce pšenično-žitného chleba", "300 g dýně Hokkaido", "2 lžíce hořčice", "1 lžíce javorového sirupu", "Olivový olej", "Semínka"],
  "cikrnovy-hummus-na-mnoho-zpusobu": ["400 g vařené cizrny", "3 lžíce tahini", "2 stroužky česneku", "Šťáva z 1 citronu", "1/2 lžičky římského kmínu", "Ice water", "Olivový olej"],
  "brokolicova-polevka-s-hraskem": ["1 brokolice", "200 g mraženého hrášku", "1 cibule", "750 ml zeleninového vývaru", "100 ml rostlinné smetany", "Sůl, pepř"],
  "lehce-pikantni-dynova-polevka-s-dynovym-olejem": ["1 dýně Hokkaido", "1 cibule", "2 stroužky česneku", "1/2 lžičky chilli", "800 ml vývaru", "Dýňový olej a semínka"],
  "fazolova-polevka-s-veganskym-chorizem": ["400 g červených fazolí", "100 g veganského choriza", "1 cibule", "2 stroužky česneku", "400 g krájených rajčat", "Uzená paprika"],
  "kremova-cizrnova-polevka": ["400 g cizrny", "1 pórek", "1 batát", "750 ml vývaru", "Kurkuma", "Římský kmín", "Olivový olej"],
  "veganska-kulajda-s-hribky-a-koprem": ["3 brambory", "200 g lesních hříbků", "1 l vývaru", "200 ml rostlinné smetany", "Čerstvý kopr", "Kmín, ocet, sůl"],
  "polevka-ze-sladke-kukurice-s-chilli": ["400 g sladké kukuřice", "1 cibule", "200 ml kokosového mléka", "500 ml vývaru", "Chilli vločky", "Koriandr"],
  "raw-brokolicova-polevka-s-avokadem": ["1/2 hlávky brokolice", "1 avokádo", "1 stroužek česneku", "300 ml teplé vody", "Citronová šťáva", "Sůl"],
  "raw-rajcatova-polevka-s-bazalkou": ["4 zralá rajčata", "4 sušená rajčata", "1 hrst bazalky", "2 lžíce olivového oleje", "1/2 str. česneku", "Sůl, pepř"],
  "ryzove-nudle-s-veganskym-kurecim-masem-a-teriyaki": ["150 g rýžových nudlí", "150 g veganských kuřecích nudliček", "1 brokolice", "1 mrkev", "4 lžíce teriyaki omáčky", "Sezam"],
  "veganska-kachna-se-spenatem-a-knedlikem": ["300 g seitanové kachny", "400 g duseného špenátu", "4 bramborové knedlíky", "Kmín", "Sójová omáčka", "Česnek"],
  "falafel-a-hummus-v-pita-chlebu": ["6 kuliček falafelu", "2 pita chleby", "100 g hummusu", "1 rajče", "1/2 okurky", "Tahini dresink"],
  "grilovana-zelenina-a-tofu-s-hummusovym-dipem": ["1 cuketa", "1 lilek", "1 paprika", "180 g tofu", "150 g hummusu", "Bylinky, olivový olej"],
  "vegansky-kureci-rizek-s-bramborovou-kasi": ["4 sójové platky uvařené ve vývaru", "Mouka, Hraška / mléko, Strouhanka", "600 g brambor", "Rostlinné máslo", "Olej"],
  "veganske-kureci-spizy-se-tremi-omacami": ["200 g seitanu", "1 paprika", "1 cibule", "Špejle", "Arašídové máslo, Sweet chilli, Sójová majonéza"],
  "musaka-s-lilkem-a-smetanovym-besamelem": ["2 lilky", "3 brambory", "200 g hnědé čočky", "400 g rajčat", "Rostlinné mléko, mouka a tuk na bešamel", "Skořice"],
  "osso-buco-z-marinovaneho-tofu": ["300 g tvrdého tofu", "1 mrkev, 1 stonkový celer", "100 ml červeného vína", "400 g pasírovaných rajčat", "Petrželka, citronová kůra"],
  "veganske-krevety-se-zeleninou": ["200 g veganských krevet", "1 cuketa", "3 stroužky česneku", "50 ml bílého vína", "Olivový olej", "Petrželka"],
  "vegansky-burger-xxl": ["2 burger bulky", "2 rostlinné patties", "2 plátky veganského sýra", "Kyselé okurky, rajče, salát", "BBQ omáčka"],
  "ratatouille-s-ryzi-basmati": ["1 lilek", "1 cuketa", "2 papriky", "400 g rajčat", "200 g rýže Basmati", "Provensálské bylinky"],
  "raw-pohankovy-salat-s-kremem-z-kesu": ["100 g naklíčené pohanky", "50 g kešu", "100 g květáku", "Citron", "Lahůdkové droždí", "Špenát"],
  "raw-bolonske-lasagne-s-kvetakem": ["2 cukety nakrájené na plátky", "100 g vlašských ořechů", "100 g sušených rajčat", "Kešu krém"],
  "raw-tabbouleh-salat-s-quinoou": ["100 g naklíčené quinoy", "2 svazky petrželky", "1 svazek máty", "2 rajčata", "Citron, Olivový olej"],
  "raw-tatarak-z-cervene-repy": ["2 raw červené řepy", "1 lžíce kaparů", "2 kyselé okurky", "1 cibule", "Hořčice, kečup, uzená paprika", "Topinky"],
  "rajcata-plnena-kesu-kremem": ["4 velká rajčata", "100 g kešu ořechů", "1 stroužek česneku", "Pažitka", "Citronová šťáva"],
  "veganske-kure-na-paprice-s-testovinami": ["200 g sójových nudliček", "2 cibule", "2 lžíce sladké papriky", "200 ml rostlinné smetany", "Těstoviny kolínka"],
  "bezlepkovy-spenatovy-quiche-s-tofu": ["200 g pohankové mouky", "80 g oleje / vody", "300 g špenátu", "300 g hedvábného tofu", "Česnek, lahůdkové droždí"],
  "plnene-bramborove-knedliky-s-uzenym-tofu": ["500 g vařených brambor", "150 g hrubé mouky", "200 g uzeného tofu", "2 cibule", "Kysané zelí k podávání"],
  "cocka-s-korenovou-zeleninou": ["250 g hnědé čočky", "1 mrkev, 1 petržel, 1/4 celeru", "1 cibule", "Kmín, ocet, sůl", "Volské oko / tofu"],
  "smoothie-pro-chladne-rano": ["1 zralý banán", "30 g ovesných vloček", "250 ml teplého ovesného mléka", "1/2 lžičky skořice", "Špetka mletého zázvoru"],
  "smoothie-pro-letni-rano": ["100 g jahod", "1 broskev", "200 ml mandlového mléka", "Čerstvá máta"],
  "sport-smoothie-s-proteinem": ["1 banán", "30 g hrachového proteinu", "1 lžíce arašídového másla", "300 ml sójového mléka"],
  "letni-exoticke-smoothie": ["1/2 manga", "Dužina z 1 marakuji", "150 ml pomerančového džusu", "2 lžíce kokosového mléka"],
  "smoothie-pro-lepsi-imunitu": ["2 pomeranče", "2 cm čerstvého zázvoru", "1/2 lžičky kurkumy", "1/2 citronu", "Špetka černého pepře"],
  "domaci-konopne-mleko": ["100 g loupaných konopných semínek", "1 l studené vody", "1 datle nebo lžíce sirupu", "Špetka soli"],
  "cokoladovy-kolac-z-polenty": ["150 g jemné polenty", "500 ml rostlinného mléka", "60 g kakaa", "100 g hořké čokolády", "100 g cukru", "Olej"],
  "jahlovy-kolac-s-vuni-podzimu": ["200 g jáhel (sparených)", "2 jablka nakrájená na kostičky", "50 g rozinek", "50 g ořechů", "Skořice, sirup"],
  "celozrnny-makovec": ["200 g mletého máku", "250 g celozrnné mouky", "150 g jablečného pyré", "250 ml mléka", "100 g cukru", "Prášek do pečiva"],
  "raw-boruvkovy-cheesecake": ["150 g mandlí", "150 g datlí", "300 g kešu (namočených)", "200 g borůvek", "100 ml kokosového oleje", "Javorový sirup"],
  "malinova-zmrzlina-s-ruzovou-slehackou": ["200 g zmrazených malin", "2 zmrazené banány", "100 ml kokosové smetany ke šlehání"],
  "coko-boruvkove-proteinove-tycinky": ["100 g vloček", "50 g čoko proteinu", "50 g borůvek", "3 lžíce arašídového másla", "Rostlinné mléko"],
  "ruzovy-kolac-s-cokoladovym-kremem": ["250 g mouky", "100 g cukru", "50 ml šťávy z řepy", "150 g hořké čokolády", "150 ml kokosové smetany"],
  "pohankove-livance-s-jahodami": ["150 g pohankové mouky", "250 ml mléka", "1 lžička kypřicího prášku", "Čerstvé jahody", "Sirup"],
  "avokadovy-puding-s-chia-seminkem": ["1 zralé avokádo", "1 banán", "3 lžíce kakaa", "1 lžíce chia semínek", "2 lžíce sirupu"],
  "amarantove-kulicky-se-skorici": ["50 g pufovaného amarantu", "50 g mletých ořechů", "1 lžička skořice", "4 lžíce datlového sirupu"],


  "minne-di-sant-agata-sicilske-kolacky": ["Na křehké těsto: 250 g hladké mouky", "100 g krupicového cukru", "125 g studeného másla (nakrájeného na kostičky)", "1 celé vejce + 1 žloutek (bílek schovejte na polevu)", "Na krémovou náplň: 300 g čerstvé ricotty (důkladně okapané)", "35 g moučkového cukru", "40 g kvalitní hořké čokolády (nasekané najemno)", "30 g kandované citrónové nebo pomerančové kůry (nakrájené)", "Na polevu a ozdobu: 125 g moučkového cukru", "1 lžíce citrónové šťávy", "1 bílek", "6 kandovaných třešní (červených)", "🇮🇹 Tip pro milovníky Itálie: Objevte více italských receptů a cestovatelských zážitků na www.do-italie.cz"],
  "florentinska-pizza": ["1 ks těsto na pizzu (vyválené čerstvé)", "6 lžic rajčatové omáčky na pizzu (sugo di pomodoro)", "175 g čerstvého baby špenátu", "4 lžíce nakrájených lesních hub nebo žampionů", "50 g strouhaného parmazánu (Parmigiano Reggiano)", "4 ks čerstvých vajec", "Sůl a čerstvě mletý černý pepř"],
  default: [
    "Ingredience budou brzy doplňeny.",
  ],
};

const sampleSteps: Record<string, string[]> = {
  "minne-di-sant-agata-sicilske-kolacky": ["Příprava těsta: V míse smíchejte mouku s cukrem. Přidejte studené máslo a vypracujte drobenku. Vmíchejte vejce a žloutek a rychle vypracujte hladké těsto. Zabalte do fólie a dejte na 30 minut do lednice.", "Příprava náplně: Čerstvou ricottu rozmíchejte s moučkovým cukrem dohladka. Vmíchejte nasekanou hořkou čokoládu a kandované ovoce.", "Tvarování koláčků: Těsto rozválejte na tloušťku cca 3–4 mm. Vyložte jím 6 silikonových půlkulových forem (nebo muffinových formiček). Naplňte ricottovým krémem a zespodu uzavřete kolečkem vyváleného těsta. Okraje přimáčkněte.", "Pečení: Pečte v předehřáté troubě na 180 °C přibližně 20–25 minut dozlatova. Po upečení nechte koláčky zcela vychladnout a opatrně vyklopte z forem.", "Poleva a dokončení: Vyšlehejte bílek s moučkovým cukrem a citrónovou šťávou do hladké bílé polevy. Koláčky přelijte polevou a na vrchol umístěte kandovanou třešeň.", "Podávání: Pro více inspirace a cestovatelské i kulinářské tipy navštivte www.do-italie.cz!"],

  "veganska-michana-vajicka-z-tofu": ["Cibuli orestujte na oleji.", "Přidejte rozdrobené tofu.", "Vmíchejte lahůdkové droždí, kurkumu, kmín a černou sůl.", "Restujte 3–5 minut.", "Posypejte pažitkou a podávejte."],
  "kynute-livance-v-americkem-duchu": ["Smíchejte suché ingredience.", "Přidejte teplé mléko a vypracujte těsto.", "Nechte 30 min kynout.", "Smažte na pánvi z obou stran.", "Podávejte se sirupem."],
  "pres-noc-namocena-chia-ovesna-kase-s-boruvkami": ["Smíchejte ve skleničce vločky, chia, skořici a mléko.", "Přidejte sirup a promíchejte.", "Nechte v lednici přes noc.", "Ráno ozdobte borůvkami a podávejte."],
  "detoxikacni-ovocne-smoothie": ["Všechno ovoce nakrájejte na kousky.", "Vložte s baby špenátem do mixéru.", "Zalijte kokosovou vodou a šťávou z limetky.", "Rozmixujte dohladka a podávejte s ledem."],
  "bramborovy-salat-s-domaci-sojanezou": ["Brambory uvařte ve slupce a nakrájejte.", "Zeleninu uvařte a nakrájejte.", "Vyšlehejte mléko s olejem na sójanézu.", "Vše smíchejte a nechte odležet v chladu."],
  "celozrnny-testovinovy-salat-se-susenymi-rajcaty-a-tofu": ["Těstoviny uvařte al dente a scedíte.", "Tofu orestujte na pánvi.", "Smíchejte s rajčaty, olivami a rukolou.", "Zalijte olivovým olejem a balzamikem."],
  "kuskusovy-salat-s-brusinkami-a-mandlemi": ["Kuskus zalijte vroucím vývarem nebo vodou a nechte 5 min přikrytý.", "Mandle opražte na suché pánvi.", "Do zchladlého kuskusu přimíchejte brusinky, mandle a nasekanou mátu.", "Dochuťte citronem a olejem."],
  "pohankovy-salat-s-tempehem-a-grilovanou-zeleninou": ["Pohanku uvařte do měkka.", "Zeleninu a tempeh nakrájejte na kousky a ogrilujte na pánvi s olejem a sójovkou.", "Smíchejte pohanku s grilovanou směsí a bylins."],
  "salat-tabbouleh-z-celozrnneho-bulguru-s-marinovanym-tofu": ["Bulgur zalijte vroucí vodou a nechte nabobtnat.", "Tofu nakrájejte a orestujte na pánvi.", "Petrželku a mátu nasekejte najemno.", "Vše smíchejte a dochuťte citronem a olejem."],
  "zeleninovy-salat-s-kremovou-tahini-zalivkou": ["Zeleninu nakrájejte na sousta.", "Na zálivku prošlehejte tahini, citron, utřený česnek a trochu vody do krémové konzistence.", "Zalijte salát a podávejte."],
  "bagetka-s-uzenym-tofu-a-karamelizovanou-cibulkou": ["Cibuli nakrájejte na kolečka a zvolna opékejte na oleji s cukrem a balzamikem 15 minut.", "Tofu nakrájejte na plátky a orestujte.", "Bagety rozřízněte, potřete majonézou, naplňte tofu, cibulkou a rukolou."],
  "psenicno-zitny-chleb-s-pecenou-dyni-a-dresinkem": ["Dýni nakrájejte na plátky, potři olejem a upečte v troubě na 200 °C 20 min.", "Smíchejte hořčici se sirupem.", "Chléb potřete dresinkem a obložte pečenou dýní a semínky."],
  "cikrnovy-hummus-na-mnoho-zpusobu": ["Cizrnku vložte do mixéru s tahini, česnekem, citronem a kmínem.", "Mixujte a přilévejte ledovou vodu, dokud nebude hummus nadýchaný.", "Zalijte olivovým olejem a ozdobte cizrnou."],
  "bramboracka-s-lesnimi-houbami": ["Orestujte cibuli a zeleninu.", "Zasypte moukou na jíšku a zalijte vývarem.", "Přidejte brambory a namočené houby.", "Vařte 25 min a dokončete majoránkou a česnekem."],
  "brokolicova-polevka-s-hraskem": ["Na oleji zpěňte cibuli.", "Přidejte brokolici a zalijte vývarem.", "Po 10 min vaření přidejte hrášek a po 3 min rozmixujte dohladka.", "Zjemněte smetanou."],
  "lehce-pikantni-dynova-polevka-s-dynovym-olejem": ["Dýni nakrájejte i se slupkou.", "Na oleji orestujte cibuli a česnek.", "Přidejte dýni a chilli, zalijte vývarem a vařte 20 min.", "Rozmixujte a ozdobte dýňovým olejem."],
  "fazolova-polevka-s-veganskym-chorizem": ["Nakrájené chorizo orestujte s cibulí.", "Přidejte česnek a uzenou papriku.", "Vsypte fazole a rajčata, zalijte vývarem a vařte 20 min.", "Dochuťte solí a bylinkami."],
  "kremova-cizrnova-polevka": ["Pórek orestujte na oleji s kořením.", "Přidejte batát na kostičky a cizrnu.", "Zalijte vývarem a vařte 15 minut do změknutí batátu.", "Částečně rozmixujte pro krémovou konzistenci."],
  "veganska-kulajda-s-hribky-a-koprem": ["Brambory vařte ve vývaru s kmínem a houbami.", "Až změknou, zalijte smetanou.", "Dochuťte solí, kapkou octa a čerstvým nasekaným koprem."],
  "polevka-ze-sladke-kukurice-s-chilli": ["Cibuli zpěňte na oleji.", "Přidejte kukuřici, zalijte vývarem a vařte 10 min.", "Rozmixujte dohladka s kokosovým mlékem.", "Podávejte posypané chilli a koriandrem."],
  "raw-brokolicova-polevka-s-avokadem": ["Všechny ingredience vložte do vysokorychlostního mixéru.", "Rozmixujte na hladký krém.", "Ozdobte semínky a podávejte ihned."],
  "raw-rajcatova-polevka-s-bazalkou": ["Rajčata nakrájejte a rozmixujte s bazalkou, olejem a česnekem.", "Dochuťte solí a čerstvě mletým pepřem.", "Podávejte chladné s bazalkovým lístkem."],
  "ryzove-nudle-s-veganskym-kurecim-masem-a-teriyaki": ["Nudle zalijte horkou vodou.", "Nudličky orestujte na pánvi s zeleninou.", "Přidejte sceděné nudle a zalijte teriyaki omáčkou.", "Posypejte opraženým sezamem."],
  "veganska-kachna-se-spenatem-a-knedlikem": ["Seitan nakrájejte, pokapejte gelem s kmínem a upečte do křupava.", "Špenát poduste na cibulce s česnekem.", "Bramborový knedlík uvařte nebo prohřejte na páře a podávejte."],
  "falafel-a-hummus-v-pita-chlebu": ["Falafely usmažte nebo upečte dokřupava.", "Pita chléb prohřejte a rozřízněte kapsu.", "Potřete humusem, vložte falafely a nakrájenou zeleninu.", "Zalijte tahini dresinkem."],
  "grilovana-zelenina-a-tofu-s-hummusovym-dipem": ["Zeleninu a tofu nakrájejte a potřete gelem s bylinkami.", "Ogrilujte na pánvi do měkka a zlatova.", "Podávejte na lůžku z krémového hummusu."],
  "vegansky-kureci-rizek-s-bramborovou-kasi": ["Sójové plátky obalte v mouce, Hrašce s mlékem a strouhance.", "Usmažte na oleji dozlatova.", "Brambory uvařte a ušlehejte kaši s teplým mlékem a máslem.", "Podávejte s citrónem."],
  "veganske-kureci-spizy-se-tremi-omacami": ["Na špejle střídavě napichujte seitan, papriku a cibuli.", "Grilujte na pánvi 10–12 minut.", "Přípravte si 3 omáčky a podávejte k namáčení."],
  "musaka-s-lilkem-a-smetanovym-besamelem": ["Lilky nakrájejte a upečte.", "Čočku poduste s rajčaty a špetkou skořice.", "Uvařte světlý bešamel.", "Vrstvěte v pekáči: brambory, čočka, lilek, bešamel a pečte 40 min."],
  "osso-buco-z-marinovaneho-tofu": ["Tofu orestujte dozlatova.", "Na oleji poduste celer a mrkev, zalijte vínem a rajčaty.", "Vložte tofu a dusíte 25 min.", "Posypejte gremolatou z petrželky a kůry."],
  "veganske-krevety-se-zeleninou": ["Krevety a nakrájenou cuketu zprudka orestujte na oleji s česnekem.", "Zalijte vína a nechte odpařit.", "Posypejte nasekanou petrželkou."],
  "vegansky-burger-xxl": ["Patties ogrilujte z obou stran a nechte na nich roztavit sýr.", "Bulky rozpečte.", "Složte burger s dresinkem, salátem, patty a zeleninou."],
  "ratatouille-s-ryzi-basmati": ["Zeleninu nakrájejte na kostičky.", "Orestujte postupně lilek, cuketu a papriky.", "Smíchejte s rajčaty a bylinkami a dusíte 20 min.", "Podávejte s Basmati rýží."],
  "raw-pohankovy-salat-s-kremem-z-kesu": ["Kešu a květák rozmixujte s trochou vody a droždím na krém.", "Smíchejte s naklíčenou pohankou a špenátem."],
  "raw-bolonske-lasagne-s-kvetakem": ["Ořechy a rajčata rozmixujte na boloňskou směs.", "Střídavě vrstvěte plátky cukety, boloňskou směs a kešu krém."],
  "raw-tabbouleh-salat-s-quinoou": ["Bylinky nasekejte najemno.", "Smíchejte s quinou a nakrájenými rajčaty.", "Dochuťte citronem a olejem."],
  "raw-tatarak-z-cervene-repy": ["Řepu najemno nastrouhejte a vymačkejte šťávu.", "Smíchejte s nasekanými okurkami, cibulkou, kapary a kořením.", "Servírujte na topinkách."],
  "rajcata-plnena-kesu-kremem": ["Rajčata seřízněte a vydlabejte.", "Kešu rozmixujte s česnekem, trochou vody a citronem na krém.", "Smíchejte s pažitkou a naplňte rajčata."],
  "veganske-kure-na-paprice-s-testovinami": ["Sójové maso uvařte ve vývaru.", "Na oleji orestujte cibuli, zasypte paprikou a zalijte vývarem.", "Přidejte maso a dusíte 15 min.", "Zahustěte smetanou a podávejte s kolínky."],
  "bezlepkovy-spenatovy-quiche-s-tofu": ["Vypracujte těsto na korpus a předpečte 10 min.", "Tofu rozmixujte s česnekem, droždím a duseným špenátem.", "Nalijte na korpus a pečte 30 min na 180 °C."],
  "plnene-bramborove-knedliky-s-uzenym-tofu": ["Brambory nastrouhejte a smíchejte s moukou v těsto.", "Tofu a cibuli nakrájejte a orestujte.", "Z těsta tvořte placičky, naplňte tofu a uvařte ve vodě 15 min."],
  "cocka-s-korenovou-zeleninou": ["Čočku uvařte do měkka.", "Kořenovou zeleninu orestujte s cibulí.", "Smíchejte s čočkou a dochuťte octem a solí."],
  "smoothie-pro-chladne-rano": ["Všechny suroviny vložte do mixéru a rozmixujte dohladka.", "Podávejte ihned teplé."],
  "smoothie-pro-letni-rano": ["Ovoce nakrájejte a rozmixujte s mlékem a mátou.", "Podávejte s ledem."],
  "sport-smoothie-s-proteinem": ["Všechny ingredience rozmixujte v šejkru nebo mixéru a vypijte po cvičení."],
  "letni-exoticke-smoothie": ["Mango rozmixujte s džusem a kokosovým mlékem.", "Vmiechejte marakujovou dužinu."],
  "smoothie-pro-lepsi-imunitu": ["Pomeranče a citron odšťavněte.", "Zázvor nastrouhejte a rozmixujte s kurkumou a pepřem."],
  "domaci-konopne-mleko": ["Konopná semínka vložte do mixéru s vodou, datlí a solí.", "Mixujte 1 minutu na vysoké otáčky.", "Uložte do skleněné lahve v lednici."],
  "cokoladovy-kolac-z-polenty": ["Polentu uvařte v mléce s cukrem.", "Do horké polenty vmíchejte kakao a nalámanou čokoládu.", "Vlijte do formy a pečte 35 min na 180 °C."],
  "jahlovy-kolac-s-vuni-podzimu": ["Jáhly uvařte do měkka.", "Smíchejte s jablky, skořicí, rozinkami a sirupem.", "Zapečte v troubě na 180 °C 40 minut."],
  "celozrnny-makovec": ["Smíchejte mák, mouku a prášek do pečiva.", "Přidejte pyré, mléko a cukr a vypracujte těsto.", "Pečte ve vymazané formě 35 minut."],
  "raw-boruvkovy-cheesecake": ["Mandle a datle rozmixujte a natlačte na dno formy.", "Kešu rozmixujte s borůvkami, olejem a sirupem na krém.", "Nalijte na korpus a nechte ztuhnout v mrazáku."],
  "malinova-zmrzlina-s-ruzovou-slehackou": ["Maliny a banány rozmixujte ve výkonném mixéru na zmrzlinu.", "Kokosovou smetanu ušlehejte s kapkou malinové šťávy.", "Podávejte s růžovou šlehačkou."],
  "coko-boruvkove-proteinove-tycinky": ["Všechny ingredience smíchejte a vytvořte tužší hmotu.", "Utlačte do hranaté formy a dejte na 1 hodinu ztuhnout do lednice.", "Nakrájejte na tyčinky."],
  "ruzovy-kolac-s-cokoladovym-kremem": ["Mouku, cukr, šťávu a olej smíchejte v růžové těsto a upečte korpus.", "Čokoládu rozpusťte v horké smetaně na krém.", "Potřete korpus krémem."],
  "pohankove-livance-s-jahodami": ["Mouku, kypřicí prášek a mléko vyšlehejte v těstíčko.", "Smažte lívanečky na kapce oleje.", "Ozdobte nakrájenými jahodami."],
  "avokadovy-puding-s-chia-seminkem": ["Avokádo, banán, kakao a sirup rozmixujte dohladka.", "Vmíchejte chia semínka a podávejte ve skleničkách."],
  "amarantove-kulicky-se-skorici": ["Smíchejte amarant, ořechy, skořici a sirup v tvárnou hmotu.", "Koulejte malé kuličky a obalte ve skořici."],



  "pres-noc-namocena-chia-ovesna-kase": ["Ve skleničce smíchejte vločky, chia semínka, skořici a rostlinné mléko.", "Přidejte javorový sirup a důkladně promíchejte.", "Uzavřete a dejte do chladničky přes noc (minimálně na 4 hodiny).", "Ráno ozdobte čerstvým ovocem a mandlovými plátky a podávejte."],
  "celozrnny-testovinovy-salat-se-susenymi-rajcaty": ["Těstoviny uvařte v osolené vodě al dente, scedíte a nechte vychladnout.", "Sušená rajčata nakrájejte na proužky, olivy na kolečka.", "Semínka opražte na suché pánvi dozlatova.", "Smíchejte těstoviny, rajčata, olivy a rukolu.", "Zalijte olivovým olejem a balzamikem, dochuťte solí, pepřem a oregánem."],
  "salat-tabbouleh-z-celozrnneho-bulguru": ["Bulgur zalijte vroucí vodou v poměru 1:2, přikryjte a nechte 15 minut nabobtnat.", "Petrželku a mátu nasekejte velmi najemno.", "Rajčata a cibuli nakrájejte na co nejmenší kostičky.", "Vše smíchejte ve velké míse spolu se zchladlým bulgurem.", "Dochuťte hojně citronovou šťávou, olivovým olejem a solí."],
  "zelnacka-s-uzenym-tofu": ["Brambory uvařte v osolené vodě zvlášť s kmínem do změknutí.", "Na oleji orestujte cibuli a kostičky uzeného tofu dokřupava.", "Zaprašte mletou paprikou, krátce zpěňte a zalijte vývarem.", "Přidejte kysané zelí, bobkový list a nové koření a vařte 20 minut.", "Do polévky všemixujte nebo vmíchejte uvařené brambory i s trochou vody.", "Dochuťte solí a nechte krátce projít varem."],
  "quinoa-s-kapustovym-pestem-a-chilli": ["Quinou důkladně propláchněte horkou vodou a uvařte ve dvojnásobku vody cca 15 minut.", "Kadeřávek blanšírujte 1 minutu ve vroucí vodě a zchlaďte ledovou vodou.", "V mixéru rozmixujte kadeřávek, mandle, česnek, lahůdkové droždí, olivový olej, citronovou šťávu a sůl na pesto.", "Teplou quinou promíchejte s kapustovým pestem.", "Servírujte posypané chilli vločkami a praženými mandlemi."],
  "kokosove-zeleninove-kari": ["Na kokosovém oleji orestujte cibuli, nasekaný česnek a nastrouhaný zázvor.", "Přidejte kari pastu a míchejte 1 minutu, dokud se nerozvoní.", "Vložte nakrájené batáty, papriku a cuketu a promíchejte.", "Zalijte kokosovým mlékem a 100 ml vody nebo vývaru.", "Dusíte cca 15-20 minut do změknutí batátů.", "Přidejte cizrnu, pokapejte limetkou a ozdobte čerstvým koriandrem."],

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
  "prava-krkonosska-kulajda": [
    "Nejprve si připravte světlou jíšku: v malém rendlíku rozehřejte máslo, a jakmile pění, nasypte mouku. Míchejte do hladka.",
    "Brambory oloupejte a nakrájejte na kostičky. Stonky kopru zavažte gumičkou.",
    "Do hrnce dejte vývar, brambory a svazek kopru. Vařte do měkka, poté kopr vyjměte.",
    "Přidejte bobkový list, nové koření a podlijte dalším vývarem, pokud se odpařil.",
    "Na pánvi vedle orestujte na másle houby. Až pustí šťávu, přidejte je do polévky.",
    "Vlijte smetanu a povařte. Zahustěte předem připravenou jíškou (kterou si můžete rozmíchat s trochou vývaru) a nechte důkladně probublat.",
    "Dochuťte octem, cukrem nebo citronem podle chuti a podávejte posypané čerstvým koprem se zastřeným vejcem."
  ],




  "florentinska-pizza": ["1 ks těsto na pizzu (vyválené čerstvé)", "6 lžic rajčatové omáčky na pizzu (sugo di pomodoro)", "175 g čerstvého baby špenátu", "4 lžíce nakrájených lesních hub nebo žampionů", "50 g strouhaného parmazánu (Parmigiano Reggiano)", "4 ks čerstvých vajec", "Sůl a čerstvě mletý černý pepř"],
  default: [
    "Postup přípravy bude brzy doplňen.",
  ],
};

// ── Similar Recipes Sidebar ────────────────────────────────
type RecipeSeoContent = {
  seoTitle: string;
  seoDescription: string;
  intentKeywords: string[];
  authorityParagraphs: string[];
  practicalTips: string[];
  servingIdeas: string[];
};

function getDietLabel(recipe: Recipe) {
  return recipe.isVegan ? "veganský" : "vegetariánský";
}

function getCuisineLabel(recipe: Recipe) {
  const cuisine = recipe.cuisine || recipe.tags.find((tag) => tag.toLowerCase().includes("kuchyn"));
  return cuisine ? cuisine.replace(" kuchyně", "").replace("Kuchyně", "").trim() : "bezmasé";
}

function cleanIngredientName(item: string) {
  return item
    .replace(/^\d+\s*(g|ml|l|ks)?\s*/i, "")
    .replace(/\([^)]*\)/g, "")
    .trim()
    .toLowerCase();
}

function buildRecipeSeoContent(recipe: Recipe, ingredients: string[]): RecipeSeoContent {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const diet = getDietLabel(recipe);
  const cuisine = getCuisineLabel(recipe);
  const primaryIngredients = ingredients
    .slice(0, 5)
    .map(cleanIngredientName)
    .filter((item) => item && !item.includes("brzy"));
  const macroText = recipe.macros
    ? `Na jednu porci vychází přibližně ${recipe.macros.calories} kcal, ${recipe.macros.protein} g bílkovin, ${recipe.macros.carbs} g sacharidů, ${recipe.macros.fat} g tuků a ${recipe.macros.fiber} g vlákniny.`
    : "U receptu sledujeme sytost, poměr rostlinných surovin a praktickou použitelnost pro běžné domácí vaření.";
  const dietaryClaims = [
    recipe.isVegan ? "bez živočišných surovin" : "bez masa",
    recipe.isGlutenFree ? "bez lepku" : null,
    recipe.isKeto ? "vhodné pro low-carb styl" : null,
    recipe.macros && recipe.macros.protein >= 14 ? "s vyšším obsahem bílkovin" : null,
  ].filter(Boolean) as string[];

  return {
    seoTitle: `${recipe.title}: ${diet} recept krok za krokem`,
    seoDescription: `${recipe.title} je ${diet} ${recipe.category.toLowerCase()} ${cuisine !== "bezmasé" ? `inspirované kuchyní ${cuisine}` : "pro každodenní bezmasé vaření"}. Recept obsahuje přesný postup, suroviny, čas přípravy, nutriční hodnoty a praktické tipy, aby se povedl i doma.`,
    intentKeywords: [
      recipe.title,
      `${diet} recept`,
      "bezmasý recept",
      recipe.category,
      `${recipe.category} bez masa`,
      cuisine,
      ...recipe.tags,
      ...primaryIngredients,
    ].filter(Boolean),
    authorityParagraphs: [
      `${recipe.title} patří mezi recepty, které řeší konkrétní kuchařský záměr: připravit chutné ${recipe.category.toLowerCase()} bez masa, s dostupnými surovinami a jasným postupem. Důraz je na rovnováhu chuti, textury a sytosti, takže recept funguje jako rychlá inspirace i jako plnohodnotné domácí jídlo.`,
      `Z pohledu výživy dává tento ${diet} recept smysl hlavně díky kombinaci surovin jako ${primaryIngredients.slice(0, 3).join(", ") || "zelenina, luštěniny a kvalitní tuky"}. ${macroText} To pomáhá čtenářům porovnat recept nejen podle chuti, ale i podle praktičnosti, energetické hodnoty a vhodnosti pro běžný jídelníček.`,
      `Recept je psaný pro českou domácí kuchyni: počítá s běžně dostupnými surovinami, realistickým časem přípravy ${totalTime} minut a porcemi pro ${recipe.servings} osoby. Díky tomu je vhodný pro hledání typu "${recipe.title} recept", "${diet} ${recipe.category.toLowerCase()}" i "rychlé bezmasé jídlo".`,
    ],
    practicalTips: [
      "Suroviny si připravte předem a krájejte je na podobně velké kusy, aby se tepelně upravily rovnoměrně.",
      "Chuť dolaďujte postupně: nejdřív sůl a kyselost, potom tuk nebo sladkost. U bezmasých receptů právě tato rovnováha rozhoduje, jestli jídlo působí plně.",
      "Pokud vaříte dopředu, uchovejte omáčku nebo dresink zvlášť. Recept si tak udrží lepší texturu i při ohřívání.",
      recipe.isVegan
        ? "Pro ještě výraznější rostlinnou chuť se hodí uzená paprika, lahůdkové droždí, sójová omáčka nebo kvalitní zeleninový vývar."
        : "U vegetariánské verze pomůže kvalitní sýr, vejce nebo smetana, ale vždy je dobré držet je jako doplněk, ne jako jediný zdroj chuti.",
    ],
    servingIdeas: [
      `${recipe.title} podávejte jako hlavní jídlo pro ${recipe.servings} porce, případně připravte menší porce jako součást většího bezmasého menu.`,
      dietaryClaims.length > 0
        ? `Hodí se pro čtenáře, kteří hledají recept ${dietaryClaims.join(", ")}.`
        : "Hodí se pro každého, kdo chce omezit maso a přitom zachovat plnou chuť jídla.",
      `Pro lepší interní propojení zkuste také podobné recepty v kategorii ${recipe.category} nebo další recepty se štítky ${recipe.tags.slice(0, 3).join(", ")}.`,
    ],
  };
}

function buildRecipeFaq(recipe: Recipe, ingredients: string[], steps: string[]) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const diet = getDietLabel(recipe);
  const firstIngredient = ingredients.find((item) => !item.includes("brzy")) || "hlavní suroviny";

  return [
    {
      question: `Je ${recipe.title} veganský recept?`,
      answer: recipe.isVegan
        ? `Ano, ${recipe.title} je veganský recept bez masa, mléka, vajec a dalších živočišných surovin.`
        : `${recipe.title} je vegetariánský recept bez masa. Pokud chcete veganskou verzi, nahraďte mléčné výrobky, vejce nebo sýr rostlinnou alternativou podle typu receptu.`,
    },
    {
      question: `Jak dlouho trvá příprava receptu ${recipe.title}?`,
      answer: `Celkový čas je přibližně ${totalTime} minut: ${recipe.prepTime} minut příprava a ${recipe.cookTime} minut vaření nebo pečení.`,
    },
    {
      question: `Pro kolik porcí je recept ${recipe.title}?`,
      answer: `Recept je počítaný na ${recipe.servings} porce. Množství surovin můžete jednoduše násobit podle počtu lidí.`,
    },
    {
      question: `Co je u receptu ${recipe.title} nejdůležitější?`,
      answer: `Nejdůležitější je správně připravit ${cleanIngredientName(firstIngredient)} a postupovat podle kroků v uvedeném pořadí. Recept má ${steps.length} kroků a je označený jako ${recipe.difficulty}.`,
    },
    {
      question: `Jak recept upravit podle dostupných surovin?`,
      answer: `Základ receptu tvoří ${firstIngredient}. Podle sezóny můžete obměnit zeleninu a bylinky, ale zachovejte hlavní zdroj chuti a postup uvedený u receptu.`,
    },
  ];
}

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


// ── Share Recipe Card ─────────────────────────────────────────────────────────
function ShareRecipeCard({ recipe }: { recipe: import('@/lib/data').Recipe }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const generateCard = useCallback(async () => {
    setIsGenerating(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d')!;

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 1080);
      grad.addColorStop(0, '#064e3b');
      grad.addColorStop(1, '#065f46');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1080);

      // Load recipe image
      const imgSrc = recipe.images?.[0]?.url || recipe.image;
      if (imgSrc) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            // Draw image in top 60% with cover
            const targetH = 648;
            const scale = Math.max(1080 / img.width, targetH / img.height);
            const sw = img.width * scale;
            const sh = img.height * scale;
            const sx = (1080 - sw) / 2;
            const sy = 0;
            ctx.drawImage(img, sx, sy, sw, sh);
            // Dark overlay on image
            const overlay = ctx.createLinearGradient(0, 300, 0, 648);
            overlay.addColorStop(0, 'rgba(0,0,0,0)');
            overlay.addColorStop(1, 'rgba(6,78,59,0.95)');
            ctx.fillStyle = overlay;
            ctx.fillRect(0, 0, 1080, 648);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = imgSrc;
        });
      }

      // Category chip
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(54, 580, ctx.measureText(recipe.category).width + 36, 44, 22);
      ctx.fill();
      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(recipe.category.toUpperCase(), 72, 609);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 72px Georgia, serif';
      const words = recipe.title.split(' ');
      let line = '';
      let y = 700;
      for (const word of words) {
        const test = line + (line ? ' ' : '') + word;
        if (ctx.measureText(test).width > 972 && line) {
          ctx.fillText(line, 54, y);
          line = word;
          y += 84;
        } else {
          line = test;
        }
      }
      ctx.fillText(line, 54, y);
      y += 60;

      // Macros row (if available)
      if (recipe.macros) {
        const macroItems = [
          { label: 'kcal', value: String(recipe.macros.calories) },
          { label: 'bílk.', value: recipe.macros.protein + 'g' },
          { label: 'sachar.', value: recipe.macros.carbs + 'g' },
          { label: 'tuky', value: recipe.macros.fat + 'g' },
        ];
        let mx = 54;
        for (const item of macroItems) {
          ctx.fillStyle = 'rgba(255,255,255,0.12)';
          ctx.beginPath();
          ctx.roundRect(mx, y, 200, 72, 12);
          ctx.fill();
          ctx.fillStyle = '#6ee7b7';
          ctx.font = 'bold 30px sans-serif';
          ctx.fillText(item.value, mx + 16, y + 36);
          ctx.fillStyle = 'rgba(255,255,255,0.6)';
          ctx.font = '20px sans-serif';
          ctx.fillText(item.label, mx + 16, y + 62);
          mx += 216;
        }
        y += 96;
      }

      // Meta row
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '26px sans-serif';
      ctx.fillText(`⏱ ${recipe.prepTime + recipe.cookTime} min  ·  👤 ${recipe.servings} porcí  ·  bezmasajidla.cz`, 54, y + 30);

      // Leaf watermark
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.font = 'bold 200px sans-serif';
      ctx.fillText('🌿', 800, 1000);

      const url = canvas.toDataURL('image/jpeg', 0.92);
      setGeneratedUrl(url);
      setShowModal(true);
    } finally {
      setIsGenerating(false);
    }
  }, [recipe]);

  const handleDownload = () => {
    if (!generatedUrl) return;
    const a = document.createElement('a');
    a.href = generatedUrl;
    a.download = `${recipe.slug}-bezmasajidla.jpg`;
    a.click();
  };

  return (
    <>
      <button
        onClick={generateCard}
        disabled={isGenerating}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-800 border border-emerald-200 hover:border-emerald-400 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {isGenerating ? (
          <span className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Share2 className="w-3.5 h-3.5" />
        )}
        {isGenerating ? 'Generuji...' : 'Sdílet jako obrázek'}
      </button>

      {showModal && generatedUrl && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={generatedUrl} alt="Sdílecí karta receptu" className="w-full" />
            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-500 text-center">Stáhněte obrázek a sdílejte na Instagramu nebo Facebooku</p>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Stáhnout
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Zavřít
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
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
          loading={activeIndex === 0 ? "eager" : "lazy"}
          fetchPriority={activeIndex === 0 ? "high" : "auto"}
          decoding="async"
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
              className={`relative rounded-lg overflow-hidden h-16 w-24 flex-shrink-0 transition-all duration-200 ${i === activeIndex
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
  const recordLandingMutation = trpc.affiliate.recordSocialLanding.useMutation();

  useEffect(() => {
    if (!recipe) return;
    const landing = initSocialLandingAttribution(recipe.slug);
    if (landing.isSocialLanding && landing.socialPostId) {
      recordLandingMutation.mutate({
        socialPostId: landing.socialPostId,
        recipeSlug: recipe.slug,
        attributionSessionId: landing.attributionSessionId,
      });
    }
  }, [recipe?.slug]);

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">🥦</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Recept nenalezen
            </h1>
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
  const seoContent = buildRecipeSeoContent(recipe, ingredients);
  const recipeFaqs = buildRecipeFaq(recipe, ingredients, steps);

  const difficultyColor = {
    snadný: "bg-emerald-100 text-emerald-700",
    střední: "bg-amber-100 text-amber-700",
    náročný: "bg-red-100 text-red-700",
  }[recipe.difficulty];

  // Fetch contextual affiliate recommendations (Ekočlověk & Zážitky.cz)
  const { data: affiliateData } = trpc.affiliate.getRecipeRecommendations.useQuery(
    {
      recipeSlug: recipe.slug,
      title: recipe.title,
      category: recipe.category,
      cuisine: recipe.cuisine,
      ingredients,
      tags: recipe.tags,
    },
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <SEOHead
        title={seoContent.seoTitle}
        description={seoContent.seoDescription}
        ogImage={recipe.images?.[0]?.url || recipe.image}
        ogType="recipe"
        ogUrl={`https://www.bezmasajidla.cz/recepty/${recipe.slug}`}
        recipeMeta={{
          prepTime: `PT${recipe.prepTime}M`,
          cookTime: `PT${recipe.cookTime}M`,
          recipeYield: `${recipe.servings} porcí`,
          recipeCategory: recipe.category,
          calories: recipe.macros ? `${recipe.macros.calories} calories` : undefined,
          tags: seoContent.intentKeywords.slice(0, 12),
        }}
      />
      <RecipeJsonLd
        recipe={recipe}
        ingredients={sampleIngredients[recipe.slug] || sampleIngredients.default}
        steps={sampleSteps[recipe.slug] || sampleSteps.default}
      />
      <FAQPageJsonLd faqs={recipeFaqs} />
      <BreadcrumbJsonLd items={[
        { name: "Domů", url: "/" },
        { name: "Recepty", url: "/recepty" },
        { name: recipe.title, url: `/recepty/${recipe.slug}` },
      ]} />
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
                  fetchPriority="high"
                  decoding="async"
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

              {/* Actions row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                <a
                  href="#koupit-ingredience"
                  onClick={() => trackAffiliateIntent("recipe_header", recipe.slug)}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Nakoupit ingredience
                </a>
                <ShareRecipeCard recipe={recipe} />
              </div>

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
            {/* Editorial SEO content */}
            <section className="bg-white rounded-xl border border-emerald-100 p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Praktický průvodce receptem</span>
              </div>
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Proč tento recept funguje
              </h2>
              <div className="space-y-3">
                {seoContent.authorityParagraphs.map((paragraph, i) => (
                  <p key={i} className="text-sm text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {seoContent.intentKeywords.slice(0, 10).map((keyword) => (
                  <span key={keyword} className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-100">
                    {keyword}
                  </span>
                ))}
              </div>
            </section>



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
                <p className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {recipe.storyTitle}
                </p>
                <div className="space-y-3">
                  {recipe.story.map((paragraph, i) => (
                    <p key={i} className="text-sm text-gray-700 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            <section className="grid gap-4 md:grid-cols-2 mb-6">
              <div className="bg-white rounded-xl border border-emerald-100 p-5">
                <h2
                  className="text-lg font-bold text-gray-900 mb-3"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  Tipy pro nejlepší výsledek
                </h2>
                <ul className="space-y-2">
                  {seoContent.practicalTips.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                      <span className="text-emerald-600 font-bold">{i + 1}.</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-5">
                <h2
                  className="text-lg font-bold text-gray-900 mb-3"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  Jak recept podávat a upravit
                </h2>
                <ul className="space-y-2">
                  {seoContent.servingIdeas.map((idea, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

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

            {/* Affiliate: Buy ingredients (Gated behind feature flag until a real grocery partner is integrated) */}
            {import.meta.env.VITE_GROCERY_AFFILIATE_ENABLED === "true" && (
              <div id="koupit-ingredience" className="scroll-mt-24 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-5 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-sm font-semibold text-emerald-800">Koupit ingredience online</h3>
                </div>
                <p className="text-xs text-gray-500 mb-4">Objednejte všechny suroviny pohodlně domů — kliknutím vyhledáte ingredience receptu.</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={getRohlikLink(recipe.title, ingredients)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    onClick={() => trackAffiliateClick("rohlik", recipe.slug)}
                    className="flex-1"
                  >
                    <Button className="w-full font-semibold text-white text-sm py-3" style={{ backgroundColor: '#E8002D' }}>
                      <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                      Koupit na Rohlík.cz
                      <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" />
                    </Button>
                  </a>
                  <a
                    href={getKosikLink(recipe.title, ingredients)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    onClick={() => trackAffiliateClick("kosik", recipe.slug)}
                    className="flex-1"
                  >
                    <Button className="w-full font-semibold text-white text-sm py-3" style={{ backgroundColor: '#F5A623' }}>
                      <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                      Koupit na Košík.cz
                      <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" />
                    </Button>
                  </a>
                </div>
                <p className="text-[10px] text-gray-400 mt-3 text-center">Partnerské odkazy — pomáhají nám tvořit nové recepty 💚</p>
              </div>
            )}

            {/* ── RELATED PRODUCTS (EKOČLOVĚK) ── */}
            {affiliateData?.products && affiliateData.products.length > 0 && (
              <RelatedProducts
                products={affiliateData.products}
                recipeSlug={recipe.slug}
                recipeTitle={recipe.title}
                recipeCuisine={recipe.cuisine}
              />
            )}

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

            <section className="bg-white rounded-xl border border-emerald-100 p-6 mb-6">
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Často hledané otázky k receptu
              </h2>
              <div className="space-y-4">
                {recipeFaqs.map((faq) => (
                  <div key={faq.question} className="border-b border-emerald-50 last:border-0 pb-4 last:pb-0">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{faq.question}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── RELATED EXPERIENCES (ZÁŽITKY.CZ) ── */}
            {affiliateData?.experiences && affiliateData.experiences.length > 0 && (
              <RelatedExperiences
                experiences={affiliateData.experiences}
                recipeSlug={recipe.slug}
                recipeTitle={recipe.title}
                recipeCuisine={recipe.cuisine}
              />
            )}

            {/* Smart Internal Cross-linking */}
            <SmartInternalLinks
              currentSlug={recipe.slug}
              category={recipe.category}
              tags={recipe.tags}
              type="recipe"
            />

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
