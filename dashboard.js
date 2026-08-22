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
// ESTILOS DE TEXTO (Unicode)
// Substitui letras/números por caracteres Unicode equivalentes — não é
// uma fonte de verdade, então funciona em qualquer dispositivo/navegador
// sem precisar carregar nada.
// =========================

function mapSequential(text, { upperBase, lowerBase, digitBase, upperExceptions, lowerExceptions }) {

  const upperExc = upperExceptions || {};
  const lowerExc = lowerExceptions || {};

  return [...text].map(ch => {

    const code = ch.codePointAt(0);

    if (ch >= "A" && ch <= "Z") {

      if (upperExc[ch]) return upperExc[ch];
      if (upperBase == null) return ch;
      return String.fromCodePoint(upperBase + (code - 65));

    }

    if (ch >= "a" && ch <= "z") {

      if (lowerExc[ch]) return lowerExc[ch];
      if (lowerBase == null) return ch;
      return String.fromCodePoint(lowerBase + (code - 97));

    }

    if (ch >= "0" && ch <= "9") {

      if (digitBase == null) return ch;
      return String.fromCodePoint(digitBase + (code - 48));

    }

    return ch;

  }).join("");

}

const SMALL_CAPS_MAP = {
  a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ", i: "ɪ",
  j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ꞯ", r: "ʀ",
  s: "ꜱ", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ"
};

const CIRCLED_DIGITS = {
  "0": "⓪", "1": "①", "2": "②", "3": "③", "4": "④",
  "5": "⑤", "6": "⑥", "7": "⑦", "8": "⑧", "9": "⑨"
};

const DOUBLE_STRUCK_UPPER_EXC = {
  C: "ℂ", H: "ℍ", N: "ℕ", P: "ℙ", Q: "ℚ", R: "ℝ", Z: "ℤ"
};

function applyTextStyle(text, style) {

  if (!text) return text;

  switch (style) {

    case "bold":
      return mapSequential(text, { upperBase: 0x1D400, lowerBase: 0x1D41A, digitBase: 0x1D7CE });

    case "italic":
      // Sans-serif italic: bloco totalmente contíguo, sem exceções
      return mapSequential(text, { upperBase: 0x1D608, lowerBase: 0x1D622, digitBase: null });

    case "bold-italic":
      return mapSequential(text, { upperBase: 0x1D468, lowerBase: 0x1D482, digitBase: null });

    case "script":
      // Bold script: bloco totalmente contíguo, sem exceções
      return mapSequential(text, { upperBase: 0x1D4D0, lowerBase: 0x1D4EA, digitBase: null });

    case "fraktur":
      // Bold fraktur: bloco totalmente contíguo, sem exceções
      return mapSequential(text, { upperBase: 0x1D56C, lowerBase: 0x1D586, digitBase: null });

    case "double-struck":
      return mapSequential(text, {
        upperBase: 0x1D538, lowerBase: 0x1D552, digitBase: 0x1D7D8,
        upperExceptions: DOUBLE_STRUCK_UPPER_EXC
      });

    case "mono":
      return mapSequential(text, { upperBase: 0x1D670, lowerBase: 0x1D68A, digitBase: 0x1D7F6 });

    case "circular":
      return [...text].map(ch => {

        if (ch >= "A" && ch <= "Z")
          return String.fromCodePoint(0x24B6 + (ch.codePointAt(0) - 65));

        if (ch >= "a" && ch <= "z")
          return String.fromCodePoint(0x24D0 + (ch.codePointAt(0) - 97));

        if (ch >= "0" && ch <= "9") return CIRCLED_DIGITS[ch];

        return ch;

      }).join("");

    case "square":
      // Só existe o bloco maiúsculo — minúsculas viram maiúsculas
      return [...text].map(ch => {

        if (ch >= "A" && ch <= "Z")
          return String.fromCodePoint(0x1F130 + (ch.codePointAt(0) - 65));

        if (ch >= "a" && ch <= "z")
          return String.fromCodePoint(0x1F130 + (ch.codePointAt(0) - 97));

        return ch;

      }).join("");

    case "fullwidth":
      return mapSequential(text, { upperBase: 0xFF21, lowerBase: 0xFF41, digitBase: 0xFF10 })
        .replace(/ /g, "\u3000");

    case "tiny":
      return [...text].map(ch => {

        const lower = ch.toLowerCase();

        return SMALL_CAPS_MAP[lower] || ch;

      }).join("");

    case "normal":
    default:
      return text;

  }

}

// Constrói o mapa reverso (caractere estilizado -> letra normal) juntando
// a saída de todos os estilos acima. Assim dá pra voltar ao "Normal" (ou
// trocar de estilo) sem perder o texto original, mesmo que o campo já
// esteja com Unicode chique dentro.
const REVERSE_STYLE_MAP = (() => {

  // minúsculas primeiro: em estilos onde maiúscula/minúscula colapsam no
  // mesmo caractere (small caps, quadrada), prefere reconstruir minúscula
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const styles = [
    "bold", "italic", "bold-italic", "script", "fraktur",
    "double-struck", "mono", "circular", "square", "fullwidth", "tiny"
  ];

  // Algumas letras (ex: "x" no small caps) não têm glifo Unicode dedicado
  // e a tabela cai de volta pro caractere original sem estilo nenhum. Um
  // "estilo" que devolve uma letra ASCII comum não é um caractere estilizado
  // de verdade — não pode virar chave do mapa reverso, senão qualquer "x"
  // normal em qualquer texto seria "revertido" por engano.
  const isPlainAscii = ch => /^[A-Za-z0-9]$/.test(ch);

  const reverse = {};

  styles.forEach(style => {

    [...alphabet].forEach(plainChar => {

      const styledChar = applyTextStyle(plainChar, style);

      if (
        styledChar !== plainChar &&
        !isPlainAscii(styledChar) &&
        !(styledChar in reverse)
      ) {
        reverse[styledChar] = plainChar;
      }

    });

  });

  reverse["\u3000"] = " ";

  return reverse;

})();

function stripTextStyle(text) {

  if (!text) return text;

  return [...text].map(ch => REVERSE_STYLE_MAP[ch] || ch).join("");

}

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

const cardWidthInput = $("card-width-input");
const cardMaxWidthInput = $("card-max-width-input");
const cardRadiusInput = $("card-radius-input");
const cardBlurInput = $("card-blur-input");
const cardBgOpacityInput = $("card-bg-opacity-input");
const cardBorderOpacityInput = $("card-border-opacity-input");
const bannerHeightInput = $("banner-height-input");
const avatarSizeInput = $("avatar-size-input");
const socialMarginInput = $("social-margin-input");
const resetCardStyleBtn = $("reset-card-style");

// Valor padrão de cada slider — usado tanto no botão "Restaurar padrão"
// quanto como fallback quando o perfil ainda não tem nada salvo.
const CARD_STYLE_DEFAULTS = {
  cardWidthInput: 95,
  cardMaxWidthInput: 600,
  cardRadiusInput: 20,
  cardBlurInput: 18,
  cardBgOpacityInput: 0,
  cardBorderOpacityInput: 20,
  bannerHeightInput: 170,
  avatarSizeInput: 95,
  socialMarginInput: 20
};

const fontInput =
  $("font-input");

const musicFile =
  $("music-file");

const effectInput =
  $("effect-input");

const entranceEnabled =
  $("entrance-enabled");

const entranceStyle =
  $("entrance-style");

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

          card_width:
            Number(cardWidthInput.value),

          card_max_width:
            Number(cardMaxWidthInput.value),

          card_radius:
            Number(cardRadiusInput.value),

          card_blur:
            Number(cardBlurInput.value),

          card_bg_opacity:
            Number(cardBgOpacityInput.value),

          card_border_opacity:
            Number(cardBorderOpacityInput.value),

          banner_height:
            Number(bannerHeightInput.value),

          avatar_size:
            Number(avatarSizeInput.value),

          social_margin_top:
            Number(socialMarginInput.value),

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

          effect:
            effectInput.value,

          entrance_enabled:
            entranceEnabled.value === "true",

          entrance_style:
            entranceStyle.value,

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

// =========================
// LIMITES DE UPLOAD
// =========================

const MAX_IMAGE_MB = 5;
const MAX_MUSIC_MB = 10;

const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;
const MAX_MUSIC_BYTES = MAX_MUSIC_MB * 1024 * 1024;

// Dimensão máxima (px) que cada tipo de imagem mantém após a compressão.
// Só reduz imagens maiores que isso — nunca aumenta uma imagem pequena.
const IMAGE_DIMENSION_LIMITS = {
  avatar: [800, 800],
  banner: [1600, 900],
  background: [1920, 1920],
  cardbackground: [1200, 1200],
  album1: [1600, 1600],
  album2: [1600, 1600],
  album3: [1600, 1600],
  album4: [1600, 1600]
};

function formatMb(bytes) {

  return (bytes / 1024 / 1024).toFixed(1);

}

// Valida o tamanho de um arquivo assim que ele é escolhido, e já limpa
// o input se passar do limite — feedback imediato, antes de tentar salvar.
function validateFileSize(input, maxBytes, maxMb, label) {

  const file = input.files[0];

  if (!file) return true;

  if (file.size > maxBytes) {

    alert(
      `${label} muito grande (${formatMb(file.size)}MB). O limite é ${maxMb}MB.`
    );

    input.value = "";
    return false;

  }

  return true;

}

const imageInputsToValidate = [
  { input: avatarFile, label: "Foto de perfil" },
  { input: bannerFile, label: "Banner" },
  { input: backgroundFile, label: "Wallpaper" },
  { input: cardBackgroundFile, label: "Wallpaper do card" },
  { input: album1File, label: "Foto 1 do álbum" },
  { input: album2File, label: "Foto 2 do álbum" },
  { input: album3File, label: "Foto 3 do álbum" },
  { input: album4File, label: "Foto 4 do álbum" }
];

imageInputsToValidate.forEach(({ input, label }) => {

  input.addEventListener("change", () => {

    validateFileSize(input, MAX_IMAGE_BYTES, MAX_IMAGE_MB, label);

  });

});

musicFile.addEventListener("change", () => {

  validateFileSize(musicFile, MAX_MUSIC_BYTES, MAX_MUSIC_MB, "Música");

});

// =========================
// COMPRESSÃO DE IMAGEM
// =========================

// Redimensiona (só reduz, nunca aumenta) e reexporta a imagem antes do
// upload. GIFs não são recomprimidos — isso quebraria a animação, então
// só passam pela validação de tamanho. PNGs mantêm PNG (preserva
// transparência); o resto vira JPEG em boa qualidade, bem mais leve.
function compressImage(file, maxWidth, maxHeight, quality = 0.85) {

  return new Promise((resolve, reject) => {

    if (file.type === "image/gif") {

      resolve({ blob: file, ext: "gif" });
      return;

    }

    const objectUrl =
      URL.createObjectURL(file);

    const img = new Image();

    img.onload = () => {

      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {

        const ratio =
          Math.min(maxWidth / width, maxHeight / height);

        width = Math.round(width * ratio);
        height = Math.round(height * ratio);

      }

      const canvas =
        document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      canvas
        .getContext("2d")
        .drawImage(img, 0, 0, width, height);

      URL.revokeObjectURL(objectUrl);

      const isPng =
        file.type === "image/png";

      canvas.toBlob(

        (blob) => {

          if (!blob) {

            reject(new Error("Falha ao comprimir imagem"));
            return;

          }

          resolve({
            blob,
            ext: isPng ? "png" : "jpg"
          });

        },

        isPng ? "image/png" : "image/jpeg",
        isPng ? undefined : quality

      );

    };

    img.onerror = () => {

      URL.revokeObjectURL(objectUrl);
      reject(new Error("Não foi possível ler a imagem"));

    };

    img.src = objectUrl;

  });

}

async function uploadImage(
  file,
  userId,
  type,
  oldUrl = null
) {

  // Checagem de segurança (a validação principal já acontece na escolha do arquivo)
  if (file.size > MAX_IMAGE_BYTES) {

    alert(
      `Essa imagem passa de ${MAX_IMAGE_MB}MB (${formatMb(file.size)}MB). Escolha um arquivo menor.`
    );

    return null;

  }

  // COMPRESSÃO
  let uploadBlob = file;
  let fileExt = file.name.split(".").pop().toLowerCase();

  try {

    const [maxWidth, maxHeight] =
      IMAGE_DIMENSION_LIMITS[type] || [1600, 1600];

    const compressed =
      await compressImage(file, maxWidth, maxHeight);

    uploadBlob = compressed.blob;
    fileExt = compressed.ext;

  } catch (e) {

    console.log("Falha ao comprimir, enviando original:", e);
    uploadBlob = file;

  }

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

  // NOVO CAMINHO
  const filePath =
    `users/${userId}/${type}.${fileExt}`;

  // UPLOAD
  const { error } =
    await supabaseClient
      .storage
      .from("images")
      .upload(filePath, uploadBlob, {
        upsert: true,
        contentType: uploadBlob.type || file.type
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

  if (file.size > MAX_MUSIC_BYTES) {

    alert(
      `Esse arquivo de música passa de ${MAX_MUSIC_MB}MB (${formatMb(file.size)}MB). Escolha um arquivo menor.`
    );

    return null;

  }

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
// PERSONALIZAR CARD
// =========================

function applyCardStyleVars(previewCard) {

  $("card-width-value").textContent =
    cardWidthInput.value + "%";

  $("card-max-width-value").textContent =
    cardMaxWidthInput.value + "px";

  $("card-radius-value").textContent =
    cardRadiusInput.value + "px";

  $("card-blur-value").textContent =
    cardBlurInput.value + "px";

  $("card-bg-opacity-value").textContent =
    cardBgOpacityInput.value + "%";

  $("card-border-opacity-value").textContent =
    cardBorderOpacityInput.value + "%";

  $("banner-height-value").textContent =
    bannerHeightInput.value + "px";

  $("avatar-size-value").textContent =
    avatarSizeInput.value + "px";

  $("social-margin-value").textContent =
    socialMarginInput.value + "px";

  if (!previewCard) return;

  // A mini-prévia do dashboard usa um layout simplificado e fixo (banner,
  // avatar e espaçamento das redes têm posições próprias aqui dentro).
  // Por isso só refletimos aqui o que dá pra aplicar com segurança —
  // arredondamento, vidro e opacidades. Largura, banner, avatar e o
  // espaçamento das redes aparecem fiéis de verdade no perfil público.
  previewCard.style.borderRadius =
    cardRadiusInput.value + "px";

  previewCard.style.backdropFilter =
    `blur(${cardBlurInput.value}px)`;

  previewCard.style.webkitBackdropFilter =
    `blur(${cardBlurInput.value}px)`;

  previewCard.style.background =
    `rgba(255,255,255,${cardBgOpacityInput.value / 100})`;

  previewCard.style.borderColor =
    `rgba(255,255,255,${cardBorderOpacityInput.value / 100})`;

}

function resetCardStyleDefaults() {

  cardWidthInput.value = CARD_STYLE_DEFAULTS.cardWidthInput;
  cardMaxWidthInput.value = CARD_STYLE_DEFAULTS.cardMaxWidthInput;
  cardRadiusInput.value = CARD_STYLE_DEFAULTS.cardRadiusInput;
  cardBlurInput.value = CARD_STYLE_DEFAULTS.cardBlurInput;
  cardBgOpacityInput.value = CARD_STYLE_DEFAULTS.cardBgOpacityInput;
  cardBorderOpacityInput.value = CARD_STYLE_DEFAULTS.cardBorderOpacityInput;
  bannerHeightInput.value = CARD_STYLE_DEFAULTS.bannerHeightInput;
  avatarSizeInput.value = CARD_STYLE_DEFAULTS.avatarSizeInput;
  socialMarginInput.value = CARD_STYLE_DEFAULTS.socialMarginInput;

  updatePreview();
  updateSummary();

}

resetCardStyleBtn?.addEventListener("click", resetCardStyleDefaults);

// =========================
// PREVIEW
// =========================

function updatePreview() {

  const previewCard =
    document.querySelector(".cardking");

  previewCard.style.setProperty(
    "--text-color",
    textColorInput.value
  );

  applyCardStyleVars(previewCard);

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

  cardWidthInput.value =
    data.card_width ?? CARD_STYLE_DEFAULTS.cardWidthInput;

  cardMaxWidthInput.value =
    data.card_max_width ?? CARD_STYLE_DEFAULTS.cardMaxWidthInput;

  cardRadiusInput.value =
    data.card_radius ?? CARD_STYLE_DEFAULTS.cardRadiusInput;

  cardBlurInput.value =
    data.card_blur ?? CARD_STYLE_DEFAULTS.cardBlurInput;

  cardBgOpacityInput.value =
    data.card_bg_opacity ?? CARD_STYLE_DEFAULTS.cardBgOpacityInput;

  cardBorderOpacityInput.value =
    data.card_border_opacity ?? CARD_STYLE_DEFAULTS.cardBorderOpacityInput;

  bannerHeightInput.value =
    data.banner_height ?? CARD_STYLE_DEFAULTS.bannerHeightInput;

  avatarSizeInput.value =
    data.avatar_size ?? CARD_STYLE_DEFAULTS.avatarSizeInput;

  socialMarginInput.value =
    data.social_margin_top ?? CARD_STYLE_DEFAULTS.socialMarginInput;

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

  effectInput.value =
    data.effect || "none";

  entranceEnabled.value =
    data.entrance_enabled
      ? "true"
      : "false";

  entranceStyle.value =
    data.entrance_style || "aurora";

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

// =========================
// EFEITO NA PRÉVIA
// =========================

let currentEffectType = null;
let currentEffectController = null;

function applyEffectPreview() {

  if (!effectInput || !window.ProfileEffects) return;

  const type = effectInput.value;

  if (type === currentEffectType) return;

  currentEffectType = type;

  if (currentEffectController) {

    currentEffectController.destroy();
    currentEffectController = null;

  }

  const canvas = $("preview-effect-canvas");

  if (canvas) {
    currentEffectController = window.ProfileEffects.start(canvas, type);
  }

}

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

  $("summary-effect").textContent =
    effectInput.options[effectInput.selectedIndex]?.text.trim() || "Nenhum";

  const entranceLabel = $("summary-entrance");

  if (entranceLabel)
    entranceLabel.textContent =
      entranceEnabled.value === "true" ? "Ativada" : "Desativada";

  const entranceStyleLabel = $("summary-entrance-style");

  if (entranceStyleLabel)
    entranceStyleLabel.textContent =
      entranceStyle.options[entranceStyle.selectedIndex]?.text.trim() || "Aurora";

  applyEffectPreview();

}

document
  .querySelectorAll("input, textarea, select")
  .forEach(el => el.addEventListener("input", updateSummary));

document
  .querySelectorAll(".frame-card")
  .forEach(card => card.addEventListener("click", updateSummary));

// Aplica o estilo de texto escolhido ao Nome e à Bio. Sempre limpa
// qualquer estilo anterior antes de aplicar o novo, então dá pra trocar
// de estilo (ou voltar a "Normal") quantas vezes quiser sem acumular.
fontInput?.addEventListener("change", () => {

  const style = fontInput.value;

  [nameInput, bioInput].forEach(field => {

    const plain = stripTextStyle(field.value);

    field.value =
      style === "normal"
        ? plain
        : applyTextStyle(plain, style);

  });

  updatePreview();
  updateSummary();

});

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

// =========================
// MENU MOBILE (gaveta)
// =========================

const sidebarEl =
  $("sidebar");

const sidebarBackdrop =
  $("sidebar-backdrop");

const mobileMenuToggle =
  $("mobile-menu-toggle");

const sidebarClose =
  $("sidebar-close");

function openSidebar() {

  sidebarEl?.classList.add("mobile-open");
  sidebarBackdrop?.classList.add("visible");

}

function closeSidebar() {

  sidebarEl?.classList.remove("mobile-open");
  sidebarBackdrop?.classList.remove("visible");

}

mobileMenuToggle?.addEventListener("click", openSidebar);
sidebarClose?.addEventListener("click", closeSidebar);
sidebarBackdrop?.addEventListener("click", closeSidebar);

// Fecha a gaveta ao escolher uma página (só faz sentido no mobile)
document.querySelectorAll(".nav-item[data-page]").forEach(btn => {

  btn.addEventListener("click", () => {

    if (window.innerWidth <= 760) closeSidebar();

  });

});

// =========================
// PRÉVIA EM TELA CHEIA (mobile)
// =========================

const previewPanelEl =
  document.querySelector(".preview-panel");

const mobilePreviewToggle =
  $("mobile-preview-toggle");

const mobilePreviewClose =
  $("mobile-preview-close");

mobilePreviewToggle?.addEventListener("click", () => {

  previewPanelEl?.classList.add("mobile-preview-open");
  document.body.style.overflow = "hidden";

});

mobilePreviewClose?.addEventListener("click", () => {

  previewPanelEl?.classList.remove("mobile-preview-open");
  document.body.style.overflow = "";

});
