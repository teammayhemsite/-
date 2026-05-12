async function loadProfile() {

const username = new URLSearchParams(location.search).get("user");

const { data } = await supabaseClient
.from("profiles")
.select("*")
.eq("username", username)
.single();

document.getElementById("username").innerText = data.display_name;
document.getElementById("bio").innerText = data.bio;

document.getElementById("avatar").src = data.avatar_url;
document.getElementById("banner").style.backgroundImage = `url(${data.banner_url})`;
document.getElementById("balao").innerText = data.balao;

// REDES
const socials = document.getElementById("socials");
socials.innerHTML = "";

function add(url, icon) {
if (!url) return;
socials.innerHTML += `<a href="${url}" target="_blank">${icon}</a>`;
}

add(data.youtube_url, "YT");
add(data.instagram_url, "IG");
add(data.discord_url, "DC");
add(data.spotify_url, "SP");

// CARDS EXTRAS (5)
for (let i = 1; i <= 5; i++) {

const text = data[`extra${i}_text`];
const img = data[`extra${i}_img`];
const link = data[`extra${i}_link`];

if (!text && !img && !link) continue;

document.body.innerHTML += `
<a class="extra-card" href="${link}" target="_blank">
<img src="${img}">
<span>${text}</span>
</a>
`;

}

}

loadProfile();
