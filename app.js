const jugador= document.getElementById("nombreJugador"); 
console.log(jugador.innerHTML);
function prueba() {
  jugador.innerHTML="";
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
    console.log(jugador.value);
  })

}
