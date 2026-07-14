function showNotFound() {

  document.body.innerHTML = `

    <div class="notfound-page">

      <div class="notfound-overlay"></div>

      <div class="notfound-content">

        <img
          class="astronaut"
          src="https://i.pinimg.com/originals/42/c6/2a/42c62a68fa0154599d1da42a43ac6dcd.gif"
        >

        <div class="notfound-text">

          <h2>Oops!</h2>

          <h1>404</h1>

          <p>
            Perfil não encontrado<br>
            ou inexistente.
          </p>

          <a href="https://teammayhem.vercel.app" class="back-home">
            Voltar ao início
          </a>
          <br>
          <br>
          <br>
          <a href="https://teammayhem.vercel.app/cadastro.html" class="back-home">
            Criar perfil
          </a>
        </div>

      </div>

    </div>

  `;

}

async function loadProfile() {

  let visitorId =
    localStorage.getItem(
      "visitor_id"
    );

  if (!visitorId) {

    visitorId =
      crypto.randomUUID();

    localStorage.setItem(
      "visitor_id",
      visitorId
    );

  }

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

    showNotFound();

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

    showNotFound();

    return;

  }

  // =========================
  // EFEITO DE FUNDO
  // =========================

  const effectCanvas =
    document.getElementById("profile-effect-canvas");

  if (effectCanvas && window.ProfileEffects) {

    window.ProfileEffects.start(effectCanvas, data.effect);

  }

  const entranceAvatar =
    document.getElementById(
      "entrance-avatar"
    );

  if (entranceAvatar) {

    entranceAvatar.src =
      data.avatar_url ||
      "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/defaults/avatar.png";

  }

  const card =
    document.querySelector(".cardking");

  if (data.card_background_url) {

    card.style.backgroundImage =
      `url(${data.card_background_url})`;

    card.style.backgroundSize =
      "cover";

    card.style.backgroundPosition =
      "center";

  }

  //=================
  // Emblemas
  //================
  if (data.username === "krpris" || data.username === "kaio") {

    card.insertAdjacentHTML(
      "afterbegin",
      `
    <div class="embking">
      <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"></path>
      <path d="M5 21h14"></path>
    </svg> OWNER
    </div>
    `
    );

  }

  if (data.username === "szn" || data.username === "phz_062") {

    card.insertAdjacentHTML(
      "afterbegin",
      `
    <div class="embblack">
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" width="18" height="18" class="fill-[#95B806] drop-shadow-[0_0_3.5px_#95B80675]"><path d="M135 187.9c-4 8-7.3 15.8-15 20.9-4 2.6-4.3 7.6-2 11.6 3.7 6.3 1 10.8-3 13.9a46 46 0 0 1-48 6.5c-13-5.5-25.7-12.6-35.9-23.1-5.6-5.9-11-12-17.2-17-5.8-4.9-5.5-10.5-4.4-16.7a305 305 0 0 1 3.5-16.8c2.6-10.7-.1-21-2.5-31.2-4.3-18.1-9.4-36-8.6-55a52 52 0 0 1 13.4-32.7 66 66 0 0 1 57.5-23.2 78 78 0 0 1 51 22.3c2.7 2.7 5.3 3.7 9 3.7 16.6-.2 33 .1 49.6-.2 13-.2 24 5 35.5 12.3-3 1.7-5.6 2.7-7.7 4.2-9.7 7-20.6 8-32.1 7.7-10.8-.4-21.6-.1-33-.1l1.3 3.9c4.4 11.5 7 22.7 2 35.2a45 45 0 0 0-.2 21c1.2 7.8-.7 14.8-3.1 22l-10 30.8M58 41.4l-.5-5.6c-2.5 3.4-3.7 6.7-6 7.7s-5.4-.3-8.8-.7C42.3 44 41.3 46 41 48c-.5 4.2-2.6 5.1-6.5 4.3-2.3-.5-4.9 0-8 0 1 2.7 1.4 4.3 2 5.7 2.3 5.6 1.9 6.4-3.8 8-1.6.4-3 1.3-5.5 2.4 2.3 1.2 3.5 2.1 4.9 2.4 4 .6 10-.2 9.4 5.2-.6 5.6 6 5.3 5.5 9.9-.2 1.5.5 3.2 1 4.7q1 2.7 2.5 5.9l7.4-6.8 2.7 2.4 2.5 2.5c3.8 3.3 6 3.2 8.6-1 2-3.6 4.6-5.4 8.8-4.7h4.8q.5-1.3.5-1.8-1.8-8 6.5-7.3c1.5 0 3.1-1 5-1.5l-7.1-7.8 9.3-7.6c-1.8-1-3-1.4-4-2.2-4.4-3.3-10.2-4.8-12.3-11-2.7-8-2.9-7.9-11-5.5-2.5.8-5.3 2-6.3-2.9m42.1 80.6c3-1.4 6.4-2.4 9.2-4.2 6-3.8 6-8.9 1-14-7-7.4-19.5-5-26.2-1.5-5.4 3-7 10.2-2 14.7 5.3 4.6 11 5 18 5m21.5 60c2.3-.7 6-.7 6.6-2.2 2.5-5.1 4-10.8 6-16.8-7 0-13.2-.6-19.2.2-4.7.6-9.3 2.9-13.7 4.8q-4 2-.5 5.4a30 30 0 0 0 20.8 8.6m14-72.9c-5.1 6.6-4 12.6 2.8 15l2.6-18.3zM250 65.8c-1.2 1.3-2.3 3-3.4 3q-9 .4-18 .1c-4.5-.1-5.3-2.2-4-9.9H246c4.4 0 4.3 3.2 4 6.8m-14.2 15.5c5.5 5.5 5.6 5.9 1.3 10.2-.7.6-2.8 1-3.4.5-4.1-3.5-8.5-7-12-11.1-1.2-1.6-1-5.3-.2-7.4 1-2.3 3.5-3.4 6-.6q3.8 4 8.3 8.4m-15.6-34q4.3-4 8-8c3-3.8 5.6-2 8.4 0 3.4 2.6.2 4.7-1 6.2q-4.5 5.6-10.1 10.2c-1 .7-4-.4-5.6-1.5q-4-3 .3-6.9M211 84.7c-.5-4.2 2.6-5 5-6 .8-.1 2.5 2.1 3.5 3.4 1.2 1.6 2.9 3.4 2.9 5 0 2.1-1.3 4.4-2.6 6.2-.3.4-3.5-.5-4.5-1.6-1.7-1.9-2.8-4.4-4.2-7m-1.5-44q1.6-2.8 3.2-4.8c.8-.8 2.8-1.5 3.5-1 1.5 1 3.7 3 3.4 4-1 3.6-2.9 7-4.4 10.4-8.2-3.5-8.3-3.6-5.7-8.6"></path></svg>
     BLACK
    </div>
    `
    );

  }

  if (data.username === "bot") {

    card.insertAdjacentHTML(
      "afterbegin",
      `
    <div class="embblack">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" class="fill-theme drop-shadow-theme"><path d="M23.334 11.96c-.713-.726-.872-1.829-.393-2.727.342-.64.366-1.401.064-2.062-.301-.66-.893-1.142-1.601-1.302-.991-.225-1.722-1.067-1.803-2.081-.059-.723-.451-1.378-1.062-1.77-.609-.393-1.367-.478-2.05-.229-.956.347-2.026.032-2.642-.776-.44-.576-1.124-.915-1.85-.915-.725 0-1.409.339-1.849.915-.613.809-1.683 1.124-2.639.777-.682-.248-1.44-.163-2.05.229-.61.392-1.003 1.047-1.061 1.77-.082 1.014-.812 1.857-1.803 2.081-.708.16-1.3.642-1.601 1.302s-.277 1.422.065 2.061c.479.897.32 2.001-.392 2.727-.509.517-.747 1.242-.644 1.96s.536 1.347 1.17 1.7c.888.495 1.352 1.51 1.144 2.505-.147.71.044 1.448.519 1.996.476.549 1.18.844 1.902.798 1.016-.063 1.953.54 2.317 1.489.259.678.82 1.195 1.517 1.399.695.204 1.447.072 2.031-.357.819-.603 1.936-.603 2.754 0 .584.43 1.336.562 2.031.357.697-.204 1.258-.722 1.518-1.399.363-.949 1.301-1.553 2.316-1.489.724.046 1.427-.249 1.902-.798.475-.548.667-1.286.519-1.996-.207-.995.256-2.01 1.145-2.505.633-.354 1.065-.982 1.169-1.7s-.135-1.443-.643-1.96zm-12.584 5.43l-4.5-4.364 1.857-1.857 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.642z"></path></svg>
      BOT's
    </div>
    `
    );

  }


  //=================
  // Final Emblemas
  //================

//=================
// Album
//=================

const albumImages = [
  data.album1_url,
  data.album2_url,
  data.album3_url,
  data.album4_url
];

const albumImgEls =
  document.querySelectorAll(".album-grid img");

albumImgEls.forEach((img, index) => {

  const url = albumImages[index];

  // Não define src ainda — só reserva o slot.
  // O download real só acontece quando o álbum é aberto (ver loadAlbumImages abaixo).
  img.style.display =
    url ? "block" : "none";

});

const visiblePhotos =
  albumImages.filter(url => !!url);

const hasAlbum =
  visiblePhotos.length > 0;

const albumGrid =
  document.querySelector(".album-grid");

if (
  albumGrid &&
  visiblePhotos.length === 1
) {

  albumGrid.style.gridTemplateColumns =
    "1fr";

}

let albumLoaded = false;

function loadAlbumImages() {

  if (albumLoaded) return;
  albumLoaded = true;

  albumImgEls.forEach((img, index) => {

    const url = albumImages[index];

    if (url) img.src = url;

  });

}

//=================
// Final Album
//=================

  const likeBtn =
    document.getElementById(
      "like-btn"
    );

  const likeCount =
    document.getElementById(
      "like-count"
    );

  // =========================
  // CURTIDAS
  // =========================

  const { count } =
    await supabaseClient
      .from("profile_likes")
      .select("*", {
        count: "exact",
        head: true
      })
      .eq("profile_id", data.id);

  likeCount.textContent =
    count || 0;

  // =========================
  // VERIFICA SE JÁ CURTIU
  // =========================

  const { data: alreadyLiked } =
    await supabaseClient
      .from("profile_likes")
      .select("id")
      .eq("profile_id", data.id)
      .eq("visitor_id", visitorId)
      .maybeSingle();

  if (alreadyLiked) {

    likeBtn.classList.add(
      "liked"
    );

  }

  // =========================
  // CURTIR
  // =========================

  likeBtn.onclick =
    async () => {

      console.log("CLICOU");

      if (
        likeBtn.classList.contains(
          "liked"
        )
      ) {
        return;
      }

      const result =
        await supabaseClient
          .from("profile_likes")
          .insert({
            profile_id: data.id,
            visitor_id: visitorId
          });

      console.log(result);

      if (error) {

        console.error(error);

        return;

      }

      likeBtn.classList.add(
        "liked"
      );

      likeCount.textContent =
        Number(
          likeCount.textContent
        ) + 1;

    };

  const entrance =
    document.getElementById(
      "entrance-screen"
    );

  if (!data.entrance_enabled) {

    entrance.style.display =
      "none";

  }


  else {

    document.getElementById(
      "entrance-title"
    ).innerText =

      data.entrance_text?.trim()

      ||

      data.display_name

      ||

      data.username;

  }

  if (data.entrance_enabled) {

    entrance.onclick = async () => {

      const audio =
        document.getElementById(
          "profile-music"
        );

      if (audio && data.music_url) {

        try {

          await audio.play();

        } catch (err) {

          console.log(
            "Erro ao tocar:",
            err
          );

        }

      }

      entrance.style.opacity = "0";
      entrance.style.pointerEvents = "none";

      setTimeout(() => {

        entrance.remove();

      }, 500);

    };

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
    "cardkingdois-theme",
    "template3-theme",
    "template4-theme"
  );

  if (
    data.template ===
    "cardkingdois"
  ) {

    document.body.classList.add(
      "cardkingdois-theme"
    );

  } else if (
    data.template ===
    "template3"
  ) {

    document.body.classList.add(
      "template3-theme"
    );

  }

  else if (
    data.template ===
    "template4"
  ) {

    document.body.classList.add(
      "template4-theme"
    );

  }
  else {

    document.body.classList.add(
      "cardking-theme"
    );

  }

  // =========================
  // BOX STYLE
  // =========================

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

    data.avatar_url

      || "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/semfotodeperfil.jpg";

  const frame =
    document.getElementById("avatar-frame");

  if (data.frame_url) {

    frame.src = data.frame_url;
    frame.style.display = "block";

  } else {

    frame.style.display = "none";

  }

  document.getElementById(
    "banner"
  ).style.backgroundImage =

    data.banner_url

      ? `url(${data.banner_url})`

      : "";

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
  // MUSIC PLAYER
  // =========================

  if (data.music_url) {

    const audio =
      document.getElementById(
        "profile-music"
      );

    const pill =
      document.querySelector(
        ".ac2-pill"
      );

    const playBtn =
      document.querySelector(
        ".play-btn"
      );

    const trigger =
      document.querySelector(
        ".ac2-trigger"
      );

    const volume =
      document.querySelector(
        ".ac2-volume"
      );

    pill.classList.add("show");

    audio.src =
      data.music_url;

    audio.volume = 0.1;

    // autoplay

    audio.addEventListener("play", () => {

      trigger.classList.add("playing");

      playBtn.innerHTML =
        `<i class="fas fa-pause"></i>`;

    });

    audio.addEventListener("pause", () => {

      trigger.classList.remove("playing");

      playBtn.innerHTML =
        `<i class="fas fa-play"></i>`;

    });

    // PLAY / PAUSE
    function toggleMusic() {

      if (audio.paused) {

        audio.play();

        trigger.classList.add(
          "playing"
        );

        playBtn.innerHTML =
          `<i class="fas fa-pause"></i>`;

      } else {

        audio.pause();

        trigger.classList.remove(
          "playing"
        );

        playBtn.innerHTML =
          `<i class="fas fa-play"></i>`;

      }

    }

    trigger.onclick =
      toggleMusic;

    playBtn.onclick =
      toggleMusic;

    // volume
    volume.addEventListener(
      "input",
      () => {

        audio.volume =
          volume.value / 100;

      }
    );

  }

  // =========================
  // REDES
  // =========================

  const socials =
    document.getElementById("socials");

  socials.innerHTML = "";

  function addSocial(
    url,
    iconHTML,
    title,
    user
  ) {

    if (
      !url ||
      url.trim() === ""
    ) return;

    // TEMPLATE 3
    if (
      document.body.classList.contains(
        "template3-theme"
      )
    ) {

      socials.innerHTML += `

        <a href="${url}" target="_blank">

          ${iconHTML}

          <div class="social-text">

            <strong>${title}</strong>

            <span>${user || ""}</span>

          </div>

        </a>

      `;

    }

    // TEMPLATE 1 E 2
    else {

      socials.innerHTML += `

        <a href="${url}" target="_blank">

          ${iconHTML}

        </a>

      `;

    }

  }

  addSocial(
    data.youtube_url,
    `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/youtube.png">`,
    "Youtube",
    data.username
  );

  addSocial(
    data.instagram_url,
    `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/instagram.png">`,
    "Instagram",
    data.username
  );

  addSocial(
    data.discord_url,
    `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/discord.png">`,
    "Discord",
    data.username
  );

  addSocial(
    data.spotify_url,
    `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/spotify.png">`,
    "Spotify",
    data.username
  );

  addSocial(
    data.tiktok_url,
    `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/tiktok.png">`,
    "TikTok",
    data.username
  );

  addSocial(
    data.whatsapp_url,
    `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/whatsapp.png">`,
    "WhatsApp",
    data.username
  );

  addSocial(
    data.twitter_url,
    `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/x.png">`,
    "Twitter/X",
    data.username
  );

  addSocial(
    data.facebook_url,
    `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/facebook.png">`,
    "Facebook",
    data.username
  );

  addSocial(
    data.telegram_url,
    `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/telegram.png">`,
    "Telegram",
    data.username
  );

  addSocial(
    data.github_url,
    `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/github.png">`,
    "GitHub",
    data.username
  );

  addSocial(
    data.linkedin_url,
    `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/linkedin.png">`,
    "LinkedIn",
    data.username
  );

  addSocial(
    data.kick_url,
    `<img src="https://cdn.simpleicons.org/kick">`,
    "Kick",
    data.username
  );

  addSocial(
    data.roblox_url,
    `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/roblox.png">`,
    "Roblox",
    data.username
  );

  addSocial(
    data.steam_url,
    `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/steam.png">`,
    "Steam",
    data.username
  );

  addSocial(
    data.xbox_url,
    `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/xbox.png">`,
    "Xbox",
    data.username
  );

  addSocial(
    data.twitch_url,
    `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/twitch.png">`,
    "Twitch",
    data.username
  );

  addSocial(
    data.privacy_url,
    `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/privacy.png">`,
    "Privacy",
    data.username
  );

  addSocial(
    data.onlyfans_url,
    `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/onlyfans.png">`,
    "OnlyFans",
    data.username
  );

  addSocial(
    data.fivem_url,
    `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/fivem.png">`,
    "FiveM",
    data.username
  );

  addSocial(
    data.pinterest_url,
    `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/pinterest.png">`,
    "Pinterest",
    data.username
  );

  addSocial(
    data.email_url,
    `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/email.png">`,
    "Email",
    data.username
  );

  addSocial(
    data.threads_url,
    `<img src="https://cdn.simpleicons.org/threads">`,
    "Threads",
    data.username
  );

  addSocial(
    data.bsky_url,
    `<img src="https://cdn.simpleicons.org/bluesky">`,
    "Bluesky",
    data.username
  );

  addSocial(
    data.vsco_url,
    `<img src="https://cdn.simpleicons.org/vsco">`,
    "VSCO",
    data.username
  );

  addSocial(
    data.pix_url,
    `<img src="https://cdn.simpleicons.org/pix">`,
    "Pix",
    data.username
  );



  // =========================
  // CARDS EXTRAS
  // =========================

  const conteudo =
    document.getElementById(
      "extras-container"
    );

  conteudo.innerHTML = "";

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
        ${text || ""}
      </span>

    `;

    conteudo.appendChild(card);

  }

  const albumPage =
    document.getElementById("album-page");

  const albumBtn =
    document.getElementById("album-btn");

  const closeAlbum =
    document.getElementById("close-album");

  if (albumBtn && albumPage) {

    albumBtn.onclick = () => {

      loadAlbumImages();

      albumPage.classList.add("active");

    };

  }

  if (closeAlbum && albumPage) {

    closeAlbum.onclick = () => {

      albumPage.classList.remove("active");

    };

  }

  if (!hasAlbum) {

    const albumBtn =
      document.getElementById("album-btn");

    if (albumBtn) {

      albumBtn.style.display = "none";

    }

  }

}

loadProfile();
