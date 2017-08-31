'use strict';

class MyForm {
	constructor(formName) {
		this.form = document.forms[formName]; 
		this.fio = this.form.fio;
		this.email = this.form.email;
		this.phone = this.form.phone;
		this.submitButton = document.getElementById('submitButton');
		this.resultContainer = document.getElementById('resultContainer');
		
		this.form.addEventListener('submit', (event) => {
      		event.preventDefault();
      		this.submit();
    	});

	}

	validate() {
		const result = {
		     isValid: true,
		     errorFields: []
    	};

		if (this.fio.value.split(' ').length !== 3) {
			result.isValid = false;
      		result.errorFields.push('fio');
		}

		let validEmail = /^[A-Za-z0-9_.+-]+@ya(\.ru|ndex\.(ru|ua|by|kz|com))$/i.test(this.email.value);
		if (!validEmail) {
			result.isValid = false;
      		result.errorFields.push('email');
		}

		let validPhone = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/i.test(this.phone.value);
		let validPhoneSum = ((this.phone.value.match(/\d/g).reduce((a, b) => +a + +b)) <= 30);
		if (!validPhone || !validPhoneSum) {
			result.isValid = false;
      		result.errorFields.push('phone');
		}

		return result;
	}


	getData() {
		return {
			fio: this.fio.value,
			email: this.email.value,
			tel: this.phone.value
		}
	}

	setData(newData) {
		this.fio.value = newData.fio;
		this.email.value = newData.email;
		this.phone.value = newData.phone;
	}

	submit() {
		let validation = this.validate();
		let errors = Array.prototype.slice.call(this.form.getElementsByClassName('error'));
		for (let i = 0; i < errors.length; i++) {
		 	errors[i].classList.remove('error');
		}

		if(validation.isValid === false) {
			this.form.action = "responses/error.json";
			this.resultContainer.textContent = ("error: "+validation.errorFields);
			this.resultContainer.classList.add('error');
			ansJSON('error.json');
			
			for (let i = 0; i < validation.errorFields.length; i++) {
					this[validation.errorFields[i]].classList.add('error');
			}


		}
		else {
			this.submitButton.disabled = true;

			this.resultContainer.classList.remove('error');

			ansJSON('progress.json');
			this.form.action = "responses/progress.json";
			this.resultContainer.classList.add('progress');
			this.resultContainer.textContent = "progress";

			ansJSON('success.json');
	  		this.form.action = "responses/success.json";
			this.resultContainer.classList.add('success');
			this.resultContainer.textContent = "success";
			
		}

    	function ansJSON(nameJSON){
			let xhr = new XMLHttpRequest();
			let url = "/responses/"+nameJSON;
			xhr.open('POST',url);
			// xhr.send();
		} 



	}
}


let myForm = new MyForm('myForm');


