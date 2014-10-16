function validate() {
	var x = document.forms["form"]["fullname"].value;
	/*
	 * alert("Name =" + document.forms["form"]["fullname"].value); alert("Age =" +
	 * document.forms["form"]["age"].value); alert("Gender =" +
	 * document.getElementsByName("sex")[0].checked); alert("T+C =" +
	 * document.forms["form"]["understand"].checked);
	 */
	var name = true;
	var age = true;
	var gender = true;
	var terms = true;

	name = validateName();
	age = validateAge();
	gender = validateGender();
	terms = validateTerms();

	if (name && age && gender && terms) {
		alert("Form is vaild!")
	}

}

function validateName() {
	var x = document.forms["form"]["fullname"].value;
	if (x == null || x == "") {
		alert("Name must be filled out");
		return false;
	}
	return true;
}

function validateAge() {
	var x = document.forms["form"]["age"].value;
	if (x == "select_age") {
		alert("Please Select Age");
		return false;
	}
	return true;
}

function validateGender() {

	if (document.getElementsByName("sex")[0].checked
			|| document.getElementsByName("sex")[1].checked) {
		return true;

	} else {
		alert("Please Select Gender");
		return false;
	}
}

function validateTerms() {
	var x = document.forms["form"]["understand"].checked;
	if (x == false) {
		alert("Please Confirm you understand the terms & conditions");
		return false;
	}
	return true;
}