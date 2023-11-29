const html = document.querySelector('html')
const botaoFoco = document.querySelector('.app__card-button--foco')
const botaoCurto = document.querySelector('.app__card-button--curto')
const botaoLongo = document.querySelector('.app__card-button--longo')
const appImage = document.querySelector('.app__image')
const appTitle = document.querySelector('.app__title')
const toggleMusica = document.querySelector('#alternar-musica')
const timer = document.querySelector('.app__card-timer')
const botaoStartPause = document.querySelector("#start-pause")
const textoBotaoStartPause = document.querySelector("#start-pause span")

const musica = new Audio("/sons/luna-rise-part-one.mp3")
musica.loop = true

let tempoDecorridoEmSegundos = 3 * 1
let intervaloId = null

function mostrarTempo() {
  const tempo = tempoDecorridoEmSegundos

  const minutos = String(Math.floor(tempo / 60))
  const segundos = String(Math.floor(tempo % 60))

  timer.innerHTML = `${minutos.padStart(2, "0")}:${segundos.padStart(2, "0")}`
}

function alterarContexto(contexto) {
  zerar()

  html.dataset.contexto = contexto

  botaoFoco.classList.remove("active")
  botaoCurto.classList.remove("active")
  botaoLongo.classList.remove("active")

  switch (contexto) {
    case "foco":
      appTitle.innerHTML = `
        Otimize sua produtividade,<br>
        <strong class="app__title-strong">mergulhe no que importa.</strong>
      `
      botaoFoco.classList.add("active")
      tempoDecorridoEmSegundos = 60 * 25
      break
    case "descanso-curto":
      console.log("to aqui");
      appTitle.innerHTML = `
        Que tal dar uma respirada?<br>
        <strong class="app__title-strong">Faça uma pausa curta.</strong>
      `
      botaoCurto.classList.add("active")
      tempoDecorridoEmSegundos = 60 * 5
      break
    case "descanso-longo":
      appTitle.innerHTML = `
        Hora de voltar à superfície.<br>
        <strong class="app__title-strong">Faça uma pausa longa.</strong>
      `
      botaoLongo.classList.add("active")
      tempoDecorridoEmSegundos = 60 * 10
      break
  }

  mostrarTempo()

  appImage.src = `/imagens/${contexto}.png`
}

function contagemRegressiva() {
  if (tempoDecorridoEmSegundos <= 0) {
    zerar()

    switch (html.dataset.contexto) {
      case "foco":
        alterarContexto("descanso-curto")
        break
      default:
        alterarContexto("foco")
        break
    }

    return
  }

  tempoDecorridoEmSegundos--

  mostrarTempo()
}

function iniciarOuPausar() {
  if (intervaloId) {
    zerar()
    return
  }

  textoBotaoStartPause.textContent = "Pausar"

  intervaloId = setInterval(() => {
    contagemRegressiva()
  }, 1000)
}

function zerar() {
  clearInterval(intervaloId)
  intervaloId = null
  textoBotaoStartPause.textContent = "Começar"
}

botaoFoco.addEventListener('click', () => {
  alterarContexto("foco")
})

botaoCurto.addEventListener('click', () => {
  alterarContexto("descanso-curto")
})

botaoLongo.addEventListener('click', () => {
  alterarContexto("descanso-longo")
})

toggleMusica.addEventListener('change', () => {
  if (toggleMusica.checked) {
    musica.play()
  } else {
    musica.load()
  }
})

botaoStartPause.addEventListener('click', iniciarOuPausar)

mostrarTempo()