package vn.diepgia.mchis.konto_verwaltung;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(
		info = @Info(
				contact = @Contact(
						name = "Minh Chi Diep",
						email = "diepminhchi1617@gmail.com",
						url = "https://minhchi1709.github.io/profile/"
				),
				description = "OpenApi documentation for account management",
				title = "OpenApi specification - Minh Chi Diep",
				version = "1.0",
				termsOfService = "Terms of service"
		),
		servers = {
				@Server(
						description = "Local ENV",
						url = "http://localhost:8088"
				)
		}
)
public class KontoVerwaltungApplication {

	public static void main(String[] args) {
		SpringApplication.run(KontoVerwaltungApplication.class, args);
	}

}
