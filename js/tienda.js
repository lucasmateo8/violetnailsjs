fetch("../data.json")
  .then((res) => res.json())
  .then((baseDeDatos) => {
    let carrito = [];
    const divisa = "$";
    const DOMitems = document.querySelector("#items");
    const DOMcarrito = document.querySelector("#carrito");
    const DOMtotal = document.querySelector("#total");
    const DOMbotonVaciar = document.querySelector("#boton-vaciar");
    const DOMbotonFinalizar = document.querySelector("#finalizar");

    if (localStorage.getItem("carrito")) {
      carrito = JSON.parse(localStorage.getItem("carrito"));
      console.log(carrito);
    }

    function renderizarProductos() {
      baseDeDatos.forEach((info) => {
        const miNodo = document.createElement("div");
        miNodo.classList.add("card", "col-sm-4");

        const miNodoCardBody = document.createElement("div");
        miNodoCardBody.classList.add("card-body");

        const miNodoTitle = document.createElement("h5");
        miNodoTitle.classList.add("card-title");
        miNodoTitle.textContent = info.nombre;

        const miNodoImagen = document.createElement("img");
        miNodoImagen.classList.add("img-fluid");
        miNodoImagen.setAttribute("src", info.imagen);

        const miNodoPrecio = document.createElement("p");
        miNodoPrecio.classList.add("card-text");
        miNodoPrecio.textContent = `${divisa}${info.precio}`;

        const miNodoBoton = document.createElement("button");
        miNodoBoton.classList.add("btn", "btn-primary");
        miNodoBoton.textContent = "Agregar al carro";
        miNodoBoton.setAttribute("marcador", info.id);
        miNodoBoton.addEventListener("click", anyadirProductoAlCarrito);

        miNodoBoton.addEventListener("click", () => {
          Toastify({
            text: "Producto Agregado 😏",
            className: "info",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
          }).showToast();
        });

        miNodoCardBody.appendChild(miNodoImagen);
        miNodoCardBody.appendChild(miNodoTitle);
        miNodoCardBody.appendChild(miNodoPrecio);
        miNodoCardBody.appendChild(miNodoBoton);
        miNodo.appendChild(miNodoCardBody);
        DOMitems.appendChild(miNodo);
      });
    }

    function anyadirProductoAlCarrito(evento) {
      carrito.push(evento.target.getAttribute("marcador"));

      renderizarCarrito();
    }

    function renderizarCarrito() {
      localStorage.setItem("carrito", JSON.stringify(carrito));

      DOMcarrito.textContent = "";

      const carritoSinDuplicados = [...new Set(carrito)];

      carritoSinDuplicados.forEach((item) => {
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
          return itemBaseDatos.id === parseInt(item);
        });

        const numeroUnidadesItem = carrito.reduce((total, itemId) => {
          return itemId === item ? (total += 1) : total;
        }, 0);

        const miNodo = document.createElement("li");
        miNodo.classList.add("list-group-item", "text-right", "mx-2");
        miNodo.textContent = `  ${numeroUnidadesItem} x ${miItem[0].nombre} - ${divisa}${miItem[0].precio}`;

        const miBoton = document.createElement("button");
        miBoton.classList.add("btn", "text-right", "btn-danger", "mx-5");
        miBoton.textContent = "X";
        miBoton.style.marginLeft = "1rem";
        miBoton.dataset.item = item;
        miBoton.addEventListener("click", borrarItemCarrito);

        miNodo.appendChild(miBoton);
        DOMcarrito.appendChild(miNodo);

        miBoton.addEventListener("click", () => {
          Toastify({
            text: "Producto Eliminado",
            className: "info",
            style: {
              background: "linear-gradient(to right, #fc4903, #fc8353)",
            },
          }).showToast();
        });
      });

      DOMtotal.textContent = calcularTotal();
    }

    function getElementsFromLocalStorage(carritoLS) {
      for (let i = 0; i < carritoLS.length; i++) {
        carrito.push(carritoLS[i]);
      }
      renderizarCarrito();
    }

    function borrarItemCarrito(evento) {
      const id = evento.target.dataset.item;

      carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
      });

      renderizarCarrito();
    }

    function calcularTotal() {
      return carrito
        .reduce((total, item) => {
          const miItem = baseDeDatos.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
          });

          return total + miItem[0].precio;
        }, 0)
        .toFixed(2);
    }

    function vaciarCarrito() {
      carrito = [];

      renderizarCarrito();
    }

    DOMbotonVaciar.addEventListener("click", vaciarCarrito);
    DOMbotonVaciar.addEventListener("click", () => {
      Toastify({
        text: "Carrito vacío ☹️",
        className: "info",
        style: {
          background: "linear-gradient(to right, #fc4903, #fc8353)",
        },
      }).showToast();
    });

    DOMbotonFinalizar.addEventListener("click", vaciarCarrito);
    DOMbotonFinalizar.addEventListener("click", () => {
      swal({
        title: "¡Compra finalizada con éxito!",
        text: "En 48hs recibirá su pedido.",
        icon: "success",
        button: "Finalizar.",
      });
    });

    renderizarProductos();
    renderizarCarrito();
  });
