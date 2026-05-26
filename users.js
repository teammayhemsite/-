async function loadUsers() {

  const container =
    document.getElementById(
      "users-container"
    );

  const { data, error } =

    await supabaseClient
      .from("profiles")
      .select("*")
      .order("created_at", {
        ascending: true
      });

  console.log(data);
  console.log(error);

  if (error) {

    container.innerHTML =
      "<p>Erro ao carregar usuários</p>";

    return;

  }

  data.forEach(user => {

    const card =
      document.createElement("a");

    card.className =
      "user-card";

    card.href =
      `/${user.username}`;

    card.innerHTML = `

     <img src="
        ${user.avatar_url ||
        "https://i.pinimg.com/736x/bd/c7/81/bdc781b471ebd825a6ab5a40e36e0f8e.jpg"}
      ">

      <h2>
        ${user.display_name ||
        user.username}
      </h2>

      <p>
        ${user.bio || "Sem bio"}
      </p>

    `;

    container.appendChild(card);

  });

}

loadUsers();
