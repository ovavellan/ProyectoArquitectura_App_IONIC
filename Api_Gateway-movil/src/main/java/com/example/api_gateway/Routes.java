package com.example.api_gateway;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Routes {

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Ruta para un método GET específico de pilotos PostgreSQL
                .route("graficos-get", r -> r.path("/graficos/**")
                        .and()
                        .method("GET")  // Limita la ruta solo a solicitudes GET
                        .filters(f -> f.rewritePath("/graficos/(?<segment>.*)", "/${segment}"))
                        .uri("http://localhost:5000")
                )
                // Ruta para un método GET específico de pilotos PostgreSQL
                .route("pilotos-get", r -> r.path("/pilotos/**")
                        .and()
                        .method("GET")  // Limita la ruta solo a solicitudes GET
                        .filters(f -> f.rewritePath("/pilotos/(?<segment>.*)", "/${segment}"))
                        .uri("http://localhost:8080")
                )
                // Ruta para un método GET específico de aviones PostgreSQL
                .route("aviones-get", r -> r.path("/aviones/**")
                        .and()
                        .method("GET")  // Limita la ruta solo a solicitudes GET
                        .filters(f -> f.rewritePath("/aviones/(?<segment>.*)", "/${segment}"))
                        .uri("http://localhost:8080")
                )
                // Ruta para un método GET específico de mecanicos MySQL
                .route("mecanicos-get", r -> r.path("/mecanicos/**")
                        .and()
                        .method("GET")  // Limita la ruta solo a solicitudes GET
                        .filters(f -> f.rewritePath("/mecanicos/(?<segment>.*)", "/${segment}"))
                        .uri("http://localhost:8095")
                )
                .build();
    }
}
