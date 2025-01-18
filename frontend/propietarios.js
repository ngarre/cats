import axios from 'axios';
import { el, icon, notifyOk, notifyError } from './documentsUtil.js';




window.readOwners = function () {
    axios.get('http://localhost:8080/propietarios')
        .then((response) => {
            const ownerList = response.data;
            const ownerTable = el('tableBody');
            ownerList.forEach(owner => {
                const row = document.createElement('tr');
                row.id = 'owner-' + owner.id;
                row.innerHTML = `
                    <td>${owner.nickname}</td>
                    <td>${owner.nombre}</td>
                    <td>${owner.edad}</td>
                    <td>${owner.nacionalidad}</td>
                    <td><a href="javascript:getOwnerCats(${owner.id})" class="btn btn-light btn-sm">Mis Gatos</a></td>
                    <td>
                        <div class="d-flex justify-content-center gap-2">
                            <a class="btn btn-primary btn-sm" href="javascript:updateOwnerForm(${owner.id})" title="Editar">
                                ${icon('edit')}
                            </a>
                            <a class="btn btn-danger btn-sm" href="javascript:removeOwner(${owner.id})" title="Eliminar">
                                ${icon('delete')}
                            </a>
                        </div>
                    </td>
                `;

                ownerTable.appendChild(row);
            });
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
    //Obtengo los datos actuales del propietario
    axios.get('http://localhost:8080/propietarios/' + id).then((response) => {
        const owner = response.data;

        //Creo el formulario para editar los datos
        const formHtml = `
        <div id="edit-owner-form" class="form-container" style="width: 100%; max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h3 style="text-align: center; margin-bottom: 20px;">Editar Propietario</h3>
                <form id="owner-form">
                <label for="nickname" style="display: block; margin-bottom: 8px; font-weight: bold;">Nickname:</label>
                <input type="text" id="nickname" name="nickname" value="${owner.nickname}" required style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">

                <label for="nombre" style="display: block; margin-bottom: 8px; font-weight: bold;">Nombre:</label>
                <input type="text" id="nombre" name="nombre" value="${owner.nombre}" required style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
            
                <label for="edad" style="display: block; margin-bottom: 8px; font-weight: bold;">Edad:</label>
                <input type="number" id="edad" name="edad" value="${owner.edad}" required style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
            
                <label for="nacionalidad" style="display: block; margin-bottom: 8px; font-weight: bold;">Nacionalidad:</label>
                <input type="text" id="nacionalidad" name="nacionalidad" value="${owner.nacionalidad}" required style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
            
                <div style="display: flex; justify-content: space-between;">
                    <button type="button" onclick="saveOwner(${id})" style="width: 48%; padding: 10px; border: none; border-radius: 4px; background-color: #4caf50; color: white; cursor: pointer;">Guardar</button>
                    <button type="button" onclick="closeForm()" style="width: 48%; padding: 10px; border: none; border-radius: 4px; background-color: #777; color: white; cursor: pointer;">Cancelar</button>
                </div>
                </form>
        </div>
`;


        //Inserto el formulario en el DOM
        const formContainer = el('edit-owner-container') || document.createElement('div'); //Mete en la variable formContainer el objeto que tenga ese identificador o crea un objeto de tipo div
        formContainer.id = 'edit-owner-container'; // Establece al div el id
        formContainer.innerHTML = formHtml; // En el interior del div metemos el contenido de la variable formHtml (líneas 61 a 81)
        document.body.appendChild(formContainer); //Este formulario se queda pegado justo al final del body del html
    });
};

window.saveOwner = function (id) {
    //Obtengo los datos del formulario
    const form = el('owner-form');

    if (form.nickname.value === '') {
        notifyError('El nickname es un campo obligatorio');
        return; // Detenemos la ejecución si el nombre está vacío
    }

    const updatedOwner = {
        nickname: form.nickname.value,
        nombre: form.nombre.value,
        edad: form.edad.value,
        nacionalidad: form.nacionalidad.value,
    };

    //Realizo la solicitud PUT para actualizar los datos
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
    const formContainer = el('edit-owner-container');
    if (formContainer) {
        formContainer.remove();
    }
};

window.getOwnerCats = function (id) {
    axios.get('http://localhost:8080/propietarios/' + id + '/gatos')
        .then((response) => {
            const catList = response.data;

            //Busca el contenedor principal
            const container = document.querySelector('.container');
            if (!container) {
                console.error('No se encontró el contenedor con clase "container".');
                return;
            }

            //Busca o crea un contenedor específico dentro de "container"
            let catContainer = el('cat-container');
            if (!catContainer) {
                catContainer = document.createElement('div');
                catContainer.id = 'cat-container';
                container.appendChild(catContainer);
            }

            //Limpia cualquier contenido previo en el contenedor
            catContainer.innerHTML = '';

            //Agrega el título
            const title = document.createElement('h2');
            title.textContent = 'Mis gatos';
            catContainer.appendChild(title);

            //Crea la tabla
            const table = document.createElement('table');
            table.className = 'table';

            //Crea el encabezado de la tabla
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

            //Crea el cuerpo de la tabla
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

            //Agrega la tabla al contenedor
            catContainer.appendChild(table);
        })
        .catch(error => {
            console.error('Error al obtener los gatos:', error);
            alert('Ocurrió un error al obtener los gatos.');
        });
};