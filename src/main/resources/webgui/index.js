var requestId;

var listExisitingRequestDataService = function() {
	$.ajax({
		url : "/diaas/dataServiceRequest",
		type : 'GET',
		async : true,
		success : function(list) {
			$("#mainPanel").empty();
			itemsDiv = $("<div class='panel panel-default id=''>")
			$("#mainPanel").append(itemsDiv);
			
			if (list["graph"] ) {
			}
				
			else {
				addRequestToList(itemsDiv, "RequestID", "http://....", 0)
			}			
		},
		error : function() {

		}
	});
};

addRequestToList = function(itemsDiv, requestID, instanceUrl, itemCount) {
	itemLabel = requestID;
	itemPanel = '<div class="panel-heading" role="tab" >'
			+ '<h4 class="panel-title">'
			+ '<a class="resourceLink" resourceuri="' + item
			+ '" divtorender="resourceContentDiv_' + itemCount
			+ '" role="button" data-toggle="collapse" href="#' + itemCount
			+ '" aria-expanded="false" aria-controls="' + itemCount + '">'
			+ itemLabel + '</a>' + ' </h4>' + '</div>' + '<div id="'
			+ itemCount + '" class="panel-collapse collapse">'
			+ '<div id="resourceContentDiv_' + itemCount
			+ '" class="panel-body">' + '</div>' + '</div>	'
	$(itemsDiv).append(itemPanel);
}

var createNewRequestDataService = function() {
	$.ajax({
		url : "/diaas/dataServiceRequest",
		type : 'POST',
		async : true,
		success : function(dataServiceRequest) {
			requestId = dataServiceRequest.requestId;
			$("#requestStatus").text("Creating a new Data Service: " + requestId);
			submitFormMapping();			
		},
		error : function() {

		}
	});
};

submitFormMapping = function() {
	$("#formMappingLog").text("Processing Mapping file");
	// Get form
	var form = $('#formMapping')[0];
	// Create an FormData object
	var data = new FormData(form);
	// If you want to add an extra field for the FormData
	// data.append("CustomField", "This is some extra data, testing");
	// disabled the submit button
	var successFunction = function(data) {
		$("#formMappingLog").text("Mapping file OK");
		submitFormOntology();
	}
	var errorFunction = function(e) {
		$("#formMappingLog").text(e.responseText);
		console.log("ERROR : ", e);
	}
	uploadFile("/diaas/dataServiceRequest/" + this.requestId + "/mapping", data,
			successFunction, errorFunction);

}

submitFormOntology = function() {
	$("#formOntologyLog").text("Processing Ontology file");
	var form = $('#formOntology')[0];
	var data = new FormData(form);

	var successFunction = function(data) {
		$("#formOntologyLog").text("Ontology file OK");
		submitFormData();
	}
	var errorFunction = function(e) {
		$("#formOntologyLog").text(e.responseText);
		console.log("ERROR : ", e);
	}

	uploadFile("/diaas/dataServiceRequest/" + requestId + "/ontology", data,
			successFunction, errorFunction);
}

submitFormData = function() {
	$("#formDataLog").text("Processing Ontology file");
	var form = $('#formData')[0];
	var data = new FormData(form);

	var successFunction = function(data) {
		$("#formDataLog").text("Data file OK");
		finishRequest();
	}
	var errorFunction = function(e) {
		$("#formDataLog").text(e.responseText);
		console.log("ERROR : ", e);
	}
	uploadFile("/diaas/dataServiceRequest/" + requestId + "/data", data,
			successFunction, errorFunction);
}

finishRequest = function() {
	$.ajax({
		type : "POST",
		enctype : 'application/json',
		url : "/diaas/dataServiceRequest/" + requestId + "/confirm",
		processData : false,
		contentType : false,
		cache : false,
		timeout : 600000,
		success : function(data) {
			$("#requestStatus").text("Data Service " + requestId + " created!");
		},
		error : function(e) {

		}
	});
}

sendRequestListner = function() {
	$("#confirmRequest").click(function() {
		createNewRequestDataService();		
	});
}

var uploadFile = function(url, data, callback) {
	$.ajax({
		type : "POST",
		enctype : 'multipart/form-data',
		url : url,
		data : data,
		processData : false,
		contentType : false,
		cache : false,
		timeout : 600000,
		success : function(data) {
			callback(data);
		},
		error : function(e) {
			errorFunction(e);
		}
	});

};

$(document).ready(function() {
	sendRequestListner();
	listExisitingRequestDataService();
});