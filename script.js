// Dados iniciais e formatações
document.addEventListener("DOMContentLoaded", () => {
  // Preencher data atual por padrão
  const dateInput = document.getElementById('inputDate');
  const today = new Date();
  const dateStr = today.toLocaleDateString('pt-BR');
  dateInput.value = dateStr;
  updateDate();

  // Load first item
  addItem('Despesas com Materiais', '0,00');
  addItem('Mão de obra e Instalação', '0,00');

  // Adicionar eventos de sincronização aos inputs básicos
  document.getElementById('inputDate').addEventListener('input', updateDate);
  document.getElementById('inputClient').addEventListener('input', updateClient);
  document.getElementById('inputTotal').addEventListener('input', updateTotal);
  document.getElementById('inputPayment').addEventListener('input', updatePayment);
  document.getElementById('inputDeadline').addEventListener('input', updateDeadline);
  document.getElementById('inputObs').addEventListener('input', updateObs);

  // Forçar atualização com valores iniciais
  updateDate();
  updateClient();
  updatePayment();
  updateDeadline();
  updateObs();
});

// Funções de Update Direto
function updateDate() {
  document.getElementById('outDate').innerText = document.getElementById('inputDate').value || '12/03/2026';
}
function updateClient() {
  document.getElementById('outClient').innerText = document.getElementById('inputClient').value || 'Não Especificado';
}
function updatePayment() {
  document.getElementById('outPayment').innerText = document.getElementById('inputPayment').value || '-';
}
function updateDeadline() {
  document.getElementById('outDeadline').innerText = document.getElementById('inputDeadline').value || '-';
}
function updateObs() {
  const val = document.getElementById('inputObs').value;
  const container = document.getElementById('outObsContainer');
  const span = document.getElementById('outObs');
  if(val && val.trim() !== '') {
    span.innerText = val;
    container.style.display = 'flex';
  } else {
    span.innerText = '';
    container.style.display = 'none';
  }
}

// Lógica de Itens
let items = [];
function addItem(desc = '', val = '') {
  const container = document.getElementById('itemsContainer');
  const id = Date.now() + Math.random().toString(16).slice(2);
  
  const div = document.createElement('div');
  div.className = 'item-row';
  div.id = `row-${id}`;
  div.innerHTML = `
    <input type="text" class="desc-input" placeholder="Descrição" value="${desc}" oninput="updateTable()">
    <input type="text" class="val-input" placeholder="Valor (0,00)" value="${val}" oninput="updateTable()" onblur="formatCurrency(this)">
    <button type="button" class="btn-del" onclick="removeItem('${id}')">X</button>
  `;
  container.appendChild(div);
  
  updateTable();
}

function removeItem(id) {
  const row = document.getElementById(`row-${id}`);
  if(row) row.remove();
  updateTable();
}

// Máscara / Formatador Básico Moeda
function formatCurrency(input) {
  let val = input.value.replace(/\D/g, ''); // só números
  if(!val) val = '0';
  const floatVal = parseFloat(val) / 100;
  input.value = floatVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  updateTable();
}

// Ligar/Desligar modo automático
function toggleManualTotal() {
  const isAuto = document.querySelector('input[name="calcType"]:checked').value === 'auto';
  const inputTotal = document.getElementById('inputTotal');
  if(isAuto) {
    inputTotal.setAttribute('readonly', 'true');
    inputTotal.style.backgroundColor = '#f9f9f9';
    updateTable(); // re-calculates
  } else {
    inputTotal.removeAttribute('readonly');
    inputTotal.style.backgroundColor = '#fff';
    // Se mudou pra manual, deixa o dev digitar
  }
}

// Atualiza PDF Table e Total
function updateTable() {
  const rows = document.querySelectorAll('.item-row');
  const outBody = document.getElementById('outTableBody');
  outBody.innerHTML = '';
  
  let totalNum = 0;

  if(rows.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td rowspan="1">Móveis sob medida</td><td colspan="2" style="text-align:center;">Nenhum item adicionado</td>`;
    outBody.appendChild(tr);
  } else {
    rows.forEach((row, index) => {
      const desc = row.querySelector('.desc-input').value;
      const valStr = row.querySelector('.val-input').value;
      const valText = valStr || '0,00';
      
      const tr = document.createElement('tr');
      let firstColHtml = '';
      if(index === 0) {
        firstColHtml = `<td rowspan="${rows.length}">Móveis sob medida</td>`;
      }
      
      tr.innerHTML = `
        ${firstColHtml}
        <td>${desc}</td>
        <td style="text-align: right;">${valText}</td>
      `;
      outBody.appendChild(tr);

      // Calc auto total
      const cleanVal = valStr.replace(/\./g, '').replace(',', '.');
      const valNum = parseFloat(cleanVal);
      if(!isNaN(valNum)) totalNum += valNum;
    });
  }

  // Atualiza sumário
  const isAuto = document.querySelector('input[name="calcType"]:checked').value === 'auto';
  if(isAuto) {
    const totalStr = totalNum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('inputTotal').value = totalStr;
    document.getElementById('outTotal').innerText = `R$ ${totalStr}`;
  }
}

function updateTotal() {
  const isAuto = document.querySelector('input[name="calcType"]:checked').value === 'auto';
  if(!isAuto) {
    const val = document.getElementById('inputTotal').value;
    document.getElementById('outTotal').innerText = `R$ ${val}`;
  }
}

// Gerar e Baixar O PDF
function generatePDF() {
  const btn = document.getElementById('btnGenerarPDF');
  btn.innerHTML = 'Gerando...';
  btn.disabled = true;

  const element = document.getElementById('pdfDocument');
  
  // Forçar largura exata para evitar que iOS/Mobile engula um pedaço do PDF e cause distorção
  element.style.width = '794px';
  element.style.minWidth = '794px';
  element.style.maxWidth = '794px';

  // Opções de alta fidelidade
  const opt = {
    margin:       0,
    filename:     `Orcamento_${document.getElementById('inputClient').value.trim().replace(/\s+/g,'_')}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, windowWidth: 794, width: 794, scrollY: 0, scrollX: 0 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['css', 'legacy'], avoid: 'tr' }
  };

  // Remover escala do mobile temporariamente para não "esmagar" a renderização do PDF
  const wrapper = document.querySelector('.a4-wrapper');
  const oldTransform = wrapper.style.transform;
  const oldMargin = wrapper.style.marginBottom;
  wrapper.style.transform = 'none';
  wrapper.style.marginBottom = '0';

  html2pdf().set(opt).from(element).save().then(() => {
    // Restaurar escala
    wrapper.style.transform = oldTransform;
    wrapper.style.marginBottom = oldMargin;

    btn.innerHTML = `
      <svg style="width: 18px; fill: white; margin-right: 8px;" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
      BAIXAR PDF (Pronto para enviar)
    `;
    btn.disabled = false;
  }).catch(e => {
    alert("Ocorreu um erro ao baixar: É possível que a logo.png esteja bloqueada (Segurança do Navegador). Hospede o site no GitHub Pages ou remova a imagem para testar.");
    wrapper.style.transform = oldTransform;
    wrapper.style.marginBottom = oldMargin;
    btn.innerHTML = 'BAIXAR PDF (Pronto para enviar)';
    btn.disabled = false;
    console.error(e);
  });
}
