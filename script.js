// Referências dos elementos da interface que terão comportamento dinâmico.
// Centralizar essas seleções evita repetição de consultas ao DOM e facilita manutenção.
const botaoMenu = document.getElementById("botaoMenu");
const menuPrincipal = document.getElementById("menuPrincipal");
const botaoTopo = document.getElementById("botaoTopo");
const gradeGaleria = document.getElementById("gradeGaleria");
const botaoPaginaAnterior = document.getElementById("botaoPaginaAnterior");
const botaoProximaPagina = document.getElementById("botaoProximaPagina");
const numerosPagina = document.getElementById("numerosPagina");

// Controle de menu para telas pequenas:
// alterna a classe "aberto" para mostrar/esconder a navegação.
if (botaoMenu && menuPrincipal) {
  botaoMenu.addEventListener("click", () => {
    menuPrincipal.classList.toggle("aberto");
  });

  // Fecha o menu após clicar em qualquer item,
  // evitando que o painel permaneça aberto sobre o conteúdo.
  menuPrincipal.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuPrincipal.classList.remove("aberto");
    });
  });
}

const elementosRevelar = document.querySelectorAll(".revelar, .item-revelar");

// Observador de interseção para animações de entrada.
// Quando o elemento entra no viewport (20%), ele ganha classe "mostrar"
// e deixa de ser observado para reduzir processamento.
const observadorRevelar = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("mostrar");
        observadorRevelar.unobserve(entrada.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

// Define pequeno atraso progressivo para criar efeito de revelação em cascata.
elementosRevelar.forEach((elemento, indice) => {
  elemento.style.transitionDelay = `${Math.min(indice * 90, 450)}ms`;
  observadorRevelar.observe(elemento);
});

// Banco de imagens de fallback (externas).
// São usadas quando uma imagem local da galeria não puder ser carregada.
const imagensFallback = [
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
];

// Dados base da galeria: nome do arquivo local e título exibido na legenda.
const itensGaleriaBase = [
  { file: "drone1.jpg", titulo: "Monitoramento de lavoura" },
  { file: "drone2.jpg", titulo: "Mapeamento agrícola" },
  { file: "drone3.jpg", titulo: "Pulverização de precisão" },
  { file: "drone4.jpg", titulo: "Inspeção por imagem aérea" },
  { file: "drone5.jpg", titulo: "Gestão inteligente da produção" },
  { file: "drone6.jpg", titulo: "Cobertura de grandes áreas" },
  { file: "drone7.jpg", titulo: "Acompanhamento por talhão" },
  { file: "drone8.jpg", titulo: "Roteiros automatizados" },
  { file: "drone9.jpg", titulo: "Tecnologia aplicada no campo" },
  { file: "drone10.jpg", titulo: "Tecnologia aplicada no campo" },
  { file: "drone11.png", titulo: "Tecnologia aplicada no campo" },

];

const itensPorPagina = 6;
let paginaAtual = 1;
let itensGaleria = [];
let totalPaginas = 1;

// Re-registra animação para os novos cards após trocar de página.
// Como o HTML da galeria é recriado, os elementos antigos deixam de existir.
function observarNovosItensGaleria() {
  if (!gradeGaleria) return;

  gradeGaleria.querySelectorAll(".item-revelar").forEach((item, indice) => {
    item.classList.remove("mostrar");
    item.style.transitionDelay = `${Math.min(indice * 80, 320)}ms`;
    observadorRevelar.observe(item);
  });
}

// Aplica fallback de imagem ao disparar evento de erro no carregamento.
// A checagem evita loop infinito caso o fallback também falhe.
function aplicarFallbackGaleria() {
  if (!gradeGaleria) return;

  gradeGaleria.querySelectorAll("img[data-fallback]").forEach((imagem) => {
    imagem.addEventListener("error", () => {
      if (imagem.dataset.fallback && imagem.src !== imagem.dataset.fallback) {
        imagem.src = imagem.dataset.fallback;
      }
    });
  });
}

// Cria os botões numéricos da paginação dinamicamente com base em totalPaginas.
// O botão da página atual recebe classe "ativo" para indicação visual.
function renderizarNumerosPagina() {
  if (!numerosPagina) return;

  numerosPagina.innerHTML = "";

  for (let i = 1; i <= totalPaginas; i += 1) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = `numero-pagina ${i === paginaAtual ? "ativo" : ""}`;
    botao.textContent = String(i);
    botao.addEventListener("click", () => {
      paginaAtual = i;
      renderizarPaginaGaleria();
    });
    numerosPagina.appendChild(botao);
  }
}

// Renderiza os itens da página atual e atualiza toda a interface da galeria:
// conteúdo dos cards, estado dos botões anterior/próxima, numeração e animações.
function renderizarPaginaGaleria() {
  if (!gradeGaleria || !botaoPaginaAnterior || !botaoProximaPagina) return;

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const itensPagina = itensGaleria.slice(inicio, fim);

  gradeGaleria.innerHTML = itensPagina
    .map(
      (item) => `
      <figure class="cartao-galeria item-revelar">
        <img src="${item.src}" data-fallback="${item.fallback}" alt="${item.alt}" loading="lazy" />
        <figcaption>${item.caption}</figcaption>
      </figure>
    `
    )
    .join("");

  botaoPaginaAnterior.disabled = paginaAtual === 1;
  botaoProximaPagina.disabled = paginaAtual === totalPaginas;

  renderizarNumerosPagina();
  aplicarFallbackGaleria();
  observarNovosItensGaleria();
}

if (botaoPaginaAnterior && botaoProximaPagina && gradeGaleria) {
  botaoPaginaAnterior.addEventListener("click", () => {
    if (paginaAtual > 1) {
      paginaAtual -= 1;
      renderizarPaginaGaleria();
    }
  });

  botaoProximaPagina.addEventListener("click", () => {
    if (paginaAtual < totalPaginas) {
      paginaAtual += 1;
      renderizarPaginaGaleria();
    }
  });

  // Constrói a lista final da galeria com:
  // caminho local da imagem, fallback remoto, texto alternativo e legenda.
  function carregarItensGaleria() {
    itensGaleria = itensGaleriaBase.map((item, indice) => ({
      src: `img/${item.file}`,
      fallback: imagensFallback[indice % imagensFallback.length],
      alt: item.titulo,
      caption: item.titulo,
    }));
    totalPaginas = Math.max(1, Math.ceil(itensGaleria.length / itensPorPagina));
    paginaAtual = 1;
    renderizarPaginaGaleria();
  }

  carregarItensGaleria();
}

const contadores = document.querySelectorAll(".contador");
let contadoresIniciados = false;

// Anima os números do painel com duração fixa e curva de easing cúbica.
// Isso dá sensação de aceleração/desaceleração mais suave que linear.
function animarContadores() {
  contadores.forEach((contador) => {
    const alvo = Number(contador.dataset.target || 0);
    const sufixo = contador.dataset.suffix || "";
    const duracao = 1300;
    const inicio = performance.now();

    function atualizar(agora) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      const suavizado = 1 - Math.pow(1 - progresso, 3);
      const valor = Math.round(alvo * suavizado);
      contador.textContent = `${valor}${sufixo}`;

      if (progresso < 1) {
        requestAnimationFrame(atualizar);
      }
    }

    requestAnimationFrame(atualizar);
  });
}

// Inicia os contadores só quando a seção #maior entra em foco,
// evitando animações fora da visão do usuário e execução desnecessária.
const secaoMaiorDrone = document.querySelector("#maior");
if (secaoMaiorDrone) {
  const observadorContadores = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting && !contadoresIniciados) {
          contadoresIniciados = true;
          animarContadores();
        }
      });
    },
    { threshold: 0.35 }
  );

  observadorContadores.observe(secaoMaiorDrone);
}

// Botão voltar ao topo:
// aparece após certa rolagem e, ao clicar, faz scroll suave até o início.
if (botaoTopo) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 320) {
      botaoTopo.classList.add("mostrar");
    } else {
      botaoTopo.classList.remove("mostrar");
    }
  });

  botaoTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
