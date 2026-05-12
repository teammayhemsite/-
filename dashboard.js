const inputs = (id) => document.getElementById(id);

// PERFIL
const nameInput = inputs("name-input");
const bioInput = inputs("bio-input");
const avatarInput = inputs("avatar-input");
const bannerInput = inputs("banner-input");
const backgroundInput = inputs("background-input");
const overlayInput = inputs("overlay-input");

// REDES
const youtubeInput = inputs("youtube-input");
const instagramInput = inputs("instagram-input");
const discordInput = inputs("discord-input");
const spotifyInput = inputs("spotify-input");

// CARDS
const cards = [];
for (let i = 1; i <= 5; i++) {
  cards.push({
    text: inputs(`extra${i}-text`),
    img: inputs(`extra${i}-img`),
    link: inputs(`extra${i}-link`)
  });
}

// PREVIEW
function updatePreview() {

document.getElementById("preview-name").innerText = nameInput.value;
document.getElementById("preview-bio").innerText = bioInput.value;

document.getElementById("preview-avatar").src = avatarInput.value;
document.getElementById("preview-banner").style.backgroundImage = `url(${bannerInput.value})`;
document.getElementById("preview-overlay").innerText = overlayInput.value;

document.getElementById("youtube-link").href = youtubeInput.value;
document.getElementById("instagram-link").href = instagramInput.value;
document.getElementById("discord-link").href = discordInput.value;
document.getElementById("spotify-link").href = spotifyInput.value;

}

// LISTENERS
document.querySelectorAll("input, textarea").forEach(el => {
  el.addEventListener("input", updatePreview);
});

// SAVE
document.getElementById("save-btn").addEventListener("click", async () => {

const { data: { user } } = await supabaseClient.auth.getUser();

const payload = {
id: user.id,

display_name: nameInput.value,
bio: bioInput.value,

avatar_url: avatarInput.value,
banner_url: bannerInput.value,
background_url: backgroundInput.value,
balao: overlayInput.value,

youtube_url: youtubeInput.value,
instagram_url: instagramInput.value,
discord_url: discordInput.value,
spotify_url: spotifyInput.value,
};

// cards
cards.forEach((c, i) => {
payload[`extra${i+1}_text`] = c.text.value;
payload[`extra${i+1}_img`] = c.img.value;
payload[`extra${i+1}_link`] = c.link.value;
});

await supabaseClient.from("profiles").upsert(payload);

alert("Salvo!");
});
