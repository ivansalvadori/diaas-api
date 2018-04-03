var requestId;

var listExisitingRequestDataService = function() {
	$.ajax({
		url : "/diaas/dataServiceRequest",
		type : 'GET',
		async : true,
		success : function(response) {
			$("#mainPanel").empty();
			itemsDiv = $("<div class='panel panel-default id=''>")
			$("#mainPanel").append(itemsDiv);
			
			if (response["@graph"] ) {
				itemCount = 0;
				$.each(response["@graph"], function(index, item) {
					addRequestToList(itemsDiv, item.dataServiceRequestId, item.runningDataServiceInstanceUri, 0)
					itemCount++
				});
			}
				
			else if(response["@type"]){
				addRequestToList(itemsDiv, response.dataServiceRequestId, response.runningDataServiceInstanceUri, 0)
			}			
		},
		error : function() {

		}
	});
};

addRequestToList = function(itemsDiv, requestID, instanceUrl, itemCount) {
	itemPanel = '<div class="panel-heading" role="tab" style="border-color: #ffdccc; background-color: #ffeee6;" >'
			+ '<h4 class="panel-title">'			
			+ '<a role="button" target="_blank" href="' + instanceUrl
			+ '" aria-expanded="false" aria-controls="' + itemCount + '">'
			+ instanceUrl + '</a>' 
			+ '<span>&nbsp;(' + requestID + ')' + '</span>'
			+ ' </h4>' + '</div>' + '<div id="'
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
	csvSeparator = $('#csvSeparator').val()
	csvEncode = $('#csvEncode').val()
	
	$.ajax({
		type : "POST",
		enctype : 'application/json',
		url : "/diaas/dataServiceRequest/" + requestId + "/confirm" + "?csvSeparator=" + csvSeparator + "&csvEncode=" + csvEncode ,
		processData : false,
		contentType : false,
		cache : false,
		timeout : 600000,
		success : function(data) {
			$("#requestStatus").html("Data Service <b>" + requestId + "</b> created!" + "<br>"+ "It may take some time to start the new instance.");
		},
		error : function(e) {

		}
	});
}

sendRequestListener = function() {
	$("#confirmRequest").click(function() {
		createNewRequestDataService();		
	});
}

refreshListener = function() {
	$("#refresh").click(function() {
		listExisitingRequestDataService();		
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
	sendRequestListener();
	refreshListener();
	listExisitingRequestDataService();
});