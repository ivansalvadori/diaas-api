var requestId;

addListenerCreateNewRequestDataService = function() {
	$("#createNewRequestDataService").click(function() {
		createNewRequestDataService()
	});
}

var createNewRequestDataService = function() {
	$.ajax({
		url : "/diaas/dataServiceRequest",
		type : 'POST',
		async : true,
		success : function(dataServiceRequest) {
			requestId = dataServiceRequest.requestId;
			$("#requestIdLabel").text(requestId);
		},
		error : function() {

		}
	});
};

addListenerSubmitFormMapping = function() {
	$("#btnSubmitMappingFile").click(function (event) {
        //stop submit the form, we will post it manually.
        event.preventDefault();
        // Get form
        var form = $('#formMapping')[0];
		// Create an FormData object
        var data = new FormData(form);
		// If you want to add an extra field for the FormData
       // data.append("CustomField", "This is some extra data, testing");
		// disabled the submit button
        $("#btnSubmitMappingFile").prop("disabled", true);
        var successFunction = function(data){
             $("#btnSubmitMappingFile").prop("disabled", false);
        }
        var errorFunction = function(e){
       	 $("#result").text(e.responseText);
            console.log("ERROR : ", e);
            $("#btnSubmitMappingFile").prop("disabled", false);
            alert("sss")
       }
        uploadFile("/diaas/dataServiceRequest/" + requestId + "/mapping", data , successFunction, errorFunction);
    });
}

addListenerSubmitFormOntology = function() {
	$("#btnSubmitOntologyFile").click(function (event) {
        //stop submit the form, we will post it manually.
        event.preventDefault();
        // Get form
        var form = $('#formOntology')[0];
		// Create an FormData object
        var data = new FormData(form);
		// If you want to add an extra field for the FormData
       // data.append("CustomField", "This is some extra data, testing");
		// disabled the submit button
        $("#btnSubmitOntologyFile").prop("disabled", true);
        var successFunction = function(data){
             $("#btnSubmitOntologyFile").prop("disabled", false);
        }
        var errorFunction = function(e){
       	 $("#result").text(e.responseText);
            console.log("ERROR : ", e);
            $("#btnSubmitOntologyFile").prop("disabled", false);
            alert("sss")
       }
        uploadFile("/diaas/dataServiceRequest/" + requestId + "/ontology", data , successFunction, errorFunction);
    });
}

addListenerSubmitFormData = function() {
	$("#btnSubmitDataFile").click(function (event) {
        //stop submit the form, we will post it manually.
        event.preventDefault();
        // Get form
        var form = $('#formData')[0];
		// Create an FormData object
        var data = new FormData(form);
		// If you want to add an extra field for the FormData
       // data.append("CustomField", "This is some extra data, testing");
		// disabled the submit button
        $("#btnSubmitDataFile").prop("disabled", true);
        var successFunction = function(data){
             $("#btnSubmitDataFile").prop("disabled", false);
        }
        var errorFunction = function(e){
       	 $("#result").text(e.responseText);
            console.log("ERROR : ", e);
            $("#btnSubmitDataFile").prop("disabled", false);
            alert("sss")
       }
        uploadFile("/diaas/dataServiceRequest/" + requestId + "/data", data , successFunction, errorFunction);
    });
}

confirmRequest = function() {
	$("#confirmRequest").click(function() {
		$.ajax({
	        type: "POST",
	        enctype: 'application/json',
	        url: "/diaas/dataServiceRequest/" + requestId + "/confirm",
	        processData: false,
	        contentType: false,
	        cache: false,
	        timeout: 600000,
	        success: function (data) {
	        	
	        },
	        error: function (e) {
	        	
	        }
	    });
	});
}

var uploadFile = function(url, data, callback) {
	$.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: url,
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data) {
        	callback(data);
        },
        error: function (e) {
        	errorFunction(e);
        }
    });

};



$(document).ready(function() {
	addListenerCreateNewRequestDataService();
	addListenerSubmitFormMapping();
	addListenerSubmitFormOntology();
	addListenerSubmitFormData();
	confirmRequest();
});