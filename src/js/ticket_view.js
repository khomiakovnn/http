export default class Ticket_view{
    constructor(){
        this.overlay = document.querySelector('.overlay');
        this.modal = document.querySelector('.modal');
        this.modalTitle = document.getElementById('modal_title');
        this.descriptionShort = document.getElementById('short_descr');
        this.descriptionLong = document.getElementById('long_descr');
        this.editWarn = document.getElementById('edit_warn');
        this.inputField = document.querySelector('.input_field');
        this.cancelButton = document.getElementById("cancel_button");
        this.okButton = document.getElementById("OK_button");
        this.cancelButton.addEventListener('click', () => this.hideContainer())
        this.addButton = document.getElementById('addTicket_button');
        this.addButton.addEventListener('click', () => this.create())
    }
    
    edit() {
        this._makeContainer()
        this.modalTitle.textContent = 'Изменить тикет';
        this.inputField.style.display = 'flex';
        this.editWarn.style.display = 'none';
        this.okButton.addEventListener('click', () => {
            console.log('ok')
        })
    }
    
    delete() {
        this._makeContainer()
        this.modalTitle.textContent = 'Удалить тикет';
        this.inputField.style.display = 'none';
        this.editWarn.style.display = 'block';
        this.okButton.addEventListener('click', () => {
            console.log('ok')
        })
    }
    
    create() {
        this._makeContainer()
        this.modalTitle.textContent = 'Добавить тикет';
        this.inputField.style.display = 'flex';
        this.editWarn.style.display = 'none';
        this.okButton.addEventListener('click', () => {
            console.log('ok')
        })
    }

    _makeContainer() {
        this.overlay.style.display = "block";
        this.modal.style.display = "block";  
    }

    hideContainer() {
        this.overlay.style.display = "none";
        this.modal.style.display = "none";
    }
}