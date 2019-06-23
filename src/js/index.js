const axios = require('axios');
const Swal = require('sweetalert2');
const validator = require('validator');
const handler = '../../handler/';

const ready = () => {
    document.querySelector('.js-button-add').addEventListener('click', () => {
        const form = openForm();
        form.dataset.actiontype = "add";
    }); //событие нажатия на кнопку добавления новго сотрудника

    document.querySelector('.js-button-cancel').addEventListener('click', cancelChanges); // отмена формы

    document.querySelector(".js-add-phone").addEventListener('click', (e) => { //добавление поля для ввода телефона 
        if (document.querySelectorAll(".js-form input[name='phone']").length < 4) {
            const phoneInput = createPhoneInput();
            e.target.parentNode.insertBefore(phoneInput, e.target);
        } else {
            Swal.fire({
                position: 'top-end',
                type: 'error',
                toast: true,
                title: "Хватит!",
                showConfirmButton: false,
                timer: 3500
            });
        }

    });

    document.querySelector(".js-add-mail").addEventListener("click", (e) => { // событие добавления поля для почты
        if (document.querySelectorAll(".js-form input[name='mail']").length < 4) {
            const mailInput = createMailInput();
            e.target.parentNode.insertBefore(mailInput, e.target);
        } else {
            Swal.fire({
                position: 'top-end',
                type: 'error',
                toast: true,
                title: "Хватит!",
                showConfirmButton: false,
                timer: 3500
            });
        }
    });

    document.querySelector("#workers_form").addEventListener("submit", function (e) { // обработка события сохранения формы
        e.preventDefault();
        const validate = validateForm(e);
        if (validate) {
            const form = document.querySelector(".js-form");
            if (form.dataset.actiontype === "add") {
                createWorker(validate);

            } else if (form.dataset.actiontype === "edit") {
                saveChanges(validate);
            } else {
                Swal.fire({
                    position: 'top-end',
                    type: 'error',
                    toast: true,
                    title: "Ошибка",
                    showConfirmButton: false,
                    timer: 3500
                });
            }
        }
    });
    loadData();
};


const createWorker = (data) => { // заносит нового сотрудника в БД и в таблицу
    axios.post(handler, {
            method: 'create',
            data: data

        })
        .then(function (response) {
            if (!response.data.error) {
                const table = document.querySelector(".js-table");
                const row = createRow(data.surname, data.name, data.name2, data.title, data.phone, data.mail, response.data.data, data.type);
                table.appendChild(row);
                cancelChanges();
                Swal.fire({
                    position: 'top-end',
                    type: 'success',
                    toast: true,
                    title: 'Данные сохранены',
                    showConfirmButton: false,
                    timer: 3500
                });
            } else {
                Swal.fire({
                    position: 'top-end',
                    type: 'error',
                    toast: true,
                    title: 'Упс, что-то пошло не так',
                    showConfirmButton: false,
                    timer: 3500
                });
            }

        })
        .catch(function () {
            Swal.fire({
                position: 'top-end',
                type: 'error',
                toast: true,
                title: 'Упс, что-то пошло не так',
                showConfirmButton: false,
                timer: 3500
            });
        });

}


const saveChanges = (data) => { //  заносит изменения в БД
    axios.post(handler, {
            method: 'edit',
            data: data

        })
        .then(function (response) {
            if (!response.data.error) {
                const table = document.querySelector(".js-table");
                const row = createRow(data.surname, data.name, data.name2, data.title, data.phone, data.mail, data.id, data.type);
                const oldRow = table.querySelector("*[data-id='" + data.id + "']");
                table.insertBefore(row, oldRow);
                oldRow.remove();
                Swal.fire({
                    position: 'top-end',
                    type: 'success',
                    toast: true,
                    title: 'Данные сохранены',
                    showConfirmButton: false,
                    timer: 3500
                });
                cancelChanges();
            } else {
                Swal.fire({
                    position: 'top-end',
                    type: 'error',
                    toast: true,
                    title: 'Упс, что-то пошло не так',
                    showConfirmButton: false,
                    timer: 3500
                });

                cancelChanges();

            }

        })
        .catch(function () {
            Swal.fire({
                position: 'top-end',
                type: 'error',
                toast: true,
                title: 'Упс, что-то пошло не так',
                showConfirmButton: false,
                timer: 3500
            });
        });
}


const validateForm = (form) => {
    //проверка формы на наличие всех заполненных данных
    // в успешном случае возвращает всезначения элементов формы
    // в результате ошибок возвращает false
    const id = document.querySelector(".js-form").dataset.id;

    const formData = form.target.elements;
    let noError = true;
    const surname = formData.surname;
    const name = formData.name;
    const name2 = formData.name2;
    const title = formData.title;
    const type = formData.type;
    const error = (element) => {
        Swal.fire({
            position: 'top-end',
            type: 'error',
            toast: true,
            title: 'Поле не заполнено',
            showConfirmButton: false,
            timer: 3500
        });
        element.style.borderColor = "red";
        noError = false;
    }
    const resetError = (element) => {
        element.style.borderColor = null;
    }

    resetError(surname);
    if (surname.value === "") {
        error(surname);

    }
    resetError(name);
    if (name.value === "") {
        error(name);

    }
    resetError(name2);
    if (name2.value === "") {
        error(name2);
    }
    resetError(title);
    if (title.value === "") {
        error(title);
    }

    const mail = formData.mail;
    const mails = [];
    if (mail.length) {
        mail.forEach(e => {
            resetError(e);
            if (e.value === "") {
                error(e);
            }
            mails.push(e.value);
        });
    } else {
        resetError(mail);
        if (mail.value === "") {
            error(mail);
        }
        mails.push(mail.value);
    }

    const phone = formData.phone;
    const phones = [];
    if (phone.length) {
        phone.forEach(e => {
            resetError(e);
            if (e.value === "" || !validator.isMobilePhone(e.value)) {
                error(e);
            }
            phones.push(e.value);
        });

    } else {
        resetError(phone);
        if (phone.value === "" || !validator.isMobilePhone(phone.value)) {
            error(phone);
        }
        phones.push(phone.value);
    }
    if (!noError) {
        return false;
    }
    return {
        name: name.value,
        name2: name2.value,
        surname: surname.value,
        title: title.value,
        type: type.value,
        mail: mails,
        phone: phones,
        id: id
    }


}


const deleteWorker = (e) => {  // удаляет сотрудника из БД и из таблицы
    axios.post(handler, {
            method: 'delete',
            data: {
                id: e.path[2].dataset.id
            }

        })
        .then(function (response) {
            e.path[2].remove();
            if (response.data.status === "ok") {
                Swal.fire({
                    position: 'top-end',
                    type: 'success',
                    toast: true,
                    title: 'Данные удалены',
                    showConfirmButton: false,
                    timer: 3500
                });
            } else {
                Swal.fire({
                    position: 'top-end',
                    type: 'error',
                    toast: true,
                    title: "Возникла ошибка",
                    showConfirmButton: false,
                    timer: 3500
                });
            }
        })
        .catch(function (error) {
            Swal.fire({
                position: 'top-end',
                type: 'error',
                toast: true,
                title: error,
                showConfirmButton: false,
                timer: 3500
            });
            cancelChanges();
        });
}

const loadData = () => { //загрузка данных в таблицу
    axios.post(handler, {
            method: 'get',

        })
        .then(function (response) {
            const table = document.querySelector(".js-table");
            response.data.map(el => {
                const row = createRow(el.surname, el.name, el.name2, el.title, el.phones, el.mails, el.id, el.type);
                table.appendChild(row);
            });
        })
        .catch(function (error) {
            Swal.fire({
                position: 'top-end',
                type: 'error',
                toast: true,
                title: error,
                showConfirmButton: false,
                timer: 3500
            });
        });

}


const createDiv = (className, content = "") => { //создает див, но что то это не сильно короче чем руками 
    const element = document.createElement("div");
    if (className !== "") {
        element.classList.add(className);
    }
    if (content instanceof Element) {
        element.appendChild(content);
    } else {
        element.innerText = content;
    }
    return element;
}


const createRow = (surname, name, name2, title, phones, mails, id, type) => { //создать элемент таблицы строка и наполняет данными
    const row = createDiv("employees__row");
    row.dataset.id = id;
    const obj = {
        name: name,
        name2: name2,
        surname: surname,
        title: title,
        type: type,
        mail: mails,
        phone: phones,
        id: id,
    }
    row.dataset.data = JSON.stringify(obj);

    const personCell = createDiv("employees__cell");
    const phonesCell = createDiv("employees__cell");
    const mailsCell = createDiv("employees__cell");
    const buttonsCell = createDiv("employees__cell");

    personCell.appendChild(createDiv("employees__surname", surname));
    personCell.appendChild(createDiv("employees__name", `${name} ${name2}`));
    personCell.appendChild(createDiv("employees__title", title));

    phonesCell.appendChild(createDiv("employees__phone"));
    phones.forEach(element => {
        phonesCell.firstChild.appendChild(createDiv("", element));
    });

    mailsCell.appendChild(createDiv("employees__mail"));
    mails.forEach(element => {
        mailsCell.firstChild.appendChild(createDiv("", element));
    });

    const editButton = createDiv("employees__edit");
    editButton.addEventListener("click", (e) => {
        const form = openForm();
        form.dataset.actiontype = "edit";
        editWorker(form, e);
    });
    buttonsCell.appendChild(editButton);

    const deleteButton = createDiv("employees__delete");
    deleteButton.addEventListener("click", (e) => {
        deleteWorker(e);
    });
    buttonsCell.appendChild(deleteButton);

    row.appendChild(personCell);
    row.appendChild(phonesCell);
    row.appendChild(mailsCell);
    row.appendChild(buttonsCell);

    return row;
}

const editWorker = (form, event) => { // заполняет форму данными для редоактирования строки
    const surnameForm = form.querySelector("[name='surname']");
    const nameForm = form.querySelector("[name='name']");
    const name2Form = form.querySelector("[name='name2']");
    const titleForm = form.querySelector("[name='title']");
    const typeForm = form.querySelectorAll("[name='type']");
    const row = event.target.parentNode.parentNode;
    const id = row.dataset.id;
    const data = JSON.parse(row.dataset.data);
    surnameForm.value = data.surname;
    nameForm.value = data.name;
    name2Form.value = data.name2;
    titleForm.value = data.title;
    typeForm[data.type - 1].checked = true;
    form.dataset.id = id;

    const phone = form.querySelector("[name='phone']");
    phone.value = data.phone[0];
    if (data.phone.length > 1) {
        for (let i = 1; i < data.phone.length; i++) {
            const phoneInput = createPhoneInput();
            phoneInput.querySelector("[name='phone']").value = data.phone[i];
            phone.parentNode.parentNode.insertBefore(phoneInput, phone.parentNode.nextElementSibling);
        }
    }

    const mail = form.querySelector("[name='mail']");
    mail.value = data.mail[0];
    if (data.mail.length > 1) {
        for (let i = 1; i < data.mail.length; i++) {
            const mailInput = createMailInput();
            mailInput.querySelector("[name='mail']").value = data.mail[i];
            mail.parentNode.parentNode.insertBefore(mailInput, mail.parentNode.nextElementSibling);
        }
    }

}


const openForm = () => { //показывает форму и ее возвращает как элемент
    const form = document.querySelector(".js-form");
    form.style.display = "block";
    return form;
}


const cancelChanges = () => { //отмена внесения изменений и  очистка формы для нового использования
    const form = document.querySelector(".js-form");
    form.querySelectorAll(".form__input").forEach(el => el.value = "");
    form.querySelectorAll(".form__contacts-delete").forEach(el => el.parentNode.remove());
    form.dataset.actiontype = "";
    form.dataset.id = "";


    form.style.display = "none";

}


const createPhoneInput = () => { //создает элемент для ввода дополнительного телефона
    const input = document.createElement("input");
    input.setAttribute("name", "phone");
    input.setAttribute("type", "tel");
    input.classList.add("form__input");
    input.classList.add("form__input-contacts");
    const wrapper = createDiv("form__contacts-wrapper");
    wrapper.appendChild(input);
    const deleteButton = createDiv("form__contacts-delete");
    deleteButton.addEventListener("click", (e) => {
        e.target.parentNode.remove();
    });
    wrapper.appendChild(deleteButton);
    return wrapper;
}


const createMailInput = () => { //создает элемент для ввода дополнительной почты
    const input = document.createElement("input");
    input.setAttribute("name", "mail");
    input.setAttribute("type", "email");
    input.classList.add("form__input");
    input.classList.add("form__input-contacts");
    const wrapper = createDiv("form__contacts-wrapper");
    wrapper.appendChild(input);
    const deleteButton = createDiv("form__contacts-delete");
    deleteButton.addEventListener("click", (e) => {
        e.target.parentNode.remove();
    });
    wrapper.appendChild(deleteButton);
    return wrapper;
}


document.addEventListener('DOMContentLoaded', ready);