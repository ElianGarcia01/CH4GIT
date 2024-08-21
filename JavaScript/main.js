
// API Rick And Morty
let urlApi = "https://aulamindhub.github.io/amazing-api/events.json"

// Crear una constante para llamar una funcion
const { createApp } = Vue

// createApp es una funcion que recibe un objeto
const app = createApp({
  data() {
    return {
      productos: [],
      productosCopy: [],
      productosPast: [],
      productosCopyPast: [],
      productosUp: [],
      productosCopyUp: [],
      categorias: [],
      textoBuscador: '',
      currentDate: '',
      categoriaSelec: [],
      favoritos: [],
      detalles: {}
    }

  },
  created() {
    this.obtenerDatos(urlApi)
    let datosLocal = JSON.parse(localStorage.getItem('favoritos'))
    if (datosLocal) {
      this.favoritos = datosLocal
    }

  },
  methods: {
    obtenerDatos(url) {
      fetch(url).then(response => response.json()).then(data => {

        this.currentDate = data.currentDate
        this.productos = data.events
        this.productosCopy = data.events
        this.productosUp = this.productos.filter(producto => producto.date > this.currentDate)
        this.productosCopyUp = this.productos.filter(producto => producto.date > this.currentDate)
        this.productosPast = this.productos.filter(producto => producto.date < this.currentDate)
        this.productosCopyPast = this.productos.filter(producto => producto.date < this.currentDate)
        this.categorias = Array.from(new Set(this.productos.map(event => event.category)))
        this.productoDetails()

      })

    },
    agregarFavorito(producto) {
      if (!this.favoritos.includes(producto)) {
        this.favoritos.push(producto)
        localStorage.setItem('favoritos', JSON.stringify(this.favoritos))
      }

    },
    quitarFavorito(producto) {
      this.favoritos.splice(producto, 1)
      localStorage.setItem('favoritos', JSON.stringify(this.favoritos))
    },
    productoDetails() {
      // URL Search Params
      const urlParams = new URLSearchParams(window.location.search)

      const idGet = urlParams.get('id')

      this.detalles = this.productosCopy.find(producto => producto._id === parseInt(idGet))
    }

  },
  computed: {
    // FILTRO PARA PAGINA HOME
    superFiltro() {
      // Filtro de texto
      let filtroTexto = this.productosCopy.filter(producto => producto.name.toLowerCase().includes(this.textoBuscador.toLowerCase()) || producto.description.toLowerCase().includes(this.textoBuscador.toLowerCase()))

      // Verificar si el arreglo de categorias seleccionadas se encuentre vacio o no
      if (this.categoriaSelec.length == 0) {
        this.productos = filtroTexto
      } else {
        this.productos = filtroTexto.filter(producto => producto.category.includes(this.categoriaSelec))
        console.log(this.categoriaSelec)

      }
    },
    // FILTROS PARA PAGINA UPCOMINGS
    superFiltroUp() {
      // Filtro de texto
      let filtroTexto = this.productosCopyUp.filter(producto => producto.name.toLowerCase().includes(this.textoBuscador.toLowerCase()) || producto.description.toLowerCase().includes(this.textoBuscador.toLowerCase()))

      // Verificar si el arreglo de categorias seleccionadas se encuentre vacio o no
      if (this.categoriaSelec.length == 0) {
        this.productosUp = filtroTexto
      } else {
        this.productosUp = filtroTexto.filter(producto => producto.category.includes(this.categoriaSelec))
      }
    },
    // FILTROS PARA PAGINA PAST
    superFiltroPast() {
      // Filtro de texto
      let filtroTexto = this.productosCopyPast.filter(producto => producto.name.toLowerCase().includes(this.textoBuscador.toLowerCase()) || producto.description.toLowerCase().includes(this.textoBuscador.toLowerCase()))

      // Verificar si el arreglo de categorias seleccionadas se encuentre vacio o no
      if (this.categoriaSelec.length == 0) {
        this.productosPast = filtroTexto
      } else {
        this.productosPast = filtroTexto.filter(producto => producto.category.includes(this.categoriaSelec))
      }
    }
  }
}).mount('#page')  //Montar en el createApp en el contenedor main