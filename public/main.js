document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('product-list');
  const productForm = document.getElementById('product-form');

  const apiUrl = 'http://localhost:3000/api/products';

  // Função para criar uma célula da tabela
  function createTableCell(value) {
    const cell = document.createElement('td');
    cell.textContent = value;
    return cell;
  }

  // Função para criar um botão com evento associado
  function createButton(label, onClick) {
    const button = document.createElement('button');
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  }

  // Função para buscar e exibir produtos
  async function fetchAndDisplayProducts() {
    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        console.error('Erro ao obter a lista de produtos. Status:', response.status);
        // Adicione lógica de tratamento de erro, se necessário.
        return;
      }

      const products = await response.json();

      productList.innerHTML = '';

      products.forEach((product) => {
        const row = document.createElement('tr');
        row.appendChild(createTableCell(product.code));
        row.appendChild(createTableCell(product.name));
        row.appendChild(createTableCell(product.description));
        row.appendChild(createTableCell(product.price));

        const actionsCell = document.createElement('td');
        actionsCell.appendChild(createButton('Editar', () => editProduct(product._id)));
        actionsCell.appendChild(createButton('Excluir', () => deleteProduct(product._id)));
        row.appendChild(actionsCell);

        productList.appendChild(row);
      });
    } catch (error) {
      console.error('Erro ao obter a lista de produtos:', error);
      // Adicione lógica de tratamento de erro, se necessário.
    }
  }

  // Função para enviar dados do formulário ao servidor
  async function submitForm(event) {
    event.preventDefault();

    const productData = {
      code: document.getElementById('product-code').value,
      name: document.getElementById('product-name').value,
      description: document.getElementById('product-description').value,
      price: document.getElementById('product-price').value,
    };

    const method = productForm.getAttribute('data-id') ? 'PUT' : 'POST';
    const url = productForm.getAttribute('data-id')
      ? `${apiUrl}/${productForm.getAttribute('data-id')}`
      : apiUrl;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        fetchAndDisplayProducts();
        productForm.reset();
      } else {
        console.error('Erro ao salvar o produto. Status:', response.status);
        // Adicione lógica de tratamento de erro, se necessário.
      }
    } catch (error) {
      console.error('Erro ao salvar o produto:', error);
      // Adicione lógica de tratamento de erro, se necessário.
    }
  }

  // Função para editar um produto
  window.editProduct = async function (productId) {
    try {
      const response = await fetch(`${apiUrl}/${productId}`);

      if (!response.ok) {
        console.error('Erro ao obter o produto. Status:', response.status);
        // Adicione lógica de tratamento de erro, se necessário.
        return;
      }

      const product = await response.json();

      productForm.setAttribute('data-id', product._id);
      document.getElementById('product-code').value = product.code;
      document.getElementById('product-name').value = product.name;
      document.getElementById('product-description').value = product.description;
      document.getElementById('product-price').value = product.price;
    } catch (error) {
      console.error('Erro ao obter o produto:', error);
      // Adicione lógica de tratamento de erro, se necessário.
    }
  };

  // Função para excluir um produto
  window.deleteProduct = async function (productId) {
    try {
      const response = await fetch(`${apiUrl}/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAndDisplayProducts();
      } else {
        console.error('Erro ao excluir o produto. Status:', response.status);
        // Adicione lógica de tratamento de erro, se necessário.
      }
    } catch (error) {
      console.error('Erro ao excluir o produto:', error);
      // Adicione lógica de tratamento de erro, se necessário.
    }
  };

  // Evento para enviar o formulário quando for submetido
  productForm.addEventListener('submit', submitForm);

  // Inicializar a exibição dos produtos
  fetchAndDisplayProducts();
});
