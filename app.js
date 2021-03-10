const jugador= document.getElementById("nombreJugador"); 



function cambiarNombre() {

  Swal.fire({
    title: 'Datos Personales',
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
        jugador.innerHTML=`${result.value.login}-0`
      }
    })
}

let mazoCartas = document.querySelector(".barajas");

[...mazoCartas.children].reverse().forEach(i => mazoCartas.append(i));

mazoCartas.addEventListener("click", swap);

function swap(e) {
  let tapa = document.querySelector(".tapa:last-child");
  if (e.target !== tapa) return;
  tapa.style.animation = "swap 700ms forwards";

  setTimeout(() => {
    tapa.style.animation = "";
    mazoCartas.prepend(tapa);
  }, 700);
}


//Funcionalidad del juego
  let baraja=[];
  let palos=['S','C','D','H'];
  let figuras=['J','Q','K','A'];

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
  mensajeInicioJuego();
}

const pedirCarta=()=>{
  return  baraja.length==0 ? alert('No hay mas cartas'): baraja.pop();
}

const valorCarta=(carta)=>{
  const valor=carta.substring(0,carta.length-1);
  return isNaN(valor) ? (valor==='A' ? 11: 10):parseInt(valor);
}

const mostrarCartas=()=>{
  
  let jugadores=document.querySelectorAll('.jugadores');
  
  for (let jugador of jugadores) {
    console.log(jugador.getAttribute('id'));
    
    for (let i = 0; i <=1; i++) {
      let carta=pedirCarta()+'.png';
      console.log(carta);
      let imgCarta=document.createElement("img");
      i==0 ?imgCarta.src = "/cartas/"+carta : imgCarta.src = "cartas/red_back.png" ;
      imgCarta.classList.add("carta");
      jugador.append(imgCarta);
    }
  }
}
 
const sumarPuntaje=(valor)=>{
  let total=0;
  total=total+valor;
  return total;
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
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log('I was closed by the timer');
      let botonInicio=document.querySelector('.inicio');
      mostrarCartas();
      botonInicio.disabled=true;
    }
  })
}
//  console.log(pedirCarta());