// Dark mode functionality
function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  }
}

// Check for saved user preference, if any, on load
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
  setTheme('dark');
}

document.addEventListener('DOMContentLoaded', () => {
  // Dark mode toggle event listener
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  darkModeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  });
    const menuItens = [
        { nome: "Pizza", preco: 40.00 },
        { nome: "Lasanha", preco: 30.00 },
        { nome: "Refrigerante", preco: 8.00 },
        { nome: "Água", preco: 5.00 },
        { nome: "Suco Natural", preco: 10.00 },
        { nome: "Sobremesa", preco: 15.00 }
    ];

    const itemSelect = document.getElementById('item-select');
    const precoUnitarioInput = document.getElementById('preco-unitario');
    const quantidadeInput = document.getElementById('quantidade');
    const btnAdicionar = document.getElementById('btn-adicionar');
    const tabelaContaBody = document.querySelector('#tabela-conta tbody');
    const subtotalContaSpan = document.getElementById('subtotal-conta');
    const gorjetaPercentualInput = document.getElementById('gorjeta-percentual');
    const btnFecharConta = document.getElementById('btn-fechar-conta');
    const btnLimpar = document.getElementById('btn-limpar');
    const resultadoFinalDiv = document.getElementById('resultado-final-div');
  
  // Set initial theme on page load
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

    let contaAtual = []; // Array para armazenar os itens da conta

    // 1. Popular o dropdown de itens
    menuItens.forEach(item => {
        const option = document.createElement('option');
        option.value = item.nome;
        option.textContent = `${item.nome} (R$ ${item.preco.toFixed(2)})`;
        itemSelect.appendChild(option);
    });

    // 2. Atualizar o preço unitário ao selecionar um item
    itemSelect.addEventListener('change', () => {
        const selectedItemNome = itemSelect.value;
        if (selectedItemNome) {
            const itemEncontrado = menuItens.find(item => item.nome === selectedItemNome);
            if (itemEncontrado) {
                precoUnitarioInput.value = `R$ ${itemEncontrado.preco.toFixed(2)}`;
            }
        } else {
            precoUnitarioInput.value = '';
        }
    });

    // 3. Adicionar item à tabela
    btnAdicionar.addEventListener('click', () => {
        const selectedItemNome = itemSelect.value;
        const quantidade = parseInt(quantidadeInput.value);

        if (!selectedItemNome) {
            alert("Por favor, selecione um item.");
            return;
        }
        if (isNaN(quantidade) || quantidade < 1) {
            alert("Por favor, informe uma quantidade válida.");
            return;
        }

        const itemDoMenu = menuItens.find(item => item.nome === selectedItemNome);
        if (itemDoMenu) {
            const itemNaConta = {
                nome: itemDoMenu.nome,
                quantidade: quantidade,
                precoUnitario: itemDoMenu.preco,
                totalItem: itemDoMenu.preco * quantidade
            };
            contaAtual.push(itemNaConta);
            renderizarTabela();
            atualizarSubtotal();
            // Limpar campos para próxima adição (opcional)
            // itemSelect.value = "";
            // precoUnitarioInput.value = "";
            // quantidadeInput.value = 1;
        }
    });

    // 4. Renderizar a tabela de itens da conta
    function renderizarTabela() {
        tabelaContaBody.innerHTML = ''; // Limpa a tabela antes de renderizar

        contaAtual.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.nome}</td>
                <td class="text-right">${item.quantidade}</td>
                <td class="text-right">R$ ${item.precoUnitario.toFixed(2)}</td>
                <td class="text-right">R$ ${item.totalItem.toFixed(2)}</td>
            `;
            tabelaContaBody.appendChild(tr);
        });
    }

    // 5. Atualizar o subtotal da conta
    function atualizarSubtotal() {
        const subtotal = contaAtual.reduce((acc, item) => acc + item.totalItem, 0);
        subtotalContaSpan.textContent = subtotal.toFixed(2);
        return subtotal;
    }

    // 6. Fechar conta e calcular gorjeta
    btnFecharConta.addEventListener('click', () => {
        const subtotal = atualizarSubtotal();
        if (subtotal === 0) {
            alert("Adicione itens à conta antes de fechar.");
            return;
        }

        const percentualGorjeta = parseFloat(gorjetaPercentualInput.value);
        if (isNaN(percentualGorjeta) || percentualGorjeta < 0) {
            alert("Por favor, informe um percentual de gorjeta válido.");
            return;
        }

        const valorGorjeta = subtotal * (percentualGorjeta / 100);
        const valorFinal = subtotal + valorGorjeta;

        resultadoFinalDiv.innerHTML = `
            Subtotal: R$ ${subtotal.toFixed(2)}<br>
            Gorjeta (${percentualGorjeta}%): R$ ${valorGorjeta.toFixed(2)}<br>
            <strong>Valor Final: R$ ${valorFinal.toFixed(2)}</strong>
        `;
        // No exemplo original, ele mostrava apenas o valor final com a porcentagem da gorjeta
        // Para seguir o exemplo da imagem:
        resultadoFinalDiv.innerHTML = `Valor final com ${percentualGorjeta}% de gorjeta: R$ ${valorFinal.toFixed(2)}`;
        resultadoFinalDiv.style.display = 'block';
    });

    // Função para limpar toda a conta
    function limparConta() {
        contaAtual = [];
        renderizarTabela();
        subtotalContaSpan.textContent = '0.00';
        resultadoFinalDiv.style.display = 'none';
        itemSelect.value = '';
        precoUnitarioInput.value = '';
        quantidadeInput.value = '1';
        gorjetaPercentualInput.value = '10';
    }

    // Adiciona evento de clique ao botão Limpar Tudo
    btnLimpar.addEventListener('click', limparConta);

    // Inicializa o campo de preço se um item já estiver selecionado ao carregar (pouco provável com o "--Selecione--")
    if (itemSelect.value) {
        itemSelect.dispatchEvent(new Event('change'));
    }
});

// Adiciona uma classe para alinhar texto à direita via CSS
// (Opcional, pode ser feito diretamente no CSS como já está)
// Mas se quiser fazer via JS, aqui está um exemplo
// document.querySelectorAll('#tabela-conta th:nth-child(n+2), #tabela-conta td:nth-child(n+2)').forEach(el => {
//     el.classList.add('text-right');
// });
