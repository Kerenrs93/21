
let baraja=[],
    palos=['S','C','D','H'],
    figuras=['J','Q','K','A'],
    participantes=[],
    puntosJugador=0,
    puntosPC=0;


const btnNuevo=document.querySelector('#btnNuevo'),
      btnPedirCarta=document.querySelector('#btnPedirCarta'),
      btnDetener=document.querySelector('#btnDetener');
      btnSalir=document.querySelector('#btnSalir');
      btnCambiarNombre=document.querySelector('#btnCambiarNombre');
      puntajeJugador=document.querySelector('#puntajeJugador');
      puntajePC=document.querySelector('#puntajePC');
      cartasJugador=document.querySelector('#cartasJugador'),
      cartasPC=document.querySelector('#cartasPC');
      nombreJugador= document.querySelector("#nombreJugador"); 
      divDeck = document.querySelector(".deck");
      imgDeck = document.querySelector(".tapa");

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

    moverCartaJugador("moviendo");
    setTimeout(() => {
        const carta = pedirCarta();
        puntosJugador=sumarPuntaje(puntosJugador, carta, puntajeJugador);
        crearImagenCarta(carta,cartasJugador);
        if(puntosJugador>21){
          turnoPC(puntosJugador);
          btnPedirCarta.disabled=true;
          btnDetener.disabled=true;
        }else if(puntosJugador===21){
          btnPedirCarta.disabled=true;
          btnDetener.disabled=true;
          turnoPC(puntosJugador);
        }
    }, 500);

});

btnDetener.addEventListener('click', ()=>{
    btnPedirCarta.disabled=true;
    btnDetener.disabled=true;
    turnoPC(puntosJugador);
});

btnSalir.addEventListener('click', ()=>{
    btnNuevo.disabled=false;
    btnCambiarNombre.style.display='inline';
    puntosJugador=0;
    puntosPC=0;
    puntajeJugador.innerText=0;
    puntajePC.innerText=0;
    cartasJugador.innerHTML='';
    cartasPC.innerHTML=''
});

btnCambiarNombre.addEventListener('click', ()=>{cambiarNombre();});

// divDeck.addEventListener("click",()=>{
//   moverCartaJugador();
// });


//FUNCION PARA SIMULAR EL MOVIMIENTO DEL MAZO

const moverCartaJugador=(moviendo)=>{
  imgDeck.classList.add(moviendo);
  setTimeout(() => {
    imgDeck.classList.remove(moviendo);
  }, 1000);
}

//Funcionalidad del juego

const crearBaraja=()=>{
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
    
    barajarCartas();

}

const barajarCartas=()=>baraja=_.shuffle(baraja);

const pedirCarta=()=>{return  baraja.length==0 ? alert('No hay mas cartas'): baraja.pop();}

const valorCarta=(carta)=>{
    const valor=carta.substring(0,carta.length-1);
    return isNaN(valor) ? (valor==='A' ? 11: 10):parseInt(valor);
}

const crearImagenCarta=(carta,jugador)=>{
    const imgCarta = document.createElement('img');
    imgCarta.src = `cartas/${carta}.png` ;
    imgCarta.classList.add("carta");
    jugador.append(imgCarta);
}

const sumarPuntaje=(puntos, carta, puntaje)=>{
    puntos=puntos + valorCarta(carta);
    puntaje.innerText=puntos;
    return puntos;
}

const turnoPC=(puntosJugador)=>{
  do{
    const carta = pedirCarta();
    moverCartaJugador("moviendoPC");
    puntosPC=sumarPuntaje(puntosPC, carta, puntajePC);
    crearImagenCarta(carta,cartasPC);
    if (puntosJugador>21) {
      break;
    }
  }while (puntosPC<puntosJugador && puntosJugador<=21);
    
    setTimeout(()=>{
      puntajeJugador===puntosPC ? Swal.fire("EMPATE") : 
      puntosJugador>21 ? Swal.fire("PERDISTE. GANO LA COMPUTADORA") : 
      puntosPC>21 ? Swal.fire("GANASTE"):
      Swal.fire("La computadora gano");
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
