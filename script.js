const tarefaURL = "https://parseapi.back4app.com/classes/MyCustomClassName";
const headers = {
  "X-Parse-Application-Id": "j0xASWDzOhB3QXEbblvmohqlxst2EHCJ9ztI6yhE",
  "X-Parse-REST-API-Key": "CzvkN5UtH3N0tfMuIRthWp1EcaC0IR5kqTtmMNpn",
};

const headersJson = {
  ...headers,
  "Content-Type": "application/json",
};

const adicionarChamado = async (event) => {
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const assunto = document.getElementById('assunto').value;
  const mensagem = document.getElementById('mensagem').value;

  if (!nome || !email || !assunto || !mensagem) {
    alert("Todos os campos são obrigatórios!");
    return;
  }

  const novoChamado = {
    nome,
    email,
    assunto,
    mensagem,
    finalizado: false,
  };

  try {
    const response = await fetch(tarefaURL, {
      method: "POST",
      headers: headersJson,
      body: JSON.stringify(novoChamado),
    });

    if (response.ok) {
      alert('Chamado enviado com sucesso!');
      window.location.href = 'consulta.html';
    } else {
      throw new Error('Erro ao enviar o chamado.');
    }
  } catch (error) {
    console.error('Erro ao enviar o chamado:', error);
    alert('Erro ao enviar o chamado. Por favor, tente novamente.');
  }
};

const listarChamados = async (todos = false) => {
  if (window.location.pathname === '/consulta.html') {
    let query = todos ? '' : '?where={"finalizado":false}';

    try {
      const response = await fetch(`${tarefaURL}${query}`, {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar os chamados.');
      }

      const data = await response.json();
      const listaChamados = data.results;

      const chamadosList = document.getElementById('chamadosList');
      chamadosList.innerHTML = "";

      listaChamados.forEach((chamado) => {
        const chamadoElement = document.createElement("div");
        chamadoElement.innerHTML = `
          <p><strong>Nome:</strong> ${chamado.nome}</p>
          <p><strong>E-mail:</strong> ${chamado.email}</p>
          <p><strong>Assunto:</strong> ${chamado.assunto}</p>
          <p><strong>Mensagem:</strong> ${chamado.mensagem}</p>
          <p><strong>Finalizado:</strong> ${chamado.finalizado ? 'Sim' : 'Não'}</p>
          <button onclick="escreverResposta('${chamado.objectId}')">Escrever Resposta</button>
          <button onclick="finalizarChamado('${chamado.objectId}')">Finalizar Chamado</button>
          <hr>
        `;
        chamadosList.appendChild(chamadoElement);
      });
    } catch (error) {
      console.error('Erro ao buscar os chamados:', error);
      alert('Erro ao buscar os chamados. Por favor, tente novamente.');
    }
  }
};

const escreverResposta = (chamadoId) => {
  const resposta = prompt("Digite sua resposta:");

  if (resposta) {
    enviarRespostaParaBack4App(chamadoId, resposta);
  }
};

const finalizarChamado = async (chamadoId) => {
  try {
    const response = await fetch(`${tarefaURL}/${chamadoId}`, {
      method: "PUT",
      headers: headersJson,
      body: JSON.stringify({ finalizado: true }),
    });

    if (response.ok) {
      alert('Chamado finalizado com sucesso!');
      listarChamados();
    } else {
      throw new Error('Erro ao finalizar o chamado.');
    }
  } catch (error) {
    console.error('Erro ao finalizar o chamado:', error);
    alert('Erro ao finalizar o chamado. Por favor, tente novamente.');
  }
};

const enviarRespostaParaBack4App = async (chamadoId, resposta) => {
  try {
    const response = await fetch(`${tarefaURL}/${chamadoId}`, {
      method: "PUT",
      headers: headersJson,
      body: JSON.stringify({ resposta }),
    });

    if (response.ok) {
      alert('Resposta enviada com sucesso!');
      listarChamados();
    } else {
      throw new Error('Erro ao enviar a resposta.');
    }
  } catch (error) {
    console.error('Erro ao enviar a resposta:', error);
    alert('Erro ao enviar a resposta. Por favor, tente novamente.');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  listarChamados(true);
});

document.getElementById('cadastroForm').addEventListener('submit', adicionarChamado);
