async function loadProfile() {

  let username = null;

  // =========================
  // PEGA USERNAME
  // =========================

  const params =
    new URLSearchParams(window.location.search);

  username =
    params.get("user");

  if (!username) {

    username =
      window.location.pathname
        .replace("/", "")
        .trim();

  }

  console.log("USERNAME:", username);

  if (
    !username ||
    username === "u.html"
  ) {

    document.body.innerHTML =
      "<h1>Usuário não encontrado</h1>";

    return;

  }

  // =========================
  // BUSCA PERFIL
  // =========================

  const { data, error } =

    await supabaseClient
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();

  console.log(data);
  console.log(error);

  if (error || !data) {

    document.body.innerHTML =
      "<h1>Perfil não encontrado</h1>";

    return;

  }

  // =========================
  // TITLE
  // =========================

  document.title =
    `@${data.username}`;

  // =========================
  // TEMPLATE
  // =========================

  document.body.classList.remove(
    "cardking-theme",
    "cardkingdois-theme"
  );

  if (
    data.template ===
    "cardkingdois"
  ) {

    document.body.classList.add(
      "cardkingdois-theme"
    );

  } else {

    document.body.classList.add(
      "cardking-theme"
    );

  }

  if (
    data.box_style ===
    "transparent"
  ) {

    document
      .querySelector(".cardking")
      .style.backdropFilter =
      "blur(1px)";

    document
      .querySelector(".cardking")
      .style.webkitBackdropFilter =
      "blur(1px)";

  } else {

    document
      .querySelector(".cardking")
      .style.backdropFilter =
      "blur(18px)";

    document
      .querySelector(".cardking")
      .style.webkitBackdropFilter =
      "blur(18px)";

  }

  // =========================
  // TEXTO
  // =========================

  document
    .querySelector(".cardking")
    .style.setProperty(
      "--text-color",
      data.text_color || "white"
    );

  document.getElementById(
    "username"
  ).innerText =
    data.display_name || data.username;

  document.getElementById(
    "bio"
  ).innerText =
    data.bio || "";

  // =========================
  // BALÃO
  // =========================

  const balao =
    document.getElementById("balao");

  if (
    !data.balao ||
    data.balao.trim() === ""
  ) {

    balao.style.display =
      "none";

  } else {

    balao.style.display =
      "block";

    balao.innerText =
      data.balao;

  }

  // =========================
  // IMAGENS
  // =========================

 document.getElementById(
  "avatar"
).src =
  data.avatar_url ||
  "https://i.pinimg.com/736x/bd/c7/81/bdc781b471ebd825a6ab5a40e36e0f8e.jpg";

  document.getElementById(
    "banner"
  ).style.backgroundImage =
    `url(${data.banner_url || ""})`;

  // =========================
  // FUNDO
  // =========================

  if (data.background_url) {

    document.body.style.backgroundImage =
      `url(${data.background_url})`;

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
  // REDES
  // =========================

  const socials =
    document.getElementById("socials");

  socials.innerHTML = "";

  function addSocial(
    url,
    iconHTML
  ) {

    if (
      !url ||
      url.trim() === ""
    ) return;

    socials.innerHTML += `
      <a href="${url}" target="_blank">
        ${iconHTML}
      </a>
    `;

  }

  addSocial(
    data.youtube_url,
    `<img src="https://www.riqueza.life/images/socials/youtube.png">`
  );

  addSocial(
    data.instagram_url,
    `<img src="https://www.riqueza.life/images/socials/instagram.png">`
  );

  addSocial(
    data.discord_url,
    `<img src="https://www.riqueza.life/images/socials/discord.png">`
  );

  addSocial(
    data.spotify_url,
    `<img src="https://www.riqueza.life/images/socials/spotify.png">`
  );

  addSocial(
    data.tiktok_url,
    `<img src="https://www.riqueza.life/images/socials/tiktok.png">`
  );

  addSocial(
    data.whatsapp_url,
    `<img src="https://www.riqueza.life/images/socials/whatsapp.png">`
  );

  addSocial(
    data.facebook_url,
    `<img src="https://www.riqueza.life/images/socials/twitch.png">`
  );

  addSocial(
    data.twitter_url,
    `<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg">`
  );

  // =========================
  // CARDS EXTRAS
  // =========================

  const conteudo =
    document.querySelector(".conteudoking");

  document
    .querySelectorAll(".extra-card")
    .forEach(el => el.remove());

  for (let i = 1; i <= 4; i++) {

    const text =
      (data[`extra${i}_text`] || "").trim();

    const image =
      (data[`extra${i}_img`] || "").trim();

    const link =
      (data[`extra${i}_link`] || "").trim();

    if (
      text === "" &&
      image === "" &&
      link === ""
    ) {
      continue;
    }

    const card =
      document.createElement("a");

    card.className =
      "extra-card";

    card.href =
      link || "#";

    card.target =
      "_blank";

    let imageHTML = "";

    if (image !== "") {

      imageHTML = `
        <div class="extra-card-icon">
          <img src="${image}">
        </div>
      `;

    }

    card.innerHTML = `
      ${imageHTML}

      <span>
        ${text || "Card extra"}
      </span>
    `;

    conteudo.appendChild(card);

  }

}

loadProfile();
