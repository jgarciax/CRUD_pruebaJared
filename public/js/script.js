//Obtenemos la tasa de cambio al cargar la pagina
window.onload = function() {
    //Llamamos a la funcion carga ecompletamente y se ejecuta
    obtenerTasasDeCambio();
    //Agrega un evento de escucha al boton 
    document.getElementById('crear').addEventListener('click', crearTazaDeCambio);
};
//funcion para obtener la tasas de cambio
function obtenerTasasDeCambio() {
    //se utiliza la api Fetch para obtener las tasasDeCambio
    fetch('/tasasDeCambio')
    .then(response => response.json()) //pasa la respuesta a json
    .then(data => mostrarTasasDeCambio(data))//Llama a la funcion mostrar taza de cambio
    .catch(error => console.error('Error', error));
}

//Funcion para mostrar las tazas de cambio de una tabla en la web
function mostrarTasasDeCambio(tasasDeCambio) {
    let tabla = document.getElementById('tablaTasasDeCambio')//para cada taza de cambio forma una nueva fila
    tasasDeCambio.forEach(tasa => {
        let fila = tabla.insertRow();
        let celdaMoneda = fila.insertCell();
        let celdaTasa = fila.insertCell();
        let celdaAcciones = fila.insertCell();
        celdaMoneda.textContent = tasa.moneda; // verificacion de tipo de mmoneda
    
        //crear un campo para la tasa de cambio
        let = entradaTasa = document.createElement('input');
        entradaTasa.type = 'number';
        entradaTasa.value = tasa.tasa;
        entradaTasa.id = 'tasa-' + tasa._id;
        celdaTasa.appendChild(entradaTasa);
        
        //crea un boton para actualizar la tasa de cambios 
        let botonActualizar = document.createElement('button');
        botonActualizar.textContent = 'Actualizar';
        botonActualizar.addEventListener('click', function() {
        actualizarTasaDeCambio(tasa._id);
    });
    //Crea un boton para borrar la tasa de cambios
        let botonBorrar = document.createElement('button');
        botonBorrar.textContent = 'Borrar';
        botonBorrar.addEventListener('click', function() {
            borrarTasasDeCambio(tasa._id);
        });

        celdaAcciones.appendChild(botonActualizar);
        celdaAcciones.appendChild(botonBorrar);
    });
}

    //Funcion para crear una nueva tasa de cambios
    function crearTazaDeCambio() {
        let moneda = document.getElementById('moneda').value;
        let tasa = document.getElementById('tasa').value;
        fetch('/tasasDeCambio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({moneda: moneda, tasa: tasa}),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Tasa de cambios creada', data);
            location.reload();
        })
        .catch((error) => {
            console.error('Error', error);
        });
    }
    //Funcion para actualiar una tasa de cambios existente
    function actualizarTasaDeCambio(id){
        let tasa = document.getElementById('tasa-' + id).value;
        fetch('/tasasDeCambio/' + id, {
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body:  JSON.stringify({tasa: tasa}),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Tasa de cambio actualizada', data);
            location.reload();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    //Funcion para borrar una tasa de cambio EXISTENTE

    async function borrarTasasDeCambio(id){
        try {
            let response = await
            fetch('/tasasDeCambios/' + id, {
                method: 'DELETE',
            });
            console.log('Tasa de Cambio Eliminada exitosamente!', response);
            location.reload(); // SI LA ELIMINACION ES EXITOSA RECARGA LA PAGINA
        }catch(error) {
            console.error('Error', error)
        }
    }