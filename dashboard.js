// =========================
// TEMPLATE 3
// =========================

// dashboard.js

function updatePreview() {

  const previewArea =
    document.querySelector(".preview-area");

  const previewCard =
    document.querySelector(".cardking");

  // =========================
  // REMOVE TODOS OS TEMAS
  // =========================

  previewArea.classList.remove(
    "cardking-preview",
    "cardkingdois-preview",
    "cardkingtres-preview"
  );

  // =========================
  // TEMPLATE
  // =========================

  if (
    templateInput.value ===
    "cardkingdois"
  ) {

    previewArea.classList.add(
      "cardkingdois-preview"
    );

  }

  else if (
    templateInput.value ===
    "cardkingtres"
  ) {

    previewArea.classList.add(
      "cardkingtres-preview"
    );

  }

  else {

    previewArea.classList.add(
      "cardking-preview"
    );

  }

  // =========================
  // BOX STYLE
  // =========================

  if (
    boxStyleInput.value ===
    "transparent"
  ) {

    previewCard.style.backdropFilter =
      "blur(1px)";

    previewCard.style.webkitBackdropFilter =
      "blur(1px)";

  } else {

    previewCard.style.backdropFilter =
      "blur(18px)";

    previewCard.style.webkitBackdropFilter =
      "blur(18px)";

  }

  // =========================
  // TEXT COLOR
  // =========================

  previewCard.style.setProperty(
    "--text-color",
    textColorInput.value
  );

  // =========================
  // TEXTO
  // =========================

  $("preview-name").innerText =
    nameInput.value || "Nome";

  $("preview-bio").innerText =
    bioInput.value || "Bio";

  // =========================
  // IMAGENS
  // =========================

  $("preview-avatar").src =
    avatarInput.value || "";

  $("preview-banner").style.backgroundImage =
    `url(${bannerInput.value || ""})`;

  // =========================
  // BALÃO
  // =========================

  const balao =
    $("preview-overlay");

  if (
    overlayInput.value &&
    overlayInput.value.trim() !== ""
  ) {

    balao.innerText =
      overlayInput.value;

    balao.style.display =
      "block";

  } else {

    balao.style.display =
      "none";

  }

  // =========================
  // FUNDO
  // =========================

  if (backgroundInput.value) {

    document.body.style.backgroundImage =
      `url(${backgroundInput.value})`;

    document.body.style.backgroundSize =
      "cover";

    document.body.style.backgroundPosition =
      "center";

    document.body.style.backgroundRepeat =
      "no-repeat";

    document.body.style.backgroundAttachment =
      "fixed";

  }

  // =========================
  // CARDS
  // =========================

  const container =
    $("extras-container");

  container.innerHTML = "";

  cards.forEach((c) => {

    if (
      !c.t.value &&
      !c.i.value &&
      !c.l.value
    ) return;

    const card =
      document.createElement("a");

    card.className =
      "extra-card";

    card.href =
      c.l.value || "#";

    card.target =
      "_blank";

    card.innerHTML = `
      <div class="extra-card-icon">

        <img
          src="${
            c.i.value ||
            "https://via.placeholder.com/55"
          }"
        >

      </div>

      <span>
        ${c.t.value || ""}
      </span>
    `;

    container.appendChild(card);

  });

}
