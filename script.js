function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  }
}

const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
  setTheme('dark');
}

document.addEventListener('DOMContentLoaded', () => {
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
  
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

    let contaAtual = []; // Array para armazenar os itens da conta

    menuItens.forEach(item => {
        const option = document.createElement('option');
        option.value = item.nome;
        option.textContent = `${item.nome} (R$ ${item.preco.toFixed(2)})`;
        itemSelect.appendChild(option);
    });

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
        }
    });

    function renderizarTabela() {
        tabelaContaBody.innerHTML = '';

        contaAtual.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.dataset.index = index;
            tr.innerHTML = `
                <td>${item.nome}</td>
                <td class="text-right">${item.quantidade}</td>
                <td class="text-right">R$ ${item.precoUnitario.toFixed(2)}</td>
                <td class="text-right">R$ ${item.totalItem.toFixed(2)}</td>
                <td class="text-center"><button class="btn-remover" data-index="${index}" title="Remover item">×</button></td>
            `;
            tabelaContaBody.appendChild(tr);
        });

        // Adiciona os event listeners para os botões de remoção
        document.querySelectorAll('.btn-remover').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                removerItem(index);
            });
        });
    }

    function removerItem(index) {
        if (index >= 0 && index < contaAtual.length) {
            contaAtual.splice(index, 1);
            renderizarTabela();
            atualizarSubtotal();
        }
    }

    function atualizarSubtotal() {
        const subtotal = contaAtual.reduce((acc, item) => acc + item.totalItem, 0);
        subtotalContaSpan.textContent = subtotal.toFixed(2);
        return subtotal;
    }

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
        resultadoFinalDiv.innerHTML = `Valor final com ${percentualGorjeta}% de gorjeta: R$ ${valorFinal.toFixed(2)}`;
        resultadoFinalDiv.style.display = 'block';
    });

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

    btnLimpar.addEventListener('click', limparConta);

    if (itemSelect.value) {
        itemSelect.dispatchEvent(new Event('change'));
    }
});

