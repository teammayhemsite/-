// =========================
// TOGGLE SEÇÕES
// =========================

document.querySelectorAll(".toggle").forEach(btn => {

  btn.addEventListener("click", () => {

    btn.parentElement.classList.toggle("active");

  });

});

const $ = (id) =>
  document.getElementById(id);

// =========================
// INPUTS PERFIL
// =========================

const nameInput =
  $("name-input");

const bioInput =
  $("bio-input");

const avatarFile =
  $("avatar-file");

const bannerFile =
  $("banner-file");

const backgroundFile =
  $("background-file");

const overlayInput =
  $("overlay-input");

const templateInput =
  $("template-input");

const textColorInput =
  $("text-color-input");

const boxStyleInput =
  $("box-style-input");

const musicFile =
  $("music-file");

// =========================
// REDES
// =========================

const youtubeInput =
  $("youtube-input");

const instagramInput =
  $("instagram-input");

const discordInput =
  $("discord-input");

const spotifyInput =
  $("spotify-input");

const tiktokInput =
  $("tiktok-input");

const whatsappInput =
  $("whatsapp-input");

const twitterInput =
  $("twitter-input");

const facebookInput =
  $("facebook-input");

// =========================
// CARDS EXTRAS
// =========================

const cards = [

  {
    t: $("extra1-text"),
    i: $("extra1-img"),
    l: $("extra1-link")
  },

  {
    t: $("extra2-text"),
    i: $("extra2-img"),
    l: $("extra2-link")
  },

  {
    t: $("extra3-text"),
    i: $("extra3-img"),
    l: $("extra3-link")
  },

  {
    t: $("extra4-text"),
    i: $("extra4-img"),
    l: $("extra4-link")
  }

];

// =========================
// UPLOAD SUPABASE
// =========================

async function uploadImage(
  file,
  userId,
  type,
  oldUrl = null
) {

  // REMOVE ANTIGA
  if (oldUrl) {

    try {

      const parts =
        oldUrl.split("/images/");

      if (parts[1]) {

        const oldPath =
          parts[1]
            .split("?")[0];

        console.log(
          "REMOVENDO:",
          oldPath
        );

        await supabaseClient
          .storage
          .from("images")
          .remove([oldPath]);

      }

    } catch (e) {

      console.log(
        "Erro removendo:",
        e
      );

    }

  }

  // EXTENSÃO
  const fileExt =
    file.name
      .split(".")
      .pop();

  // NOVO CAMINHO
  const filePath =
    `users/${userId}/${type}-${Date.now()}.${fileExt}`;

  // UPLOAD
  const { error } =
    await supabaseClient
      .storage
      .from("images")
      .upload(filePath, file);

  if (error) {

    console.log(error);
    return null;

  }

  // URL
  const { data } =
    supabaseClient
      .storage
      .from("images")
      .getPublicUrl(filePath);

  return `${data.publicUrl}?v=${Date.now()}`;

}

async function uploadMusic(
  file,
  userId,
  oldUrl = null
) {

  // REMOVE ANTIGA
  if (oldUrl) {

    try {

      const parts =
        oldUrl.split("/images/");

      if (parts[1]) {

        const oldPath =
          parts[1]
            .split("?")[0];

        await supabaseClient
          .storage
          .from("images")
          .remove([oldPath]);

      }

    } catch (e) {

      console.log(e);

    }

  }

  const fileExt =
    file.name
      .split(".")
      .pop();

  const filePath =
    `users/${userId}/music-${Date.now()}.${fileExt}`;

  const { error } =
    await supabaseClient
      .storage
      .from("images")
      .upload(filePath, file);

  if (error) {

    console.log(error);
    return null;

  }

  const { data } =
    supabaseClient
      .storage
      .from("images")
      .getPublicUrl(filePath);

  return `${data.publicUrl}?v=${Date.now()}`;

}

// =========================
// PREVIEW
// =========================

function updatePreview() {

  const previewCard =
    document.querySelector(".cardking");

  if (
    boxStyleInput.value ===
    "transparent"
  ) {

    previewCard.style.backdropFilter =
      "blur(1px)";

  } else {

    previewCard.style.backdropFilter =
      "blur(18px)";

  }

  previewCard.style.setProperty(
    "--text-color",
    textColorInput.value
  );

  document.body.classList.remove(
    "cardking-theme",
    "cardkingdois-theme",
    "template3-theme",
    "template4-theme"
  );

  document.body.classList.add(

    templateInput.value ===
      "cardkingdois"

      ? "cardkingdois-theme"

      : templateInput.value === "template3"
        ? "template3-theme"
        : templateInput.value === "template4"
          ? "template4-theme"
          : "cardking-theme"

  );

  $("preview-name").innerText =
    nameInput.value || "Nome";

  $("preview-bio").innerText =
    bioInput.value || "Bio";

  // AVATAR
  if (avatarFile.files[0]) {

    $("preview-avatar").src =
      URL.createObjectURL(
        avatarFile.files[0]
      );

  }

  // BANNER
  if (bannerFile.files[0]) {

    $("preview-banner")
      .style.backgroundImage =

      `url(${URL.createObjectURL(
        bannerFile.files[0]
      )
      })`;

  }

  // FUNDO
  if (backgroundFile.files[0]) {

    document.body.style.backgroundImage =

      `url(${URL.createObjectURL(
        backgroundFile.files[0]
      )
      })`;

    document.body.style.backgroundSize =
      "cover";

  }

  // BALÃO
  const balao =
    $("preview-overlay");

  if (
    overlayInput.value.trim()
  ) {

    balao.style.display =
      "block";

    balao.innerText =
      overlayInput.value;

  } else {

    balao.style.display =
      "none";

  }

  // EXTRAS
  const container =
    $("extras-container");

  container.innerHTML = "";

  cards.forEach(c => {

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

        <img src="${c.i.value ||
      "https://via.placeholder.com/55"
      }">

      </div>

      <span>
        ${c.t.value || ""}
      </span>

    `;

    container.appendChild(card);

  });

}

// =========================
// LIVE PREVIEW
// =========================

document
  .querySelectorAll(
    "input, textarea, select"
  )
  .forEach(el => {

    el.addEventListener(
      "input",
      updatePreview
    );

  });

// =========================
// CARREGAR DASHBOARD
// =========================

async function loadDashboard() {

  const {
    data: { user }
  } = await supabaseClient
    .auth
    .getUser();

  if (!user) return;

  const { data } =
    await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

  if (!data) return;

  nameInput.value =
    data.display_name || "";

  bioInput.value =
    data.bio || "";

  overlayInput.value =
    data.balao || "";

  templateInput.value =
    data.template || "cardking";

  boxStyleInput.value =
    data.box_style || "blur";

  textColorInput.value =
    data.text_color || "white";

  youtubeInput.value =
    data.youtube_url || "";

  instagramInput.value =
    data.instagram_url || "";

  discordInput.value =
    data.discord_url || "";

  spotifyInput.value =
    data.spotify_url || "";

  tiktokInput.value =
    data.tiktok_url || "";

  whatsappInput.value =
    data.whatsapp_url || "";

  twitterInput.value =
    data.twitter_url || "";

  facebookInput.value =
    data.facebook_url || "";

  entranceEnabled.value =
    data.entrance_enabled
      ? "true"
      : "false";

  entranceText.value =
    data.entrance_text || "";

  cards.forEach((c, i) => {

    c.t.value =
      data[`extra${i + 1}_text`] || "";

    c.i.value =
      data[`extra${i + 1}_img`] || "";

    c.l.value =
      data[`extra${i + 1}_link`] || "";

  });

  updatePreview();

}

loadDashboard();

// =========================
// SALVAR PERFIL
// =========================

$("save-btn")
  .addEventListener(
    "click",
    async () => {

      const {
        data: { user }
      } = await supabaseClient
        .auth
        .getUser();

      if (!user) return;

      const username =
        user.email
          .split("@")[0]
          .toLowerCase();

      const { data: old } =
        await supabaseClient
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

      let avatarUrl =
        old?.avatar_url || "";

      let bannerUrl =
        old?.banner_url || "";

      let backgroundUrl =
        old?.background_url || "";

      let musicUrl =
        old?.music_url || "";

      // AVATAR
      if (avatarFile.files[0]) {

        const uploaded =
          await uploadImage(
            avatarFile.files[0],
            user.id,
            "avatar",
            old?.avatar_url
          );

        if (uploaded)
          avatarUrl = uploaded;

      }

      // BANNER
      if (bannerFile.files[0]) {

        const uploaded =
          await uploadImage(
            bannerFile.files[0],
            user.id,
            "banner",
            old?.banner_url
          );

        if (uploaded)
          bannerUrl = uploaded;

      }

      // BACKGROUND
      if (backgroundFile.files[0]) {

        const uploaded =
          await uploadImage(
            backgroundFile.files[0],
            user.id,
            "background",
            old?.background_url
          );

        if (uploaded)
          backgroundUrl = uploaded;

      }

      // MUSIC
      if (musicFile.files[0]) {

        const uploaded =
          await uploadMusic(
            musicFile.files[0],
            user.id,
            old?.music_url
          );

        if (uploaded)
          musicUrl = uploaded;

      }

      const payload = {

        id: user.id,
        username,

        display_name:
          nameInput.value,

        bio:
          bioInput.value,

        avatar_url:
          avatarUrl,

        banner_url:
          bannerUrl,

        background_url:
          backgroundUrl,

        music_url:
          musicUrl,

        balao:
          overlayInput.value,

        text_color:
          textColorInput.value,

        template:
          templateInput.value,

        box_style:
          boxStyleInput.value,

        youtube_url:
          youtubeInput.value,

        instagram_url:
          instagramInput.value,

        discord_url:
          discordInput.value,

        spotify_url:
          spotifyInput.value,

        tiktok_url:
          tiktokInput.value,

        whatsapp_url:
          whatsappInput.value,

        twitter_url:
          twitterInput.value,

        facebook_url:
          facebookInput.value,

        entrance_enabled:
          entranceEnabled.value === "true",

        entrance_text:
          entranceText.value

      };

      cards.forEach((c, i) => {

        payload[
          `extra${i + 1}_text`
        ] = c.t.value;

        payload[
          `extra${i + 1}_img`
        ] = c.i.value;

        payload[
          `extra${i + 1}_link`
        ] = c.l.value;

      });

      const { error } =
        await supabaseClient
          .from("profiles")
          .upsert(payload);

      if (error) {

        alert(error.message);
        return;

      }

      alert(
        "Perfil salvo com sucesso!"
      );

      window.location.href =
        `/${username}`;

    }
  );
