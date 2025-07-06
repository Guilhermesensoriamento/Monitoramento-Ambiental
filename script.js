const canais = {
  UFSM: 3004213,
  BR386: 3004216,
  Urbana: 3004220
};

const sensores = [
  { campo: 1, nome: "MQ135", cor: "green" },
  { campo: 2, nome: "MQ4", cor: "orange" },
  { campo: 3, nome: "MQ7", cor: "violet" },
  { campo: 4, nome: "Temperatura", cor: "blue" },
  { campo: 5, nome: "Umidade", cor: "red" }
];

async function carregarDados(canalID, campo, graficoID, cor) {
  const url = `https://api.thingspeak.com/channels/${canalID}/fields/${campo}.json?results=20`;
  const resposta = await fetch(url);
  const dados = await resposta.json();
  const valores = dados.feeds.map(feed => parseFloat(feed[`field${campo}`]));
  const tempos = dados.feeds.map(feed => new Date(feed.created_at).toLocaleTimeString());

  new Chart(document.getElementById(graficoID), {
    type: 'line',
    data: {
      labels: tempos,
      datasets: [{
        label: graficoID,
        data: valores,
        borderColor: cor,
        backgroundColor: cor,
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// UFSM
sensores.forEach(sensor => {
  carregarDados(canais.UFSM, sensor.campo, `graficoUFSM_${sensor.nome}`, sensor.cor);
});

// BR-386
sensores.forEach(sensor => {
  carregarDados(canais.BR386, sensor.campo, `graficoBR_${sensor.nome}`, sensor.cor);
});

// Urbana
sensores.forEach(sensor => {
  carregarDados(canais.Urbana, sensor.campo, `graficoUrb_${sensor.nome}`, sensor.cor);
});
