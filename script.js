async function verificar() {
  const query = document.getElementById("texto").value.trim();
  const resultadosDiv = document.getElementById("resultados");

  if (!query) {
    resultadosDiv.innerHTML = "<p class='warning'>⚠ Digite algo para verificar.</p>";
    return;
  }

  resultadosDiv.innerHTML = "<p>Carregando...</p>";

  try {
    const resposta = await fetch(`https://verifica.onrender.com/verificar?q=${encodeURIComponent(query)}`);
    const dados = await resposta.json();

    if (!dados.claims || dados.claims.length === 0) {
      resultadosDiv.innerHTML = "<p class='warning'>⚠ Nenhuma checagem encontrada.</p>";
      return;
    }

    let html = "<h2>Resultados encontrados:</h2>";

    dados.claims.forEach(c => {
      if (c.claimReview && c.claimReview.length > 0) {
        const review = c.claimReview[0];
        const rating = review.textualRating ? review.textualRating.trim().toLowerCase() : "desconhecido";

        // Define a classe CSS e ícone baseado na classificação
        let classeClassificacao = "";
        let icone = "";

        if (rating.includes("falso") || rating.includes("falsa")) {
          classeClassificacao = "falso";
          icone = "❌";
        } else if (rating.includes("enganoso") || rating.includes("enganosa")) {
          classeClassificacao = "enganoso";
          icone = "⚠️";
        } else if (rating.includes("errado")) {
          classeClassificacao = "errado";
          icone = "⛔";
        } else if (rating.includes("verdadeiro") || rating.includes("verdadeira") || rating.includes("verdade")) {
          classeClassificacao = "verdadeiro";
          icone = "✅";
        } else {
          classeClassificacao = "neutro";
          icone = "ℹ️";
        }

        html += `
          <div class="item">
            <p class="afirmacao"><strong>Afirmação:</strong> ${c.text}</p>
            <p class="classificacao ${classeClassificacao}">
              ${icone} <strong>Classificação:</strong> ${review.textualRating}
            </p>
            <p class="fonte">
              <strong>Fonte:</strong> <a href="${review.url}" target="_blank">${review.publisher.name}</a>
            </p>
          </div>
        `;
      }
    });

    resultadosDiv.innerHTML = html;
  } catch (erro) {
    resultadosDiv.innerHTML = "<p class='error'>❌ Erro ao buscar resultados.</p>";
    console.error(erro);
  }
}
