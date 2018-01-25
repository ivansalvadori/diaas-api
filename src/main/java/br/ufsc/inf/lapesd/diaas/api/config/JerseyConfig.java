package br.ufsc.inf.lapesd.diaas.api.config;

import java.io.IOException;

import javax.ws.rs.ApplicationPath;

import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.spring.scope.RequestContextFilter;
import org.springframework.stereotype.Component;

@Component
@ApplicationPath("/diaas")
public class JerseyConfig extends ResourceConfig {

    public JerseyConfig() throws IOException {
        this.register(RequestContextFilter.class);
        this.register(MultiPartFeature.class);
        this.packages("br.ufsc.inf.lapesd.diaas.api.endpoint");
        this.register(CorsInterceptor.class);
    }
}