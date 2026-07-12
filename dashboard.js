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

const cardBackgroundFile =
  $("card-background-file");

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

const entranceEnabled =
  $("entrance-enabled");

const entranceText =
  $("entrance-text");

const album1File =
  $("album1-file");
const album2File =
  $("album2-file");
const album3File =
  $("album3-file");
const album4File =
  $("album4-file");

const viewProfileBtn = $("view-profile-btn");

let selectedFrame = "";

document.querySelectorAll(".frame-card")
  .forEach(card => {

    card.addEventListener("click", () => {

      document
        .querySelectorAll(".frame-card")
        .forEach(c =>
          c.classList.remove("selected")
        );

      card.classList.add("selected");

      selectedFrame =
        card.dataset.frame;

      updatePreview();

      console.log(
        "Moldura selecionada:",
        selectedFrame
      );

    });

  });

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

const telegramInput =
  $("telegram-input");

const githubInput =
  $("github-input");

const linkedinInput =
  $("linkedin-input");

const kickInput =
  $("kick-input");

const robloxInput =
  $("roblox-input");

const steamInput =
  $("steam-input");

const xboxInput =
  $("xbox-input");

const twitchInput =
  $("twitch-input");

const privacyInput =
  $("privacy-input");

const onlyfansInput =
  $("onlyfans-input");

const fivemInput =
  $("fivem-input");

const pinterestInput =
  $("pinterest-input");

const emailInput =
  $("email-input");

const threadsInput =
  $("threads-input");

const bskyInput =
  $("bsky-input");

const vscoInput =
  $("vsco-input");

const pixInput =
  $("pix-input");

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

let saving = false;

$("save-btn")
  .addEventListener(
    "click",
    async () => {

      if (saving) return;

      saving = true;

      const btn = $("save-btn");
      btn.disabled = true;

      try {

        const {
          data: { user }
        } = await supabaseClient
          .auth
          .getUser();

        if (!user) throw new Error("Usuário não encontrado");

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

        let cardBackgroundUrl =
          old?.card_background_url || "";

        let musicUrl =
          old?.music_url || "";

        let album1Url = old?.album1_url || "";
        let album2Url = old?.album2_url || "";
        let album3Url = old?.album3_url || "";
        let album4Url = old?.album4_url || "";

        // REMOÇÕES

        if (removeAvatar)
          avatarUrl = "";

        if (removeBanner)
          bannerUrl = "";

        if (removeBackground)
          backgroundUrl = "";

        if (removeCardBackground)
          cardBackgroundUrl = "";

        if (removeMusic)
          musicUrl = "";

        if (removeAlbum1)
          album1Url = "";

        if (removeAlbum2)
          album2Url = "";

        if (removeAlbum3)
          album3Url = "";

        if (removeAlbum4)
          album4Url = "";

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

        // CARD BACKGROUND
        if (cardBackgroundFile.files[0]) {

          const uploaded =
            await uploadImage(
              cardBackgroundFile.files[0],
              user.id,
              "cardbackground",
              old?.card_background_url
            );

          if (uploaded)
            cardBackgroundUrl = uploaded;

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

        if (album1File.files[0]) {
          const uploaded = await uploadImage(
            album1File.files[0],
            user.id,
            "album1"
          );

          if (uploaded) album1Url = uploaded;
        }

        if (album2File.files[0]) {
          const uploaded = await uploadImage(
            album2File.files[0],
            user.id,
            "album2"
          );

          if (uploaded) album2Url = uploaded;
        }

        if (album3File.files[0]) {
          const uploaded = await uploadImage(
            album3File.files[0],
            user.id,
            "album3"
          );

          if (uploaded) album3Url = uploaded;
        }

        if (album4File.files[0]) {
          const uploaded = await uploadImage(
            album4File.files[0],
            user.id,
            "album4"
          );

          if (uploaded) album4Url = uploaded;
        }

        const payload = {

          id: user.id,
          username,

          display_name:
            nameInput.value,

          frame_url:
            selectedFrame,

          bio:
            bioInput.value,

          avatar_url:
            avatarUrl,

          banner_url:
            bannerUrl,

          background_url:
            backgroundUrl,

          card_background_url:
            cardBackgroundUrl,

          music_url:
            musicUrl,

          album1_url: album1Url,
          album2_url: album2Url,
          album3_url: album3Url,
          album4_url: album4Url,

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

          telegram_url:
            telegramInput.value,

          github_url:
            githubInput.value,

          linkedin_url:
            linkedinInput.value,

          kick_url:
            kickInput.value,

          roblox_url:
            robloxInput.value,

          steam_url:
            steamInput.value,

          //---

          xbox_url:
            xboxInput.value,

          twitch_url:
            twitchInput.value,

          privacy_url:
            privacyInput.value,

          onlyfans_url:
            onlyfansInput.value,

          fivem_url:
            fivemInput.value,

          pinterest_url:
            pinterestInput.value,

          email_url:
            emailInput.value,

          threads_url:
            threadsInput.value,

          bsky_url:
            bskyInput.value,

          vsco_url:
            vscoInput.value,

          pix_url:
            pixInput.value,

          entrance_enabled:
            entranceEnabled.value === "true",

          entrance_text:
            entranceText.value,

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


        if (removeAvatar && old?.avatar_url) {
          try {
            const oldPath = old.avatar_url
              .split("/images/")[1]
              ?.split("?")[0];

            if (oldPath) {
              await supabaseClient
                .storage
                .from("images")
                .remove([oldPath]);
            }
          } catch (e) {
            console.log(e);
          }
        }

        if (removeBanner && old?.banner_url) {
          try {
            const oldPath = old.banner_url
              .split("/images/")[1]
              ?.split("?")[0];

            if (oldPath) {
              await supabaseClient
                .storage
                .from("images")
                .remove([oldPath]);
            }
          } catch (e) {
            console.log(e);
          }
        }

        if (removeBackground && old?.background_url) {
          try {
            const oldPath = old.background_url
              .split("/images/")[1]
              ?.split("?")[0];

            if (oldPath) {
              await supabaseClient
                .storage
                .from("images")
                .remove([oldPath]);
            }
          } catch (e) {
            console.log(e);
          }
        }

        if (removeCardBackground && old?.card_background_url) {
          try {
            const oldPath = old.card_background_url
              .split("/images/")[1]
              ?.split("?")[0];

            if (oldPath) {
              await supabaseClient
                .storage
                .from("images")
                .remove([oldPath]);
            }
          } catch (e) {
            console.log(e);
          }
        }

        if (removeMusic && old?.music_url) {
          try {
            const oldPath = old.music_url
              .split("/images/")[1]
              ?.split("?")[0];

            if (oldPath) {
              await supabaseClient
                .storage
                .from("images")
                .remove([oldPath]);
            }
          } catch (e) {
            console.log(e);
          }
        }

        if (removeAlbum1 && old?.album1_url) {
          try {

            const oldPath = old.album1_url
              .split("/images/")[1]
              ?.split("?")[0];

            if (oldPath) {

              await supabaseClient
                .storage
                .from("images")
                .remove([oldPath]);

            }

          } catch (e) {
            console.log(e);
          }
        }

        if (removeAlbum2 && old?.album2_url) {
          try {

            const oldPath = old.album2_url
              .split("/images/")[1]
              ?.split("?")[0];

            if (oldPath) {

              await supabaseClient
                .storage
                .from("images")
                .remove([oldPath]);

            }

          } catch (e) {
            console.log(e);
          }
        }

        if (removeAlbum3 && old?.album3_url) {
          try {

            const oldPath = old.album3_url
              .split("/images/")[1]
              ?.split("?")[0];

            if (oldPath) {

              await supabaseClient
                .storage
                .from("images")
                .remove([oldPath]);

            }

          } catch (e) {
            console.log(e);
          }
        }

        if (removeAlbum4 && old?.album4_url) {
          try {

            const oldPath = old.album4_url
              .split("/images/")[1]
              ?.split("?")[0];

            if (oldPath) {

              await supabaseClient
                .storage
                .from("images")
                .remove([oldPath]);

            }

          } catch (e) {
            console.log(e);
          }
        }


        const { error } =
          await supabaseClient
            .from("profiles")
            .upsert(payload);

        if (error) {

          alert(error.message);
          return;

        }

        btn.textContent = "PERFIL SALVO COM SUCESSO!";

        setTimeout(() => {
          btn.textContent = "SALVAR PERFIL NOVAMENTE";
        }, 2000);

        removeAvatar = false;
        removeBanner = false;
        removeBackground = false;
        removeCardBackground = false;
        removeMusic = false;

        removeAlbum1 = false;
        removeAlbum2 = false;
        removeAlbum3 = false;
        removeAlbum4 = false;

      } catch (error) {

        console.error(error);
        alert(error.message);

      } finally {
        saving = false;
        btn.disabled = false;
      }

    }
  );

async function uploadImage(
  file,
  userId,
  type,
  oldUrl = null
) {

  // Remove versões antigas

  await supabaseClient
    .storage
    .from("images")
    .remove([
      `users/${userId}/${type}.jpg`,
      `users/${userId}/${type}.jpeg`,
      `users/${userId}/${type}.png`,
      `users/${userId}/${type}.gif`,
      `users/${userId}/${type}.webp`
    ]);

  // EXTENSÃO
  const fileExt =
    file.name
      .split(".")
      .pop();

  // NOVO CAMINHO
  const filePath =
    `users/${userId}/${type}.${fileExt}`;

  // UPLOAD
  const { error } =
    await supabaseClient
      .storage
      .from("images")
      .upload(filePath, file, {
        upsert: true
      });

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

  await supabaseClient
    .storage
    .from("images")
    .remove([
      `users/${userId}/music.mp3`,
      `users/${userId}/music.wav`,
      `users/${userId}/music.ogg`,
      `users/${userId}/music.m4a`
    ]);

  const fileExt =
    file.name
      .split(".")
      .pop();

  const filePath =
    `users/${userId}/music.${fileExt}`;

  const { error } =
    await supabaseClient
      .storage
      .from("images")
      .upload(filePath, file, {
        upsert: true
      });

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

  else if (!$("preview-avatar").src) {
    $("preview-avatar").src = "";
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

  const framePreview =
    $("preview-frame");

  if (selectedFrame) {

    framePreview.src =
      selectedFrame;

    framePreview.style.display =
      "block";

  } else {

    framePreview.style.display =
      "none";

  }

  if (cardBackgroundFile.files[0]) {

    previewCard.style.backgroundImage =
      `url(${URL.createObjectURL(
        cardBackgroundFile.files[0]
      )})`;

    previewCard.style.backgroundSize =
      "cover";

    previewCard.style.backgroundPosition =
      "center";

  }

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

  const username =
    user.email
      .split("@")[0]
      .toLowerCase();

  $("profile-url").value =
    `${window.location.host}/${username}`;

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

  telegramInput.value =
    data.telegram_url || "";

  githubInput.value =
    data.github_url || "";

  linkedinInput.value =
    data.linkedin_url || "";

  kickInput.value =
    data.kick_url || "";

  robloxInput.value =
    data.roblox_url || "";

  steamInput.value =
    data.steam_url || "";

  xboxInput.value =
    data.xbox_url || "";

  twitchInput.value =
    data.twitch_url || "";

  privacyInput.value =
    data.privacy_url || "";

  onlyfansInput.value =
    data.onlyfans_url || "";

  fivemInput.value =
    data.fivem_url || "";

  pinterestInput.value =
    data.pinterest_url || "";

  emailInput.value =
    data.email_url || "";

  threadsInput.value =
    data.threads_url || "";

  bskyInput.value =
    data.bsky_url || "";

  vscoInput.value =
    data.vsco_url || "";

  pixInput.value =
    data.pix_url || "";

  selectedFrame =
    data.frame_url || "";

  document
    .querySelectorAll(".frame-card")
    .forEach(card => {

      card.classList.remove("selected");

      if (
        card.dataset.frame ===
        selectedFrame
      ) {

        card.classList.add("selected");

      }

    });

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

  if (data.card_background_url) {

    document.querySelector(".cardking")
      .style.backgroundImage =
      `url(${data.card_background_url})`;

  }

  if (data.avatar_url) {
    $("preview-avatar").src = data.avatar_url;
  }

  if (data.banner_url) {
    $("preview-banner").style.backgroundImage =
      `url(${data.banner_url})`;
  }

  if (data.background_url) {
    document.body.style.backgroundImage =
      `url(${data.background_url})`;
    document.body.style.backgroundSize = "cover";
  }

  if (data.card_background_url) {
    document.querySelector(".cardking").style.backgroundImage =
      `url(${data.card_background_url})`;
  }

  updatePreview();

}

// =========================
// REMOVER ARQUIVOS
// =========================

let removeAvatar = false;
let removeBanner = false;
let removeBackground = false;
let removeMusic = false;
let removeCardBackground = false;
let removeAlbum1 = false;
let removeAlbum2 = false;
let removeAlbum3 = false;
let removeAlbum4 = false;

$("remove-avatar")?.addEventListener(
  "click",
  () => {

    avatarFile.value = "";

    $("preview-avatar").src = "";

    removeAvatar = true;

    updatePreview();

  }
);

$("remove-banner")?.addEventListener(
  "click",
  () => {

    bannerFile.value = "";

    $("preview-banner").style.backgroundImage = "";

    removeBanner = true;

    updatePreview();

  }
);

$("remove-background")?.addEventListener(
  "click",
  () => {

    backgroundFile.value = "";

    document.body.style.backgroundImage = "";

    removeBackground = true;

    updatePreview();

  }
);

$("remove-card-background")?.addEventListener(
  "click",
  () => {

    cardBackgroundFile.value = "";

    document.querySelector(".cardking")
      .style.backgroundImage = "";

    removeCardBackground = true;

    updatePreview();

  }
);

$("remove-music")?.addEventListener(
  "click",
  () => {

    musicFile.value = "";

    removeMusic = true;

    updatePreview();

  }
);

$("remove-album1")?.addEventListener("click", () => {

  album1File.value = "";
  removeAlbum1 = true;

});

$("remove-album2")?.addEventListener("click", () => {

  album2File.value = "";
  removeAlbum2 = true;

});

$("remove-album3")?.addEventListener("click", () => {

  album3File.value = "";
  removeAlbum3 = true;

});

$("remove-album4")?.addEventListener("click", () => {

  album4File.value = "";
  removeAlbum4 = true;

});

// =========================
// NAVEGAÇÃO DE PÁGINAS
// =========================

const pageTitles = {
  perfil: "Identidade",
  album: "Álbum",
  moldura: "Moldura",
  template: "Aparência",
  redes: "Redes sociais",
  extras: "Cards extras",
};

document.querySelectorAll(".nav-item[data-page]").forEach(btn => {

  btn.addEventListener("click", () => {

    const page = btn.dataset.page;

    document
      .querySelectorAll(".nav-item[data-page]")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    document
      .querySelectorAll(".page")
      .forEach(p => p.classList.remove("active"));

    document
      .querySelector(`.page[data-page="${page}"]`)
      ?.classList.add("active");

    const title = $("page-title");

    if (title)
      title.textContent = pageTitles[page] || "";

    $("content-scroll")?.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });

});

// =========================
// RESUMO
// =========================

function frameLabel(url) {

  if (!url) return "Nenhuma";

  const match = document.querySelector(
    `.frame-card[data-frame="${CSS.escape(url)}"] span`
  );

  return match ? match.textContent.trim() : "Personalizada";

}

const socialInputsList = [
  youtubeInput, instagramInput, discordInput, spotifyInput, tiktokInput,
  whatsappInput, twitterInput, facebookInput, telegramInput, githubInput,
  linkedinInput, kickInput, robloxInput, steamInput, xboxInput, twitchInput,
  privacyInput, onlyfansInput, fivemInput, pinterestInput, emailInput,
  threadsInput, bskyInput, vscoInput, pixInput
];

function updateSummary() {

  const summaryName = $("summary-name");

  if (!summaryName) return;

  summaryName.textContent =
    nameInput.value || "Sem nome";

  $("summary-template").textContent =
    templateInput.options[templateInput.selectedIndex]?.text.trim() || "—";

  $("summary-frame").textContent =
    frameLabel(selectedFrame);

  $("summary-color").textContent =
    textColorInput.value === "black" ? "Preto" : "Branco";

  const connected =
    socialInputsList.filter(i => i.value.trim()).length;

  $("summary-socials").textContent =
    `${connected} conectada${connected === 1 ? "" : "s"}`;

  const entranceLabel = $("summary-entrance");

  if (entranceLabel)
    entranceLabel.textContent =
      entranceEnabled.value === "true" ? "Ativada" : "Desativada";

}

document
  .querySelectorAll("input, textarea, select")
  .forEach(el => el.addEventListener("input", updateSummary));

document
  .querySelectorAll(".frame-card")
  .forEach(card => card.addEventListener("click", updateSummary));

// =========================
// CARREGAR DASHBOARD
// =========================

loadDashboard().then(async () => {

  updateSummary();

  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (!user) return;

  const username =
    user.email.split("@")[0].toLowerCase();

  const sidebarName = $("sidebar-username");

  if (sidebarName)
    sidebarName.textContent = "@" + username;

});


$("copy-profile-url")
  ?.addEventListener(
    "click",
    async () => {

      const {
        data: { user }
      } = await supabaseClient.auth.getUser();

      if (!user) return;

      const username =
        user.email
          .split("@")[0]
          .toLowerCase();

      const fullUrl =
        `${window.location.origin}/${username}`;

      await navigator.clipboard.writeText(fullUrl);

      const btn =
        $("copy-profile-url");

      btn.textContent = "Copiado!";

      setTimeout(() => {
        btn.textContent = "Copiar";
      }, 2000);

    }
  );

viewProfileBtn.addEventListener("click", async () => {

  const { data: { user } } =
    await supabaseClient.auth.getUser();

  if (!user) return;

  const username =
    user.email.split("@")[0].toLowerCase();

  window.location.href = `/${username}`;

});
