package br.ufsc.inf.lapesd.diaas.api.config;

import java.io.IOException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("br.ufsc.inf.lapesd.diaas.api")
public class AppDiaas {

    public static void main(String[] args) throws IOException {
        SpringApplication.run(AppDiaas.class, args);
    }
}
