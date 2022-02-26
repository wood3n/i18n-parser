import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./modules/User/user.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "admin",
      database: "postgres",
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
      logger:
        process.env.NODE_ENV === "development" ? "advanced-console" : "file",
    }),
    UserModule,
  ],
})
export class AppModule {}
