export function initTodo() {
  const botaoAdicionarTarefa = document.querySelector(".app__button--add-task")
  const formularioAdicionarTarefa = document.querySelector(".app__form-add-task")
  const textareaTarefa = document.querySelector('.app__form-textarea')
  const listaTarefas = document.querySelector('.app__section-task-list')
  const paragrafoDescricaoTarefaAtual = document.querySelector('.app__section-active-task-description')
  const botaoRemoverTarefasConcluidas = document.querySelector('#btn-remover-concluidas')
  const botaoRemoverTodasTarefas = document.querySelector('#btn-remover-todas')

  let tarefas = JSON.parse(localStorage.getItem('alurafokus@tarefas-v1.0.0')) || []
  let tarefaSelecionada = null
  let liTarefaSelecionada = null

  function salvarLocalStorage() {
    localStorage.setItem("alurafokus@tarefas-v1.0.0", JSON.stringify(tarefas))
  }

  function carregarTarefas() {
    listaTarefas.innerHTML = ""

    tarefas.forEach(tarefa => {
      const elemento = criarElementoTarefa(tarefa)
      listaTarefas.append(elemento)
    })
  }

  function editarTarefa(tarefaId) {
    const novaDescricao = prompt("Nova descrição para a terefa")

    if (!novaDescricao) {
      alert("Descrição inválida")
      return
    }

    tarefas = tarefas.map(tarefa => {
      if (tarefa.id === tarefaId) {
        return {
          ...tarefa,
          descricao: novaDescricao
        }
      }

      return tarefa
    })

    salvarLocalStorage()
    carregarTarefas()
  }

  function tarefaAtual(tarefaId) {
    const tarefa = tarefas.find(tarefa => tarefa.id === tarefaId)
    paragrafoDescricaoTarefaAtual.textContent = tarefa.descricao
    tarefaSelecionada = tarefaId
  }

  function criarElementoTarefa(tarefa) {
    const li = document.createElement('li')
    
    li.classList.add('app__section-task-list-item')

    li.onclick = () => {
      const itemsTaskList = document.querySelectorAll('.app__section-task-list-item')
      itemsTaskList.forEach(task => task.classList.remove('app__section-task-list-item-active'))

      if (tarefaSelecionada === tarefa.id) {
        paragrafoDescricaoTarefaAtual.textContent = ""
        li.classList.remove('app__section-task-list-item-active')
        tarefaSelecionada = null
        liTarefaSelecionada = null
        return
      }

      tarefaAtual(tarefa.id)
      liTarefaSelecionada = li
      li.classList.add('app__section-task-list-item-active')
    }

    li.innerHTML = `
      <svg class="app_section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
          <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
      </svg>
      <p class="app__section-task-list-item-description">
          ${tarefa.descricao}
      </p>
    `

    const botaoEditar = document.createElement('button')

    botaoEditar.classList.add('app_button-edit')
    botaoEditar.innerHTML = `
      <img src="./imagens/edit.png">
    `

    li.append(botaoEditar)

    botaoEditar.onclick = () =>  editarTarefa(tarefa.id)

    if (tarefa.completed) {
      li.classList.add('app__section-task-list-item-complete')
      li.querySelector("button").setAttribute('disabled', true)
      li.onclick = null
    }

    return li
  }

  function handleCriarTarefa(e) {
    e.preventDefault()

    const tarefa = textareaTarefa.value
    
    if (!tarefa) {
      alert("Por favor, insira uma tarefa")
      return
    }

    const novaTarefa = {
      id: new Date().toISOString(),
      descricao: tarefa,
    }

    tarefas.push(novaTarefa)

    const elemento = criarElementoTarefa(novaTarefa)
    listaTarefas.append(elemento)

    salvarLocalStorage()

    textareaTarefa.value = ""
    formularioAdicionarTarefa.classList.add('hidden')
  }

  function removerTarefasConcluidas() {
    tarefas = tarefas.filter(tarefa => !tarefa.completed)
    salvarLocalStorage()
    carregarTarefas()
  }

  function removerTodasTarefas() {
    tarefas = []
    salvarLocalStorage()
    carregarTarefas()
  }

  botaoAdicionarTarefa.addEventListener('click', () => {
    formularioAdicionarTarefa.classList.toggle('hidden')
  })

  formularioAdicionarTarefa.addEventListener('submit', handleCriarTarefa)

  carregarTarefas()

  document.addEventListener('focoFinalizado', () => {
    if (tarefaSelecionada && liTarefaSelecionada) {
      liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
      liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
      liTarefaSelecionada.querySelector("button").setAttribute('disabled', true)
      liTarefaSelecionada.onclick = null

      tarefas = tarefas.map(tarefa => {
        if (tarefa.id === tarefaSelecionada) {
          return {
            ...tarefa,
            completed: true
          }
        }

        return tarefa
      })

      salvarLocalStorage()
    }
  })

  botaoRemoverTarefasConcluidas.addEventListener('click', removerTarefasConcluidas)
  botaoRemoverTodasTarefas.addEventListener('click', removerTodasTarefas)
}