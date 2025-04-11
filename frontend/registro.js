import axios from 'axios'; //Axios es la librería que me permite comunicarme con el backend
import { notifyError, notifyOk, el } from './documentsUtil.js';

window.addCat = function () { //Programo lo que va a suceder cuando se clica en el botón del formulario para hacer un nuevo registro
    const nombre = el('nombreReg').value; //Buscas el elemento identificado por "nombreReg" y asignas su valor a la variable
    const edad = el('edadReg').value;
    const raza = el('razaReg').value;
    const propietario = el('propietarioReg').value;
    let id_propietario;


    //TO DO Validación de los datos que introduce el usuario
    if (nombre === '') {
        notifyError('El nombre es un campo obligatorio');
        return; // Detenemos la ejecución si el nombre está vacío
    }

    //Conseguir id del propietario
    axios.get('http://localhost:8080/propietarios/buscar/' + propietario) //Vamos al endopoint que está en la línea 100 de app.js en el backend para pasarle el nickname del propietario
    .then((response) => {
        id_propietario = response.data.id;

        axios.post('http://localhost:8080/gatos', {
            nombre: nombre,
            edad: edad,
            raza: raza,
            propietario: propietario,
            id_propietario: id_propietario
        });

        //Decir al usuario si la entrada ha tenido lugar
        notifyOk('Gatito registrado');

        //Limpiar el formulario después de registrar nueva entrada:
        el('nombreReg').value = '';
        el('edadReg').value = '';
        el('razaReg').value = '';
        el('propietarioReg').value = '';
    })
};


 //Limpiar formulario después de dar al botón limpiar
 window.resetForm = function () {
    el('nombreReg').value = '';
    el('edadReg').value = '';
    el('razaReg').value = '';
    el('propietarioReg').value = '';
    notifyOk('Formulario limpiado');
};

