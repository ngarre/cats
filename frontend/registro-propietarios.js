import axios from 'axios'; //Axios es la librería que me permite comunicarme con el backend
import { notifyError, notifyOk, el } from './documentsUtil.js';
const backendUrl = process.env.PARCEL_BACKEND_URL || 'http://localhost:8080';

window.addOwner = function () { //Programo lo que va a suceder cuando se clica en el botón del formulario para hacer un nuevo registro
    const nickname = el('nicknameReg').value;
    const nombre = el('nombreReg').value;
    const edad = el('edadReg').value;
    const nacionalidad = el('nacionalidadReg').value;


    //Validación de los datos que introduce el usuario
    if (nickname === '') {
        notifyError('El nickname es un campo obligatorio');
        return; // Detenemos la ejecución si el nombre está vacío
    }


    axios.post(`${backendUrl}/propietarios`, {
        nickname: nickname,
        nombre: nombre,
        edad: edad,
        nacionalidad: nacionalidad
    });

    //Decir al usuario si la entrada ha tenido lugar
    notifyOk('Propietario registrado');

    //Limpiar el formulario después de registrar nueva entrada:
    el('nicknameReg').value = '';
    el('nombreReg').value = '';
    el('edadReg').value = '';
    el('nacionalidadReg').value = '';

};

 //Limpiar formulario después de dar al botón limpiar
 window.resetForm = function () {
    el('nicknameReg').value = '';
    el('nombreReg').value = '';
    el('edadReg').value = '';
    el('nacionalidadReg').value = '';
    notifyOk('Formulario limpiado');
};