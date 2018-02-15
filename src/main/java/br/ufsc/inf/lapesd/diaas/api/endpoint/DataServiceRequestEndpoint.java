package br.ufsc.inf.lapesd.diaas.api.endpoint;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.Base64;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.io.FileUtils;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;

import br.ufsc.inf.lapesd.diaas.api.DataServiceRequest;

@Path("dataServiceRequest")
@Component
public class DataServiceRequestEndpoint {
    private final String requestsDirectory = "requests";

    @Value("${config.deployerURL}")
    private String deployerURL;

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewRequest() {
        DataServiceRequest dataServiceRequest = new DataServiceRequest();
        saveDataServiceRequest(dataServiceRequest);
        return Response.ok(dataServiceRequest).build();
    }

    @POST
    @Path("{requestId}/mapping")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response uploadMappingFile(@PathParam("requestId") String requestId, @FormDataParam("mappingFile") InputStream file, @FormDataParam("mappingFile") FormDataContentDisposition fileDisposition) {
        saveFile(requestId, file, "mapping.jsonld");
        return Response.ok().build();
    }

    @POST
    @Path("{requestId}/ontology")
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadOntologyFile(@PathParam("requestId") String requestId, @FormDataParam("ontologyFile") InputStream file, @FormDataParam("ontologyFile") FormDataContentDisposition fileDisposition) {
        saveFile(requestId, file, "ontology.owl");
        return Response.ok().build();
    }

    @POST
    @Path("{requestId}/data")
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadDataFile(@PathParam("requestId") String requestId, @FormDataParam("dataFile") InputStream file, @FormDataParam("dataFile") FormDataContentDisposition fileDisposition) {
        saveFile(requestId, file, "data.csv");
        return Response.ok().build();
    }

    @POST
    @Path("{requestId}/confirm")
    @Produces(MediaType.APPLICATION_JSON)
    public Response confirm(@PathParam("requestId") String requestId) {
        DataServiceRequest request = loadRequestFile(requestId);
        requestDeploy(request);
        return Response.ok().build();
    }

    private void saveDataServiceRequest(DataServiceRequest dataServiceRequest) {
        try {
            File root = new File(this.requestsDirectory);
            if (!root.exists()) {
                root.mkdir();
            }

            File path = new File(this.requestsDirectory + File.separator + dataServiceRequest.getRequestId());
            if (!path.exists()) {
                path.mkdir();
            }

            String json = new Gson().toJson(dataServiceRequest);
            FileWriter writer = new FileWriter(path + File.separator + "metadata.json");
            writer.write(json);
            writer.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void saveFile(String requestId, InputStream file, String filename) {

        String pathToSave = this.requestsDirectory + File.separator + requestId;

        File targetFile = new File(pathToSave + File.separator + filename);

        try {
            FileUtils.copyInputStreamToFile(file, targetFile);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public DataServiceRequest loadRequestFile(String requestId) {
        DataServiceRequest dataServiceRequest = new DataServiceRequest(requestId);

        String pathToRead = this.requestsDirectory + File.separator + requestId;
        File dataFile = new File(pathToRead + File.separator + "data.csv");
        File ontlogyFile = new File(pathToRead + File.separator + "ontology.owl");
        File mappingFile = new File(pathToRead + File.separator + "mapping.jsonld");
        try {
            String data = FileUtils.readFileToString(dataFile, Charset.forName("UTF-8"));
            String dataFileBase64 = Base64.getEncoder().encodeToString(data.getBytes());
            dataServiceRequest.setDataFileBase64(dataFileBase64);

            String ontology = FileUtils.readFileToString(ontlogyFile, Charset.forName("UTF-8"));
            String ontologyFileBase64 = Base64.getEncoder().encodeToString(ontology.getBytes());
            dataServiceRequest.setOntologyFileBase64(ontologyFileBase64);

            String mapping = FileUtils.readFileToString(mappingFile, Charset.forName("UTF-8"));
            String mappingFileBase64 = Base64.getEncoder().encodeToString(mapping.getBytes());
            dataServiceRequest.setMappingFileBase64(mappingFileBase64);

        } catch (IOException e) {
            e.printStackTrace();
        }
        return dataServiceRequest;
    }

    public void requestDeploy(DataServiceRequest dataServiceRequest) {
        Client client = ClientBuilder.newClient();
        WebTarget webTarget = client.target(this.deployerURL + "/dataServiceRequest");
        Invocation.Builder invocationBuilder = webTarget.request(MediaType.APPLICATION_JSON);
        try {
            String request = new Gson().toJson(dataServiceRequest);
            Response response = invocationBuilder.post(Entity.entity(request, MediaType.APPLICATION_JSON));

            int status = response.getStatus();
            if (status == 200) {
                System.out.println("A new data service request has been sent.");
            } else if (status == 404) {
                System.out.println("Error 404.");
            }
        } catch (Exception e) {
            System.out.println("Something went wrong. Details: " + e.getMessage());
        }
    }

}
