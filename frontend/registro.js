import axios from 'axios'; //Axios es la librería que me permite comunicarme con el backend
import { notifyError, notifyOk, el } from './documentsUtil.js';

window.addCat = function () { //Programo lo que va a suceder cuando se clica en el botón del formulario para hacer un nuevo registro
    const nombre = el('nombreReg').value;
    const edad = el('edadReg').value;
    const raza = el('razaReg').value;
    const propietario = el('propietarioReg').value;


    //TO DO Validación de los datos que introduce el usuario
    if (nombre === '') {
        notifyError('El nombre es un campo obligatorio');
        return; // Detenemos la ejecución si el nombre está vacío
    }


    axios.post('http://localhost:8080/gatos', {
        nombre: nombre,
        edad: edad,
        raza: raza,
        propietario: propietario
    });

    //Decir al usuario si la entrada ha tenido lugar
    notifyOk('Gatito registrado');

    //Limpiar el formulario después de registrar nueva entrada:
    el('nombreReg').value = '';
    el('edadReg').value = '';
    el('razaReg').value = '';
    el('propietarioReg').value = '';

};