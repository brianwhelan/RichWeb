function hide() {

	//alert(document.getElementById("hide").name);

	var x = document.getElementsByTagName("section");

	if (document.getElementById("hide").value == "show") {
		document.getElementById("hide").value = "hide";

		for (i = 0; i < x.length; i++) {
			x[i].style.visibility = "visible";
		}

	} else {
		document.getElementById("hide").value = "show";

		for (i = 0; i < x.length; i++) {
			x[i].style.visibility = "hidden";
		}
	}

}

function emphasise() {
	// find where defeasible is
	// change the html where its located to yellow and bold

	document.body.innerHTML = document.body.innerHTML.split("defeasible").join(
			"<font color=" + "yellow" + ">" + "<B>defeasible</B>" + "</font>");
	document.body.innerHTML = document.body.innerHTML.split("Defeasible").join(
			"<font color=" + "yellow" + ">" + "<B>Defeasible</B>" + "</font>");

}

function remove_a() {
	//alert(document.getElementsByTagName("a").length);
	var AN = document.getElementsByTagName("a");
	do {

		for (i = 0; i < AN.length; i++) {
			var parent = AN[i].parentNode;
			parent.removeChild(AN[i]);
		}
		AN = document.getElementsByTagName("a");
		
	} while (document.getElementsByTagName("a").length != '0')

}