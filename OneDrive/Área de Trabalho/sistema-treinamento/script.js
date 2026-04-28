function mostrarTela(tela) {
  document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
  document.querySelectorAll('.menu button').forEach(b => b.classList.remove('ativo'));
  document.getElementById('tela' + tela.charAt(0).toUpperCase() + tela.slice(1)).classList.add('ativa');
  document.getElementById('btn' + tela.charAt(0).toUpperCase() + tela.slice(1)).classList.add('ativo');
}

function mostrarSubform(id) {
  document.querySelectorAll('.subform').forEach(f => f.classList.remove('ativo'));
  document.querySelectorAll('.subtabs button').forEach(b => b.classList.remove('ativo'));
  document.getElementById(id).classList.add('ativo');
  if (id === 'formTreinamento') {
    filtrarFuncionarios();
    document.getElementById('subTreinamento').classList.add('ativo');
  } else {
    document.getElementById('subFuncionario').classList.add('ativo');
  }
}

function cadastrarFuncionario() {
  const nome = document.getElementById('nomeFuncionario').value.trim();
  const id = document.getElementById('idFuncionario').value.trim();

  if (!nome || !id) { alert('Preencha todos os campos!'); return; }

  const funcionarios = JSON.parse(localStorage.getItem('funcionarios') || '[]');

  if (funcionarios.find(f => f.id === id)) {
    alert('Já existe um funcionário com esse ID!'); return;
  }

  funcionarios.push({ id, nome });
  localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
  alert(`Funcionário ${nome} cadastrado com sucesso!`);

  document.getElementById('nomeFuncionario').value = '';
  document.getElementById('idFuncionario').value = '';
}

function filtrarFuncionarios() {
  const busca = document.getElementById('buscaFuncionarioTreinamento').value.toLowerCase();
  const funcionarios = JSON.parse(localStorage.getItem('funcionarios') || '[]');
  const select = document.getElementById('selectFuncionario');

  const filtrados = funcionarios.filter(f =>
    f.nome.toLowerCase().includes(busca) || f.id.includes(busca)
  );

  select.innerHTML = filtrados.length === 0
    ? '<option value="">Nenhum funcionário encontrado</option>'
    : filtrados.map(f => `<option value="${f.id}">${f.nome} (ID: ${f.id})</option>`).join('');
}

function cadastrarTreinamento() {
  const funcionarioId = document.getElementById('selectFuncionario').value;
  const setor = document.getElementById('setor').value.trim();
  const nomeTreinamento = document.getElementById('nomeTreinamento').value.trim();
  const arquivo = document.getElementById('arquivoTreinamento').files[0];

  if (!funcionarioId || !nomeTreinamento || !arquivo) {
    alert('Selecione o funcionário, informe o treinamento e o comprovante!'); return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const treinamentos = JSON.parse(localStorage.getItem('treinamentos') || '[]');
    treinamentos.push({
      funcionarioId, setor, nomeTreinamento,
      arquivo: e.target.result,
      nomeArquivo: arquivo.name
    });
    localStorage.setItem('treinamentos', JSON.stringify(treinamentos));
    alert(`Treinamento ${nomeTreinamento} salvo com sucesso!`);

    document.getElementById('setor').value = '';
    document.getElementById('nomeTreinamento').value = '';
    document.getElementById('arquivoTreinamento').value = '';
  };
  reader.readAsDataURL(arquivo);
}

function consultar() {
  const busca = document.getElementById('campoBusca').value.toLowerCase().trim();
  if (!busca) { alert('Digite um nome ou ID para buscar!'); return; }

  const funcionarios = JSON.parse(localStorage.getItem('funcionarios') || '[]');
  const treinamentos = JSON.parse(localStorage.getItem('treinamentos') || '[]');
  const resultado = document.getElementById('resultadoConsulta');

  const funcionario = funcionarios.find(f =>
    f.nome.toLowerCase().includes(busca) || f.id.includes(busca)
  );

  if (!funcionario) {
    resultado.innerHTML = '<p class="vazio">Funcionário não encontrado.</p>';
    return;
  }

  const treinadosDele = treinamentos.filter(t => t.funcionarioId === funcionario.id);

  let html = `<h3>${funcionario.nome} — ID: ${funcionario.id}</h3>`;

  if (treinadosDele.length === 0) {
    html += '<p class="vazio">Nenhum treinamento cadastrado.</p>';
  } else {
    treinadosDele.forEach(t => {
      html += `
        <div class="treinamento-item">
          <span>📄 ${t.nomeTreinamento} ${t.setor ? '— ' + t.setor : ''}</span>
          <button onclick="abrirArquivo('${t.nomeArquivo}', this)" data-arquivo='${t.arquivo}'>Ver comprovante</button>
        </div>`;
    });
  }

  resultado.innerHTML = html;
}

function abrirArquivo(nome, btn) {
  const arquivo = btn.getAttribute('data-arquivo');
  const link = document.createElement('a');
  link.href = arquivo;
  link.download = nome;
  link.click();
}

mostrarTela('cadastro');
