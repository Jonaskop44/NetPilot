import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { default as expressSession } from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  const PgSession = connectPgSimple(expressSession);
  const pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  app.use(
    expressSession({
      store: new PgSession({
        pool: pgPool,
        tableName: 'Session',
        createTableIfMissing: false,
      }),
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set to true only when using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax',
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger/OpenAPI Setup
  const config = new DocumentBuilder()
    .setTitle('NetPilot API')
    .setDescription('NetPilot API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/api-docs', app, document, {
    jsonDocumentUrl: 'api/v1/api-docs-json',
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
