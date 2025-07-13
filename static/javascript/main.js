// Menu hambúrguer responsivo
const menuToggle = document.getElementById('menu-toggle');
const nav = document.querySelector('.navbar nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
  menuToggle.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      nav.classList.toggle('active');
    }
  });
  // Fecha menu ao clicar em link (mobile)
  document.querySelectorAll('.navbar nav a').forEach(link => {
    link.addEventListener('click', () => {
      if(window.innerWidth < 700) nav.classList.remove('active');
    });
  });
}

// Função para gerar o HTML de cada produto
function criarCardProduto(produto) {
  const icones = {
    shopee: 'https://cdn.icon-icons.com/icons2/2429/PNG/512/shopee_logo_icon_147252.png',
    mercadolivre: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/mercado_livre_logo_icon_170561.png',
    americanas: 'https://logodownload.org/wp-content/uploads/2020/11/lojas-americanas-logo-0.png'
  };
  const iconeLoja = icones[produto.loja?.toLowerCase()] || '';

  return `
    <div class="product-card">
      <img class="product-image" src="${produto.foto}" alt="${produto.nome}">
      <div class="product-title">${produto.nome}</div>
      <div class="price-area">
        <span class="old-price">${produto.precoAntigo}</span>
        <span class="new-price">${produto.precoNovo}</span>
        <span class="discount">-${produto.desconto}%</span>
      </div>
      ${produto.cupom ? `
      <div class="coupon-area">
        <span>Use o cupom:</span>
        <strong>${produto.cupom}</strong>
      </div>` : ''}
      <div class="store-area">
        ${iconeLoja ? `<img class="store-icon" src="${iconeLoja}" alt="${produto.loja}">` : ''}
        <span class="store-name">${produto.loja}</span>
      </div>
      <a class="buy-btn" href="${produto.link}" target="_blank">Ir para a loja</a>
    </div>
  `;
}

// Função para buscar e exibir produtos (Home)
function carregarProdutos() {
  fetch('/produtos')
    .then(res => res.json())
    .then(produtos => {
      console.log('Produtos recebidos do backend:', produtos); // <-- Adicione esta linha
      const container = document.querySelector('.container');
      if (!container) return;
      if (!Array.isArray(produtos) || produtos.length === 0) {
        container.innerHTML = '<p style="color:#888;text-align:center;">Nenhum produto cadastrado.</p>';
        return;
      }
      container.innerHTML = produtos.map(criarCardProduto).join('');
    })
    .catch((err) => {
      const container = document.querySelector('.container');
      if (container) container.innerHTML = '<p style="color:#888;text-align:center;">Não foi possível carregar os produtos.</p>';
      console.error('Erro ao buscar produtos:', err); // <-- Adicione esta linha
    });
}

window.addEventListener('DOMContentLoaded', carregarProdutos);

// Integração do formulário de cadastro de produto (criador.html)
const productForm = document.getElementById('product-form');
if (productForm) {
  productForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const produto = {
      id: document.getElementById('id').value,
      nome: document.getElementById('nome').value,
      foto: document.getElementById('foto').value,
      link: document.getElementById('link').value,
      precoAntigo: document.getElementById('preco-antigo').value,
      precoNovo: document.getElementById('preco-novo').value,
      desconto: document.getElementById('desconto').value,
      cupom: document.getElementById('cupom').value,
      loja: document.getElementById('loja').value
    };

    fetch('/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produto)
    })
    .then(res => res.json())
    .then(data => {
      alert('Produto cadastrado com sucesso!');
      productForm.reset();
      const preview = document.getElementById('preview');
      if (preview) preview.style.display = 'none';
    })
    .catch(() => {
      alert('Erro ao cadastrar produto!');
    });
  });

  // Preview da imagem ao colar a URL
  const fotoInput = document.getElementById('foto');
  const preview = document.getElementById('preview');
  if (fotoInput && preview) {
    fotoInput.addEventListener('input', function() {
      if (fotoInput.value) {
        preview.src = fotoInput.value;
        preview.style.display = 'block';
      } else {
        preview.style.display = 'none';
      }
    });
  }
}