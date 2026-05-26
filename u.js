// =========================
// TEMPLATE 3
// =========================

// u.js

// REMOVE TEMAS

document.body.classList.remove(
  "cardking-theme",
  "cardkingdois-theme",
  "cardkingtres-theme"
);

// TEMPLATE 1

if (
  data.template ===
  "cardking"
) {

  document.body.classList.add(
    "cardking-theme"
  );

}

// TEMPLATE 2

else if (
  data.template ===
  "cardkingdois"
) {

  document.body.classList.add(
    "cardkingdois-theme"
  );

}

// TEMPLATE 3

else if (
  data.template ===
  "cardkingtres"
) {

  document.body.classList.add(
    "cardkingtres-theme"
  );

}

// FALLBACK

else {

  document.body.classList.add(
    "cardking-theme"
  );

}
