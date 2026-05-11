console.log("AUTH CARREGOU");

// =========================
// CADASTRO
// =========================

const registerBtn =
document.getElementById("register-btn");

if (registerBtn) {

  registerBtn.addEventListener("click", async () => {

    const user =
    document.getElementById("register-user").value;

    const pass =
    document.getElementById("register-pass").value;

    if (!user || !pass) {

      alert("Preencha tudo");
      return;

    }

    const { data, error } =
    await supabaseClient.auth.signUp({

      email: `${user}@fake.com`,
      password: pass

    });

    console.log(data);
    console.log(error);

    if (error) {

      alert(error.message);
      return;

    }

    alert("Conta criada!");

    window.location.href =
    "login.html";

  });

}

// =========================
// LOGIN
// =========================

const loginBtn =
document.getElementById("login-btn");

if (loginBtn) {

  loginBtn.addEventListener("click", async () => {

    const user =
    document.getElementById("login-user").value;

    const pass =
    document.getElementById("login-pass").value;

    const { data, error } =
    await supabaseClient.auth.signInWithPassword({

      email: `${user}@fake.com`,
      password: pass

    });

    console.log(data);
    console.log(error);

    if (error) {

      alert("Usuário ou senha incorretos");
      return;

    }

    alert("Login feito!");

    // REDIRECIONA PARA O DASHBOARD
    window.location.href =
    "dashboard.html";

  });

}
