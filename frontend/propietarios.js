import axios from 'axios';
import { el, icon, notifyOk } from './documentsUtil.js';




window.readOwners = function () {
    axios.get('http://localhost:8080/propietarios')
        .then((response) => {
            const ownerList = response.data;
            const ownerTable = el('tableBody');
            ownerList.forEach(owner => {
                const row = document.createElement('tr');
                row.id = 'owner-' + owner.id;
                row.innerHTML = '<td>' + owner.nickname + '</td>' +
                    '<td>' + owner.nombre + '</td>' +
                    '<td>' + owner.edad + '</td>' +
                    '<td>' + owner.nacionalidad + '</td>' +
                    '<td> <a href="javascript:getOwnerCats(' + owner.id + ')">Mis Gatos</a> </td>' +
                    '<a class="btn btn-warning" href="javascript:updateOwnerForm(' + owner.id + ')">' +
                    icon('edit') //El código svg nos lo hemos llevado a documentUtil.js
                    + '</a>' +
                    '<a class="btn btn-danger" href="javascript:removeOwner(' + owner.id + ')">' +
                    icon('delete') //Antes estaba aquí código svg, ahora en documentUtil.js
                    + '</a>';

                ownerTable.appendChild(row);
            })

        });
};

window.removeOwner = function (id) {
    if (confirm('¿Está seguro de que desea eliminar este perfil?')) {
        axios.delete('http://localhost:8080/propietarios/' + id)
            .then((response) => {
                if (response.status == 204) {
                    notifyOk('Perfil eliminado correctamente');
                    el('owner-' + id).remove();
                }

            })
    }
};



window.updateOwnerForm = function (id) {
    // Obtén los datos actuales del propietario
    axios.get('http://localhost:8080/propietarios/' + id).then((response) => {
        const owner = response.data;

        // Crea el formulario para editar los datos
        const formHtml = `
            <div id="edit-owner-form" class="form-container">
                <h3>Editar Propietario</h3>
                <form id="owner-form">
                    <label for="nickname">nickname:</label>
                    <input type="text" id="nickname" name="nickname" value="${owner.nickname}" required>

                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" value="${owner.nombre}" required>
                    
                    <label for="edad">Edad:</label>
                    <input type="number" id="edad" name="edad" value="${owner.edad}" required>
                    
                    <label for="nacionalidad">Nacionalidad:</label>
                    <input type="text" id="nacionalidad" name="nacionalidad" value="${owner.nacionalidad}" required>
                    
                    <button type="button" onclick="saveOwner(${id})" class="btn btn-success">Guardar</button>
                    <button type="button" onclick="closeForm()" class="btn btn-secondary">Cancelar</button>
                </form>
            </div>
        `;

        // Inserta el formulario en el DOM
        const formContainer = document.getElementById('edit-owner-container') || document.createElement('div');
        formContainer.id = 'edit-owner-container';
        formContainer.innerHTML = formHtml;
        document.body.appendChild(formContainer);
    });
};

window.saveOwner = function (id) {
    // Obtengo los datos del formulario
    const form = document.getElementById('owner-form');
    const updatedOwner = {
        nickname: form.nickname.value,
        nombre: form.nombre.value,
        edad: form.edad.value,
        nacionalidad: form.nacionalidad.value,
    };

    // Realizo la solicitud PUT para actualizar los datos
    axios.put(`http://localhost:8080/propietarios/${id}`, updatedOwner)
        .then(() => {
            notifyOk('Propietario actualizado correctamente');
            closeForm();
            window.location.reload();

        })
        .catch(error => {
            console.error('Error al actualizar:', error);
            alert('Ocurrió un error al actualizar');
        });
};

window.closeForm = function () {
    const formContainer = document.getElementById('edit-owner-container');
    if (formContainer) {
        formContainer.remove();
    }
};

window.getOwnerCats = function (id) {
    axios.get('http://localhost:8080/propietarios/' + id + '/gatos')
        .then((response) => {
            const catList = response.data;

            // Busca el contenedor principal
            const container = document.querySelector('.container');
            if (!container) {
                console.error('No se encontró el contenedor con clase "container".');
                return;
            }

            // Busca o crea un contenedor específico dentro de "container"
            let catContainer = document.getElementById('cat-container');
            if (!catContainer) {
                catContainer = document.createElement('div');
                catContainer.id = 'cat-container';
                container.appendChild(catContainer);
            }

            // Limpia cualquier contenido previo en el contenedor
            catContainer.innerHTML = '';

            // Agrega el título
            const title = document.createElement('h2');
            title.textContent = 'Mis gatos';
            catContainer.appendChild(title);

            // Crea la tabla
            const table = document.createElement('table');
            table.className = 'table';

            // Crea el encabezado de la tabla
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th>Nombre</th>
                    <th>Edad</th>
                    <th>Raza</th>
                    <th>Propietario</th>
                </tr>
            `;
            table.appendChild(thead);

            // Crea el cuerpo de la tabla
            const tbody = document.createElement('tbody');
            catList.forEach(cat => {
                const row = document.createElement('tr');
                row.id = 'cat-' + cat.id;
                row.innerHTML = `
                    <td>${cat.nombre}</td>
                    <td>${cat.edad}</td>
                    <td>${cat.raza}</td>
                    <td>${cat.propietario}</td>
                `;
                tbody.appendChild(row);
            });
            table.appendChild(tbody);

            // Agrega la tabla al contenedor
            catContainer.appendChild(table);
        })
        .catch(error => {
            console.error('Error al obtener los gatos:', error);
            alert('Ocurrió un error al obtener los gatos.');
        });
};