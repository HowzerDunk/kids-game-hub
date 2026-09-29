const item = (id, name, preview, color, svg) => ({ id, name, preview, color, svg });

const topShape = (fill, detail = "") => `
  <g class="outfit-piece" stroke="#6b4550" stroke-width="4" stroke-linejoin="round">
    <path fill="${fill}" d="M291 276Q319 260 341 264Q384 289 427 264Q450 261 477 276L489 345L469 468Q384 486 299 468L279 345Z"/>
    <path fill="${fill}" d="M292 279Q261 281 244 320L281 350L303 304ZM476 279Q507 281 524 320L487 350L465 304Z"/>
    ${detail}
  </g>`;

const shortsShape = (fill, detail = "") => `
  <g class="outfit-piece" stroke="#5c4a61" stroke-width="4" stroke-linejoin="round">
    <path fill="${fill}" d="M269 478Q384 493 499 478L509 710Q459 729 410 709L384 557L358 709Q309 729 259 710Z"/>
    <path d="M384 504V557" fill="none" opacity=".55"/>
    ${detail}
  </g>`;

const skirtShape = (fill, detail = "") => `
  <g class="outfit-piece" stroke="#6b4550" stroke-width="4" stroke-linejoin="round">
    <path fill="${fill}" d="M270 478Q384 493 498 478L536 703Q384 754 232 703Z"/>
    <path d="M278 501Q384 520 490 501" fill="none" stroke="#fff" stroke-width="8" opacity=".45"/>
    ${detail}
  </g>`;

const dressShape = (fill, detail = "", skirt = "M301 450Q384 471 467 450L548 786Q384 847 220 786Z") => `
  <g class="outfit-piece" stroke="#68445b" stroke-width="4" stroke-linejoin="round">
    <path fill="${fill}" d="M292 276Q320 260 342 264Q384 290 426 264Q450 261 476 276L489 348L463 488H305L279 348Z"/>
    <path fill="${fill}" d="M292 279Q260 282 245 321L281 350L304 303ZM476 279Q508 282 523 321L487 350L464 303Z"/>
    <path fill="${fill}" d="${skirt}"/>
    <path d="M303 467Q384 489 465 467" fill="none" stroke="#fff" stroke-width="10" opacity=".42"/>
    ${detail}
  </g>`;

export const moanaCharacter = {
  id: "moana",
  name: "Moana",
  baseImage: "/games/dress-up/characters/moana/moana-base.webp",
  viewBox: "0 0 768 1152",
  layerOrder: ["tops", "bottoms", "dresses", "shoes", "hats", "accessories"],
  categories: [
    {
      id: "tops",
      label: "Tops",
      icon: "👕",
      items: [
        item("sunny-tee", "Sunny shirt", "☀️", "#ffd85e", topShape("#ffd85e", '<circle cx="384" cy="365" r="35" fill="#fff6bb" stroke="none"/><g stroke="#fff6bb" stroke-width="8"><path d="M384 310V290M384 440V420M329 365H309M459 365H439M345 326L331 312M423 404L437 418M423 326L437 312M345 404L331 418"/></g>')),
        item("ocean-tee", "Ocean shirt", "🌊", "#53c7df", topShape("#53c7df", '<path d="M302 400Q340 370 378 400T454 400T484 399V462Q384 481 290 460Z" fill="#eafcff" stroke="none" opacity=".9"/>')),
        item("coral-tee", "Coral shirt", "🌺", "#f47d79", topShape("#f47d79", '<g fill="#fff0a8" stroke="none"><circle cx="384" cy="364" r="28"/><circle cx="356" cy="364" r="19"/><circle cx="412" cy="364" r="19"/><circle cx="384" cy="337" r="19"/><circle cx="384" cy="391" r="19"/><circle cx="384" cy="364" r="9" fill="#f28f4b"/></g>')),
        item("rainbow-top", "Rainbow shirt", "🌈", "#b98bef", topShape("#b98bef", '<path d="M304 394Q384 320 464 394" fill="none" stroke="#fff" stroke-width="24"/><path d="M311 394Q384 334 457 394" fill="none" stroke="#ffdd57" stroke-width="12"/>')),
        item("star-pajama-top", "Star pajamas", "🌙", "#7f88df", topShape("#7f88df", '<g fill="#fff4a8" stroke="none"><path d="M344 337l8 17 18 2-13 13 3 19-16-9-16 9 3-19-13-13 18-2z"/><circle cx="424" cy="405" r="10"/><circle cx="399" cy="326" r="7"/></g>')),
      ],
    },
    {
      id: "bottoms",
      label: "Bottoms",
      icon: "👖",
      items: [
        item("hibiscus-skirt", "Flower skirt", "🌸", "#f58bb4", skirtShape("#f58bb4", '<g fill="#fff4b0" stroke="none"><circle cx="302" cy="611" r="15"/><circle cx="384" cy="653" r="15"/><circle cx="468" cy="588" r="15"/></g>')),
        item("ocean-shorts", "Ocean shorts", "🐚", "#36b9ba", shortsShape("#36b9ba", '<path d="M276 548Q330 528 382 550T499 548" fill="none" stroke="#e9ffff" stroke-width="12" opacity=".75"/>')),
        item("denim-shorts", "Blue shorts", "💙", "#5d91d8", shortsShape("#5d91d8", '<path d="M280 520H488M312 500Q318 548 350 550M456 500Q450 548 418 550" fill="none" stroke="#d7ecff" stroke-width="6"/>')),
        item("sunshine-skirt", "Sunny skirt", "🌼", "#f5c94e", skirtShape("#f5c94e", '<path d="M270 568Q384 610 512 562M252 650Q384 696 528 642" fill="none" stroke="#fff4b0" stroke-width="12" opacity=".8"/>')),
      ],
    },
    {
      id: "dresses",
      label: "Dresses",
      icon: "👗",
      items: [
        item("sparkle-dress", "Sparkle dress", "✨", "#9b70d7", dressShape("#9b70d7", '<g fill="#fff5a8" stroke="none"><path d="M310 594l8 17 19 2-14 13 4 19-17-9-16 9 3-19-13-13 19-2z"/><path d="M437 686l7 14 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z"/><circle cx="394" cy="550" r="8"/></g>')),
        item("princess-dress", "Princess dress", "👑", "#67b8ec", dressShape("#67b8ec", '<path d="M248 737Q384 789 520 737" fill="none" stroke="#f5f0ff" stroke-width="22"/><path d="M321 319Q384 366 447 319" fill="none" stroke="#f5f0ff" stroke-width="10"/>', "M305 448Q384 473 463 448Q526 547 552 790Q384 858 216 790Q242 547 305 448Z")),
        item("rainbow-dress", "Rainbow dress", "🌈", "#f47f8b", dressShape("#f47f8b", '<path d="M247 665Q384 713 521 665" fill="none" stroke="#ffd65a" stroke-width="30"/><path d="M240 704Q384 755 528 704" fill="none" stroke="#66cddd" stroke-width="24"/>')),
        item("flower-dress", "Flower dress", "🌺", "#ef7767", dressShape("#ef7767", '<g fill="#fff0ae" stroke="none"><circle cx="319" cy="575" r="14"/><circle cx="397" cy="633" r="14"/><circle cx="459" cy="548" r="14"/><circle cx="350" cy="727" r="14"/><circle cx="475" cy="742" r="14"/></g>')),
        item("cozy-pajamas", "Cozy pajamas", "🌙", "#7c91df", dressShape("#7c91df", '<g fill="#fff0a8" stroke="none"><circle cx="330" cy="548" r="9"/><circle cx="441" cy="612" r="8"/><path d="M380 680l8 17 19 2-14 13 4 19-17-9-16 9 3-19-13-13 19-2z"/></g>', "M303 449Q384 472 465 449L499 752Q445 772 408 748L384 571L360 748Q323 772 269 752Z")),
      ],
    },
    {
      id: "shoes",
      label: "Shoes",
      icon: "👟",
      items: [
        item("sandals", "Sandals", "🩴", "#a86b45", '<g class="outfit-piece" fill="none" stroke="#8d5536" stroke-width="13" stroke-linecap="round"><path d="M258 1092Q294 1121 330 1094M438 1094Q474 1121 510 1092"/><path d="M279 1072L311 1114M489 1072L457 1114"/></g>'),
        item("sneakers", "Sneakers", "👟", "#f47d79", '<g class="outfit-piece" fill="#f47d79" stroke="#70495a" stroke-width="4"><path d="M249 1060Q286 1042 322 1065L340 1117Q292 1135 245 1115Z"/><path d="M519 1060Q482 1042 446 1065L428 1117Q476 1135 523 1115Z"/><path d="M255 1095H329M439 1095H513" stroke="#fff" stroke-width="10"/></g>'),
        item("rain-boots", "Rain boots", "🌧️", "#f4c83f", '<g class="outfit-piece" fill="#f4c83f" stroke="#80652b" stroke-width="4"><path d="M252 958H329L334 1117Q287 1138 243 1114L255 1044Z"/><path d="M516 958H439L434 1117Q481 1138 525 1114L513 1044Z"/><path d="M250 986H331M437 986H518" stroke="#fff2a5" stroke-width="13"/></g>'),
        item("ballet-shoes", "Ballet shoes", "🩰", "#f2a8bd", '<g class="outfit-piece" fill="#f2a8bd" stroke="#8b5260" stroke-width="4"><path d="M246 1080Q286 1053 330 1080L333 1118Q288 1136 246 1115Z"/><path d="M522 1080Q482 1053 438 1080L435 1118Q480 1136 522 1115Z"/><path d="M266 1015L319 1088M502 1015L449 1088M315 1015L266 1088M453 1015L502 1088" fill="none" stroke="#f2a8bd" stroke-width="11"/></g>'),
      ],
    },
    {
      id: "hats",
      label: "Hats",
      icon: "🎩",
      items: [
        item("flower-crown", "Flower crown", "🌸", "#f58aab", '<g class="outfit-piece" stroke="#497d4c" stroke-width="8" fill="none"><path d="M246 102Q384 45 522 102"/></g><g fill="#f58aab" stroke="#fff1ad" stroke-width="5"><circle cx="272" cy="87" r="20"/><circle cx="329" cy="64" r="21"/><circle cx="384" cy="57" r="22"/><circle cx="439" cy="65" r="21"/><circle cx="496" cy="88" r="20"/></g>'),
        item("princess-crown", "Princess crown", "👑", "#f6cc4e", '<g class="outfit-piece" fill="#f6cc4e" stroke="#8f6637" stroke-width="5" stroke-linejoin="round"><path d="M284 92L300 17L350 68L384 5L418 68L468 17L484 92Z"/><path d="M286 89Q384 113 482 89L477 120Q384 140 291 120Z"/><circle cx="384" cy="88" r="14" fill="#72c9df"/></g>'),
        item("cowboy-hat", "Cowboy hat", "🤠", "#b57945", '<g class="outfit-piece" fill="#b57945" stroke="#68472f" stroke-width="6"><path d="M278 70Q300 3 384 7Q468 3 490 70Q384 100 278 70Z"/><path d="M189 82Q265 54 329 68Q384 80 439 68Q503 54 579 82Q524 121 384 112Q244 121 189 82Z"/><path d="M294 61Q384 82 474 61" fill="none" stroke="#f0c96e" stroke-width="13"/></g>'),
        item("sun-hat", "Sun hat", "👒", "#f5d576", '<g class="outfit-piece" fill="#f5d576" stroke="#8c6f45" stroke-width="5"><path d="M268 74Q288 7 384 6Q480 7 500 74Z"/><ellipse cx="384" cy="82" rx="204" ry="34"/><path d="M275 65Q384 91 493 65" fill="none" stroke="#f08283" stroke-width="15"/></g>'),
      ],
    },
    {
      id: "accessories",
      label: "Accessories",
      icon: "🕶️",
      items: [
        item("sunglasses", "Sunglasses", "🕶️", "#46395f", '<g class="outfit-piece" fill="#46395f" stroke="#241d36" stroke-width="6"><path d="M304 141Q339 124 371 142Q370 190 335 193Q300 189 304 141Z"/><path d="M397 142Q429 124 464 141Q468 189 433 193Q398 190 397 142Z"/><path d="M371 150Q384 140 397 150M304 149L272 140M464 149L496 140" fill="none"/></g>'),
        item("heart-necklace", "Heart necklace", "💖", "#ef7390", '<g class="outfit-piece" fill="none" stroke="#f4d06f" stroke-width="7"><path d="M333 275Q384 332 435 275"/></g><path d="M384 326C366 304 337 326 384 366C431 326 402 304 384 326Z" fill="#ef7390" stroke="#87435b" stroke-width="4"/>'),
        item("flower-lei", "Flower necklace", "🌺", "#f58ca6", '<g class="outfit-piece" fill="#f58ca6" stroke="#fff1ae" stroke-width="5"><circle cx="324" cy="279" r="18"/><circle cx="348" cy="311" r="18"/><circle cx="384" cy="329" r="18"/><circle cx="420" cy="311" r="18"/><circle cx="444" cy="279" r="18"/></g>'),
        item("hair-flower", "Hair flower", "🌼", "#f5cc54", '<g class="outfit-piece" fill="#fff5b2" stroke="#df8c47" stroke-width="4"><circle cx="512" cy="173" r="25"/><circle cx="548" cy="173" r="25"/><circle cx="530" cy="143" r="25"/><circle cx="530" cy="203" r="25"/><circle cx="530" cy="173" r="15" fill="#f5a44d"/></g>'),
        item("star-purse", "Star purse", "⭐", "#8d73dc", '<g class="outfit-piece" fill="none" stroke="#8d73dc" stroke-width="11"><path d="M473 369Q570 446 555 625"/></g><path d="M555 590l17 35 39 6-28 27 7 39-35-19-35 19 7-39-28-27 39-6Z" fill="#ffd85e" stroke="#8d73dc" stroke-width="6"/>'),
      ],
    },
  ],
};
