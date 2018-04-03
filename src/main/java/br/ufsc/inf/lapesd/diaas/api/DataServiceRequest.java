package br.ufsc.inf.lapesd.diaas.api;

import java.util.UUID;

public class DataServiceRequest {

    private String requestId;
    private RequestStatus requestStatus;
    private String mappingFileBase64;
    private String dataFileBase64;
    private String ontologyFileBase64;
    private String csvSeparator;
    private String csvEncode;

    public DataServiceRequest(String requestId) {
        super();
        this.requestId = requestId;
    }

    public DataServiceRequest() {
        this.requestId = UUID.randomUUID().toString();
        this.requestStatus = RequestStatus.WAITING;
    }

    public String getRequestId() {
        return requestId;
    }

    public RequestStatus getRequestStatus() {
        return requestStatus;
    }

    public void setRequestStatus(RequestStatus status) {
        this.requestStatus = status;
    }

    public String getMappingFileBase64() {
        return mappingFileBase64;
    }

    public void setMappingFileBase64(String mappingFileBase64) {
        this.mappingFileBase64 = mappingFileBase64;
    }

    public String getDataFileBase64() {
        return dataFileBase64;
    }

    public void setDataFileBase64(String dataFileBase64) {
        this.dataFileBase64 = dataFileBase64;
    }

    public String getOntologyFileBase64() {
        return ontologyFileBase64;
    }

    public void setOntologyFileBase64(String ontologyFileBase64) {
        this.ontologyFileBase64 = ontologyFileBase64;
    }

    public String getCsvSeparator() {
        return csvSeparator;
    }

    public void setCsvSeparator(String csvSeparator) {
        this.csvSeparator = csvSeparator;
    }

    public String getCsvEncode() {
        return csvEncode;
    }

    public void setCsvEncode(String csvEncode) {
        this.csvEncode = csvEncode;
    }

}
