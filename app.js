// ===================================================================================
// --- SELETORES GLOBAIS E ESTADO DO APLICATIVO ---
// ===================================================================================
const CHAVE_STORAGE = 'transacoes';
const CHAVE_ORCAMENTOS = 'orcamentos';
const CHAVE_CONFIG = 'configuracoes';
const CHAVE_CATEGORIAS = 'categorias';

let transacoes = carregarTransacoes();
let orcamentos = carregarOrcamentos();
let config = carregarConfig();
let categorias = carregarCategorias();
let dataVista = new Date();
let dataVistaFatura = new Date();
let modoEdicao = false;
let idEmEdicao = null;
let meuGraficoDePizza = null;
let termoBusca = '';
let filtroAtivo = 'todos';
let acaoConfirmacao = { acao: null, dados: null };

// Elementos da Interface Principal
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.overlay');
const menuToggleButton = document.querySelector('.menu-toggle');
const headerTitle = document.getElementById('header-title');
const headerSubtitle = document.getElementById('header-subtitle');

// Páginas
const pageDashboard = document.getElementById('page-dashboard');
const pageTransacoes = document.getElementById('page-transacoes');
const pageFatura = document.getElementById('page-fatura');
const pageRelatorio = document.getElementById('page-relatorio');
const pageConfiguracoes = document.getElementById('page-configuracoes');
const todasAsPaginas = [pageDashboard, pageTransacoes, pageFatura, pageRelatorio, pageConfiguracoes];

// Links de Navegação
const navDashboard = document.getElementById('nav-dashboard');
const navTransacoes = document.getElementById('nav-transacoes');
const navFatura = document.getElementById('nav-fatura');
const navRelatorio = document.getElementById('nav-relatorio');
const navConfiguracoes = document.getElementById('nav-configuracoes');

// Elementos do Dashboard
const listaTransacoesRecentes = document.getElementById('transacoes-recentes');
const totalReceitasElement = document.getElementById('total-receitas');
const totalDespesasElement = document.getElementById('total-despesas');
const saldoTotalElement = document.getElementById('saldo-total');

// Elementos do Histórico
const monthDisplay = document.getElementById('month-display');
const prevMonthBtn = document.getElementById('prev-month-btn');
const nextMonthBtn = document.getElementById('next-month-btn');
const listaHistoricoCompleto = document.getElementById('lista-historico-completo');
const campoBusca = document.getElementById('campo-busca');
const botoesFiltro = document.querySelectorAll('.filtro-btn');

// Elementos da Página de Fatura
const diaFechamentoInput = document.getElementById('dia-fechamento-fatura');
const btnSalvarFechamento = document.getElementById('btn-salvar-fechamento');
const faturaTotalElement = document.getElementById('fatura-total');
const faturaPeriodoElement = document.getElementById('fatura-periodo');
const faturaMonthDisplay = document.getElementById('fatura-month-display');
const faturaPrevMonthBtn = document.getElementById('fatura-prev-month-btn');
const faturaNextMonthBtn = document.getElementById('fatura-next-month-btn');
const listaFaturaCompleta = document.getElementById('lista-fatura-completa');

// Elementos do Relatório
const relatorioReceitas = document.getElementById('relatorio-receitas');
const relatorioDespesas = document.getElementById('relatorio-despesas');
const relatorioSaldo = document.getElementById('relatorio-saldo');
const relatorioListaCategorias = document.getElementById('relatorio-lista-categorias');
const ctx = document.getElementById('grafico-categorias').getContext('2d');
const progressoOrcamentosContainer = document.getElementById('progresso-orcamentos');

// Elementos de Orçamentos e Configurações
const formOrcamentos = document.getElementById('form-orcamentos');
const btnSalvarOrcamentos = document.getElementById('btn-salvar-orcamentos');
const collapsibles = document.querySelectorAll('.collapsible-header');
const listaCategoriasReceita = document.getElementById('lista-categorias-receita');
const listaCategoriasDespesa = document.getElementById('lista-categorias-despesa');
const inputNovaCategoriaReceita = document.getElementById('input-nova-categoria-receita');
const inputNovaCategoriaDespesa = document.getElementById('input-nova-categoria-despesa');
const btnsAddCategoria = document.querySelectorAll('.btn-add-categoria');

// Elementos do Modal de Transação e FAB
const fabAddTransacao = document.getElementById('fab-add-transacao');
const modalTransacao = document.getElementById('modal-transacao');
const closeModalBtn = document.getElementById('close-modal-btn');
const formTransacao = document.getElementById('form-transacao');
const btnAddTransacao = document.getElementById('btn-add-transacao');
const checkTransacaoFixa = document.getElementById('transacao-fixa');
const opcoesFixa = document.getElementById('opcoes-fixa');
const containerCartaoCredito = document.getElementById('container-cartao-credito');
const radiosTipoTransacao = document.querySelectorAll('input[name="tipo_transacao"]');

// Elementos do Modal de Confirmação
const modalConfirmacao = document.getElementById('modal-confirmacao');
const confirmacaoTitulo = document.getElementById('confirmacao-titulo');
const confirmacaoTexto = document.getElementById('confirmacao-texto');
const btnConfirmarExclusao = document.getElementById('btn-confirmar-exclusao');
const btnCancelarExclusao = document.getElementById('btn-cancelar-exclusao');

// Elementos do Modal de Categoria
const modalCategoria = document.getElementById('modal-categoria');
const seletorCategoriaBtn = document.getElementById('seletor-categoria');
const categoriaSelecionadaSpan = document.getElementById('categoria-selecionada');
const categoriaHiddenInput = document.getElementById('categoria-hidden');
const listaCategorias = document.getElementById('lista-categorias');
const closeModalCategoriaBtn = document.getElementById('close-modal-categoria-btn');

// Elementos do Modal de Detalhes da Categoria
const modalDetalhesCategoria = document.getElementById('modal-detalhes-categoria');
const tituloCategoriaDetalhe = document.getElementById('titulo-categoria-detalhe');
const listaDetalhesCategoria = document.getElementById('lista-detalhes-categoria');
const closeModalDetalhesBtn = document.getElementById('close-modal-detalhes-btn');

// Elementos do Modal de Observação
const modalObservacao = document.getElementById('modal-observacao');
const textoObservacao = document.getElementById('texto-observacao');
const btnFecharObservacao = document.getElementById('btn-fechar-observacao');

// Elementos do Modal de Informação
const modalInfo = document.getElementById('modal-info');
const infoTitulo = document.getElementById('info-titulo');
const infoTexto = document.getElementById('info-texto');
const btnFecharInfo = document.getElementById('btn-fechar-info');

// ===================================================================================
// --- FUNÇÕES DE LÓGICA E DADOS ---
// ===================================================================================
function carregarTransacoes() {
    const transacoesSalvas = localStorage.getItem(CHAVE_STORAGE);
    return JSON.parse(transacoesSalvas) || [];
}

function salvarTransacoes(transacoes) {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(transacoes));
}

function carregarOrcamentos() {
    const orcamentosSalvos = localStorage.getItem(CHAVE_ORCAMENTOS);
    return JSON.parse(orcamentosSalvos) || {};
}

function salvarOrcamentos() {
    const inputs = formOrcamentos.querySelectorAll('input');
    inputs.forEach(input => {
        const categoria = input.id.replace('orcamento-', '');
        const valorString = input.value;
        const valorNumerico = parseFloat(valorString.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
        if (valorNumerico > 0) {
            orcamentos[categoria] = valorNumerico;
        } else {
            delete orcamentos[categoria];
        }
    });
    localStorage.setItem(CHAVE_ORCAMENTOS, JSON.stringify(orcamentos));
    mostrarInfoModal('Sucesso!', 'Orçamentos salvos com sucesso!');
    atualizarTudo();
}

function carregarConfig() {
    const configSalva = localStorage.getItem(CHAVE_CONFIG);
    const defaultConfig = { diaFechamentoFatura: 20 };
    return JSON.parse(configSalva) || defaultConfig;
}

function salvarConfig() {
    localStorage.setItem(CHAVE_CONFIG, JSON.stringify(config));
}

function carregarCategorias() {
    const categoriasSalvas = localStorage.getItem(CHAVE_CATEGORIAS);
    const categoriasDefault = {
        receita: ['Salário', 'Freelance', 'Outros'],
        despesa: ['Ifood', 'Uber', 'Meu Ifood', 'Playstation', 'Internet', 'Moradia', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Outros']
    };
    return JSON.parse(categoriasSalvas) || categoriasDefault;
}

function salvarCategorias() {
    localStorage.setItem(CHAVE_CATEGORIAS, JSON.stringify(categorias));
}

function adicionarCategoria(tipo) {
    const input = tipo === 'receita' ? inputNovaCategoriaReceita : inputNovaCategoriaDespesa;
    const nome = input.value.trim();
    if (nome && !categorias[tipo].includes(nome)) {
        categorias[tipo].push(nome);
        salvarCategorias();
        renderizarGerenciadorCategorias();
        renderizarCategoriasModal();
        renderizarFormularioOrcamentos();
        input.value = '';
    } else if (!nome) {
        mostrarInfoModal('Atenção', 'O nome da categoria não pode ser vazio.');
    } else {
        mostrarInfoModal('Atenção', 'Esta categoria já existe.');
    }
}

function removerCategoria(tipo, nome) {
    categorias[tipo] = categorias[tipo].filter(c => c !== nome);
    salvarCategorias();
    renderizarGerenciadorCategorias();
    renderizarCategoriasModal();
    renderizarFormularioOrcamentos();
}

function processarNovaTransacao(event) {
    event.preventDefault();
    const descricaoInput = document.getElementById('descricao');
    const valorInput = document.getElementById('valor');
    const observacoesInput = document.getElementById('observacoes');
    const categoria = categoriaHiddenInput.value;
    const isCartao = document.getElementById('cartao-credito').checked;
    const tipo = formTransacao.querySelector('input[name="tipo_transacao"]:checked').value;
    let valor = parseFloat(valorInput.value);
    if (descricaoInput.value.trim() === '' || isNaN(valor) || valor <= 0) {
        mostrarInfoModal('Erro de Validação', 'Por favor, preencha a descrição e um valor válido.');
        return;
    }
    if (tipo === 'despesa') {
        valor = -Math.abs(valor);
    }
    if (modoEdicao && idEmEdicao) {
        const index = transacoes.findIndex(t => t.id === idEmEdicao);
        if (index !== -1) {
            transacoes[index].descricao = descricaoInput.value;
            transacoes[index].valor = valor;
            transacoes[index].categoria = categoria;
            transacoes[index].cartaoCredito = isCartao;
            transacoes[index].observacoes = observacoesInput.value.trim();
        }
    } else {
        const isFixa = document.getElementById('transacao-fixa').checked;
        const mesesInput = document.getElementById('meses');
        if (isFixa && mesesInput.value > 0) {
            const numeroDeMeses = parseInt(mesesInput.value);
            const dataBase = new Date();
            for (let i = 0; i < numeroDeMeses; i++) {
                const dataParcela = new Date(dataBase);
                dataParcela.setMonth(dataBase.getMonth() + i);
                transacoes.push({ id: dataParcela.getTime(), descricao: `${descricaoInput.value} (${i + 1}/${numeroDeMeses})`, valor, categoria, cartaoCredito: isCartao, observacoes: observacoesInput.value.trim() });
            }
        } else {
            transacoes.push({ id: new Date().getTime(), descricao: descricaoInput.value, valor, categoria, cartaoCredito: isCartao, observacoes: observacoesInput.value.trim() });
        }
    }
    salvarTransacoes(transacoes);
    atualizarTudo();
    modoEdicao = false;
    idEmEdicao = null;
    document.getElementById('transacao-fixa').disabled = false;
    btnAddTransacao.classList.add('btn-success');
    btnAddTransacao.innerText = 'Salvo ✔️';
    setTimeout(fecharModalTransacao, 1000);
}

function excluirTransacao(id) {
    transacoes = transacoes.filter(t => t.id !== id);
    salvarTransacoes(transacoes);
    atualizarTudo();
}

// ===================================================================================
// --- FUNÇÕES DE RENDERIZAÇÃO E UI (INTERFACE) ---
// ===================================================================================
function formatarParaMoeda(valor) {
    if (isNaN(valor) || !valor) return '';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function atualizarResumo(lista) {
    const valores = lista.map(t => t.valor);
    const receitas = valores.filter(v => v > 0).reduce((acc, v) => acc + v, 0);
    const despesas = valores.filter(v => v < 0).reduce((acc, v) => acc + v, 0);
    const saldo = receitas + despesas;
    totalReceitasElement.innerText = `R$ ${receitas.toFixed(2)}`;
    totalDespesasElement.innerText = `R$ ${Math.abs(despesas).toFixed(2)}`;
    saldoTotalElement.innerText = `R$ ${saldo.toFixed(2)}`;
    saldoTotalElement.classList.remove('receita', 'despesa');
    saldoTotalElement.classList.add(saldo >= 0 ? 'receita' : 'despesa');
}

function renderizarListaAgrupadaPorDia(lista, elementoLista, comBotoesDeAcao = false) {
    elementoLista.innerHTML = '';
    const listaOrdenada = [...lista].sort((a, b) => b.id - a.id);
    if (listaOrdenada.length === 0) {
        elementoLista.innerHTML = '<li>Nenhuma transação encontrada.</li>';
        return;
    }
    const grupos = listaOrdenada.reduce((acc, transacao) => {
        const data = new Date(transacao.id).toLocaleDateString('pt-BR');
        if (!acc[data]) { acc[data] = []; }
        acc[data].push(transacao);
        return acc;
    }, {});
    for (const data in grupos) {
        const dayGroup = document.createElement('div');
        dayGroup.className = 'day-group';
        const dateHeader = document.createElement('div');
        dateHeader.className = 'date-header';
        dateHeader.innerText = data;
        dayGroup.appendChild(dateHeader);
        grupos[data].forEach(transacao => {
            const tipo = transacao.valor > 0 ? 'receita' : 'despesa';
            const valorFormatado = `R$ ${Math.abs(transacao.valor).toFixed(2)}`;
            const item = document.createElement('li');
            item.classList.add(tipo);
            item.dataset.id = transacao.id;
            let botoesDeAcao = '';
            if (comBotoesDeAcao) {
                botoesDeAcao = `<button class="edit-btn" data-id="${transacao.id}">✏️</button><button class="delete-btn" data-id="${transacao.id}">&times;</button>`;
            }
            item.innerHTML = `<div class="transaction-info"><div class="transaction-details"><span>${transacao.descricao}</span></div>${transacao.observacoes ? `<p class="transaction-observation">${transacao.observacoes}</p>` : ''}</div><div class="transaction-value"><span>${valorFormatado}</span>${botoesDeAcao}</div>`;
            dayGroup.appendChild(item);
        });
        elementoLista.appendChild(dayGroup);
    }
}

function atualizarDashboard() {
    const hoje = new Date();
    const transacoesEfetivadas = transacoes.filter(t => new Date(t.id) <= hoje);
    atualizarResumo(transacoesEfetivadas);
    const transacoesDoMesAtual = transacoes.filter(t => new Date(t.id).getMonth() === hoje.getMonth() && new Date(t.id).getFullYear() === hoje.getFullYear());
    const transacoesRecentesLimitadas = [...transacoesDoMesAtual].sort((a, b) => b.id - a.id).slice(0, 5);
    renderizarListaAgrupadaPorDia(transacoesRecentesLimitadas, listaTransacoesRecentes, false);
}

function renderizarHistoricoCompleto() {
    monthDisplay.innerText = dataVista.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase());
    const mesAtual = dataVista.getMonth();
    const anoAtual = dataVista.getFullYear();
    let transacoesDoMes = transacoes.filter(t => new Date(t.id).getMonth() === mesAtual && new Date(t.id).getFullYear() === anoAtual);
    if (filtroAtivo === 'receitas') {
        transacoesDoMes = transacoesDoMes.filter(t => t.valor > 0);
    } else if (filtroAtivo === 'despesas') {
        transacoesDoMes = transacoesDoMes.filter(t => t.valor < 0);
    }
    if (termoBusca) {
        transacoesDoMes = transacoesDoMes.filter(t => t.descricao.toLowerCase().includes(termoBusca));
    }
    renderizarListaAgrupadaPorDia(transacoesDoMes, listaHistoricoCompleto, true);
}

function renderizarPaginaFatura() {
    const diaFechamento = config.diaFechamentoFatura;
    diaFechamentoInput.value = diaFechamento;
    faturaMonthDisplay.innerText = dataVistaFatura.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase());
    let dataFim = new Date(dataVistaFatura.getFullYear(), dataVistaFatura.getMonth(), diaFechamento);
    let dataInicio = new Date(dataFim);
    dataInicio.setMonth(dataInicio.getMonth() - 1);
    dataInicio.setDate(dataInicio.getDate() + 1);
    const transacoesFatura = transacoes.filter(t => {
        const dataTransacao = new Date(t.id);
        return t.cartaoCredito && dataTransacao >= dataInicio && dataTransacao <= dataFim;
    });
    const totalFatura = transacoesFatura.reduce((acc, t) => acc + Math.abs(t.valor), 0);
    faturaTotalElement.innerText = `R$ ${totalFatura.toFixed(2)}`;
    faturaPeriodoElement.innerText = `${dataInicio.toLocaleDateString('pt-BR')} - ${dataFim.toLocaleDateString('pt-BR')}`;
    renderizarListaAgrupadaPorDia(transacoesFatura, listaFaturaCompleta, true);
}

function renderizarRelatorio() {
    const mesAtual = dataVista.getMonth();
    const anoAtual = dataVista.getFullYear();
    const transacoesDoMes = transacoes.filter(t => new Date(t.id).getMonth() === mesAtual && new Date(t.id).getFullYear() === anoAtual);
    const receitasDoMes = transacoesDoMes.filter(t => t.valor > 0).reduce((acc, t) => acc + t.valor, 0);
    const despesasDoMes = transacoesDoMes.filter(t => t.valor < 0).reduce((acc, t) => acc + t.valor, 0);
    const saldoDoMes = receitasDoMes + despesasDoMes;
    relatorioReceitas.innerText = `R$ ${receitasDoMes.toFixed(2)}`;
    relatorioDespesas.innerText = `R$ ${Math.abs(despesasDoMes).toFixed(2)}`;
    relatorioSaldo.innerText = `R$ ${saldoDoMes.toFixed(2)}`;
    relatorioSaldo.classList.remove('receita', 'despesa');
    relatorioSaldo.classList.add(saldoDoMes >= 0 ? 'receita' : 'despesa');
    const despesasDoMesArray = transacoesDoMes.filter(t => t.valor < 0);
    const gastosPorCategoria = despesasDoMesArray.reduce((acc, despesa) => {
        const categoria = despesa.categoria || 'Outros';
        if (!acc[categoria]) acc[categoria] = 0;
        acc[categoria] += Math.abs(despesa.valor);
        return acc;
    }, {});
    relatorioListaCategorias.innerHTML = '';
    if (despesasDoMesArray.length === 0) {
        relatorioListaCategorias.innerHTML = '<p>Nenhuma despesa encontrada para este mês.</p>';
    } else {
        for (const categoria in gastosPorCategoria) {
            const item = document.createElement('div');
            item.className = 'category-report-item';
            item.innerHTML = `<span class="category-name">${categoria}</span><span class="category-total">R$ ${gastosPorCategoria[categoria].toFixed(2)}</span>`;
            relatorioListaCategorias.appendChild(item);
        }
    }
    const labels = Object.keys(gastosPorCategoria);
    const data = Object.values(gastosPorCategoria);
    if (meuGraficoDePizza) {
        meuGraficoDePizza.destroy();
    }
    if (despesasDoMesArray.length > 0) {
        meuGraficoDePizza = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Despesas por Categoria',
                    data: data,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#E7E9ED', '#7F7F7F', '#3F3F3F', '#1F1F1F'],
                }]
            },
            options: {
                responsive: true,
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        const categoriaClicada = meuGraficoDePizza.data.labels[index];
                        mostrarDetalhesCategoria(categoriaClicada);
                    }
                },
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Distribuição de Despesas' }
                }
            }
        });
    }
    renderizarProgressoOrcamentos();
}

function renderizarFormularioOrcamentos() {
    formOrcamentos.innerHTML = '';
    categorias.despesa.forEach(categoria => {
        if (categoria === 'Outros') return;
        const valorAtual = orcamentos[categoria] || 0;
        const formItem = document.createElement('div');
        formItem.className = 'orcamento-item';
        formItem.innerHTML = `<label for="orcamento-${categoria}">${categoria}</label><input type="text" inputmode="decimal" id="orcamento-${categoria}" placeholder="R$ 0,00" value="${formatarParaMoeda(valorAtual)}">`;
        formOrcamentos.appendChild(formItem);
    });
}

function renderizarProgressoOrcamentos() {
    progressoOrcamentosContainer.innerHTML = '';
    const mesAtual = dataVista.getMonth();
    const anoAtual = dataVista.getFullYear();
    const despesasDoMes = transacoes.filter(t => new Date(t.id).getMonth() === mesAtual && new Date(t.id).getFullYear() === anoAtual && t.valor < 0);
    let orcamentosDefinidos = false;
    for (const categoria in orcamentos) {
        orcamentosDefinidos = true;
        const gastoAtual = despesasDoMes.filter(t => t.categoria === categoria).reduce((acc, t) => acc + Math.abs(t.valor), 0);
        const limite = orcamentos[categoria];
        const porcentagem = Math.min((gastoAtual / limite) * 100, 100);
        let classeStatus = '';
        if (porcentagem >= 90 && porcentagem < 100) {
            classeStatus = 'alerta';
        } else if (porcentagem >= 100) {
            classeStatus = 'estourado';
        }
        const itemProgresso = document.createElement('div');
        itemProgresso.className = 'progresso-container';
        itemProgresso.innerHTML = `<div class="progresso-info"><span class="progresso-categoria">${categoria}</span><span class="progresso-valores">R$ ${gastoAtual.toFixed(2)} / R$ ${limite.toFixed(2)}</span></div><div class="barra-fundo"><div class="barra-progresso ${classeStatus}" style="width: ${porcentagem}%;"></div></div>`;
        progressoOrcamentosContainer.appendChild(itemProgresso);
    }
    if (!orcamentosDefinidos) {
        progressoOrcamentosContainer.innerHTML = '<p>Você ainda não definiu nenhum orçamento. Vá para a tela de Configurações para começar.</p>';
    }
}

function atualizarTudo() {
    atualizarDashboard();
    renderizarHistoricoCompleto();
    renderizarPaginaFatura();
    renderizarRelatorio();
}

function toggleOpcaoCartao() {
    const isDespesa = document.getElementById('tipo-despesa').checked;
    containerCartaoCredito.classList.toggle('hidden', !isDespesa);
}

function renderizarCategoriasModal() {
    listaCategorias.innerHTML = '';
    const tipoSelecionado = document.getElementById('tipo-despesa').checked ? 'despesa' : 'receita';
    const listaParaRenderizar = categorias[tipoSelecionado];
    listaParaRenderizar.forEach(categoria => {
        const item = document.createElement('li');
        item.textContent = categoria;
        item.dataset.value = categoria;
        listaCategorias.appendChild(item);
    });
}

function renderizarGerenciadorCategorias() {
    listaCategoriasReceita.innerHTML = '';
    categorias.receita.forEach(nome => {
        const item = document.createElement('li');
        item.innerHTML = `<span>${nome}</span><button class="btn-remover-categoria" data-tipo="receita" data-nome="${nome}">&times;</button>`;
        listaCategoriasReceita.appendChild(item);
    });
    listaCategoriasDespesa.innerHTML = '';
    categorias.despesa.forEach(nome => {
        const item = document.createElement('li');
        item.innerHTML = `<span>${nome}</span><button class="btn-remover-categoria" data-tipo="despesa" data-nome="${nome}">&times;</button>`;
        listaCategoriasDespesa.appendChild(item);
    });
}

function mostrarDetalhesCategoria(categoria) {
    tituloCategoriaDetalhe.textContent = `Despesas de "${categoria}"`;
    const mesAtual = dataVista.getMonth();
    const anoAtual = dataVista.getFullYear();
    const transacoesDaCategoria = transacoes.filter(t => new Date(t.id).getMonth() === mesAtual && new Date(t.id).getFullYear() === anoAtual && t.valor < 0 && t.categoria === categoria);
    renderizarListaAgrupadaPorDia(transacoesDaCategoria, listaDetalhesCategoria, true);
    modalDetalhesCategoria.classList.remove('hidden');
}

// ===================================================================================
// --- FUNÇÕES DE NAVEGAÇÃO E MODAL ---
// ===================================================================================
function fecharMenu() { sidebar.classList.remove('open'); overlay.classList.remove('active'); }
function abrirMenu() { sidebar.classList.add('open'); overlay.classList.add('active'); }

function mostrarPagina(idDaPagina, titulo, subtitulo) {
    todasAsPaginas.forEach(page => page.classList.add('hidden'));
    document.getElementById(idDaPagina).classList.remove('hidden');
    headerTitle.innerText = titulo;
    headerSubtitle.innerText = subtitulo;
    fabAddTransacao.classList.toggle('hidden', idDaPagina !== 'page-dashboard');
}

function abrirModalTransacao() {
    modoEdicao = false;
    idEmEdicao = null;
    formTransacao.reset();
    document.querySelector('#modal-transacao .modal-content h2').textContent = 'Nova Transação';
    btnAddTransacao.textContent = 'Adicionar';
    categoriaHiddenInput.value = 'Outros';
    categoriaSelecionadaSpan.textContent = 'Selecione a categoria';
    btnAddTransacao.classList.remove('btn-success');
    document.getElementById('transacao-fixa').disabled = false;
    opcoesFixa.classList.add('hidden');
    modalTransacao.classList.remove('hidden');
    toggleOpcaoCartao();
}

function abrirModalParaEditar(id) {
    modoEdicao = true;
    idEmEdicao = id;
    const transacao = transacoes.find(t => t.id === id);
    if (!transacao) return;
    document.getElementById('descricao').value = transacao.descricao.replace(/ \(\d+\/\d+\)$/, '');
    document.getElementById('valor').value = Math.abs(transacao.valor);
    document.getElementById('observacoes').value = transacao.observacoes;
    if (transacao.valor > 0) {
        document.getElementById('tipo-receita').checked = true;
    } else {
        document.getElementById('tipo-despesa').checked = true;
    }
    categoriaHiddenInput.value = transacao.categoria;
    categoriaSelecionadaSpan.textContent = transacao.categoria;
    document.getElementById('cartao-credito').checked = transacao.cartaoCredito;
    document.getElementById('transacao-fixa').checked = false;
    document.getElementById('transacao-fixa').disabled = true;
    opcoesFixa.classList.add('hidden');
    document.querySelector('#modal-transacao .modal-content h2').textContent = 'Editar Transação';
    btnAddTransacao.textContent = 'Salvar Alterações';
    modalTransacao.classList.remove('hidden');
    toggleOpcaoCartao();
}

function fecharModalTransacao() { modalTransacao.classList.add('hidden'); }
function fecharModalConfirmacao() { acaoConfirmacao = { acao: null, dados: null }; modalConfirmacao.classList.add('hidden'); }
function fecharModalCategoria() { modalCategoria.classList.add('hidden'); }
function fecharModalDetalhes() { modalDetalhesCategoria.classList.add('hidden'); }
function fecharModalObservacao() { modalObservacao.classList.add('hidden'); }
function fecharModalInfo() { modalInfo.classList.add('hidden'); }

function mostrarInfoModal(titulo, texto) {
    infoTitulo.textContent = titulo;
    infoTexto.textContent = texto;
    modalInfo.classList.remove('hidden');
}

function mostrarConfirmacaoModal(titulo, texto, dados, acao) {
    confirmacaoTitulo.textContent = titulo;
    confirmacaoTexto.textContent = texto;
    acaoConfirmacao = { acao, dados };
    modalConfirmacao.classList.remove('hidden');
}

// ===================================================================================
// --- EVENT LISTENERS ---
// ===================================================================================
menuToggleButton.addEventListener('click', () => sidebar.classList.contains('open') ? fecharMenu() : abrirMenu());
overlay.addEventListener('click', fecharMenu);
navDashboard.addEventListener('click', (e) => { e.preventDefault(); mostrarPagina('page-dashboard', 'Meu Painel', 'Resumo das suas finanças'); fecharMenu(); });
navTransacoes.addEventListener('click', (e) => { e.preventDefault(); dataVista = new Date(); renderizarHistoricoCompleto(); mostrarPagina('page-transacoes', 'Histórico', 'Navegue pelas suas transações'); fecharMenu(); });
navFatura.addEventListener('click', (e) => { e.preventDefault(); dataVistaFatura = new Date(); renderizarPaginaFatura(); mostrarPagina('page-fatura', 'Fatura do Cartão', 'Detalhes dos seus gastos no crédito'); fecharMenu(); });
navRelatorio.addEventListener('click', (e) => { e.preventDefault(); dataVista = new Date(); renderizarRelatorio(); mostrarPagina('page-relatorio', 'Relatório Mensal', 'Análise das suas finanças'); fecharMenu(); });
navConfiguracoes.addEventListener('click', (e) => { e.preventDefault(); renderizarFormularioOrcamentos(); renderizarGerenciadorCategorias(); mostrarPagina('page-configuracoes', 'Configurações', 'Ajustes do aplicativo'); fecharMenu(); });
prevMonthBtn.addEventListener('click', () => { dataVista.setMonth(dataVista.getMonth() - 1); renderizarHistoricoCompleto(); renderizarRelatorio(); });
nextMonthBtn.addEventListener('click', () => { dataVista.setMonth(dataVista.getMonth() + 1); renderizarHistoricoCompleto(); renderizarRelatorio(); });
faturaPrevMonthBtn.addEventListener('click', () => { dataVistaFatura.setMonth(dataVistaFatura.getMonth() - 1); renderizarPaginaFatura(); });
faturaNextMonthBtn.addEventListener('click', () => { dataVistaFatura.setMonth(dataVistaFatura.getMonth() + 1); renderizarPaginaFatura(); });

btnSalvarFechamento.addEventListener('click', () => {
    const novoDia = parseInt(diaFechamentoInput.value);
    if (novoDia >= 1 && novoDia <= 31) {
        config.diaFechamentoFatura = novoDia;
        salvarConfig();
        renderizarPaginaFatura();
    } else {
        mostrarInfoModal('Erro', 'Por favor, insira um dia válido (entre 1 e 31).');
    }
});

fabAddTransacao.addEventListener('click', abrirModalTransacao);
closeModalBtn.addEventListener('click', fecharModalTransacao);
modalTransacao.addEventListener('click', (e) => { if (e.target === modalTransacao) fecharModalTransacao(); });
formTransacao.addEventListener('submit', processarNovaTransacao);
checkTransacaoFixa.addEventListener('change', () => { opcoesFixa.classList.toggle('hidden', !checkTransacaoFixa.checked); });

listaHistoricoCompleto.addEventListener('click', (e) => {
    const editButton = e.target.closest('.edit-btn');
    if (editButton) { abrirModalParaEditar(parseInt(editButton.dataset.id)); return; }
    const deleteButton = e.target.closest('.delete-btn');
    if (deleteButton) {
        const id = parseInt(deleteButton.dataset.id);
        mostrarConfirmacaoModal('Confirmar Exclusão', 'Deseja mesmo excluir esta transação?', id, 'excluirTransacao');
    }
});

radiosTipoTransacao.forEach(radio => { radio.addEventListener('change', renderizarCategoriasModal); radio.addEventListener('change', toggleOpcaoCartao); });

btnCancelarExclusao.addEventListener('click', fecharModalConfirmacao);
btnConfirmarExclusao.addEventListener('click', () => {
    const { acao, dados } = acaoConfirmacao;
    if (acao === 'excluirTransacao') {
        excluirTransacao(dados);
    } else if (acao === 'removerCategoria') {
        removerCategoria(dados.tipo, dados.nome);
    }
    fecharModalConfirmacao();
});
modalConfirmacao.addEventListener('click', (e) => { if (e.target === modalConfirmacao) fecharModalConfirmacao(); });

seletorCategoriaBtn.addEventListener('click', () => { modalCategoria.classList.remove('hidden'); });
closeModalCategoriaBtn.addEventListener('click', fecharModalCategoria);
modalCategoria.addEventListener('click', (e) => { if (e.target === modalCategoria) fecharModalCategoria(); });
listaCategorias.addEventListener('click', (e) => { if (e.target.tagName === 'LI') { const valorSelecionado = e.target.dataset.value; categoriaHiddenInput.value = valorSelecionado; categoriaSelecionadaSpan.textContent = valorSelecionado; fecharModalCategoria(); } });
closeModalDetalhesBtn.addEventListener('click', fecharModalDetalhes);
modalDetalhesCategoria.addEventListener('click', (e) => { if (e.target === modalDetalhesCategoria) fecharModalDetalhes(); });

listaDetalhesCategoria.addEventListener('click', (e) => {
    const itemClicado = e.target.closest('li');
    if (itemClicado) {
        const id = parseInt(itemClicado.dataset.id);
        const transacao = transacoes.find(t => t.id === id);
        if (transacao) { textoObservacao.textContent = transacao.observacoes || 'Nenhuma observação para esta transação.'; modalObservacao.classList.remove('hidden'); }
    }
});

btnFecharObservacao.addEventListener('click', fecharModalObservacao);
modalObservacao.addEventListener('click', (e) => { if (e.target === modalObservacao) fecharModalObservacao(); });
campoBusca.addEventListener('input', (e) => { termoBusca = e.target.value.trim().toLowerCase(); renderizarHistoricoCompleto(); });
botoesFiltro.forEach(btn => { btn.addEventListener('click', () => { botoesFiltro.forEach(b => b.classList.remove('active')); btn.classList.add('active'); filtroAtivo = btn.dataset.filtro; renderizarHistoricoCompleto(); }); });
btnSalvarOrcamentos.addEventListener('click', (e) => { e.preventDefault(); salvarOrcamentos(); });

collapsibles.forEach(header => {
    header.addEventListener('click', () => {
        header.parentElement.classList.toggle('open');
    });
});

btnsAddCategoria.forEach(btn => {
    btn.addEventListener('click', () => {
        adicionarCategoria(btn.dataset.tipo);
    });
});

const gerenciarCategoriasListeners = (e) => {
    if (e.target.classList.contains('btn-remover-categoria')) {
        const { tipo, nome } = e.target.dataset;
        mostrarConfirmacaoModal('Confirmar Remoção', `Deseja mesmo remover a categoria "${nome}"?`, { tipo, nome }, 'removerCategoria');
    }
};
listaCategoriasReceita.addEventListener('click', gerenciarCategoriasListeners);
listaCategoriasDespesa.addEventListener('click', gerenciarCategoriasListeners);

formOrcamentos.addEventListener('blur', (e) => {
    if (e.target.matches('input[id^="orcamento-"]')) {
        const input = e.target;
        let valorString = input.value.replace('R$', '').trim();
        let valorNumerico = parseFloat(valorString.replace(/\./g, '').replace(',', '.'));
        if (!isNaN(valorNumerico) && valorNumerico > 0) {
            input.value = formatarParaMoeda(valorNumerico);
        } else {
            input.value = '';
        }
    }
}, true);

btnFecharInfo.addEventListener('click', fecharModalInfo);
modalInfo.addEventListener('click', (e) => { if (e.target === modalInfo) { fecharModalInfo(); } });

// ===================================================================================
// --- INICIALIZAÇÃO DO APP ---
// ===================================================================================
function init() {
    renderizarCategoriasModal();
    renderizarFormularioOrcamentos();
    renderizarGerenciadorCategorias();
    mostrarPagina('page-dashboard', 'Meu Painel', 'Resumo das suas finanças');
    atualizarTudo();
}

init();
