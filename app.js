
let baraja=[];
let palos=['S','C','D','H'];
let figuras=['J','Q','K','A'];
let participantes=[];
let puntosJugador=0;
let puntosPC=0;

const btnNuevo=document.querySelector('#btnNuevo'),
    btnPedirCarta=document.querySelector('#btnPedirCarta'),
    btnDetener=document.querySelector('#btnDetener');
    btnSalir=document.querySelector('#btnSalir');
    btnCambiarNombre=document.querySelector('#btnCambiarNombre');

const puntajeJugador=document.querySelector('#puntajeJugador');
const puntajePC=document.querySelector('#puntajePC');
const cartasJugador=document.querySelector('#cartasJugador');
const cartasPC=document.querySelector('#cartasPC');
const nombreJugador= document.querySelector("#nombreJugador"); 
const mazoCartas = document.querySelector(".barajas");



  btnNuevo.addEventListener('click', ()=>{
    if (baraja.length==0) {
      crearBaraja();
      mensajeInicioJuego();
    }
    btnNuevo.disabled=true;
    btnPedirCarta.disabled=false;
    btnDetener.disabled=false;
    puntosJugador=0;
    puntosPC=0;
    puntajeJugador.innerText=0;
    puntajePC.innerText=0;
    cartasJugador.innerHTML='';
    cartasPC.innerHTML=''
 });
 
  btnPedirCarta.addEventListener('click', ()=>{
    const carta = pedirCarta();
    puntosJugador=puntosJugador + valorCarta(carta);
    puntajeJugador.innerText=puntosJugador;
    const imgCarta = document.createElement('img');

    imgCarta.src = `cartas/${carta}.png` ;
    imgCarta.classList.add("carta");
    cartasJugador.append(imgCarta);

    if(puntosJugador>21){
      Swal.fire('Perdiste');
      turnoPC(puntosJugador);
      btnPedirCarta.disabled=true;
      btnDetener.disabled=true;
    }else if(puntosJugador===21){
      btnPedirCarta.disabled=true;
      btnDetener.disabled=true;
      turnoPC(puntosJugador);
    }
  });

  btnDetener.addEventListener('click', ()=>{
    btnPedirCarta.disabled=true;
    btnDetener.disabled=true;
    turnoPC(puntosJugador);
  });
  btnSalir.addEventListener('click', ()=>{
   //alert('Dio click en el boton Salir');
    btnNuevo.disabled=false;
    btnCambiarNombre.style.display='inline';
    puntosJugador=0;
    puntosPC=0;
    puntajeJugador.innerText=0;
    puntajePC.innerText=0;
    cartasJugador.innerHTML='';
    cartasPC.innerHTML=''
 });

  btnCambiarNombre.addEventListener('click', ()=>{
    cambiarNombre();
  })
  // mazoCartas.addEventListener("click", swap);


//FUNCION PARA SIMULAR EL MOVIMIENTO DEL MAZO
// [...mazoCartas.children].reverse().forEach(i => mazoCartas.append(i));



// function swap(e) {
//   let tapa = document.querySelector(".tapa:last-child");
//   if (e.target !== tapa) return;
//   tapa.style.animation = "swap 700ms forwards";

//   setTimeout(() => {
//     tapa.style.animation = "";
//     mazoCartas.prepend(tapa);
//   }, 700);
// }


//Funcionalidad del juego

const crearBaraja=()=>{
  baraja=[];
  for(let i=2;i<=10; i++)
  {
    
    for(let palosDeCartas of palos)
    {
      baraja.push(i+palosDeCartas);
    }
  }

  for(let figurasDeCartas of figuras)
  {
      for(let palosDeCartas of palos)
      {
        baraja.push(figurasDeCartas+palosDeCartas);
      }
  }
  baraja=_.shuffle(baraja);

}

const pedirCarta=()=>{
  return  baraja.length==0 ? alert('No hay mas cartas'): baraja.pop();
}

const valorCarta=(carta)=>{
  const valor=carta.substring(0,carta.length-1);
  return isNaN(valor) ? (valor==='A' ? 11: 10):parseInt(valor);
}

const turnoPC=(puntosJugador)=>{
  do{
    const carta = pedirCarta();
    puntosPC=puntosPC + valorCarta(carta);
    puntajePC.innerText=puntosPC;
    const imgCarta = document.createElement('img');
    imgCarta.src = `cartas/${carta}.png` ;
    imgCarta.classList.add("carta");
    cartasPC.append(imgCarta);

    if (puntosJugador>21) {
      break;
    }
  }while (puntosPC<puntosJugador && puntosJugador<=21);
    
    setTimeout(()=>{

      if (puntosJugador=== puntosPC) {
        Swal.fire("EMPATE");
      }else if(puntosJugador>21){
        Swal.fire("PERDISTE. GANO LA COMPUTADORA");
      }else if(puntosPC>21){
        Swal.fire("GANASTE");
      }else{
        Swal.fire("La computadora gano");
      }
    }, 1000);
    btnNuevo.disabled=false;  
}
const mensajeInicioJuego=()=>{
 let timerInterval
  Swal.fire({
    title: 'BLACKJACK',
    html: 'El juego comienza en <b></b> segundos.',
    timer: 3000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading()
      timerInterval = setInterval(() => {
        const content = Swal.getContent()
        if (content) {
          const b = content.querySelector('b')
          if (b) {
            b.textContent = (Swal.getTimerLeft() / 1000)
          .toFixed(0)
          }
        }
      }, 100)
    },
    willClose: () => {
      clearInterval(timerInterval)
    }
  }).then((result) => {

    if (result.dismiss === Swal.DismissReason.timer) {
    }
  })
}

const cambiarNombre=()=> {

  Swal.fire({
    title: 'Nombre del jugador',
    inputLabel: 'Ingrese su nombre',
    input: 'text',
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
    preConfirm: (login) => {
      return fetch(`//api.github.com/users/${login}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText)
          }
          return response.json()
        })
        .catch(error => {
          Swal.showValidationMessage(
            `Request failed: ${error}`
          )
        })
    },
    allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        nombreJugador.innerHTML=`${result.value.login}`;
        btnCambiarNombre.style.display='none';
      }
    })
}
