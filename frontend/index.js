import axios from 'axios';
import { el, icon, notifyOk, notifyError } from './documentsUtil';


window.readCats = function () {
    axios.get('http://localhost:8080/gatos')
        .then((response) => {
            const catList = response.data;
            const catTable = el('tableBody');
            catList.forEach(cat => {
                const row = document.createElement('tr');
                row.id = 'cat-' + cat.id;
                row.innerHTML = `
                    <td>${cat.nombre}</td>
                    <td>${cat.edad}</td>
                    <td>${cat.raza}</td>
                    <td>${cat.propietario}</td>
                    <td>
                        <div class="d-flex justify-content-center gap-2">
                            <a class="btn btn-primary btn-sm" href="javascript:updateCatForm(${cat.id})" title="Editar">
                                ${icon('edit')}
                            </a>
                            <a class="btn btn-danger btn-sm" href="javascript:removeCat(${cat.id})" title="Eliminar">
                                ${icon('delete')}
                            </a>
                        </div>
                    </td>
                `;

                catTable.appendChild(row);
            });
        });
};


window.removeCat = function (id) {
    if (confirm('¿Está seguro de que desea eliminar este gatito?')) {
        axios.delete('http://localhost:8080/gatos/' + id)
            .then((response) => {
                if (response.status == 204) {
                    notifyOk('Gatito eliminado correctamente');
                    el('cat-' + id).remove();
                }

            })
    }
};



window.updateCatForm = function (id) {
    //Obtengo los datos actuales del gato
    axios.get(`http://localhost:8080/gatos/${id}`).then((response) => {
        const cat = response.data;

        //Creo el formulario para editar los datos
        const formHtml = `
        <div id="edit-cat-form" class="form-container" style="width: 100%; max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h3 style="text-align: center; margin-bottom: 20px;">Editar Gato</h3>
                <form id="cat-form">
                    <label for="nombre" style="display: block; margin-bottom: 8px; font-weight: bold;">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" value="${cat.nombre}" required style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
            
                    <label for="edad" style="display: block; margin-bottom: 8px; font-weight: bold;">Edad:</label>
                    <input type="number" id="edad" name="edad" value="${cat.edad}" required style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
            
                    <label for="raza" style="display: block; margin-bottom: 8px; font-weight: bold;">Raza:</label>
                    <input type="text" id="raza" name="raza" value="${cat.raza}" required style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
            
                    <label for="propietario" style="display: block; margin-bottom: 8px; font-weight: bold;">Propietario:</label>
                    <input type="text" id="propietario" name="propietario" value="${cat.propietario}" required style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
            
                    <div style="display: flex; justify-content: space-between;">
                        <button type="button" onclick="saveCat(${id})" style="width: 48%; padding: 10px; border: none; border-radius: 4px; background-color: #4caf50; color: white; cursor: pointer;">Guardar</button>
                        <button type="button" onclick="closeForm()" style="width: 48%; padding: 10px; border: none; border-radius: 4px; background-color: #777; color: white; cursor: pointer;">Cancelar</button>
                    </div>
                </form>
        </div>
`;


        //Inserto el formulario en el DOM
        const formContainer = el('edit-cat-container') || document.createElement('div'); //Mete en la variable formContainer el objeto que tenga ese identificador o crea un objeto de tipo div
        formContainer.id = 'edit-cat-container'; // Establece al div el id
        formContainer.innerHTML = formHtml; // En el interior del div metemos el contenido de la variable formHtml (líneas 58 a 78)
        document.body.appendChild(formContainer); //Este formulario se queda pegado justo al final del body del html
    });


};

window.saveCat = function (id) {
    //Obtengo los datos del formulario
    const form = el('cat-form');

    if (form.nombre.value === '') {
        notifyError('El nombre es un campo obligatorio');
        return; // Detenemos la ejecución si el nombre está vacío
    }

    const updatedCat = {
        nombre: form.nombre.value,
        edad: form.edad.value,
        raza: form.raza.value,
        propietario: form.propietario.value
    };

    //Realizo la solicitud PUT para actualizar los datos
    axios.put(`http://localhost:8080/gatos/${id}`, updatedCat)
        .then(() => {
            notifyOk('Gatito actualizado correctamente');
            closeForm();
            window.location.reload();

        })
        .catch(error => {
            console.error('Error al actualizar el gatito:', error);
            alert('Ocurrió un error al actualizar el gatito');
        });
};

window.closeForm = function () {
    const formContainer = el('edit-cat-container');
    if (formContainer) {
        formContainer.remove();
    }
};
