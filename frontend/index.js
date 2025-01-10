import axios from 'axios';
import { el, icon, notifyOk } from './documentsUtil';


window.readCats = function () {
    axios.get('http://localhost:8080/gatos')
        .then((response) => {
            const catList = response.data;
            const catTable = el('tableBody');
            catList.forEach(cat => {
                const row = document.createElement('tr');
                row.id = 'cat-' + cat.id;
                row.innerHTML = '<td>' + cat.nombre + '</td>' +
                    '<td>' + cat.edad + '</td>' +
                    '<td>' + cat.raza + '</td>' +
                    '<td>' + cat.propietario + '</td>' +
                    '<a class="btn btn-warning" href="javascript:updateCatForm(' + cat.id + ')">' +
                    icon('edit') //El código svg nos lo hemos llevado a documentUtil.js
                    + '</a>' +
                    '<a class="btn btn-danger" href="javascript:removeCat(' + cat.id + ')">' +
                    icon('delete') //Antes estaba aquí código svg, ahora en documentUtil.js
                    + '</a>';

                catTable.appendChild(row);
            })

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
    // Obtén los datos actuales del gato
    axios.get(`http://localhost:8080/gatos/${id}`).then((response) => {
        const cat = response.data;

        // Crea el formulario para editar los datos
        const formHtml = `
            <div id="edit-cat-form" class="form-container">
                <h3>Editar Gato</h3>
                <form id="cat-form">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" value="${cat.nombre}" required>
                    
                    <label for="edad">Edad:</label>
                    <input type="number" id="edad" name="edad" value="${cat.edad}" required>
                    
                    <label for="raza">Raza:</label>
                    <input type="text" id="raza" name="raza" value="${cat.raza}" required>
                    
                    <label for="propietario">Propietario:</label>
                    <input type="text" id="propietario" name="propietario" value="${cat.propietario}" required>
                    
                    <button type="button" onclick="saveCat(${id})" class="btn btn-success">Guardar</button>
                    <button type="button" onclick="closeForm()" class="btn btn-secondary">Cancelar</button>
                </form>
            </div>
        `;

        // Inserta el formulario en el DOM
        const formContainer = document.getElementById('edit-cat-container') || document.createElement('div');
        formContainer.id = 'edit-cat-container';
        formContainer.innerHTML = formHtml;
        document.body.appendChild(formContainer);
    });
};

window.saveCat = function (id) {
    // Obtengo los datos del formulario
    const form = document.getElementById('cat-form');
    const updatedCat = {
        nombre: form.nombre.value,
        edad: form.edad.value,
        raza: form.raza.value,
        propietario: form.propietario.value
    };

    // Realizo la solicitud PUT para actualizar los datos
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
    const formContainer = document.getElementById('edit-cat-container');
    if (formContainer) {
        formContainer.remove();
    }
};
